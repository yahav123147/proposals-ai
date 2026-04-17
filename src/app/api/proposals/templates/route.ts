import { NextRequest, NextResponse } from "next/server";
import { getCurrentSalesRep } from "../../../proposals/lib/auth";
import {
  createCustomTemplate,
  listCustomTemplates,
} from "../../../proposals/lib/template-storage";
import { TEMPLATES } from "../../../proposals/lib/templates";

export async function GET() {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const templates = await listCustomTemplates();
  return NextResponse.json({ templates });
}

export async function POST(req: NextRequest) {
  const rep = await getCurrentSalesRep();
  if (!rep)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name || !body.baseTemplateId) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  if (!TEMPLATES[body.baseTemplateId as keyof typeof TEMPLATES]) {
    return NextResponse.json({ error: "invalid base template" }, { status: 400 });
  }

  const template = await createCustomTemplate({
    name: body.name,
    description: body.description || "",
    baseTemplateId: body.baseTemplateId,
    programPrice: Number(body.programPrice) || 0,
    customizations: body.customizations || {},
    createdBy: rep.name,
  });

  return NextResponse.json({ template });
}
