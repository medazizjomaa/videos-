import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY} from '../copy';
import {DISPLAY_STACK} from '../fonts';
import {EASE_OUT, lerp, SPRINGS, sp} from '../lib/anim';
import {ACCENTS, Card, CONTENT_W, CONTENT_X, DashShell} from './DashShell';
import {FloorPlan, TableState} from './FloorPlan';
import {IconCalendar, IconCard, IconLink, IconMenu, IconTable} from './Icons';
import {Cursor} from './Pointer';

const B = BEATS.restoDash;
const C = COPY.restoDash;
const A = ACCENTS.orange;

const Btn: React.FC<{children: React.ReactNode; primary?: boolean; style?: React.CSSProperties}> = ({children, primary, style}) => (
  <div
    style={{
      height: 44,
      padding: '0 18px',
      borderRadius: 22,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      fontWeight: 800,
      background: primary ? `linear-gradient(180deg, #FF8A3D, ${A.main})` : '#fff',
      color: primary ? '#fff' : COLORS.dText,
      border: primary ? 'none' : `1px solid ${COLORS.dBorder}`,
      boxShadow: primary ? `0 10px 24px ${alpha(A.main, 0.35)}` : '0 2px 6px rgba(11,27,63,0.06)',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

const Tag: React.FC<{tone: 'green' | 'grey' | 'orange'; children: React.ReactNode}> = ({tone, children}) => {
  const t = {green: ['#0F8A4B', '#E3F7EC'], grey: ['#5B6782', '#EEF1F6'], orange: [A.text, A.soft]}[tone];
  return <span style={{fontSize: 12.5, fontWeight: 800, color: t[0], background: t[1], padding: '4px 10px', borderRadius: 10, whiteSpace: 'nowrap'}}>{children}</span>;
};

const Tonight: React.FC<{f: number}> = ({f}) => {
  const ring = lerp(f, [B.ringCount[0], B.ringCount[1]], [0, C.seats], EASE_OUT);
  const R = 64;
  const circ = 2 * Math.PI * R;
  const frac = ring / C.seatsTotal;
  const states: Record<string, TableState> = {T02: 'taken', T03: 'taken', T05: 'taken', T09: 'taken', T11: 'taken', T14: 'taken', T16: 'taken', T20: 'taken'};
  const statW = (CONTENT_W - 36) / 3;
  const statIcons = [IconCalendar, IconTable, IconMenu];
  return (
    <>
      <Card x={CONTENT_X} y={28} w={CONTENT_W} h={300} style={{background: 'linear-gradient(135deg, #FFF8F1 0%, #FFFFFF 60%)', border: `1px solid ${alpha(A.main, 0.25)}`}}>
        <div style={{padding: '30px 34px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: '#3B4660'}}>
            <span style={{width: 10, height: 10, borderRadius: 10, background: '#22C55E'}} />
            {C.serviceOpen}
          </div>
          <div style={{fontFamily: DISPLAY_STACK, fontSize: 42, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 10}}>{C.greeting}</div>
          <div style={{fontSize: 15, color: '#6A7894', marginTop: 4}}>{C.date}</div>
          <div style={{fontSize: 17, color: '#2A3550', marginTop: 14, width: 470, lineHeight: '25px'}}>{C.summary}</div>
          <div style={{display: 'flex', gap: 12, marginTop: 18}}>
            <Btn>{C.publicPage} <IconLink size={15} color={A.main} /></Btn>
            <Btn primary>{C.printSheet}</Btn>
          </div>
        </div>
        <div style={{position: 'absolute', right: 70, top: 46, width: 170, textAlign: 'center'}}>
          <svg width={170} height={170} viewBox="0 0 170 170">
            <circle cx={85} cy={85} r={R} fill="none" stroke="#E7ECF3" strokeWidth={14} />
            <circle cx={85} cy={85} r={R} fill="none" stroke={A.main} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${circ * frac} ${circ}`} transform="rotate(-90 85 85)" />
          </svg>
          <div style={{position: 'absolute', left: 0, right: 0, top: 50}}>
            <div style={{fontFamily: DISPLAY_STACK, fontSize: 40, fontWeight: 800, fontVariantNumeric: 'tabular-nums'}}>{Math.round(ring)}</div>
            <div style={{fontSize: 13, color: '#6A7894', fontWeight: 600}}>of {C.seatsTotal} seats</div>
          </div>
          <div style={{fontSize: 13, color: '#5B6782', fontWeight: 600, marginTop: 8}}>{C.ringSub}</div>
        </div>
      </Card>
      {C.stats.map((s, i) => {
        const Icon = statIcons[i];
        return (
          <Card key={s.label} x={CONTENT_X + i * (statW + 18)} y={346} w={statW} h={124}>
            <div style={{padding: '20px 22px'}}>
              <div style={{fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', color: '#5B6782'}}>{s.label}</div>
              <div style={{fontFamily: DISPLAY_STACK, fontSize: 34, fontWeight: 800, marginTop: 4}}>{s.value}</div>
              <div style={{fontSize: 14, color: '#6A7894'}}>{s.sub}</div>
            </div>
            <div style={{position: 'absolute', right: 20, top: 20, width: 44, height: 44, borderRadius: 14, background: A.soft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon size={21} color={A.main} stroke={2} />
            </div>
          </Card>
        );
      })}
      <Card x={CONTENT_X} y={488} w={CONTENT_W} h={392}>
        <div style={{display: 'flex', alignItems: 'center', padding: '20px 24px 12px'}}>
          <span style={{fontFamily: DISPLAY_STACK, fontSize: 19, fontWeight: 800}}>{C.floorTitle}</span>
          <span style={{marginLeft: 'auto', fontSize: 14, fontWeight: 800, color: A.text}}>{C.manageTables}</span>
        </div>
        <div style={{position: 'absolute', left: 24, top: 60}}>
          <FloorPlan width={420} accent={A.main} states={states} />
        </div>
        <div style={{position: 'absolute', left: 470, top: 66, right: 24, display: 'flex', flexDirection: 'column', gap: 12}}>
          {[
            ['Occupied now', '8 tables', A.main],
            ['Reserved later', '6 tables', '#1A73E8'],
            ['Free', '7 tables', '#16A34A'],
          ].map(([l, v, c]) => (
            <div key={l} style={{height: 64, borderRadius: 16, border: `1px solid ${COLORS.dBorder}`, background: '#FAFBFE', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12}}>
              <span style={{width: 12, height: 12, borderRadius: 12, background: c}} />
              <span style={{fontSize: 15, fontWeight: 600, color: '#3B4660'}}>{l}</span>
              <span style={{marginLeft: 'auto', fontFamily: DISPLAY_STACK, fontSize: 20, fontWeight: 800}}>{v}</span>
            </div>
          ))}
          <div style={{fontSize: 13, color: '#6A7894', lineHeight: '19px', marginTop: 4}}>21 configured tables · changes sync live to the public booking page.</div>
        </div>
      </Card>
    </>
  );
};

type Res = {time: string; guests: string; name: string; table: string; date: string; phone: string; status: string};

const ResRow: React.FC<{r: Res; hl?: number}> = ({r, hl = 0}) => {
  const cancelled = r.status === 'Cancelled';
  return (
    <div
      style={{
        height: 96,
        borderRadius: 26,
        background: '#fff',
        border: `1px solid ${hl > 0 ? alpha(A.main, 0.5 * hl + 0.1) : COLORS.dBorder}`,
        boxShadow: hl > 0 ? `0 12px 34px ${alpha(A.main, 0.22 * hl)}` : '0 2px 8px rgba(11,27,63,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 18px',
        marginBottom: 14,
      }}
    >
      <div style={{width: 74, height: 64, borderRadius: 16, background: '#FFF3EA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: DISPLAY_STACK, fontSize: 21, fontWeight: 800, color: '#C2410C'}}>{r.time}</div>
        <div style={{fontSize: 11.5, fontWeight: 700, color: A.main}}>{r.guests}</div>
      </div>
      <div style={{flex: 1}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{fontSize: 17, fontWeight: 800}}>{r.name}</span>
          <Tag tone="grey">{r.table}</Tag>
          {cancelled ? <Tag tone="grey">Cancelled</Tag> : <Tag tone="green">Confirmed</Tag>}
        </div>
        <div style={{fontSize: 14, color: '#6A7894', marginTop: 6}}>
          Date: <b style={{color: '#2A3550'}}>{r.date}</b> · Phone: <b style={{color: '#2A3550'}}>{r.phone}</b>
        </div>
      </div>
      {cancelled ? <Tag tone="green">{C.confirm}</Tag> : null}
      <span style={{fontSize: 14, fontWeight: 700, background: '#EEF1F6', padding: '8px 14px', borderRadius: 10}}>{C.seated}</span>
      <span style={{fontSize: 14, fontWeight: 700, color: '#DC2626', background: '#FDECEC', padding: '8px 14px', borderRadius: 10}}>{C.noShow}</span>
      <span style={{fontSize: 14, fontWeight: 700, color: '#A4AFC4', padding: '8px 6px'}}>{C.del}</span>
    </div>
  );
};

const TheBook: React.FC<{f: number}> = ({f}) => {
  const rowIn = sp(f, B.newRow, SPRINGS.snappy);
  const glow = sp(f, B.newRow, SPRINGS.smooth);
  return (
    <>
      <div style={{position: 'absolute', left: CONTENT_X, top: 30, display: 'flex', gap: 18}}>
        <div style={{width: 58, height: 58, borderRadius: 18, background: `linear-gradient(180deg, #FF8A3D, ${A.main})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 24px ${alpha(A.main, 0.35)}`}}>
          <IconCard size={26} color="#fff" />
        </div>
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', color: A.text}}>
            <span style={{width: 30, height: 1.5, background: A.main}} />
            {C.bookEyebrow}
          </div>
          <div style={{fontFamily: DISPLAY_STACK, fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 6}}>{C.bookTitle}</div>
          <div style={{fontSize: 15.5, color: '#5B6782', marginTop: 6}}>{C.bookSub}</div>
        </div>
      </div>
      <div style={{position: 'absolute', right: 40, top: 40, display: 'flex', gap: 10}}>
        <Btn primary>{C.printSheet}</Btn>
        <Btn>{C.exportCsv}</Btn>
      </div>
      <div style={{position: 'absolute', right: 40, top: 98, display: 'flex', background: '#E9EEF5', borderRadius: 14, padding: 4}}>
        <div style={{padding: '8px 14px', borderRadius: 11, background: '#fff', fontSize: 14, fontWeight: 800, color: A.text}}>
          {C.upcoming} <span style={{background: A.soft, borderRadius: 8, padding: '1px 7px', marginLeft: 4}}>{4 + (f >= B.newRow ? 1 : 0)}</span>
        </div>
        <div style={{padding: '8px 14px', fontSize: 14, fontWeight: 700, color: '#3B4660'}}>
          {C.showAll} <span style={{background: '#D5DCE7', borderRadius: 8, padding: '1px 7px', marginLeft: 4}}>{22 + (f >= B.newRow ? 1 : 0)}</span>
        </div>
      </div>
      <Card x={CONTENT_X} y={170} w={CONTENT_W} h={104}>
        <div style={{display: 'flex', gap: 22, padding: '18px 24px', alignItems: 'flex-end'}}>
          {[
            ['FILTER DATE', '03/10/2026'],
            ['STATUS', 'All Statuses'],
            ['SEARCH', 'Guest name, phone, table…'],
          ].map(([l, v]) => (
            <div key={l}>
              <div style={{fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: '#5B6782'}}>{l}</div>
              <div style={{marginTop: 8, width: 230, height: 44, borderRadius: 14, border: `1px solid ${COLORS.dBorder}`, background: '#FAFBFE', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 14.5, color: l === 'SEARCH' ? '#A4AFC4' : '#2A3550'}}>{v}</div>
            </div>
          ))}
          <div style={{marginLeft: 'auto', paddingBottom: 4}}>
            <div style={{fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: '#5B6782'}}>TOTAL GUESTS</div>
            <div style={{fontFamily: DISPLAY_STACK, fontSize: 28, fontWeight: 800}}>
              {20 + (f >= B.newRow ? 4 : 0)} <span style={{fontSize: 13, color: '#6A7894', fontWeight: 600}}>covers</span>
            </div>
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: CONTENT_X, top: 294, width: CONTENT_W}}>
        <div style={{height: 110 * rowIn, overflow: 'hidden', opacity: rowIn}}>
          <ResRow r={C.newRes} hl={glow} />
        </div>
        {C.reservations.map((r) => (
          <ResRow key={r.name} r={r} />
        ))}
      </div>
    </>
  );
};

export const RESTO_CURSOR = {
  path: [
    {f: 30, x: 1000, y: 700},
    {f: 52, x: 130, y: 231},
    {f: 62, x: 130, y: 231},
    {f: 90, x: 900, y: 520},
    {f: 150, x: 960, y: 560},
  ],
  clicks: [B.navClick],
};

/** Rebuilt restaurant dashboard: Tonight (ring + floor plan), then The Book. */
export const RestaurantDashboard: React.FC = () => {
  const f = useCurrentFrame();
  const swap = lerp(f, [B.pageSwap, B.pageSwap + 10], [0, 1], EASE_OUT);
  return (
    <DashShell groups={C.groups} active={f >= B.navClick + 2 ? 'Reservations' : 'Tonight'} accent="orange">
      {swap < 1 ? (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - swap}}>
          <Tonight f={f} />
        </div>
      ) : null}
      {swap > 0 ? (
        <div style={{position: 'absolute', inset: 0, opacity: swap, transform: `translateY(${(1 - swap) * 24}px)`}}>
          <TheBook f={f} />
        </div>
      ) : null}
      <Cursor path={RESTO_CURSOR.path} clicks={RESTO_CURSOR.clicks} size={30} appear={26} />
    </DashShell>
  );
};
