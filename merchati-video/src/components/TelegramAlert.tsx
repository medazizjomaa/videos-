import React from 'react';
import {alpha, COLORS} from '../config';
import {COPY} from '../copy';
import {UI_STACK} from '../fonts';
import {IconCheckDouble} from './Icons';
import {AppIcon} from './Notification';

type AlertData = {title: string; lines: readonly string[]; time: string};

/** Telegram bot message from MERCHATI Alerts: who, what, order number. */
export const TelegramAlert: React.FC<{
  data: AlertData;
  width: number;
  /** Floating card variant with an app header (used over dashboards). */
  floating?: boolean;
  glow?: number;
}> = ({data, width, floating, glow = 0}) => (
  <div
    style={{
      width,
      borderRadius: floating ? 24 : 18,
      background: COLORS.tgBubble,
      padding: floating ? '16px 18px 14px' : '10px 14px 8px',
      boxSizing: 'border-box',
      fontFamily: UI_STACK,
      color: '#0F1222',
      boxShadow: [
        floating ? `0 30px 80px ${alpha('#0B1B3F', 0.22)}` : '0 2px 6px rgba(0,0,0,0.08)',
        floating ? `inset 0 0 0 1px ${alpha('#0B1B3F', 0.08)}` : '',
        glow > 0 ? `0 0 ${60 * glow}px ${alpha(COLORS.tgAccent, 0.45 * glow)}` : '',
      ]
        .filter(Boolean)
        .join(',') || undefined,
    }}
  >
    {floating ? (
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
        <AppIcon app="tg" size={30} />
        <span style={{fontSize: 14, fontWeight: 600, color: alpha('#000000', 0.6)}}>Telegram</span>
        <span style={{fontSize: 14, color: alpha('#000000', 0.4), marginLeft: 'auto'}}>{COPY.now}</span>
      </div>
    ) : null}
    <div style={{fontSize: 14, fontWeight: 700, color: COLORS.tgAccent}}>{COPY.telegram.chatName}</div>
    <div style={{fontSize: 16, fontWeight: 700, marginTop: 4, lineHeight: '22px'}}>{data.title}</div>
    <div style={{marginTop: 4}}>
      {data.lines.map((l) => (
        <div key={l} style={{fontSize: 15, lineHeight: '23px', color: '#0F1222', whiteSpace: 'nowrap'}}>
          {l}
        </div>
      ))}
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 4,
        fontSize: 12,
        color: alpha('#000000', 0.45),
        marginTop: 2,
      }}
    >
      {data.time}
      <IconCheckDouble size={15} color={COLORS.tgAccent} stroke={2} />
    </div>
  </div>
);
