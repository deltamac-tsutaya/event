/* ─── Design 1: A4 Main Visual Poster + 1080×1920 digital ── */

function PosterA4({ tweaks }) {
  const W = 794, H = 1123;
  return (
    <div style={{
      position: 'relative', width: W, height: H, overflow: 'hidden',
      background: BRAND.bg,
      fontFamily: "'DM Sans','Geist',sans-serif",
      color: BRAND.navy,
    }}>
      <NexusField tone="light" showWatermark={true} watermarkChar="8" density={44} />
      <CropMarks />

      {/* ── Header ── */}
      <div style={{ position: 'absolute', top: 28, left: 32, right: 32, height: 1, background: BRAND.border }} />
      <div style={{
        position: 'absolute', top: 38, left: 36, right: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <CoBrand scale={1} />
        <MonoLabel color={BRAND.accent} size={14}>2026.04.25 — 05.24</MonoLabel>
      </div>

      {/* ── Eyebrow ── */}
      <div style={{ position: 'absolute', top: 96, left: 36, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Rule width="36px" />
        <MonoLabel color={BRAND.textSub} size={14}>8TH ANNIVERSARY · 台中市政店 · TSUTAYA × WIRED TOKYO</MonoLabel>
      </div>

      {/* ── NexusLogo — 橫排版 ── */}
      <div style={{ position: 'absolute', top: 160, left: 36 }}>
        <NexusLogo variant="scale" size={1.6} />
      </div>

      {/* ── Tagline (single line, muted) ── */}
      <div style={{
        position: 'absolute', top: 516, left: 36,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <InfinityMark size={40} color={BRAND.accent} stroke={1.5} />
        <span style={{ fontSize: 18, fontWeight: 400, color: BRAND.textSub, letterSpacing: '0.12em' }}>
          無限日常 · 連結生活
        </span>
        <span style={{ fontSize: 16, fontStyle: 'italic', color: BRAND.textMuted, letterSpacing: '0.04em' }}>
          Connecting Life, Living in Stride.
        </span>
      </div>

      {/* ── Divider ── */}
      <div style={{ position: 'absolute', top: 562, left: 36, right: 36, height: 1, background: BRAND.border }} />

      {/* ── Stamp icon row — circles, no labels ── */}
      <div style={{ position: 'absolute', top: 578, left: 36, right: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <MonoLabel color={BRAND.textMuted} size={14}>COLLECT 8 STAMPS · 集印點導覽</MonoLabel>
          <MonoLabel color={BRAND.textMuted} size={14}>01 – 08</MonoLabel>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
          {STAMP_POINTS_MAIN.map((p) => (
            <div key={p.n} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              position: 'relative',
            }}>
              {/* circular stamp cell */}
              <div style={{
                width: 68, height: 68,
                borderRadius: '50%',
                border: `1.5px solid ${BRAND.border}`,
                background: BRAND.warm,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <img src={p.icon} alt={p.kw}
                  style={{ width: 42, height: 42, objectFit: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(12%) sepia(35%) saturate(700%) hue-rotate(190deg) brightness(90%) opacity(0.75)' }} />
                {/* number badge */}
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  background: BRAND.navy, color: BRAND.bg,
                  fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 700,
                  width: 18, height: 18, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}>
                  {p.n}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How-to single line ── */}
      <div style={{
        position: 'absolute', top: 716, left: 36, right: 36,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {[
          { n: '①', label: 'LINE 登入' },
          { n: '②', label: '掃碼集印' },
          { n: '③', label: '每日抽獎' },
        ].map((s, i) => (
          <React.Fragment key={s.n}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 700,
                color: BRAND.accent }}>
                {s.n}
              </span>
              <span style={{ fontSize: 16, fontWeight: 600, color: BRAND.navy, letterSpacing: '0.04em' }}>
                {s.label}
              </span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: BRAND.border }} />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ position: 'absolute', top: 756, left: 36, right: 36, height: 1, background: BRAND.border }} />

      {/* ── Infinity Day prize callout — gold luxury ── */}
      <div style={{
        position: 'absolute', top: 776, left: 36, right: 36,
        background: '#1A1205', borderRadius: 12,
        border: '1px solid rgba(196,162,74,0.35)',
        padding: '24px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif",
              fontSize: 26, color: '#C4A24A', lineHeight: 1 }}>∞</span>
            <MonoLabel color="rgba(228,210,160,0.55)" size={14}>INFINITY DAY · 加碼大獎</MonoLabel>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#F5EDD6',
            fontFamily: "'Cormorant Garamond','Noto Serif TC',serif", letterSpacing: '0.04em', lineHeight: 1.2 }}>
            和牛牛排雙人套餐
          </div>
          <div style={{ marginTop: 8, fontSize: 14, color: 'rgba(228,210,160,0.6)',
            lineHeight: 1.6, letterSpacing: '0.02em' }}>
            湯品 ×2 · 開胃菜或沙拉 ×1 · 主食 ×1<br/>
            和牛牛排佐特製橙醋醬汁 ×1 · 飲品 ×2
          </div>
          <div style={{ marginTop: 10, fontSize: 14, color: '#C4A24A',
            fontFamily: "'DM Mono',monospace", letterSpacing: '0.14em' }}>
            限量 8 份　｜　05 / 24 · 20:00 開獎
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <QRBlock size={88} color='#F5EDD6' bg='#1A1205' seed={999} />
          <div style={{ marginTop: 6, fontFamily: "'DM Mono',monospace", fontSize: 11,
            color: 'rgba(196,162,74,0.45)', letterSpacing: '0.14em' }}>SCAN TO JOIN</div>
        </div>
      </div>

      {/* ── CTA tagline ── */}
      <div style={{
        position: 'absolute', top: 992, left: 36, right: 36, textAlign: 'center',
      }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: BRAND.navy,
          fontFamily: "'Noto Serif TC',serif", letterSpacing: '0.12em' }}>
          找出 8 個印記 · 解鎖每日抽獎 · 14 項獎品 100% 中獎
        </span>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'absolute', bottom: 28, left: 36, right: 36,
        borderTop: `1px solid ${BRAND.border}`, paddingTop: 12,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <MonoLabel color={BRAND.textMuted} size={14}>TSUTAYA BOOKSTORE × WIRED TOKYO · 台中市政店</MonoLabel>
        <MonoLabel color={BRAND.accent} size={14}>NEXUS.LIFE</MonoLabel>
      </div>
    </div>
  );
}

function PosterDigital({ tweaks }) {
  const W = 540, H = 960;
  return (
    <div style={{
      position: 'relative', width: W, height: H, overflow: 'hidden',
      background: BRAND.bg,
      fontFamily: "'DM Sans','Geist',sans-serif",
      color: BRAND.navy,
    }}>
      <NexusField tone="light" showWatermark={true} watermarkChar="8" density={36} />

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '20px 28px',
        borderBottom: `1px solid ${BRAND.border}`,
        background: 'rgba(245,242,237,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <CoBrand scale={1.1} />
        <MonoLabel color={BRAND.accent} size={12}>2026.04.25—05.24</MonoLabel>
      </div>

      {/* Eyebrow */}
      <div style={{ position: 'absolute', top: 96, left: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Rule width="28px" />
        <MonoLabel color={BRAND.textSub} size={14}>8TH ANNIVERSARY · 台中市政店</MonoLabel>
      </div>

      {/* NexusLogo B 直排版 */}
      <div style={{ position: 'absolute', top: 120, left: 28 }}>
        <NexusLogo variant="b-stack" size={1.38} />
      </div>

      {/* Tagline */}
      <div style={{
        position: 'absolute', top: 404, left: 28,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <InfinityMark size={28} color={BRAND.accent} stroke={1.5} />
        <span style={{ fontSize: 16, color: BRAND.textSub, letterSpacing: '0.1em' }}>無限日常 · 連結生活</span>
      </div>

      {/* Divider */}
      <div style={{ position: 'absolute', top: 440, left: 28, right: 28, height: 1, background: BRAND.border }} />

      {/* Stamp icons — 4×2 circular grid */}
      <div style={{ position: 'absolute', top: 456, left: 28, right: 28 }}>
        <MonoLabel color={BRAND.textMuted} size={14}>COLLECT 8 STAMPS</MonoLabel>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {STAMP_POINTS_MAIN.map((p) => (
            <div key={p.n} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              position: 'relative',
            }}>
              <div style={{
                width: 'calc(100%)', aspectRatio: '1',
                borderRadius: '50%',
                border: `1.5px solid ${BRAND.border}`,
                background: BRAND.warm,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <img src={p.icon} alt={p.kw}
                  style={{ width: '58%', height: '58%', objectFit: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(12%) sepia(35%) saturate(700%) hue-rotate(190deg) brightness(90%) opacity(0.75)' }} />
                <div style={{
                  position: 'absolute', bottom: -1, right: -1,
                  background: BRAND.navy, color: BRAND.bg,
                  fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 700,
                  width: 16, height: 16, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.n}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinity Day box — gold luxury */}
      <div style={{
        position: 'absolute', top: 710, left: 28, right: 28,
        background: '#1A1205', borderRadius: 12, padding: '18px 22px',
        border: '1px solid rgba(196,162,74,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif",
            fontSize: 22, color: '#C4A24A', lineHeight: 1 }}>∞</span>
          <MonoLabel color="rgba(228,210,160,0.5)" size={14}>INFINITY DAY · 加碼大獎</MonoLabel>
        </div>
        <div style={{ marginTop: 8, fontSize: 20, fontWeight: 600, color: '#F5EDD6',
          fontFamily: "'Cormorant Garamond','Noto Serif TC',serif", letterSpacing: '0.04em' }}>
          和牛牛排雙人套餐
        </div>
        <div style={{ marginTop: 4, fontSize: 13, color: 'rgba(228,210,160,0.6)',
          lineHeight: 1.55, letterSpacing: '0.02em' }}>
          湯品 ×2 · 開胃菜或沙拉 ×1 · 主食 ×1 · 飲品 ×2<br/>
          和牛牛排佐特製橙醋醬汁 ×1
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: '#C4A24A',
          fontFamily: "'DM Mono',monospace", letterSpacing: '0.12em' }}>
          限量 8 份　｜　05 / 24 · 20:00 開獎
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position: 'absolute', top: 876, left: 28, right: 28, textAlign: 'center',
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.navy, letterSpacing: '0.06em' }}>
          找出 8 個印記 · 解鎖每日抽獎
        </div>
        <div style={{ marginTop: 4, fontSize: 14, color: BRAND.brown,
          fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em' }}>
          14 項獎品 · 100% 中獎
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 20, left: 28, right: 28,
        borderTop: `1px solid ${BRAND.border}`, paddingTop: 10,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <MonoLabel color={BRAND.textMuted} size={14}>台中市政店 · 8TH</MonoLabel>
        <MonoLabel color={BRAND.accent} size={14}>NEXUS.LIFE</MonoLabel>
      </div>
    </div>
  );
}

Object.assign(window, { PosterA4, PosterDigital });
