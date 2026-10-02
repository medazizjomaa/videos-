import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TRANSITION} from '../config';
import {EASE_IN_OUT, EASE_OUT, lerp} from '../lib/anim';

export type Enter = 'none' | 'fade' | 'iris' | 'wipeUp' | 'wipeLeft' | 'zoom';

/** Masked entrance drawn over the previous scene (which keeps running underneath). */
export const SceneWrap: React.FC<{enter: Enter; children: React.ReactNode; dur?: number}> = ({
  enter,
  children,
  dur = TRANSITION,
}) => {
  const f = useCurrentFrame();
  const p = lerp(f, [0, dur], [0, 1], EASE_IN_OUT);
  const q = lerp(f, [0, dur + 6], [0, 1], EASE_OUT);
  let style: React.CSSProperties = {};
  switch (enter) {
    case 'fade':
      style = {opacity: p};
      break;
    case 'iris':
      style = {clipPath: `circle(${p * 75}% at 50% 50%)`, transform: `scale(${1.06 - 0.06 * q})`};
      break;
    case 'wipeUp':
      style = {clipPath: `inset(${(1 - p) * 100}% 0 0 0)`, transform: `translateY(${(1 - q) * 60}px)`};
      break;
    case 'wipeLeft':
      style = {clipPath: `inset(0 0 0 ${(1 - p) * 100}%)`, transform: `translateX(${(1 - q) * 80}px)`};
      break;
    case 'zoom':
      style = {opacity: p, transform: `scale(${1.12 - 0.12 * q})`};
      break;
    default:
      break;
  }
  return <AbsoluteFill style={{...style, overflow: 'hidden'}}>{children}</AbsoluteFill>;
};
