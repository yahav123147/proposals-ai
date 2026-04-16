"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type {
  CustomTemplate,
  SalesRep,
  TemplateConfig,
  TemplateId,
} from "../lib/types";

interface Props {
  salesRep: SalesRep;
  templates: TemplateConfig[];
  customTemplates: CustomTemplate[];
}

export function NewProposalForm({
  salesRep,
  templates,
  customTemplates: initialCustomTemplates,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customTemplates, setCustomTemplates] = useState(initialCustomTemplates);
  const [step, setStep] = useState<"template" | "details">("template");
  const [templateId, setTemplateId] = useState<TemplateId | "">("");
  const [customTemplateId, setCustomTemplateId] = useState<string>("");
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [programPrice, setProgramPrice] = useState("");
  const [validityDays, setValidityDays] = useState("7");
  const [letterBody, setLetterBody] = useState("");
  const [paymentTerms, setPaymentTerms] = useState(
    "ניתן לשלם עד 3 תשלומים ללא ריבית"
  );
  const [submitting, setSubmitting] = useState(false);

  const selected = customTemplateId
    ? customTemplates.find((c) => c.id === customTemplateId)
    : templates.find((t) => t.id === templateId);

  const selectedName = selected
    ? "name" in selected
      ? selected.name
      : ""
    : "";
  const selectedColor = customTemplateId
    ? "#d4af37"
    : (selected as TemplateConfig | undefined)?.primaryColor || "#d4af37";

  // Auto-pick template from query string (deep link from dashboard quick cards)
  useEffect(() => {
    const tplParam = searchParams.get("template");
    const customParam = searchParams.get("customTemplate");
    if (customParam) {
      const c = customTemplates.find((cc) => cc.id === customParam);
      if (c) pickCustomTemplate(c);
    } else if (tplParam) {
      const t = templates.find((tt) => tt.id === tplParam);
      if (t) pickTemplate(t.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pickTemplate(id: TemplateId) {
    const t = templates.find((tt) => tt.id === id);
    if (!t) return;
    setTemplateId(id);
    setCustomTemplateId("");
    setProgramPrice(t.defaultPrice.toString());
    setLetterBody(t.defaultLetter);
    setStep("details");
  }

  function pickCustomTemplate(c: CustomTemplate) {
    setCustomTemplateId(c.id);
    setTemplateId(c.baseTemplateId);
    setProgramPrice(c.programPrice.toString());
    setLetterBody(c.customizations.letterBody || "");
    setStep("details");
  }

  async function deleteCustomTemplate(id: string, name: string) {
    if (!confirm(`למחוק את התבנית "${name}"?`)) return;
    const res = await fetch(`/api/proposals/templates/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCustomTemplates((arr) => arr.filter((t) => t.id !== id));
    } else {
      alert("שגיאה במחיקת התבנית");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!templateId && !customTemplateId) return;
    setSubmitting(true);
    const body: Record<string, unknown> = {
      clientName,
      clientCompany,
      clientEmail,
      clientPhone,
      programPrice: Number(programPrice),
      validityDays: Number(validityDays),
      customizations: customTemplateId
        ? // For custom templates: don't override letterBody/paymentTerms here,
          // they're already in the saved template's customizations.
          {}
        : { letterBody, paymentTerms },
    };
    if (customTemplateId) body.customTemplateId = customTemplateId;
    else body.templateId = templateId;

    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/proposals/${data.proposal.id}/edit`);
    } else {
      alert("שגיאה ביצירת ההצעה");
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Assistant', sans-serif",
        direction: "rtl",
      }}
    >
      <header
        style={{
          background: "#141414",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Link
          href="/proposals"
          style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 14 }}
        >
          ← חזור
        </Link>
        <span style={{ fontSize: 16, fontWeight: 700 }}>הצעה חדשה</span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginRight: "auto" }}>
          {salesRep.name}
        </span>
      </header>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: 40 }}>
        {step === "template" && (
          <>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
              איזה הצעה אתם רוצים ליצור?
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 30 }}>
              בחרו תבנית ונמשיך לפרטים
            </p>

            {/* Custom (saved) templates first — these are the actual ready-to-go presets */}
            {customTemplates.length > 0 && (
              <>
                <h2
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#d4af37",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 14,
                  }}
                >
                  ★ התבניות שלי (מוכנות)
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 16,
                    marginBottom: 36,
                  }}
                >
                  {customTemplates.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        background: "#141414",
                        border: "1px solid rgba(212,175,55,0.3)",
                        borderRadius: 14,
                        padding: 24,
                        position: "relative",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          deleteCustomTemplate(c.id, c.name)
                        }
                        title="מחק"
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          width: 26,
                          height: 26,
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.3)",
                          borderRadius: 6,
                          color: "#ef4444",
                          fontSize: 12,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        onClick={() => pickCustomTemplate(c)}
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: 0,
                          textAlign: "right",
                          cursor: "pointer",
                          color: "#fff",
                          fontFamily: "inherit",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 14,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 18,
                              color: "#d4af37",
                              fontWeight: 800,
                            }}
                          >
                            ★
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: "rgba(255,255,255,0.4)",
                              textTransform: "uppercase",
                              letterSpacing: 1,
                            }}
                          >
                            תבנית מוכנה
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            marginBottom: 6,
                          }}
                        >
                          {c.name}
                        </div>
                        {c.description && (
                          <div
                            style={{
                              fontSize: 13,
                              color: "rgba(255,255,255,0.55)",
                              lineHeight: 1.5,
                              marginBottom: 14,
                            }}
                          >
                            {c.description}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: 13,
                            color: "#d4af37",
                            fontWeight: 700,
                          }}
                        >
                          {c.programPrice.toLocaleString("he-IL")} ₪
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.3)",
                            marginTop: 8,
                          }}
                        >
                          נוצר ע&quot;י {c.createdBy}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
                <h2
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 14,
                  }}
                >
                  תבניות בסיס
                </h2>
              </>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
              }}
            >
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => pickTemplate(t.id)}
                  style={{
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: 24,
                    textAlign: "right",
                    cursor: "pointer",
                    color: "#fff",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = t.primaryColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: t.primaryColor,
                      marginBottom: 14,
                    }}
                  />
                  <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
                    {t.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.5,
                      marginBottom: 14,
                    }}
                  >
                    {t.description}
                  </div>
                  <div style={{ fontSize: 13, color: t.primaryColor, fontWeight: 700 }}>
                    החל מ-{t.defaultPrice.toLocaleString("he-IL")} ₪
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "details" && selected && (
          <form onSubmit={submit}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 30,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: selectedColor,
                }}
              />
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>
                  {selectedName}
                  {customTemplateId && (
                    <span
                      style={{
                        marginRight: 8,
                        fontSize: 11,
                        background: "rgba(212,175,55,0.15)",
                        color: "#d4af37",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontWeight: 700,
                      }}
                    >
                      ★ תבנית מוכנה
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStep("template")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 12,
                    cursor: "pointer",
                    padding: 0,
                    marginTop: 2,
                    fontFamily: "inherit",
                  }}
                >
                  שנה תבנית
                </button>
              </div>
            </div>

            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: 28,
                marginBottom: 24,
              }}
            >
              <h3 style={sectionTitle}>פרטי לקוח</h3>
              <Field label="שם הלקוח/ה *" value={clientName} onChange={setClientName} required />
              <Field label="חברה" value={clientCompany} onChange={setClientCompany} />
              <Field label="אימייל" value={clientEmail} onChange={setClientEmail} />
              <Field label="טלפון" value={clientPhone} onChange={setClientPhone} />
            </div>

            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: 28,
                marginBottom: 24,
              }}
            >
              <h3 style={sectionTitle}>תמחור</h3>
              <Field
                label="מחיר התכנית (₪) *"
                value={programPrice}
                onChange={setProgramPrice}
                required
              />
              <Field label="תוקף ההצעה (ימים)" value={validityDays} onChange={setValidityDays} />
              {!customTemplateId && (
                <Field
                  label="תנאי תשלום"
                  value={paymentTerms}
                  onChange={setPaymentTerms}
                />
              )}
            </div>

            {!customTemplateId && (
            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: 28,
                marginBottom: 24,
              }}
            >
              <h3 style={sectionTitle}>מכתב אישי</h3>
              <Field
                label="גוף המכתב"
                value={letterBody}
                onChange={setLetterBody}
                multiline
                rows={10}
              />
            </div>
            )}

            {customTemplateId && (
              <div
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  borderRadius: 14,
                  padding: 18,
                  marginBottom: 24,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: "#d4af37" }}>★ תבנית מוכנה</strong> —
                כל התוכן (מכתב, בונוסים, מנטורים, סילבוס, צבעים, תמונות) כבר
                שמור בתבנית. אחרי היצירה תוכל לערוך כל פרט.
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                disabled={submitting || !clientName || !programPrice}
                style={{
                  background: "linear-gradient(135deg, #6B4FA0, #8B6FC0)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "14px 32px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: submitting ? "wait" : "pointer",
                  fontFamily: "inherit",
                  opacity: !clientName || !programPrice ? 0.5 : 1,
                }}
              >
                {submitting ? "יוצר…" : "צור הצעה"}
              </button>
              <Link
                href="/proposals"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                  padding: "14px 24px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                ביטול
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "rgba(255,255,255,0.5)",
  textTransform: "uppercase",
  letterSpacing: 1,
  marginBottom: 16,
};

function Field({
  label,
  value,
  onChange,
  multiline,
  rows,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows || 4}
          required={required}
          style={{
            width: "100%",
            padding: "10px 12px",
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
          required={required}
          style={{
            width: "100%",
            padding: "10px 12px",
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
