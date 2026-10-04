import React from 'react';

/** Simplified marks for the integration chips (not the official artwork). */
type P = {size: number};

const Tile: React.FC<{size: number; bg: string; children: React.ReactNode; radius?: number}> = ({size, bg, children, radius = 0.28}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * radius,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

export const ConvertyIcon: React.FC<P> = ({size}) => (
  <Tile size={size} bg="linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)">
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
      <path d="M17.5 7.2A7 7 0 1 0 17.5 16.8" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" />
      <circle cx={17.6} cy={12} r={1.9} fill="#FDE68A" />
    </svg>
  </Tile>
);

export const ShopifyIcon: React.FC<P> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', flexShrink: 0}}>
    <path d="M8 6.2C8.3 3.6 9.8 2 11.6 2c1.9 0 3.2 1.6 3.5 4.2" fill="none" stroke="#5E8E3E" strokeWidth={1.6} />
    <path d="M4.2 6.6 15.6 5.4l1.6 16.4-13.6-1.6z" fill="#95BF47" />
    <path d="M15.6 5.4 19.6 6.4l1.2 15.2-3.6.2z" fill="#5E8E3E" />
    <path
      d="M12.4 10.2c-.5-.3-1.2-.5-1.9-.4-1.4.1-2.2 1-2.1 2 .2 1.8 3 1.6 3.1 3.1.1.8-.6 1.4-1.6 1.5-.8 0-1.6-.3-2-.7"
      fill="none"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

/** The MERCHATI Pixel: blue tile with the bot face. */
export const PixelIcon: React.FC<P> = ({size}) => (
  <Tile size={size} bg="linear-gradient(135deg, #2E9BFF 0%, #097CF1 100%)">
    <div
      style={{
        width: size * 0.66,
        height: size * 0.42,
        borderRadius: size * 0.16,
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size * 0.13,
      }}
    >
      {[0, 1].map((i) => (
        <div key={i} style={{width: size * 0.08, height: size * 0.17, borderRadius: size, background: '#011A4D'}} />
      ))}
    </div>
  </Tile>
);

export const InstagramIcon: React.FC<P> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display: 'block', flexShrink: 0}}>
    <defs>
      <linearGradient id="ig-outline" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#FEDA75" />
        <stop offset="0.35" stopColor="#FA7E1E" />
        <stop offset="0.65" stopColor="#D62976" />
        <stop offset="1" stopColor="#962FBF" />
      </linearGradient>
    </defs>
    <rect x={3} y={3} width={18} height={18} rx={5.2} stroke="url(#ig-outline)" strokeWidth={2.2} />
    <circle cx={12} cy={12} r={4.1} stroke="url(#ig-outline)" strokeWidth={2.2} />
    <circle cx={17.1} cy={6.9} r={1.25} fill="#D62976" />
  </svg>
);

export const MessengerIcon: React.FC<P> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', flexShrink: 0}}>
    <defs>
      <linearGradient id="ms-fill" x1="0.2" y1="1" x2="0.8" y2="0">
        <stop offset="0" stopColor="#0A7CFF" />
        <stop offset="0.6" stopColor="#A033FF" />
        <stop offset="1" stopColor="#FF5C87" />
      </linearGradient>
    </defs>
    <path d="M12 2.2C6.4 2.2 2.2 6.3 2.2 11.6c0 2.8 1.2 5.2 3.1 6.9v3.3l3-1.7c1.1.3 2.3.5 3.7.5 5.6 0 9.8-4.1 9.8-9.4S17.6 2.2 12 2.2z" fill="url(#ms-fill)" />
    <path d="M6.4 14.4 9.6 9.3l2.8 2.2 3.6-2.2-3.2 5.1-2.8-2.2z" fill="#fff" />
  </svg>
);

export const TelegramIcon: React.FC<P> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', flexShrink: 0}}>
    <path d="M2.6 11.2 20.4 4.3c.8-.3 1.6.3 1.4 1.3l-3 14.2c-.2 1-.9 1.2-1.7.8l-4.6-3.4-2.2 2.1c-.3.3-.5.4-.9.4l.3-4.7 8.5-7.7c.4-.3-.1-.5-.6-.2L7.1 13.7l-4.5-1.4c-1-.3-1-1 0-1.1z" fill="#2AABEE" />
  </svg>
);
