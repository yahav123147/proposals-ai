import { NextRequest, NextResponse } from "next/server";
import { getCurrentSalesRep } from "../../../../proposals/lib/auth";
import {
  deleteCustomTemplate,
  getCustomTemplate,
} from "../../../../proposals/lib/template-storage";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const template = await getCustomTemplate(id);
  if (!template)
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ template });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await getCustomTemplate(id);
  if (!existing)
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  // Only admin or creator can delete
  if (rep.role !== "admin" && existing.createdBy !== rep.name) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  await deleteCustomTemplate(id);
  return NextResponse.json({ ok: true });
}
