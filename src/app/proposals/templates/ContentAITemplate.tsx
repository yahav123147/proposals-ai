"use client";

import { ProposalPreview } from "../ProposalPreview";
import type { Proposal } from "../lib/types";

interface Props {
  proposal: Proposal;
}

export function ContentAITemplate({ proposal }: Props) {
  const validityDays = proposal.expiresAt
    ? Math.ceil(
        (new Date(proposal.expiresAt).getTime() -
          new Date(proposal.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      ).toString()
    : "7";

  const data = {
    clientName: proposal.clientName || "",
    date: new Date(proposal.createdAt).toLocaleDateString("he-IL"),
    validityDays,
    greeting: "היי,",
    letterBody:
      proposal.customizations.letterBody ||
      "שמחנו לשוחח איתך ולשמוע על העסק שלך.\n\nבשיחה שלנו דיברנו על האתגר שהרבה בעלות עסקים מכירות: את יודעת שתוכן עקבי ואיכותי הוא המפתח לצמיחה – אבל בפועל, יצירת התוכן גוזלת שעות, הרעיונות נגמרים, והתוצאות לא תמיד משתקפות בעסק.\n\nתכנית Content AI נבנתה בדיוק בשביל זה – לתת לך שיטה שלמה ליצירת תוכן שיווקי באמצעות בינה מלאכותית, כך שתוכלי לייצר תוכן מקצועי, אותנטי ועקבי – בזמן שבריר ממה שלוקח היום.\n\nלהלן הפירוט המלא של התכנית, מה כלול בה, ומה ההשקעה.",
    signOff: proposal.customizations.signOff || "בברכה,\nצוות נקסט לבל",
    programPrice: proposal.programPrice.toLocaleString("he-IL"),
    paymentTerms:
      proposal.customizations.paymentTerms ||
      "ניתן לשלם עד 3 תשלומים ללא ריבית",
  };

  return <ProposalPreview data={data} />;
}
