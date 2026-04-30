import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TSUTAYA BOOKSTORE 5 月特惠活動｜母親節送禮、香氛保養與生活選品優惠",
  description:
    "TSUTAYA BOOKSTORE 2026 年 5 月特惠活動，精選母親節送禮、香氛保養、茶咖酒禮盒、生活配件與親子選品優惠。活動適用台北信義店與台中市政店，部分品牌限定門市販售。",
  openGraph: {
    title: "TSUTAYA BOOKSTORE 5 月特惠活動｜母親節送禮與生活選品優惠",
    description:
      "TSUTAYA BOOKSTORE 2026 年 5 月特惠活動，精選母親節送禮、香氛保養、茶咖酒禮盒、生活配件與親子選品優惠。台北信義店・台中市政店同步開跑。",
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full font-noto">{children}</body>
    </html>
  );
}
