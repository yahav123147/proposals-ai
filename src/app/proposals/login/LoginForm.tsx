"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SalesRep } from "../lib/types";

export function LoginForm({ salesReps }: { salesReps: SalesRep[] }) {
  const router = useRouter();
  const [salesRepId, setSalesRepId] = useState(salesReps[0]?.id ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/proposals/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salesRepId, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error === "wrong password" ? "סיסמה שגויה" : "שגיאה");
      setLoading(false);
      return;
    }
    router.push("/proposals");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0a0a0a, #141414)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Assistant', sans-serif",
        direction: "rtl",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 36,
          width: "100%",
          maxWidth: 380,
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg, #6B4FA0, #8B6FC0)",
              borderRadius: 14,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              marginBottom: 14,
            }}
          >
            📄
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
            מערכת הצעות מחיר
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Next Level
          </p>
        </div>

        <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>
          איש מכירות
        </label>
        <select
          value={salesRepId}
          onChange={(e) => setSalesRepId(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#fff",
            marginBottom: 16,
            fontSize: 14,
            fontFamily: "inherit",
          }}
        >
          {salesReps.map((r) => (
            <option key={r.id} value={r.id} style={{ background: "#1a1a1a" }}>
              {r.name}
            </option>
          ))}
        </select>

        <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>
          סיסמה
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#fff",
            marginBottom: 16,
            fontSize: 14,
            fontFamily: "inherit",
          }}
        />

        {error && (
          <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #6B4FA0, #8B6FC0)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 0",
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            fontFamily: "inherit",
            opacity: !password ? 0.5 : 1,
          }}
        >
          {loading ? "מתחבר…" : "כניסה"}
        </button>
      </form>
    </div>
  );
}
