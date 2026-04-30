"use client";

import { useState, useEffect } from "react";

const categories = [
  { id: "mothers-day", label: "母親節送禮", icon: "🌸" },
  { id: "fragrance", label: "香氛保養", icon: "🧴" },
  { id: "lifestyle", label: "生活選品", icon: "🏠" },
  { id: "tea-wine", label: "茶酒禮盒", icon: "🍵" },
  { id: "kids", label: "親子選品", icon: "🧩" },
  { id: "store-specific", label: "門市限定", icon: "📍" },
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
      className="sticky-nav py-2.5 px-4"
      style={{
        background: scrolled
          ? "rgba(253,248,242,0.97)"
          : "rgba(253,248,242,0.85)",
        borderBottom: scrolled
          ? "1px solid rgba(200,132,94,0.25)"
          : "1px solid rgba(200,132,94,0.12)",
        boxShadow: scrolled ? "0 2px 16px rgba(61,43,31,0.07)" : "none",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
    >
      <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto hide-scrollbar justify-start md:justify-center">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              onClick={() => setActive(cat.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap"
              style={{
                background: isActive ? "#3D2B1F" : "transparent",
                color: isActive ? "#FDF8F2" : "#8B6F47",
                border: isActive ? "1.5px solid #3D2B1F" : "1.5px solid transparent",
                boxShadow: isActive ? "0 2px 10px rgba(61,43,31,0.18)" : "none",
                transition: "all 0.2s ease",
                letterSpacing: "0.03em",
              }}
            >
              <span className="text-sm leading-none">{cat.icon}</span>
              <span>{cat.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
