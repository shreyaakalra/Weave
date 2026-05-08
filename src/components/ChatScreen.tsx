"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { MatchResponse } from "./onboarding/MatchRevealCard";
import { Send, List, MessageSquare, RefreshCw, Sparkles, ChevronRight, ArrowLeft, X } from "lucide-react";

// --- Supabase Setup ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
};

type BucketItem = {
  emoji: string;
  title: string;
  desc: string;
  difficulty: "Easy" | "Medium" | "Adventure";
};

type Icebreaker = {
  emoji: string;
  prompt: string;
  tag: string;
};

type SideTab = "bucketlist" | "icebreakers";

const difficultyColor: Record<string, string> = {
  Easy:      "bg-[#F7F4D5]/8  text-[#F7F4D5]/45 border-[#F7F4D5]/10",
  Medium:    "bg-[#2a6e4a]/20 text-[#F7F4D5]/50 border-[#2a6e4a]/30",
  Adventure: "bg-[#F7F4D5]/6  text-[#F7F4D5]/40 border-[#F7F4D5]/12",
};

function LoadingSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.4, delay: i * 0.1, repeat: Infinity }}
          className="h-16 rounded-2xl bg-[#F7F4D5]/5"
        />
      ))}
    </div>
  );
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-[#F7F4D5]/20">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        {icon}
      </motion.div>
      <span className="text-xs text-center">{label}</span>
    </div>
  );
}

function SidePanelContent({
  activeTab,
  setActiveTab,
  match,
  myInterests,
  onInjectIcebreaker,
  onClose,
  isMobile,
}: {
  activeTab: SideTab;
  setActiveTab: (t: SideTab) => void;
  match: MatchResponse;
  myInterests: string[];
  onInjectIcebreaker: (q: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const [bucketList, setBucketList]       = useState<BucketItem[]>([]);
  const [icebreakers, setIcebreakers]     = useState<Icebreaker[]>([]);
  const [loadingBucket, setLoadingBucket] = useState(false);
  const [loadingIce, setLoadingIce]       = useState(false);
  const [checkedItems, setCheckedItems]   = useState<Set<number>>(new Set());

  const matchInterests: string[] = Array.isArray(match.attributes?.interests)
    ? (match.attributes.interests as string[])
    : [];

  const fetchBucketList = async () => {
    setLoadingBucket(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bucketlist", interests1: myInterests, interests2: matchInterests }),
      });
      const json = await res.json();
      setBucketList(json.items || []);
    } catch (e) {
      console.error("Bucket error:", e);
    } finally {
      setLoadingBucket(false);
    }
  };

  const fetchIcebreakers = async () => {
    setLoadingIce(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "icebreakers", interests1: myInterests, interests2: matchInterests }),
      });
      const json = await res.json();
      setIcebreakers(json.items || []);
    } catch (e) {
      console.error("Ice error:", e);
    } finally {
      setLoadingIce(false);
    }
  };

  useEffect(() => {
    if (activeTab === "bucketlist" && bucketList.length === 0) fetchBucketList();
    if (activeTab === "icebreakers" && icebreakers.length === 0) fetchIcebreakers();
  }, [activeTab]);

  function toggleCheck(i: number) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div className="flex flex-col h-full bg-[#081f15] overflow-hidden">
      {isMobile && (
        <div className="flex items-center justify-between px-4 pt-6 pb-4 shrink-0 bg-[#081f15]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#F7F4D5]/50 hover:text-[#F7F4D5] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to chat
          </button>
        </div>
      )}

      <div className="flex border-b border-[#F7F4D5]/8 shrink-0">
        {(["bucketlist", "icebreakers"] as SideTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const Icon = tab === "bucketlist" ? List : MessageSquare;
          const label = tab === "bucketlist" ? "Bucket List" : "Icebreakers";
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-semibold tracking-wide uppercase transition-all duration-200 relative ${
                isActive ? "text-[#F7F4D5]" : "text-[#F7F4D5]/30 hover:text-[#F7F4D5]/55"
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
              {label}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#F7F4D5]/50"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "bucketlist" && (
            <motion.div
              key="bucket"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-4 md:p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[#F7F4D5]/30 uppercase tracking-widest font-medium">Shared Goals</p>
                <button
                  onClick={fetchBucketList}
                  disabled={loadingBucket}
                  className="p-1.5 rounded-lg hover:bg-[#F7F4D5]/6 text-[#F7F4D5]/30 hover:text-[#F7F4D5]/60 transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingBucket ? "animate-spin" : ""}`} />
                </button>
              </div>

              {loadingBucket ? (
                <LoadingSkeleton rows={5} />
              ) : bucketList.length === 0 ? (
                <EmptyState icon={<List className="w-6 h-6" />} label="Generating your bucket list…" />
              ) : (
                bucketList.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    onClick={() => toggleCheck(i)}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      checkedItems.has(i)
                        ? "bg-[#F7F4D5]/6 border-[#F7F4D5]/15 opacity-60"
                        : "bg-[#0c2318] border-[#F7F4D5]/8 hover:border-[#F7F4D5]/18 active:scale-[0.98]"
                    }`}
                  >
                    <span className="text-2xl mt-0.5 shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold leading-snug mb-1 transition-all ${
                        checkedItems.has(i) ? "line-through text-[#F7F4D5]/30" : "text-[#F7F4D5]/80"
                      }`}>
                        {item.title}
                      </div>
                      <div className="text-xs text-[#F7F4D5]/40 leading-snug">{item.desc}</div>
                      <span className={`inline-block mt-2 text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-medium ${
                        difficultyColor[item.difficulty] || difficultyColor.Easy
                      }`}>
                        {item.difficulty}
                      </span>
                    </div>
                    {checkedItems.has(i) && (
                      <div className="w-5 h-5 rounded-full bg-[#F7F4D5]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#F7F4D5]/60" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}

              {checkedItems.size > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-[#F7F4D5]/30 pt-2"
                >
                  {checkedItems.size} done · {bucketList.length - checkedItems.size} to go ✦
                </motion.p>
              )}
            </motion.div>
          )}

          {activeTab === "icebreakers" && (
            <motion.div
              key="ice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-4 md:p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[#F7F4D5]/30 uppercase tracking-widest font-medium">Tap to ask</p>
                <button
                  onClick={fetchIcebreakers}
                  disabled={loadingIce}
                  className="p-1.5 rounded-lg hover:bg-[#F7F4D5]/6 text-[#F7F4D5]/30 hover:text-[#F7F4D5]/60 transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingIce ? "animate-spin" : ""}`} />
                </button>
              </div>

              {loadingIce ? (
                <LoadingSkeleton rows={6} />
              ) : icebreakers.length === 0 ? (
                <EmptyState icon={<MessageSquare className="w-6 h-6" />} label="Crafting icebreakers…" />
              ) : (
                icebreakers.map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.07 }}
                    onClick={() => {
                      onInjectIcebreaker(item.prompt);
                      if (isMobile && onClose) onClose();
                    }}
                    className="flex items-start gap-3 p-4 rounded-2xl border bg-[#0c2318] border-[#F7F4D5]/8 hover:border-[#F7F4D5]/20 hover:bg-[#0f2e1e] text-left group transition-all duration-200 w-full active:scale-[0.98]"
                  >
                    <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-[#F7F4D5]/70 group-hover:text-[#F7F4D5] leading-snug transition-colors block">
                        {item.prompt}
                      </span>
                      {item.tag && (
                        <span className="inline-block mt-2 text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#F7F4D5]/6 border border-[#F7F4D5]/10 text-[#F7F4D5]/40">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#F7F4D5]/15 group-hover:text-[#F7F4D5]/50 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </motion.button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ChatScreen({
  match,
  onClose,
  chatId = "test-room-1", // Using a default room for hackathon testing
}: {
  match: MatchResponse;
  onClose: () => void;
  chatId?: string;
}) {
  const { user } = useUser();
  const nickname = match.attributes?.nickname || "Your Match";

  // --- Real-time Chat State ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Timer & Decision State ---
  const TIME_LIMIT = 600; // Change to 10 if you want to test the modal quickly
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const showDecisionModal = timeLeft <= 0; // The clean ESLint fix!
  const [hasDecided, setHasDecided] = useState<"keep" | "new" | null>(null);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState<SideTab>("icebreakers");
  const [showPanel, setShowPanel] = useState(true); 
  const [mobileView, setMobileView] = useState<"chat" | "panel">("chat");

  const myInterests: string[] = Array.isArray(user?.unsafeMetadata?.interests)
    ? (user.unsafeMetadata.interests as string[])
    : [];

  // --- 1. Supabase Data Fetching & Realtime Listener ---
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(
          data.map((m) => ({
            id: m.id,
            senderId: m.sender_id,
            text: m.text,
            timestamp: new Date(m.created_at),
          }))
        );
      }
    };
    fetchMessages();

    const channel = supabase
      .channel("realtime-chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
        (payload) => {
          const newMsg = payload.new;
          if (newMsg.sender_id !== user?.id) {
            setMessages((prev) => [
              ...prev,
              {
                id: newMsg.id,
                senderId: newMsg.sender_id,
                text: newMsg.text,
                timestamp: new Date(newMsg.created_at),
              },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user?.id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 2. Clean Timer Logic ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0; // Hit zero, modal will trigger based on derived state
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- 3. Handle Send ---
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const textToSend = inputText;
    const tempId = Date.now().toString();

    // Optimistic Update
    setMessages((prev) => [
      ...prev,
      { id: tempId, senderId: user.id, text: textToSend, timestamp: new Date() },
    ]);
    setInputText("");

    // Write to Supabase
    await supabase.from("messages").insert({
      chat_id: chatId,
      sender_id: user.id,
      text: textToSend,
    });
  };

  const handleDecision = (decision: "keep" | "new") => {
    setHasDecided(decision);
    if (decision === "new") {
      onClose();
    }
  };

  const openPanel = (tab: SideTab) => {
    setActiveTab(tab);
    setMobileView("panel");
  };

  const closePanel = () => {
    setMobileView("chat");
  };

  const sharedPanelProps = {
    activeTab,
    setActiveTab,
    match,
    myInterests,
    onInjectIcebreaker: (q: string) => setInputText(q),
  };

  const ChatColumn = (
    <div className="flex flex-col w-full h-full bg-[#0A3323]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#08261a] border-b border-[#F7F4D5]/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F7F4D5]/10 border border-[#F7F4D5]/20 flex items-center justify-center shrink-0">
            <span className="text-sm md:text-lg font-black text-[#F7F4D5]">{nickname.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="text-base md:text-lg font-bold text-[#F7F4D5]">{nickname}</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400/80 inline-block" />
              <span className="text-[10px] md:text-xs text-[#F7F4D5]/50 uppercase tracking-widest font-medium">Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => openPanel("bucketlist")}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-[#F7F4D5]/15 text-[#F7F4D5]/50 hover:text-[#F7F4D5] hover:bg-[#F7F4D5]/10 transition-all"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => openPanel("icebreakers")}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-[#F7F4D5]/15 text-[#F7F4D5]/50 hover:text-[#F7F4D5] hover:bg-[#F7F4D5]/10 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Desktop: AI toggle button */}
          <button
            onClick={() => setShowPanel((p) => !p)}
            className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              showPanel
                ? "bg-[#F7F4D5]/10 border-[#F7F4D5]/20 text-[#F7F4D5]"
                : "border-[#F7F4D5]/15 text-[#F7F4D5]/50 hover:text-[#F7F4D5]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Wingman
          </button>

          {/* Close Chat entirely */}
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0d3d29] border border-[#1a5c38] text-[#F7F4D5]/50 hover:text-[#F7F4D5] hover:bg-[#1a5c38] transition-all ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-4">
          {messages.length === 0 && (
             <div className="text-center text-[#F7F4D5]/40 text-sm mt-10">
               Timer is ticking. Say hi!
             </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-3xl text-base leading-relaxed ${
                  isMe
                    ? "bg-[#F7F4D5] text-[#0A3323] font-medium rounded-br-sm"
                    : "bg-[#1a4d30] text-[#F7F4D5]/90 rounded-bl-sm border border-[#F7F4D5]/10"
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} className="pb-4" />
        </div>
      </div>

      {/* Input */}
      <div className="bg-[#08261a] border-t border-[#F7F4D5]/10 p-4 md:p-6 flex justify-center shrink-0">
        <form
          onSubmit={handleSend}
          className="flex gap-3 w-full max-w-4xl"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 bg-[#0c2e20] text-[#F7F4D5] border border-[#F7F4D5]/15 rounded-full px-6 py-4 focus:outline-none focus:border-[#F7F4D5]/40 transition-colors placeholder:text-[#F7F4D5]/30 shadow-inner text-base"
          />
          <motion.button
            type="submit"
            disabled={!inputText.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#F7F4D5] text-[#0A3323] w-14 h-14 rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity shrink-0 shadow-lg"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </motion.button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex flex-col w-full h-[100dvh] bg-[#0A3323] overflow-hidden font-sans text-[#F7F4D5]">
      
      {/* ── TIMER BAR ── */}
      <div className="w-full h-1.5 bg-[#08261a] shrink-0">
        <motion.div 
          className="h-full bg-[#F7F4D5]/80"
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
          transition={{ ease: "linear", duration: 1 }}
        />
      </div>

      {/* ── CINEMATIC POPUP ── */}
      <AnimatePresence>
        {showDecisionModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-[#0A3323]/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#08261a] border border-[#F7F4D5]/20 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-2 text-[#F7F4D5]">Time&apos;s up.</h2>
              <p className="text-[#F7F4D5]/60 mb-8 text-sm leading-relaxed">
                You&apos;ve been chatting for 10 minutes. Do you want to unlock profiles and keep talking, or find someone new?
              </p>

              {hasDecided ? (
                <div className="p-4 rounded-xl bg-[#F7F4D5]/10 text-[#F7F4D5]">
                  Waiting for {nickname} to decide...
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleDecision("keep")}
                    className="w-full py-4 bg-[#F7F4D5] text-[#0A3323] font-bold rounded-xl hover:scale-[1.02] transition-transform"
                  >
                    Keep Talking
                  </button>
                  <button 
                    onClick={() => handleDecision("new")}
                    className="w-full py-4 border border-[#F7F4D5]/20 text-[#F7F4D5]/70 font-medium rounded-xl hover:bg-[#F7F4D5]/10 transition-colors"
                  >
                    Find Someone New
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex w-full min-h-0 relative">
        {/* ── MOBILE layout: full-screen, swaps between chat and panel ── */}
        <div className="flex md:hidden w-full h-full">
          <AnimatePresence mode="wait">
            {mobileView === "chat" ? (
              <motion.div
                key="mobile-chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                {ChatColumn}
              </motion.div>
            ) : (
              <motion.div
                key="mobile-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full bg-[#081f15]"
              >
                <SidePanelContent
                  {...sharedPanelProps}
                  onClose={closePanel}
                  isMobile
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── DESKTOP layout: side-by-side ── */}
        <div className="hidden md:flex w-full h-full">
          {/* Chat */}
          <div className="flex-1 min-w-0 h-full">
            {ChatColumn}
          </div>

          {/* Side panel */}
          <AnimatePresence>
            {showPanel && (
              <motion.div
                key="desktop-panel"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 380 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 h-full border-l border-[#F7F4D5]/10 bg-[#081f15] overflow-hidden"
              >
                <div className="w-[380px] h-full">
                  <SidePanelContent {...sharedPanelProps} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}