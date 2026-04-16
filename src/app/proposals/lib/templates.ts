import type { TemplateConfig, TemplateId } from "./types";

export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
  "next-level-expert": {
    id: "next-level-expert",
    name: "Next Level Expert",
    tagline: "תכנית הליווי לבעלי עסקים שרוצים להפוך למומחים מובילים",
    defaultPrice: 14900,
    primaryColor: "#1e3a8a",
    description: "ליווי ממוקד לבעלי עסקים שרוצים לבסס סמכות מקצועית",
    defaultLetter:
      "שמחנו לשוחח איתך ולהכיר את העסק שלך.\n\nבשיחה שלנו זיהינו שהאתגר המרכזי שלך הוא למצב את עצמך כסמכות מקצועית בתחום שלך – כך שלקוחות יבחרו בך, יסכימו לשלם פרמיה, ויהפכו לשגרירים שלך.\n\nתכנית Next Level Expert בנויה בדיוק לזה: ללמד אותך את השיטה למצב את עצמך כמומחה מוביל, לבנות מערכת תוכן וסמכות, ולסגור עסקאות באחוזים גבוהים.",
  },
  "next-level-content-ai": {
    id: "next-level-content-ai",
    name: "Next Level Content AI",
    tagline: "תכנית הכשרה ליצירת תוכן שיווקי חכם באמצעות בינה מלאכותית",
    defaultPrice: 9900,
    primaryColor: "#A78BFA",
    description: "12 שבועות של AI ליצירת תוכן חכם, אורגני ועקבי",
    defaultLetter:
      "שמחנו לשוחח איתך ולשמוע על העסק שלך.\n\nבשיחה שלנו דיברנו על האתגר שהרבה בעלות עסקים מכירות: את יודעת שתוכן עקבי ואיכותי הוא המפתח לצמיחה – אבל בפועל, יצירת התוכן גוזלת שעות, הרעיונות נגמרים, והתוצאות לא תמיד משתקפות בעסק.\n\nתכנית Content AI נבנתה בדיוק בשביל זה – לתת לך שיטה שלמה ליצירת תוכן שיווקי באמצעות בינה מלאכותית, כך שתוכלי לייצר תוכן מקצועי, אותנטי ועקבי – בזמן שבריר ממה שלוקח היום.",
  },
  "next-level-premium": {
    id: "next-level-premium",
    name: "Next Level Premium",
    tagline: "תכנית הליווי האקסקלוסיבית של נקסט לבל",
    defaultPrice: 24900,
    primaryColor: "#d4af37",
    description: "ליווי פרימיום אישי לבעלי עסקים מתקדמים",
    defaultLetter:
      "שמחנו לקיים את שיחת ההיכרות שלנו ולהבין את היעדים העסקיים שלך לשנה הקרובה.\n\nתכנית Next Level Premium היא התכנית האקסקלוסיבית ביותר של נקסט לבל – שמיועדת למי שרוצה ליווי אישי וצמוד, גישה למנטורים בכירים, ומעבר משמעותי בכמה חזיתות בו זמנית.",
  },
  "next-level-consulting": {
    id: "next-level-consulting",
    name: "Next Level Consulting",
    tagline: "ייעוץ אסטרטגי קבוצתי לבעלי עסקים שרוצים לסקייל",
    defaultPrice: 18900,
    primaryColor: "#0f766e",
    description: "תכנית קונסלטינג קבוצתית של 6 חודשים",
    defaultLetter:
      "שמחנו לשוחח איתך ולהבין את האתגרים שאתה מתמודד איתם בעסק.\n\nתכנית Next Level Consulting היא תכנית קבוצתית של 6 חודשים, שמיועדת לבעלי עסקים שרוצים לקבל אסטרטגיה ברורה, ליווי על ידי מנטורים בכירים, וקבוצת עמיתים שצומחת איתם.",
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATES);

export function getTemplate(id: TemplateId): TemplateConfig {
  return TEMPLATES[id];
}
