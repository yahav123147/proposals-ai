import { NextRequest, NextResponse } from "next/server";
import { getCurrentSalesRep } from "../../../proposals/lib/auth";
import {
  deleteProposal,
  getProposal,
  updateProposal,
} from "../../../proposals/lib/storage";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const proposal = await getProposal(id);
  if (!proposal) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (rep.role !== "admin" && proposal.salesRepName !== rep.name) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json({ proposal });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await getProposal(id);
  if (!existing) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (rep.role !== "admin" && existing.salesRepName !== rep.name) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const patch = await req.json();
  // Whitelist updatable fields
  const allowed = [
    "clientName",
    "clientCompany",
    "clientEmail",
    "clientPhone",
    "programPrice",
    "customizations",
    "status",
    "expiresAt",
    "sentAt",
  ];
  const cleanPatch: Record<string, unknown> = {};
  for (const k of allowed) if (k in patch) cleanPatch[k] = patch[k];
  const updated = await updateProposal(id, cleanPatch);
  return NextResponse.json({ proposal: updated });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await getProposal(id);
  if (!existing) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (rep.role !== "admin" && existing.salesRepName !== rep.name) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  await deleteProposal(id);
  return NextResponse.json({ ok: true });
}
