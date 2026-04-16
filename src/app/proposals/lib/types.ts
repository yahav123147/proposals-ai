export type ProposalStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "approved"
  | "rejected"
  | "expired";

export type TemplateId =
  | "next-level-expert"
  | "next-level-content-ai"
  | "next-level-premium"
  | "next-level-consulting";

export interface ProposalView {
  viewedAt: string; // ISO
  durationSeconds?: number;
  ip?: string;
  userAgent?: string;
}

export interface PremiumBenefit {
  number: string; // "01", "02"
  title: string;
  description: string;
  bullets: string[];
  meta?: string; // e.g. "3 שעות · זום · אחד על אחד"
}

export interface PremiumMentor {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
}

export interface PremiumSyllabusItem {
  number: string; // "01" or "★" or "—"
  date: string; // "29/04/26"
  title: string;
  isBreak?: boolean; // grey row for "שבוע הפסקה ויישום"
  isHighlight?: boolean; // gold-tinted row for "יום הסקייל"
}

export interface PremiumSyllabusChapter {
  badge: string; // "CONSULTING" or "CONTENT AI"
  title: string;
  items: PremiumSyllabusItem[];
}

export interface PremiumProblem {
  number: string;
  text: string;
}

export interface PremiumPillar {
  icon: string; // emoji
  name: string;
  tagline: string;
  description: string;
}

export interface PremiumIncludeItem {
  text: string;
}

export interface PremiumSocialProof {
  imageUrl?: string;
  caption?: string; // short headline above image
  quote?: string; // testimonial quote
  name?: string; // client name
  role?: string; // client role/business
}

export interface ProposalCustomizations {
  // Generic overrides
  headlinePrefix?: string;
  letterBody?: string;
  signOff?: string;
  paymentTerms?: string;
  notes?: string;

  // Premium template fields
  // Cover
  programName?: string;
  tagline?: string;
  coverDescription?: string;
  durationLabel?: string; // "9 חודשי ליווי מלאים"

  // Why now (problem)
  problemKicker?: string; // "למה עכשיו"
  problemHeadline?: string;
  problemSubtitle?: string;
  problems?: PremiumProblem[];

  // The solution
  solutionKicker?: string;
  solutionHeadline?: string;
  solutionSubtitle?: string;
  pillars?: PremiumPillar[];

  // What's included
  includesKicker?: string;
  includesHeadline?: string;
  benefits?: PremiumBenefit[];

  // Mentors
  mentorsKicker?: string;
  mentorsHeadline?: string;
  mentorsSubtitle?: string;
  mentors?: PremiumMentor[];

  // Syllabus
  syllabusKicker?: string;
  syllabusHeadline?: string;
  syllabusChapters?: PremiumSyllabusChapter[];

  // Social proof
  socialProofKicker?: string;
  socialProofHeadline?: string;
  socialProofSubtitle?: string;
  socialProofs?: PremiumSocialProof[];

  // Investment
  investmentKicker?: string;
  investmentHeadline?: string;
  investmentBadge?: string; // "✦ מסלול מומלץ"
  includes?: PremiumIncludeItem[];
  ctaText?: string; // "אני רוצה להצטרף לתוכנית ←"
  paymentNote?: string; // "ניתן לפרוס לתשלומים..."

  // Footer
  footerBrand?: string; // "Next Level Club"
  footerNote?: string; // "הצעה זו הוכנה עבורך בלבד"

  // Theme colors (override template defaults)
  themeNavy?: string; // primary dark
  themeGold?: string; // accent
  themeCream?: string; // light section bg
}

export interface Proposal {
  id: string; // uuid
  shortCode: string; // 8 chars, used in /p/[shortCode]
  templateId: TemplateId;

  // Sales rep
  salesRepName: string;
  salesRepWhatsapp?: string; // for notifications

  // Client
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;

  // Pricing
  programPrice: number; // ILS, no VAT
  currency: string; // "ILS"

  // Customizations
  customizations: ProposalCustomizations;

  // Status / lifecycle
  status: ProposalStatus;
  createdAt: string;
  sentAt?: string;
  expiresAt?: string;
  firstViewedAt?: string;
  lastViewedAt?: string;
  totalViews: number;
  totalViewSeconds: number;
  approvedAt?: string;
  rejectedAt?: string;

  // View log (last 50 views to keep blob size sane)
  views: ProposalView[];
}

export interface SalesRep {
  id: string;
  name: string;
  whatsapp?: string;
  role: "admin" | "sales";
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  tagline: string;
  defaultPrice: number;
  defaultLetter: string;
  primaryColor: string;
  description: string;
}

/**
 * A custom template saved by a user — based on a built-in template,
 * but with all customizations + price baked in. Used to skip the manual
 * editing for repeat proposals of the same product.
 */
export interface CustomTemplate {
  id: string; // uuid
  name: string;
  description: string;
  baseTemplateId: TemplateId;
  programPrice: number;
  customizations: ProposalCustomizations;
  createdBy: string; // sales rep name
  createdAt: string;
}
