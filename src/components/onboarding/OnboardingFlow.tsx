"use client";

import { useState } from "react";
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
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OnboardingState>({
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
  });

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
                className="flex-1 py-4 bg-[#F7F4D5] text-[#0A3323] font-semibold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all"
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