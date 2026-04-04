"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepBasics from "./StepBasics";
import StepInterests from "./StepInterests";
import StepEnergy from "./StepEnergy";
import StepMood from "./StepMood";
import StepDepth from "./StepDepth";
import StepSchedule from "./StepSchedule";
import StepThisOrThat from "./StepThisOrThat";
import StepGenre from "./StepGenre";
import StepFriendship from "./StepFriendship";
import StepBio from "./StepBio";
import DoneScreen from "./DoneScreen";

export type OnboardingState = {
  name: string;
  nickname: string;
  city: string;
  interests: string[];
  energy: string;
  mood: string;
  depth: string;
  schedule: string;
  totAnswers: Record<number, "a" | "b">;
  genre: string;
  friendship: string;
  bio: string;
  comfort: string;
  neverdothis: string;
  happything: string;
};

const TOTAL_STEPS = 10;

const defaultState: OnboardingState = {
  name: "",
  nickname: "",
  city: "",
  interests: [],
  energy: "",
  mood: "",
  depth: "",
  schedule: "",
  totAnswers: {},
  genre: "",
  friendship: "",
  bio: "",
  comfort: "",
  neverdothis: "",
  happything: "",
};

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function OnboardingFlow() {
  const [isMounted, setIsMounted] = useState(false);

  // Lazy initializers read localStorage once on first render — no effect needed
  const [state, setState] = useState<OnboardingState>(() =>
    loadFromStorage<OnboardingState>("weaveState", defaultState)
  );
  const [step, setStep] = useState<number>(() =>
    loadFromStorage<number>("weaveStep", 0)
  );

  // Hydration lock
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Persist whenever state or step changes (only after mount)
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("weaveState", JSON.stringify(state));
      localStorage.setItem("weaveStep", step.toString());
    } catch {
      // Ignore storage errors
    }
  }, [state, step, isMounted]);

  if (!isMounted) return null;

  const isDoneScreen = step >= TOTAL_STEPS;
  const progress = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else setStep(TOTAL_STEPS);
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const update = (newState: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 0:
        return (
          state.name.trim() !== "" &&
          state.nickname.trim() !== "" &&
          state.city.trim() !== ""
        );
      case 1:
        return state.interests.length > 0;
      case 2:
        return state.energy !== "";
      case 3:
        return state.mood !== "";
      case 4:
        return state.depth !== "";
      case 5:
        return state.schedule !== "";
      case 6:
        return Object.keys(state.totAnswers).length === 5;
      case 7:
        return state.genre !== "";
      case 8:
        return state.friendship !== "";
      case 9:
        return state.bio.trim().length >= 10;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:  return <StepBasics state={state} update={update} />;
      case 1:  return <StepInterests state={state} update={update} />;
      case 2:  return <StepEnergy state={state} update={update} />;
      case 3:  return <StepMood state={state} update={update} />;
      case 4:  return <StepDepth state={state} update={update} />;
      case 5:  return <StepSchedule state={state} update={update} />;
      case 6:  return <StepThisOrThat state={state} update={update} />;
      case 7:  return <StepGenre state={state} update={update} />;
      case 8:  return <StepFriendship state={state} update={update} />;
      case 9:  return <StepBio state={state} update={update} />;
      case 10: return <DoneScreen state={state} />;
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A3323] text-[#F7F4D5] font-sans overflow-hidden px-6 py-8 md:px-12">
      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Top bar — always show wordmark, hide counter on done screen */}
        <div className="flex items-center justify-between mb-8">
          <div className="font-serif text-xl font-black tracking-tighter">
            Weave.
          </div>
          {!isDoneScreen && (
            <div className="text-xs tracking-widest text-[#F7F4D5]/50 font-medium">
              {step + 1} of {TOTAL_STEPS}
            </div>
          )}
        </div>

        {/* Progress bar — only visible during question steps */}
        {!isDoneScreen && (
          <div className="h-px bg-[#F7F4D5]/10 mb-10 relative">
            <motion.div
              className="absolute left-0 top-0 h-px bg-[#F7F4D5]"
              initial={{ width: "10%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation — hidden on done screen */}
        {!isDoneScreen && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-3 w-full max-w-[420px]">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="flex-1 py-4 border border-[#F7F4D5]/30 text-[#F7F4D5]/70 rounded-2xl hover:border-[#F7F4D5]/60 transition-colors"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={next}
                disabled={!isStepValid()}
                className={`flex-1 py-4 font-semibold rounded-2xl transition-all ${
                  !isStepValid()
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed opacity-50"
                    : "bg-[#F7F4D5] text-[#0A3323] hover:scale-[1.02] active:scale-95"
                }`}
              >
                {step === 9 ? "Find my match →" : "Continue →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}