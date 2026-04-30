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
      className="sticky-nav py-3 px-4"
      style={{
        background: scrolled
          ? "rgba(253,248,242,0.95)"
          : "rgba(253,248,242,0.8)",
        borderBottom: "1px solid rgba(200,132,94,0.2)",
      }}
    >
      <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto hide-scrollbar justify-start md:justify-center">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            onClick={() => setActive(cat.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
            style={
              active === cat.id
                ? { background: "#3D2B1F", color: "#FDF8F2" }
                : { background: "transparent", color: "#6B5040" }
            }
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
