import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "À LA PAGE｜得利蔦屋數位第三空間",
  description:
    "TSUTAYA BOOKSTORE × WIRED TOKYO 的數位第三空間。探索每月精選活動、課程、餐飲優惠與生活提案。",
  openGraph: {
    title: "À LA PAGE｜得利蔦屋數位第三空間",
    description:
      "TSUTAYA BOOKSTORE × WIRED TOKYO 的數位第三空間。每月一期，策展食物、書籍與生活的故事。",
    url: "https://a-la-page.example.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-white text-black flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
