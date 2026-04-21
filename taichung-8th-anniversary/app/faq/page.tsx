"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import { useLiffUser } from "@/hooks/useLiffUser";

export default function FaqPage() {
  const { user } = useLiffUser();

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-[#00694B] shrink-0"
          >
            ← 返回首頁
          </Link>
          <h1 className="text-base font-bold text-gray-900">常見問題</h1>
        </div>

        <FaqAccordion />
      </main>

      <Footer />
    </div>
  );
}
