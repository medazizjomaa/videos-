import React from 'react';
import {alpha, COLORS} from '../config';
import {UI_STACK} from '../fonts';
import {
  IconAlert,
  IconBox,
  IconBrush,
  IconCalendar,
  IconCard,
  IconChat,
  IconGear,
  IconGrid,
  IconMenu,
  IconPlug,
  IconSliders,
  IconStory,
  IconTable,
  IconTruck,
} from './Icons';
import {Logo} from './Logo';

export const DASH_W = 1440;
export const DASH_H = 900;
export const SIDEBAR_W = 268;
export const CONTENT_X = 304;
export const CONTENT_W = DASH_W - CONTENT_X - 40;

export type NavGroup = {group: string; items: readonly string[]};

const ICONS: Record<string, React.FC<{size?: number; color?: string; stroke?: number}>> = {
  Dashboard: IconGrid,
  'Chat Monitor': IconChat,
  Connections: IconPlug,
  Products: IconBox,
  StoryReply: IconStory,
  'AI Settings': IconSliders,
  'Delivered Products': IconTruck,
  'Order Issues': IconAlert,
  'Subscription & Plan': IconCard,
  Settings: IconGear,
  Tonight: IconGrid,
  Menu: IconMenu,
  Tables: IconTable,
  Reservations: IconCalendar,
  'Branding & Operations': IconBrush,
};

export const ACCENTS = {
  blue: {main: '#1A73E8', soft: '#E3EEFD', text: '#1565D8'},
  orange: {main: '#F26B1D', soft: '#FDE9DC', text: '#E8590C'},
};

/** Light MERCHATI dashboard frame: grouped sidebar, AI status card, content slot. */
export const DashShell: React.FC<{
  groups: readonly NavGroup[];
  active: string;
  accent: keyof typeof ACCENTS;
  children: React.ReactNode;
}> = ({groups, active, accent, children}) => {
  const a = ACCENTS[accent];
  let y = 92;
  const rows: React.ReactNode[] = [];
  groups.forEach((g) => {
    rows.push(
      <div key={g.group} style={{position: 'absolute', left: 30, top: y, fontSize: 11.5, fontWeight: 800, letterSpacing: '0.08em', color: '#8A97AE'}}>
        {g.group}
      </div>,
    );
    y += 26;
    g.items.forEach((item) => {
      const on = item === active;
      const Icon = ICONS[item] ?? IconGrid;
      rows.push(
        <div
          key={item}
          style={{
            position: 'absolute',
            left: 16,
            top: y,
            width: SIDEBAR_W - 32,
            height: 42,
            borderRadius: 14,
            background: on ? a.soft : 'transparent',
            color: on ? a.text : '#2A3550',
            display: 'flex',
            alignItems: 'center',
            gap: 13,
            padding: '0 14px',
            boxSizing: 'border-box',
            fontSize: 15.5,
            fontWeight: on ? 700 : 500,
          }}
        >
          <Icon size={19} color={on ? a.text : '#7B879C'} stroke={1.9} />
          {item}
          {on ? <div style={{marginLeft: 'auto', width: 7, height: 7, borderRadius: 7, background: a.main}} /> : null}
        </div>,
      );
      y += 46;
    });
    y += 14;
  });
  return (
    <div
      style={{
        width: DASH_W,
        height: DASH_H,
        background: `radial-gradient(60% 50% at 100% 0%, ${alpha('#D8ECFF', 0.9)} 0%, transparent 70%), linear-gradient(180deg, #F7FAFD 0%, #F1F5FA 100%)`,
        position: 'relative',
        fontFamily: UI_STACK,
        color: COLORS.dText,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${alpha('#9FB0C8', 0.22)} 1px, transparent 1px)`,
          backgroundSize: '22px 22px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SIDEBAR_W,
          height: DASH_H,
          background: alpha('#F4F8FC', 0.92),
          borderRight: `1px solid ${COLORS.dBorder}`,
        }}
      >
        <div style={{position: 'absolute', left: 26, top: 26}}>
          <Logo width={150} plate={false} />
        </div>
        {rows}
        <div
          style={{
            position: 'absolute',
            left: 16,
            bottom: 18,
            width: SIDEBAR_W - 32,
            borderRadius: 18,
            border: `1px solid ${COLORS.dBorder}`,
            background: `linear-gradient(135deg, #FFFFFF 0%, #EEF6FF 100%)`,
            padding: '14px 16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 800, color: '#1565D8'}}>
            <div style={{width: 9, height: 9, borderRadius: 9, background: '#22C55E'}} />
            AI Status: Enabled
          </div>
          <div style={{fontSize: 12.5, color: '#5B6782', marginTop: 6, lineHeight: '18px'}}>AI Autopilot is active and replying on Instagram & Messenger.</div>
        </div>
      </div>
      {children}
    </div>
  );
};

export const Card: React.FC<{x: number; y: number; w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  x,
  y,
  w,
  h,
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      background: COLORS.dCard,
      borderRadius: 24,
      border: `1px solid ${COLORS.dBorder}`,
      boxShadow: '0 1px 2px rgba(11,27,63,0.04), 0 12px 32px rgba(11,27,63,0.06)',
      boxSizing: 'border-box',
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{tone: 'green' | 'amber' | 'red' | 'blue' | 'grey'; children: React.ReactNode; style?: React.CSSProperties}> = ({
  tone,
  children,
  style,
}) => {
  const t = {
    green: [COLORS.dGreen, COLORS.dGreenBg],
    amber: [COLORS.dAmber, COLORS.dAmberBg],
    red: [COLORS.dRed, COLORS.dRedBg],
    blue: [COLORS.blue, COLORS.dBlueBg],
    grey: [COLORS.dMuted, '#EEF1F6'],
  }[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12.5,
        fontWeight: 700,
        color: t[0],
        background: t[1],
        borderRadius: 20,
        padding: '5px 11px',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{width: 6, height: 6, borderRadius: 6, background: t[0]}} />
      {children}
    </span>
  );
};

/** Wraps dashboard content in a camera: focus point (dashboard coords) + zoom. */
export const DashCamera: React.FC<{
  cx: number;
  cy: number;
  base: number;
  x: number;
  y: number;
  s: number;
  tilt?: number;
  opacity?: number;
  children: React.ReactNode;
}> = ({cx, cy, base, x, y, s, tilt = 0, opacity = 1, children}) => {
  const k = base * s;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', perspective: 2400, opacity}}>
      <div
        style={{
          position: 'absolute',
          left: cx - x,
          top: cy - y,
          width: DASH_W,
          height: DASH_H,
          transform: `scale(${k}) rotateX(${tilt}deg)`,
          transformOrigin: `${x}px ${y}px`,
          borderRadius: 26,
          overflow: 'hidden',
          boxShadow: `0 0 0 1px ${alpha('#0B1B3F', 0.08)}, 0 50px 120px ${alpha('#0B1B3F', 0.22)}, 0 0 140px ${alpha(COLORS.blue, 0.14)}`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
