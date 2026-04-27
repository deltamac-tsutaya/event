/* ─── Design 7a: Table A6 — Prize version (dark, Infinity Day) ── */

function TableA6Prize({ tweaks }) {
  const W = 397, H = 559;
  const LIFF = 'https://liff.line.me/2009815115-CHcrof7l';
  return (
    <div style={{
      position: 'relative', width: W, height: H, overflow: 'hidden',
      background: '#1A1205',
      fontFamily: "'DM Sans','Geist',sans-serif",
    }}>
      <NexusField tone="dark" showWatermark={true} watermarkChar="∞" density={32} />
      <CropMarks color="rgba(245,242,237,0.25)" />

      {/* Top header strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '14px 18px',
        borderBottom: '1px solid rgba(245,242,237,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <CoBrand scale={0.75} dark={true} />
        <div style={{ fontFamily: "'Cormorant Garamond',serif",
          fontSize: 22, fontWeight: 600, color: 'rgba(245,242,237,0.9)', lineHeight: 1 }}>
          8<sup style={{ fontSize: 14 }}>th</sup>
        </div>
      </div>

      {/* 活動 LOGO */}
      <div style={{ position: 'absolute', top: 56, left: 18 }}>
        <NexusLogo variant="scale" size={0.42} dark={true} />
      </div>

      {/* ∞ INFINITY DAY badge */}
      <div style={{
        position: 'absolute', top: 104, left: 18, right: 18,
        background: 'rgba(245,242,237,0.06)',
        border: '1px solid rgba(245,242,237,0.12)',
        borderRadius: 8,
        padding: '8px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif",
          fontSize: 22, color: '#C4A24A', lineHeight: 1 }}>∞</span>
        <MonoLabel color="rgba(228,210,160,0.55)" size={14}>INFINITY DAY · 加碼大獎</MonoLabel>
      </div>

      {/* Prize */}
      <div style={{
        position: 'absolute', top: 155, left: 18, right: 18, textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond','Noto Serif TC',serif",
          fontSize: 34, fontWeight: 600, lineHeight: 1.15,
          color: '#F5EDD6', letterSpacing: '0.04em',
        }}>
          和牛牛排<br/>雙人套餐
        </div>
        <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7,
          color: 'rgba(245,242,237,0.65)', letterSpacing: '0.02em', padding: '0 4px' }}>
          湯品 ×2｜開胃菜或沙拉 ×1<br/>
          主食 ×1｜飲品 ×2<br/>
          和牛牛排佐特製橙醋醬汁 ×1
        </div>
      </div>

      {/* Divider rule */}
      <div style={{
        position: 'absolute', top: 340, left: 18, right: 18,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(245,242,237,0.15)' }} />
        <InfinityMark size={24} color="rgba(245,242,237,0.3)" stroke={1.5} />
        <div style={{ flex: 1, height: 1, background: 'rgba(245,242,237,0.15)' }} />
      </div>

      {/* Draw date + quantity */}
      <div style={{
        position: 'absolute', top: 360, left: 18, right: 18,
        display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
      }}>
        <div style={{ textAlign: 'center' }}>
          <MonoLabel color="rgba(245,242,237,0.4)" size={14}>限量</MonoLabel>
          <div style={{
            marginTop: 4,
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 44, fontWeight: 600, lineHeight: 1,
            color: '#F5EDD6', letterSpacing: '0.02em',
          }}>
            8 <span style={{ fontSize: 20 }}>份</span>
          </div>
        </div>
        <div style={{ width: 1, background: 'rgba(245,242,237,0.15)', alignSelf: 'stretch' }} />
        <div style={{ textAlign: 'center' }}>
          <MonoLabel color="rgba(245,242,237,0.4)" size={14}>開獎</MonoLabel>
          <div style={{
            marginTop: 4,
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 44, fontWeight: 600, lineHeight: 1,
            color: '#F5EDD6', letterSpacing: '0.02em',
          }}>
            05 / 24
          </div>
          <div style={{ marginTop: 2, fontFamily: "'DM Mono',monospace", fontSize: 14,
            color: '#C4A24A', letterSpacing: '0.18em' }}>
            20:00
          </div>
        </div>
      </div>

      {/* QR + CTA lockup */}
      <div style={{
        position: 'absolute', bottom: 46, left: 18, right: 18,
        background: '#F5EDD6',
        borderRadius: 10,
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flexShrink: 0, background: '#FFFFFF', padding: 3, borderRadius: 4 }}>
          <QRBlock size={62} color='#1A1205' bg='#F5EDD6' url={LIFF} />
        </div>
        <div style={{ flex: 1 }}>
          <MonoLabel color={BRAND.textMuted} size={14}>用 LINE 掃描 · 開始集印</MonoLabel>
          <div style={{ marginTop: 4, fontSize: 15, fontWeight: 700, color: '#1A1205',
            letterSpacing: '0.02em', lineHeight: 1.3 }}>
            集滿 8 枚印章即可參加
          </div>
          <div style={{ marginTop: 2, fontSize: 14, color: BRAND.brown,
            fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em' }}>
            SCAN TO JOIN
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 16, left: 18, right: 18,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <MonoLabel color="rgba(245,242,237,0.3)" size={14}>活動期間 04/25—05/24</MonoLabel>
        <MonoLabel color="rgba(245,242,237,0.3)" size={14}>NEXUS.LIFE</MonoLabel>
      </div>
    </div>
  );
}

/* ─── Design 7b: Table A6 — Guide version (light, 3-step activity) ── */

function TableA6Guide({ tweaks }) {
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

Object.assign(window, { TableA6Prize, TableA6Guide });
