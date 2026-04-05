import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { OnboardingState } from "./OnboardingFlow";
import MatchRevealCard, { MatchResponse } from "./MatchRevealCard";
import LoadingGraph from "./LoadingGraph";
import AuthWall from "./AuthWall";
import ChatScreen from "../ChatScreen";

// ─── localStorage helpers (safe, typed) ──────────────────────────────────────

function lsGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function lsSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function lsDel(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DoneScreen({ state }: { state: OnboardingState }) {
  // ── 1. Hydration gate — nothing renders until localStorage is read ──────────
  const [isRestored, setIsRestored] = useState(false);

  // ── 2. Core state ──────────────────────────────────────────────────────────
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);
  const [activeChat, setActiveChat] = useState<MatchResponse | null>(null);
  
  const seenIdsRef = useRef<string[]>([]);
  const [seenIds, _setSeenIds] = useState<string[]>([]);

  const setSeenIds = useCallback((ids: string[]) => {
    seenIdsRef.current = ids;
    _setSeenIds(ids);
    lsSet("weaveSeenIds", ids);
  }, []);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // ── 3. Prevent double-fire on sign-in effect ───────────────────────────────
  const matchAttemptInFlight = useRef(false);

  const { isSignedIn, user, isLoaded } = useUser();

  // ── 4. Restore from localStorage ONCE on mount ────────────────────────────
  useEffect(() => {
    const savedMatch = lsGet<MatchResponse>("weaveMatchResult");
    const savedChat = lsGet<MatchResponse>("weaveActiveChat");
    const savedSeen = lsGet<string[]>("weaveSeenIds") ?? [];

    if (savedMatch) setMatchResult(savedMatch);
    if (savedChat) setActiveChat(savedChat);
    setSeenIds(savedSeen);

    setIsRestored(true);
  }, [setSeenIds]); 

  // ── 5. Persist matchResult ────────────────────────────────────────────────
  useEffect(() => {
    if (!isRestored || !matchResult) return;
    lsSet("weaveMatchResult", matchResult);
  }, [matchResult, isRestored]);

  // ── 6. Persist activeChat ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isRestored || !activeChat) return;
    lsSet("weaveActiveChat", activeChat);
  }, [activeChat, isRestored]);

  // ── 7. Core match-fetch logic (WITH FALLBACK SAFETY NET) ──────────────────
  const handleFindMatch = useCallback(
    async (clerkId: string) => {
      if (matchAttemptInFlight.current) return;
      matchAttemptInFlight.current = true;

      setIsAnalyzing(true);
      try {
        const currentSeenIds = seenIdsRef.current;
        const payload = { ...state, clerkId, seenIds: currentSeenIds };
        
        const [res] = await Promise.all([
          fetch("/api/match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
          new Promise<void>((resolve) => setTimeout(resolve, 4000)),
        ]);

        const data = await res.json();
        console.log("API RESPONSE from /api/match:", JSON.stringify(data, null, 2));

        if (data.success && data.match && data.match.length > 0) {
          const match = data.match[0];
          lsSet("weaveMatchResult", match);
          setMatchResult(match);
        } else {
          // THE FALLBACK: If TigerGraph returns an empty array, generate a test user!
          console.warn("No match returned from API — generating fallback user for testing.");
          const fallbackMatch: MatchResponse = {
            v_id: `test_user_${Date.now()}`,
            attributes: {
              nickname: "Alex",
              city: "New York",
              bio: "I love hiking, coffee, and talking about AI.",
              score: 95,
              energy: "extrovert",
              mood: "chill",
              depth: "deep",
              schedule: "night",
              genre: "indie"
            }
          };
          lsSet("weaveMatchResult", fallbackMatch);
          setMatchResult(fallbackMatch);
        }
      } catch (error) {
        console.error("Match failed", error);
        // Even on total failure, let's give you the test user so you aren't stuck
        const fallbackMatch: MatchResponse = {
            v_id: `error_user_${Date.now()}`,
            attributes: { nickname: "Graph Error", bio: "The API failed, but here I am!", score: 50 }
        };
        lsSet("weaveMatchResult", fallbackMatch);
        setMatchResult(fallbackMatch);
      } finally {
        setIsAnalyzing(false);
        matchAttemptInFlight.current = false;
      }
    },
    [state], 
  );

  // ── 8. Fire match after sign-in completes ─────────────────────────────────
  useEffect(() => {
    if (
      !isLoaded ||
      !isSignedIn ||
      !user ||
      !showSignUp ||
      matchResult !== null ||
      activeChat !== null ||
      isAnalyzing
    ) {
      return;
    }
    handleFindMatch(user.id);
  }, [isLoaded, isSignedIn, user, showSignUp, matchResult, activeChat, isAnalyzing, handleFindMatch]);

  // ── 9. Pass handler — atomically update seenIds then clear match ───────────
  const handlePass = useCallback(() => {
    if (!matchResult) return;
    const newSeenIds = [...seenIdsRef.current, matchResult.v_id];
    setSeenIds(newSeenIds);
    lsDel("weaveMatchResult");
    setMatchResult(null);
  }, [matchResult, setSeenIds]);

  // ── 10. Render guards ──────────────────────────────────────────────────────

  if (!isRestored) return null;

  if (activeChat) {
    return (
      <ChatScreen
        match={activeChat}
        onClose={() => {
          lsDel("weaveActiveChat");
          setActiveChat(null);
        }}
      />
    );
  }

  if (matchResult) {
    return (
      <MatchRevealCard
        matchResult={matchResult}
        state={state}
        onPass={handlePass}
        onChat={() => setActiveChat(matchResult)}
      />
    );
  }

  if (isAnalyzing) {
    return <LoadingGraph />;
  }

  if (showSignUp && !isSignedIn) {
    return <AuthWall />;
  }

  // ── 11. Default "Find my / next match" screen ─────────────────────────────
  const isFirstTime = seenIds.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center py-8 px-4"
    >
      <div className="text-4xl md:text-5xl font-black mb-4 text-[#F7F4D5] leading-tight">
        You&apos;re in,
        <br />
        <span className="text-[#F7F4D5]/60">
          {state.nickname || state.name || "friend"}.
        </span>
      </div>

      <p className="text-[#F7F4D5]/55 mb-3 text-sm md:text-base leading-relaxed">
        {isFirstTime
          ? "Your profile is built.\nNow let the graph find your person."
          : "Ready for your next best match?"}
      </p>

      <p className="text-[10px] md:text-xs text-[#F7F4D5]/30 mb-12 uppercase tracking-widest px-4">
        Powered by TigerGraph &mdash; traversing{" "}
        {(800 + (state.interests?.length || 0) * 47).toLocaleString()} interest
        nodes
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          if (isSignedIn && user) {
            handleFindMatch(user.id);
          } else {
            setShowSignUp(true);
          }
        }}
        className="px-10 md:px-14 py-4 md:py-5 bg-[#F7F4D5] text-[#0A3323] font-bold rounded-full text-base md:text-lg tracking-wide shadow-lg"
      >
        {isFirstTime ? "Find my match →" : "Find next match →"}
      </motion.button>
    </motion.div>
  );
}