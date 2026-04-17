import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מערכת הצעות מחיר",
  description: "מערכת AI ליצירת הצעות מחיר בעברית",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
