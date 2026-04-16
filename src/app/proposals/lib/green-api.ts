/**
 * Green API WhatsApp notification helper.
 * Set GREEN_API_INSTANCE_ID and GREEN_API_TOKEN in env.
 */

const GREEN_API_INSTANCE_ID = process.env.GREEN_API_INSTANCE_ID;
const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN;

function normalizePhone(phone: string): string {
  // Strip everything except digits
  let p = phone.replace(/\D/g, "");
  // Convert Israeli 0XX-XXXXXXX -> 972XXXXXXXXX
  if (p.startsWith("0")) p = "972" + p.slice(1);
  return p;
}

export async function sendWhatsApp(
  toPhone: string,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  if (!GREEN_API_INSTANCE_ID || !GREEN_API_TOKEN) {
    console.warn("[green-api] credentials missing — skipping notification");
    return { ok: false, error: "missing-credentials" };
  }

  const phone = normalizePhone(toPhone);
  if (!phone || phone.length < 10) {
    return { ok: false, error: "invalid-phone" };
  }

  const url = `https://api.green-api.com/waInstance${GREEN_API_INSTANCE_ID}/sendMessage/${GREEN_API_TOKEN}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: `${phone}@c.us`,
        message,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[green-api] send failed", res.status, text);
      return { ok: false, error: `http-${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[green-api] error", err);
    return { ok: false, error: String(err) };
  }
}

export function buildViewedMessage(
  clientName: string,
  templateName: string,
  shortCode: string,
  isFirstView: boolean
): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";
  const url = `${baseUrl}/p/${shortCode}`;
  if (isFirstView) {
    return `🎉 *${clientName}* פתח/ה את הצעת המחיר שלך!\n\n📄 ${templateName}\n🔗 ${url}\n\nזה הזמן הטוב ביותר לסגור — תתקשר/י עכשיו 📞`;
  }
  return `👀 *${clientName}* חזר/ה לראות את הצעת המחיר\n\n📄 ${templateName}\n🔗 ${url}\n\nגלוי עניין מתחדש — שווה מעקב`;
}

export function buildApprovedMessage(
  clientName: string,
  templateName: string
): string {
  return `✅ *${clientName}* אישר/ה את ההצעה!\n\n📄 ${templateName}\n\nכל הכבוד 🎉 הזמן לעדכן ב-CRM ולהתקדם לחוזה.`;
}
