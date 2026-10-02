import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY} from '../copy';
import {DISPLAY_STACK} from '../fonts';
import {EASE_OUT, fmtNum, lerp, SPRINGS, sp} from '../lib/anim';
import {ACCENTS, Card, Chip, CONTENT_W, CONTENT_X, DashShell} from './DashShell';
import {Avatar} from './DMThread';
import {IconCheck, IconCheckDouble, IconChat, IconRefresh, IconSearch, IconSparkle, IconTrend, IconUsers} from './Icons';
import {Cursor} from './Pointer';

const B = BEATS.shopDash;
const C = COPY.shopDash;
const A = ACCENTS.blue;

// Delivered Orders geometry (dashboard coordinates)
const TABLE_Y = 268;
const HEAD_H = 56;
const ROW_H = 86;
const ACTION_H = 62;
const COLS = [26, 186, 342, 404, 500, 618, 812, 966];
const ACTIONS_X = 186;
const BTN_W = [176, 196, 148, 110];
const BTN_GAP = 12;
const btnX = (i: number) => CONTENT_X + ACTIONS_X + BTN_W.slice(0, i).reduce((a, b) => a + b + BTN_GAP, 0);
const ACTION_CY = TABLE_Y + HEAD_H + ROW_H + 6 + 20;
const NAV_DELIVERED_Y = 388 + 21;

export const SHOP_CURSOR = {
  path: [
    {f: 30, x: 900, y: 760},
    {f: 50, x: 130, y: NAV_DELIVERED_Y},
    {f: 58, x: 130, y: NAV_DELIVERED_Y},
    {f: 78, x: 700, y: 560},
    {f: 96, x: btnX(1) + BTN_W[1] / 2, y: ACTION_CY},
    {f: 106, x: btnX(1) + BTN_W[1] / 2, y: ACTION_CY},
    {f: 124, x: btnX(0) + BTN_W[0] / 2, y: ACTION_CY},
    {f: 134, x: btnX(0) + BTN_W[0] / 2, y: ACTION_CY},
    {f: 170, x: 760, y: 600},
  ],
  clicks: [B.navClick, B.confirmClick, B.deliveryClick],
};

const IconTile: React.FC<{bg: string; children: React.ReactNode; size?: number}> = ({bg, children, size = 52}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 8px 20px ${alpha('#0B1B3F', 0.12)}`,
    }}
  >
    {children}
  </div>
);

const KPI_STYLE = [
  {bg: 'linear-gradient(135deg, #FF8A1F, #F25C05)', glow: '#FFE7D2', icon: <IconTrend size={26} color="#fff" stroke={2.4} />},
  {bg: 'linear-gradient(135deg, #2F9BFF, #1565D8)', glow: '#DDEEFF', icon: <IconChat size={24} color="#fff" stroke={2.2} />},
  {bg: 'linear-gradient(135deg, #22D3EE, #0891B2)', glow: '#DDF7FC', icon: <IconUsers size={24} color="#fff" stroke={2.2} />},
  {bg: 'linear-gradient(135deg, #34D399, #059669)', glow: '#DDF7EA', icon: <IconSparkle size={22} color="#fff" />},
];

const Overview: React.FC<{f: number}> = ({f}) => {
  const count = lerp(f, [B.kpiCount[0], B.kpiCount[1]], [0, 1], EASE_OUT);
  const kpiW = (CONTENT_W - 3 * 18) / 4;
  const cap = C.capacity;
  return (
    <>
      <div style={{position: 'absolute', left: CONTENT_X, top: 30}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: A.soft, color: A.text, fontSize: 13, fontWeight: 800, letterSpacing: '0.06em'}}>
          <span style={{width: 7, height: 7, borderRadius: 7, background: A.main}} />
          OVERVIEW
        </div>
        <div style={{fontFamily: DISPLAY_STACK, fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 14}}>{C.welcome}</div>
        <div style={{fontSize: 17, color: '#5B6782', marginTop: 6}}>{C.welcomeSub}</div>
      </div>
      {/* AI message capacity */}
      <div
        style={{
          position: 'absolute',
          left: CONTENT_X,
          top: 160,
          width: CONTENT_W,
          height: 190,
          borderRadius: 30,
          background: 'linear-gradient(120deg, #0E1B3D 0%, #1A2C5C 60%, #22407E 100%)',
          boxShadow: `0 24px 50px ${alpha('#0E1B3D', 0.35)}`,
          color: '#fff',
          padding: '26px 30px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{display: 'inline-block', fontSize: 12, fontWeight: 800, color: '#9CC2FF', border: '1px solid rgba(156,194,255,0.4)', background: 'rgba(80,130,255,0.15)', padding: '4px 10px', borderRadius: 10}}>
          {cap.tier}
        </div>
        <div style={{fontFamily: DISPLAY_STACK, fontSize: 24, fontWeight: 800, marginTop: 12}}>
          {cap.title} <span style={{fontSize: 14, fontWeight: 600, opacity: 0.8}}>{cap.available}</span>
        </div>
        <div style={{fontSize: 14, opacity: 0.75, marginTop: 8, width: 520}}>{cap.note}</div>
        <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.12)'}}>
          <div style={{width: `${cap.progress * 100 * count}%`, height: 8, borderRadius: 8, background: `linear-gradient(90deg, ${COLORS.cyan}, #3BA0FF)`}} />
        </div>
        <div style={{position: 'absolute', right: 230, top: 34, width: 190, height: 96, borderRadius: 20, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(0,0,0,0.15)', display: 'flex', padding: '16px 18px', boxSizing: 'border-box', gap: 16}}>
          <div>
            <div style={{fontSize: 11, fontWeight: 800, opacity: 0.6}}>MONTHLY USED</div>
            <div style={{fontFamily: 'monospace', fontSize: 16, fontWeight: 700, marginTop: 8}}>{cap.used}</div>
          </div>
          <div style={{borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: 14}}>
            <div style={{fontSize: 11, fontWeight: 800, color: '#FFB547'}}>EXTRA</div>
            <div style={{fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#FFB547', marginTop: 8}}>{cap.extra}</div>
          </div>
        </div>
        <div style={{position: 'absolute', right: 30, top: 58, height: 48, padding: '0 20px', borderRadius: 24, background: 'linear-gradient(180deg, #FFA51F, #F27C05)', display: 'flex', alignItems: 'center', fontSize: 15, fontWeight: 800, boxShadow: '0 10px 24px rgba(242,124,5,0.4)'}}>
          {cap.button}
        </div>
      </div>
      {C.kpis.map((k, i) => {
        const p = sp(f, 4 + i * 4, SPRINGS.snappy);
        const st = KPI_STYLE[i];
        return (
          <Card
            key={k.label}
            x={CONTENT_X + i * (kpiW + 18)}
            y={370}
            w={kpiW}
            h={164}
            style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`, background: `radial-gradient(70% 60% at 100% 0%, ${st.glow} 0%, #FFFFFF 70%)`}}
          >
            <div style={{padding: '20px 22px'}}>
              <IconTile bg={st.bg}>{st.icon}</IconTile>
              <div style={{fontFamily: DISPLAY_STACK, fontSize: 32, fontWeight: 800, letterSpacing: '-0.01em', marginTop: 16, fontVariantNumeric: 'tabular-nums'}}>
                {fmtNum(k.value * count)}
                {k.suffix}
              </div>
              <div style={{fontSize: 15, color: '#5B6782', marginTop: 4}}>{k.label}</div>
            </div>
          </Card>
        );
      })}
      <Card x={CONTENT_X} y={554} w={660} h={320}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '22px 24px'}}>
          <IconTile bg="linear-gradient(135deg, #2DD4BF, #0D9488)" size={40}>
            <IconTrend size={20} color="#fff" stroke={2.4} />
          </IconTile>
          <span style={{fontFamily: DISPLAY_STACK, fontSize: 20, fontWeight: 700}}>{C.activityTitle}</span>
          <span style={{marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: A.text}}>{C.activityLink}</span>
        </div>
        {C.activity.map((a, i) => {
          const p = sp(f, 20 + i * 6, SPRINGS.snappy);
          return (
            <div key={a.name} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 24px', opacity: p, transform: `translateX(${(1 - p) * 20}px)`}}>
              <Avatar size={42} initials={a.name.split(' ').map((w) => w[0]).slice(0, 2).join('')} bg={['#7C3AED', '#0EA5E9', '#F97316'][i]} />
              <div style={{minWidth: 0}}>
                <div style={{fontSize: 15.5, fontWeight: 700}}>{a.name}</div>
                <div style={{fontSize: 14, color: '#6A7894', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 520}}>{a.text}</div>
              </div>
            </div>
          );
        })}
      </Card>
      <Card x={CONTENT_X + 680} y={554} w={CONTENT_W - 680} h={320}>
        <div style={{display: 'flex', gap: 14, padding: '22px 24px 10px'}}>
          <IconTile bg="linear-gradient(135deg, #FF6B4A, #E11D48)" size={40}>
            <IconSparkle size={18} color="#fff" />
          </IconTile>
          <div>
            <div style={{fontFamily: DISPLAY_STACK, fontSize: 20, fontWeight: 700}}>{C.radarTitle}</div>
            <div style={{fontSize: 13, color: '#6A7894', marginTop: 2}}>{C.radarSub}</div>
          </div>
        </div>
        {C.radar.map((r) => (
          <div key={r.product} style={{margin: '10px 24px 0', padding: '12px 14px', borderRadius: 14, background: '#FFF4EC', display: 'flex', justifyContent: 'space-between', fontSize: 14}}>
            <span style={{fontWeight: 600}}>{r.product}</span>
            <span style={{fontWeight: 800, color: '#E8590C'}}>{r.count}</span>
          </div>
        ))}
      </Card>
    </>
  );
};

const Delivered: React.FC<{f: number}> = ({f}) => {
  const rowIn = sp(f, B.newRow, SPRINGS.snappy);
  const confirmed = f >= B.confirmClick + 2;
  const delivery = f >= B.deliveryClick + 2;
  const rev = lerp(f, [B.revenue[0], B.revenue[1]], [C.totalRevenueFrom, C.totalRevenueTo], EASE_OUT);
  const revPop = sp(f, B.revenue[0], SPRINGS.pop) - sp(f, B.revenue[0] + 10, SPRINGS.smooth);
  const toast = sp(f, B.toast, SPRINGS.snappy) - sp(f, B.toast + 60, SPRINGS.smooth);
  const glow = 1 - lerp(f, [B.deliveryClick + 20, B.deliveryClick + 50], [0, 0.6]);
  const statusChip = (st: string) =>
    st === 'Delivered' ? <Chip tone="green">{st}</Chip> : st === 'Pending' ? <Chip tone="amber">{st}</Chip> : st === 'In delivery' ? <Chip tone="blue">{st}</Chip> : st === 'Confirmed' ? <Chip tone="green">{st}</Chip> : <Chip tone="blue">{st}</Chip>;

  const Row: React.FC<{r: (typeof C.rows)[number] | typeof C.newRow; status: string; hl?: boolean}> = ({r, status, hl}) => (
    <div style={{height: ROW_H, position: 'relative', fontSize: 15}}>
      <div style={{position: 'absolute', left: COLS[0], top: 22}}>
        <div style={{fontWeight: 800}}>{r.name}</div>
        <div style={{fontSize: 12, color: '#8A97AE', marginTop: 3}}>{r.id}</div>
      </div>
      <div style={{position: 'absolute', left: COLS[1], top: 22, width: 150}}>
        {r.product}
        <div style={{fontSize: 13, color: '#6A7894'}}>({r.size !== '—' ? `${r.size}/` : ''}{r.color})</div>
      </div>
      <div style={{position: 'absolute', left: COLS[2], top: 30}}>
        {r.size === '—' ? <span style={{color: '#A4AFC4'}}>—</span> : <span style={{fontSize: 12.5, fontWeight: 700, background: '#EEF1F6', padding: '3px 8px', borderRadius: 6}}>{r.size}</span>}
      </div>
      <div style={{position: 'absolute', left: COLS[3], top: 30, display: 'flex', alignItems: 'center', gap: 7, color: '#3B4660'}}>
        <span style={{width: 13, height: 13, borderRadius: 13, background: r.dot, border: '1px solid #C9D2E0'}} />
        {r.color}
      </div>
      <div style={{position: 'absolute', left: COLS[4], top: 18}}>
        <div style={{fontWeight: 800}}>{r.price} TND</div>
        <div style={{fontSize: 11.5, color: '#8A97AE', marginTop: 2, width: 100}}>{C.incl}</div>
      </div>
      <div style={{position: 'absolute', left: COLS[5], top: 24}}>
        <div style={{color: '#3B4660'}}>{r.phone}</div>
        <div style={{fontSize: 12.5, color: '#8A97AE', marginTop: 2}}>{r.email}</div>
      </div>
      <div style={{position: 'absolute', left: COLS[6], top: 32, color: '#3B4660'}}>{r.address}</div>
      <div style={{position: 'absolute', left: COLS[7], top: 28}}>{statusChip(status)}</div>
      {hl ? null : <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: COLORS.dBorder}} />}
    </div>
  );

  return (
    <>
      <div style={{position: 'absolute', left: CONTENT_X, top: 32}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', color: A.text}}>
          <span style={{width: 34, height: 1.5, background: '#8A97AE'}} />
          {C.fulfillment}
        </div>
        <div style={{fontFamily: DISPLAY_STACK, fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 8}}>{C.tableTitle}</div>
        <div style={{fontSize: 16, color: '#5B6782', marginTop: 6}}>{C.tableSub}</div>
      </div>
      <div style={{position: 'absolute', left: CONTENT_X + CONTENT_W - 300, top: 50, width: 300, height: 48, borderRadius: 14, background: '#fff', border: `1px solid ${COLORS.dBorder}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', boxSizing: 'border-box', color: '#8A97AE', fontSize: 15}}>
        <IconSearch size={18} color="#8A97AE" />
        {C.search}
      </div>
      {[
        {label: C.totalRevenueLabel, value: `${fmtNum(rev)}.00 TND`, bg: 'linear-gradient(135deg, #34D399, #059669)', icon: <IconTrend size={26} color="#fff" stroke={2.4} />, pop: revPop},
        {label: C.fulfilledLabel, value: `${C.fulfilledFrom + (delivery ? 1 : 0)} Orders`, bg: 'linear-gradient(135deg, #2F9BFF, #1565D8)', icon: <IconCheck size={26} color="#fff" stroke={2.6} />, pop: 0},
      ].map((c, i) => (
        <Card key={c.label} x={CONTENT_X + i * ((CONTENT_W + 18) / 2)} y={142} w={(CONTENT_W - 18) / 2} h={100} style={{transform: `scale(${1 + c.pop * 0.03})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px', height: '100%'}}>
            <IconTile bg={c.bg} size={54}>
              {c.icon}
            </IconTile>
            <div>
              <div style={{fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: '#6A7894'}}>{c.label}</div>
              <div style={{fontFamily: DISPLAY_STACK, fontSize: 30, fontWeight: 800, marginTop: 2, fontVariantNumeric: 'tabular-nums'}}>{c.value}</div>
            </div>
          </div>
        </Card>
      ))}
      <Card x={CONTENT_X} y={TABLE_Y} w={CONTENT_W} h={620}>
        <div style={{height: HEAD_H, position: 'relative', borderBottom: `1px solid ${COLORS.dBorder}`, background: '#FAFBFE', fontSize: 12.5, fontWeight: 800, letterSpacing: '0.05em', color: '#7B879C'}}>
          {C.columns.map((c, i) => (
            <span key={c} style={{position: 'absolute', left: COLS[i], top: 21}}>
              {c}
            </span>
          ))}
        </div>
        <div
          style={{
            height: (ROW_H + ACTION_H) * rowIn,
            overflow: 'hidden',
            opacity: rowIn,
            background: alpha(A.main, 0.05 * glow),
            boxShadow: `inset 4px 0 0 ${alpha(A.main, glow)}`,
            borderBottom: `1px solid ${COLORS.dBorder}`,
            position: 'relative',
          }}
        >
          <Row r={C.newRow} status={delivery ? C.statusDelivery : confirmed ? C.statusConfirmed : C.statusNew} hl />
          <div style={{height: ACTION_H, position: 'relative'}}>
            {C.actions.map((a, i) => {
              const done = (i === 1 && confirmed) || (i === 0 && delivery);
              const press =
                i === 1 ? sp(f, B.confirmClick, SPRINGS.pop) - sp(f, B.confirmClick + 4, SPRINGS.smooth) : i === 0 ? sp(f, B.deliveryClick, SPRINGS.pop) - sp(f, B.deliveryClick + 4, SPRINGS.smooth) : 0;
              const tone = [A.main, COLORS.dGreen, COLORS.dAmber, COLORS.dRed][i];
              const primary = i === 0;
              return (
                <div
                  key={a}
                  style={{
                    position: 'absolute',
                    left: btnX(i) - CONTENT_X,
                    top: 6,
                    width: BTN_W[i],
                    height: 40,
                    borderRadius: 12,
                    background: done ? tone : primary ? A.main : '#fff',
                    border: `1.5px solid ${done || primary ? tone : alpha(tone, 0.35)}`,
                    color: done || primary ? '#fff' : tone,
                    fontSize: 13.5,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxSizing: 'border-box',
                    transform: `scale(${1 - press * 0.06})`,
                    opacity: delivery && !done && i > 1 ? 0.45 : 1,
                  }}
                >
                  {done ? <IconCheck size={15} color="#fff" stroke={3} /> : null}
                  {a}
                </div>
              );
            })}
          </div>
        </div>
        {C.rows.map((r) => (
          <Row key={r.id} r={r} status={r.status} />
        ))}
      </Card>
      <div
        style={{
          position: 'absolute',
          left: CONTENT_X + CONTENT_W - 300,
          top: 820,
          width: 280,
          height: 52,
          borderRadius: 14,
          background: COLORS.navy,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          boxSizing: 'border-box',
          fontSize: 14.5,
          fontWeight: 600,
          opacity: Math.max(0, toast),
          transform: `translateY(${(1 - Math.max(0, toast)) * 20}px)`,
          boxShadow: `0 16px 40px ${alpha(COLORS.navy, 0.35)}`,
        }}
      >
        <IconRefresh size={18} color={COLORS.cyan} />
        {C.toast}
        <IconCheckDouble size={18} color={COLORS.greenSoft} stroke={2.6} style={{marginLeft: 'auto'}} />
      </div>
    </>
  );
};

/** Rebuilt shop dashboard: Overview, then Delivered Products with one-tap actions. */
export const ShopDashboard: React.FC = () => {
  const f = useCurrentFrame();
  const swap = lerp(f, [B.pageSwap, B.pageSwap + 10], [0, 1], EASE_OUT);
  return (
    <DashShell groups={C.groups} active={f >= B.navClick + 2 ? 'Delivered Products' : 'Dashboard'} accent="blue">
      {swap < 1 ? (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - swap, transform: `translateY(${-swap * 20}px)`}}>
          <Overview f={f} />
        </div>
      ) : null}
      {swap > 0 ? (
        <div style={{position: 'absolute', inset: 0, opacity: swap, transform: `translateY(${(1 - swap) * 24}px)`}}>
          <Delivered f={f} />
        </div>
      ) : null}
      <Cursor path={SHOP_CURSOR.path} clicks={SHOP_CURSOR.clicks} size={30} appear={28} />
    </DashShell>
  );
};
