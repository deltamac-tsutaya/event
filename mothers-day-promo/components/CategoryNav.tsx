"use client";

import { useState, useEffect } from "react";

const categories = [
  { id: "mothers-day",    label: "母親節送禮" },
  { id: "limited-time",   label: "5/10 限時優惠" },
  { id: "budget",         label: "依預算挑選" },
  { id: "recipient",      label: "依對象挑選" },
  { id: "fragrance",      label: "香氛保養" },
  { id: "tea-wine",       label: "茶咖酒禮盒" },
  { id: "lifestyle",      label: "生活配件" },
  { id: "kids",           label: "親子選品" },
  { id: "store-specific", label: "門市限定" },
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
        borderBottom: scrolled ? "1px solid #E8E0D4" : "1px solid transparent",
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
              className="flex-shrink-0 px-4 py-3.5 text-xs font-medium whitespace-nowrap relative"
              style={{
                color: isUrgent && !isActive ? "#8B2E35" : isActive ? "#1C1410" : "#8B6F47",
                transition: "color 0.2s",
                letterSpacing: "0.06em",
              }}
            >
              {cat.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                  style={{ background: "#8B2E35" }}
                />
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
