"use client";

import type { Proposal } from "../lib/types";
import { TEMPLATES } from "../lib/templates";

const C = {
  black: "#0a0a0a",
  white: "#ffffff",
  cream: "#F5F3EE",
  text: "#1a1a1a",
  textMuted: "#5a5a5a",
};

interface Props {
  proposal: Proposal;
}

export function GenericTemplate({ proposal }: Props) {
  const template = TEMPLATES[proposal.templateId];
  const accent = template.primaryColor;
  const accentLight = accent + "20"; // 12% alpha hex
  const customizations = proposal.customizations;
  const validityDays = proposal.expiresAt
    ? Math.ceil(
        (new Date(proposal.expiresAt).getTime() - new Date(proposal.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 7;
  const date = new Date(proposal.createdAt).toLocaleDateString("he-IL");
  const formattedPrice = proposal.programPrice.toLocaleString("he-IL");
  const letterBody = customizations.letterBody || template.defaultLetter;

  return (
    <div
      style={{
        direction: "rtl",
        color: C.text,
        fontFamily: "'Assistant', sans-serif",
      }}
    >
      {/* COVER */}
      <div
        style={{
          minHeight: 540,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: C.black,
          color: C.white,
          textAlign: "center",
          padding: "60px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-30%",
            width: 600,
            height: 600,
            background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)`,
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            display: "inline-block",
            padding: "8px 28px",
            border: `1px solid ${accent}66`,
            borderRadius: 50,
            fontSize: 13,
            letterSpacing: 3,
            color: accent,
            marginBottom: 36,
            position: "relative",
            zIndex: 1,
            textTransform: "uppercase",
          }}
        >
          הצעת מחיר
        </div>
        <h1
          style={{
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 18,
            position: "relative",
            zIndex: 1,
            color: accent,
          }}
        >
          {template.name}
        </h1>
        <p
          style={{
            fontSize: 19,
            fontWeight: 300,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 540,
            marginBottom: 30,
            position: "relative",
            zIndex: 1,
            lineHeight: 1.5,
          }}
        >
          {template.tagline}
        </p>
        <div
          style={{
            width: 60,
            height: 2,
            background: accent,
            margin: "0 auto 24px",
            position: "relative",
            zIndex: 1,
          }}
        />
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <strong style={{ color: "rgba(255,255,255,0.6)" }}>Next Level</strong>
        </p>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 40px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "36px 0 24px",
            borderBottom: `2px solid ${accent}`,
            marginBottom: 36,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: accent,
                marginBottom: 4,
              }}
            >
              הצעת מחיר
            </h3>
            <p style={{ fontSize: 14, color: C.textMuted }}>{template.name}</p>
            <p
              style={{
                color: accent,
                fontWeight: 600,
                marginTop: 6,
                fontSize: 14,
              }}
            >
              Next Level
            </p>
          </div>
          <div
            style={{
              textAlign: "left",
              fontSize: 13,
              color: C.textMuted,
              lineHeight: 1.8,
            }}
          >
            <strong>לכבוד:</strong> {proposal.clientName || "____________"}
            {proposal.clientCompany && (
              <>
                <br />
                <strong>חברה:</strong> {proposal.clientCompany}
              </>
            )}
            <br />
            <strong>תאריך:</strong> {date}
            <br />
            <strong>תוקף ההצעה:</strong> {validityDays} ימים
          </div>
        </div>

        {/* Personal letter */}
        <section style={{ paddingBottom: 50 }}>
          <div
            style={{
              maxWidth: 620,
              margin: "0 auto",
              fontSize: 16,
              lineHeight: 1.9,
            }}
          >
            <p style={{ marginBottom: 18, fontWeight: 700 }}>היי,</p>
            {letterBody.split("\n\n").map((para: string, i: number) => (
              <p key={i} style={{ marginBottom: 18 }}>
                {para}
              </p>
            ))}
            <p style={{ marginTop: 28, fontWeight: 700 }}>
              {customizations.signOff || "בברכה,\nצוות נקסט לבל"}
            </p>
          </div>
        </section>

        <div
          style={{ width: 60, height: 2, background: accent, margin: "0 auto", opacity: 0.3 }}
        />

        {/* What's included */}
        {customizations.programIncludes && customizations.programIncludes.length > 0 && (
          <section style={{ padding: "50px 0" }}>
            <span
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: accent,
                textAlign: "center",
                display: "block",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              מה כלול בתכנית
            </span>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                textAlign: "center",
                marginBottom: 30,
              }}
            >
              הכל מה שאתם צריכים בשביל להצליח
            </h2>
            <ul style={{ listStyle: "none", maxWidth: 560, margin: "0 auto" }}>
              {customizations.programIncludes.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 0",
                    fontSize: 16,
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <span style={{ color: accent, fontWeight: 800, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Bonuses */}
        {customizations.bonuses && customizations.bonuses.length > 0 && (
          <section
            style={{
              background: C.black,
              color: C.white,
              padding: "50px 36px",
              margin: "0 -40px",
              borderRadius: 20,
            }}
          >
            <span
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                textAlign: "center",
                display: "block",
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              בונוסים כלולים
            </span>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: C.white,
                textAlign: "center",
                marginBottom: 30,
              }}
            >
              {customizations.bonuses.length} בונוסים בשווי{" "}
              {customizations.bonuses
                .reduce((s, b) => s + b.value, 0)
                .toLocaleString("he-IL")}{" "}
              ₪
            </h2>
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              {customizations.bonuses.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "16px 18px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    marginBottom: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      minWidth: 32,
                      height: 32,
                      background: accent,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      color: C.white,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{b.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                      {b.description}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: accent, fontWeight: 700 }}>
                    {b.value.toLocaleString("he-IL")} ₪
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pricing */}
        <section style={{ padding: "60px 0 40px" }}>
          <span
            style={{
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: accent,
              textAlign: "center",
              display: "block",
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            סיכום ההשקעה
          </span>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            ההשקעה שלך
          </h2>
          <div
            style={{
              maxWidth: 480,
              margin: "0 auto",
              border: `2px solid ${accent}`,
              borderRadius: 16,
              padding: "32px 28px",
              textAlign: "center",
              background: accentLight,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              {template.name}
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: accent,
                lineHeight: 1.1,
                marginBottom: 6,
              }}
            >
              {formattedPrice} ₪
            </div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 18 }}>
              + מע&quot;מ
            </div>
            <div style={{ fontSize: 14, color: C.text }}>
              {customizations.paymentTerms || "ניתן לשלם עד 3 תשלומים ללא ריבית"}
            </div>
          </div>
        </section>

        {/* Terms */}
        <div
          className="no-break"
          style={{
            background: C.cream,
            borderRadius: 12,
            padding: 26,
            margin: "30px 0",
            fontSize: 13,
            color: C.textMuted,
            lineHeight: 1.8,
          }}
        >
          <h3 style={{ fontSize: 15, color: C.text, marginBottom: 10, fontWeight: 700 }}>
            תנאים
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              `הצעה זו בתוקף ל-${validityDays} ימים ממועד שליחתה`,
              "המחיר אינו כולל מע״מ (18%)",
              customizations.paymentTerms || "ניתן לשלם עד 3 תשלומים ללא ריבית",
            ].map((t, i) => (
              <li key={i} style={{ padding: "3px 0", display: "flex", gap: 6 }}>
                <span style={{ color: accent, fontWeight: 800 }}>·</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            padding: "36px 0",
            fontSize: 12,
            color: C.textMuted,
          }}
        >
          <p style={{ color: accent, fontWeight: 600, marginBottom: 4 }}>
            {template.name} · Next Level
          </p>
          <p style={{ margin: 0 }}>© 2026 כל הזכויות שמורות</p>
        </div>
      </div>
    </div>
  );
}
