import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-[#0A3323]/80 backdrop-blur-2xl border-b border-[#F7F4D5]/10">
      <div className="font-serif text-3xl font-black tracking-tighter text-[#F7F4D5]">
        Weave.
      </div>

      <ul className="hidden md:flex items-center gap-10 text-[#F7F4D5]/70 text-xl font-medium">
        <li className="hover:text-[#F7F4D5] transition-colors cursor-pointer">How it works</li>
        <li className="hover:text-[#F7F4D5] transition-colors cursor-pointer">Features</li>
        <li className="hover:text-[#F7F4D5] transition-colors cursor-pointer">Stories</li>
      </ul>

      <Link href={"/sign-in"}>
        <Button
          size="lg"
          className="bg-[#F7F4D5] text-[#0A3323] hover:bg-[#F7F4D5]/90 font-semibold rounded-3xl px-8"
        >
          Sign In
        </Button>
      </Link>
      
    </nav>
  );
}