"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Layers, Printer, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";

interface StampConfig {
  uuid: string;
  stamp_id: string;
  variant_id: number;
  area_name?: string;
}

// ── Brand atoms (ported from atoms.jsx) ───────────────────────────────────────

const BRAND = {
  bg:       '#F5F2ED',
  warm:     '#EEE9E2',
  surface:  '#FDFAF6',
  navy:     '#1A2B4A',
  brown:    '#8A6F5C',
  accent:   '#3B82C4',
  border:   'rgba(138,111,92,0.18)',
  divider:  'rgba(138,111,92,0.28)',
  textSub:  '#8A6F5C',
  textMuted:'rgba(26,43,74,0.45)',
  textFaint:'rgba(26,43,74,0.28)',
};

function NexusField({ watermarkChar = '8', density = 44 }: { watermarkChar?: string; density?: number }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
      preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`gp-${watermarkChar}-${density}`} x="0" y="0" width={density} height={density} patternUnits="userSpaceOnUse">
          <path d={`M ${density} 0 L 0 0 0 ${density}`} fill="none" stroke="rgba(138,111,92,0.07)" strokeWidth="0.5"/>
          <circle cx="0" cy="0" r="0.7" fill="rgba(26,43,74,0.06)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#gp-${watermarkChar}-${density})`}/>
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
        fontFamily="'Cormorant Garamond','Noto Serif TC',serif"
        fontSize="680" fontWeight="600"
        fill="rgba(26,43,74,0.04)"
        style={{ userSelect: 'none', letterSpacing: '-0.05em' }}>
        {watermarkChar}
      </text>
    </svg>
  );
}

function CoBrand({ scale = 1 }: { scale?: number }) {
  const filter = 'brightness(0) saturate(100%) invert(12%) sepia(35%) saturate(700%) hue-rotate(190deg) brightness(90%)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale }}>
      <img src="/tsutaya-logo.svg" alt="TSUTAYA BOOKSTORE"
        style={{ height: 13 * scale, width: 'auto', display: 'block', filter, opacity: 0.75 }} />
      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14,
        color: 'rgba(138,111,92,0.6)', fontWeight: 400 }}>×</span>
      <img src="/wired-tokyo-logo.svg" alt="WIRED TOKYO"
        style={{ height: 15 * scale, width: 'auto', display: 'block', filter, opacity: 0.75 }} />
    </div>
  );
}

function MonoLabel({ children, color = BRAND.textSub, size = 9 }: {
  children: React.ReactNode; color?: string; size?: number;
}) {
  return (
    <span style={{ fontFamily: "'DM Mono','monospace'", fontSize: size,
      letterSpacing: '0.22em', textTransform: 'uppercase' as const, color, fontWeight: 500 }}>
      {children}
    </span>
  );
}

function Rule({ width = '2.5rem', color = BRAND.divider }: { width?: string; color?: string }) {
  return <div style={{ width, height: 1, background: color }} />;
}

function NexusLogoScale({ size = 1 }: { size?: number }) {
  const fs = 96 * size;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}>
      <span style={{ fontFamily: "'Cormorant Garamond',serif",
        fontSize: fs, fontWeight: 600, color: BRAND.navy,
        letterSpacing: '-0.025em', lineHeight: 1 }}>Nexus</span>
      <span style={{ fontFamily: "'Cormorant Garamond',serif",
        fontSize: fs * 0.78, color: BRAND.accent, fontWeight: 300,
        letterSpacing: '-0.05em', lineHeight: 1,
        position: 'relative' as const, top: 2 * size, margin: `0 ${4 * size}px` }}>∞</span>
      <span style={{ fontFamily: "'Cormorant Garamond',serif",
        fontSize: fs * 0.52, fontWeight: 300, fontStyle: 'italic', color: BRAND.navy,
        letterSpacing: '0.06em', lineHeight: 1,
        position: 'relative' as const, top: -6 * size, opacity: 0.82 }}>Life</span>
    </div>
  );
}

function CropMarks() {
  const color = 'rgba(138,111,92,0.3)';
  const len = 10, inset = 4;
  const s = (pos: object) => ({ position: 'absolute' as const, ...pos, background: color, pointerEvents: 'none' as const });
  return (
    <>
      <div style={s({ top: inset, left: inset, width: len, height: 0.75 })} />
      <div style={s({ top: inset, left: inset, width: 0.75, height: len })} />
      <div style={s({ top: inset, right: inset, width: len, height: 0.75 })} />
      <div style={s({ top: inset, right: inset, width: 0.75, height: len })} />
      <div style={s({ bottom: inset, left: inset, width: len, height: 0.75 })} />
      <div style={s({ bottom: inset, left: inset, width: 0.75, height: len })} />
      <div style={s({ bottom: inset, right: inset, width: len, height: 0.75 })} />
      <div style={s({ bottom: inset, right: inset, width: 0.75, height: len })} />
    </>
  );
}

// ── Stamp data (ported from design-stands.jsx) ────────────────────────────────

const STAMP_META: Record<string, { kw: string; phrase: string; floor: string; icon: string; seed: number }> = {
  '01': { kw: '無限', floor: '2F', seed: 101, icon: '/materials/assets/stamps/endless.svg',  phrase: '從這裡走出去，8 與 ∞ 同時開始。' },
  '02': { kw: '陶杯', floor: '2F', seed: 108, icon: '/materials/assets/stamps/drum.svg',     phrase: '手溫傳過陶杯，8 年的 ∞ 就在掌心。' },
  '03': { kw: '風',   floor: '3F', seed: 115, icon: '/materials/assets/stamps/wind.svg',     phrase: '露台吹來 ∞ 的風，繞了 8 個年頭才停。' },
  '04': { kw: '橡實', floor: '3F', seed: 122, icon: '/materials/assets/stamps/acorn.svg',    phrase: '一顆橡實用 8 年 ∞ 生長，長成整片森林。' },
  '05': { kw: '書',   floor: '3F', seed: 129, icon: '/materials/assets/stamps/book.svg',     phrase: '8 層書牆向 ∞ 展開，每格都是新世界。' },
  '06': { kw: '咖啡', floor: '2F', seed: 136, icon: '/materials/assets/stamps/coffee.svg',   phrase: '一杯咖啡，8 年的 ∞ 日常，從未厭倦。' },
  '07': { kw: '光點', floor: '3F', seed: 143, icon: '/materials/assets/stamps/flare.svg',    phrase: '光從天井 ∞ 落，你離第 8 枚只剩一步。' },
  '08': { kw: '花朵', floor: '1F', seed: 150, icon: '/materials/assets/stamps/flower.svg',   phrase: '8 年 ∞ 循環，每天都有一朵花記住你。' },
  A:    { kw: '松鼠', floor: '★', seed: 901, icon: '/materials/assets/stamps/squirrel-color.svg', phrase: '牠等了你 8 分鐘。或者是 ∞ 分鐘——松鼠自己也數不清。' },
  B:    { kw: '小鳥', floor: '★', seed: 914, icon: '/materials/assets/stamps/bird-color.svg',     phrase: '這個位子空著。小鳥只停在不趕路的人身邊。' },
  C:    { kw: '小鹿', floor: '★', seed: 927, icon: '/materials/assets/stamps/deer-color.svg',     phrase: '電梯只有上下，沒有 ∞。小鹿選擇住在這裡，等一個看得懂的人。' },
};

// ── StampStand (exact port of design-stands.jsx StampStand) ──────────────────

function StampStand({ config, egg = false }: { config: StampConfig; egg?: boolean }) {
  const W = 378, H = 567;
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const stampUrl = `${base}/stamp?id=${config.uuid}`;
  const p = STAMP_META[config.stamp_id];
  if (!p) return null;

  return (
    <div style={{
      position: 'relative', width: W, height: H, overflow: 'hidden',
      background: BRAND.bg,
      fontFamily: "'DM Sans','Noto Sans TC',sans-serif",
    }}>
      <NexusField watermarkChar={egg ? '∞' : config.stamp_id} density={44} />
      <CropMarks />

      {/* ── Header (co-brand + floor code) ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '16px 22px 12px',
        borderBottom: `1px solid ${BRAND.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(253,250,246,0.85)',
      }}>
        <CoBrand scale={0.85} />
        <MonoLabel color={egg ? BRAND.brown : BRAND.accent} size={14}>
          {egg ? `EGG / ${config.stamp_id}` : `${p.floor} · ${config.stamp_id}`}
        </MonoLabel>
      </div>

      {/* ── QR block (top half) ── */}
      <div style={{
        position: 'absolute', top: 60, left: 22, right: 22,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <MonoLabel color={BRAND.textMuted} size={14}>
          {egg ? '★ HIDDEN STAMP' : 'SCAN TO COLLECT'}
        </MonoLabel>

        <div style={{
          background: BRAND.surface, border: `1px solid ${BRAND.border}`,
          borderRadius: 8, padding: 10,
        }}>
          <QRCode value={stampUrl} size={170} fgColor={BRAND.navy} bgColor={BRAND.surface}
            level="M" viewBox="0 0 170 170" style={{ display: 'block' }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: BRAND.brown,
            fontFamily: "'DM Mono',monospace", letterSpacing: '0.12em' }}>
            用 LINE 掃描
          </div>
        </div>
      </div>

      {/* ── Divider: rules + large stamp number ── */}
      <div style={{
        position: 'absolute', top: 340, left: 36, right: 36,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ flex: 1, height: 1, background: BRAND.border }} />
        <div style={{
          fontFamily: "'Cormorant Garamond','Noto Serif TC',serif",
          fontSize: 72, fontWeight: 600, lineHeight: 0.7,
          color: egg ? 'rgba(138,111,92,0.18)' : 'rgba(26,43,74,0.16)',
          letterSpacing: '-0.04em', userSelect: 'none' as const,
          padding: '0 4px',
        }}>
          {config.stamp_id}
        </div>
        <div style={{ flex: 1, height: 1, background: BRAND.border }} />
      </div>

      {/* ── Icon + keyword + phrase ── */}
      <div style={{
        position: 'absolute', top: 394, left: 22, right: 22,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={p.icon} alt={p.kw}
            style={{ width: 52, height: 52, objectFit: 'contain',
              filter: egg
                ? 'none'
                : 'brightness(0) saturate(100%) invert(12%) sepia(35%) saturate(700%) hue-rotate(190deg) brightness(90%) opacity(0.8)',
            }} />
          <div style={{
            fontFamily: "'Cormorant Garamond','Noto Serif TC',serif",
            fontSize: p.kw.length > 3 ? 40 : 52,
            fontWeight: 600, lineHeight: 1, color: BRAND.navy, letterSpacing: '0.1em',
          }}>
            {p.kw}
          </div>
        </div>

        <Rule width="32px" color={egg ? BRAND.divider : 'rgba(59,130,196,0.4)'} />

        <p style={{
          fontSize: 14, lineHeight: 1.75, color: BRAND.textSub, fontWeight: 400,
          fontStyle: egg ? 'italic' : 'normal', letterSpacing: '0.03em',
          margin: 0, textAlign: 'center', maxWidth: 280,
        }}>
          {p.phrase}
        </p>
      </div>

      {/* ── NexusLogo bottom-right ── */}
      <div style={{ position: 'absolute', bottom: 18, right: 22 }}>
        <NexusLogoScale size={0.28} />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MaterialsPage() {
  const [tab, setTab] = useState<'design' | 'qr'>('design');
  const [configs, setConfigs] = useState<StampConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (tab !== 'qr' || fetched) return;
    setLoading(true);
    fetch('/api/admin/configs?all=true')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setConfigs(
            d.configs.sort((a: StampConfig, b: StampConfig) => {
              if (a.stamp_id !== b.stamp_id) return a.stamp_id.localeCompare(b.stamp_id);
              return a.variant_id - b.variant_id;
            })
          );
        }
      })
      .catch(console.error)
      .finally(() => { setLoading(false); setFetched(true); });
  }, [tab, fetched]);


  return (
    <div className="flex flex-col h-svh bg-white">

      {/* ── Header ── */}
      <header className="shrink-0 flex items-center gap-2 bg-white border-b shadow-sm px-4 h-12 z-10 print:hidden">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
            <ChevronLeft size={16} />
          </Button>
        </Link>
        <Layers size={15} className="text-[#1A2B4A]" />
        <span className="font-bold text-sm text-[#1A2B4A]">文宣 &amp; 列印</span>

        <div className="ml-4 flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
          <button
            onClick={() => setTab('design')}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
              tab === 'design' ? 'bg-white text-[#1A2B4A] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            設計稿
          </button>
          <button
            onClick={() => setTab('qr')}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
              tab === 'qr' ? 'bg-white text-[#1A2B4A] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            QR 批次列印
          </button>
        </div>

        {tab === 'qr' && configs.length > 0 && (
          <Button
            onClick={() => window.print()}
            className="ml-auto bg-[#1A2B4A] hover:bg-[#1A2B4A]/90 gap-2 h-8 px-4 rounded-full text-xs"
          >
            <Printer size={14} /> 列印全部 ({configs.length} 張)
          </Button>
        )}
      </header>

      {/* ── 設計稿 tab ── */}
      {tab === 'design' && (
        <iframe
          src="/materials/index.html"
          className="flex-1 w-full border-0"
          title="Nexus Life Materials"
          allow="clipboard-write"
        />
      )}

      {/* ── QR 批次列印 tab ── */}
      {tab === 'qr' && (
        <div className="flex-1 overflow-auto bg-gray-50">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400 text-sm animate-pulse">正在載入 QR Code 資料…</p>
            </div>
          )}

          {!loading && configs.length > 0 && (
            <>
              {/* Screen info */}
              <div className="print:hidden max-w-5xl mx-auto mt-4 mb-3 px-6 flex items-center gap-4 flex-wrap">
                <p className="text-xs text-gray-400">
                  共 {configs.length} 張 · {configs.length} 頁 · 每頁 1 張置中（A4 直向）
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                  <Info size={12} className="shrink-0" />
                  <span>框外 UUID 僅供店員核對用。</span>
                </div>
              </div>

              {/* Screen preview */}
              <div className="print:hidden max-w-5xl mx-auto px-6 pb-12">
                <div className="flex flex-wrap gap-8 justify-center">
                  {configs.map(c => {
                    const egg = ['A', 'B', 'C'].includes(c.stamp_id);
                    return (
                      <div key={c.uuid} className="flex flex-col items-center gap-1">
                        <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center',
                          marginBottom: -(567 * 0.5) + 'px' }}>
                          <StampStand config={c} egg={egg} />
                        </div>
                        <p className="text-[7px] font-mono text-gray-300 truncate max-w-[100px]">{c.uuid}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Print output: 1-up per A4, centered */}
              {configs.map(c => (
                <div key={c.uuid} className="print-page"
                  style={{
                    display: 'none',
                    width: '210mm', height: '297mm',
                    boxSizing: 'border-box',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                  <div style={{ transform: 'scale(1.95)', transformOrigin: 'center center' }}>
                    <StampStand config={c} egg={['A', 'B', 'C'].includes(c.stamp_id)} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @page { size: A4 portrait; margin: 0; }
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .print-page { display: flex !important; break-after: page; page-break-after: always; }
        }
      `}} />
    </div>
  );
}
