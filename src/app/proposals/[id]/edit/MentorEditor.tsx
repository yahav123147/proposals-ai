"use client";

import { useRef, useState } from "react";
import type { PremiumMentor } from "../../lib/types";

interface Props {
  mentors: PremiumMentor[];
  onChange: (mentors: PremiumMentor[]) => void;
}

export function MentorEditor({ mentors, onChange }: Props) {
  function update(i: number, patch: Partial<PremiumMentor>) {
    const next = mentors.map((m, idx) => (idx === i ? { ...m, ...patch } : m));
    onChange(next);
  }
  function add() {
    onChange([
      ...mentors,
      { name: "מנטור חדש", role: "תפקיד", bio: "ביוגרפיה קצרה" },
    ]);
  }
  function remove(i: number) {
    if (!confirm("למחוק את המנטור הזה?")) return;
    onChange(mentors.filter((_, idx) => idx !== i));
  }
  function moveUp(i: number) {
    if (i === 0) return;
    const next = [...mentors];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  }
  function moveDown(i: number) {
    if (i === mentors.length - 1) return;
    const next = [...mentors];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    onChange(next);
  }

  return (
    <div>
      {mentors.map((m, i) => (
        <MentorCard
          key={i}
          mentor={m}
          onUpdate={(p) => update(i, p)}
          onRemove={() => remove(i)}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
          canMoveUp={i > 0}
          canMoveDown={i < mentors.length - 1}
          index={i}
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
        + הוסף מנטור
      </button>
    </div>
  );
}

function MentorCard({
  mentor,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  index,
}: {
  mentor: PremiumMentor;
  onUpdate: (patch: Partial<PremiumMentor>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  index: number;
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
          gap: 12,
          marginBottom: 12,
        }}
      >
        {/* Image preview */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "2px solid #d4af37",
            background: mentor.imageUrl
              ? "transparent"
              : "rgba(212,175,55,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: uploading ? "wait" : "pointer",
            flexShrink: 0,
            position: "relative",
          }}
        >
          {mentor.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mentor.imageUrl}
              alt={mentor.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 20, color: "#d4af37" }}>📷</span>
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
                fontSize: 11,
                color: "#fff",
              }}
            >
              ...
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 2,
            }}
          >
            מנטור #{index + 1}
          </div>
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
            }}
          >
            {mentor.imageUrl ? "החלף תמונה" : "העלה תמונה"}
          </button>
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
          <button
            type="button"
            onClick={onRemove}
            style={iconBtn(false, true)}
            title="מחק"
          >
            ✕
          </button>
        </div>
      </div>

      {error && (
        <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 8 }}>
          {error}
        </div>
      )}

      <input
        type="text"
        value={mentor.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        placeholder="שם"
        style={inputStyle}
      />
      <input
        type="text"
        value={mentor.role}
        onChange={(e) => onUpdate({ role: e.target.value })}
        placeholder="תפקיד"
        style={inputStyle}
      />
      <textarea
        value={mentor.bio}
        onChange={(e) => onUpdate({ bio: e.target.value })}
        placeholder="ביוגרפיה קצרה"
        rows={3}
        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
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
    border: `1px solid ${
      danger ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)"
    }`,
    borderRadius: 5,
    color: danger ? "#ef4444" : "#fff",
    fontSize: 11,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.3 : 1,
    fontFamily: "inherit",
    padding: 0,
  };
}
