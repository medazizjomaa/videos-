import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, COLORS} from '../config';
import {COPY, NotifApp} from '../copy';
import {UI_STACK} from '../fonts';
import {EASE_IN_OUT, lerp, SPRINGS, sp} from '../lib/anim';
import {Box} from '../layout';
import {Avatar} from './DMThread';
import {AppIcon} from './Notification';

const ORDER: NotifApp[] = ['ig', 'shop', 'ms', 'resa', 'ms', 'ig', 'resa', 'shop', 'ig', 'shop', 'ms', 'ig', 'resa', 'ig', 'ms', 'shop'];
const PHASE_COUNTS = [2, 4, 9, 16];
const CONTENT_W = 460;
const ROW_H = 62;
const HEADER_H = 58;

const AVATAR_BG = ['#7C3AED', '#0EA5E9', '#F97316', '#10B981', '#EC4899', '#6366F1', '#14B8A6', '#EAB308'];

const grid = (n: number, area: Box, gap: number, square: boolean): Box[] => {
  const shapes: Record<number, [number, number]> = square
    ? {2: [2, 1], 4: [2, 2], 9: [3, 3], 16: [4, 4]}
    : {2: [1, 2], 4: [2, 2], 9: [3, 3], 16: [4, 4]};
  const [cols, rows] = shapes[n];
  const w = (area.w - gap * (cols - 1)) / cols;
  const h = (area.h - gap * (rows - 1)) / rows;
  return Array.from({length: n}, (_, i) => ({
    x: area.x + (i % cols) * (w + gap),
    y: area.y + Math.floor(i / cols) * (h + gap),
    w,
    h,
  }));
};

const Panel: React.FC<{type: NotifApp; seed: number; h: number; start: number}> = ({type, seed, h, start}) => {
  const f = useCurrentFrame();
  const rate = 11 - (seed % 4);
  const pool = COPY.notifications.filter((n) => n.app === type);
  const rowsVisible = Math.ceil((h - HEADER_H) / ROW_H) + 1;
  const arrived = Math.max(0, Math.floor((f - start) / rate)) + 7;
  const count = 18 + seed * 7 + arrived * 3;
  const meta = COPY.panels[type];
  return (
    <div
      style={{
        width: CONTENT_W,
        height: h,
        background: COLORS.bgPanel,
        borderRadius: 26,
        border: `1px solid ${COLORS.lineStrong}`,
        overflow: 'hidden',
        fontFamily: UI_STACK,
        color: '#0F1222',
        position: 'relative',
        boxShadow: `0 16px 40px ${alpha('#0B1B3F', 0.1)}`,
      }}
    >
      <div
        style={{
          height: HEADER_H,
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          gap: 11,
          borderBottom: `1px solid ${COLORS.line}`,
          background: COLORS.bgPanel2,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <AppIcon app={type} size={30} />
        <span style={{fontWeight: 700, fontSize: 17, flex: 1}}>{meta.title}</span>
        <span
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: '#fff',
            background: COLORS.red,
            borderRadius: 12,
            padding: '4px 10px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {count} {meta.unit}
        </span>
      </div>
      {Array.from({length: rowsVisible}, (_, r) => {
        // Row r=0 is the newest; the list slides down as new rows arrive.
        const k = arrived - r;
        if (k < 0) return null;
        const tArrive = start + (k - 7) * rate;
        const p = k < 7 ? 1 : sp(f, tArrive, SPRINGS.snappy);
        const slide = (1 - sp(f, tArrive, SPRINGS.snappy)) * ROW_H;
        const n = pool[(k + seed * 3) % pool.length];
        const typing = (k + seed) % 3 === 0;
        const dots = [0, 1, 2].map((d) => 0.35 + 0.65 * Math.max(0, Math.sin((f - d * 4) / 3.4)));
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 0,
              top: HEADER_H + r * ROW_H - slide,
              width: CONTENT_W,
              height: ROW_H,
              display: 'flex',
              alignItems: 'center',
              padding: '0 18px',
              gap: 12,
              boxSizing: 'border-box',
              borderBottom: `1px solid ${COLORS.line}`,
              opacity: r === 0 ? p : 1,
              background: r === 0 ? alpha(COLORS.blue, 0.06 * p) : 'transparent',
            }}
          >
            <Avatar size={36} initials={n.title.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'MK'} bg={AVATAR_BG[(k + seed) % AVATAR_BG.length]} />
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{n.title}</div>
              <div style={{fontSize: 14, color: COLORS.textDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {n.body}
              </div>
            </div>
            {typing && (type === 'ig' || type === 'ms') ? (
              <div style={{display: 'flex', gap: 4, background: '#EEF1F6', borderRadius: 12, padding: '8px 10px'}}>
                {dots.map((o, d) => (
                  <div key={d} style={{width: 6, height: 6, borderRadius: 6, background: '#5B6782', opacity: o}} />
                ))}
              </div>
            ) : (
              <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: COLORS.redSoft, fontWeight: 600, whiteSpace: 'nowrap'}}>
                <div style={{width: 7, height: 7, borderRadius: 7, background: COLORS.red}} />
                {type === 'shop' || type === 'resa' ? COPY.panels.pending : COPY.panels.unanswered}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Panels that keep multiplying: 2 → 4 → 9 → 16. */
export const SplitPanels: React.FC<{area: Box; phases: readonly number[]; square: boolean}> = ({area, phases, square}) => {
  const f = useCurrentFrame();
  const layouts = PHASE_COUNTS.map((n) => grid(n, area, square ? 12 : 16, square));
  const phaseIdx = phases.reduce((acc, p, i) => (f >= p ? i : acc), 0);
  const total = PHASE_COUNTS[Math.min(phaseIdx, PHASE_COUNTS.length - 1)];

  return (
    <>
      {Array.from({length: total}, (_, i) => {
        // Interpolate the panel's rect through every phase it has lived in.
        let rect: Box | null = null;
        let born = 0;
        for (let p = 0; p <= phaseIdx; p++) {
          const cell = layouts[p][i];
          if (!cell) continue;
          if (!rect) {
            rect = cell;
            born = phases[p];
            continue;
          }
          const t = lerp(f, [phases[p], phases[p] + 16], [0, 1], EASE_IN_OUT);
          rect = {
            x: rect.x + (cell.x - rect.x) * t,
            y: rect.y + (cell.y - rect.y) * t,
            w: rect.w + (cell.w - rect.w) * t,
            h: rect.h + (cell.h - rect.h) * t,
          };
        }
        if (!rect) return null;
        const appear = born === 0 ? sp(f, i * 4, SPRINGS.snappy) : sp(f, born + (i % 5) * 2, SPRINGS.snappy);
        const k = rect.w / CONTENT_W;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: rect.x,
              top: rect.y,
              width: CONTENT_W,
              height: rect.h / k,
              transform: `scale(${k * (0.9 + 0.1 * appear)})`,
              transformOrigin: 'top left',
              opacity: appear,
            }}
          >
            <Panel type={ORDER[i % ORDER.length]} seed={i} h={rect.h / k} start={born + 6} />
          </div>
        );
      })}
    </>
  );
};
