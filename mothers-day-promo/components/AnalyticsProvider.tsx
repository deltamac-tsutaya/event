"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params ?? {});
  }
}

export default function AnalyticsProvider() {
  useEffect(() => {
    // CTA click tracking via data-track attribute
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-track]");
      if (target) {
        const eventName = target.getAttribute("data-track") ?? "cta_click";
        trackEvent(eventName);
      }
    };
    document.addEventListener("click", handleClick);

    // Scroll depth tracking
    const thresholds = [25, 50, 75, 90];
    const fired = new Set<number>();
    const handleScroll = () => {
      const scrolled =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      for (const t of thresholds) {
        if (scrolled >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll_depth", { depth: `${t}%` });
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Section view tracking via IntersectionObserver
    const sectionIds = [
      "mothers-day", "limited-time", "budget", "recipient",
      "fragrance", "tea-wine", "lifestyle", "kids", "store-specific",
    ];
    const viewedSections = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !viewedSections.has(entry.target.id)) {
            viewedSections.add(entry.target.id);
            trackEvent("section_view", { section: entry.target.id });
          }
        }
      },
      { threshold: 0.3 }
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    // Dwell time tracking (30s / 60s)
    const t30 = setTimeout(() => trackEvent("dwell_30s"), 30_000);
    const t60 = setTimeout(() => trackEvent("dwell_60s"), 60_000);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      clearTimeout(t30);
      clearTimeout(t60);
    };
  }, []);

  return null;
}
