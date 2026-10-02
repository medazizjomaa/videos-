import React from 'react';

type P = {size?: number; color?: string; stroke?: number; style?: React.CSSProperties};

const Svg: React.FC<P & {children: React.ReactNode; fill?: boolean}> = ({
  size = 24,
  color = 'currentColor',
  stroke = 2,
  style,
  children,
  fill,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? color : 'none'}
    stroke={fill ? 'none' : color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{display: 'block', flexShrink: 0, ...style}}
  >
    {children}
  </svg>
);

export const IconChevronLeft: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);
export const IconChevronRight: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M9 18l6-6-6-6" />
  </Svg>
);
export const IconPhone: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </Svg>
);
export const IconVideo: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="2" y="6" width="14" height="12" rx="3" />
    <path d="M16 10.5l6-3.5v10l-6-3.5" />
  </Svg>
);
export const IconCamera: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </Svg>
);
export const IconMic: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0M12 17v5" />
  </Svg>
);
export const IconImage: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 15l-5-5L5 21" />
  </Svg>
);
export const IconSmile: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01" />
  </Svg>
);
export const IconPlus: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const IconCheck: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);
export const IconCheckDouble: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M2 12.5l4.5 4.5L15 8.5M10.5 15.5l1.5 1.5L22 7" />
  </Svg>
);
export const IconX: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);
export const IconBag: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 12a1.5 1.5 0 0 1-1.5 1.4h-9A1.5 1.5 0 0 1 6 20z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </Svg>
);
export const IconCalendar: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="17" rx="3" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
  </Svg>
);
export const IconChat: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20.5l1.4-4.3A8.2 8.2 0 0 1 3 11.5 8.6 8.6 0 0 1 12 3a8.6 8.6 0 0 1 9 8.5z" />
  </Svg>
);
export const IconSend: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
  </Svg>
);
export const IconLock: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);
export const IconTruck: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M1 4h14v12H1zM15 9h4l3 3v4h-7z" />
    <circle cx="5.5" cy="18.5" r="2" />
    <circle cx="18.5" cy="18.5" r="2" />
  </Svg>
);
export const IconClock: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
export const IconSparkle: React.FC<P> = (p) => (
  <Svg {...p} fill>
    <path d="M12 1.5l2.2 6.6a2 2 0 0 0 1.3 1.3L22 11.5l-6.5 2.1a2 2 0 0 0-1.3 1.3L12 21.5l-2.2-6.6a2 2 0 0 0-1.3-1.3L2 11.5l6.5-2.1a2 2 0 0 0 1.3-1.3z" />
  </Svg>
);
export const IconBolt: React.FC<P> = (p) => (
  <Svg {...p} fill>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </Svg>
);
export const IconUser: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Svg>
);
export const IconUsers: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
  </Svg>
);
export const IconGrid: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </Svg>
);
export const IconPlug: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5" />
  </Svg>
);
export const IconBox: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M21 8l-9-5-9 5v8l9 5 9-5z" />
    <path d="M3 8l9 5 9-5M12 13v8" />
  </Svg>
);
export const IconStory: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.5" strokeDasharray="4 2.6" />
    <circle cx="12" cy="12" r="4.5" />
  </Svg>
);
export const IconSliders: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </Svg>
);
export const IconAlert: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3l10 18H2z" />
    <path d="M12 10v4M12 17.5h.01" />
  </Svg>
);
export const IconCard: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M2 10h20M6 15h4" />
  </Svg>
);
export const IconGear: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Svg>
);
export const IconMoon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Svg>
);
export const IconMenu: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 3v8a3 3 0 0 0 6 0V3M7 3v18M17 3c-2 2-3 5-3 8h3v10" />
  </Svg>
);
export const IconTable: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="3" r="1.5" />
    <circle cx="12" cy="21" r="1.5" />
    <circle cx="3" cy="12" r="1.5" />
    <circle cx="21" cy="12" r="1.5" />
  </Svg>
);
export const IconBrush: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M18.4 2.6a2 2 0 0 1 2.9 2.9L11 15.8 8.2 13z" />
    <path d="M7 14.5c-2 0-3.5 1.5-3.5 3.5 0 1.3-.7 2-1.5 2.5 3.5 1 7.5-.5 7.5-3.5z" />
  </Svg>
);
export const IconPlay: React.FC<P> = (p) => (
  <Svg {...p} fill>
    <path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z" />
  </Svg>
);
export const IconPause: React.FC<P> = (p) => (
  <Svg {...p} fill>
    <rect x="6" y="4" width="4" height="16" rx="1.2" />
    <rect x="14" y="4" width="4" height="16" rx="1.2" />
  </Svg>
);
export const IconLink: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  </Svg>
);
export const IconRefresh: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8" />
    <path d="M21 3v5h-5M3 21v-5h5" />
  </Svg>
);
export const IconHand: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8" />
    <path d="M18 8a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15" />
  </Svg>
);
export const IconWave: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M3 10v4M7 7v10M11 4v16M15 8v8M19 10v4" />
  </Svg>
);
export const IconLanguage: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 5h9M8.5 3v2M6 5c.5 3 2.5 5.5 5 7M11 5c-.5 3.5-3 6.5-7 8" />
    <path d="M13 21l4-10 4 10M14.5 17.5h5" />
  </Svg>
);
export const IconSearch: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Svg>
);
export const IconBell: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
  </Svg>
);
export const IconTrend: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
  </Svg>
);

/** Status-bar glyphs */
export const StatusIcons: React.FC<{color?: string}> = ({color = '#fff'}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
    <svg width="18" height="12" viewBox="0 0 18 12">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 4.7} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill={color} />
      ))}
    </svg>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M1.5 4.2a9.5 9.5 0 0 1 13 0M4 7a6 6 0 0 1 8 0" />
      <circle cx="8" cy="10" r="1.2" fill={color} stroke="none" />
    </svg>
    <svg width="27" height="13" viewBox="0 0 27 13">
      <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke={color} strokeOpacity="0.45" />
      <rect x="2.5" y="2.5" width="17" height="8" rx="2.2" fill={color} />
      <rect x="24.8" y="4.2" width="1.6" height="4.6" rx="0.8" fill={color} fillOpacity="0.45" />
    </svg>
  </div>
);
