import { useState, useEffect } from "react";
import { OnboardingState } from "./OnboardingFlow";

const interestsList = [
  { label: "Indie films", emoji: "🎬" },
  { label: "Hiking", emoji: "🥾" },
  { label: "Live music", emoji: "🎶" },
  { label: "Reading", emoji: "📚" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Cooking", emoji: "🍳" },
  { label: "Art", emoji: "🎨" },
  { label: "Travel", emoji: "✈️" },
  { label: "Coffee runs", emoji: "☕" },
  { label: "Tech", emoji: "💻" },
  { label: "Photography", emoji: "📷" },
  { label: "Writing", emoji: "✍️" },
  { label: "Theatre", emoji: "🎭" },
  { label: "Yoga", emoji: "🧘" },
  { label: "Cycling", emoji: "🚴" },
  { label: "Climbing", emoji: "🧗" },
  { label: "Architecture", emoji: "🏛️" },
  { label: "Podcasts", emoji: "🎙️" },
  { label: "Astronomy", emoji: "🔭" },
  { label: "Surfing", emoji: "🏄" },
  { label: "Dancing", emoji: "💃" },
  { label: "Birdwatching", emoji: "🐦" },
  { label: "Chess", emoji: "♟️" },
  { label: "Volunteering", emoji: "🤝" },
  { label: "Language learning", emoji: "🗣️" },
  { label: "Raving", emoji: "🪩" },
  { label: "Thrifting", emoji: "🛍️" },
  { label: "Sketching", emoji: "✏️" },
  { label: "Fashion", emoji: "👗" },
  { label: "Spirituality", emoji: "🕯️" },
];

function useReveal(delay = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}

export default function StepInterests({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  const headerVisible = useReveal(50);
  const tagsVisible = useReveal(200);
  const MAX = 8;

  const toggle = (tag: string) => {
    if (state.interests.includes(tag)) {
      update({ interests: state.interests.filter((t) => t !== tag) });
    } else if (state.interests.length < MAX) {
      update({ interests: [...state.interests, tag] });
    }
  };

  const remaining = MAX - state.interests.length;

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
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <div style={{ width: "20px", height: "1px", background: "rgba(247,244,213,0.35)" }} />
          <span style={{
            fontSize: "10px", letterSpacing: "0.2em",
            color: "rgba(247,244,213,0.4)", textTransform: "uppercase", fontWeight: 500,
          }}>
            Your world
          </span>
          <div style={{ width: "20px", height: "1px", background: "rgba(247,244,213,0.35)" }} />
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(26px, 4vw, 34px)",
          fontWeight: 400, lineHeight: 1.1,
          color: "#F7F4D5", marginBottom: "8px", letterSpacing: "-0.01em",
        }}>
          What makes up
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(247,244,213,0.75)" }}>your world?</em>
        </h1>

        <p style={{
          fontSize: "13px", color: "rgba(247,244,213,0.45)",
          lineHeight: 1.5, fontWeight: 300, margin: "0 auto", maxWidth: "280px",
        }}>
          Pick the things that actually fill your time. No need to impress — just be you.
        </p>
      </div>

      {/* Counter + tags wrapper */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Counter row */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: "14px",
            opacity: headerVisible ? 1 : 0,
            transition: "opacity 0.5s ease 0.15s",
          }}>
            <span style={{
              fontSize: "11px", color: "rgba(247,244,213,0.35)",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
            }}>
              {state.interests.length === 0
                ? "Pick up to 8"
                : remaining === 0
                ? "All 8 picked!"
                : `${remaining} more to go`}
            </span>

            <div style={{ display: "flex", gap: "4px" }}>
              {Array.from({ length: MAX }).map((_, i) => (
                <div key={i} style={{
                  width: "5px", height: "5px", borderRadius: "50%",
                  background: i < state.interests.length ? "#F7F4D5" : "rgba(247,244,213,0.12)",
                  transition: "background 0.25s ease",
                }} />
              ))}
            </div>
          </div>

          {/* Tag grid */}
          <div
            style={{
              display: "flex", flexWrap: "wrap", gap: "8px",
              opacity: tagsVisible ? 1 : 0,
              transform: tagsVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            {interestsList.map(({ label, emoji }) => {
              const selected = state.interests.includes(label);
              const disabled = !selected && state.interests.length >= MAX;

              return (
                <button
                  key={label}
                  onClick={() => toggle(label)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "100px",
                    fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: selected ? 500 : 400,
                    border: `1.5px solid ${
                      selected
                        ? "rgba(247,244,213,0.9)"
                        : disabled
                        ? "rgba(26,92,56,0.25)"
                        : "rgba(26,92,56,0.6)"
                    }`,
                    background: selected
                      ? "#F7F4D5"
                      : disabled
                      ? "rgba(13,36,23,0.3)"
                      : "linear-gradient(135deg, rgba(13,36,23,0.7), rgba(8,24,16,0.8))",
                    color: selected
                      ? "#0A3323"
                      : disabled
                      ? "rgba(247,244,213,0.2)"
                      : "rgba(247,244,213,0.75)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: selected
                      ? "0 0 0 4px rgba(247,244,213,0.06), 0 4px 20px rgba(0,0,0,0.3)"
                      : "0 2px 12px rgba(0,0,0,0.2)",
                    transform: selected ? "scale(1.05)" : "scale(1)",
                    letterSpacing: "0.01em",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ fontSize: "14px", lineHeight: 1 }}>{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}