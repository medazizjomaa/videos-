import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS, GRADIENTS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {IconBag, IconMenu} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {DISPLAY_STACK, UI_STACK} from '../fonts';
import {EASE_OUT, lerp, SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.pricing;
const C = COPY.pricing;

/** "Starts from" prices: e-commerce 50 DT/month, restaurant 60 DT/month + 150 DT setup. */
export const S12Pricing: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const cardW = L.square ? 440 : 860;
  const cardH = L.square ? 380 : 400;
  const gap = L.square ? 28 : 40;
  const top = L.square ? 360 : 520;
  return (
    <AbsoluteFill>
      <Background variant="brand" intensity={1.1} />
      <div style={{position: 'absolute', left: 0, width: L.W, top: L.square ? 90 : L.text.y + 10, display: 'flex', justifyContent: 'center'}}>
        <KineticText lines={C.headline} at={B.headline} size={L.square ? 66 : L.headlineSize} width={L.W - 120} align="center" />
      </div>
      {C.plans.map((p, i) => {
        const pin = sp(f, B.cards + i * B.stagger, SPRINGS.snappy);
        const price = Math.round(lerp(f, [B.count[0] + i * B.stagger, B.count[1] + i * B.stagger], [0, p.price], EASE_OUT));
        const x = L.square ? (L.W - (cardW * 2 + gap)) / 2 + i * (cardW + gap) : (L.W - cardW) / 2;
        const y = L.square ? top : top + i * (cardH + gap);
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
              padding: L.square ? '36px 36px' : '44px 52px',
              boxSizing: 'border-box',
              background: '#FFFFFF',
              border: `1.5px solid ${alpha(COLORS.blue, i === 1 ? 0.35 : 0.15)}`,
              boxShadow: `0 30px 70px ${alpha('#0B1B3F', 0.12)}, 0 0 80px ${alpha(COLORS.blue, i === 1 ? 0.16 : 0.08)}`,
              color: COLORS.text,
              fontFamily: UI_STACK,
              opacity: Math.min(1, pin * 1.3),
              transform: `translateY(${(1 - pin) * 80}px) scale(${0.92 + 0.08 * pin})`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{width: 68, height: 68, borderRadius: 22, background: GRADIENTS.brand, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon size={34} color="#fff" stroke={2.2} />
              </div>
              <div style={{fontFamily: DISPLAY_STACK, fontSize: L.square ? 32 : 44, fontWeight: 800, letterSpacing: '-0.02em'}}>{p.name}</div>
            </div>
            <div style={{fontSize: L.square ? 26 : 34, fontWeight: 700, color: COLORS.blue, marginTop: L.square ? 28 : 34}}>{p.from}</div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 4}}>
              <span style={{fontFamily: DISPLAY_STACK, fontSize: L.square ? 104 : 136, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{price}</span>
              <span style={{fontSize: L.square ? 26 : 36, fontWeight: 700, color: COLORS.textDim}}>{p.unit}</span>
            </div>
            {p.setup ? (
              <div style={{display: 'inline-block', marginTop: 16, fontSize: L.square ? 20 : 28, fontWeight: 700, color: COLORS.blue, background: alpha(COLORS.blue, 0.08), padding: '7px 16px', borderRadius: 14}}>
                {p.setup}
              </div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
