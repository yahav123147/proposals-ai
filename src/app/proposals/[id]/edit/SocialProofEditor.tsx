"use client";

import { useRef, useState } from "react";
import type { PremiumSocialProof } from "../../lib/types";

interface Props {
  items: PremiumSocialProof[];
  onChange: (items: PremiumSocialProof[]) => void;
}

export function SocialProofEditor({ items, onChange }: Props) {
  function update(i: number, patch: Partial<PremiumSocialProof>) {
    onChange(items.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }
  function add() {
    onChange([...items, { caption: "תוצאה חדשה", quote: "", name: "" }]);
  }
  function remove(i: number) {
    if (!confirm("למחוק את ההוכחה החברתית?")) return;
    onChange(items.filter((_, idx) => idx !== i));
  }
  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...items];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  }
  function moveDown(i: number) {
    if (i === items.length - 1) return;
    const next = [...items];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  }

  return (
    <div>
      {items.map((item, i) => (
        <ProofCard
          key={i}
          item={item}
          index={i}
          onUpdate={(p) => update(i, p)}
          onRemove={() => remove(i)}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
          canMoveUp={i > 0}
          canMoveDown={i < items.length - 1}
        />
      ))}
      <button
        type="button"
        onClick={add}
        style={{
          width: "100%",
          background: "rgba(212,175,55,0.1)",
          border: "1px dashed rgba(212,175,55,0.4)",
          color: "#d4af37",
          padding: "10px 14px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          marginTop: 8,
        }}
      >
        + הוסף הוכחה חברתית
      </button>
    </div>
  );
}

function ProofCard({
  item,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  item: PremiumSocialProof;
  index: number;
  onUpdate: (patch: Partial<PremiumSocialProof>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/proposals/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      onUpdate({ imageUrl: data.url });
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "שגיאה בהעלאה");
    }
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            fontWeight: 700,
          }}
        >
          הוכחה #{index + 1}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            style={iconBtn(!canMoveUp)}
            title="הזז למעלה"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            style={iconBtn(!canMoveDown)}
            title="הזז למטה"
          >
            ↓
          </button>
          <button type="button" onClick={onRemove} style={iconBtn(false, true)} title="מחק">
            ✕
          </button>
        </div>
      </div>

      {/* Image upload area */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        style={{
          width: "100%",
          minHeight: 100,
          borderRadius: 8,
          border: `1px dashed ${item.imageUrl ? "rgba(255,255,255,0.1)" : "rgba(212,175,55,0.4)"}`,
          background: item.imageUrl ? "transparent" : "rgba(212,175,55,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          cursor: uploading ? "wait" : "pointer",
          marginBottom: 10,
          position: "relative",
        }}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.caption || "proof"}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 200,
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              color: "#d4af37",
              fontSize: 12,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
            לחץ להעלאת תמונה
          </div>
        )}
        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#fff",
            }}
          >
            מעלה...
          </div>
        )}
      </div>
      {item.imageUrl && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{
            background: "transparent",
            border: "none",
            color: "#d4af37",
            fontSize: 11,
            padding: 0,
            cursor: "pointer",
            fontFamily: "inherit",
            textDecoration: "underline",
            marginBottom: 10,
          }}
        >
          החלף תמונה
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />

      {error && (
        <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 8 }}>
          {error}
        </div>
      )}

      <input
        type="text"
        value={item.caption || ""}
        onChange={(e) => onUpdate({ caption: e.target.value })}
        placeholder="כיתוב מעל התמונה (אופציונלי)"
        style={inputStyle}
      />
      <textarea
        value={item.quote || ""}
        onChange={(e) => onUpdate({ quote: e.target.value })}
        placeholder="ציטוט / המלצה (אופציונלי)"
        rows={3}
        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
      />
      <input
        type="text"
        value={item.name || ""}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="שם הלקוח/ה"
        style={inputStyle}
      />
      <input
        type="text"
        value={item.role || ""}
        onChange={(e) => onUpdate({ role: e.target.value })}
        placeholder="תפקיד / עסק"
        style={inputStyle}
      />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 11px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 7,
  color: "#fff",
  fontSize: 13,
  fontFamily: "inherit",
  marginBottom: 7,
  direction: "rtl",
};

function iconBtn(disabled: boolean, danger?: boolean): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    background: danger ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
    border: `1px solid ${danger ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 5,
    color: danger ? "#ef4444" : "#fff",
    fontSize: 11,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.3 : 1,
    fontFamily: "inherit",
    padding: 0,
  };
}
