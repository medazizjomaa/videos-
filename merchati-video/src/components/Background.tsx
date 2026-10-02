import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, COLORS} from '../config';

type Variant = 'chaos' | 'brand' | 'calm' | 'alarm';

/** Dark stage with slow-drifting glows, a faint grid and a vignette. */
export const Background: React.FC<{variant?: Variant; intensity?: number; grid?: boolean}> = ({
  variant = 'brand',
  intensity = 1,
  grid = true,
}) => {
  const f = useCurrentFrame();
  const dx = Math.sin(f / 70) * 6;
  const dy = Math.cos(f / 90) * 5;

  const glows: Record<Variant, string[]> = {
    brand: [
      `radial-gradient(60% 42% at ${30 + dx}% ${18 + dy}%, ${alpha(COLORS.blue, 0.32 * intensity)} 0%, transparent 70%)`,
      `radial-gradient(50% 36% at ${78 - dx}% ${82 - dy}%, ${alpha(COLORS.cyan, 0.13 * intensity)} 0%, transparent 70%)`,
    ],
    calm: [
      `radial-gradient(70% 45% at 50% ${26 + dy}%, ${alpha(COLORS.blue, 0.3 * intensity)} 0%, transparent 72%)`,
      `radial-gradient(60% 40% at 50% 100%, ${alpha(COLORS.cyan, 0.14 * intensity)} 0%, transparent 70%)`,
    ],
    chaos: [
      `radial-gradient(55% 40% at ${50 + dx}% ${46 + dy}%, ${alpha('#3B4CFF', 0.2 * intensity)} 0%, transparent 70%)`,
      `radial-gradient(45% 30% at ${18 - dx}% 12%, ${alpha(COLORS.red, 0.08 * intensity)} 0%, transparent 70%)`,
    ],
    alarm: [
      `radial-gradient(60% 40% at 50% ${50 + dy}%, ${alpha(COLORS.red, 0.16 * intensity)} 0%, transparent 70%)`,
      `radial-gradient(50% 35% at ${80 + dx}% 10%, ${alpha('#3B4CFF', 0.12 * intensity)} 0%, transparent 70%)`,
    ],
  };

  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      <AbsoluteFill style={{background: glows[variant].join(',')}} />
      {grid ? (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${alpha('#FFFFFF', 0.035)} 1px, transparent 1px), linear-gradient(90deg, ${alpha('#FFFFFF', 0.035)} 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
            backgroundPosition: `${-f * 0.15}px ${-f * 0.3}px`,
            maskImage: 'radial-gradient(70% 55% at 50% 45%, black 0%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(70% 55% at 50% 45%, black 0%, transparent 100%)',
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{background: `radial-gradient(120% 90% at 50% 50%, transparent 55%, ${alpha(COLORS.bgDeep, 0.85)} 100%)`}}
      />
    </AbsoluteFill>
  );
};
