import React from 'react';
import {COLORS, GRADIENTS} from '../config';
import {UI_STACK} from '../fonts';

export type ThreadTheme = 'instagram' | 'messenger';

export const BUBBLE_FONT = 16;
export const BUBBLE_LH = 21;
export const BUBBLE_PAD_Y = 9;

/** Height (logical px) of a text bubble; lines are explicit (`\n`). */
export const bubbleHeight = (text: string) => text.split('\n').length * BUBBLE_LH + BUBBLE_PAD_Y * 2;

export const ChatBubble: React.FC<{
  from: 'me' | 'them';
  text: string;
  theme: ThreadTheme;
  style?: React.CSSProperties;
}> = ({from, text, theme, style}) => {
  const me = from === 'me';
  const bg = me
    ? theme === 'instagram'
      ? GRADIENTS.igOut
      : GRADIENTS.msOut
    : theme === 'instagram'
      ? COLORS.igIn
      : COLORS.msIn;
  return (
    <div
      style={{
        display: 'inline-block',
        background: bg,
        color: me ? '#fff' : '#0F1222',
        fontFamily: UI_STACK,
        fontSize: BUBBLE_FONT,
        lineHeight: `${BUBBLE_LH}px`,
        padding: `${BUBBLE_PAD_Y}px 14px`,
        borderRadius: 21,
        whiteSpace: 'pre',
        letterSpacing: '-0.005em',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
