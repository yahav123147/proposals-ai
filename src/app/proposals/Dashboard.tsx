"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  Proposal,
  SalesRep,
  ProposalStatus,
  TemplateConfig,
  CustomTemplate,
} from "./lib/types";
import { TEMPLATES } from "./lib/templates";

interface Props {
  salesRep: SalesRep;
  proposals: Proposal[];
  allProposals: Proposal[];
  builtInTemplates: TemplateConfig[];
  customTemplates: CustomTemplate[];
}

const STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: "טיוטה",
  sent: "נשלחה",
  viewed: "נצפתה",
  approved: "אושרה",
  rejected: "נסלקה",
  expired: "פגה",
};

const STATUS_COLORS: Record<ProposalStatus, { bg: string; color: string }> = {
  draft: { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
  sent: { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
  viewed: { bg: "rgba(168,85,247,0.15)", color: "#a855f7" },
  approved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
  expired: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
};

export function Dashboard({
  salesRep,
  proposals,
  allProposals,
  builtInTemplates,
  customTemplates,
}: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | ProposalStatus>("all");
  const [search, setSearch] = useState("");

  const isAdmin = salesRep.role === "admin";

  // Counts per status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: proposals.length };
    for (const p of proposals) {
      counts[p.status] = (counts[p.status] || 0) + 1;
    }
    return counts;
  }, [proposals]);

  const list = useMemo(() => {
    let result = filter === "all" ? proposals : proposals.filter((p) => p.status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.clientName.toLowerCase().includes(q) ||
          (p.clientCompany || "").toLowerCase().includes(q) ||
          (p.clientEmail || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [proposals, filter, search]);

  const stats = useMemo(() => {
    const all = isAdmin ? allProposals : proposals;
    const now = Date.now();
    const startMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    const thisMonth = all.filter((p) => new Date(p.createdAt).getTime() >= startMonth);
    const viewed = all.filter((p) => p.totalViews > 0);
    const approved = all.filter((p) => p.status === "approved");
    const sent = all.filter((p) => p.status !== "draft");
    const totalValue = all
      .filter((p) => p.status !== "rejected" && p.status !== "expired")
      .reduce((s, p) => s + p.programPrice, 0);
    return {
      thisMonthCount: thisMonth.length,
      viewRate: sent.length ? Math.round((viewed.length / sent.length) * 100) : 0,
      closeRate: sent.length ? Math.round((approved.length / sent.length) * 100) : 0,
      totalValue,
    };
  }, [allProposals, proposals, isAdmin]);

  const leaderboard = useMemo(() => {
    if (!isAdmin) return null;
    const map = new Map<string, { count: number; approved: number; value: number }>();
    for (const p of allProposals) {
      const k = p.salesRepName;
      const cur = map.get(k) || { count: 0, approved: 0, value: 0 };
      cur.count += 1;
      if (p.status === "approved") cur.approved += 1;
      if (p.status !== "rejected" && p.status !== "expired") cur.value += p.programPrice;
      map.set(k, cur);
    }
    return Array.from(map.entries())
      .map(([name, s]) => ({ name, ...s }))
      .sort((a, b) => b.count - a.count);
  }, [allProposals, isAdmin]);

  async function logout() {
    await fetch("/api/proposals/auth", { method: "DELETE" });
    router.push("/proposals/login");
    router.refresh();
  }

  async function copyLink(shortCode: string) {
    const url = `${window.location.origin}/p/${shortCode}`;
    await navigator.clipboard.writeText(url);
    alert("הקישור הועתק:\n" + url);
  }

  async function deleteProposal(id: string, clientName: string) {
    if (!confirm(`למחוק את ההצעה ל"${clientName}"?`)) return;
    const res = await fetch(`/api/proposals/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  async function duplicateProposal(id: string) {
    const res = await fetch(`/api/proposals/${id}/duplicate`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/proposals/${data.proposal.id}/edit`);
    } else {
      alert("שגיאה בשכפול ההצעה");
    }
  }

  function sendWhatsApp(p: Proposal) {
    const url = `${window.location.origin}/p/${p.shortCode}`;
    const tplName = TEMPLATES[p.templateId]?.name || "ההצעה";
    const message = `שלום ${p.clientName || ""},\n\nכמובטח בשיחה שלנו, מצורפת הצעת מחיר עבור ${tplName}:\n${url}\n\nאני זמין/ה לכל שאלה.`;
    const phone = (p.clientPhone || "").replace(/\D/g, "");
    const waUrl = phone
      ? `https://wa.me/${phone.startsWith("0") ? "972" + phone.slice(1) : phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
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
      {/* Header */}
      <header
        style={{
          background: "#141414",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #6B4FA0, #8B6FC0)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            📄
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>מערכת הצעות מחיר</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Next Level</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/proposals/new"
            style={{
              background: "linear-gradient(135deg, #6B4FA0, #8B6FC0)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            + הצעה חדשה
          </Link>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            {salesRep.name} {isAdmin && "(מנהל)"}
          </div>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              padding: "8px 14px",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            יציאה
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px" }}>
        {/* KPIs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <Kpi label="הצעות החודש" value={stats.thisMonthCount.toString()} />
          <Kpi label="אחוז צפייה" value={`${stats.viewRate}%`} />
          <Kpi label="אחוז סגירה" value={`${stats.closeRate}%`} />
          <Kpi
            label="ערך כולל בצנרת"
            value={`₪ ${stats.totalValue.toLocaleString("he-IL")}`}
          />
        </div>

        {/* Quick start — proposals from templates in one click */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 14,
            }}
          >
            ⚡ הצעה חדשה במהירות
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {/* Custom templates first */}
            {customTemplates.map((c) => (
              <Link
                key={c.id}
                href={`/proposals/new?customTemplate=${c.id}`}
                style={quickCardStyle("#d4af37")}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#d4af37",
                    fontWeight: 700,
                    marginBottom: 6,
                    letterSpacing: 1,
                  }}
                >
                  ★ תבנית מוכנה
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 12, color: "#d4af37", fontWeight: 700 }}>
                  {c.programPrice.toLocaleString("he-IL")} ₪
                </div>
              </Link>
            ))}
            {/* Built-in templates */}
            {builtInTemplates.map((t) => (
              <Link
                key={t.id}
                href={`/proposals/new?template=${t.id}`}
                style={quickCardStyle(t.primaryColor)}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: t.primaryColor,
                    fontWeight: 700,
                    marginBottom: 6,
                    letterSpacing: 1,
                  }}
                >
                  + הצעה חדשה
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 12, color: t.primaryColor, fontWeight: 700 }}>
                  {t.defaultPrice.toLocaleString("he-IL")} ₪
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search + Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 חיפוש לפי שם לקוח, חברה, אימייל…"
            style={{
              flex: "1 1 280px",
              padding: "9px 14px",
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              color: "#fff",
              fontSize: 13,
              fontFamily: "inherit",
              direction: "rtl",
            }}
          />
          {(["all", "draft", "sent", "viewed", "approved", "rejected", "expired"] as const).map(
            (f) => {
              const count = statusCounts[f] || 0;
              if (f !== "all" && count === 0) return null;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background:
                      filter === f
                        ? "rgba(107,79,160,0.3)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${filter === f ? "rgba(107,79,160,0.6)" : "rgba(255,255,255,0.08)"}`,
                    color: "#fff",
                    padding: "7px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {f === "all" ? "הכל" : STATUS_LABELS[f]}
                  <span
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      padding: "1px 7px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Proposals table */}
        <div
          style={{
            background: "#141414",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          {list.length === 0 ? (
            <div
              style={{
                padding: 60,
                textAlign: "center",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {search || filter !== "all" ? "🔍" : "📄"}
              </div>
              <p style={{ fontSize: 16 }}>
                {search
                  ? `אין תוצאות עבור "${search}"`
                  : filter !== "all"
                  ? `אין הצעות בסטטוס "${STATUS_LABELS[filter]}"`
                  : "אין הצעות עדיין"}
              </p>
              <p style={{ fontSize: 13, marginTop: 8 }}>
                {search || filter !== "all"
                  ? "נסה לשנות את הפילטרים"
                  : "בחר תבנית מהכרטיסים למעלה כדי להתחיל"}
              </p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  <Th>לקוח</Th>
                  <Th>תבנית</Th>
                  {isAdmin && <Th>איש מכירות</Th>}
                  <Th>סכום</Th>
                  <Th>סטטוס</Th>
                  <Th>צפיות</Th>
                  <Th>נוצר</Th>
                  <Th>פעולות</Th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => {
                  const tpl = TEMPLATES[p.templateId];
                  const status = STATUS_COLORS[p.status];
                  return (
                    <tr
                      key={p.id}
                      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <Td>
                        <div style={{ fontWeight: 600 }}>
                          {p.clientName || "(ללא שם)"}
                        </div>
                        {p.clientCompany && (
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                            {p.clientCompany}
                          </div>
                        )}
                      </Td>
                      <Td>
                        <span style={{ fontSize: 13 }}>{tpl.name}</span>
                      </Td>
                      {isAdmin && (
                        <Td>
                          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                            {p.salesRepName}
                          </span>
                        </Td>
                      )}
                      <Td>
                        <span style={{ fontWeight: 700 }}>
                          ₪ {p.programPrice.toLocaleString("he-IL")}
                        </span>
                      </Td>
                      <Td>
                        <span
                          style={{
                            display: "inline-block",
                            background: status.bg,
                            color: status.color,
                            padding: "4px 10px",
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {STATUS_LABELS[p.status]}
                        </span>
                      </Td>
                      <Td>
                        <span style={{ fontSize: 13 }}>
                          {p.totalViews}
                          {p.firstViewedAt && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "rgba(255,255,255,0.4)",
                                marginRight: 4,
                              }}
                            >
                              · {new Date(p.lastViewedAt!).toLocaleDateString("he-IL")}
                            </span>
                          )}
                        </span>
                      </Td>
                      <Td>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                          {new Date(p.createdAt).toLocaleDateString("he-IL")}
                        </span>
                      </Td>
                      <Td>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <button
                            onClick={() => sendWhatsApp(p)}
                            title="שלח בוואטסאפ"
                            style={iconBtn}
                          >
                            💬
                          </button>
                          <button
                            onClick={() => copyLink(p.shortCode)}
                            title="העתק קישור"
                            style={iconBtn}
                          >
                            🔗
                          </button>
                          <Link href={`/p/${p.shortCode}`} target="_blank" style={iconBtnLink} title="פתח כלקוח">
                            👁
                          </Link>
                          <Link href={`/proposals/${p.id}/edit`} style={iconBtnLink} title="ערוך">
                            ✏️
                          </Link>
                          <button
                            onClick={() => duplicateProposal(p.id)}
                            title="שכפל הצעה"
                            style={iconBtn}
                          >
                            📋
                          </button>
                          <button
                            onClick={() => deleteProposal(p.id, p.clientName || "")}
                            title="מחק"
                            style={iconBtn}
                          >
                            🗑
                          </button>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Admin: leaderboard */}
        {isAdmin && leaderboard && leaderboard.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
              ביצועי אנשי מכירות
            </h2>
            <div
              style={{
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: 24,
              }}
            >
              {leaderboard.map((rep, i) => (
                <div
                  key={rep.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto auto auto",
                    gap: 16,
                    padding: "12px 0",
                    borderBottom:
                      i < leaderboard.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background:
                        i === 0
                          ? "#fbbf24"
                          : i === 1
                          ? "#94a3b8"
                          : i === 2
                          ? "#b45309"
                          : "rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 13,
                      color: i < 3 ? "#0a0a0a" : "#fff",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ fontWeight: 600 }}>{rep.name}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    {rep.count} הצעות
                  </div>
                  <div style={{ fontSize: 13, color: "#22c55e" }}>
                    {rep.approved} סגירות
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    ₪ {rep.value.toLocaleString("he-IL")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: "20px 22px",
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: "12px 16px",
        textAlign: "right",
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: "rgba(255,255,255,0.45)",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "14px 16px", fontSize: 14 }}>{children}</td>;
}

const iconBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 14,
  fontFamily: "inherit",
};

const iconBtnLink: React.CSSProperties = {
  ...iconBtn,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

function quickCardStyle(accent: string): React.CSSProperties {
  return {
    background: "#141414",
    border: `1px solid rgba(255,255,255,0.08)`,
    borderRight: `3px solid ${accent}`,
    borderRadius: 10,
    padding: "16px 18px",
    textDecoration: "none",
    display: "block",
    transition: "all 0.15s",
    cursor: "pointer",
  };
}
