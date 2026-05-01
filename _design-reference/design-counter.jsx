/* ─── Design 6: Counter A4 — light theme ── */

function CounterA4({ tweaks }) {
  const W = 794, H = 1123;
  return (
    <div style={{
      position: 'relative', width: W, height: H, overflow: 'hidden',
      background: BRAND.bg,
      fontFamily: "'DM Sans','Geist',sans-serif",
      color: BRAND.navy,
    }}>
      <NexusField tone="light" showWatermark={false} density={44} />
      <CropMarks />

      {/* Top rule */}
      <div style={{ position: 'absolute', top: 28, left: 36, right: 36, height: 1, background: BRAND.border }} />

      {/* Header */}
      <div style={{
        position: 'absolute', top: 38, left: 36, right: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <CoBrand scale={1} />
        <MonoLabel color={BRAND.accent} size={14}>活動說明</MonoLabel>
      </div>

      {/* Headline */}
      <div style={{ position: 'absolute', top: 100, left: 36, right: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <Rule width="36px" />
          <MonoLabel color={BRAND.textSub} size={14}>8TH ANNIVERSARY CAMPAIGN · 2026.04.25 — 05.24</MonoLabel>
        </div>

        {/* Activity title lockup */}
        {/* NexusLogo scale variant */}
        <NexusLogo variant="scale" size={1.1} />

        <div style={{
          fontFamily: "'Noto Serif TC','Cormorant Garamond',serif",
          fontSize: 28, fontWeight: 500, lineHeight: 1.25, color: BRAND.textSub,
          letterSpacing: '0.04em', marginTop: 18,
        }}>
          找出 8 個印記，解鎖每日抽獎
        </div>
      </div>

      {/* Divider */}
      <div style={{ position: 'absolute', top: 320, left: 36, right: 36, height: 1, background: BRAND.border }} />

      {/* Steps — large number axis */}
      <div style={{ position: 'absolute', top: 342, left: 36, right: 36, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          { n: '①', title: 'LINE 帳號登入', desc: '掃描下方 QR Code，以 LINE 帳號授權登入活動頁面。' },
          { n: '②', title: '掃碼集印',       desc: '在店內找到 8 個集印點立牌，逐一掃描 QR Code 收集印章。彩蛋點位另有隱藏印章，集齊可獲得加碼獎勵。' },
          { n: '③', title: '每日解鎖抽獎',   desc: '集滿 8 枚印章即可抽獎，每人每日限抽一次。抽獎結果直接發送至您的 LINE 優惠券夾。' },
        ].map((s, i) => (
          <div key={s.n} style={{
            display: 'flex', gap: 24, padding: '22px 0',
            borderBottom: i < 2 ? `1px solid ${BRAND.border}` : 'none',
            alignItems: 'flex-start',
          }}>
            {/* Big step number */}
            <div style={{
              flexShrink: 0, width: 64,
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 64, fontWeight: 600, lineHeight: 0.9,
              color: BRAND.navy, letterSpacing: '-0.03em',
            }}>
              {s.n}
            </div>
            <div style={{ paddingTop: 6 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: BRAND.navy,
                letterSpacing: '0.02em', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: BRAND.brown, lineHeight: 1.75,
                letterSpacing: '0.02em', maxWidth: 580 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ position: 'absolute', top: 742, left: 36, right: 36, height: 1, background: BRAND.border }} />

      {/* QR + Infinity Day box */}
      <div style={{
        position: 'absolute', top: 762, left: 36, right: 36,
        display: 'flex', gap: 20, alignItems: 'stretch',
      }}>
        {/* QR join card */}
        <div style={{
          flex: 1, background: BRAND.warm,
          border: `1px solid ${BRAND.border}`, borderRadius: 12,
          padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <MonoLabel color={BRAND.textMuted} size={14}>LINE 登入 · 開始集印</MonoLabel>
          <QRBlock size={140} color={BRAND.navy} bg={BRAND.surface} seed={555} />
          <div style={{ fontSize: 14, color: BRAND.brown, fontFamily: "'DM Mono',monospace",
            letterSpacing: '0.1em', textAlign: 'center' }}>SCAN TO JOIN</div>
        </div>

        {/* Infinity Day — gold luxury */}
        <div style={{
          flex: 2, background: '#1A1205', borderRadius: 12,
          border: '1px solid rgba(196,162,74,0.28)',
          padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: 26, color: '#C4A24A', lineHeight: 1 }}>∞</span>
              <MonoLabel color="rgba(228,210,160,0.5)" size={14}>INFINITY DAY · 加碼大獎</MonoLabel>
            </div>
            <div style={{
              marginTop: 10,
              fontFamily: "'Cormorant Garamond','Noto Serif TC',serif",
              fontSize: 32, fontWeight: 600, color: '#F5EDD6', lineHeight: 1.15,
              letterSpacing: '0.04em',
            }}>
              和牛牛排雙人套餐
            </div>
            <div style={{ marginTop: 8, fontSize: 14, color: 'rgba(228,210,160,0.6)',
              lineHeight: 1.6, letterSpacing: '0.02em' }}>
              湯品 ×2｜開胃菜或沙拉 ×1｜主食 ×1<br/>
              和牛牛排佐特製橙醋醬汁 ×1｜飲品 ×2
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ height: 1, background: 'rgba(196,162,74,0.18)', marginBottom: 12 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <MonoLabel color="rgba(228,210,160,0.4)" size={14}>限量 8 份</MonoLabel>
                <div style={{ marginTop: 4, fontFamily: "'DM Mono',monospace", fontSize: 16,
                  fontWeight: 700, color: '#F5EDD6', letterSpacing: '0.08em' }}>
                  05 / 24 · 20:00 開獎
                </div>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif",
                fontSize: 48, fontWeight: 600, color: 'rgba(196,162,74,0.18)', lineHeight: 1 }}>
                ∞
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 30, left: 36, right: 36,
        borderTop: `1px solid ${BRAND.border}`, paddingTop: 12,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <MonoLabel color={BRAND.textMuted} size={14}>活動期間 2026 / 04 / 25 — 05 / 24</MonoLabel>
        <MonoLabel color={BRAND.textMuted} size={14}>TSUTAYA BOOKSTORE × WIRED TOKYO · 台中市政店</MonoLabel>
      </div>
    </div>
  );
}

Object.assign(window, { CounterA4 });
