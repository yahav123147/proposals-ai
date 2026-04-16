"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  Proposal,
  SalesRep,
  PremiumMentor,
  PremiumSocialProof,
} from "../../lib/types";
import { TEMPLATES } from "../../lib/templates";
import { TemplateRenderer } from "../../templates/TemplateRenderer";
import { MentorEditor } from "./MentorEditor";
import { SocialProofEditor } from "./SocialProofEditor";

interface Props {
  proposal: Proposal;
  salesRep: SalesRep;
}

export function EditProposalForm({ proposal: initial, salesRep }: Props) {
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const template = TEMPLATES[proposal.templateId];

  function update<K extends keyof Proposal>(field: K, value: Proposal[K]) {
    setProposal((p) => ({ ...p, [field]: value }));
    setSavedAt(null);
  }

  function updateCustomization(
    field: keyof Proposal["customizations"],
    value: unknown
  ) {
    setProposal((p) => ({
      ...p,
      customizations: { ...p.customizations, [field]: value },
    }));
    setSavedAt(null);
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/proposals/${proposal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: proposal.clientName,
        clientCompany: proposal.clientCompany,
        clientEmail: proposal.clientEmail,
        clientPhone: proposal.clientPhone,
        programPrice: proposal.programPrice,
        customizations: proposal.customizations,
        status: proposal.status,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setProposal(data.proposal);
      setSavedAt(Date.now());
    } else {
      alert("שגיאה בשמירה");
    }
    setSaving(false);
  }

  async function copyLink() {
    const url = `${window.location.origin}/p/${proposal.shortCode}`;
    await navigator.clipboard.writeText(url);
    alert("הקישור הועתק:\n" + url);
  }

  async function saveAsTemplate() {
    const name = prompt(
      "שם התבנית החדשה:",
      proposal.customizations.programName || template.name
    );
    if (!name) return;
    const description = prompt("תיאור קצר (אופציונלי):", "") || "";
    const res = await fetch("/api/proposals/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        baseTemplateId: proposal.templateId,
        programPrice: proposal.programPrice,
        customizations: proposal.customizations,
      }),
    });
    if (res.ok) {
      alert(`✓ התבנית "${name}" נשמרה בהצלחה!\n\nתוכל להשתמש בה ביצירת הצעות חדשות.`);
    } else {
      alert("שגיאה בשמירת התבנית");
    }
  }

  async function markSent() {
    setSaving(true);
    const res = await fetch(`/api/proposals/${proposal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "sent",
        sentAt: new Date().toISOString(),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setProposal(data.proposal);
    }
    setSaving(false);
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        direction: "rtl",
        background: "#0f0f0f",
        fontFamily: "'Assistant', sans-serif",
        color: "#fff",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 360,
          minWidth: 360,
          background: "#141414",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Link
            href="/proposals"
            style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}
          >
            ←
          </Link>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{template.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
              {salesRep.name}
            </div>
          </div>
          {savedAt && (
            <span style={{ fontSize: 11, color: "#22c55e" }}>✓ נשמר</span>
          )}
        </div>

        <div
          style={{
            padding: "12px 20px",
            display: "flex",
            gap: 8,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={save}
            disabled={saving}
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #6B4FA0, #8B6FC0)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "9px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: saving ? "wait" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {saving ? "שומר…" : "💾 שמור"}
          </button>
          <button onClick={copyLink} style={smallBtn}>
            🔗 קישור
          </button>
        </div>

        <div
          style={{
            padding: "0 20px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={saveAsTemplate}
            style={{
              ...smallBtn,
              width: "100%",
              background: "rgba(212,175,55,0.12)",
              borderColor: "rgba(212,175,55,0.4)",
              color: "#d4af37",
              fontWeight: 700,
            }}
          >
            ★ שמור כתבנית מוכנה
          </button>
        </div>

        <div
          style={{
            padding: "10px 20px",
            display: "flex",
            gap: 8,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: 12,
          }}
        >
          <a
            href={`/p/${proposal.shortCode}`}
            target="_blank"
            rel="noreferrer"
            style={{
              ...smallBtn,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            👁 פתח כלקוח
          </a>
          {proposal.status === "draft" && (
            <button onClick={markSent} style={{ ...smallBtn, background: "rgba(34,197,94,0.15)", borderColor: "rgba(34,197,94,0.4)", color: "#22c55e" }}>
              ✓ סמן כנשלח
            </button>
          )}
        </div>

        {/* Stats summary */}
        <div
          style={{
            padding: "16px 20px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            fontSize: 12,
          }}
        >
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>סטטוס:</span>{" "}
            <strong>{proposal.status}</strong>
          </div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>צפיות:</span>{" "}
            <strong>{proposal.totalViews}</strong>
            {proposal.firstViewedAt && (
              <span style={{ color: "rgba(255,255,255,0.5)", marginRight: 4 }}>
                · נצפה לראשונה {new Date(proposal.firstViewedAt).toLocaleString("he-IL")}
              </span>
            )}
          </div>
        </div>

        {/* Form fields */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0 20px" }}>
          <Accordion title="פרטי לקוח" defaultOpen>
            <SidebarField
              label="שם הלקוח"
              value={proposal.clientName}
              onChange={(v) => update("clientName", v)}
            />
            <SidebarField
              label="חברה"
              value={proposal.clientCompany || ""}
              onChange={(v) => update("clientCompany", v)}
            />
            <SidebarField
              label="אימייל"
              value={proposal.clientEmail || ""}
              onChange={(v) => update("clientEmail", v)}
            />
            <SidebarField
              label="טלפון"
              value={proposal.clientPhone || ""}
              onChange={(v) => update("clientPhone", v)}
            />
          </Accordion>

          <Accordion title="צבעי עיצוב">
            <ColorPickerField
              label="צבע ראשי (כהה)"
              value={proposal.customizations.themeNavy || "#0a1e3a"}
              onChange={(v) => updateCustomization("themeNavy", v)}
              presets={["#0a1e3a", "#0a0a0a", "#1a3a1a", "#3a0a1a", "#1e1a3a", "#3a2a0a"]}
            />
            <ColorPickerField
              label="צבע אקסנט (זהב/הדגשה)"
              value={proposal.customizations.themeGold || "#d4af37"}
              onChange={(v) => updateCustomization("themeGold", v)}
              presets={["#d4af37", "#A78BFA", "#22c55e", "#ef4444", "#3b82f6", "#f59e0b"]}
            />
            <ColorPickerField
              label="צבע רקע בהיר"
              value={proposal.customizations.themeCream || "#f5f1e8"}
              onChange={(v) => updateCustomization("themeCream", v)}
              presets={["#f5f1e8", "#f5f5f5", "#fef3c7", "#ecfdf5", "#eff6ff", "#fdf2f8"]}
            />
          </Accordion>

          <Accordion title="כותרת ראשית">
            <SidebarField
              label="שם התוכנית"
              value={proposal.customizations.programName || ""}
              onChange={(v) => updateCustomization("programName", v)}
            />
            <SidebarField
              label="טאגליין"
              value={proposal.customizations.tagline || ""}
              onChange={(v) => updateCustomization("tagline", v)}
            />
            <SidebarField
              label="תיאור (Cover)"
              value={proposal.customizations.coverDescription || ""}
              onChange={(v) => updateCustomization("coverDescription", v)}
              multiline
              rows={4}
            />
            <SidebarField
              label="משך התוכנית"
              value={proposal.customizations.durationLabel || ""}
              onChange={(v) => updateCustomization("durationLabel", v)}
            />
          </Accordion>

          <Accordion title="מחיר">
            <SidebarField
              label="מחיר (₪)"
              value={proposal.programPrice.toString()}
              onChange={(v) => update("programPrice", Number(v) || 0)}
            />
            <SidebarField
              label="הערת תשלום"
              value={proposal.customizations.paymentNote || ""}
              onChange={(v) => updateCustomization("paymentNote", v)}
            />
            <SidebarField
              label="טקסט כפתור CTA"
              value={proposal.customizations.ctaText || ""}
              onChange={(v) => updateCustomization("ctaText", v)}
            />
          </Accordion>

          <Accordion title="למה עכשיו (בעיות)">
            <SidebarField
              label="כותרת"
              value={proposal.customizations.problemHeadline || ""}
              onChange={(v) => updateCustomization("problemHeadline", v)}
            />
            <SidebarField
              label="תיאור"
              value={proposal.customizations.problemSubtitle || ""}
              onChange={(v) => updateCustomization("problemSubtitle", v)}
              multiline
              rows={3}
            />
            <JsonField
              label="3 בעיות (JSON)"
              value={proposal.customizations.problems}
              onChange={(v) => updateCustomization("problems", v)}
              rows={8}
            />
          </Accordion>

          <Accordion title="הפתרון (עמודים)">
            <SidebarField
              label="כותרת"
              value={proposal.customizations.solutionHeadline || ""}
              onChange={(v) => updateCustomization("solutionHeadline", v)}
            />
            <SidebarField
              label="תיאור"
              value={proposal.customizations.solutionSubtitle || ""}
              onChange={(v) => updateCustomization("solutionSubtitle", v)}
              multiline
              rows={3}
            />
            <JsonField
              label="עמודים (JSON)"
              value={proposal.customizations.pillars}
              onChange={(v) => updateCustomization("pillars", v)}
              rows={10}
            />
          </Accordion>

          <Accordion title="מה כלול (חלקים)">
            <SidebarField
              label="כותרת"
              value={proposal.customizations.includesHeadline || ""}
              onChange={(v) => updateCustomization("includesHeadline", v)}
            />
            <JsonField
              label="חלקים מפורטים (JSON)"
              value={proposal.customizations.benefits}
              onChange={(v) => updateCustomization("benefits", v)}
              rows={14}
            />
          </Accordion>

          <Accordion title="מנטורים" defaultOpen>
            <SidebarField
              label="כותרת"
              value={proposal.customizations.mentorsHeadline || ""}
              onChange={(v) => updateCustomization("mentorsHeadline", v)}
            />
            <SidebarField
              label="תיאור"
              value={proposal.customizations.mentorsSubtitle || ""}
              onChange={(v) => updateCustomization("mentorsSubtitle", v)}
              multiline
              rows={2}
            />
            <MentorEditor
              mentors={proposal.customizations.mentors || []}
              onChange={(v: PremiumMentor[]) => updateCustomization("mentors", v)}
            />
          </Accordion>

          <Accordion title="הוכחות חברתיות ותמונות">
            <SidebarField
              label="כותרת קטנה (Kicker)"
              value={proposal.customizations.socialProofKicker || ""}
              onChange={(v) => updateCustomization("socialProofKicker", v)}
            />
            <SidebarField
              label="כותרת"
              value={proposal.customizations.socialProofHeadline || ""}
              onChange={(v) => updateCustomization("socialProofHeadline", v)}
            />
            <SidebarField
              label="תיאור"
              value={proposal.customizations.socialProofSubtitle || ""}
              onChange={(v) => updateCustomization("socialProofSubtitle", v)}
              multiline
              rows={2}
            />
            <SocialProofEditor
              items={proposal.customizations.socialProofs || []}
              onChange={(v: PremiumSocialProof[]) =>
                updateCustomization("socialProofs", v)
              }
            />
          </Accordion>

          <Accordion title="סילבוס">
            <SidebarField
              label="כותרת"
              value={proposal.customizations.syllabusHeadline || ""}
              onChange={(v) => updateCustomization("syllabusHeadline", v)}
            />
            <JsonField
              label="פרקי סילבוס (JSON)"
              value={proposal.customizations.syllabusChapters}
              onChange={(v) => updateCustomization("syllabusChapters", v)}
              rows={20}
            />
          </Accordion>

          <Accordion title="רשימת כלול בכרטיס מחיר">
            <JsonField
              label="פריטים (JSON)"
              value={proposal.customizations.includes}
              onChange={(v) => updateCustomization("includes", v)}
              rows={12}
            />
          </Accordion>
        </div>
      </aside>

      {/* Preview */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#1a1a1a",
          padding: "32px 40px",
        }}
      >
        <div
          style={{
            maxWidth: 840,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6)",
          }}
        >
          <TemplateRenderer proposal={proposal} />
        </div>
        <div style={{ height: 60 }} />
      </main>
    </div>
  );
}

const smallBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  padding: "9px 14px",
  borderRadius: 8,
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "inherit",
};

function ColorPickerField({
  label,
  value,
  onChange,
  presets,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  presets?: string[];
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          marginBottom: 5,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 44,
            height: 36,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            background: "transparent",
            cursor: "pointer",
            padding: 2,
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          style={{
            flex: 1,
            padding: "9px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#fff",
            fontSize: 13,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            direction: "ltr",
          }}
        />
      </div>
      {presets && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              title={p}
              style={{
                width: 24,
                height: 24,
                background: p,
                border:
                  value.toLowerCase() === p.toLowerCase()
                    ? "2px solid #fff"
                    : "1px solid rgba(255,255,255,0.2)",
                borderRadius: 6,
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Accordion({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.7)",
          padding: "12px 20px",
          fontSize: 13,
          fontWeight: 700,
          textAlign: "right",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            fontSize: 10,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          ▾
        </span>
        <span style={{ flex: 1 }}>{title}</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 16px" }}>{children}</div>
      )}
    </div>
  );
}

function JsonField({
  label,
  value,
  onChange,
  rows = 6,
}: {
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  rows?: number;
}) {
  const [text, setText] = useState(JSON.stringify(value ?? [], null, 2));
  const [error, setError] = useState("");

  // Sync external changes
  // (only when value reference changes externally, not on local edits)
  // We rely on the parent to give a fresh prop after save.

  function handleChange(v: string) {
    setText(v);
    try {
      const parsed = JSON.parse(v);
      setError("");
      onChange(parsed);
    } catch {
      setError("JSON לא תקין");
    }
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          marginBottom: 5,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={rows}
        spellCheck={false}
        style={{
          width: "100%",
          padding: "9px 12px",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 8,
          color: "#fff",
          fontSize: 11,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          resize: "vertical",
          lineHeight: 1.5,
          direction: "ltr",
        }}
      />
      {error && (
        <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
}

function SidebarField({
  label,
  value,
  onChange,
  multiline,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          marginBottom: 5,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 4}
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            fontFamily: "inherit",
            resize: "vertical",
            lineHeight: 1.6,
            direction: "rtl",
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "9px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            fontFamily: "inherit",
            direction: "rtl",
          }}
        />
      )}
    </div>
  );
}
