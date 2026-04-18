import { cookies } from "next/headers";
import { SALES_REPS, getSalesRepById } from "./sales-reps";
import type { SalesRep } from "./types";

const COOKIE_NAME = "proposals_session";
const SHARED_PASSWORD = process.env.PROPOSALS_PASSWORD || "nextlevel2026";

export function checkPassword(password: string): boolean {
  return password === SHARED_PASSWORD;
}

export async function setSession(salesRepId: string) {
  const rep = getSalesRepById(salesRepId);
  if (!rep) throw new Error("invalid sales rep");
  const c = await cookies();
  c.set(COOKIE_NAME, salesRepId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function clearSession() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function getCurrentSalesRep(): Promise<SalesRep | null> {
  const c = await cookies();
  const id = c.get(COOKIE_NAME)?.value;
  if (!id) return null;
  return getSalesRepById(id) ?? null;
}

export { SALES_REPS };
