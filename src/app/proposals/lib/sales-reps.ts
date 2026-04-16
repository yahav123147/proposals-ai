import type { SalesRep } from "./types";

/**
 * Sales reps are stored in code (small list, rarely changes).
 * Each rep can be assigned proposals and receives WhatsApp notifications.
 *
 * To enable WhatsApp notifications: add a phone number with country code or
 * Israeli prefix (e.g. "0521234567" or "972521234567").
 */
export const SALES_REPS: SalesRep[] = [
  { id: "admin", name: "מנהל", role: "admin", whatsapp: "" },
  { id: "rep-1", name: "איש מכירות 1", role: "sales", whatsapp: "" },
  { id: "rep-2", name: "איש מכירות 2", role: "sales", whatsapp: "" },
  { id: "rep-3", name: "איש מכירות 3", role: "sales", whatsapp: "" },
  { id: "rep-4", name: "איש מכירות 4", role: "sales", whatsapp: "" },
  { id: "rep-5", name: "איש מכירות 5", role: "sales", whatsapp: "" },
];

export function getSalesRepByName(name: string): SalesRep | undefined {
  return SALES_REPS.find((r) => r.name === name);
}

export function getSalesRepById(id: string): SalesRep | undefined {
  return SALES_REPS.find((r) => r.id === id);
}
