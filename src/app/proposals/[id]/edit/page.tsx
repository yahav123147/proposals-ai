import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentSalesRep } from "../../lib/auth";
import { getProposal } from "../../lib/storage";
import { EditProposalForm } from "./EditProposalForm";

export const metadata: Metadata = {
  title: "עריכת הצעה | Next Level",
};

export const dynamic = "force-dynamic";

export default async function EditProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const rep = await getCurrentSalesRep();
  if (!rep) redirect("/proposals/login");
  const { id } = await params;
  const proposal = await getProposal(id);
  if (!proposal) notFound();
  if (rep.role !== "admin" && proposal.salesRepName !== rep.name) {
    redirect("/proposals");
  }
  return <EditProposalForm proposal={proposal} salesRep={rep} />;
}
