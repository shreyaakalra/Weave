"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function VisualCanvas() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      {/* Custom Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-3 h-3 bg-weave-100 rounded-full z-[9999] pointer-events-none"
        animate={{ x: mousePos.x - 6, y: mousePos.y - 6 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
      
      {/* Background Grid & Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(247,244,213,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(247,244,213,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-green-800/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-900/20 blur-[100px] rounded-full" />
      </div>
    </>
  );
}