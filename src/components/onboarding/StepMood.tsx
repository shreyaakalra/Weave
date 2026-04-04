import { useState, useEffect } from "react";
import { OnboardingState } from "./OnboardingFlow";

const moodOptions = [
  { value: "deep", emoji: "🌊", title: "Deep dives", desc: "I want to really talk, not just small talk" },
  { value: "chill", emoji: "☕", title: "Easy company", desc: "No pressure, just vibes" },
  { value: "explore", emoji: "🗺️", title: "Do things together", desc: "Let's go out, explore or try something new" },
  { value: "bored", emoji: "🎲", title: "Surprise me", desc: "I'm open to anything, match me randomly" },
];

export default function StepMood({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState([false, false, false, false]);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timers = moodOptions.map((_, i) =>
      setTimeout(() => {
        setCardsVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 100)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      {/* Header block */}
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
            In this moment
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
          What kind of connection
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(247,244,213,0.75)" }}>are you looking for?</em>
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
          Your mood changes. This isn't forever — it just shapes your next match.
        </p>
      </div>

      {/* Cards grid — centred, capped width matching FloatingInput */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          {moodOptions.map((m, i) => {
            const selected = state.mood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => update({ mood: m.value })}
                style={{
                  opacity: cardsVisible[i] ? 1 : 0,
                  transform: cardsVisible[i] ? "translateY(0)" : "translateY(16px)",
                  transition:
                    "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
                  padding: "18px 16px",
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
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: "26px", lineHeight: 1, marginBottom: "12px", display: "block" }}>
                  {m.emoji}
                </span>

                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: selected ? "#0D3B22" : "rgba(247,244,213,0.85)",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.01em",
                    marginBottom: "4px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {m.title}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: selected ? "rgba(13,59,34,0.6)" : "rgba(247,244,213,0.35)",
                    fontWeight: 300,
                    lineHeight: 1.45,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.3s ease",
                  }}
                >
                  {m.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}