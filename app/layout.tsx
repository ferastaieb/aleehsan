import type { Metadata } from "next";
import { Noto_Sans_Arabic, Tajawal } from "next/font/google";
import "./globals.css";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "الإحسان | لوحة الأثر",
  description: "لوحة شفافة لعرض أثر تبرعات قرص المحبة ومشاريع التمكين.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${notoSansArabic.variable} ${tajawal.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
