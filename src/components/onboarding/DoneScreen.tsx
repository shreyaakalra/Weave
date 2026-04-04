import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { OnboardingState } from "./OnboardingFlow";
import MatchRevealCard, { MatchResponse } from "./MatchRevealCard";
import LoadingGraph from "./LoadingGraph";
import AuthWall from "./AuthWall";

type Screen = "idle" | "auth" | "loading" | "done";

export default function DoneScreen({ state }: { state: OnboardingState }) {
  const [screen, setScreen] = useState<Screen>("idle");
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);
  const hasFetched = useRef(false);
  const { isSignedIn, user, isLoaded } = useUser();

  const handleFindMatch = useCallback(
    async (clerkId: string) => {
      setScreen("loading");
      try {
        const [res] = await Promise.all([
          fetch("/api/match", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...state, clerkId }),
          }),
          new Promise((resolve) => setTimeout(resolve, 5000)),
        ]);
        const data = await res.json();
        if (data.success && data.match?.length > 0) {
          setMatchResult(data.match[0]);
          setScreen("done");
        } else {
          alert("No match found yet. Make sure you have other users in your database!");
          setScreen("idle");
        }
      } catch (err) {
        console.error("Match failed:", err);
        alert("API Error — check your terminal.");
        setScreen("idle");
      }
    },
    [state]
  );

  // After Clerk signup completes, user becomes signed in — schedule fetch outside render
  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      user &&
      screen === "auth" &&
      !hasFetched.current
    ) {
      hasFetched.current = true;
      // setTimeout prevents calling setState synchronously inside an effect
      const timer = setTimeout(() => handleFindMatch(user.id), 0);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, user, screen, handleFindMatch]);

  const onClickFindMatch = () => {
    if (!isLoaded || hasFetched.current) return;
    if (isSignedIn && user) {
      hasFetched.current = true;
      handleFindMatch(user.id);
    } else {
      setScreen("auth");
    }
  };

  if (screen === "done" && matchResult) {
    return (
      <MatchRevealCard
        matchResult={matchResult}
        onPass={() => {
          setMatchResult(null);
          setScreen("idle");
          hasFetched.current = false;
        }}
      />
    );
  }

  if (screen === "loading") return <LoadingGraph />;
  if (screen === "auth") return <AuthWall />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center py-8"
    >
      <div className="text-5xl font-black mb-4 text-[#F7F4D5] leading-tight">
        You&apos;re in,
        <br />
        <span className="text-[#F7F4D5]/60">
          {state.nickname || state.name || "friend"}.
        </span>
      </div>
      <p className="text-[#F7F4D5]/55 mb-3 text-base leading-relaxed">
        Your profile is built.
        <br />
        Now let the graph find your person.
      </p>
      <p className="text-xs text-[#F7F4D5]/25 mb-12 uppercase tracking-widest">
        Powered by TigerGraph &mdash; traversing{" "}
        {(800 + (state.interests?.length || 0) * 47).toLocaleString()} interest
        nodes
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onClickFindMatch}
        className="px-14 py-5 bg-[#F7F4D5] text-[#0A3323] font-bold rounded-full text-lg tracking-wide"
      >
        Find my match →
      </motion.button>
    </motion.div>
  );
}