import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS, GRADIENTS} from '../config';
import {COPY, NotifApp} from '../copy';
import {Background} from '../components/Background';
import {IconCheck} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {Logo} from '../components/Logo';
import {LockScreen, UnreadBadge} from '../components/NotificationFlood';
import {NotificationCard, NOTIF_H, NOTIF_W} from '../components/Notification';
import {PhoneFrame, SCREEN_W} from '../components/PhoneFrame';
import {DISPLAY_STACK, UI_STACK} from '../fonts';
import {EASE_IN_OUT, EASE_OUT, lerp, SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.cta;
const C = COPY.cta;
const APPS: NotifApp[] = ['ig', 'shop', 'resa'];

const CalmCards: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {C.summary.map((s, i) => {
        const p = sp(f, 6 + i * 6, SPRINGS.soft);
        return (
          <div
            key={s.title}
            style={{
              position: 'absolute',
              left: (SCREEN_W - NOTIF_W) / 2,
              top: 270 + i * (NOTIF_H + 10),
              opacity: p,
              transform: `translateY(${(1 - p) * 20}px)`,
            }}
          >
            <NotificationCard app={APPS[i]} title={s.title} body={s.sub} time="✓" />
          </div>
        );
      })}
    </>
  );
};

export const S11CTA: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();

  const count = Math.round(lerp(f, [B.badgeCount[0], B.badgeCount[1]], [99, 0], EASE_OUT));
  const zero = sp(f, B.badgeCount[1], SPRINGS.pop);
  const move = lerp(f, [B.phoneMove[0], B.phoneMove[1]], [0, 1], EASE_IN_OUT);

  const phoneW = L.square ? L.phoneW * (1 - 0.06 * move) : L.phoneW;
  const phoneX = L.phoneCx - phoneW / 2 + (L.square ? -14 * move : 0);
  const phoneY = L.square ? L.phoneTop + 40 * move : L.phoneTop + 430 * move;

  const logoW = L.square ? 400 : 540;
  const logoIn = sp(f, B.logo, SPRINGS.snappy);
  const pill = sp(f, B.pill, SPRINGS.pop);
  const url = sp(f, B.url, SPRINGS.snappy);

  const colX = L.square ? L.text.x : 0;
  const colW = L.square ? L.text.w : L.W;
  const align = L.square ? 'flex-start' : 'center';
  const top = L.square ? 120 : 150;

  return (
    <AbsoluteFill>
      <Background variant="calm" intensity={1.1} />
      <div style={{position: 'absolute', left: phoneX, top: phoneY}}>
        <PhoneFrame width={phoneW} time={C.lockTime} glow={1.2} statusDark>
          <LockScreen time={C.lockTime} date={C.lockDate} calm={<CalmCards />} />
        </PhoneFrame>
        <div style={{position: 'absolute', right: -phoneW * 0.06, top: -phoneW * 0.05}}>
          {zero < 0.5 ? (
            <UnreadBadge value={count} size={L.square ? 60 : 80} />
          ) : (
            <div
              style={{
                width: L.square ? 60 : 80,
                height: L.square ? 60 : 80,
                borderRadius: 80,
                background: `linear-gradient(180deg, ${COLORS.greenSoft}, ${COLORS.green})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${zero})`,
                boxShadow: `0 0 0 ${(L.square ? 60 : 80) * 0.08}px ${COLORS.bg}, 0 10px 40px ${alpha(COLORS.green, 0.5)}`,
              }}
            >
              <IconCheck size={L.square ? 32 : 42} color="#fff" stroke={3.4} />
            </div>
          )}
        </div>
      </div>
      {/* Soft fade so the phone sinks into the background under the CTA */}
      {!L.square ? (
        <AbsoluteFill style={{background: `linear-gradient(180deg, transparent 70%, ${alpha(COLORS.bg, 0.85 * move)} 100%)`}} />
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: colX,
          top,
          width: colW,
          display: 'flex',
          flexDirection: 'column',
          alignItems: align,
          opacity: lerp(f, [B.logo - 6, B.logo], [0, 1]),
        }}
      >
        <div style={{opacity: logoIn, transform: `translateY(${(1 - logoIn) * 30}px) scale(${0.9 + 0.1 * logoIn})`}}>
          <Logo width={logoW} glow={1.2} />
        </div>
        <div style={{height: L.square ? 34 : 44}} />
        {C.lines.map((line, i) => (
          <KineticText
            key={line}
            lines={[line]}
            at={[B.line1, B.line2, B.line3][i]}
            size={L.square ? 50 : 66}
            width={L.square ? L.text.w : L.W - 120}
            align={L.square ? 'left' : 'center'}
          />
        ))}
        <div style={{height: L.square ? 30 : 38}} />
        <div
          style={{
            opacity: pill,
            transform: `scale(${0.85 + 0.15 * pill})`,
            height: L.square ? 54 : 70,
            padding: `0 ${L.square ? 24 : 34}px`,
            borderRadius: 80,
            background: GRADIENTS.brand,
            color: '#fff',
            fontFamily: UI_STACK,
            fontWeight: 700,
            fontSize: L.square ? 21 : 29,
            display: 'flex',
            alignItems: 'center',
            boxShadow: `0 16px 50px ${alpha(COLORS.blue, 0.55)}, inset 0 1px 0 ${alpha('#FFFFFF', 0.35)}`,
            whiteSpace: 'nowrap',
          }}
        >
          {C.pill}
        </div>
        <div style={{height: L.square ? 22 : 28}} />
        <div
          style={{
            opacity: url,
            transform: `translateY(${(1 - url) * 20}px)`,
            fontFamily: DISPLAY_STACK,
            fontWeight: 800,
            fontSize: L.square ? 52 : 64,
            letterSpacing: '-0.03em',
            color: COLORS.text,
          }}
        >
          {C.url}
        </div>
      </div>
    </AbsoluteFill>
  );
};
