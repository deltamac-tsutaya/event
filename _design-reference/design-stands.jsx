/* ─── Design 2+3: Stamp point stands (10×15cm) — light theme ─
     Layout: QR + location on TOP, icon + keyword + phrase on BOTTOM.   */

const STAMP_POINTS_MAIN = [
  { n: '01', kw: '無限',   phrase: '從這裡走出去，8 與 ∞ 同時開始。',              loc: '入口主題陳列區', floor: '2F', seed: 101, icon: 'assets/stamps/endless.svg' },
  { n: '02', kw: '陶杯',   phrase: '手溫傳過陶杯，8 年的 ∞ 就在掌心。',            loc: '職人雜貨區',     floor: '2F', seed: 108, icon: 'assets/stamps/drum.svg' },
  { n: '03', kw: '風',     phrase: '露台吹來 ∞ 的風，繞了 8 個年頭才停。',         loc: '戶外座位區',     floor: '3F', seed: 115, icon: 'assets/stamps/wind.svg' },
  { n: '04', kw: '橡實',   phrase: '一顆橡實用 8 年 ∞ 生長，長成整片森林。',       loc: '兒童繪本書櫃',   floor: '3F', seed: 122, icon: 'assets/stamps/acorn.svg' },
  { n: '05', kw: '書',     phrase: '8 層書牆向 ∞ 展開，每格都是新世界。',           loc: '樓梯書牆',       floor: '3F', seed: 129, icon: 'assets/stamps/book.svg' },
  { n: '06', kw: '咖啡',   phrase: '一杯咖啡，8 年的 ∞ 日常，從未厭倦。',          loc: '吧檯區',         floor: '2F', seed: 136, icon: 'assets/stamps/coffee.svg' },
  { n: '07', kw: '光點',   phrase: '光從天井 ∞ 落，你離第 8 枚只剩一步。',         loc: '天井吊燈區',     floor: '3F', seed: 143, icon: 'assets/stamps/flare.svg' },
  { n: '08', kw: '花朵',   phrase: '8 年 ∞ 循環，每天都有一朵花記住你。',          loc: '告示牌',         floor: '1F', seed: 150, icon: 'assets/stamps/flower.svg' },
];

const STAMP_POINTS_EGG = [
  { n: 'A', kw: '松鼠', phrase: '牠等了你 8 分鐘。或者是 ∞ 分鐘——松鼠自己也數不清。', loc: '員工身上（隨機）', floor: '★', seed: 901, icon: 'assets/stamps/squirrel.svg' },
  { n: 'B', kw: '小鳥', phrase: '這個位子空著。小鳥只停在不趕路的人身邊。',            loc: '戶外座位桌上',     floor: '★', seed: 914, icon: 'assets/stamps/bird.svg' },
  { n: 'C', kw: '小鹿', phrase: '電梯只有上下，沒有 ∞。小鹿選擇住在這裡，等一個看得懂的人。', loc: '電梯告示', floor: '★', seed: 927, icon: 'assets/stamps/deer.svg' },
];

function StampStand({ p, egg = false }) {
  const W = 378, H = 567;

  return (
    <div style={{
      position: 'relative', width: W, height: H, overflow: 'hidden',
      background: BRAND.bg,
      fontFamily: "'DM Sans','Geist',sans-serif",
    }}>
      <NexusField tone="light" showWatermark={true} watermarkChar={egg ? '∞' : p.n} density={44} />
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
          {egg ? `EGG / ${p.n}` : `${p.floor} · ${p.n}`}
        </MonoLabel>
      </div>

      {/* ── QR block (top half — primary focal point) ── */}
      <div style={{
        position: 'absolute', top: 60, left: 22, right: 22,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <MonoLabel color={BRAND.textMuted} size={14}>
          {egg ? '★ HIDDEN STAMP' : 'SCAN TO COLLECT'}
        </MonoLabel>

        <div style={{
          background: BRAND.surface,
          border: `1px solid ${BRAND.border}`,
          borderRadius: 8,
          padding: 10,
        }}>
          <QRBlock size={170} color={BRAND.navy} bg={BRAND.surface} seed={p.seed} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.navy,
            letterSpacing: '0.02em', lineHeight: 1.3 }}>
            {p.loc}
          </div>
          <div style={{ marginTop: 4, fontSize: 14, color: BRAND.brown,
            fontFamily: "'DM Mono',monospace", letterSpacing: '0.12em' }}>
            用 LINE 掃描
          </div>
        </div>
      </div>

      {/* ── Divider between QR and symbol ── */}
      <div style={{
        position: 'absolute', top: 340, left: 36, right: 36,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ flex: 1, height: 1, background: BRAND.border }}/>
        <div style={{
          fontFamily: "'Cormorant Garamond','Noto Serif TC',serif",
          fontSize: 72, fontWeight: 600, lineHeight: 0.7,
          color: egg ? 'rgba(138,111,92,0.18)' : 'rgba(26,43,74,0.16)',
          letterSpacing: '-0.04em', userSelect: 'none',
          padding: '0 4px',
        }}>
          {p.n}
        </div>
        <div style={{ flex: 1, height: 1, background: BRAND.border }}/>
      </div>

      {/* ── Icon + keyword (on one line) + phrase (bottom half) ── */}
      <div style={{
        position: 'absolute', top: 394, left: 22, right: 22,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        {/* Icon + Keyword — inline lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={p.icon} alt={p.kw}
            style={{ width: 52, height: 52, objectFit: 'contain',
              filter: egg
                ? 'brightness(0) saturate(100%) invert(40%) sepia(15%) saturate(500%) hue-rotate(10deg) opacity(0.65)'
                : 'brightness(0) saturate(100%) invert(12%) sepia(35%) saturate(700%) hue-rotate(190deg) brightness(90%) opacity(0.8)',
            }} />
          <div style={{
            fontFamily: "'Cormorant Garamond','Noto Serif TC',serif",
            fontSize: p.kw.length > 3 ? 40 : 52,
            fontWeight: 600, lineHeight: 1,
            color: BRAND.navy,
            letterSpacing: '0.1em',
          }}>
            {p.kw}
          </div>
        </div>

        <Rule width="32px" color={egg ? BRAND.divider : 'rgba(59,130,196,0.4)'} />

        {/* Phrase */}
        <p style={{
          fontSize: 14, lineHeight: 1.75,
          color: BRAND.textSub,
          fontWeight: 400,
          fontStyle: egg ? 'italic' : 'normal',
          letterSpacing: '0.03em',
          margin: 0,
          textAlign: 'center',
          textWrap: 'pretty',
          maxWidth: 280,
        }}>
          {p.phrase}
        </p>
      </div>

      {/* ── 活動 LOGO — 右下角 ── */}
      <div style={{
        position: 'absolute', bottom: 18, right: 22,
      }}>
        <NexusLogo variant="scale" size={0.28} fg={BRAND.navy} accent={BRAND.accent} />
      </div>

    </div>
  );
}

Object.assign(window, { STAMP_POINTS_MAIN, STAMP_POINTS_EGG, StampStand });
