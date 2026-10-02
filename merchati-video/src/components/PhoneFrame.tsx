import React from 'react';
import {alpha, COLORS} from '../config';
import {UI_STACK} from '../fonts';
import {StatusIcons} from './Icons';

/** Logical screen size (iPhone points). Everything inside the phone is laid out in these units. */
export const SCREEN_W = 390;
export const SCREEN_H = 844;
const BEZEL = 12;
export const PHONE_OUTER_W = SCREEN_W + BEZEL * 2;
export const PHONE_OUTER_H = SCREEN_H + BEZEL * 2;
export const PHONE_RATIO = PHONE_OUTER_H / PHONE_OUTER_W;

type Props = {
  width: number;
  children?: React.ReactNode;
  screenBg?: string;
  time?: string;
  statusDark?: boolean;
  glow?: number;
  style?: React.CSSProperties;
  /** Optional overlay above the screen content (e.g. notification banners). */
  overlay?: React.ReactNode;
};

/** Modern, minimal phone. Children render in a 390×844 coordinate space. */
export const PhoneFrame: React.FC<Props> = ({
  width,
  children,
  screenBg = '#000',
  time = '20:14',
  statusDark = false,
  glow = 1,
  style,
  overlay,
}) => {
  const scale = width / PHONE_OUTER_W;
  const statusColor = statusDark ? '#0B0B0F' : '#FFFFFF';
  return (
    <div style={{width, height: width * PHONE_RATIO, position: 'relative', ...style}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: PHONE_OUTER_W,
          height: PHONE_OUTER_H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          borderRadius: 64,
          background: `linear-gradient(145deg, #3A3F4B 0%, ${COLORS.phoneBody} 30%, #0C0D10 70%, #2C313B 100%)`,
          boxShadow: [
            `inset 0 0 0 1.5px ${alpha('#FFFFFF', 0.16)}`,
            `0 0 0 1px ${alpha('#000000', 0.6)}`,
            `0 40px 90px ${alpha('#0B1B3F', 0.28)}`,
            `0 0 120px ${alpha(COLORS.blue, 0.18 * glow)}`,
          ].join(','),
          fontFamily: UI_STACK,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: BEZEL,
            top: BEZEL,
            width: SCREEN_W,
            height: SCREEN_H,
            borderRadius: 52,
            overflow: 'hidden',
            background: screenBg,
          }}
        >
          {children}
          {overlay}
          {/* Status bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: SCREEN_W,
              height: 54,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 30px 0 44px',
              boxSizing: 'border-box',
              color: statusColor,
              fontWeight: 600,
              fontSize: 17,
              letterSpacing: '-0.01em',
              zIndex: 50,
            }}
          >
            <span>{time}</span>
            <StatusIcons color={statusColor} />
          </div>
          {/* Dynamic island */}
          <div
            style={{
              position: 'absolute',
              left: (SCREEN_W - 122) / 2,
              top: 11,
              width: 122,
              height: 36,
              borderRadius: 20,
              background: COLORS.island,
              zIndex: 60,
            }}
          />
          {/* Home indicator */}
          <div
            style={{
              position: 'absolute',
              left: (SCREEN_W - 136) / 2,
              bottom: 8,
              width: 136,
              height: 5,
              borderRadius: 3,
              background: statusDark ? alpha('#000000', 0.8) : alpha('#FFFFFF', 0.85),
              zIndex: 60,
            }}
          />
          {/* Glass reflection */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(115deg, ${alpha('#FFFFFF', 0.05)} 0%, transparent 28%, transparent 100%)`,
              pointerEvents: 'none',
              zIndex: 70,
            }}
          />
        </div>
      </div>
    </div>
  );
};
