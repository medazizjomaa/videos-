import React from 'react';
import {AbsoluteFill, random, Sequence, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY, NotifApp} from '../copy';
import {Background} from '../components/Background';
import {Avatar} from '../components/DMThread';
import {IconCheck} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {Logo} from '../components/Logo';
import {AppIcon} from '../components/Notification';
import {UI_STACK} from '../fonts';
import {EASE_OUT, lerp, SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.reveal;
const C = COPY.reveal;

const AnsweredRow: React.FC<{row: (typeof C.rows)[number]; w: number; h: number; check: number}> = ({row, w, h, check}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: h * 0.24,
      background: `linear-gradient(180deg, ${COLORS.bgPanel2} 0%, ${COLORS.bgPanel} 100%)`,
      border: `1px solid ${alpha(COLORS.blue, 0.25 + 0.25 * check)}`,
      display: 'flex',
      alignItems: 'center',
      gap: h * 0.16,
      padding: `0 ${h * 0.2}px`,
      boxSizing: 'border-box',
      fontFamily: UI_STACK,
      color: COLORS.text,
      boxShadow: `0 16px 40px ${alpha('#0B1B3F', 0.1)}`,
    }}
  >
    <div style={{position: 'relative'}}>
      <Avatar size={h * 0.5} initials={row.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()} bg={COLORS.bgPanel2} />
      <div style={{position: 'absolute', right: -h * 0.06, bottom: -h * 0.06}}>
        <AppIcon app={row.app as NotifApp} size={h * 0.24} />
      </div>
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{fontSize: h * 0.17, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{row.name}</div>
      <div style={{fontSize: h * 0.16, color: COLORS.textDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2}}>
        {row.reply}
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: h * 0.06,
        fontSize: h * 0.14,
        fontWeight: 700,
        color: COLORS.cyan,
        opacity: check,
        transform: `scale(${0.7 + 0.3 * check})`,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          width: h * 0.26,
          height: h * 0.26,
          borderRadius: h,
          background: COLORS.blue,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconCheck size={h * 0.17} color="#fff" stroke={3.2} />
      </div>
      {row.time}
    </div>
  </div>
);

export const S04Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();

  // Light pulse
  const pulse = lerp(f, [B.pulse, B.pulse + 30], [0, 1], EASE_OUT);
  const core = sp(f, B.pulse, SPRINGS.pop) * (1 - lerp(f, [B.logo + 2, B.logo + 12], [0, 1]));

  // Logo plate: grows out of the light, then rises.
  const logoIn = sp(f, B.logo, SPRINGS.snappy);
  const move = sp(f, B.logoMove, SPRINGS.smooth);
  const bigW = L.square ? 640 : 780;
  const smallW = L.square ? 420 : 560;
  const logoW = bigW + (smallW - bigW) * move;
  const center = {x: L.W / 2, y: L.H / 2};
  const target = L.square ? {x: L.text.x + smallW / 2, y: 190} : {x: L.W / 2, y: 270};
  const lx = center.x + (target.x - center.x) * move;
  const ly = center.y + (target.y - center.y) * move;
  const logoH = logoW * (444 / 1180) * 0.86 + logoW * 0.09;

  const bg = lerp(f, [B.pulse + 4, B.logo + 30], [0, 1]);

  // Headline anchored under the logo
  const headTop = ly + logoH / 2 + (L.square ? 44 : 50);
  const headX = L.square ? L.text.x : 76;
  const headW = L.square ? L.text.w : L.W - 152;
  const headAlign = L.square ? 'left' : 'center';
  const headSize = L.square ? 52 : 70;

  // Chaos cards organise into answered threads
  const rows = C.rows;
  const rowH = L.square ? 104 : 124;
  const rowW = L.square ? 468 : 900;
  const colX = L.square ? 556 : (L.W - rowW) / 2;
  const colY = L.square ? (L.H - rows.length * (rowH + 14)) / 2 : 790;

  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      <AbsoluteFill style={{opacity: bg}}>
        <Background variant="brand" intensity={1.1} />
      </AbsoluteFill>

      {/* Pulse */}
      <div
        style={{
          position: 'absolute',
          left: center.x,
          top: center.y,
          width: 0,
          height: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -700 * pulse,
            top: -700 * pulse,
            width: 1400 * pulse,
            height: 1400 * pulse,
            borderRadius: 2000,
            border: `3px solid ${alpha(COLORS.blue, 0.6 * (1 - pulse))}`,
            boxShadow: `0 0 80px ${alpha(COLORS.cyan, 0.35 * (1 - pulse))}, inset 0 0 80px ${alpha(COLORS.blue, 0.3 * (1 - pulse))}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -40,
            top: -40,
            width: 80,
            height: 80,
            borderRadius: 80,
            background: `radial-gradient(circle, ${COLORS.cyan} 0%, ${COLORS.blue} 35%, ${alpha(COLORS.blue, 0)} 70%)`,
            transform: `scale(${core * 2.4})`,
            opacity: core,
          }}
        />
      </div>

      {/* Rows */}
      {rows.map((r, i) => {
        const t = B.organize + i * 4;
        const p = sp(f, t, SPRINGS.soft);
        const appear = sp(f, B.organize - 10 + i * 2, SPRINGS.smooth);
        const sx = (random(`rx-${i}`) - 0.5) * L.W * 1.1 + L.W / 2;
        const sy = (random(`ry-${i}`) - 0.5) * L.H * 0.9 + L.H / 2;
        const sr = (random(`rr-${i}`) - 0.5) * 30;
        const tx = colX;
        const ty = colY + i * (rowH + 14);
        const x = sx - rowW / 2 + (tx - (sx - rowW / 2)) * p;
        const y = sy + (ty - sy) * p;
        const check = sp(f, t + 14, SPRINGS.pop);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              opacity: appear,
              transform: `rotate(${sr * (1 - p)}deg) scale(${0.85 + 0.15 * p})`,
            }}
          >
            <AnsweredRow row={r} w={rowW} h={rowH} check={check} />
          </div>
        );
      })}

      {/* Logo */}
      <Sequence from={B.logo} layout="none">
        <div
          style={{
            position: 'absolute',
            left: lx - logoW / 2,
            top: ly - logoH / 2,
            opacity: Math.min(1, logoIn * 1.3),
            transform: `scale(${0.7 + 0.3 * logoIn})`,
            clipPath: `inset(0 ${(1 - logoIn) * 46}% 0 ${(1 - logoIn) * 46}% round 40px)`,
          }}
        >
          <Logo width={logoW} animated startFrom={4.4} glow={1.2} />
        </div>
      </Sequence>

      {/* Headlines */}
      <div style={{position: 'absolute', left: headX, top: headTop}}>
        <KineticText lines={C.headline1} at={B.headline1} out={B.headline1Out} size={headSize} width={headW} align={headAlign} />
      </div>
      <div style={{position: 'absolute', left: headX, top: headTop}}>
        <KineticText lines={C.headline2} at={B.headline2} size={headSize} width={headW} align={headAlign} />
      </div>
    </AbsoluteFill>
  );
};
