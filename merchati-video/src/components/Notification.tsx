import React from 'react';
import {COLORS, GRADIENTS} from '../config';
import {COPY, NotifApp} from '../copy';
import {UI_STACK} from '../fonts';
import {IconBag, IconCalendar, IconCamera, IconChat, IconSend} from './Icons';

type AppKey = NotifApp | 'tg';

const ICON_BG: Record<AppKey, string> = {
  ig: GRADIENTS.igIcon,
  ms: GRADIENTS.msIcon,
  shop: GRADIENTS.shopIcon,
  resa: GRADIENTS.resaIcon,
  tg: GRADIENTS.tgIcon,
};

export const AppIcon: React.FC<{app: AppKey; size: number}> = ({app, size}) => {
  const g = size * 0.56;
  const glyph = {
    ig: <IconCamera size={g} color="#fff" stroke={2.2} />,
    ms: <IconChat size={g} color="#fff" stroke={2.2} />,
    shop: <IconBag size={g} color="#fff" stroke={2.2} />,
    resa: <IconCalendar size={g} color="#fff" stroke={2.2} />,
    tg: <IconSend size={g} color="#fff" stroke={2.2} style={{marginLeft: -size * 0.04}} />,
  }[app];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: ICON_BG[app],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {glyph}
    </div>
  );
};

export const NOTIF_W = 358;
export const NOTIF_H = 70;

/** iOS-style lock-screen notification (logical phone units). */
export const NotificationCard: React.FC<{
  app: AppKey;
  title: string;
  body: string;
  time?: string;
  width?: number;
  style?: React.CSSProperties;
  bg?: string;
}> = ({app, title, body, time = COPY.now, width = NOTIF_W, style, bg = COLORS.notif}) => (
  <div
    style={{
      width,
      height: NOTIF_H,
      borderRadius: 22,
      background: bg,
      padding: '0 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      boxSizing: 'border-box',
      fontFamily: UI_STACK,
      boxShadow: '0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.07)',
      ...style,
    }}
  >
    <AppIcon app={app} size={38} />
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8}}>
        <span
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: COLORS.notifText,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </span>
        <span style={{fontSize: 13, color: COLORS.notifSub, flexShrink: 0}}>{time}</span>
      </div>
      <div
        style={{
          fontSize: 15,
          color: COLORS.notifText,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: 1,
        }}
      >
        {body}
      </div>
    </div>
  </div>
);
