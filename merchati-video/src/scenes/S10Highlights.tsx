import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {IconHand, IconLanguage, IconMic, IconRefresh} from '../components/Icons';
import {DISPLAY_STACK} from '../fonts';
import {SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.highlights;
const ICONS = [IconLanguage, IconMic, IconRefresh, IconHand];

export const S10Highlights: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const size = L.square ? 40 : 46;
  const h = size * 2.2;
  const gap = size * 0.5;
  const total = COPY.highlights.length * h + (COPY.highlights.length - 1) * gap;
  const top = (L.H - total) / 2 + (L.square ? 0 : -40);
  return (
    <AbsoluteFill>
      <Background variant="brand" intensity={1.2} />
      {COPY.highlights.map((label, i) => {
        const p = sp(f, B.start + i * B.stagger, SPRINGS.snappy);
        const q = sp(f, B.out + i * 2, SPRINGS.smooth);
        const Icon = ICONS[i];
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: 0,
              width: L.W,
              top: top + i * (h + gap),
              display: 'flex',
              justifyContent: 'center',
              opacity: Math.min(1, p * 1.4) * (1 - q),
              transform: `translateY(${(1 - p) * 70 - q * 50}px) scale(${0.9 + 0.1 * p})`,
            }}
          >
            <div
              style={{
                height: h,
                display: 'flex',
                alignItems: 'center',
                gap: size * 0.45,
                padding: `0 ${size * 0.85}px 0 ${size * 0.32}px`,
                borderRadius: h,
                background: `linear-gradient(180deg, ${alpha('#13203F', 0.95)} 0%, ${alpha('#0B1428', 0.95)} 100%)`,
                border: `1px solid ${alpha(COLORS.blueSoft, 0.32)}`,
                boxShadow: `0 24px 60px ${alpha('#000000', 0.45)}, 0 0 60px ${alpha(COLORS.blue, 0.22)}`,
                fontFamily: DISPLAY_STACK,
                fontWeight: 700,
                fontSize: size,
                letterSpacing: '-0.025em',
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              <div
                style={{
                  width: h - size * 0.64,
                  height: h - size * 0.64,
                  borderRadius: h,
                  background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.cyan} 120%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={size * 0.8} color="#fff" stroke={2.2} />
              </div>
              {label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
