import { useState, useEffect } from "react";
import { OnboardingState } from "./OnboardingFlow";

const energyOptions = [
  { value: "recharge-alone", icon: "🌙", title: "Solo recharger", desc: "I need my quiet time to feel like myself again" },
  { value: "both", icon: "☁️", title: "Depends on the day", desc: "Some days I'm social, some days I disappear" },
  { value: "small-circle", icon: "🌊", title: "Small circle person", desc: "I prefer deep conversations over big groups" },
  { value: "chill", icon: "🌿", title: "Chill & easygoing", desc: "I like low-key hangouts and relaxed plans" },
  { value: "social", icon: "☀️", title: "Social & outgoing", desc: "I enjoy being around people most of the time" },
  { value: "high-energy", icon: "⚡", title: "High energy", desc: "I'm always up for plans, events, and doing things" },
];

function useReveal(delay = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}

export default function StepEnergy({ state, update }: { state: OnboardingState; update: (s: Partial<OnboardingState>) => void }) {
  const headerVisible = useReveal(50);
  const cardsVisible = useReveal(180);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{
        opacity: headerVisible ? 1 : 0,
        transform: headerVisible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        marginBottom: "20px",
        textAlign: "center",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <div style={{ width: "20px", height: "1px", background: "rgba(247,244,213,0.35)" }} />
          <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(247,244,213,0.4)", textTransform: "uppercase", fontWeight: 500 }}>
            Your energy
          </span>
          <div style={{ width: "20px", height: "1px", background: "rgba(247,244,213,0.35)" }} />
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(26px, 4vw, 34px)",
          fontWeight: 400, lineHeight: 1.1,
          color: "#F7F4D5", marginBottom: "8px", letterSpacing: "-0.01em",
        }}>
          What&apos;s your
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(247,244,213,0.75)" }}>social vibe like?</em>
        </h1>

        <p style={{
          fontSize: "13px", color: "rgba(247,244,213,0.45)",
          lineHeight: 1.5, fontWeight: 300, margin: "0 auto", maxWidth: "280px",
        }}>
          Not a personality test. Just helps us find your kind of people.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: "100%", maxWidth: "420px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px",
          opacity: cardsVisible ? 1 : 0,
          transform: cardsVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}>
          {energyOptions.map((opt) => {
            const selected = state.energy === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => update({ energy: opt.value })}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  padding: "16px",
                  borderRadius: "20px",
                  border: `1.5px solid ${selected ? "rgba(247,244,213,0.9)" : "rgba(26,92,56,0.6)"}`,
                  background: selected
                    ? "#F7F4D5"
                    : "linear-gradient(135deg, rgba(13,36,23,0.7), rgba(8,24,16,0.8))",
                  color: selected ? "#0A3323" : "rgba(247,244,213,0.75)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  boxShadow: selected
                    ? "0 0 0 4px rgba(247,244,213,0.06), 0 4px 20px rgba(0,0,0,0.3)"
                    : "0 2px 12px rgba(0,0,0,0.2)",
                  transform: selected ? "scale(1.02)" : "scale(1)",
                }}
              >
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{opt.icon}</span>
                <div>
                  <div style={{
                    fontSize: "13px", fontWeight: 500,
                    color: selected ? "#0A3323" : "#F7F4D5",
                    marginBottom: "3px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {opt.title}
                  </div>
                  <div style={{
                    fontSize: "11px", lineHeight: 1.4,
                    color: selected ? "rgba(10,51,35,0.65)" : "rgba(247,244,213,0.4)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                  }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}