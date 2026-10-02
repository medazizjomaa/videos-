import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {ChatBubble} from '../components/ChatBubble';
import {Avatar} from '../components/DMThread';
import {IconClock, IconX} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {DISPLAY_STACK, UI_STACK} from '../fonts';
import {EASE_OUT, fmtNum, lerp, SPRINGS, sp} from '../lib/anim';
import {Box, useLayout} from '../layout';

const B = BEATS.consequences;
const C = COPY.consequences;

const Panel: React.FC<{box: Box; at: number; f: number; children: React.ReactNode; tone?: 'red' | 'none'}> = ({box, at, f, children, tone = 'none'}) => {
  const p = sp(f, at, SPRINGS.snappy);
  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: 30,
        background: `linear-gradient(180deg, ${COLORS.bgPanel2} 0%, ${COLORS.bgPanel} 100%)`,
        border: `1px solid ${tone === 'red' ? alpha(COLORS.red, 0.35) : COLORS.lineStrong}`,
        boxShadow: `0 30px 80px ${alpha('#000000', 0.45)}`,
        overflow: 'hidden',
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px) scale(${0.96 + 0.04 * p})`,
        fontFamily: UI_STACK,
        color: '#fff',
      }}
    >
      {children}
    </div>
  );
};

/** Rolling digital clock 23:00 → 02:00 → 08:00. */
const Clock: React.FC<{f: number; size: number}> = ({f, size}) => {
  const clocks: readonly number[] = B.clock;
  const idx = clocks.reduce((a: number, t: number, i: number) => (f >= t ? i : a), 0);
  const t = clocks[idx];
  const roll = idx === 0 ? 1 : lerp(f, [t, t + 10], [0, 1], EASE_OUT);
  const prev = C.clocks[Math.max(0, idx - 1)];
  const cur = C.clocks[idx];
  const flash = idx === 0 ? 0 : Math.max(0, 1 - (f - t) / 12);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.12,
        fontFamily: DISPLAY_STACK,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '-0.04em',
        color: '#fff',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
      }}
    >
      <IconClock size={size * 0.5} color={alpha(COLORS.redSoft, 0.9)} stroke={2.2} />
      <div style={{position: 'relative', height: size * 1.05, overflow: 'hidden', textShadow: `0 0 ${40 * flash}px ${alpha(COLORS.redSoft, 0.8)}`}}>
        <div style={{transform: `translateY(${(1 - roll) * 100}%)`}}>{cur}</div>
        {roll < 1 ? <div style={{position: 'absolute', top: 0, transform: `translateY(${-roll * 100}%)`, opacity: 1 - roll}}>{prev}</div> : null}
      </div>
    </div>
  );
};

export const S03Consequences: React.FC = () => {
  const raw = useCurrentFrame();
  const f = Math.min(raw, B.freeze);
  const L = useLayout();
  const black = lerp(raw, [B.fadeOut[0], B.fadeOut[1]], [0, 1]);

  const boxes = L.square
    ? {
        dm: {x: 548, y: 40, w: 496, h: 384},
        cancel: {x: 548, y: 440, w: 240, h: 300},
        table: {x: 804, y: 440, w: 240, h: 300},
        lost: {x: 548, y: 756, w: 496, h: 284},
      }
    : {
        dm: {x: 60, y: 480, w: 468, h: 720},
        cancel: {x: 552, y: 480, w: 468, h: 348},
        table: {x: 552, y: 852, w: 468, h: 348},
        lost: {x: 60, y: 1224, w: 960, h: 300},
      };
  const s = L.square ? 0.8 : 1.15; // inner content scale

  const lost = lerp(f, [B.lostCount[0], B.lostCount[1]], [0, C.lostValue], EASE_OUT);
  const clockOut = sp(f, B.clockOut, SPRINGS.smooth);
  const leftP = sp(f, B.leave + 10, SPRINGS.smooth);

  return (
    <AbsoluteFill>
      <Background variant="alarm" intensity={0.6 + lerp(f, [0, 150], [0, 0.7])} />

      {/* Clock, then the headline in the same slot */}
      <div
        style={{
          position: 'absolute',
          left: L.text.x,
          top: L.square ? L.H / 2 - 70 : L.text.y + 40,
          opacity: 1 - clockOut,
          transform: `translateY(${-clockOut * 60}px)`,
        }}
      >
        <Clock f={f} size={L.square ? 110 : 150} />
      </div>
      <div style={{position: 'absolute', left: L.text.x, top: L.square ? L.H / 2 - 110 : L.text.y + 10}}>
        <KineticText lines={C.headline} at={B.headline} size={L.headlineSize * 0.92} width={L.text.w} freezeAt={B.freeze} />
      </div>

      {/* Seen, "?", gone */}
      <Panel box={boxes.dm} at={4} f={f}>
        <div style={{position: 'absolute', left: 0, top: 0, width: boxes.dm.w / s, height: boxes.dm.h / s, transform: `scale(${s})`, transformOrigin: 'top left'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '22px 22px 16px', borderBottom: `1px solid ${COLORS.line}`, opacity: 1 - leftP * 0.6}}>
            <Avatar size={40} initials="AK" bg="#7C3AED" />
            <div>
              <div style={{fontWeight: 700, fontSize: 17}}>{C.dmName}</div>
              <div style={{fontSize: 13, color: COLORS.textDim}}>Instagram</div>
            </div>
          </div>
          <div style={{padding: '18px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8}}>
            {[
              {t: C.dmFirst, at: B.msgAt},
              {t: C.dmQ1, at: B.q1},
              {t: C.dmQ2, at: B.q2},
              {t: C.dmLeave, at: B.leave},
            ].map((m) => {
              const p = sp(f, m.at, SPRINGS.snappy);
              if (p <= 0.01) return null;
              return (
                <div key={m.t} style={{opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>
                  <ChatBubble from="them" text={m.t} theme="instagram" />
                </div>
              );
            })}
            <div
              style={{
                alignSelf: 'flex-end',
                fontSize: 13.5,
                color: COLORS.textDim,
                fontWeight: 600,
                opacity: sp(f, B.seenAt, SPRINGS.smooth),
                marginTop: 4,
              }}
            >
              {C.seen} · {C.clocks[0].replace(':00', ':04')}
            </div>
          </div>
        </div>
      </Panel>

      {/* Cancelled order */}
      <Panel box={boxes.cancel} at={B.cancelAt} f={f} tone="red">
        <div style={{position: 'absolute', left: 0, top: 0, width: boxes.cancel.w / s, height: boxes.cancel.h / s, transform: `scale(${s})`, transformOrigin: 'top left', padding: 22, boxSizing: 'border-box'}}>
          <div style={{width: 46, height: 46, borderRadius: 14, background: alpha(COLORS.red, 0.16), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <IconX size={24} color={COLORS.redSoft} stroke={2.6} />
          </div>
          <div style={{fontSize: 18, fontWeight: 700, marginTop: 16}}>{C.cancelledTitle}</div>
          <div style={{fontSize: 14, color: COLORS.textDim, marginTop: 4}}>{C.cancelledSub}</div>
          <div
            style={{
              display: 'inline-block',
              marginTop: 14,
              fontSize: 13,
              fontWeight: 700,
              color: COLORS.redSoft,
              background: alpha(COLORS.red, 0.14),
              padding: '5px 12px',
              borderRadius: 20,
              transform: `scale(${1 + 0.15 * (sp(f, B.cancelAt + 10, SPRINGS.pop) - sp(f, B.cancelAt + 16, SPRINGS.smooth))})`,
            }}
          >
            {C.cancelledStatus}
          </div>
        </div>
      </Panel>

      {/* Empty table */}
      <Panel box={boxes.table} at={B.tableAt} f={f}>
        <div style={{position: 'absolute', left: 0, top: 0, width: boxes.table.w / s, height: boxes.table.h / s, transform: `scale(${s})`, transformOrigin: 'top left', padding: 22, boxSizing: 'border-box'}}>
          <svg width={110} height={84} viewBox="0 0 110 84" style={{display: 'block'}}>
            <circle cx="55" cy="42" r="22" fill="none" stroke={alpha('#FFFFFF', 0.35)} strokeWidth="2" strokeDasharray="5 5" />
            {[
              [55, 8],
              [55, 76],
              [16, 42],
              [94, 42],
            ].map(([x, y], i) => (
              <rect key={i} x={x - 7} y={y - 7} width="14" height="14" rx="4" fill="none" stroke={alpha('#FFFFFF', 0.28)} strokeWidth="2" />
            ))}
          </svg>
          <div style={{fontSize: 18, fontWeight: 700, marginTop: 10}}>{C.tableTitle}</div>
          <div style={{fontSize: 14, color: COLORS.textDim, marginTop: 4}}>{C.tableSub}</div>
          <div
            style={{
              display: 'inline-block',
              marginTop: 14,
              fontSize: 13,
              fontWeight: 700,
              color: COLORS.textDim,
              background: alpha('#FFFFFF', 0.08),
              padding: '5px 12px',
              borderRadius: 20,
            }}
          >
            {C.tableStatus}
          </div>
        </div>
      </Panel>

      {/* Lost sales */}
      <Panel box={boxes.lost} at={B.lostAt} f={f} tone="red">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(70% 90% at 50% 100%, ${alpha(COLORS.red, 0.22)} 0%, transparent 70%)`,
          }}
        />
        <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: L.square ? 18 : 26, fontWeight: 700, color: COLORS.redSoft, letterSpacing: '0.12em', textTransform: 'uppercase'}}>{C.lostLabel}</div>
          <div
            style={{
              fontFamily: DISPLAY_STACK,
              fontWeight: 800,
              fontSize: L.square ? 92 : 128,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.05,
              marginTop: 6,
            }}
          >
            − {fmtNum(lost)} <span style={{fontSize: '0.42em', color: COLORS.textDim, letterSpacing: '0'}}>{C.currency}</span>
          </div>
        </div>
      </Panel>

      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
