import { useState, useEffect } from "react";
import { OnboardingState } from "./OnboardingFlow";

function FloatingInput({
  label,
  sublabel,
  value,
  onChange,
  placeholder,
  icon,
  delay = 0,
}: {
  label: string;
  sublabel?: string;
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
        {/* Icon */}
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

        {/* Floating label */}
        <label
          style={{
            display: "block",
            fontSize: active ? "10px" : "14px",
            letterSpacing: active ? "0.08em" : "0",
            color: active
              ? focused
                ? "rgba(247,244,213,0.7)"
                : "rgba(247,244,213,0.4)"
              : "rgba(247,244,213,0.5)",
            marginBottom: active ? "4px" : "0",
            transition: "all 0.25s ease",
            textTransform: active ? "uppercase" : "none",
            fontFamily: "'DM Sans', sans-serif",
            cursor: "text",
          }}
        >
          {label}
          {sublabel && (
            <span style={{ marginLeft: "6px", opacity: 0.5, fontSize: "9px", textTransform: "none", letterSpacing: 0 }}>
              {sublabel}
            </span>
          )}
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

        {/* Focus glow line */}
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

export default function StepBasics({
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

      {/* Header block */}
      <div
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
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
            Let&apos;s start
          </span>
          <div style={{ width: "20px", height: "1px", background: "rgba(247,244,213,0.35)" }} />
        </div>

        {/* Headline */}
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
          First, what do
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(247,244,213,0.75)" }}>we call you?</em>
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
          No pressure — you&apos;ll use a nickname publicly. Your real name stays between us.
        </p>
      </div>

      {/* Fields + Button — centred, capped width */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "420px" }}>
          <FloatingInput
            label="Your real name"
            sublabel="only we see this"
            value={state?.name || ""}
            onChange={(v) => update({ name: v })}
            placeholder="e.g. Priya"
            delay={150}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />

          <FloatingInput
            label="Nickname on Weave"
            sublabel="what others see"
            value={state?.nickname || ""}
            onChange={(v) => update({ nickname: v })}
            placeholder="e.g. sunflower, part-time introvert"
            delay={250}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" />
                <path d="M12 15V3" />
                <path d="m8 7 4-4 4 4" />
              </svg>
            }
          />

          <FloatingInput
            label="Your city"
            value={state?.city || ""}
            onChange={(v) => update({ city: v })}
            placeholder="e.g. Delhi, Mumbai, Bangalore"
            delay={350}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          />

        </div>
      </div>
    </div>
  );
}