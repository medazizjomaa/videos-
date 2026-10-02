import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS, GRADIENTS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {IconBag, IconCheck, IconMenu} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {DISPLAY_STACK, UI_STACK} from '../fonts';
import {EASE_OUT, lerp, SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.pricing;
const C = COPY.pricing;

/** Two plans: e-commerce from 50 DT/month, restaurant 60 DT/month + 150 DT setup. */
export const S12Pricing: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const cardW = L.square ? 440 : 860;
  const cardH = L.square ? 560 : 520;
  const gap = L.square ? 28 : 36;
  const top = L.square ? 300 : 470;
  return (
    <AbsoluteFill>
      <Background variant="brand" intensity={1.1} />
      <div style={{position: 'absolute', left: 0, width: L.W, top: L.square ? 70 : L.text.y + 10, display: 'flex', justifyContent: 'center'}}>
        <KineticText lines={C.headline} at={B.headline} size={L.square ? 64 : L.headlineSize} width={L.W - 120} align="center" />
      </div>
      {C.plans.map((p, i) => {
        const pin = sp(f, B.cards + i * B.stagger, SPRINGS.snappy);
        const price = Math.round(lerp(f, [B.count[0] + i * B.stagger, B.count[1] + i * B.stagger], [0, p.price], EASE_OUT));
        const x = L.square ? (L.W - (cardW * 2 + gap)) / 2 + i * (cardW + gap) : (L.W - cardW) / 2;
        const y = L.square ? top : top + i * (cardH + gap);
        const featured = i === 1;
        const Icon = i === 0 ? IconBag : IconMenu;
        return (
          <div
            key={p.name}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: cardW,
              height: cardH,
              borderRadius: 40,
              padding: L.square ? '34px 34px' : '40px 48px',
              boxSizing: 'border-box',
              background: featured
                ? `linear-gradient(160deg, ${alpha('#123A7A', 0.95)} 0%, ${alpha('#0B1530', 0.95)} 70%)`
                : `linear-gradient(160deg, ${alpha('#13203F', 0.95)} 0%, ${alpha('#0B1428', 0.95)} 70%)`,
              border: `1.5px solid ${featured ? alpha(COLORS.cyan, 0.5) : alpha(COLORS.blueSoft, 0.25)}`,
              boxShadow: `0 40px 90px ${alpha('#000000', 0.5)}, 0 0 80px ${alpha(COLORS.blue, featured ? 0.35 : 0.15)}`,
              color: '#fff',
              fontFamily: UI_STACK,
              opacity: Math.min(1, pin * 1.3),
              transform: `translateY(${(1 - pin) * 80}px) scale(${0.92 + 0.08 * pin})`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{width: 64, height: 64, borderRadius: 20, background: GRADIENTS.brand, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon size={32} color="#fff" stroke={2.2} />
              </div>
              <div style={{fontFamily: DISPLAY_STACK, fontSize: L.square ? 30 : 40, fontWeight: 800, letterSpacing: '-0.02em'}}>{p.name}</div>
            </div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: L.square ? 26 : 30}}>
              {p.from ? <span style={{fontSize: L.square ? 24 : 32, fontWeight: 600, color: COLORS.textDim}}>{p.from}</span> : null}
              <span style={{fontFamily: DISPLAY_STACK, fontSize: L.square ? 96 : 128, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{price}</span>
              <span style={{fontSize: L.square ? 24 : 32, fontWeight: 700, color: COLORS.textDim}}>{p.unit}</span>
            </div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 14,
                fontSize: L.square ? 19 : 26,
                fontWeight: 700,
                color: featured ? COLORS.cyan : COLORS.textDim,
                background: featured ? alpha(COLORS.cyan, 0.12) : 'transparent',
                padding: featured ? '6px 14px' : 0,
                borderRadius: 12,
              }}
            >
              {p.setup}
            </div>
            <div style={{marginTop: L.square ? 22 : 26, display: 'flex', flexDirection: 'column', gap: L.square ? 12 : 14}}>
              {p.features.map((ft, k) => {
                const q = sp(f, B.cards + i * B.stagger + 14 + k * 4, SPRINGS.snappy);
                return (
                  <div key={ft} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: L.square ? 21 : 28, fontWeight: 600, opacity: q, transform: `translateX(${(1 - q) * 20}px)`}}>
                    <div style={{width: L.square ? 26 : 34, height: L.square ? 26 : 34, borderRadius: 20, background: alpha(COLORS.blue, 0.3), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <IconCheck size={L.square ? 15 : 20} color={COLORS.cyan} stroke={3} />
                    </div>
                    {ft}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
