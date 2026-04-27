/* ─── Design 7: Table A6 — light theme · 3-step activity guide ── */

function TableA6({ tweaks }) {
  // A6: 105×148mm → 397×559px at 96dpi
  const W = 397, H = 559;
  const LIFF = 'https://liff.line.me/2009815115-CHcrof7l';

  const steps = [
    { n: '①', title: 'LINE 帳號登入',
      desc: '掃描下方 QR Code，以 LINE 帳號授權登入活動頁面。' },
    { n: '②', title: '掃碼集印',
      desc: '在店內找到 8 個集印點立牌，逐一掃描 QR Code 收集印章。' },
    { n: '③', title: '每日解鎖抽獎',
      desc: '集滿 8 枚即可抽獎，每人每日限一次，獎品直送 LINE 優惠券夾。' },
  ];

  return (
    <div style={{
      position: 'relative', width: W, height: H, overflow: 'hidden',
      background: BRAND.bg,
      fontFamily: "'DM Sans','Noto Sans TC',sans-serif",
      color: BRAND.navy,
      display: 'flex', flexDirection: 'column',
    }}>
      <NexusField tone="light" showWatermark={false} density={36} />
      <CropMarks />

      {/* Header */}
      <div style={{
        padding: '13px 18px 11px',
        borderBottom: `1px solid ${BRAND.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(253,250,246,0.85)',
        flexShrink: 0, position: 'relative',
      }}>
        <CoBrand scale={0.75} />
        <MonoLabel color={BRAND.accent} size={13}>活動說明</MonoLabel>
      </div>

      {/* Logo + tagline */}
      <div style={{ padding: '14px 18px 0', flexShrink: 0, position: 'relative' }}>
        <NexusLogo variant="scale" size={0.42} />
        <div style={{
          marginTop: 8, fontSize: 14, color: BRAND.textSub, lineHeight: 1.3,
          fontFamily: "'Noto Serif TC',serif", letterSpacing: '0.03em',
        }}>
          找出 8 個印記，解鎖每日抽獎
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '12px 18px', height: 1, background: BRAND.border,
        flexShrink: 0, position: 'relative' }} />

      {/* Steps */}
      <div style={{ padding: '0 18px', flexShrink: 0, position: 'relative' }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{
            display: 'flex', gap: 14, padding: '10px 0',
            borderBottom: i < 2 ? `1px solid ${BRAND.border}` : 'none',
            alignItems: 'flex-start',
          }}>
            <div style={{
              flexShrink: 0, width: 34,
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 38, fontWeight: 600, lineHeight: 0.88,
              color: BRAND.navy, letterSpacing: '-0.03em',
            }}>{s.n}</div>
            <div style={{ paddingTop: 2 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.navy,
                letterSpacing: '0.02em', marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 11.5, color: BRAND.brown, lineHeight: 1.65,
                letterSpacing: '0.02em' }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ margin: '0 18px', height: 1, background: BRAND.border,
        flexShrink: 0, position: 'relative' }} />

      {/* QR + CTA */}
      <div style={{
        padding: '13px 18px', flexShrink: 0, position: 'relative',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          flexShrink: 0, background: BRAND.surface,
          border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: 6,
        }}>
          <QRBlock size={72} color={BRAND.navy} bg={BRAND.surface} url={LIFF} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.navy,
            lineHeight: 1.35, letterSpacing: '0.02em' }}>
            集滿 8 枚印章即可參加
          </div>
          <div style={{ marginTop: 5, fontFamily: "'DM Mono',monospace", fontSize: 11,
            color: BRAND.textMuted, letterSpacing: '0.18em' }}>SCAN TO JOIN</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 18px 12px',
        borderTop: `1px solid ${BRAND.border}`,
        flexShrink: 0, position: 'relative',
        display: 'flex', justifyContent: 'center',
      }}>
        <MonoLabel color={BRAND.textMuted} size={12}>
          活動期間 2026 / 04 / 25 — 05 / 24 · TSUTAYA BOOKSTORE × WIRED TOKYO · 台中市政店
        </MonoLabel>
      </div>
    </div>
  );
}

Object.assign(window, { TableA6 });
