import { NextRequest, NextResponse } from "next/server";
import { getCurrentSalesRep } from "../../proposals/lib/auth";
import {
  createProposal,
  listProposals,
} from "../../proposals/lib/storage";
import { TEMPLATES } from "../../proposals/lib/templates";
import { getTemplateDefaults } from "../../proposals/lib/template-defaults";
import { getCustomTemplate } from "../../proposals/lib/template-storage";
import type { Proposal } from "../../proposals/lib/types";

export async function GET() {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const all = await listProposals();
  // Admins see everything; sales reps see only their own
  const filtered =
    rep.role === "admin" ? all : all.filter((p) => p.salesRepName === rep.name);
  return NextResponse.json({ proposals: filtered });
}

export async function POST(req: NextRequest) {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();

  // Two ways to create a proposal:
  // 1. From a built-in template (templateId)
  // 2. From a saved custom template (customTemplateId)
  let templateId = body.templateId;
  let baseDefaults = body.customizations || {};
  let basePrice = 0;

  if (body.customTemplateId) {
    const custom = await getCustomTemplate(body.customTemplateId);
    if (!custom) {
      return NextResponse.json(
        { error: "custom template not found" },
        { status: 404 }
      );
    }
    templateId = custom.baseTemplateId;
    baseDefaults = custom.customizations;
    basePrice = custom.programPrice;
  }

  if (!templateId || !TEMPLATES[templateId as keyof typeof TEMPLATES]) {
    return NextResponse.json({ error: "invalid template" }, { status: 400 });
  }
  const template = TEMPLATES[templateId as keyof typeof TEMPLATES];

  const validityDays = Number(body.validityDays) || 7;
  const expiresAt = new Date(
    Date.now() + validityDays * 24 * 60 * 60 * 1000
  ).toISOString();

  // If creating from a custom template, use its baked-in customizations.
  // Otherwise, seed the full premium defaults from the built-in template.
  const customizations = body.customTemplateId
    ? { ...baseDefaults, ...(body.customizations || {}) }
    : {
        ...getTemplateDefaults(templateId as keyof typeof TEMPLATES),
        ...(body.customizations || {}),
      };

  const proposal = await createProposal({
    templateId,
    salesRepName: rep.name,
    salesRepWhatsapp: rep.whatsapp,
    clientName: body.clientName || "",
    clientCompany: body.clientCompany || "",
    clientEmail: body.clientEmail || "",
    clientPhone: body.clientPhone || "",
    programPrice:
      Number(body.programPrice) || basePrice || template.defaultPrice,
    currency: "ILS",
    customizations,
    status: "draft",
    expiresAt,
  } satisfies Omit<
    Proposal,
    "id" | "shortCode" | "createdAt" | "totalViews" | "totalViewSeconds" | "views"
  >);

  return NextResponse.json({ proposal });
}
