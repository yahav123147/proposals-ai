import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSalesRep } from "./lib/auth";
import { listProposals } from "./lib/storage";
import { TEMPLATE_LIST } from "./lib/templates";
import { listCustomTemplates } from "./lib/template-storage";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = {
  title: "מערכת הצעות מחיר | Next Level",
  description: "ניהול הצעות מחיר ומעקב אחרי לקוחות",
};

export const dynamic = "force-dynamic";

export default async function ProposalsPage() {
  const rep = await getCurrentSalesRep();
  if (!rep) redirect("/proposals/login");

  const all = await listProposals();
  const proposals =
    rep.role === "admin"
      ? all
      : all.filter((p) => p.salesRepName === rep.name);
  const customTemplates = await listCustomTemplates();

  return (
    <Dashboard
      salesRep={rep}
      proposals={proposals}
      allProposals={all}
      builtInTemplates={TEMPLATE_LIST}
      customTemplates={customTemplates}
    />
  );
}
