"use client";

import type { Proposal } from "../lib/types";

/* ============ DEFAULT TOKENS — Navy + Gold premium ============ */
const DEFAULT_NAVY = "#0a1e3a";
const DEFAULT_GOLD = "#d4af37";
const DEFAULT_CREAM = "#f5f1e8";

function buildTheme(c: Proposal["customizations"]) {
  const navy = c.themeNavy || DEFAULT_NAVY;
  const gold = c.themeGold || DEFAULT_GOLD;
  const cream = c.themeCream || DEFAULT_CREAM;
  // Derive related shades from the chosen navy
  const navyDeep = darken(navy, 0.45);
  const navyMid = lighten(navy, 0.15);
  const navyLight = lighten(navy, 0.3);
  const goldLight = lighten(gold, 0.18);
  return {
    navy,
    navyDeep,
    navyMid,
    navyLight,
    gold,
    goldLight,
    cream,
    white: "#ffffff",
    text: "#1a1a1a",
    textMuted: "#5a5a5a",
    textLight: "rgba(255,255,255,0.78)",
    textDim: "rgba(255,255,255,0.55)",
    textVeryDim: "rgba(255,255,255,0.35)",
  };
}
type Theme = ReturnType<typeof buildTheme>;

function clamp(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  if (!m) return [0, 0, 0];
  return [parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16)];
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => clamp(x).toString(16).padStart(2, "0")).join("");
}
function darken(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}
function lighten(hex: string, amount: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

const SX_PAGE = { maxWidth: 760, margin: "0 auto", padding: "0 40px" } as React.CSSProperties;

function makeStyles(t: Theme) {
  return {
    page: SX_PAGE,
    kicker: {
      fontSize: 11,
      letterSpacing: 4,
      color: t.gold,
      textTransform: "uppercase" as const,
      textAlign: "center" as const,
      fontWeight: 600,
      display: "block",
      marginBottom: 14,
    } as React.CSSProperties,
    h2: {
      fontSize: 32,
      fontWeight: 800,
      textAlign: "center" as const,
      lineHeight: 1.25,
      marginBottom: 18,
      color: t.text,
    } as React.CSSProperties,
    subtitle: {
      fontSize: 16,
      color: t.textMuted,
      textAlign: "center" as const,
      maxWidth: 580,
      margin: "0 auto 36px",
      lineHeight: 1.7,
    } as React.CSSProperties,
    divider: {
      width: 50,
      height: 2,
      background: t.gold,
      margin: "0 auto 28px",
    } as React.CSSProperties,
  };
}
type Styles = ReturnType<typeof makeStyles>;

interface Props {
  proposal: Proposal;
}

export function PremiumTemplate({ proposal }: Props) {
  const c = proposal.customizations;
  const t = buildTheme(c);
  const sx = makeStyles(t);
  const programName = c.programName || "Next Level Program";
  const tagline = c.tagline || "תכנית הליווי המקיפה";
  const coverDescription =
    c.coverDescription ||
    "תוכנית מקצועית שלמה המלווה אותך בכל שלב – מאסטרטגיה ועד יישום מלא בעסק שלך.";
  const durationLabel = c.durationLabel || "9 חודשי ליווי מלאים";
  const formattedPrice = proposal.programPrice.toLocaleString("he-IL");

  return (
    <div
      style={{
        direction: "rtl",
        color: t.text,
        fontFamily: "'Assistant', sans-serif",
      }}
    >
      <Cover
        t={t}
        programName={programName}
        tagline={tagline}
        description={coverDescription}
        price={formattedPrice}
        durationLabel={durationLabel}
      />

      {c.problems && c.problems.length > 0 && <ProblemSection t={t} sx={sx} c={c} />}
      {c.pillars && c.pillars.length > 0 && <PillarsSection t={t} sx={sx} c={c} />}
      {c.benefits && c.benefits.length > 0 && <BenefitsSection t={t} sx={sx} c={c} />}
      {c.mentors && c.mentors.length > 0 && <MentorsSection t={t} sx={sx} c={c} />}
      {c.socialProofs && c.socialProofs.length > 0 && (
        <SocialProofSection t={t} sx={sx} c={c} />
      )}
      {c.syllabusChapters && c.syllabusChapters.length > 0 && (
        <SyllabusSection t={t} sx={sx} c={c} />
      )}
      <InvestmentSection
        t={t}
        sx={sx}
        c={c}
        programName={programName}
        price={formattedPrice}
        durationLabel={durationLabel}
        clientName={proposal.clientName}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  COVER                                                  */
/* ─────────────────────────────────────────────────────── */
function Cover({
  t,
  programName,
  tagline,
  description,
  price,
  durationLabel,
}: {
  t: Theme;
  programName: string;
  tagline: string;
  description: string;
  price: string;
  durationLabel: string;
}) {
  // Split program name into 2 lines
  const words = programName.split(" ");
  const half = Math.ceil(words.length / 2);
  const line1 = words.slice(0, half).join(" ");
  const line2 = words.slice(half).join(" ");

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${t.navyDeep} 0%, ${t.navy} 100%)`,
        color: t.white,
        padding: "100px 60px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial highlight */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-15%",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${t.gold}15 0%, transparent 60%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: 18,
            color: t.white,
          }}
        >
          {line1}
          {line2 && (
            <>
              <br />
              <span style={{ color: t.gold }}>{line2}</span>
            </>
          )}
        </h1>

        <p
          style={{
            fontSize: 19,
            color: "rgba(255,255,255,0.7)",
            fontWeight: 300,
            marginBottom: 32,
          }}
        >
          {tagline}
        </p>

        <div
          style={{
            width: 50,
            height: 2,
            background: t.gold,
            margin: "0 auto 28px",
          }}
        />

        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 520,
            margin: "0 auto 50px",
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </p>

        {/* Price card */}
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            border: `1px solid ${t.gold}40`,
            borderRadius: 4,
            padding: "26px 60px",
            position: "relative",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {/* Diamond decorations */}
          <div
            style={{
              position: "absolute",
              left: -8,
              top: "50%",
              transform: "translateY(-50%)",
              color: t.gold,
              fontSize: 14,
            }}
          >
            ◆
          </div>
          <div
            style={{
              position: "absolute",
              right: -8,
              top: "50%",
              transform: "translateY(-50%)",
              color: t.gold,
              fontSize: 14,
            }}
          >
            ◆
          </div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 4,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            תוכנית ליווי מקיפה
          </div>
          <div
            style={{
              fontSize: 46,
              fontWeight: 900,
              color: t.gold,
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            {price} ₪
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
            + מע&quot;מ | {durationLabel}
          </div>
        </div>

        <div
          style={{
            marginTop: 60,
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          NEXT LEVEL CLUB © 2026
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  PROBLEM                                                */
/* ─────────────────────────────────────────────────────── */
function ProblemSection({ t, sx, c }: { t: Theme; sx: Styles; c: Proposal["customizations"] }) {
  return (
    <section style={{ background: t.cream, padding: "70px 0" }}>
      <div style={sx.page}>
        <span style={sx.kicker}>{c.problemKicker || "למה עכשיו"}</span>
        <h2 style={sx.h2}>
          {c.problemHeadline || "רוב בעלי העסקים עובדים קשה."}{" "}
          <span style={{ color: t.gold }}>לא חכם.</span>
        </h2>
        <div style={sx.divider} />
        <p style={sx.subtitle}>
          {c.problemSubtitle ||
            "הם מוכרים – אבל לא בקביעות. הם מפרסמים תוכן – אבל הוא לא מביא לקוחות. הבעיה היא לא מאמץ. הבעיה היא שחסרה מערכת."}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(c.problems!.length, 3)}, 1fr)`,
            gap: 18,
            marginTop: 12,
          }}
        >
          {c.problems!.map((p, i) => (
            <div
              key={i}
              style={{
                background: t.navy,
                color: t.white,
                padding: "28px 22px 26px",
                borderRight: `3px solid ${t.gold}`,
                borderRadius: 2,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 900,
                  color: t.gold,
                  opacity: 0.4,
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                {p.number}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {p.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  PILLARS (SOLUTION)                                     */
/* ─────────────────────────────────────────────────────── */
function PillarsSection({ t, sx, c }: { t: Theme; sx: Styles; c: Proposal["customizations"] }) {
  return (
    <section style={{ background: t.navy, color: t.white, padding: "80px 0" }}>
      <div style={sx.page}>
        <span style={{ ...sx.kicker, color: t.gold }}>
          {c.solutionKicker || "הפתרון"}
        </span>
        <h2 style={{ ...sx.h2, color: t.white }}>
          {c.solutionHeadline || "הפתרון שמחבר הכל"}
        </h2>
        <div style={sx.divider} />
        <p style={{ ...sx.subtitle, color: "rgba(255,255,255,0.65)" }}>
          {c.solutionSubtitle ||
            "מערכת שלמה שמוטמעת בעסק שלך – לא עוד ידע נפרד. הכל ביחד, הכל מחובר."}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(c.pillars!.length, 2)}, 1fr)`,
            gap: 22,
            marginTop: 30,
          }}
        >
          {c.pillars!.map((p, i) => (
            <div
              key={i}
              style={{
                background: t.navyMid,
                border: `1px solid ${t.gold}30`,
                borderRadius: 6,
                padding: "32px 28px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{p.icon}</div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: t.gold,
                  marginBottom: 8,
                }}
              >
                {p.name}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 16,
                  fontStyle: "italic",
                }}
              >
                {p.tagline}
              </p>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.78)",
                  whiteSpace: "pre-line",
                }}
              >
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  BENEFITS (WHAT'S INCLUDED)                             */
/* ─────────────────────────────────────────────────────── */
function BenefitsSection({ t, sx, c }: { t: Theme; sx: Styles; c: Proposal["customizations"] }) {
  return (
    <section style={{ background: t.cream, padding: "80px 0" }}>
      <div style={sx.page}>
        <span style={sx.kicker}>{c.includesKicker || "מה כלול בתוכנית"}</span>
        <h2 style={sx.h2}>
          {c.includesHeadline || (
            <>
              {c.benefits!.length} חלקים שבונים{" "}
              <span style={{ color: t.gold }}>מערכת שלמה</span>
            </>
          )}
        </h2>
        <div style={sx.divider} />

        <div style={{ marginTop: 40 }}>
          {c.benefits!.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 24,
                marginBottom: 38,
                paddingBottom: 36,
                borderBottom:
                  i < c.benefits!.length - 1
                    ? "1px solid rgba(0,0,0,0.08)"
                    : "none",
              }}
            >
              {/* Hexagonal number */}
              <div
                style={{
                  flexShrink: 0,
                  width: 56,
                  height: 56,
                  background: t.navy,
                  color: t.gold,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 900,
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                }}
              >
                {b.number}
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <h3
                  style={{
                    fontSize: 21,
                    fontWeight: 800,
                    color: t.text,
                    marginBottom: 6,
                  }}
                >
                  {b.title}
                </h3>
                {b.meta && (
                  <p
                    style={{
                      fontSize: 12,
                      color: t.gold,
                      fontWeight: 700,
                      marginBottom: 12,
                      letterSpacing: 0.3,
                    }}
                  >
                    {b.meta}
                  </p>
                )}
                <p
                  style={{
                    fontSize: 14,
                    color: t.textMuted,
                    lineHeight: 1.7,
                    marginBottom: 14,
                  }}
                >
                  {b.description}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {b.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "5px 0",
                        fontSize: 14,
                        color: t.text,
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ color: t.gold, fontWeight: 800, flexShrink: 0 }}>
                        ◆
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  MENTORS                                                */
/* ─────────────────────────────────────────────────────── */
function MentorsSection({ t, sx, c }: { t: Theme; sx: Styles; c: Proposal["customizations"] }) {
  return (
    <section style={{ background: t.navy, color: t.white, padding: "80px 0" }}>
      <div style={sx.page}>
        <span style={{ ...sx.kicker, color: t.gold }}>
          {c.mentorsKicker || "המנטורים"}
        </span>
        <h2 style={{ ...sx.h2, color: t.white }}>
          {c.mentorsHeadline || (
            <>
              המומחים שיבנו איתך את <span style={{ color: t.gold }}>המערכת</span>
            </>
          )}
        </h2>
        <div style={sx.divider} />
        <p style={{ ...sx.subtitle, color: "rgba(255,255,255,0.65)" }}>
          {c.mentorsSubtitle || "מנטורים מובילים. ניסיון מוכח. תוצאות מהשטח."}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(c.mentors!.length, 3)}, 1fr)`,
            gap: 22,
            marginTop: 30,
          }}
        >
          {c.mentors!.map((m, i) => (
            <div
              key={i}
              style={{
                background: t.navyMid,
                border: `1px solid ${t.gold}30`,
                borderRadius: 6,
                padding: "30px 22px 26px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  background: t.navyLight,
                  border: `2px solid ${t.gold}`,
                  margin: "0 auto 16px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  color: t.gold,
                }}
              >
                {m.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  m.name.charAt(0)
                )}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: t.white,
                  marginBottom: 4,
                }}
              >
                {m.name}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: t.gold,
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                {m.role}
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.65,
                }}
              >
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  SOCIAL PROOF                                           */
/* ─────────────────────────────────────────────────────── */
function SocialProofSection({
  t,
  sx,
  c,
}: {
  t: Theme;
  sx: Styles;
  c: Proposal["customizations"];
}) {
  const items = c.socialProofs!;
  return (
    <section style={{ background: t.cream, padding: "80px 0" }}>
      <div style={sx.page}>
        <span style={sx.kicker}>{c.socialProofKicker || "תוצאות מהשטח"}</span>
        <h2 style={sx.h2}>
          {c.socialProofHeadline || (
            <>
              לקוחות שעברו את התהליך{" "}
              <span style={{ color: t.gold }}>וקיבלו תוצאות</span>
            </>
          )}
        </h2>
        <div style={sx.divider} />
        {c.socialProofSubtitle && (
          <p style={sx.subtitle}>{c.socialProofSubtitle}</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: items.length === 1 ? "1fr" : "1fr 1fr",
            gap: 22,
            marginTop: 30,
          }}
        >
          {items.map((p, i) => (
            <div
              key={i}
              style={{
                background: t.white,
                border: `1px solid ${t.gold}30`,
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 18px rgba(10,30,58,0.08)",
              }}
            >
              {p.caption && (
                <div
                  style={{
                    background: t.navy,
                    color: t.gold,
                    padding: "12px 18px",
                    fontSize: 13,
                    fontWeight: 700,
                    textAlign: "center",
                    letterSpacing: 0.5,
                  }}
                >
                  {p.caption}
                </div>
              )}
              {p.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.caption || p.name || "social proof"}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              )}
              {(p.quote || p.name) && (
                <div style={{ padding: "20px 22px" }}>
                  {p.quote && (
                    <p
                      style={{
                        fontSize: 14,
                        color: t.text,
                        lineHeight: 1.7,
                        fontStyle: "italic",
                        marginBottom: p.name ? 12 : 0,
                      }}
                    >
                      &quot;{p.quote}&quot;
                    </p>
                  )}
                  {p.name && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        paddingTop: 12,
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <span
                        style={{
                          color: t.gold,
                          fontSize: 14,
                          fontWeight: 800,
                        }}
                      >
                        ◆
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: t.text,
                          }}
                        >
                          {p.name}
                        </div>
                        {p.role && (
                          <div
                            style={{
                              fontSize: 12,
                              color: t.textMuted,
                            }}
                          >
                            {p.role}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  SYLLABUS                                               */
/* ─────────────────────────────────────────────────────── */
function SyllabusSection({ t, sx, c }: { t: Theme; sx: Styles; c: Proposal["customizations"] }) {
  return (
    <section style={{ background: t.cream, padding: "80px 0" }}>
      <div style={sx.page}>
        <span style={sx.kicker}>{c.syllabusKicker || "סילבוס מלא"}</span>
        <h2 style={sx.h2}>
          {c.syllabusHeadline || (
            <>
              לוח מפגשים מפורט. <span style={{ color: t.gold }}>הכל ברור.</span>
            </>
          )}
        </h2>
        <div style={sx.divider} />

        <div style={{ marginTop: 36 }}>
          {c.syllabusChapters!.map((chapter, ci) => (
            <div key={ci} style={{ marginBottom: 36 }}>
              {/* Chapter header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    background: t.navy,
                    color: t.gold,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 2,
                    padding: "6px 12px",
                    borderRadius: 3,
                  }}
                >
                  {chapter.badge}
                </span>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: t.text,
                    margin: 0,
                  }}
                >
                  {chapter.title}
                </h3>
              </div>

              {/* Items table */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: t.white,
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <thead>
                  <tr style={{ background: t.navy, color: t.gold }}>
                    <th
                      style={{
                        padding: "10px 16px",
                        textAlign: "right",
                        fontSize: 11,
                        letterSpacing: 1,
                        fontWeight: 700,
                        width: 50,
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        padding: "10px 16px",
                        textAlign: "right",
                        fontSize: 11,
                        letterSpacing: 1,
                        fontWeight: 700,
                        width: 90,
                      }}
                    >
                      תאריך
                    </th>
                    <th
                      style={{
                        padding: "10px 16px",
                        textAlign: "right",
                        fontSize: 11,
                        letterSpacing: 1,
                        fontWeight: 700,
                      }}
                    >
                      נושא
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chapter.items.map((item, ii) => (
                    <tr
                      key={ii}
                      style={{
                        background: item.isBreak
                          ? t.navyMid
                          : item.isHighlight
                          ? `${t.gold}15`
                          : ii % 2 === 0
                          ? t.white
                          : "rgba(0,0,0,0.02)",
                        color: item.isBreak ? t.textVeryDim : t.text,
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          fontWeight: 700,
                          color: item.isHighlight ? t.gold : item.isBreak ? t.textDim : t.gold,
                          textAlign: "right",
                        }}
                      >
                        {item.number}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: item.isBreak ? t.textVeryDim : t.textMuted,
                        }}
                      >
                        {item.date}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 14,
                          fontWeight: item.isHighlight ? 800 : item.isBreak ? 400 : 600,
                          fontStyle: item.isBreak ? "italic" : "normal",
                          color: item.isHighlight ? t.text : item.isBreak ? t.textVeryDim : t.text,
                        }}
                      >
                        {item.title}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  INVESTMENT                                             */
/* ─────────────────────────────────────────────────────── */
function InvestmentSection({
  t,
  sx,
  c,
  programName,
  price,
  durationLabel,
  clientName,
}: {
  t: Theme;
  sx: Styles;
  c: Proposal["customizations"];
  programName: string;
  price: string;
  durationLabel: string;
  clientName: string;
}) {
  const includes = c.includes && c.includes.length > 0 ? c.includes : [];
  // split into 2 columns
  const half = Math.ceil(includes.length / 2);
  const colA = includes.slice(0, half);
  const colB = includes.slice(half);

  return (
    <section
      style={{
        background: `linear-gradient(180deg, ${t.navy} 0%, ${t.navyDeep} 100%)`,
        color: t.white,
        padding: "90px 0 70px",
      }}
    >
      <div style={sx.page}>
        <span style={{ ...sx.kicker, color: t.gold }}>
          {c.investmentKicker || "השקעה"}
        </span>
        <h2 style={{ ...sx.h2, color: t.white }}>
          {c.investmentHeadline || (
            <>
              התוכנית <span style={{ color: t.gold }}>המלאה</span>
            </>
          )}
        </h2>
        <div style={sx.divider} />

        <div
          style={{
            background: t.navyMid,
            border: `1px solid ${t.gold}40`,
            borderRadius: 4,
            padding: "44px 38px 38px",
            marginTop: 28,
            position: "relative",
          }}
        >
          {/* Recommended badge */}
          <div
            style={{
              position: "absolute",
              top: -14,
              left: "50%",
              transform: "translateX(-50%)",
              background: t.gold,
              color: t.navy,
              fontSize: 11,
              letterSpacing: 2,
              padding: "5px 18px",
              fontWeight: 800,
              borderRadius: 2,
            }}
          >
            {c.investmentBadge || "✦ מסלול מומלץ"}
          </div>

          <h3
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: t.white,
              textAlign: "center",
              marginBottom: 12,
              marginTop: 4,
            }}
          >
            {programName}
          </h3>

          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: t.gold,
              textAlign: "center",
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            {price} ₪
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.55)",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            + מע&quot;מ | {durationLabel}
          </div>

          {includes.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px 30px",
                marginBottom: 32,
                paddingTop: 24,
                borderTop: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              {[colA, colB].map((col, ci) => (
                <ul key={ci} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "7px 0",
                        fontSize: 13.5,
                        color: "rgba(255,255,255,0.85)",
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: t.gold, fontWeight: 800, flexShrink: 0 }}>
                        ✓
                      </span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          )}

          {/* CTA */}
          <div
            style={{
              background: `linear-gradient(135deg, ${t.gold} 0%, ${t.goldLight} 100%)`,
              color: t.navy,
              fontSize: 17,
              fontWeight: 800,
              padding: "16px 0",
              textAlign: "center",
              borderRadius: 4,
              marginTop: 12,
              boxShadow: "0 4px 20px rgba(212,175,55,0.25)",
            }}
          >
            {c.ctaText || "אני רוצה להצטרף לתוכנית ←"}
          </div>

          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            {c.paymentNote ||
              'ניתן לפרוס לתשלומים · אשראי / הו"ק בנקאית / תשלום אחד עם הנחה'}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 60,
            paddingTop: 30,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: t.white,
              marginBottom: 4,
            }}
          >
            {c.footerBrand || "Next Level Club"}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {c.footerNote || "הצעה זו הוכנה עבורך בלבד"}
            {clientName ? ` · ${clientName}` : ""} | © 2026 Next Level Club
          </div>
        </div>
      </div>
    </section>
  );
}
