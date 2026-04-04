import { motion } from "framer-motion";
import { SignUp } from "@clerk/nextjs";

export default function AuthWall() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center py-8"
    >
      <div className="text-xs tracking-[.2em] text-[#F7F4D5]/40 uppercase mb-3">
        Last step
      </div>
      <h2 className="text-4xl font-black mb-3 text-[#F7F4D5]">
        Save your profile.
      </h2>
      <p className="text-[#F7F4D5]/60 mb-8 max-w-xs text-sm leading-relaxed">
        Create a quick account to save your Weave profile and see who you
        matched with.
      </p>
      <div className="rounded-2xl overflow-hidden shadow-2xl">
        <SignUp routing="hash" forceRedirectUrl="/onboarding" />
      </div>
    </motion.div>
  );
}