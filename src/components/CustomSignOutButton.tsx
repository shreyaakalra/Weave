"use client";

import { useClerk } from "@clerk/nextjs";

export default function CustomSignOutButton() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
  localStorage.removeItem("weaveMatchResult");
  localStorage.removeItem("weaveActiveChat");
  localStorage.removeItem("weaveSeenIds");

  // ADD THESE TOO:
  localStorage.removeItem("weaveStep");
  localStorage.removeItem("weaveState");

  await signOut(() => {
    window.location.href = "/sign-in";
  });
};

  return (
    <button 
      onClick={handleSignOut}
      className="text-sm text-[#F7F4D5]/60 hover:text-[#F7F4D5] transition-colors"
    >
      Sign Out
    </button>
  );
}