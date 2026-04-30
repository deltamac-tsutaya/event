import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TSUTAYA BOOKSTORE 5 月特惠活動｜母親節送禮與生活選品優惠",
  description:
    "TSUTAYA BOOKSTORE 5 月特惠活動開跑，精選母親節送禮、香氛保養、茶酒禮盒、生活配件與親子選品。台北信義店與台中市政店限定優惠同步展開。活動期間：2026/5/1 至 2026/5/31。",
  openGraph: {
    title: "TSUTAYA BOOKSTORE 5 月特惠活動",
    description:
      "母親節送禮、香氛保養、茶酒禮盒與生活配件，精選品牌限時優惠。台北信義店・台中市政店同步開跑。",
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
