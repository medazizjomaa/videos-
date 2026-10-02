import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha} from '../config';
import {keyframes, lerp, SPRINGS, sp} from '../lib/anim';

/** Finger tap: a pressed dot with an expanding ring. Coordinates in the parent's space. */
export const Tap: React.FC<{x: number; y: number; at: number; size?: number; color?: string}> = ({
  x,
  y,
  at,
  size = 44,
  color = '#FFFFFF',
}) => {
  const f = useCurrentFrame();
  if (f < at - 8 || f > at + 24) return null;
  const pre = lerp(f, [at - 8, at], [0, 1]);
  const ring = lerp(f, [at, at + 18], [0, 1]);
  const dotOpacity = f < at ? pre * 0.85 : lerp(f, [at + 4, at + 14], [0.85, 0]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, pointerEvents: 'none', zIndex: 200}}>
      <div
        style={{
          position: 'absolute',
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: size,
          background: alpha(color, 0.55),
          boxShadow: `0 0 0 2px ${alpha(color, 0.8)}`,
          opacity: dotOpacity,
          transform: `scale(${f < at ? 1.2 - 0.2 * pre : 0.85})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -size,
          top: -size,
          width: size * 2,
          height: size * 2,
          borderRadius: size * 2,
          border: `2px solid ${alpha(color, 0.9)}`,
          opacity: f >= at ? (1 - ring) * 0.9 : 0,
          transform: `scale(${0.4 + ring * 0.8})`,
        }}
      />
    </div>
  );
};

/** Desktop pointer that follows keyframes and clicks. */
export const Cursor: React.FC<{
  path: {f: number; x: number; y: number}[];
  clicks: number[];
  size?: number;
  appear?: number;
}> = ({path, clicks, size = 34, appear = 0}) => {
  const f = useCurrentFrame();
  const {x, y} = keyframes(f, path, ['x', 'y']);
  const o = sp(f, appear, SPRINGS.smooth);
  let press = 0;
  for (const c of clicks) {
    if (f >= c - 3 && f <= c + 6) press = Math.max(press, 1 - Math.abs(f - c) / 6);
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 300, opacity: o, pointerEvents: 'none'}}>
      {clicks.map((c) => {
        const r = lerp(f, [c, c + 16], [0, 1]);
        if (f < c || f > c + 16) return null;
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: -size * 0.9,
              top: -size * 0.9,
              width: size * 1.8,
              height: size * 1.8,
              borderRadius: size * 2,
              border: `3px solid ${alpha('#097CF1', 0.9)}`,
              transform: `scale(${0.3 + r})`,
              opacity: 1 - r,
            }}
          />
        );
      })}
      <svg
        width={size}
        height={size * 1.25}
        viewBox="0 0 20 25"
        style={{transform: `scale(${1 - press * 0.14})`, transformOrigin: '2px 2px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))'}}
      >
        <path d="M2 1.5 L2 20 L7 15.5 L10.5 23 L14 21.5 L10.6 14.2 L17.2 14.2 Z" fill="#0B1B3F" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
