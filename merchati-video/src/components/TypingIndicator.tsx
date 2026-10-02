import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../config';
import {ThreadTheme} from './ChatBubble';

export const TYPING_H = 38;

/** Three bouncing dots inside an incoming bubble. */
export const TypingIndicator: React.FC<{theme: ThreadTheme; scale?: number; color?: string}> = ({
  theme,
  scale = 1,
  color,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        width: 64 * scale,
        height: TYPING_H * scale,
        borderRadius: 19 * scale,
        background: color ?? (theme === 'instagram' ? COLORS.igIn : COLORS.msIn),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5 * scale,
      }}
    >
      {[0, 1, 2].map((i) => {
        const ph = Math.sin((f - i * 4) / 3.2);
        return (
          <div
            key={i}
            style={{
              width: 7.5 * scale,
              height: 7.5 * scale,
              borderRadius: 8,
              background: '#fff',
              opacity: 0.45 + 0.4 * Math.max(0, ph),
              transform: `translateY(${-Math.max(0, ph) * 3 * scale}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
