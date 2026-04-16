"use client";

import type { Proposal } from "../lib/types";
import { PremiumTemplate } from "./PremiumTemplate";

export function TemplateRenderer({ proposal }: { proposal: Proposal }) {
  return <PremiumTemplate proposal={proposal} />;
}
