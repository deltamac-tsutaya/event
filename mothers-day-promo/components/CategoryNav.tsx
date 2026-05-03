"use client";

import { useState, useEffect } from "react";

const categories = [
  { id: "mothers-day",    label: "送禮推薦",   en: "Gifts" },
  { id: "limited-time",   label: "限時優惠",   en: "Limited" },
  { id: "budget",         label: "依預算",     en: "Budget" },
  { id: "recipient",      label: "依對象",     en: "For" },
  { id: "fragrance",      label: "香氛保養",   en: "Care" },
  { id: "tea-wine",       label: "茶咖酒",     en: "Tea・Wine" },
  { id: "lifestyle",      label: "生活配件",   en: "Lifestyle" },
  { id: "kids",           label: "親子選品",   en: "Family" },
  { id: "store-specific", label: "門市限定",   en: "Stores" },
];

export default function CategoryNav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      const sections = categories.map((c) => document.getElementById(c.id));
      let current = "";
      for (const section of sections) {
        if (section && window.scrollY >= section.offsetTop - 120) {
          current = section.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="sticky-nav px-4"
      style={{
        background: "rgba(253,248,242,0.96)",
        borderBottom: scrolled
          ? "1px solid var(--color-rule, #C8B89A)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 8px rgba(28,20,16,0.06)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <div className="max-w-5xl mx-auto flex overflow-x-auto hide-scrollbar justify-start md:justify-center">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          const isUrgent = cat.id === "limited-time";
          return (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              onClick={() => setActive(cat.id)}
              className="flex-shrink-0 px-4 py-2.5 flex flex-col items-center relative group"
            >
              <span
                className="font-display text-[10px] tracking-[0.25em]"
                style={{
                  fontStyle: "italic",
                  color: isUrgent ? "#8B2E35" : "var(--color-wine, #8B2E35)",
                  opacity: isActive ? 1 : 0.45,
                  transition: "opacity 0.2s",
                }}
              >
                {cat.en}
              </span>
              <span
                className="font-serif-tc text-xs tracking-[0.1em] mt-0.5 whitespace-nowrap"
                style={{
                  color: isActive
                    ? "var(--color-ink, #1C1410)"
                    : "var(--color-ink-soft, #6B5040)",
                  transition: "color 0.2s",
                }}
              >
                {cat.label}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-px"
                  style={{ background: "var(--color-wine, #8B2E35)" }}
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
