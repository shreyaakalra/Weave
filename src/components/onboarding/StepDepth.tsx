import { useState, useEffect } from "react";
import { OnboardingState } from "./OnboardingFlow";

const depthOptions = [
  { value: "philosopher", emoji: "🪐", title: "Deep & curious", desc: "2am conversations about the universe" },
  { value: "witty", emoji: "⚡", title: "Fast and funny", desc: "Banter, memes, zero effort" },
  { value: "storyteller", emoji: "📖", title: "Storyteller energy", desc: "Every answer becomes a 20-minute tale" },
  { value: "listener", emoji: "🫂", title: "I'm more of a listener", desc: "I'm better at making people feel heard" },
  { value: "casual", emoji: "🎉", title: "Light & casual", desc: "Nothing too deep — just easy, fun chats" },
];

export default function StepDepth({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [rowsVisible, setRowsVisible] = useState(depthOptions.map(() => false));

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timers = depthOptions.map((_, i) =>
      setTimeout(() => {
        setRowsVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 90)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <div style={{ width: "20px", height: "1px", background: "rgba(247,244,213,0.35)" }} />
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "rgba(247,244,213,0.4)",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Conversation style
          </span>
          <div style={{ width: "20px", height: "1px", background: "rgba(247,244,213,0.35)" }} />
        </div>

        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(26px, 4vw, 34px)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "#F7F4D5",
            marginBottom: "8px",
            letterSpacing: "-0.01em",
          }}
        >
          How do your conversations
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(247,244,213,0.75)" }}>usually flow?</em>
        </h1>

        <p
          style={{
            fontSize: "13px",
            color: "rgba(247,244,213,0.45)",
            lineHeight: 1.5,
            fontWeight: 300,
            margin: "0 auto",
            maxWidth: "280px",
          }}
        >
          No right answer — we&apos;ll match you with people who communicate like you do.
        </p>
      </div>

      {/* Rows — centred, capped width matching other steps */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          {depthOptions.map((opt, i) => {
            const selected = state.depth === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update({ depth: opt.value })}
                style={{
                  opacity: rowsVisible[i] ? 1 : 0,
                  transform: rowsVisible[i] ? "translateY(0)" : "translateY(16px)",
                  transition:
                    "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "14px 16px",
                  borderRadius: "20px",
                  border: `1.5px solid ${selected ? "rgba(247,244,213,0.55)" : "rgba(26,92,56,0.6)"}`,
                  background: selected
                    ? "#F7F4D5"
                    : "linear-gradient(135deg, rgba(17,46,30,0.9), rgba(10,30,20,0.95))",
                  boxShadow: selected
                    ? "0 0 0 4px rgba(247,244,213,0.06), 0 8px 32px rgba(0,0,0,0.3)"
                    : "0 2px 12px rgba(0,0,0,0.2)",
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {/* Emoji */}
                <span
                  style={{
                    fontSize: "26px",
                    lineHeight: 1,
                    flexShrink: 0,
                    width: "36px",
                    textAlign: "center",
                  }}
                >
                  {opt.emoji}
                </span>

                {/* Text */}
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: selected ? "#0D3B22" : "rgba(247,244,213,0.85)",
                      fontFamily: "'DM Sans', sans-serif",
                      letterSpacing: "0.01em",
                      marginBottom: "3px",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {opt.title}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: selected ? "rgba(13,59,34,0.6)" : "rgba(247,244,213,0.35)",
                      fontWeight: 300,
                      lineHeight: 1.4,
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {opt.desc}
                  </div>
                </div>

                {/* Selected tick */}
                {selected && (
                  <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="rgba(13,59,34,0.12)" />
                      <path d="M4.5 8l2.5 2.5 4.5-5" stroke="#0D3B22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}