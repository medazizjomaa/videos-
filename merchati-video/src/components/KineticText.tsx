import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS, GRADIENTS} from '../config';
import {DISPLAY_STACK} from '../fonts';
import {SPRINGS, sp} from '../lib/anim';

type Props = {
  lines: readonly string[];
  /** Frame (relative to the parent sequence) the reveal starts. */
  at: number;
  /** Optional frame the text leaves. */
  out?: number;
  size: number;
  align?: 'left' | 'center';
  width: number;
  color?: string;
  weight?: number;
  stagger?: number;
  lineGap?: number;
  style?: React.CSSProperties;
  /** Freeze the animation at this local frame (used for the "silence" beat). */
  freezeAt?: number;
};

type Word = {text: string; accent: boolean};

const parse = (line: string): Word[] => {
  const words: Word[] = [];
  let accent = false;
  for (const raw of line.split(' ')) {
    if (!raw) continue;
    let t = raw;
    let startsAccent = false;
    let endsAccent = false;
    if (t.startsWith('*')) {
      startsAccent = true;
      t = t.slice(1);
    }
    const m = t.match(/\*([.,!?;:]*)$/);
    if (m) {
      endsAccent = true;
      t = t.slice(0, m.index) + m[1];
    }
    if (startsAccent) accent = true;
    words.push({text: t, accent});
    if (endsAccent) accent = false;
  }
  return words;
};

/** Masked, staggered word reveal. Max ~6 words per line, wraps inside `width`. */
export const KineticText: React.FC<Props> = ({
  lines,
  at,
  out,
  size,
  align = 'left',
  width,
  color = COLORS.text,
  weight = 800,
  stagger = 3,
  lineGap = 0.04,
  style,
  freezeAt,
}) => {
  const raw = useCurrentFrame();
  const frame = freezeAt !== undefined ? Math.min(raw, freezeAt) : raw;
  let idx = 0;
  const total = lines.reduce((n, l) => n + parse(l).length, 0);

  return (
    <div
      style={{
        width,
        fontFamily: DISPLAY_STACK,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: '-0.035em',
        color,
        textAlign: align,
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: align === 'center' ? 'center' : 'flex-start',
            columnGap: '0.24em',
            marginTop: li === 0 ? 0 : `${lineGap}em`,
          }}
        >
          {parse(line).map((w, wi) => {
            const i = idx++;
            const pin = sp(frame, at + i * stagger, SPRINGS.snappy);
            const pout = out !== undefined ? sp(frame, out + (total - 1 - i) * 1.5, SPRINGS.smooth) : 0;
            const y = (1 - pin) * 105 - pout * 105;
            const opacity = Math.min(1, pin * 1.4) * (1 - pout);
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  overflow: 'hidden',
                  paddingBottom: '0.14em',
                  marginBottom: '-0.14em',
                  paddingTop: '0.04em',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${y}%)`,
                    opacity,
                    ...(w.accent
                      ? {
                          backgroundImage: GRADIENTS.accentText,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }
                      : {}),
                  }}
                >
                  {w.text}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
