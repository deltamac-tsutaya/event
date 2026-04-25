"use client";

import Link from "next/link";
import { ChevronLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaterialsPage() {
  return (
    <div className="flex flex-col h-svh">
      <header className="shrink-0 flex items-center gap-3 bg-white border-b shadow-sm px-4 h-12 z-10">
        <Link href="/admin/print">
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
            <ChevronLeft size={16} />
          </Button>
        </Link>
        <Layers size={15} className="text-[#1A2B4A]" />
        <span className="font-bold text-sm text-[#1A2B4A]">文宣設計稿</span>
        <span className="text-[10px] text-gray-400 ml-1">Nexus Life · 8TH 活動物料組</span>
      </header>
      <iframe
        src="/materials/index.html"
        className="flex-1 w-full border-0"
        title="Nexus Life Materials"
        allow="clipboard-write"
      />
    </div>
  );
}
