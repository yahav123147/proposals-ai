import { getStore } from "@netlify/blobs";
import { randomUUID } from "crypto";
import type { Proposal, ProposalView } from "./types";

const STORE_NAME = "proposals";
const INDEX_KEY = "__index__";

interface ProposalIndex {
  ids: string[];
  byShortCode: Record<string, string>; // shortCode -> id
}

function store() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

async function getIndex(): Promise<ProposalIndex> {
  const blob = await store().get(INDEX_KEY, { type: "json" });
  return (blob as ProposalIndex | null) ?? { ids: [], byShortCode: {} };
}

async function saveIndex(index: ProposalIndex) {
  await store().setJSON(INDEX_KEY, index);
}

function generateShortCode(): string {
  // 8-char URL-safe code
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // no confusing 0/O/1/i/l
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function listProposals(filters?: {
  salesRepName?: string;
}): Promise<Proposal[]> {
  const index = await getIndex();
  const proposals: Proposal[] = [];
  for (const id of index.ids) {
    const p = await store().get(id, { type: "json" });
    if (p) proposals.push(p as Proposal);
  }
  // Auto-expire: mark proposals past their expiresAt as expired (in-memory only,
  // to keep listing fast — they get persisted on next save).
  const now = Date.now();
  for (const p of proposals) {
    if (
      p.expiresAt &&
      new Date(p.expiresAt).getTime() < now &&
      p.status !== "approved" &&
      p.status !== "rejected" &&
      p.status !== "expired"
    ) {
      p.status = "expired";
    }
  }
  let result = proposals;
  if (filters?.salesRepName) {
    result = result.filter((p) => p.salesRepName === filters.salesRepName);
  }
  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getProposal(id: string): Promise<Proposal | null> {
  const blob = await store().get(id, { type: "json" });
  return (blob as Proposal | null) ?? null;
}

export async function getProposalByShortCode(
  shortCode: string
): Promise<Proposal | null> {
  const index = await getIndex();
  const id = index.byShortCode[shortCode];
  if (!id) return null;
  return getProposal(id);
}

export async function createProposal(
  data: Omit<
    Proposal,
    "id" | "shortCode" | "createdAt" | "totalViews" | "totalViewSeconds" | "views"
  >
): Promise<Proposal> {
  const id = randomUUID();
  const index = await getIndex();
  let shortCode = generateShortCode();
  while (index.byShortCode[shortCode]) shortCode = generateShortCode();

  const proposal: Proposal = {
    ...data,
    id,
    shortCode,
    createdAt: new Date().toISOString(),
    totalViews: 0,
    totalViewSeconds: 0,
    views: [],
  };

  await store().setJSON(id, proposal);
  index.ids.push(id);
  index.byShortCode[shortCode] = id;
  await saveIndex(index);
  return proposal;
}

export async function updateProposal(
  id: string,
  patch: Partial<Proposal>
): Promise<Proposal | null> {
  const existing = await getProposal(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id: existing.id, shortCode: existing.shortCode };
  await store().setJSON(id, updated);
  return updated;
}

export async function deleteProposal(id: string): Promise<boolean> {
  const existing = await getProposal(id);
  if (!existing) return false;
  await store().delete(id);
  const index = await getIndex();
  index.ids = index.ids.filter((x) => x !== id);
  delete index.byShortCode[existing.shortCode];
  await saveIndex(index);
  return true;
}

export async function trackView(
  id: string,
  view: ProposalView
): Promise<Proposal | null> {
  const existing = await getProposal(id);
  if (!existing) return null;

  const newViews = [view, ...existing.views].slice(0, 50);
  const totalViews = existing.totalViews + 1;
  const totalViewSeconds =
    existing.totalViewSeconds + (view.durationSeconds ?? 0);

  let status = existing.status;
  if (status === "draft" || status === "sent") status = "viewed";

  const updated: Proposal = {
    ...existing,
    views: newViews,
    totalViews,
    totalViewSeconds,
    status,
    firstViewedAt: existing.firstViewedAt ?? view.viewedAt,
    lastViewedAt: view.viewedAt,
  };
  await store().setJSON(id, updated);
  return updated;
}
