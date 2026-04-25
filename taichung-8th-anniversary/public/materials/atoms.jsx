/* ─── Nexus Life brand atoms — LIGHT THEME (matches web app) ─ */

const BRAND = {
  // Background layers
  bg:      '#F5F2ED',   // cream page bg
  warm:    '#EEE9E2',   // stamp cells, warm card
  surface: '#FDFAF6',   // card surface

  // Text / primary
  navy:    '#1A2B4A',   // primary text, buttons
  brown:   '#8A6F5C',   // secondary text, decoration
  accent:  '#3B82C4',   // date emphasis, links

  // Borders
  border:  'rgba(138,111,92,0.18)',
  divider: 'rgba(138,111,92,0.28)',

  // Text hierarchy
  textMain:  '#1A2B4A',
  textSub:   '#8A6F5C',
  textMuted: 'rgba(26,43,74,0.45)',
  textFaint: 'rgba(26,43,74,0.28)',

  // Legacy aliases kept for safety
  cream:  '#F5F2ED',
  white:  '#FDFAF6',
  ink:    '#1A2B4A',
};

/* ── Ambient dot grid, light variant ── */
function NexusField({ tone = 'light', showWatermark = true, watermarkChar = '8', density = 40 }) {
  const dotColor = tone === 'dark' ? 'rgba(245,242,237,0.08)' : 'rgba(26,43,74,0.06)';
  const lineColor = tone === 'dark' ? 'rgba(245,242,237,0.06)' : 'rgba(138,111,92,0.07)';
  const wmColor = tone === 'dark' ? 'rgba(245,242,237,0.04)' : 'rgba(26,43,74,0.04)';
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
      preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`g-${tone}-${density}`} x="0" y="0" width={density} height={density} patternUnits="userSpaceOnUse">
          <path d={`M ${density} 0 L 0 0 0 ${density}`} fill="none" stroke={lineColor} strokeWidth="0.5"/>
          <circle cx="0" cy="0" r="0.7" fill={dotColor}/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#g-${tone}-${density})`}/>
      {showWatermark && (
        <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Cormorant Garamond', 'Noto Serif TC', serif"
          fontSize="680" fontWeight="600"
          fill={wmColor} style={{ userSelect: 'none', letterSpacing: '-0.05em' }}>
          {watermarkChar}
        </text>
      )}
    </svg>
  );
}

/* ── TSUTAYA BOOKSTORE horizontal SVG (small side-by-side variant)
   Original viewBox covers both stacked + horizontal; we clip to
   just the horizontal group: x 40–555, y 168–212               */
function TsutayaLogoH({ height = 20, color = BRAND.navy, opacity = 0.75 }) {
  /* aspect: 515w / 44h ≈ 11.7 */
  const width = height * (515 / 44);
  return (
    <svg width={width} height={height} viewBox="40 168 515 44"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', fill: color, opacity }}>
      <polygon points="47.34 174.32 71.38 174.32 71.38 180.37 63.25 180.37 63.25 205.46 55.46 205.46 55.46 180.37 47.34 180.37 47.34 174.32"/>
      <path d="M79.13,196.14c2.71,2.47,5.28,3.89,9.02,3.89,2.05,0,5.81-.88,5.81-3.6,0-1.56-1.18-2.35-3.5-2.73l-6.48-1.07c-5.78-.9-8.91-3.98-8.91-8.57,0-7.52,6.07-10.62,12.71-10.62,5.18,0,10.25,2.1,13.74,6l-5.9,4.24c-2.05-2.48-5.07-3.95-8.36-3.95-1.8,0-4.41,1.14-4.41,3.15,0,1.67,1.33,2.51,4.32,3l2.97.47c6.21,1,11.33,2.93,11.33,8.88,0,9.35-8.44,11.11-14.26,11.11-5.28,0-9.79-1.7-14.04-6.35l5.95-3.85Z"/>
      <path d="M133.62,194.6c0,8.57-7.21,11.75-13.21,11.75s-13.15-3.18-13.15-11.75v-20.28h7.78v19.64c0,3.5,1.36,6.07,5.37,6.07s5.42-2.58,5.42-6.07v-19.64h7.79v20.28Z"/>
      <polygon points="138.34 174.32 162.39 174.32 162.39 180.37 154.28 180.37 154.28 205.46 146.48 205.46 146.48 180.37 138.34 180.37 138.34 174.32"/>
      <path d="M172.96,174.32h8.06l11.76,31.14h-8.35l-1.56-4.91h-11.52l-1.58,4.91h-8.31l11.51-31.14ZM180.96,194.8l-3.84-12.87h-.1l-3.85,12.87h7.78Z"/>
      <polygon points="200.67 190.93 188.86 174.32 197.97 174.32 204.57 185.08 211.17 174.32 220.27 174.32 208.46 190.93 208.46 205.46 200.67 205.46 200.67 190.93"/>
      <path d="M228.31,174.32h8.06l11.75,31.14h-8.33l-1.6-4.91h-11.51l-1.55,4.91h-8.31l11.49-31.14ZM236.31,194.8l-3.83-12.87h-.08l-3.87,12.87h7.78Z"/>
      <path d="M265.52,174.32h15.22c6.3,0,10.54,2.19,10.54,8,0,3.98-2.27,6.08-6.52,7.04v.09c4.24.31,7.65,2.54,7.65,7.13,0,6.43-4.81,8.88-12.73,8.88h-14.17v-31.14ZM272.95,186.57h6.47c2.49,0,4.07-.96,4.07-3.24,0-2.62-1.49-3.24-4.07-3.24h-6.47v6.47ZM273.04,199.69h6.34c4.11,0,5.25-1.62,5.25-3.63,0-2.58-.96-3.72-3.85-3.72h-7.74v7.35Z"/>
      <path d="M311.31,206.34c-9.93,0-15.74-7.7-15.74-16.44s5.82-16.45,15.74-16.45,15.75,7.7,15.75,16.45-5.82,16.44-15.75,16.44M311.31,180.01c-4.55,0-7.96,2.89-7.96,9.89,0,4.55,1.84,9.88,7.96,9.88,5.77,0,7.96-5.07,7.96-9.88s-2.19-9.89-7.96-9.89"/>
      <path d="M346.16,206.34c-9.93,0-15.75-7.7-15.75-16.44s5.82-16.45,15.75-16.45,15.74,7.7,15.74,16.45-5.82,16.44-15.74,16.44M346.16,180.01c-4.55,0-7.96,2.89-7.96,9.89,0,4.55,1.84,9.88,7.96,9.88,5.77,0,7.96-5.07,7.96-9.88s-2.19-9.89-7.96-9.89"/>
      <polygon points="366.22 174.32 374 174.32 374 186.74 385.15 174.32 395.47 174.32 384.15 186.13 395.82 205.46 387.16 205.46 378.68 191.64 374 196.41 374 205.46 366.22 205.46 366.22 174.32"/>
      <path d="M404.46,196.15c2.71,2.45,5.29,3.89,9.01,3.89,2.05,0,5.82-.87,5.82-3.59,0-1.57-1.18-2.36-3.5-2.76l-6.47-1.05c-5.77-.92-8.92-3.98-8.92-8.57,0-7.52,6.08-10.63,12.73-10.63,5.16,0,10.24,2.1,13.73,5.99l-5.9,4.24c-2.05-2.49-5.07-3.94-8.35-3.94-1.79,0-4.42,1.14-4.42,3.15,0,1.66,1.36,2.49,4.33,2.97l2.97.48c6.21,1.01,11.33,2.93,11.33,8.88,0,9.36-8.44,11.11-14.26,11.11-5.29,0-9.8-1.71-14.04-6.34l5.95-3.85Z"/>
      <polygon points="430.48 174.32 454.53 174.32 454.53 180.36 446.4 180.36 446.4 205.46 438.61 205.46 438.61 180.36 430.48 180.36 430.48 174.32"/>
      <path d="M472.29,206.34c-9.93,0-15.75-7.7-15.75-16.44s5.82-16.45,15.75-16.45,15.75,7.7,15.75,16.45-5.82,16.44-15.75,16.44M472.29,180.01c-4.55,0-7.96,2.89-7.96,9.89,0,4.55,1.84,9.88,7.96,9.88,5.77,0,7.96-5.07,7.96-9.88s-2.19-9.89-7.96-9.89"/>
      <path d="M492.15,174.32h15.57c7,0,11.28,3.24,11.28,10.23,0,4.02-2.54,7.26-6.43,8.4l7.13,12.51h-8.7l-6.12-11.2h-4.94v11.2h-7.79v-31.14ZM499.94,188.49h7.13c2.49-.04,4.15-1.31,4.15-4.2s-1.66-4.15-4.15-4.2h-7.13v8.4Z"/>
      <polygon points="523.29 205.46 523.29 174.32 546.2 174.32 546.2 180.36 531.07 180.36 531.07 186.04 545.2 186.04 545.2 192.08 531.07 192.08 531.07 199.43 547.52 199.43 547.52 205.46 523.29 205.46"/>
    </svg>
  );
}

/* ── Co-brand lockup ── */
function CoBrand({ scale = 1, muted = false, dark = false }) {
  const op = muted ? 0.55 : 1;
  const filter = dark
    ? 'brightness(0) invert(1) opacity(0.85)'
    : 'brightness(0) saturate(100%) invert(12%) sepia(35%) saturate(700%) hue-rotate(190deg) brightness(90%)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale, opacity: op }}>
      <TsutayaLogoH height={13 * scale} color={dark ? '#F5F2ED' : BRAND.navy} opacity={dark ? 0.85 : 0.75} />
      <span style={{ fontFamily: "'DM Mono','Geist Mono',monospace", fontSize: 14,
        color: dark ? 'rgba(245,242,237,0.4)' : 'rgba(138,111,92,0.6)', fontWeight: 400 }}>×</span>
      <img src="assets/wired-tokyo-logo.svg" alt="WIRED TOKYO"
        style={{ height: 15 * scale, width: 'auto', display: 'block', filter }} />
    </div>
  );
}

/* ── Infinity mark — thin, elegant ── */
function InfinityMark({ size = 60, color = BRAND.navy, stroke = 1.5 }) {
  return (
    <svg width={size} height={size / 2} viewBox="0 0 200 100" overflow="visible">
      <path d="M 50 50 C 50 20 0 20 0 50 C 0 80 50 80 100 50 C 150 20 200 20 200 50 C 200 80 150 80 100 50 Z"
        fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

/* ── Stamp grid 4×2 — light version ── */
function StampGrid8({ filled = 0, cell = 36, gap = 6 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${cell}px)`, gap }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const active = i < filled;
        return (
          <div key={i} style={{
            width: cell, height: cell, borderRadius: cell * 0.2,
            background: active ? BRAND.warm : 'rgba(26,43,74,0.04)',
            border: `1px solid ${active ? 'rgba(138,111,92,0.28)' : 'rgba(26,43,74,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Mono',monospace", fontSize: cell * 0.28,
            color: active ? BRAND.navy : 'rgba(26,43,74,0.2)', fontWeight: 600,
          }}>
            {active ? '∞' : String(i+1).padStart(2,'0')}
          </div>
        );
      })}
    </div>
  );
}

/* ── Faux QR block — deterministic pattern ── */
function QRBlock({ size = 120, color = BRAND.navy, bg = BRAND.surface, seed = 1 }) {
  const N = 21;
  const cells = [];
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) cells.push(rand() > 0.5);
  const setBlock = (cx, cy) => {
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const e = x===0||x===6||y===0||y===6, i = x>=2&&x<=4&&y>=2&&y<=4;
      cells[(cy+y)*N+(cx+x)] = e||i;
    }
  };
  setBlock(0,0); setBlock(N-7,0); setBlock(0,N-7);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${N} ${N}`} style={{ background: bg, display: 'block' }}>
      {cells.map((on, i) => on && (
        <rect key={i} x={i%N} y={Math.floor(i/N)} width="1" height="1" fill={color}/>
      ))}
    </svg>
  );
}

/* ── Crop marks for print ── */
function CropMarks({ color = 'rgba(138,111,92,0.3)', len = 10, inset = 4 }) {
  const s = (pos) => ({ position: 'absolute', ...pos, background: color, pointerEvents: 'none' });
  return (
    <>
      <div style={{ ...s({ top: inset, left: inset, width: len, height: 0.75 }) }}/>
      <div style={{ ...s({ top: inset, left: inset, width: 0.75, height: len }) }}/>
      <div style={{ ...s({ top: inset, right: inset, width: len, height: 0.75 }) }}/>
      <div style={{ ...s({ top: inset, right: inset, width: 0.75, height: len }) }}/>
      <div style={{ ...s({ bottom: inset, left: inset, width: len, height: 0.75 }) }}/>
      <div style={{ ...s({ bottom: inset, left: inset, width: 0.75, height: len }) }}/>
      <div style={{ ...s({ bottom: inset, right: inset, width: len, height: 0.75 }) }}/>
      <div style={{ ...s({ bottom: inset, right: inset, width: 0.75, height: len }) }}/>
    </>
  );
}

/* ── Nexus Life logo wordmark — unified system ──────────────────
   variant: 'scale' horizontal scale-contrast (default, most materials)
            'stack' editorial stack with large ∞ left (posters)
            'mark'  ∞ as hero symbol, text below (icon/badge)
   size: scale multiplier (1 = ~96px base)                        */
function NexusLogo({ variant = 'scale', size = 1, fg = BRAND.navy, accent = BRAND.accent, dark = false }) {
  const _fg   = dark ? BRAND.bg : fg;
  const _ac   = dark ? '#B8953C' : accent;
  const _sub  = dark ? 'rgba(245,242,237,0.32)' : 'rgba(26,43,74,0.35)';
  const _rule = dark ? 'rgba(184,149,60,0.3)' : 'rgba(26,43,74,0.14)';

  /* ① SCALE CONTRAST — Nexus full, ∞ 0.78×, Life 0.52× raised */
  if (variant === 'scale') {
    const fs = 96 * size;
    return (
      <div style={{ display: 'inline-block' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: fs, fontWeight: 600, color: _fg,
            letterSpacing: '-0.025em', lineHeight: 1 }}>Nexus</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: fs * 0.78, color: _ac, fontWeight: 300,
            letterSpacing: '-0.05em', lineHeight: 1,
            position: 'relative', top: 2 * size, margin: `0 ${4 * size}px` }}>∞</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: fs * 0.52, fontWeight: 300, fontStyle: 'italic', color: _fg,
            letterSpacing: '0.06em', lineHeight: 1,
            position: 'relative', top: -6 * size, opacity: 0.82 }}>Life</span>
        </div>
      </div>
    );
  }

  /* ② B-STACK — Nexus上 / ─∞─ 分隔線 / Life下 (Logo standard B variant) */
  if (variant === 'b-stack') {
    const fs = 88 * size;
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif",
          fontSize: fs, fontWeight: 700, color: _fg,
          letterSpacing: '-0.03em', lineHeight: 0.9 }}>Nexus</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 * size, margin: `${10 * size}px 0` }}>
          <div style={{ height: 1, width: 72 * size, background: _rule }} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: fs * 0.52, color: _ac, fontWeight: 300, lineHeight: 1 }}>∞</span>
          <div style={{ height: 1, width: 72 * size, background: _rule }} />
        </div>
        <span style={{ fontFamily: "'Cormorant Garamond',serif",
          fontSize: fs, fontWeight: 300, fontStyle: 'italic', color: _fg,
          letterSpacing: '-0.02em', lineHeight: 0.9, opacity: 0.88 }}>Life</span>
      </div>
    );
  }

  /* ③ EDITORIAL STACK — large ∞ left, Nexus/Life stacked right */
  if (variant === 'stack') {
    const lh = 66 * size;
    return (
      <div style={{ display: 'inline-flex', alignItems: 'stretch', gap: 28 * size }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: lh * 2.1, fontFamily: "'Cormorant Garamond',serif",
          fontWeight: 300, color: _ac, lineHeight: 0.82, letterSpacing: '-0.05em', flexShrink: 0 }}>
          ∞
        </div>
        <div style={{ width: 1, background: _rule, alignSelf: 'stretch' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 * size }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: lh, fontWeight: 700, color: _fg,
            letterSpacing: '-0.02em', lineHeight: 0.92 }}>Nexus</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: lh, fontWeight: 300, fontStyle: 'italic', color: _fg,
            letterSpacing: '0.01em', lineHeight: 0.92, opacity: 0.78 }}>Life</div>
        </div>
      </div>
    );
  }

  /* ⑤ MARK — ∞ hero symbol, wordmark below */
  if (variant === 'mark') {
    const markFs = 160 * size;
    const subFs  = 20 * size;
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column',
        alignItems: 'center', gap: 14 * size }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif",
          fontSize: markFs, fontWeight: 300, color: _ac,
          lineHeight: 0.72, letterSpacing: '-0.06em' }}>∞</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 * size }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: subFs, fontWeight: 700, color: _fg,
            letterSpacing: '0.01em' }}>Nexus</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: subFs, fontWeight: 300, fontStyle: 'italic', color: _fg,
            opacity: 0.75, letterSpacing: '0.02em' }}>Life</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 * size }}>
          <div style={{ height: 1, width: 20 * size, background: _rule }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9 * size,
            color: _sub, letterSpacing: '0.22em' }}>8TH ANNIVERSARY · 台中市政店</span>
          <div style={{ height: 1, width: 20 * size, background: _rule }} />
        </div>
      </div>
    );
  }

  return null;
}

/* ── Thin divider rule ── */
function Rule({ width = '2.5rem', color = BRAND.divider }) {
  return <div style={{ width, height: 1, background: color }}/>;
}

/* ── Mono label ── */
function MonoLabel({ children, color = BRAND.textSub, size = 9 }) {
  return (
    <span style={{ fontFamily: "'DM Mono','Geist Mono',monospace", fontSize: size,
      letterSpacing: '0.22em', textTransform: 'uppercase', color, fontWeight: 500 }}>
      {children}
    </span>
  );
}

Object.assign(window, {
  BRAND, NexusField, CoBrand, NexusLogo, InfinityMark, StampGrid8, QRBlock, CropMarks, Rule, MonoLabel,
});
