"use client";

import Link from "next/link";
import { useState } from "react";
import { mockIssues } from "@/lib/mockData";
import { formatMonth } from "@/lib/formatting";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const sortedIssues = mockIssues.sort((a, b) => b.month.localeCompare(a.month)).slice(0, 6);
  const currentMonth = mockIssues[0]?.month || "2025-05";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-light">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-1">
            <h1 className="text-xl md:text-2xl font-serif font-bold text-black tracking-wider">
              À LA PAGE
            </h1>
            <p className="text-xs md:text-sm text-gray-dark font-sans">
              數位第三空間
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/issues" className="text-sm text-gray-dark hover:text-black transition">
              月刊
            </Link>
            <Link href="/stores" className="text-sm text-gray-dark hover:text-black transition">
              店舖
            </Link>
            <Link href="/collaboration" className="text-sm text-gray-dark hover:text-black transition">
              合作
            </Link>
            <Link href="/contact" className="text-sm text-gray-dark hover:text-black transition">
              聯絡
            </Link>
          </nav>

          {/* Month Selector */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setIsMonthOpen(!isMonthOpen)}
              className="px-4 py-2 text-sm border border-gray-dark hover:border-black transition text-gray-dark hover:text-black"
            >
              {formatMonth(currentMonth)}
            </button>

            {isMonthOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-light shadow-lg py-2 min-w-[120px]">
                {sortedIssues.map((issue) => (
                  <Link
                    key={issue.id}
                    href={`/issues/${issue.month}`}
                    className="block px-4 py-2 text-sm text-gray-dark hover:bg-cream transition"
                    onClick={() => setIsMonthOpen(false)}
                  >
                    {formatMonth(issue.month)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 ml-4"
            aria-label="Toggle menu"
          >
            <span className={cn(
              "w-6 h-0.5 bg-black transition-all duration-300",
              isMenuOpen && "rotate-45 translate-y-2"
            )}></span>
            <span className={cn(
              "w-6 h-0.5 bg-black transition-opacity duration-300",
              isMenuOpen && "opacity-0"
            )}></span>
            <span className={cn(
              "w-6 h-0.5 bg-black transition-all duration-300",
              isMenuOpen && "-rotate-45 -translate-y-2"
            )}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-6 border-t border-gray-light pt-4 flex flex-col gap-4">
            <Link href="/issues" className="text-sm text-gray-dark hover:text-black">
              月刊
            </Link>
            <Link href="/stores" className="text-sm text-gray-dark hover:text-black">
              店舖
            </Link>
            <Link href="/collaboration" className="text-sm text-gray-dark hover:text-black">
              合作
            </Link>
            <Link href="/contact" className="text-sm text-gray-dark hover:text-black">
              聯絡
            </Link>
            <div className="pt-2 border-t border-gray-light">
              <p className="text-xs text-gray-dark mb-2">當期月刊</p>
              <select
                value={currentMonth}
                onChange={(e) => {
                  window.location.href = `/issues/${e.target.value}`;
                }}
                className="w-full px-2 py-1 text-sm border border-gray-dark text-gray-dark"
              >
                {sortedIssues.map((issue) => (
                  <option key={issue.id} value={issue.month}>
                    {formatMonth(issue.month)} - {issue.theme}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
