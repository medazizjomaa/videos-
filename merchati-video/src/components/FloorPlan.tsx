import React from 'react';
import {Img, staticFile} from 'remotion';
import {alpha} from '../config';
import {UI_STACK} from '../fonts';

export type TableState = 'free' | 'taken' | 'selected' | 'reserved';

// The venue's own floor plan (cropped to 780×580); tables are overlaid in that space.
export const PLAN_W = 780;
export const PLAN_H = 580;

type TableDef = {id: string; x: number; y: number; w: number; h: number; seats: number};

const row = (ids: string[], xs: number[], y: number, w: number, h: number, seats: number) =>
  ids.map((id, i) => ({id, x: xs[i], y, w, h, seats}));

export const TABLES: TableDef[] = [
  ...row(['T01', 'T02', 'T03', 'T04', 'T05', 'T06'], [355, 415, 475, 536, 598, 653], 84, 48, 56, 2),
  {id: 'T07', x: 653, y: 130, w: 48, h: 50, seats: 2},
  ...row(['T08', 'T09', 'T10'], [378, 465, 550], 142, 82, 52, 4),
  {id: 'T11', x: 530, y: 282, w: 72, h: 132, seats: 10},
  {id: 'T12', x: 427, y: 405, w: 58, h: 50, seats: 4},
  {id: 'T13', x: 427, y: 455, w: 58, h: 50, seats: 4},
  {id: 'T14', x: 427, y: 522, w: 52, h: 78, seats: 6},
  {id: 'T15', x: 522, y: 434, w: 52, h: 52, seats: 2},
  {id: 'T16', x: 588, y: 434, w: 52, h: 52, seats: 2},
  {id: 'T17', x: 522, y: 500, w: 52, h: 52, seats: 2},
  {id: 'T18', x: 588, y: 500, w: 52, h: 52, seats: 2},
  {id: 'T19', x: 665, y: 432, w: 72, h: 54, seats: 4},
  {id: 'T20', x: 665, y: 505, w: 72, h: 62, seats: 6},
  {id: 'T21', x: 310, y: 468, w: 46, h: 144, seats: 4},
];

export const tableCenter = (id: string) => {
  const t = TABLES.find((x) => x.id === id)!;
  return {x: t.x, y: t.y};
};

/** The real venue floor plan with live table states on top. */
export const FloorPlan: React.FC<{
  width: number;
  accent: string;
  states: Record<string, TableState>;
  pulse?: {id: string; p: number};
  labels?: Record<string, string>;
  radius?: number;
}> = ({width, accent, states, pulse, labels, radius = 16}) => {
  const k = width / PLAN_W;
  return (
    <div style={{width, height: PLAN_H * k, position: 'relative', borderRadius: radius, overflow: 'hidden', fontFamily: UI_STACK}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: PLAN_W, height: PLAN_H, transform: `scale(${k})`, transformOrigin: 'top left'}}>
        <Img src={staticFile('brand/floorplan.png')} style={{width: PLAN_W, height: PLAN_H, display: 'block'}} />
        {TABLES.map((t) => {
          const st = states[t.id] ?? 'free';
          const isPulse = pulse && pulse.id === t.id && pulse.p > 0;
          const on = st === 'selected' || st === 'reserved';
          if (st === 'free' && !isPulse) return null;
          return (
            <div key={t.id} style={{position: 'absolute', left: t.x - t.w / 2, top: t.y - t.h / 2, width: t.w, height: t.h}}>
              {isPulse ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: -16,
                    borderRadius: 18,
                    border: `3px solid ${alpha(accent, 0.9 * pulse.p)}`,
                    boxShadow: `0 0 ${40 * pulse.p}px ${alpha(accent, 0.75 * pulse.p)}`,
                  }}
                />
              ) : null}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 10,
                  background: on ? alpha(accent, 0.55) : 'rgba(20,22,28,0.62)',
                  border: on ? `3px solid ${accent}` : '2px solid rgba(255,255,255,0.18)',
                  boxShadow: on ? `0 0 24px ${alpha(accent, 0.7)}` : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 15,
                  textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                }}
              >
                {t.id}
              </div>
              {labels && labels[t.id] ? (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: t.h + 6,
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    background: on ? accent : 'rgba(20,22,28,0.85)',
                    padding: '3px 8px',
                    borderRadius: 8,
                  }}
                >
                  {labels[t.id]}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
