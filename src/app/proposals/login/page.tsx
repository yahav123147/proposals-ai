import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSalesRep, SALES_REPS } from "../lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "כניסה | מערכת הצעות מחיר",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const rep = await getCurrentSalesRep();
  if (rep) redirect("/proposals");
  return <LoginForm salesReps={SALES_REPS} />;
}
