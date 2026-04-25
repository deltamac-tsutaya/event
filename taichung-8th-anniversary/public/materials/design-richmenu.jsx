/* ─── Design 8: LINE Rich Menu (2500×1686) ────────────────────────
     LINE 圖文選單 Large template — the "action bar" users see when they
     open the campaign's LINE OA. Six tile layout (3 columns × 2 rows).
     Each tile needs a recognizable symbol at ~30%+ of tile height and
     a readable label. Designed at full 2500×1686 so icons stay crisp
     when LINE renders at 1:1.                                       */

const RICHMENU_TILES = [
  {
    id: 'scan',
    title: '掃碼集印',
    en: 'SCAN',
    desc: '進入 QR 掃描器',
    icon: 'scan',
    accent: true,
    wide: false,
  },
  {
    id: 'visual',
    title: '主視覺',
    en: 'CAMPAIGN',
    desc: '活動主頁 · 集印說明',
    icon: 'infinity',
    wide: false,
  },
  {
    id: 'coupon',
    title: '優惠券匣',
    en: 'COUPONS',
    desc: '查看我的中獎優惠券',
    icon: 'coupon',
    wide: false,
  },
  {
    id: 'prize',
    title: '獎項一覽',
    en: 'PRIZES',
    desc: '14 項獎品 · 100% 中獎',
    icon: 'gift',
    wide: true,
  },
  {
    id: 'faq',
    title: '活動說明',
    en: 'ABOUT',
    desc: '規則 / 常見問題',
    icon: 'info',
    wide: true,
  },
];

/* ── Richmenu icon set ───────────────────────────── */
function RMIcon({ kind, size = 140, color = '#F5F2ED' }) {
  const s = size;
  const sw = 6; // stroke width at full res
  switch (kind) {
    case 'scan':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
          {/* corners */}
          <path d="M15 35 L15 15 L35 15" stroke={color} strokeWidth={sw} strokeLinecap="square" />
          <path d="M65 15 L85 15 L85 35" stroke={color} strokeWidth={sw} strokeLinecap="square" />
          <path d="M15 65 L15 85 L35 85" stroke={color} strokeWidth={sw} strokeLinecap="square" />
          <path d="M65 85 L85 85 L85 65" stroke={color} strokeWidth={sw} strokeLinecap="square" />
          {/* scan line */}
          <line x1="22" y1="50" x2="78" y2="50" stroke={color} strokeWidth={sw * 0.7} />
        </svg>
      );
    case 'infinity':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
          <path d="M28 50 C28 38 38 38 50 50 C62 62 72 62 72 50 C72 38 62 38 50 50 C38 62 28 62 28 50 Z"
            stroke={color} strokeWidth={sw} fill="none" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="3" fill={color} />
        </svg>
      );
    case 'coupon':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
          {/* ticket shape with perforation */}
          <path d="M15 32 L85 32 L85 52 C80 52 80 58 85 58 L85 78 L15 78 L15 58 C20 58 20 52 15 52 Z"
            stroke={color} strokeWidth={sw} fill="none" strokeLinejoin="round" />
          {/* dotted vertical divider */}
          {[36,43,50,57,64,71].map(y => (
            <line key={y} x1="35" y1={y} x2="35" y2={y+4}
              stroke={color} strokeWidth={sw * 0.6} strokeLinecap="round" />
          ))}
          {/* star / prize mark */}
          <circle cx="58" cy="55" r="9" stroke={color} strokeWidth={sw * 0.7} fill="none" />
          <line x1="58" y1="46" x2="58" y2="64" stroke={color} strokeWidth={sw * 0.5} />
          <line x1="49" y1="55" x2="67" y2="55" stroke={color} strokeWidth={sw * 0.5} />
        </svg>
      );
    case 'gift':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
          <rect x="22" y="40" width="56" height="42" rx="2" stroke={color} strokeWidth={sw} />
          <rect x="18" y="32" width="64" height="10" stroke={color} strokeWidth={sw} />
          <line x1="50" y1="32" x2="50" y2="82" stroke={color} strokeWidth={sw} />
          <path d="M50 32 C42 24 30 24 32 32" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M50 32 C58 24 70 24 68 32" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'map':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
          <path d="M50 20 C38 20 30 28 30 40 C30 55 50 78 50 78 C50 78 70 55 70 40 C70 28 62 20 50 20 Z"
            stroke={color} strokeWidth={sw} fill="none" strokeLinejoin="round" />
          <circle cx="50" cy="40" r="6" stroke={color} strokeWidth={sw * 0.8} />
        </svg>
      );
    case 'info':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="32" stroke={color} strokeWidth={sw} fill="none" />
          <circle cx="50" cy="34" r="2.5" fill={color} />
          <line x1="50" y1="46" x2="50" y2="68" stroke={color} strokeWidth={sw} strokeLinecap="square" />
        </svg>
      );
    default:
      return null;
  }
}

function RichMenu() {
  const W = 2500, H = 1686;
  const COLS = 3;
  const ROWS = 2;

  return (
    <div style={{
      position: 'relative', width: W, height: H, overflow: 'hidden',
      background: BRAND.navy,
      fontFamily: "'DM Sans','Geist',sans-serif",
      color: BRAND.bg,
    }}>
      {/* Background grid + watermark */}
      <NexusField tone="dark" showWatermark={true} watermarkChar="∞" density={180} />

      {/* Top header bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '64px 80px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '2px solid rgba(245,242,237,0.12)',
        background: 'rgba(26,43,74,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {/* NexusLogo scale variant for richmenu header */}
          <NexusLogo variant="scale" size={1.3} fg={BRAND.bg} accent={BRAND.accent} />
          <div style={{
            paddingLeft: 28,
            borderLeft: '1px solid rgba(245,242,237,0.2)',
          }}>
            <div style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 32, letterSpacing: '0.24em',
              color: 'rgba(245,242,237,0.5)', marginBottom: 6,
            }}>
              8TH ANNIVERSARY
            </div>
            <div style={{ fontSize: 30, color: BRAND.bg, letterSpacing: '0.12em',
              fontWeight: 500 }}>
              集印 · 每日抽獎 · 100% 中獎
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: "'DM Mono',monospace", fontSize: 28,
            color: 'rgba(245,242,237,0.45)', letterSpacing: '0.22em',
          }}>
            2026 · 04.25 — 05.24
          </div>
          <div style={{
            marginTop: 10,
            fontFamily: "'DM Mono',monospace", fontSize: 28,
            color: BRAND.accent, letterSpacing: '0.22em',
          }}>
            TSUTAYA × WIRED TOKYO · 台中市政店
          </div>
        </div>
      </div>

      {/* Tile grid — the 6 action buttons */}
      {(() => {
        const gridTop = 300;
        const gridBottom = H - 100;
        const gridLeft = 80;
        const gridRight = W - 80;
        const gapX = 24;
        const gapY = 24;
        const tileW = (gridRight - gridLeft - gapX * (COLS - 1)) / COLS;
        const tileH = (gridBottom - gridTop - gapY * (ROWS - 1)) / ROWS;

        /* Layout: top row 3 tiles equal width, bottom row 2 tiles wide */
        const topTiles = RICHMENU_TILES.filter(t => !t.wide);
        const btmTiles = RICHMENU_TILES.filter(t => t.wide);
        const btmTileW = (gridRight - gridLeft - gapX * (btmTiles.length - 1)) / btmTiles.length;

        const renderTile = (t, x, y, w, h, idx) => {
          const isAccent = t.accent;
          const bg = isAccent ? BRAND.accent : 'rgba(245,242,237,0.04)';
          const border = isAccent ? '2px solid rgba(245,242,237,0.4)' : '2px solid rgba(245,242,237,0.14)';
          const descColor = isAccent ? 'rgba(245,242,237,0.88)' : 'rgba(245,242,237,0.55)';
          return (
            <div key={t.id} style={{
              position: 'absolute', left: x, top: y, width: w, height: h,
              background: bg, border, borderRadius: 24,
              padding: '60px 60px', display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 36, right: 36,
                fontFamily: "'DM Mono',monospace", fontSize: 28,
                color: isAccent ? 'rgba(245,242,237,0.7)' : 'rgba(245,242,237,0.35)',
                letterSpacing: '0.12em' }}>
                0{idx + 1} / 05
              </div>
              <div style={{ marginTop: 10 }}>
                <RMIcon kind={t.icon} size={t.wide ? 160 : 200} color={BRAND.bg} />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 26,
                  letterSpacing: '0.22em', color: descColor, marginBottom: 14 }}>
                  {t.en}
                </div>
                <div style={{ fontFamily: "'Noto Serif TC','Cormorant Garamond',serif",
                  fontSize: t.wide ? 72 : 84, fontWeight: 600, lineHeight: 1,
                  color: BRAND.bg, letterSpacing: '0.06em', marginBottom: 16 }}>
                  {t.title}
                </div>
                <div style={{ fontSize: 28, color: descColor, letterSpacing: '0.04em', lineHeight: 1.4 }}>
                  {t.desc}
                </div>
              </div>
            </div>
          );
        };

        return [
          ...topTiles.map((t, i) => renderTile(t,
            gridLeft + i * (tileW + gapX), gridTop, tileW, tileH, i)),
          ...btmTiles.map((t, i) => renderTile(t,
            gridLeft + i * (btmTileW + gapX), gridTop + tileH + gapY, btmTileW, tileH, topTiles.length + i)),
        ];
      })()}

    </div>
  );
}

Object.assign(window, { RichMenu });
