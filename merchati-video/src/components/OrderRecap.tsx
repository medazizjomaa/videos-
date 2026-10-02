import React from 'react';
import {alpha, COLORS, GRADIENTS} from '../config';
import {COPY} from '../copy';
import {UI_STACK} from '../fonts';
import {Dress} from './ProductCards';

export const ORDER_RECAP_H = 262;

const Row: React.FC<{l: string; r: string; strong?: boolean}> = ({l, r, strong}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: strong ? 16 : 14,
      fontWeight: strong ? 700 : 500,
      color: strong ? '#fff' : alpha('#FFFFFF', 0.7),
      lineHeight: '24px',
    }}
  >
    <span>{l}</span>
    <span style={{color: strong ? '#fff' : alpha('#FFFFFF', 0.9)}}>{r}</span>
  </div>
);

/** Order recap card sent by the AI before saving: product, size, colour, delivery, total. */
export const OrderRecap: React.FC<{width?: number}> = ({width = 268}) => {
  const c = COPY.recap;
  return (
    <div
      style={{
        width,
        height: ORDER_RECAP_H,
        borderRadius: 20,
        background: '#1C1C1E',
        border: `1px solid ${alpha('#FFFFFF', 0.09)}`,
        padding: 14,
        boxSizing: 'border-box',
        fontFamily: UI_STACK,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 3, background: GRADIENTS.brand}} />
      <div style={{fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: alpha('#FFFFFF', 0.5)}}>
        {c.title}
      </div>
      <div style={{display: 'flex', gap: 10, alignItems: 'center', marginTop: 10}}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: COLORS.productBg1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <Dress color={COLORS.dressBlack} size={36} />
        </div>
        <div>
          <div style={{fontSize: 15, fontWeight: 600}}>{c.product}</div>
          <div style={{fontSize: 13, color: alpha('#FFFFFF', 0.6), marginTop: 1}}>{c.variant}</div>
        </div>
      </div>
      <div style={{height: 1, background: alpha('#FFFFFF', 0.1), margin: '12px 0 6px'}} />
      <Row l={c.subtotal} r={c.subtotalValue} />
      <Row l={c.delivery} r={c.deliveryValue} />
      <Row l={c.total} r={c.totalValue} strong />
      <div style={{fontSize: 12, color: alpha('#FFFFFF', 0.45), marginTop: 2}}>{c.payment}</div>
      <div style={{fontSize: 16.5, fontWeight: 700, marginTop: 9}}>{c.question}</div>
    </div>
  );
};
