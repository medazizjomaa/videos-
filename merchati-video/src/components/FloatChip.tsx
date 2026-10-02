import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, COLORS} from '../config';
import {UI_STACK} from '../fonts';
import {SPRINGS, sp} from '../lib/anim';
import {IconBolt} from './Icons';

/** Glassy brand chip that floats next to the phone (video pixels). */
export const FloatChip: React.FC<{text: string; at: number; size: number; out?: number; icon?: React.ReactNode}> = ({
  text,
  at,
  size,
  out,
  icon,
}) => {
  const f = useCurrentFrame();
  const p = sp(f, at, SPRINGS.pop);
  const q = out !== undefined ? sp(f, out, SPRINGS.smooth) : 0;
  const float = Math.sin((f - at) / 18) * size * 0.08;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.4,
        height: size * 2.3,
        padding: `0 ${size * 0.9}px 0 ${size * 0.5}px`,
        borderRadius: size * 2,
        background: `linear-gradient(135deg, ${alpha('#0E1A38', 0.96)} 0%, ${alpha('#0A1228', 0.96)} 100%)`,
        border: `1px solid ${alpha(COLORS.cyan, 0.35)}`,
        boxShadow: `0 20px 60px ${alpha('#000000', 0.5)}, 0 0 50px ${alpha(COLORS.blue, 0.35)}`,
        color: '#fff',
        fontFamily: UI_STACK,
        fontWeight: 700,
        fontSize: size,
        whiteSpace: 'nowrap',
        opacity: Math.min(1, p) * (1 - q),
        transform: `translateY(${(1 - p) * 20 + float}px) scale(${0.8 + 0.2 * p})`,
      }}
    >
      <div
        style={{
          width: size * 1.6,
          height: size * 1.6,
          borderRadius: size,
          background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.cyan})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon ?? <IconBolt size={size * 0.95} color="#fff" />}
      </div>
      {text}
    </div>
  );
};
