import React, {useMemo} from 'react';
import {random, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY} from '../copy';
import {DISPLAY_STACK, UI_STACK} from '../fonts';
import {SPRINGS, sp} from '../lib/anim';
import {NOTIF_H, NOTIF_W, NotificationCard} from './Notification';
import {SCREEN_W} from './PhoneFrame';

const B = BEATS.overload;

/** Arrival frames: slow at first, then faster and faster. */
export const notifArrivals = (until: number) => {
  const out: number[] = [];
  let t: number = B.firstNotif;
  let gap: number = B.firstGap;
  while (t < until) {
    out.push(t);
    t += gap;
    gap = Math.max(B.minGap, gap * B.gapDecay);
  }
  return out;
};

const GAP = 8;

/** Lock screen with the notification stack (phone logical units). */
export const LockScreen: React.FC<{
  time: string;
  date: string;
  arrivals?: number[];
  calm?: React.ReactNode;
}> = ({time, date, arrivals = [], calm}) => {
  const f = useCurrentFrame();
  const list = COPY.notifications;
  const visible = arrivals.map((t, i) => ({t, i})).filter((a) => a.t <= f);
  const progress = visible.map((a) => sp(f, a.t, SPRINGS.snappy));

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(120% 70% at 30% 0%, ${COLORS.lockWall1} 0%, ${COLORS.lockWall2} 70%)`,
        fontFamily: UI_STACK,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(80% 40% at 80% 100%, ${alpha(COLORS.cyan, 0.25)} 0%, transparent 70%)`,
        }}
      />
      <div style={{position: 'absolute', top: 92, width: '100%', textAlign: 'center', color: COLORS.navy}}>
        <div style={{fontSize: 19, fontWeight: 600, opacity: 0.85}}>{date}</div>
        <div
          style={{
            fontFamily: DISPLAY_STACK,
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          {time}
        </div>
      </div>
      {visible.map((a, k) => {
        // Newer notifications push older ones down.
        let y = 262;
        for (let j = k + 1; j < visible.length; j++) y += (NOTIF_H + GAP) * progress[j];
        const p = progress[k];
        if (y > 900) return null;
        const n = list[a.i % list.length];
        return (
          <div
            key={a.i}
            style={{
              position: 'absolute',
              left: (SCREEN_W - NOTIF_W) / 2,
              top: y,
              opacity: Math.min(1, p * 1.5),
              transform: `translateY(${(1 - p) * -36}px) scale(${0.92 + 0.08 * p})`,
            }}
          >
            <NotificationCard app={n.app as never} title={n.title} body={n.body} />
          </div>
        );
      })}
      {calm}
    </div>
  );
};

type Spill = {
  i: number;
  t: number;
  x: number;
  y: number;
  r: number;
  layer: 'back' | 'front';
  depth: number;
};

/** Notifications overflowing the phone, laid on a jittered grid in depth layers. */
export const SpillLayer: React.FC<{
  layer: 'back' | 'front';
  W: number;
  H: number;
  top: number;
  cardScale: number;
  count?: number;
  start?: number;
  spacing?: number;
}> = ({layer, W, H, top, cardScale, count = 34, start = B.spillStart, spacing = 2.6}) => {
  const f = useCurrentFrame();
  const spills = useMemo(() => {
    const cols = W > H * 0.8 ? 4 : 3;
    const rows = Math.ceil(count / cols);
    const out: Spill[] = [];
    for (let i = 0; i < count; i++) {
      const order = Math.floor(random(`order-${i}`) * 1000);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const fx = (col + 0.5) / cols + (random(`x-${i}`) - 0.5) * 0.16;
      const fy = (row + 0.5) / rows + (random(`y-${i}`) - 0.5) * 0.08;
      const isFront = i % 5 === 2 && i > 8;
      out.push({
        i: order,
        t: start + i * spacing,
        x: fx * W,
        y: top + fy * (H - top),
        r: (random(`r-${i}`) - 0.5) * 9,
        layer: isFront ? 'front' : 'back',
        depth: isFront ? 1.05 : 0.72 + random(`d-${i}`) * 0.22,
      });
    }
    return out;
  }, [W, H, top, count, start, spacing]);

  return (
    <>
      {spills
        .filter((s) => s.layer === layer && f >= s.t)
        .map((s, k) => {
          const p = sp(f, s.t, SPRINGS.snappy);
          const n = COPY.notifications[s.i % COPY.notifications.length];
          const sc = cardScale * s.depth * (0.86 + 0.14 * p);
          const drift = (f - s.t) * 0.9;
          const dim = layer === 'back' ? 0.35 + 0.4 * (s.depth - 0.72) / 0.22 : 1;
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: s.x - (NOTIF_W * sc) / 2,
                top: s.y - (NOTIF_H * sc) / 2 + drift - (1 - p) * 60,
                width: NOTIF_W,
                transform: `scale(${sc}) rotate(${s.r}deg)`,
                transformOrigin: 'top left',
                opacity: Math.min(1, p * 1.6) * dim,
              }}
            >
              <NotificationCard app={n.app as never} title={n.title} body={n.body} />
            </div>
          );
        })}
    </>
  );
};

/** Red unread badge (video pixels). */
export const UnreadBadge: React.FC<{value: number; size: number; pop?: number; style?: React.CSSProperties}> = ({
  value,
  size,
  pop = 0,
  style,
}) => {
  const label = value > 99 ? '99+' : String(Math.round(value));
  return (
    <div
      style={{
        height: size,
        minWidth: size,
        padding: `0 ${size * 0.3}px`,
        borderRadius: size,
        background: `linear-gradient(180deg, #FF5A6A 0%, ${COLORS.red} 100%)`,
        color: '#fff',
        fontFamily: DISPLAY_STACK,
        fontWeight: 800,
        fontSize: size * 0.56,
        letterSpacing: '-0.02em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        boxShadow: `0 0 0 ${size * 0.08}px ${COLORS.bg}, 0 10px 40px ${alpha(COLORS.red, 0.55)}`,
        transform: `scale(${1 + pop * 0.18})`,
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {label}
    </div>
  );
};
