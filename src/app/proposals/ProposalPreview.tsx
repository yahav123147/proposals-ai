"use client";

import type { CSSProperties } from "react";

export interface ProposalData {
  clientName: string;
  date: string;
  validityDays: string;
  greeting: string;
  letterBody: string;
  signOff: string;
  programPrice: string;
  paymentTerms: string;
}

/* ============ COLOR TOKENS ============ */
const T = {
  black: "#0a0a0a",
  cream: "#E8E4D9",
  creamLight: "#F5F3EE",
  purple: "#6B4FA0",
  purpleLight: "#7B5CB8",
  purpleSoft: "rgba(107,79,160,0.08)",
  text: "#1a1a1a",
  textSecondary: "#5a5a5a",
  white: "#ffffff",
} as const;

const S = {
  page: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "0 40px",
  } as CSSProperties,
  sectionPy: { padding: "40px 0" } as CSSProperties,
  h1: {
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1.25,
    textAlign: "center",
    marginBottom: 14,
  } as CSSProperties,
  h2: {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.3,
    textAlign: "center",
    marginBottom: 10,
  } as CSSProperties,
  smallCaps: {
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase" as const,
    color: T.purple,
    textAlign: "center" as const,
    display: "block",
    marginBottom: 10,
    fontWeight: 600,
  } as CSSProperties,
  subtitle: {
    fontSize: 16,
    color: T.textSecondary,
    textAlign: "center" as const,
    maxWidth: 560,
    margin: "0 auto 30px",
  } as CSSProperties,
  divider: {
    width: 60,
    height: 2,
    background: T.purple,
    margin: "0 auto",
    opacity: 0.3,
  } as CSSProperties,
};

/* ============ BONUSES DATA ============ */
const BONUSES = [
  {
    name: "Hot Seat אישי עם מנטור 2",
    desc: "סקירה חיה ואישית על התוכן שלך עם פידבק בזמן אמת.",
    value: "2,000",
  },
  {
    name: "קהילת NEXT LEVEL",
    desc: "קבוצת וואטסאפ סגורה לתמיכה ומענה ישיר ממנטור 2.",
    value: "1,997",
  },
  {
    name: "Playbook בוטים מוכנים",
    desc: "בוטים לבניית קהילה, לידים ומכירה אוטומטית. מוכנים להפעלה.",
    value: "1,497",
  },
  {
    name: "סטודיו התוכן שלך בקנבה",
    desc: "טמפלטים ממותגים לסטוריז, קרוסלות ופוסטים.",
    value: "997",
  },
  {
    name: "גאנטים – מפת הדרכים שלך",
    desc: "מה, מתי ואיך לעלות. ציר זמן ברור בלי ניחושים.",
    value: "897",
  },
  {
    name: "YOUR BRAND NAME",
    desc: "צעד אחר צעד: איך לבנות אמון עם הקהילה שלך.",
    value: "297",
  },
  {
    name: "ההשקה המושלמת",
    desc: "איך להשיק כל מוצר לקהילה האורגנית שלך.",
    value: "1,297",
  },
  {
    name: "גישה לכל ההקלטות – לכל החיים",
    desc: "להפעיל, לשכפל ולשפר גם שנים אחרי שהתכנית נגמרה.",
    value: "15,000",
  },
];

const TOTAL_BONUS_VALUE = "23,982";

/* ============ BENEFITS DATA ============ */
const BENEFITS = [
  {
    icon: "⚡",
    title: "מהירות יצירה × 10",
    desc: "פוסט שלקח שעתיים? 15 דקות. סדרת סטוריז לשבוע? חצי שעה.",
  },
  {
    icon: "🎯",
    title: "תוכן שנשמע כמוך",
    desc: 'תלמדי "לאלף" את ה-AI לדבר בקול שלך – תוכן אותנטי.',
  },
  {
    icon: "📅",
    title: "מערכת תוכן עקבית",
    desc: "גאנט חודשי, תבניות מוכנות, לוח שנה שיווקי.",
  },
  {
    icon: "💰",
    title: "חיסכון של אלפים בחודש",
    desc: "תפסיקי לשלם לקופירייטר, מעצבת ומנהלת סושיאל.",
  },
  {
    icon: "🧲",
    title: "לידים מתוכן אורגני",
    desc: "תוכן שמושך לידים פרימיום – בלי פרסום ממומן.",
  },
  {
    icon: "🤖",
    title: "בוטים שעובדים בשבילך",
    desc: "אוטומציות AI שבונות קהילה ומוכרות – גם כשאת ישנה.",
  },
  {
    icon: "🎨",
    title: "עיצוב בלחיצת כפתור",
    desc: "סטודיו קנבה מוכן עם טמפלטים ממותגים.",
  },
  {
    icon: "🚀",
    title: "עצמאות מלאה",
    desc: "בסוף 12 שבועות, יש לך שיטה, כלים ומערכת.",
  },
];

export function ProposalPreview({ data }: { data: ProposalData }) {
  return (
    <div style={{ direction: "rtl", color: T.text }}>
      {/* ============ COVER ============ */}
      <div
        style={{
          minHeight: 600,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: T.black,
          color: T.white,
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
            background:
              "radial-gradient(circle, rgba(107,79,160,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            display: "inline-block",
            padding: "8px 28px",
            border: "1px solid rgba(107,79,160,0.4)",
            borderRadius: 50,
            fontSize: 13,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: T.purpleLight,
            marginBottom: 40,
            position: "relative",
            zIndex: 1,
          }}
        >
          הצעת מחיר
        </div>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 20,
            position: "relative",
            zIndex: 1,
            color: "#A78BFA",
          }}
        >
          Content AI Program
        </h1>
        <p
          style={{
            fontSize: 20,
            fontWeight: 300,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 500,
            marginBottom: 40,
            position: "relative",
            zIndex: 1,
          }}
        >
          תכנית הכשרה ליצירת תוכן שיווקי חכם
          <br />
          באמצעות בינה מלאכותית
        </p>
        <div
          style={{
            width: 60,
            height: 2,
            background: T.purple,
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
            lineHeight: 2,
          }}
        >
          <strong style={{ color: "rgba(255,255,255,0.6)" }}>
            Your Brand
          </strong>
          <br />
          מחזור 2026 · 25 מקומות בלבד
        </p>
      </div>

      {/* ============ CONTENT ============ */}
      <div style={S.page}>
        {/* ============ PROPOSAL HEADER ============ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "36px 0 24px",
            borderBottom: `2px solid ${T.purple}`,
            marginBottom: 36,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: T.purple,
                marginBottom: 4,
              }}
            >
              הצעת מחיר
            </h3>
            <p
              style={{
                fontSize: 14,
                color: T.textSecondary,
                marginBottom: 2,
              }}
            >
              תכנית Content AI
            </p>
            <p
              style={{
                color: T.purple,
                fontWeight: 600,
                marginTop: 6,
                fontSize: 14,
              }}
            >
              Your Brand
            </p>
          </div>
          <div
            style={{
              textAlign: "left",
              fontSize: 13,
              color: T.textSecondary,
              lineHeight: 1.8,
            }}
          >
            <strong>לכבוד:</strong>{" "}
            {data.clientName || "____________"}
            <br />
            <strong>תאריך:</strong> {data.date}
            <br />
            <strong>תוקף ההצעה:</strong> {data.validityDays} ימים
          </div>
        </div>

        {/* ============ PERSONAL LETTER ============ */}
        <section style={{ paddingTop: 0, paddingBottom: 50 }}>
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              fontSize: 16,
              lineHeight: 1.9,
            }}
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 20,
                color: T.text,
              }}
            >
              {data.greeting}
            </p>
            {data.letterBody.split("\n").map((line, i) =>
              line.trim() === "" ? (
                <br key={i} />
              ) : (
                <p key={i} style={{ marginBottom: 14, fontSize: 16 }}>
                  {line}
                </p>
              )
            )}
            <div
              style={{
                marginTop: 28,
                color: T.textSecondary,
                fontSize: 15,
              }}
            >
              {data.signOff.split("\n").map((line, i) => (
                <span key={i}>
                  {line.startsWith("צוות") || line.startsWith("מנטור 2") ? (
                    <strong style={{ color: T.text }}>{line}</strong>
                  ) : (
                    line
                  )}
                  <br />
                </span>
              ))}
            </div>
          </div>
        </section>

        <div style={S.divider} />

        {/* ============ BENEFITS ============ */}
        <section style={S.sectionPy}>
          <span style={S.smallCaps}>מה תקבלי מהתכנית</span>
          <h2 style={S.h2}>
            לא עוד "קורס".
            <br />
            מערכת הפעלה שלמה לתוכן של העסק שלך.
          </h2>

          <div style={{ textAlign: "center", margin: "24px 0 10px" }}>
            <img
              src="/images/content-ai/Mockup-AI.webp"
              alt="Content AI Program"
              style={{
                maxWidth: "90%",
                height: "auto",
                margin: "0 auto",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
              marginTop: 28,
            }}
          >
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                style={{
                  background: T.white,
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 12,
                  padding: "24px 20px",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: T.purpleSoft,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    marginBottom: 10,
                  }}
                >
                  {b.icon}
                </div>
                <h3
                  style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}
                >
                  {b.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: T.textSecondary,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div style={S.divider} />

        {/* ============ PROGRAM STRUCTURE ============ */}
        <section style={S.sectionPy}>
          <span style={S.smallCaps}>מבנה התכנית</span>
          <h2 style={S.h2}>
            12 שבועות. שיטה שלמה. תוצאות שנשארות.
          </h2>
          <div style={{ position: "relative", margin: "28px 0" }}>
            <div
              style={{
                position: "absolute",
                right: 17,
                top: 0,
                bottom: 0,
                width: 2,
                background: `linear-gradient(to bottom, ${T.purple}, rgba(107,79,160,0.15))`,
              }}
            />
            {[
              {
                n: "1",
                title: "8 פרקים דיגיטליים מוקלטים",
                desc: 'שלב אחר שלב – מ"מה זה AI" ועד מערכת תוכן חודשית מלאה.',
              },
              {
                n: "2",
                title: "9 מפגשי LIVE קבוצתיים עם מנטור 2",
                desc: "יישום מעשי, סקירה על התוכן שלך, הכוונה אישית.",
              },
              {
                n: "3",
                title: "קבוצת וואטסאפ ייעודית",
                desc: "12 שבועות של גישה ישירה למנטור 2. שאלות, הכוונה, שיתוף.",
              },
              {
                n: "4",
                title: "תמיכה טכנית אישית",
                desc: "צ'אט חם ימים א'-ה' (12:30-15:30).",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 22,
                  marginBottom: 22,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    background: T.purple,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.white,
                    fontWeight: 800,
                    fontSize: 14,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {item.n}
                </div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: T.textSecondary,
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                background: T.purpleSoft,
                border: `1px solid rgba(107,79,160,0.2)`,
                borderRadius: 50,
                padding: "7px 22px",
                fontSize: 13,
                fontWeight: 600,
                color: T.purple,
              }}
            >
              עד 25 משתתפות בלבד למחזור
            </span>
          </div>
        </section>

        <div style={S.divider} />

        {/* ============ AUTHORITY ============ */}
        <section
          style={{
            background: T.black,
            color: T.white,
            padding: "50px 36px",
            margin: "30px -40px",
            borderRadius: 20,
          }}
        >
          <span
            style={{ ...S.smallCaps, color: "rgba(255,255,255,0.45)" }}
          >
            מי מובילה את התכנית
          </span>

          {/* Natalia portrait */}
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0 16px" }}>
            <img
              src="/images/content-ai/Natalia-2.webp"
              alt="מנטור 2"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(107,79,160,0.4)",
                boxShadow: "0 0 30px rgba(107,79,160,0.2)",
              }}
            />
          </div>

          <h2
            style={{ ...S.h2, color: T.white, marginBottom: 16 }}
          >
            מנטור 2
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.6)",
              maxWidth: 500,
              margin: "0 auto 28px",
              fontSize: 15,
            }}
          >
            מנטור 2 בנתה מכונות שיווק בסקאלה בינלאומית – ועכשיו היא
            מלמדת את השיטה.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginBottom: 28,
              textAlign: "center",
            }}
          >
            {[
              {
                num: "$20M",
                label: "בנתה חטיבת קואצ'ינג\nמאפס לארגון מוביל",
              },
              {
                num: "$1M",
                label: "תקציב פרסום חודשי\nשניהלה בעצמה",
              },
              {
                num: "1M+",
                label: "מספר העוקבים האמיתיים\nשהעלתה לבעלה בצורה אורגנית",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "22px 14px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    color: T.purpleLight,
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.4,
                    whiteSpace: "pre-line",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              maxWidth: 480,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              עבדה צמוד עם{" "}
              <strong style={{ color: T.white }}>וישן לקיאני</strong>,{" "}
              <strong style={{ color: T.white }}>פול מקנה</strong> ו
              <strong style={{ color: T.white }}>סהרה רוז</strong>. הובילה
              השקות של $1M-$4M לכל אחת.
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
              }}
            >
              כיום מנטורית בכירה ב
              <strong style={{ color: "rgba(255,255,255,0.65)" }}>
                שם העסק
              </strong>
              .
            </p>

          </div>

          {/* ===== Husband proof block ===== */}
          <div
            style={{
              marginTop: 36,
              paddingTop: 32,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <p
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.75)",
                maxWidth: 560,
                margin: 0,
                fontSize: 16,
                lineHeight: 1.6,
              }}
            >
              בשנה האחרונה מנטור 2 בנתה{" "}
              <strong style={{ color: T.white }}>
                צבא של יוצרות תוכן מבוססות AI
              </strong>{" "}
              בעסק של בעלה והזניקה אותו{" "}
              <strong style={{ color: T.purpleLight }}>
                מאפס לקהילה גדולה
              </strong>{" "}
              אורגנית.
            </p>
            <div
              style={{
                background: "#ffffff",
                padding: 18,
                borderRadius: 18,
                width: "100%",
                maxWidth: 560,
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              }}
            >
              <img
                src="/images/content-ai/natalia-husband-proof.jpg"
                alt="הצבא של יוצרות התוכן של מנטור 2"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: 10,
                }}
              />
            </div>
          </div>
        </section>

        {/* ============ CASE STUDY ============ */}
        <section style={S.sectionPy}>
          <span style={S.smallCaps}>תוצאות מהשטח</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginBottom: 8,
            }}
          >
            <img
              src="/images/content-ai/Darya.webp"
              alt="דריה"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${T.purple}`,
              }}
            />
            <h2 style={{ ...S.h2, marginBottom: 0 }}>דריה – מומחית לבריאות טבעית</h2>
          </div>
          <p style={S.subtitle}>
            הגיעה עם 2,000 עוקבים והכנסה מינימלית.
          </p>

          <div
            style={{
              padding: "20px 0 0",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: 20,
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  background: "rgba(200,60,60,0.05)",
                  border: "1px solid rgba(200,60,60,0.12)",
                  borderRadius: 12,
                  padding: "20px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    color: "#c44",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  לפני
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#c44",
                  }}
                >
                  2,000 עוקבים
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.textSecondary,
                    marginTop: 4,
                  }}
                >
                  0 לידים · הכנסה מינימלית
                </div>
              </div>
              <div style={{ fontSize: 22, color: T.purple }}>←</div>
              <div
                style={{
                  background: "rgba(107,79,160,0.06)",
                  border: `2px solid ${T.purple}`,
                  borderRadius: 12,
                  padding: "20px 16px",
                  textAlign: "center",
                  boxShadow: "0 0 20px rgba(107,79,160,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    color: T.purple,
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  אחרי
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: T.purple,
                  }}
                >
                  × 25
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.textSecondary,
                    marginTop: 4,
                  }}
                >
                  10,000+ עוקבים · מיליוני צפיות
                </div>
              </div>
            </div>

            <ul style={{ listStyle: "none", margin: "20px 0 0" }}>
              {[
                "מכרה 170+ עותקים של קורס דיגיטלי – תוך סוף שבוע אחד",
                "מילאה את תוכנית הקבוצה – פי 2 מהיעד המקורי",
                "50+ לידים לתוכנית פרימיום 1:1 תוך 3 חודשים",
                "מכירות יומיות אוטומטיות מתוכן אורגני",
                "רילסים שעברו מיליון צפיות",
                "קהילת וואטסאפ של 2,000+ אנשים ב-4 שבועות",
              ].map((r, i) => (
                <li
                  key={i}
                  style={{
                    padding: "7px 0",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      color: T.purple,
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  {r}
                </li>
              ))}
            </ul>

          </div>

          {/* Darya content results — outside the card so PDF can break cleanly */}
          <img
            src="/images/content-ai/1-5.webp"
            alt="התוכן של דריה מתפוצץ"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 10,
              marginTop: 20,
              display: "block",
            }}
          />
          <img
            src="/images/content-ai/2-5.webp"
            alt="יש לה יותר לידים משהיא יכולה להתמודד איתם"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 10,
              marginTop: 12,
              display: "block",
            }}
          />

          {/* ===== Hani Buskila proof block ===== */}
          <div
            style={{
              marginTop: 36,
              paddingTop: 32,
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  margin: 0,
                  color: T.black,
                  textAlign: "center",
                }}
              >
                חני בוסקילה – תלמידה מהמחזור הראשון
              </h3>
            </div>
            <p
              style={{
                textAlign: "center",
                color: T.textSecondary,
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 560,
                margin: "0 auto 22px",
              }}
            >
              העוקבים עלו, האינבוקס התפוצץ, רשימת התפוצה גדלה,
              ההכנסות זינקו –{" "}
              <strong style={{ color: T.purple }}>
                והזמינו את חני לתוכנית עם דני רופ
              </strong>
              .
            </p>
            <img
              src="/images/content-ai/hani-buskila-proof.jpg"
              alt="חני בוסקילה – תוצאות מהמחזור הראשון"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 12,
                display: "block",
              }}
            />
          </div>
        </section>

        <div style={S.divider} />

        {/* ============ BONUSES ============ */}
        <section
          style={{
            background: T.black,
            color: T.white,
            padding: "50px 36px",
            margin: "0 -40px",
            borderRadius: 20,
          }}
        >
          <span
            style={{ ...S.smallCaps, color: "rgba(255,255,255,0.45)" }}
          >
            בונוסים כלולים בתכנית
          </span>
          <h2 style={{ ...S.h2, color: T.white }}>
            8 בונוסים בשווי {TOTAL_BONUS_VALUE} ₪
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.45)",
              fontSize: 14,
              marginBottom: 28,
            }}
          >
            ללא תוספת תשלום
          </p>

          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            {BONUSES.map((b, i) => (
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
                    background: T.purple,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                    color: T.white,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      marginBottom: 2,
                    }}
                  >
                    {b.name}
                  </h4>
                  <p
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.5)",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {b.desc}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.purpleLight,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    marginTop: 2,
                  }}
                >
                  {b.value} ₪
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ PRICING TABLE ============ */}
        <section style={S.sectionPy}>
          <span style={S.smallCaps}>סיכום ההשקעה</span>
          <h2 style={S.h2}>הנה מה שמחכה לך בפנים:</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              margin: "28px 0",
              fontSize: 14,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    background: T.purple,
                    color: T.white,
                    padding: "12px 18px",
                    textAlign: "right",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  פירוט
                </th>
                <th
                  style={{
                    background: T.purple,
                    color: T.white,
                    padding: "12px 18px",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  שווי
                </th>
              </tr>
            </thead>
            <tbody>
              <PricingRow
                label="תכנית Content AI – 12 שבועות (8 פרקים + 9 מפגשי LIVE)"
                value={`${data.programPrice} ₪`}
              />
              <PricingRow
                label="קבוצת וואטסאפ + תמיכה טכנית"
                value="כלול"
                even
              />
              {BONUSES.map((b, i) => (
                <PricingRow
                  key={i}
                  label={`★ בונוס ${i + 1}: ${b.name}`}
                  value={`${b.value} ₪`}
                  even={i % 2 === 0}
                />
              ))}
              <tr>
                <td
                  style={{
                    background: T.cream,
                    fontWeight: 800,
                    fontSize: 16,
                    padding: "14px 18px",
                    color: T.text,
                  }}
                >
                  שווי כולל
                </td>
                <td
                  style={{
                    background: T.cream,
                    fontWeight: 800,
                    fontSize: 16,
                    padding: "14px 18px",
                    textAlign: "left",
                    textDecoration: "line-through",
                    color: "#999",
                  }}
                >
                  33,882 ₪
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    background: T.purple,
                    color: T.white,
                    fontWeight: 800,
                    fontSize: 18,
                    padding: "16px 18px",
                  }}
                >
                  ההשקעה שלך
                </td>
                <td
                  style={{
                    background: T.purple,
                    color: T.white,
                    fontWeight: 800,
                    fontSize: 18,
                    padding: "16px 18px",
                    textAlign: "left",
                  }}
                >
                  {data.programPrice} ₪ + מע״מ
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    background: "rgba(107,79,160,0.06)",
                    color: T.purple,
                    fontWeight: 700,
                    fontSize: 14,
                    padding: "12px 18px",
                  }}
                >
                  חיסכון
                </td>
                <td
                  style={{
                    background: "rgba(107,79,160,0.06)",
                    color: T.purple,
                    fontWeight: 700,
                    fontSize: 14,
                    padding: "12px 18px",
                    textAlign: "left",
                  }}
                >
                  {TOTAL_BONUS_VALUE} ₪ (71%)
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                background: T.purpleSoft,
                border: `1px solid rgba(107,79,160,0.2)`,
                borderRadius: 50,
                padding: "7px 22px",
                fontSize: 13,
                fontWeight: 600,
                color: T.purple,
              }}
            >
              25 מקומות בלבד למחזור
            </span>
          </div>
        </section>

        <div style={S.divider} />

        {/* ============ NEXT STEPS ============ */}
        <section style={S.sectionPy}>
          <span style={S.smallCaps}>השלבים הבאים</span>
          <h2 style={S.h2}>איך מצטרפים?</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              margin: "28px 0",
            }}
          >
            {[
              {
                n: "1",
                title: "אישור ההצעה",
                desc: "חזרה עם אישור בוואטסאפ או במייל",
              },
              {
                n: "2",
                title: "תשלום",
                desc: "העברה בנקאית, bit או כרטיס אשראי",
              },
              {
                n: "3",
                title: "מתחילים",
                desc: "גישה מיידית לחומרים + צירוף לקבוצה",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="no-break"
                style={{
                  textAlign: "center",
                  padding: "26px 16px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: T.purple,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: T.white,
                    fontWeight: 800,
                    fontSize: 16,
                    margin: "0 auto 12px",
                  }}
                >
                  {s.n}
                </div>
                <h3 style={{ fontSize: 15, marginBottom: 4 }}>{s.title}</h3>
                <p
                  style={{
                    fontSize: 13,
                    color: T.textSecondary,
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div style={S.divider} />

        {/* ============ TERMS ============ */}
        <div
          className="no-break"
          style={{
            background: T.creamLight,
            borderRadius: 12,
            padding: 26,
            margin: "30px 0",
            fontSize: 13,
            color: T.textSecondary,
            lineHeight: 1.8,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              color: T.text,
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            תנאים
          </h3>
          <ul style={{ listStyle: "none" }}>
            {[
              `הצעה זו בתוקף ל-${data.validityDays} ימים ממועד שליחתה`,
              "המחיר אינו כולל מע״מ (18%)",
              data.paymentTerms,
              "ההרשמה מותנית במקום פנוי (עד 25 משתתפות למחזור)",
              "גישה להקלטות ולחומרי הלימוד נשמרת לכל החיים",
            ].map((t, i) => (
              <li
                key={i}
                style={{ padding: "3px 0", display: "flex", gap: 6 }}
              >
                <span
                  style={{ color: T.purple, fontWeight: 800 }}
                >
                  ·
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* ============ FOOTER ============ */}
        <div
          style={{
            textAlign: "center",
            padding: "36px 0",
            fontSize: 12,
            color: T.textSecondary,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: T.text,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Content AI · Your Brand
          </p>
          <p style={{ margin: 0 }}>© 2026 כל הזכויות שמורות</p>
        </div>
      </div>
    </div>
  );
}

/* ============ HELPER COMPONENTS ============ */

function PricingRow({
  label,
  value,
  even,
}: {
  label: string;
  value: string;
  even?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          padding: "12px 18px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: even ? T.creamLight : T.white,
          fontSize: 14,
          color: T.text,
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "12px 18px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          textAlign: "left",
          fontWeight: 600,
          whiteSpace: "nowrap",
          background: even ? T.creamLight : T.white,
          fontSize: 14,
          color: T.text,
        }}
      >
        {value}
      </td>
    </tr>
  );
}
