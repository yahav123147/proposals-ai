import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSalesRep } from "../lib/auth";
import { TEMPLATE_LIST } from "../lib/templates";
import { listCustomTemplates } from "../lib/template-storage";
import { NewProposalForm } from "./NewProposalForm";

export const metadata: Metadata = {
  title: "הצעה חדשה | Next Level",
};

export const dynamic = "force-dynamic";

export default async function NewProposalPage() {
  const rep = await getCurrentSalesRep();
  if (!rep) redirect("/proposals/login");
  const customTemplates = await listCustomTemplates();
  return (
    <NewProposalForm
      salesRep={rep}
      templates={TEMPLATE_LIST}
      customTemplates={customTemplates}
    />
  );
}
