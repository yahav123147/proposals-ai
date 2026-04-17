import { NextRequest, NextResponse } from "next/server";
import {
  getProposalByShortCode,
  trackView,
} from "../../../proposals/lib/storage";
import { TEMPLATES } from "../../../proposals/lib/templates";
import { buildViewedMessage, sendWhatsApp } from "../../../proposals/lib/green-api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const shortCode = body.shortCode as string | undefined;
  if (!shortCode) {
    return NextResponse.json({ error: "missing shortCode" }, { status: 400 });
  }

  const proposal = await getProposalByShortCode(shortCode);
  if (!proposal) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const isFirstView = !proposal.firstViewedAt;

  await trackView(proposal.id, {
    viewedAt: now,
    durationSeconds: Number(body.durationSeconds) || 0,
    ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined,
    userAgent: req.headers.get("user-agent") || undefined,
  });

  // Notify sales rep via WhatsApp
  if (proposal.salesRepWhatsapp) {
    // Throttle: only notify on first view, or if last view was >3 hours ago
    const lastView = proposal.lastViewedAt
      ? new Date(proposal.lastViewedAt).getTime()
      : 0;
    const hoursSinceLastView = (Date.now() - lastView) / (1000 * 60 * 60);
    if (isFirstView || hoursSinceLastView >= 3) {
      const template = TEMPLATES[proposal.templateId];
      const message = buildViewedMessage(
        proposal.clientName || "לקוח",
        template.name,
        proposal.shortCode,
        isFirstView
      );
      // Fire and forget — don't block the response
      sendWhatsApp(proposal.salesRepWhatsapp, message).catch((e) =>
        console.error("[track] notify failed", e)
      );
    }
  }

  return NextResponse.json({ ok: true });
}
