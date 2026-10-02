import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, COLORS} from '../config';
import {COPY} from '../copy';
import {UI_STACK} from '../fonts';
import {EASE_IN_OUT, lerp} from '../lib/anim';

/** Flat vector satin dress (product illustration). */
export const Dress: React.FC<{color: string; size: number}> = ({color, size}) => {
  const id = `g${color.replace('#', '')}`;
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{display: 'block'}}>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0.82" />
          <stop offset="0.45" stopColor={color} />
          <stop offset="0.62" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="0.7" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path d="M50 2 v6" stroke="#8C8C94" strokeWidth="1.6" fill="none" />
      <path d="M36 12 Q50 6 64 12" stroke="#8C8C94" strokeWidth="1.6" fill="none" />
      <path d="M39 12 L41 30 M61 12 L59 30" stroke={color} strokeWidth="1.6" />
      <path
        d="M40 30 Q50 35 60 30 L62 44 Q63 49 60 52 L79 111 Q50 118 21 111 L40 52 Q37 49 38 44 Z"
        fill={`url(#${id})`}
      />
      <path d="M40 52 Q50 56 60 52" stroke="#000" strokeOpacity="0.18" strokeWidth="1.2" fill="none" />
      <path d="M50 56 L46 112 M56 56 L62 113" stroke="#000" strokeOpacity="0.08" strokeWidth="1.2" fill="none" />
    </svg>
  );
};

export const PRODUCT_CARDS_H = 246;
const CARD_W = 158;
const GAP = 10;

const SWATCH = [
  {dress: COLORS.dressBlack, bg: COLORS.productBg1},
  {dress: COLORS.dressBeige, bg: COLORS.productBg2},
  {dress: COLORS.dressBordeaux, bg: COLORS.productBg3},
];

export const ProductCard: React.FC<{i: number; dark?: boolean}> = ({i, dark = false}) => {
  const p = COPY.products[i];
  const s = SWATCH[i % SWATCH.length];
  return (
    <div
      style={{
        width: CARD_W,
        height: PRODUCT_CARDS_H,
        borderRadius: 18,
        overflow: 'hidden',
        background: dark ? '#1C1C1E' : '#fff',
        border: `1px solid ${dark ? alpha('#FFFFFF', 0.08) : '#E4E6EB'}`,
        flexShrink: 0,
        fontFamily: UI_STACK,
      }}
    >
      <div
        style={{
          height: 156,
          background: `radial-gradient(90% 80% at 50% 30%, #FFFFFF 0%, ${s.bg} 85%)`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <Dress color={s.dress} size={108} />
      </div>
      <div style={{padding: '9px 11px'}}>
        <div style={{fontSize: 14, fontWeight: 600, color: '#0F1222'}}>{p.name}</div>
        <div style={{fontSize: 12.5, color: alpha('#000000', 0.5), marginTop: 1}}>{p.color} · S M L</div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6}}>
          <span style={{fontSize: 14.5, fontWeight: 700, color: '#0F1222'}}>{p.price}</span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: '#0F1222',
              background: '#EFEFEF',
              padding: '3px 9px',
              borderRadius: 10,
            }}
          >
            Voir
          </span>
        </div>
      </div>
    </div>
  );
};

/** Horizontally swipeable product cards (as sent inside the DM). */
export const ProductCards: React.FC<{swipe: readonly [number, number]; width: number}> = ({swipe, width}) => {
  const f = useCurrentFrame();
  const d = (CARD_W + GAP) * 0.9;
  const x = lerp(f, [swipe[0], swipe[1]], [0, -d], EASE_IN_OUT) + lerp(f, [swipe[1] + 6, swipe[1] + 22], [0, d], EASE_IN_OUT);
  return (
    <div style={{width, height: PRODUCT_CARDS_H, overflow: 'hidden', position: 'relative'}}>
      <div style={{display: 'flex', gap: GAP, transform: `translateX(${x}px)`}}>
        {COPY.products.map((_, i) => (
          <ProductCard key={i} i={i} />
        ))}
      </div>
    </div>
  );
};
