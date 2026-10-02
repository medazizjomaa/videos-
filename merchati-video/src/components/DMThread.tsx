import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, COLORS, GRADIENTS} from '../config';
import {UI_STACK} from '../fonts';
import {SPRINGS, sp} from '../lib/anim';
import {bubbleHeight, ChatBubble, ThreadTheme} from './ChatBubble';
import {IconCamera, IconChevronLeft, IconImage, IconMic, IconPhone, IconPlus, IconSmile, IconVideo} from './Icons';
import {SCREEN_H, SCREEN_W} from './PhoneFrame';
import {TYPING_H, TypingIndicator} from './TypingIndicator';

export type DMItem = {
  key: string;
  from: 'me' | 'them' | 'center';
  at: number;
  /** Item collapses away at this frame (typing indicators). */
  until?: number;
  /** Logical height in px. */
  h: number;
  /** Width used to anchor `me` items to the right. */
  render: (p: number) => React.ReactNode;
};

export const textItem = (key: string, from: 'me' | 'them', text: string, at: number, theme: ThreadTheme): DMItem => ({
  key,
  from,
  at,
  h: bubbleHeight(text),
  render: () => <ChatBubble from={from} text={text} theme={theme} />,
});

export const typingItem = (key: string, at: number, until: number, theme: ThreadTheme): DMItem => ({
  key,
  from: 'them',
  at,
  until,
  h: TYPING_H,
  render: () => <TypingIndicator theme={theme} />,
});

export const nodeItem = (
  key: string,
  from: 'me' | 'them' | 'center',
  at: number,
  h: number,
  render: (p: number) => React.ReactNode,
): DMItem => ({key, from, at, h, render});

const HEADER_BOTTOM = 112;
const COMPOSER_TOP = SCREEN_H - 88;
const SIDE = 14;
const AVATAR = 28;

export const Avatar: React.FC<{size: number; initials: string; bg: string; dot?: boolean}> = ({
  size,
  initials,
  bg,
  dot,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: bg,
      color: '#fff',
      fontFamily: UI_STACK,
      fontWeight: 700,
      fontSize: size * 0.36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      flexShrink: 0,
      letterSpacing: '0.02em',
    }}
  >
    {initials}
    {dot ? (
      <div
        style={{
          position: 'absolute',
          right: -1,
          bottom: -1,
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: size,
          background: '#31D158',
          border: `${size * 0.07}px solid #000`,
        }}
      />
    ) : null}
  </div>
);

type Props = {
  theme: ThreadTheme;
  name: string;
  sub: string;
  avatar: {initials: string; bg: string};
  items: DMItem[];
  composer: string;
  /** Extra layer inside the screen above the thread (e.g. in-app browser). */
  children?: React.ReactNode;
};

/** A clean Instagram / Messenger thread that auto-scrolls as items arrive. */
export const DMThread: React.FC<Props> = ({theme, name, sub, avatar, items, composer, children}) => {
  const f = useCurrentFrame();
  const accent = theme === 'messenger' ? '#0A7CFF' : '#0F1222';

  // Appearance progress per item (typing indicators collapse back out).
  const prog = items.map((it) => {
    const pin = sp(f, it.at, SPRINGS.snappy);
    const pout = it.until !== undefined ? sp(f, it.until, {damping: 200, stiffness: 260, mass: 0.6}) : 0;
    return Math.max(0, Math.min(1, pin) - pout);
  });

  const gapBefore = (i: number) => {
    if (i === 0) return 0;
    const prev = items[i - 1];
    return prev.from === items[i].from ? 6 : 14;
  };

  let content = 12;
  const tops: number[] = [];
  items.forEach((it, i) => {
    const p = prog[i];
    content += gapBefore(i) * p;
    tops.push(content);
    content += it.h * p;
  });
  const viewport = COMPOSER_TOP - HEADER_BOTTOM;
  const scroll = Math.max(0, content + 14 - viewport);

  // Avatar sits next to the last item of a "them" group.
  const showAvatar = (i: number) => {
    if (items[i].from !== 'them') return false;
    for (let j = i + 1; j < items.length; j++) {
      if (prog[j] > 0.5) return items[j].from !== 'them';
    }
    return true;
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: theme === 'instagram' ? COLORS.igBg : COLORS.msBg,
        fontFamily: UI_STACK,
        color: '#0F1222',
      }}
    >
      {/* Messages */}
      <div style={{position: 'absolute', left: 0, top: HEADER_BOTTOM, width: SCREEN_W, height: viewport, overflow: 'hidden'}}>
        {items.map((it, i) => {
          const p = prog[i];
          if (p <= 0.001) return null;
          const y = tops[i] - scroll;
          if (y > viewport + 20 || y + it.h < -40) return null;
          const me = it.from === 'me';
          const center = it.from === 'center';
          return (
            <div
              key={it.key}
              style={{
                position: 'absolute',
                top: y,
                left: center ? 0 : me ? undefined : SIDE + AVATAR + 8,
                right: center ? 0 : me ? SIDE : undefined,
                display: 'flex',
                justifyContent: center ? 'center' : me ? 'flex-end' : 'flex-start',
                opacity: Math.min(1, p * 1.4),
                transform: `translateY(${(1 - p) * 14}px) scale(${0.94 + 0.06 * p})`,
                transformOrigin: me ? 'bottom right' : 'bottom left',
              }}
            >
              {it.render(p)}
            </div>
          );
        })}
        {items.map((it, i) =>
          showAvatar(i) && prog[i] > 0.01 ? (
            <div
              key={`av-${it.key}`}
              style={{
                position: 'absolute',
                left: SIDE,
                top: tops[i] - scroll + it.h * prog[i] - AVATAR,
                opacity: prog[i],
              }}
            >
              <Avatar size={AVATAR} initials={avatar.initials} bg={avatar.bg} />
            </div>
          ) : null,
        )}
      </div>

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SCREEN_W,
          height: HEADER_BOTTOM,
          background: theme === 'instagram' ? COLORS.igBg : COLORS.msBg,
          borderBottom: `0.5px solid ${alpha('#000000', 0.1)}`,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 16px 12px 8px',
          boxSizing: 'border-box',
          gap: 8,
        }}
      >
        <IconChevronLeft size={30} color={accent} stroke={2.4} />
        <Avatar size={36} initials={avatar.initials} bg={avatar.bg} dot={theme === 'messenger'} />
        <div style={{flex: 1, marginLeft: 4}}>
          <div style={{fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em'}}>{name}</div>
          <div style={{fontSize: 12.5, color: alpha('#000000', 0.5), marginTop: 1}}>{sub}</div>
        </div>
        <div style={{display: 'flex', gap: 22, paddingBottom: 6}}>
          <IconPhone size={24} color={accent} stroke={1.9} />
          <IconVideo size={26} color={accent} stroke={1.9} />
        </div>
      </div>

      {/* Composer */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: COMPOSER_TOP,
          width: SCREEN_W,
          height: SCREEN_H - COMPOSER_TOP,
          padding: '8px 12px 0',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        {theme === 'instagram' ? (
          <div
            style={{
              flex: 1,
              height: 46,
              borderRadius: 23,
              background: '#F2F2F2',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px 0 6px',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                background: GRADIENTS.igOut,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCamera size={19} color="#fff" stroke={2} />
            </div>
            <div style={{flex: 1, color: alpha('#000000', 0.4), fontSize: 16}}>{composer}</div>
            <IconMic size={22} color="#0F1222" stroke={1.8} />
            <IconImage size={22} color="#0F1222" stroke={1.8} />
            <IconSmile size={22} color="#0F1222" stroke={1.8} style={{marginRight: 6}} />
          </div>
        ) : (
          <>
            <div style={{display: 'flex', gap: 14, alignItems: 'center', height: 40}}>
              <IconPlus size={24} color={accent} stroke={2.2} />
              <IconCamera size={24} color={accent} stroke={2} />
              <IconImage size={24} color={accent} stroke={2} />
              <IconMic size={24} color={accent} stroke={2} />
            </div>
            <div
              style={{
                flex: 1,
                height: 40,
                borderRadius: 20,
                background: '#F0F0F0',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                color: alpha('#000000', 0.4),
                fontSize: 16,
              }}
            >
              {composer}
            </div>
            <div style={{height: 40, display: 'flex', alignItems: 'center'}}>
              <IconSmile size={24} color={accent} stroke={2} />
            </div>
          </>
        )}
      </div>
      {children}
    </div>
  );
};
