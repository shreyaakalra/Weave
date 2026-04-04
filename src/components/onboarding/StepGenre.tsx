import { useState, useEffect } from "react";
import { OnboardingState } from "./OnboardingFlow";

const genreOptions = [
  { value: "coming-of-age", emoji: "🌱", title: "Coming of age", desc: "Figuring things out, one chapter at a time" },
  { value: "thriller", emoji: "🌀", title: "Thriller", desc: "Fast-paced, unpredictable, a little chaotic" },
  { value: "indie-drama", emoji: "🎭", title: "Indie drama", desc: "Quiet and complicated" },
  { value: "romcom", emoji: "💛", title: "Rom-com", desc: "Messy, emotional, but somehow always hopeful" },
  { value: "documentary", emoji: "🎙️", title: "Documentary", desc: "Curious, observant, always trying to understand more" },
  { value: "sci-fi", emoji: "🛸", title: "Sci-fi", desc: "A little ahead of the present" },
  { value: "comedy", emoji: "🎉", title: "Comedy", desc: "Nothing makes sense, but at least it's funny" },
  { value: "slice-of-life", emoji: "🌊", title: "Slice of life", desc: "Simple moments, everyday beauty" },
];

export default function StepGenre({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(genreOptions.map(() => false));

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timers = genreOptions.map((_, i) =>
      setTimeout(() => {
        setCardsVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 150 + i * 70)
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
            Your story
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
          If your life were a film,
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(247,244,213,0.75)" }}> what genre would it be?</em>
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
          Pick one. The one that actually fits.
        </p>
      </div>

      {/* Grid — centred, capped width */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          {genreOptions.map((g, i) => {
            const selected = state.genre === g.value;
            return (
              <button
                key={g.value}
                onClick={() => update({ genre: g.value })}
                style={{
                  opacity: cardsVisible[i] ? 1 : 0,
                  transform: cardsVisible[i] ? "translateY(0)" : "translateY(16px)",
                  transition:
                    "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
                  padding: "16px 14px",
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
                <span
                  style={{
                    fontSize: "24px",
                    lineHeight: 1,
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  {g.emoji}
                </span>

                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: selected ? "#0D3B22" : "rgba(247,244,213,0.85)",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.01em",
                    marginBottom: "4px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {g.title}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: selected ? "rgba(13,59,34,0.6)" : "rgba(247,244,213,0.3)",
                    fontWeight: 300,
                    lineHeight: 1.4,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.3s ease",
                  }}
                >
                  {g.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}