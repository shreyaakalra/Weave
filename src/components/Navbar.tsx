"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Show, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-[#0A3323]/80 backdrop-blur-2xl border-b border-[#F7F4D5]/10">
      {/* Logo */}
      <Link
        href="/"
        className="font-serif text-3xl font-black tracking-tighter text-[#F7F4D5] hover:text-[#F7F4D5]/90 transition-colors"
      >
        Weave.
      </Link>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex items-center gap-10 text-[#F7F4D5]/70 text-xl font-medium">
        <li>
          <Link href="/how-it-works" className="hover:text-[#F7F4D5] transition-colors">
            How it works
          </Link>
        </li>
        <li>
          <Link href="/features" className="hover:text-[#F7F4D5] transition-colors">
            Features
          </Link>
        </li>
        <li>
          <Link href="/stories" className="hover:text-[#F7F4D5] transition-colors">
            Stories
          </Link>
        </li>
      </ul>

      {/* Auth Section */}
      <div>
        {/* Shows ONLY when the user is NOT logged in */}
        <Show when="signed-out" fallback={null}>
          <Link href="/sign-in">
            <Button
              size="lg"
              className="bg-[#F7F4D5] text-[#0A3323] hover:bg-[#F7F4D5]/90 font-semibold rounded-3xl px-8"
            >
              Sign In
            </Button>
          </Link>
        </Show>

        {/* Shows ONLY when the user IS logged in */}
        <Show when="signed-in" fallback={null}>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "w-10 h-10 border-2 border-[#F7F4D5]/20 hover:border-[#F7F4D5]/50 transition-colors",
                userButtonPopoverCard:
                  "bg-[#0D3B22] border border-[#F7F4D5]/10 shadow-2xl",
                userButtonPopoverActionButtonText: "text-[#F7F4D5]",
                userButtonPopoverActionButtonIcon: "text-[#F7F4D5]",
                userButtonPopoverFooter: "hidden",
              },
            }}
          />
        </Show>
      </div>
    </nav>
  );
}