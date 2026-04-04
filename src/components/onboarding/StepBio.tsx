import { useState, useEffect } from "react";
import { OnboardingState } from "./OnboardingFlow";

function FloatingTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  delay = 0,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
  delay?: number;
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const active = focused || value.length > 0;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "20px",
          background: focused
            ? "linear-gradient(135deg, rgba(17,46,30,0.9), rgba(10,30,20,0.95))"
            : "linear-gradient(135deg, rgba(13,36,23,0.7), rgba(8,24,16,0.8))",
          border: `1.5px solid ${focused ? "rgba(247,244,213,0.35)" : "rgba(26,92,56,0.6)"}`,
          boxShadow: focused
            ? "0 0 0 4px rgba(247,244,213,0.04), 0 8px 32px rgba(0,0,0,0.3)"
            : "0 2px 12px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
          padding: "14px 16px 12px 16px",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: active ? "10px" : "13px",
            letterSpacing: active ? "0.08em" : "0",
            color: active
              ? focused ? "rgba(247,244,213,0.7)" : "rgba(247,244,213,0.4)"
              : "rgba(247,244,213,0.5)",
            marginBottom: active ? "6px" : "0",
            transition: "all 0.25s ease",
            textTransform: active ? "uppercase" : "none",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </label>

        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ""}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#F7F4D5",
            fontSize: "15px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            letterSpacing: "0.01em",
            resize: "none",
            lineHeight: 1.6,
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20px",
            right: "20px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(247,244,213,0.4), transparent)",
            opacity: focused ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

function FloatingInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
  delay = 0,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const active = focused || value.length > 0;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "20px",
          background: focused
            ? "linear-gradient(135deg, rgba(17,46,30,0.9), rgba(10,30,20,0.95))"
            : "linear-gradient(135deg, rgba(13,36,23,0.7), rgba(8,24,16,0.8))",
          border: `1.5px solid ${focused ? "rgba(247,244,213,0.35)" : "rgba(26,92,56,0.6)"}`,
          boxShadow: focused
            ? "0 0 0 4px rgba(247,244,213,0.04), 0 8px 32px rgba(0,0,0,0.3)"
            : "0 2px 12px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
          padding: "14px 16px 12px 48px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "18px",
            top: "50%",
            transform: "translateY(-50%)",
            color: focused ? "rgba(247,244,213,0.6)" : "rgba(247,244,213,0.25)",
            transition: "color 0.3s ease",
          }}
        >
          {icon}
        </div>

        <label
          style={{
            display: "block",
            fontSize: active ? "10px" : "14px",
            letterSpacing: active ? "0.08em" : "0",
            color: active
              ? focused ? "rgba(247,244,213,0.7)" : "rgba(247,244,213,0.4)"
              : "rgba(247,244,213,0.5)",
            marginBottom: active ? "4px" : "0",
            transition: "all 0.25s ease",
            textTransform: active ? "uppercase" : "none",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </label>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ""}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#F7F4D5",
            fontSize: "16px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20px",
            right: "20px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(247,244,213,0.4), transparent)",
            opacity: focused ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function StepBio({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 50);
    return () => clearTimeout(t);
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
            A little about you
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
          Tell us something
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(247,244,213,0.75)" }}>real about you.</em>
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
          3 sentences. Write like you&apos;re texting someone you already trust.
        </p>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "420px" }}>

          <FloatingTextarea
            label="Your bio"
            value={state.bio || ""}
            onChange={(v) => update({ bio: v })}
            placeholder="I make terrible decisions about TV shows and excellent ones about snacks..."
            rows={4}
            delay={150}
          />

          <FloatingInput
            label="Your comfort watch"
            value={state.comfort || ""}
            onChange={(v) => update({ comfort: v })}
            placeholder="The Office, Spirited Away..."
            delay={250}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
            }
          />

          <FloatingInput
            label="One thing you'll never do"
            value={state.neverdothis || ""}
            onChange={(v) => update({ neverdothis: v })}
            placeholder="Small talk at parties, pineapple on pizza..."
            delay={350}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            }
          />

          <FloatingInput
            label="A small thing that makes you happy"
            value={state.happything || ""}
            onChange={(v) => update({ happything: v })}
            placeholder="First sip of chai, Cold water after a walk"
            delay={450}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.307 4.375 1 7.498 1c1.947 0 3.762.9 4.502 2.228C12.74 1.9 14.555 1 16.502 1 19.625 1 23 3.307 23 7.191c0 4.105-5.37 8.863-11 14.402z" />
              </svg>
            }
          />

        </div>
      </div>
    </div>
  );
}