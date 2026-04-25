/* ─── Design 7: Table A6 — light theme ── */

function TableA6({ tweaks }) {
  // A6: 105×148mm → 397×559px at 96dpi
  const W = 397, H = 559;
  return (
    <div style={{
      position: 'relative', width: W, height: H, overflow: 'hidden',
      background: '#1A1205',
      fontFamily: "'DM Sans','Geist',sans-serif",
    }}>
      {/* Subtle grid on navy */}
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

      {/* ── 活動 LOGO — 左上 ── */}
      <div style={{ position: 'absolute', top: 56, left: 18 }}>
        <NexusLogo variant="scale" size={0.42} dark={true} />
      </div>

      {/* ∞ INFINITY DAY badge */}
      <div style={{
        position: 'absolute', top: 110, left: 18, right: 18,
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

      {/* Prize — maximum font size */}
      <div style={{
        position: 'absolute', top: 124, left: 18, right: 18, textAlign: 'center',
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

      {/* Draw date + quantity — horizontal */}
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
        {/* QR */}
        <div style={{ flexShrink: 0, background: '#FFFFFF', padding: 3, borderRadius: 4 }}>
          <QRBlock size={62} color='#1A1205' bg='#F5EDD6' seed={777} />
        </div>
        {/* CTA text */}
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

Object.assign(window, { TableA6 });
