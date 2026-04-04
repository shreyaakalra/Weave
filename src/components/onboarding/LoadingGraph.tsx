import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const MESSAGES = [
  "Scanning interest nodes...",
  "Running Jaccard similarity...",
  "Traversing 2-hop paths...",
  "Scoring compatibility...",
  "Weighting your passions...",
  "Almost there...",
];

export default function LoadingGraph() {
  const [loadingText, setLoadingText] = useState(MESSAGES[0]);
  const [loadingPct, setLoadingPct] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Non-null assertion: we know 2d context is supported
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const W = 220;
    const H = 220;

    const positions: [number, number][] = [
      [110, 110], [110, 38], [172, 74], [192, 148], [148, 196],
      [72, 204], [28, 158], [18, 84], [62, 38], [148, 68],
      [178, 132], [68, 172],
    ];

    const nodes = positions.map((p, i) => ({
      x: p[0],
      y: p[1],
      r: i === 0 ? 9 : 3.5 + Math.random() * 2.5,
      pulse: Math.random() * Math.PI * 2,
      lit: 0,
    }));

    const edgePairs = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
      [1, 9], [2, 10], [5, 11], [3, 10], [7, 8], [9, 2], [11, 4], [6, 11], [1, 2],
    ];

    const edges = edgePairs.map((p) => ({
      a: p[0],
      b: p[1],
      active: false,
      lit: 0,
    }));

    type Particle = {
      x: number;
      y: number;
      tx: number;
      ty: number;
      t: number;
      speed: number;
    };

    let particles: Particle[] = [];
    let tick = 0;

    const activateInterval = setInterval(() => {
      const inactive = edges.filter((e) => !e.active);
      if (inactive.length > 0) {
        const e = inactive[Math.floor(Math.random() * inactive.length)];
        e.active = true;
      }
    }, 280);

    function spawnParticle(edgeIdx: number) {
      const e = edges[edgeIdx];
      const na = nodes[e.a];
      const nb = nodes[e.b];
      particles.push({
        x: na.x,
        y: na.y,
        tx: nb.x,
        ty: nb.y,
        t: 0,
        speed: 0.016 + Math.random() * 0.012,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      tick++;

      if (tick % 18 === 0) {
        edges.forEach((e, i) => {
          if (e.active && Math.random() > 0.4) spawnParticle(i);
        });
      }

      particles = particles.filter((p) => {
        p.t = Math.min(p.t + p.speed, 1);
        p.x += (p.tx - p.x) * p.speed * 1.8;
        p.y += (p.ty - p.y) * p.speed * 1.8;
        return p.t < 1;
      });

      edges.forEach((e) => {
        if (!e.active) return;
        e.lit = Math.min(e.lit + 0.04, 1);
        const na = nodes[e.a];
        const nb = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(247,244,213,${0.08 + e.lit * 0.12})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      particles.forEach((p) => {
        const alpha = Math.sin(p.t * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247,244,213,${alpha * 0.9})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247,244,213,${alpha * 0.15})`;
        ctx.fill();
      });

      nodes.forEach((n, i) => {
        n.pulse += 0.03;
        const isCenter = i === 0;
        const hasActiveEdge = edges.some(
          (e) => (e.a === i || e.b === i) && e.active
        );
        if (hasActiveEdge) n.lit = Math.min(n.lit + 0.05, 1);

        const baseAlpha = isCenter ? 1 : 0.2 + n.lit * 0.8;
        const pulseR =
          n.r + (isCenter ? Math.sin(n.pulse) * 2 : Math.sin(n.pulse) * 1);

        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseR + 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247,244,213,${baseAlpha * 0.08})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = isCenter
          ? `rgba(247,244,213,${0.7 + Math.sin(n.pulse) * 0.3})`
          : `rgba(247,244,213,${baseAlpha * 0.75})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      clearInterval(activateInterval);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Cycle loading text — progress reaches exactly 100% on the last message
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < MESSAGES.length) {
        setLoadingText(MESSAGES[i]);
        setLoadingPct(
          i === MESSAGES.length - 1
            ? 100
            : Math.round((i / MESSAGES.length) * 100)
        );
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    // THE FIX: Full-bleed takeover layout with a subtle radial glow
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center w-full h-[100dvh] bg-[#0A3323] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d3d29] to-[#0A3323] overflow-hidden px-6"
    >
      <canvas
        ref={canvasRef}
        width={220}
        height={220}
        style={{ background: "transparent" }}
        className="scale-110 md:scale-125 mb-4" // Makes the graph slightly larger
      />

      <motion.div
        key={loadingText}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-lg md:text-xl font-bold text-[#F7F4D5] mt-6 tracking-wide text-center"
      >
        {loadingText}
      </motion.div>

      <div className="text-[10px] md:text-xs text-[#F7F4D5]/35 mt-3 uppercase tracking-widest text-center">
        TigerGraph traversal in progress
      </div>

      {/* Responsive progress bar */}
      <div className="w-full max-w-[240px] h-1 bg-[#F7F4D5]/10 rounded-full mt-10 overflow-hidden relative">
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#F7F4D5] rounded-full shadow-[0_0_10px_rgba(247,244,213,0.5)]"
          initial={{ width: "0%" }}
          animate={{ width: `${loadingPct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="text-xs font-medium text-[#F7F4D5]/40 mt-3">{loadingPct}%</div>
    </motion.div>
  );
}