import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import "./brand.css";
import { Toaster } from "@/components/ui/sonner";
import NetworkStatusBanner from "@/components/ui-state/NetworkStatusBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "TSUTAYA BOOKSTORE × WIRED TOKYO 8th Anniversary｜無限日常 ∞ 連結生活",
  description:
    "TSUTAYA BOOKSTORE × WIRED TOKYO 台中市政店 8 週年。無限日常 ∞ 連結生活。集印抽獎活動期間：2026/04/23 — 2026/05/13",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NetworkStatusBanner />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
