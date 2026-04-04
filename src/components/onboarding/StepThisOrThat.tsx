import { useState, useEffect } from "react";
import { OnboardingState } from "./OnboardingFlow";

const pairs = [
  { a: { emoji: "🌙", label: "Late night texts" }, b: { emoji: "☕", label: "Morning coffee calls" } },
  { a: { emoji: "🎉", label: "House party" }, b: { emoji: "🍽️", label: "Dinner for four" } },
  { a: { emoji: "⚡", label: "Impulsive plans" }, b: { emoji: "📅", label: "Scheduled hangouts" } },
  { a: { emoji: "🎬", label: "Movie night + snacks" }, b: { emoji: "🌄", label: "Out exploring somewhere new" } },
  { a: { emoji: "🍕", label: "Order in, stay cozy" }, b: { emoji: "🍜", label: "Go out and try something new" } },
];

export default function StepThisOrThat({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [rowsVisible, setRowsVisible] = useState(pairs.map(() => false));

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timers = pairs.map((_, i) =>
      setTimeout(() => {
        setRowsVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 200 + i * 80)
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
            This or that
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
          Fast answers
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(247,244,213,0.75)" }}>only.</em>
        </h1>

        <p
          style={{
            fontSize: "13px",
            color: "rgba(247,244,213,0.45)",
            lineHeight: 1.5,
            fontWeight: 300,
            margin: "0 auto",
            maxWidth: "260px",
          }}
        >
          Go with your gut. No overthinking.
        </p>
      </div>

      {/* Pairs */}
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
          {pairs.map((pair, i) => {
            const chosen = state.totAnswers?.[i];
            return (
              <div
                key={i}
                style={{
                  opacity: rowsVisible[i] ? 1 : 0,
                  transform: rowsVisible[i] ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1.5px solid rgba(26,92,56,0.6)",
                  boxShadow: chosen
                    ? "0 0 0 4px rgba(247,244,213,0.04), 0 8px 32px rgba(0,0,0,0.25)"
                    : "0 2px 12px rgba(0,0,0,0.2)",
                }}
              >
                {/* Option A */}
                <button
                  onClick={() => update({ totAnswers: { ...state.totAnswers, [i]: "a" } })}
                  style={{
                    padding: "16px 12px",
                    textAlign: "center",
                    background:
                      chosen === "a"
                        ? "#F7F4D5"
                        : "linear-gradient(135deg, rgba(17,46,30,0.9), rgba(10,30,20,0.95))",
                    transition: "background 0.3s ease",
                    cursor: "pointer",
                    border: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "22px", lineHeight: 1 }}>{pair.a.emoji}</span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: chosen === "a" ? "#0D3B22" : "rgba(247,244,213,0.8)",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.3,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {pair.a.label}
                  </span>
                </button>

                {/* Divider */}
                <div
                  style={{
                    width: "1px",
                    background: "rgba(26,92,56,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.15em",
                      color: "rgba(247,244,213,0.3)",
                      fontWeight: 500,
                      writingMode: "vertical-rl",
                      textTransform: "uppercase",
                      padding: "6px 0",
                      background: "rgba(10,30,20,0.6)",
                    }}
                  >
                    or
                  </span>
                </div>

                {/* Option B */}
                <button
                  onClick={() => update({ totAnswers: { ...state.totAnswers, [i]: "b" } })}
                  style={{
                    padding: "16px 12px",
                    textAlign: "center",
                    background:
                      chosen === "b"
                        ? "#F7F4D5"
                        : "linear-gradient(135deg, rgba(17,46,30,0.9), rgba(10,30,20,0.95))",
                    transition: "background 0.3s ease",
                    cursor: "pointer",
                    border: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "22px", lineHeight: 1 }}>{pair.b.emoji}</span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: chosen === "b" ? "#0D3B22" : "rgba(247,244,213,0.8)",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.3,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {pair.b.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}