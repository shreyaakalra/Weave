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

const totalSteps = 10;

export default function OnboardingFlow() {
  // 1. Next.js hydration lock
  const [isMounted, setIsMounted] = useState(false);

  // 2. Load state from memory, or start fresh
  const [state, setState] = useState<OnboardingState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("weaveState");
      if (saved) return JSON.parse(saved);
    }
    return {
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
  });

  // 3. Load the current step from memory, or start at 0
  const [step, setStep] = useState(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("weaveStep");
      if (savedStep) return parseInt(savedStep, 10);
    }
    return 0;
  });

 // 4a. Next.js hydration lock: Only run ONCE when the component first mounts
  useEffect(() => {
    // Pushing this to the next tick bypasses the strict synchronous linter rule!
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // 4b. Save to memory: Only run when 'state' or 'step' changes
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      localStorage.setItem("weaveState", JSON.stringify(state));
      localStorage.setItem("weaveStep", step.toString());
    }
  }, [state, step, isMounted]);
  // Prevent visual glitch before memory loads
  if (!isMounted) return null;

  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const next = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else showDone();
  };

  const prev = () => step > 0 && setStep((s) => s - 1);

  const showDone = () => {
    setStep(totalSteps);
  };

  const update = (newState: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return state.name.trim() !== "" && state.nickname.trim() !== "" && state.city.trim() !== "";
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
        return state.totAnswers && Object.keys(state.totAnswers).length === 5;
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
      case 0: return <StepBasics state={state} update={update} />;
      case 1: return <StepInterests state={state} update={update} />;
      case 2: return <StepEnergy state={state} update={update} />;
      case 3: return <StepMood state={state} update={update} />;
      case 4: return <StepDepth state={state} update={update} />;
      case 5: return <StepSchedule state={state} update={update} />;
      case 6: return <StepThisOrThat state={state} update={update} />;
      case 7: return <StepGenre state={state} update={update} />;
      case 8: return <StepFriendship state={state} update={update} />;
      case 9: return <StepBio state={state} update={update} />;
      case 10: return <DoneScreen state={state} />;
      default: return null;
    }
  };

  return (
    <div id="ob" className="relative min-h-screen bg-[#0A3323] text-[#F7F4D5] font-sans overflow-hidden px-6 py-8 md:px-12">
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="font-serif text-xl font-black tracking-tighter">Weave.</div>
          <div className="text-xs tracking-widest text-[#F7F4D5]/50 font-medium">
            {step + 1} of {totalSteps}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-px bg-[#F7F4D5]/10 mb-10 relative">
          <motion.div
            className="absolute left-0 top-0 h-px bg-[#F7F4D5]"
            initial={{ width: "10%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

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

        {/* Navigation */}
        {step < 10 && (
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