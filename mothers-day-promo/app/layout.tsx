import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";

export const metadata: Metadata = {
  title: {
    template: "%s ・ TSUTAYA BOOKSTORE 母親節特輯",
    default: "母親節特輯 ・ TSUTAYA BOOKSTORE 2026",
  },
  description:
    "TSUTAYA BOOKSTORE 母親節特輯，精選香氛保養、茶咖酒禮盒、生活配件與親子選品優惠。活動期間 5/1 — 5/31，台北信義店・台中市政店同步舉辦。",
  openGraph: {
    title: "母親節特輯 ・ TSUTAYA BOOKSTORE 2026",
    description:
      "為心意注入詩意與美感。精選母親節禮物，搭配淡雅香氛、細膩保養、茶韻酒香禮盒及點綴生活的日常小物。",
    locale: "zh_TW",
    type: "website",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {children}
        <AnalyticsProvider />
      </body>
    </html>
  );
}
