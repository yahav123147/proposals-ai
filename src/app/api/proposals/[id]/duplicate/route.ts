import { NextRequest, NextResponse } from "next/server";
import { getCurrentSalesRep } from "../../../../proposals/lib/auth";
import {
  createProposal,
  getProposal,
} from "../../../../proposals/lib/storage";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const original = await getProposal(id);
  if (!original)
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (rep.role !== "admin" && original.salesRepName !== rep.name) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Calculate fresh expiry — same number of validity days as original
  const originalValidity = original.expiresAt
    ? Math.ceil(
        (new Date(original.expiresAt).getTime() -
          new Date(original.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 7;
  const expiresAt = new Date(
    Date.now() + originalValidity * 24 * 60 * 60 * 1000
  ).toISOString();

  const copy = await createProposal({
    templateId: original.templateId,
    salesRepName: rep.name,
    salesRepWhatsapp: rep.whatsapp,
    clientName: original.clientName ? `${original.clientName} (העתק)` : "",
    clientCompany: original.clientCompany,
    clientEmail: original.clientEmail,
    clientPhone: original.clientPhone,
    programPrice: original.programPrice,
    currency: original.currency,
    customizations: original.customizations,
    status: "draft",
    expiresAt,
  });

  return NextResponse.json({ proposal: copy });
}
