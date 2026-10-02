import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS, SCENES, TRANSITION} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {KineticText} from '../components/KineticText';
import {LockScreen, notifArrivals, SpillLayer, UnreadBadge} from '../components/NotificationFlood';
import {PHONE_OUTER_W, PhoneFrame} from '../components/PhoneFrame';
import {CLAMP, lerp, SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.overload;

export const S01Overload: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const arrivals = notifArrivals(SCENES.overload.dur + TRANSITION);

  const phoneW = L.phoneW;
  const phoneX = L.phoneCx - phoneW / 2;
  const phoneY = L.phoneTop;

  // Unread badge climbs 12 → 47 → 99+
  const badge = interpolate(
    f,
    B.badge.map((b) => b[0]),
    B.badge.map((b) => b[1]),
    CLAMP,
  );
  const lastArrival = arrivals.filter((t) => t <= f).pop() ?? -100;
  const pop = Math.max(0, 1 - (f - lastArrival) / 6);
  const badgeIn = sp(f, 20, SPRINGS.pop);

  // Phone buzz grows with the overload.
  const buzzAmp = lerp(f, [B.vibrateFrom, 140], [0, 1]);
  const buzz = Math.sin(f * 2.7) * buzzAmp * Math.max(0, 1 - (f - lastArrival) / 5);
  const intro = sp(f, 0, SPRINGS.smooth);
  const push = lerp(f, [0, 150], [1, 1.04]);

  const cardScale = phoneW / PHONE_OUTER_W;

  return (
    <AbsoluteFill>
      <Background variant="chaos" intensity={0.6 + buzzAmp * 0.6} />
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <SpillLayer layer="back" W={L.W} H={L.H} top={L.square ? 20 : 420} cardScale={cardScale} />
        <div
          style={{
            position: 'absolute',
            left: phoneX,
            top: phoneY + (1 - intro) * 80,
            opacity: intro,
            transform: `rotate(${buzz * 0.9}deg) translateX(${buzz * 3}px)`,
          }}
        >
          <PhoneFrame width={phoneW} time={COPY.overload.lockTime} glow={0.6}>
            <LockScreen time={COPY.overload.lockTime} date={COPY.overload.lockDate} arrivals={arrivals} />
          </PhoneFrame>
          <div style={{position: 'absolute', right: -phoneW * 0.07, top: -phoneW * 0.05, opacity: badgeIn, transform: `scale(${badgeIn})`}}>
            <UnreadBadge value={badge} size={L.square ? 64 : 84} pop={pop} />
          </div>
        </div>
        <SpillLayer layer="front" W={L.W} H={L.H} top={L.square ? 20 : 420} cardScale={cardScale} />
      </AbsoluteFill>
      {/* Scrim keeps the headline readable over the flood */}
      <AbsoluteFill
        style={{
          background: L.square
            ? `linear-gradient(90deg, ${alpha(COLORS.bg, 0.92)} 0%, ${alpha(COLORS.bg, 0.75)} 40%, transparent 58%)`
            : `linear-gradient(180deg, ${alpha(COLORS.bg, 0.95)} 0%, ${alpha(COLORS.bg, 0.8)} 22%, transparent 30%)`,
        }}
      />
      <Headline />
    </AbsoluteFill>
  );
};

const Headline: React.FC = () => {
  const L = useLayout();
  const size = L.headlineSize;
  if (L.square) {
    return (
      <div style={{position: 'absolute', left: L.text.x, top: 0, height: L.H, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28}}>
        <KineticText lines={COPY.overload.headline1} at={B.headline1} size={size} width={L.text.w} />
        <KineticText lines={COPY.overload.headline2} at={B.headline2} size={size} width={L.text.w} />
      </div>
    );
  }
  return (
    <div style={{position: 'absolute', left: L.text.x, top: L.text.y - 10}}>
      <KineticText lines={COPY.overload.headline1} at={B.headline1} size={size} width={L.text.w} />
      <div style={{height: 10}} />
      <KineticText lines={COPY.overload.headline2} at={B.headline2} size={size} width={L.text.w} />
    </div>
  );
};
