import {Easing, interpolate, spring} from 'remotion';
import {FPS} from '../config';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);

/** Clamped interpolate with an optional easing. */
export const lerp = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing: (t: number) => number = (t) => t,
) => interpolate(frame, input, output, {...CLAMP, easing});

export const SPRINGS = {
  smooth: {damping: 200, stiffness: 120, mass: 1},
  snappy: {damping: 20, stiffness: 190, mass: 0.7},
  pop: {damping: 13, stiffness: 210, mass: 0.6},
  soft: {damping: 30, stiffness: 70, mass: 1},
} as const;

/** Spring from 0 → 1 starting at `delay`. */
export const sp = (
  frame: number,
  delay = 0,
  config: {damping: number; stiffness: number; mass: number} = SPRINGS.smooth,
) => spring({frame: frame - delay, fps: FPS, config});

/** 0 → 1 → 0 envelope: in at `a`, out at `b`. */
export const inOut = (
  frame: number,
  a: number,
  b: number,
  config: {damping: number; stiffness: number; mass: number} = SPRINGS.smooth,
) => Math.max(0, sp(frame, a, config) - sp(frame, b, config));

/** Interpolates a list of keyframes {f, ...values} with ease-in-out between keys. */
export const keyframes = <K extends string>(
  frame: number,
  keys: ({f: number} & Record<K, number>)[],
  props: K[],
): Record<K, number> => {
  const out = {} as Record<K, number>;
  for (const p of props) {
    if (frame <= keys[0].f) {
      out[p] = keys[0][p];
      continue;
    }
    const last = keys[keys.length - 1];
    if (frame >= last.f) {
      out[p] = last[p];
      continue;
    }
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i];
      const b = keys[i + 1];
      if (frame >= a.f && frame <= b.f) {
        out[p] = interpolate(frame, [a.f, b.f], [a[p], b[p]], {...CLAMP, easing: EASE_IN_OUT});
        break;
      }
    }
  }
  return out;
};

/** Formats 18640 → "18 640" (French thin-space grouping). */
export const fmtNum = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
