"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface LocationStat { stampId: string; areaName: string; count: number; }
interface DisplayStats {
  totalUsers: number;
  totalStamps: number;
  todayStamps: number;
  todayActiveUsers: number;
  completedUsers: number;
  totalDraws: number;
  locationBreakdown: LocationStat[];
  eggBreakdown: LocationStat[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const LIFF_URL = "https://liff.line.me/2009815115-CHcrof7l";
const EVENT_END = new Date("2026-05-24T20:00:00+08:00");

const STAMP_KW: Record<string, string> = {
  "01":"無限","02":"陶杯","03":"風","04":"橡實",
  "05":"書",  "06":"咖啡","07":"光點","08":"花朵",
  A:"松鼠", B:"小鳥", C:"小鹿",
};
const STAMP_FLOOR: Record<string, string> = {
  "01":"2F","02":"2F","03":"3F","04":"3F",
  "05":"3F","06":"2F","07":"3F","08":"1F",
  A:"★",B:"★",C:"★",
};
const STAMP_ICON: Record<string, string> = {
  "01":"/materials/assets/stamps/endless.svg",
  "02":"/materials/assets/stamps/drum.svg",
  "03":"/materials/assets/stamps/wind.svg",
  "04":"/materials/assets/stamps/acorn.svg",
  "05":"/materials/assets/stamps/book.svg",
  "06":"/materials/assets/stamps/coffee.svg",
  "07":"/materials/assets/stamps/flare.svg",
  "08":"/materials/assets/stamps/flower.svg",
  A:"/materials/assets/stamps/squirrel.svg",
  B:"/materials/assets/stamps/bird.svg",
  C:"/materials/assets/stamps/deer.svg",
};

// ── Animated counter hook ─────────────────────────────────────────────────────

function useCount(target: number, ms = 1400) {
  const [v, setV] = useState(0);
  const ref = useRef({ from: 0, to: 0 });
  useEffect(() => {
    if (target === ref.current.to) return;
    const from = ref.current.to;
    ref.current = { from, to: target };
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / ms, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (target - from) * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, ms]);
  return v;
}

// ── QR canvas (loads qrcode-generator from CDN once) ─────────────────────────

function QRCanvas({ url, size }: { url: string; size: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    function draw() {
      const qr = (window as any).qrcode?.(0, "M");
      if (!qr || !ref.current) return;
      qr.addData(url); qr.make();
      const m = qr.getModuleCount();
      const s = Math.floor(size / m);
      const ctx = ref.current.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#F5F2ED"; ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#1A2B4A";
      for (let r = 0; r < m; r++)
        for (let c = 0; c < m; c++)
          if (qr.isDark(r, c)) ctx.fillRect(c * s, r * s, s, s);
    }
    if ((window as any).qrcode) { draw(); return; }
    const el = document.createElement("script");
    el.src = "https://unpkg.com/qrcode-generator@1.4.4/qrcode.js";
    el.onload = draw;
    document.head.appendChild(el);
  }, [url, size]);
  return <canvas ref={ref} width={size} height={size} style={{ display: "block" }} />;
}

// ── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, gold }: {
  label: string; value: number; sub?: string; gold?: boolean;
}) {
  const v = useCount(value);
  return (
    <div style={{
      flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,242,237,0.08)",
      borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ fontSize: 13, letterSpacing: "0.14em", color: "rgba(245,242,237,0.45)" }}>{label}</div>
      <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums",
        color: gold ? "#C9A84C" : "#F5F2ED", letterSpacing: "-0.02em" }}>
        {v.toLocaleString("zh-TW")}
      </div>
      {sub && <div style={{ fontSize: 14, color: "rgba(245,242,237,0.35)" }}>{sub}</div>}
    </div>
  );
}

// ── Stamp circle ──────────────────────────────────────────────────────────────

function StampCircle({ s, count, max, egg }: {
  s: LocationStat; count: number; max: number; egg?: boolean;
}) {
  const heat = max > 0 ? count / max : 0;
  const glowColor = egg ? "rgba(138,111,92," : "rgba(59,130,196,";
  const ringColor = egg ? "#8A6F5C" : "#3B82C4";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: egg ? 88 : 108, height: egg ? 88 : 108 }}>
        {/* Pulse ring (only if there are any scans) */}
        {count > 0 && (
          <div style={{
            position: "absolute", inset: -6, borderRadius: "50%",
            border: `2px solid ${glowColor}0.4)`,
            animation: "pulse-ring 2.5s ease-out infinite",
          }} />
        )}
        {/* Glow backdrop */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor}${(heat * 0.35).toFixed(2)}) 0%, transparent 70%)`,
          filter: "blur(8px)",
        }} />
        {/* Circle */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: heat > 0
            ? `rgba(${egg ? "138,111,92" : "59,130,196"},${(0.08 + heat * 0.18).toFixed(2)})`
            : "rgba(245,242,237,0.04)",
          border: `1.5px solid ${heat > 0 ? ringColor : "rgba(245,242,237,0.1)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 1s, border-color 1s",
        }}>
          <img src={STAMP_ICON[s.stampId]} alt={STAMP_KW[s.stampId]}
            style={{
              width: egg ? 36 : 48, height: egg ? 36 : 48, objectFit: "contain",
              filter: `brightness(0) invert(1) opacity(${0.35 + heat * 0.55})`,
              transition: "opacity 1s",
            }} />
        </div>
        {/* Count badge */}
        <div style={{
          position: "absolute", bottom: -4, right: -4,
          background: count > 0 ? (egg ? "#8A6F5C" : "#3B82C4") : "rgba(245,242,237,0.12)",
          color: "#F5F2ED", fontFamily: "'DM Mono',monospace",
          fontSize: 11, fontWeight: 700,
          width: 26, height: 26, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid rgba(13,24,36,0.9)",
        }}>
          {count > 99 ? "99+" : count}
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: egg ? 14 : 16, fontWeight: 600, color: "#F5F2ED" }}>
          {STAMP_KW[s.stampId]}
        </div>
        <div style={{ fontSize: 11, color: "rgba(245,242,237,0.35)", letterSpacing: "0.08em" }}>
          {STAMP_FLOOR[s.stampId]} · {s.areaName}
        </div>
      </div>
    </div>
  );
}

// ── Bar row ───────────────────────────────────────────────────────────────────

function BarRow({ s, max }: { s: LocationStat; max: number }) {
  const pct = max > 0 ? (s.count / max) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 48, fontSize: 12, fontFamily: "'DM Mono',monospace",
        color: "rgba(245,242,237,0.5)", textAlign: "right", flexShrink: 0 }}>
        {s.stampId}
      </div>
      <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          background: "linear-gradient(90deg, #3B82C4, #5B9FDE)",
          width: `${pct}%`, transition: "width 1.2s cubic-bezier(.2,.8,.3,1)",
          minWidth: s.count > 0 ? 4 : 0,
        }} />
      </div>
      <div style={{ width: 44, fontSize: 13, fontFamily: "'DM Mono',monospace",
        color: "#F5F2ED", textAlign: "right", flexShrink: 0 }}>
        {s.count}
      </div>
    </div>
  );
}

// ── Countdown segment ─────────────────────────────────────────────────────────

function CountSeg({ v, label, big }: { v: number; label: string; big?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        fontSize: big ? 68 : 52, fontWeight: 800, lineHeight: 1,
        color: big ? "#C9A84C" : "#F5F2ED",
        fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em",
      }}>
        {String(v).padStart(2, "0")}
      </div>
      <div style={{ fontSize: 12, letterSpacing: "0.12em", color: "rgba(245,242,237,0.4)" }}>
        {label}
      </div>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────

function Div({ top }: { top: number }) {
  return (
    <div style={{
      position: "absolute", top, left: 52, right: 52, height: 1,
      background: "rgba(245,242,237,0.07)",
    }} />
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DisplayPage() {
  const [stats, setStats] = useState<DisplayStats | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [scale, setScale] = useState(1);

  // Board scale to fill viewport
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1080, window.innerHeight / 1920));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Stats fetch + 30s refresh
  const fetchStats = useCallback(async () => {
    try {
      const r = await fetch("/api/display/stats");
      const d = await r.json();
      if (d.success) setStats(d.stats);
    } catch {}
  }, []);
  useEffect(() => {
    fetchStats();
    const t = setInterval(fetchStats, 30_000);
    return () => clearInterval(t);
  }, [fetchStats]);

  // Countdown
  const msLeft = Math.max(0, EVENT_END.getTime() - now.getTime());
  const dd = Math.floor(msLeft / 86_400_000);
  const hh = Math.floor((msLeft % 86_400_000) / 3_600_000);
  const mm = Math.floor((msLeft % 3_600_000) / 60_000);
  const ss = Math.floor((msLeft % 60_000) / 1_000);

  // Clock
  const clock = now.toLocaleTimeString("zh-TW", {
    timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const dateLine = now.toLocaleDateString("zh-TW", {
    timeZone: "Asia/Taipei", month: "long", day: "numeric", weekday: "short",
  });

  const maxLoc = Math.max(1, ...(stats?.locationBreakdown.map(l => l.count) ?? [1]));

  // Animated totals
  const aTotalUsers   = useCount(stats?.totalUsers ?? 0);
  const aTotalStamps  = useCount(stats?.totalStamps ?? 0);
  const aTodayActive  = useCount(stats?.todayActiveUsers ?? 0);
  const aCompleted    = useCount(stats?.completedUsers ?? 0);
  const aTotalDraws   = useCount(stats?.totalDraws ?? 0);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#050A10",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;600;700;800&family=DM+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;700&display=swap');
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: .7; }
          100% { transform: scale(1.6); opacity: 0;  }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-24px); }
        }
        @keyframes blink-colon {
          0%,100% { opacity: 1; }
          50%     { opacity: .25; }
        }
        @keyframes scan-line {
          0%   { top: 0;    opacity: 0; }
          5%   { opacity: .6; }
          95%  { opacity: .6; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* ── Board: 1080 × 1920 ───────────────────────────────────────────────── */}
      <div style={{
        width: 1080, height: 1920, position: "relative",
        transform: `scale(${scale})`, transformOrigin: "center center",
        fontFamily: "'DM Sans','Noto Sans TC',sans-serif", color: "#F5F2ED",
        background: "linear-gradient(160deg, #0D1824 0%, #080E17 55%, #0C1720 100%)",
        overflow: "hidden",
      }}>

        {/* Ambient ∞ background */}
        {([
          { top:  -80, right: -120, size: 560, anim: "float 10s ease-in-out infinite" },
          { top:  820, left:  -150, size: 440, anim: "float 14s ease-in-out infinite 3s" },
          { top: 1480, right:  -80, size: 380, anim: "float 12s ease-in-out infinite 6s" },
        ] as const).map((p, i) => (
          <div key={i} style={{
            position: "absolute", ...p, fontSize: p.size, lineHeight: 0.7,
            fontFamily: "'Cormorant Garamond',serif", fontWeight: 300,
            color: "rgba(59,130,196,0.04)", letterSpacing: "-0.06em",
            userSelect: "none", pointerEvents: "none", animation: p.anim,
          }}>∞</div>
        ))}

        {/* Scan line */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(59,130,196,0.4), transparent)",
          animation: "scan-line 8s linear infinite",
        }} />

        {/* ── HEADER: top=0 h=130 ─────────────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 130,
          padding: "0 52px",
          borderBottom: "1px solid rgba(245,242,237,0.07)",
          background: "rgba(8,14,23,0.7)", backdropFilter: "blur(20px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          zIndex: 1,
        }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.22em", color: "rgba(245,242,237,0.4)", marginBottom: 5 }}>
              TSUTAYA BOOKSTORE × WIRED TOKYO · 台中市政店
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.03em" }}>
              Nexus<span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300,
                color: "#3B82C4", margin: "0 6px", fontSize: 28 }}>∞</span>Life
              <span style={{ fontSize: 16, fontWeight: 400, color: "rgba(245,242,237,0.45)",
                letterSpacing: "0.1em", marginLeft: 12 }}>8TH ANNIVERSARY</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 40, fontWeight: 300, letterSpacing: "0.04em",
              fontVariantNumeric: "tabular-nums", animation: "blink-colon 1s step-end infinite" }}>
              {clock}
            </div>
            <div style={{ fontSize: 14, color: "rgba(245,242,237,0.4)", marginTop: 3 }}>{dateLine}</div>
          </div>
        </div>

        {/* ── TODAY HERO: top=130 h=220 ────────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 130, left: 0, right: 0, height: 220,
          padding: "32px 52px",
          background: "linear-gradient(180deg, rgba(59,130,196,0.06) 0%, transparent 100%)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 13, letterSpacing: "0.2em", color: "rgba(245,242,237,0.45)", marginBottom: 8 }}>
              TODAY · 今日活躍旅人
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 100, fontWeight: 800, lineHeight: 1,
                letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
                background: "linear-gradient(135deg, #5B9FDE, #3B82C4)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {aTodayActive.toLocaleString("zh-TW")}
              </span>
              <span style={{ fontSize: 24, color: "rgba(245,242,237,0.5)" }}>位</span>
            </div>
            <div style={{ fontSize: 16, color: "rgba(245,242,237,0.4)", marginTop: 4 }}>
              今日已集印 <span style={{ color: "#5B9FDE", fontWeight: 600 }}>
                {(stats?.todayStamps ?? 0).toLocaleString("zh-TW")}
              </span> 枚
            </div>
          </div>
          {/* Decorative circle */}
          <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid rgba(59,130,196,0.3)",
              animation: "pulse-ring 3s ease-out infinite" }} />
            <div style={{ position: "absolute", inset: 10, borderRadius: "50%",
              border: "1px solid rgba(59,130,196,0.2)",
              animation: "pulse-ring 3s ease-out infinite 1s" }} />
            <div style={{ position: "absolute", inset: 20, borderRadius: "50%",
              background: "rgba(59,130,196,0.08)",
              border: "1px solid rgba(59,130,196,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: 52, fontWeight: 300, color: "#3B82C4", lineHeight: 1 }}>∞</span>
            </div>
          </div>
        </div>

        <Div top={350} />

        {/* ── KPI GRID: top=360 h=270 ──────────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 360, left: 0, right: 0, height: 270,
          padding: "24px 52px",
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16,
        }}>
          <KpiCard label="TOTAL · 總參與" value={aTotalUsers} sub="位旅人" />
          <KpiCard label="STAMPS · 累積集印" value={aTotalStamps} sub="枚印章" />
          <KpiCard label="COMPLETE · 集章完成" value={aCompleted} sub="位完成者" gold />
          <KpiCard label="DRAWS · 已領獎品" value={aTotalDraws} sub="份獎品" />
        </div>

        <Div top={630} />

        {/* ── STAMP HEATMAP TITLE: top=642 ─────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 642, left: 52, right: 52,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(245,242,237,0.4)" }}>
            STAMP MAP · 各點位集印熱況
          </div>
          <div style={{ flex: 1, height: 1, background: "rgba(245,242,237,0.07)" }} />
        </div>

        {/* ── MAIN STAMPS: top=682 h=360 ───────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 682, left: 0, right: 0, height: 360,
          padding: "0 52px",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", rowGap: 24, columnGap: 12,
          alignItems: "start",
        }}>
          {(stats?.locationBreakdown ?? Array(8).fill({ stampId:"01",areaName:"",count:0 }))
            .map((s) => (
              <StampCircle key={s.stampId} s={s} count={s.count} max={maxLoc} />
            ))}
        </div>

        {/* ── EGG STAMPS: top=1042 h=160 ───────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 1042, left: 0, right: 0, height: 160,
          padding: "8px 52px 0",
          display: "flex", alignItems: "flex-start", gap: 0,
          justifyContent: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 32 }}>
            <div style={{ width: 20, height: 1, background: "rgba(138,111,92,0.4)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.18em", color: "rgba(138,111,92,0.6)" }}>EGG STAMPS</span>
            <div style={{ width: 20, height: 1, background: "rgba(138,111,92,0.4)" }} />
          </div>
          <div style={{ display: "flex", gap: 52 }}>
            {(stats?.eggBreakdown ?? Array(3).fill({ stampId:"A",areaName:"",count:0 }))
              .map(s => {
                const maxEgg = Math.max(1, ...(stats?.eggBreakdown.map(e => e.count) ?? [1]));
                return <StampCircle key={s.stampId} s={s} count={s.count} max={maxEgg} egg />;
              })}
          </div>
        </div>

        <Div top={1202} />

        {/* ── BAR CHART: top=1212 h=240 ────────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 1212, left: 0, right: 0, height: 240,
          padding: "16px 52px",
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(245,242,237,0.4)", marginBottom: 4 }}>
            LOCATION RANKING · 點位排行
          </div>
          {(stats?.locationBreakdown
            ? [...stats.locationBreakdown].sort((a,b) => b.count - a.count)
            : Array(6).fill({ stampId:"—",areaName:"",count:0 })
          ).slice(0, 6).map(s => <BarRow key={s.stampId} s={s} max={maxLoc} />)}
        </div>

        <Div top={1452} />

        {/* ── COUNTDOWN: top=1462 h=190 ────────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 1462, left: 0, right: 0, height: 190,
          padding: "24px 52px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(245,242,237,0.4)", marginBottom: 16 }}>
              COUNTDOWN · 距離活動結束
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
              <CountSeg v={dd} label="天" big />
              <span style={{ fontSize: 48, fontWeight: 200, color: "rgba(245,242,237,0.2)", paddingBottom: 18 }}>:</span>
              <CountSeg v={hh} label="時" />
              <span style={{ fontSize: 48, fontWeight: 200, color: "rgba(245,242,237,0.2)", paddingBottom: 18 }}>:</span>
              <CountSeg v={mm} label="分" />
              <span style={{ fontSize: 48, fontWeight: 200, color: "rgba(245,242,237,0.2)", paddingBottom: 18,
                animation: "blink-colon 1s step-end infinite" }}>:</span>
              <CountSeg v={ss} label="秒" />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "rgba(245,242,237,0.3)", lineHeight: 1.8 }}>
              <div>活動期間</div>
              <div style={{ color: "rgba(245,242,237,0.5)" }}>2026.04.25</div>
              <div style={{ color: "rgba(245,242,237,0.5)" }}>— 05.24</div>
            </div>
          </div>
        </div>

        <Div top={1652} />

        {/* ── FOOTER / QR: top=1662 h=258 ─────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 1662, left: 0, right: 0, height: 258,
          padding: "32px 52px",
          background: "rgba(8,14,23,0.5)",
          display: "flex", alignItems: "center", gap: 44,
        }}>
          {/* QR */}
          <div style={{ flexShrink: 0, background: "#F5F2ED", borderRadius: 16, padding: 10,
            boxShadow: "0 0 40px rgba(59,130,196,0.2)" }}>
            <QRCanvas url={LIFF_URL} size={160} />
          </div>
          {/* CTA text */}
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "rgba(245,242,237,0.4)", marginBottom: 10 }}>
              SCAN TO JOIN · 掃碼加入集印
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15 }}>
              集 8 枚印章
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15,
              color: "#C9A84C", marginBottom: 12 }}>
              每日解鎖抽獎
            </div>
            <div style={{ fontSize: 15, color: "rgba(245,242,237,0.35)", fontFamily: "'DM Mono',monospace",
              letterSpacing: "0.04em" }}>
              14 項獎品 · 100% 中獎
            </div>
          </div>
          {/* Stats refresh note */}
          <div style={{ marginLeft: "auto", textAlign: "right", alignSelf: "flex-end" }}>
            <div style={{ fontSize: 11, color: "rgba(245,242,237,0.2)", letterSpacing: "0.1em" }}>
              每 30 秒自動更新
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
