import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {DMItem, DMThread, nodeItem, textItem, typingItem} from '../components/DMThread';
import {FloorPlan, PLAN_H, PLAN_W, TableState, tableCenter} from '../components/FloorPlan';
import {IconCalendar, IconCheck, IconClock, IconLock, IconUsers} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {PhoneFrame, SCREEN_H, SCREEN_W} from '../components/PhoneFrame';
import {Tap} from '../components/Pointer';
import {DISPLAY_STACK, UI_STACK} from '../fonts';
import {EASE_IN_OUT, lerp, SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.restoDM;
const C = COPY.restoDM;
const T = 'messenger' as const;

const LINK_H = 196;

const LinkPreview: React.FC = () => (
  <div style={{width: 262, height: LINK_H, borderRadius: 18, overflow: 'hidden', background: COLORS.msIn, fontFamily: UI_STACK}}>
    <div
      style={{
        height: 124,
        background: COLORS.venueAccent,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{position: 'absolute', inset: 0, opacity: 0.55}}>
        <FloorPlan width={262} accent={COLORS.venueAccent} states={{}} radius={0} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 12,
          bottom: 10,
          fontFamily: DISPLAY_STACK,
          fontWeight: 800,
          fontSize: 17,
          color: '#fff',
          textShadow: '0 2px 10px rgba(0,0,0,0.35)',
        }}
      >
        {C.venueName}
      </div>
    </div>
    <div style={{padding: '10px 13px'}}>
      <div style={{fontSize: 14.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{C.linkTitle}</div>
      <div style={{fontSize: 13, color: alpha('#FFFFFF', 0.55), marginTop: 3}}>{C.linkUrl}</div>
    </div>
  </div>
);

const items: DMItem[] = [
  nodeItem('stamp', 'center', 0, 22, () => (
    <div style={{fontFamily: UI_STACK, fontSize: 12.5, color: 'rgba(255,255,255,0.45)', fontWeight: 600}}>Aujourd’hui 18:31</div>
  )),
  textItem('c1', 'me', C.customer1, B.msgCustomer1, T),
  typingItem('t1', B.typing1[0], B.typing1[1], T),
  textItem('a1', 'them', C.ai1, B.msgAI1, T),
  nodeItem('link', 'them', B.link, LINK_H, () => <LinkPreview />),
];

const PLAN_TOP = 286;
const PLAN_X = 12;
const PLAN_DRAW_W = SCREEN_W - 24;
const K = PLAN_DRAW_W / PLAN_W;

/** In-app browser: dar-yasmine.merchati.tn booking page with the live floor plan. */
const BookingSite: React.FC = () => {
  const f = useCurrentFrame();
  const open = lerp(f, [B.siteOpen[0], B.siteOpen[1]], [0, 1], EASE_IN_OUT);
  const selected = f >= B.tapTable;
  const sheet = sp(f, B.sheet, SPRINGS.snappy);
  const done = sp(f, B.confirmed, SPRINGS.snappy);
  const pulse = selected ? Math.max(0, 1 - (f - B.tapTable) / 30) : 0;
  const states: Record<string, TableState> = {
    T02: 'taken',
    T03: 'taken',
    T05: 'taken',
    T09: 'taken',
    T11: 'taken',
    T14: 'taken',
    T16: 'taken',
    T20: 'taken',
    T19: selected ? 'selected' : 'free',
  };
  if (open <= 0) return null;
  const sheetH = 230 + 70 * done;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translateY(${(1 - open) * SCREEN_H}px)`,
        background: COLORS.venueBg,
        fontFamily: UI_STACK,
        color: COLORS.venueInk,
        zIndex: 20,
        boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* URL bar */}
      <div style={{position: 'absolute', left: 0, top: 54, width: SCREEN_W, height: 50, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, boxSizing: 'border-box'}}>
        <div style={{fontSize: 15, fontWeight: 600, color: COLORS.venueAccent, width: 34}}>{C.siteClose}</div>
        <div
          style={{
            flex: 1,
            height: 34,
            borderRadius: 11,
            background: '#EFE8DD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13.5,
            fontWeight: 600,
            color: COLORS.venueInk,
          }}
        >
          <IconLock size={12} color={COLORS.venueMuted} stroke={2.4} />
          {C.siteUrl}
        </div>
        <div style={{width: 34}} />
      </div>
      {/* Venue header */}
      <div style={{position: 'absolute', left: 20, top: 118}}>
        <div style={{fontFamily: DISPLAY_STACK, fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em'}}>{C.venueName}</div>
        <div style={{fontSize: 13.5, color: COLORS.venueMuted, marginTop: 2}}>{C.venueTagline}</div>
      </div>
      <div style={{position: 'absolute', left: 20, top: 190, display: 'flex', gap: 8}}>
        {[IconCalendar, IconClock, IconUsers].map((Icon, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              height: 34,
              padding: '0 12px',
              borderRadius: 17,
              background: '#fff',
              border: `1px solid ${COLORS.venueLine}`,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Icon size={15} color={COLORS.venueAccent} stroke={2.2} />
            {C.siteMeta[i]}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 20, top: 248, fontSize: 17, fontWeight: 700}}>{C.siteTitle}</div>
      <div style={{position: 'absolute', left: PLAN_X, top: PLAN_TOP}}>
        <FloorPlan width={PLAN_DRAW_W} accent={COLORS.venueAccent} states={states} pulse={{id: 'T19', p: pulse}} radius={14} />
      </div>
      <div style={{position: 'absolute', left: 20, top: PLAN_TOP + PLAN_H * K + 12, display: 'flex', gap: 18, fontSize: 12.5, color: COLORS.venueMuted, fontWeight: 600}}>
        <span style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <span style={{width: 12, height: 12, borderRadius: 4, border: `1.5px solid ${COLORS.venueAccent}`, background: '#fff'}} />
          {C.free}
        </span>
        <span style={{display: 'flex', alignItems: 'center', gap: 6}}>
          <span style={{width: 12, height: 12, borderRadius: 4, background: 'rgba(20,22,28,0.62)'}} />
          {C.taken}
        </span>
      </div>
      {/* Bottom sheet */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: SCREEN_H - sheetH * sheet,
          width: SCREEN_W,
          height: sheetH + 40,
          borderRadius: '28px 28px 0 0',
          background: '#fff',
          boxShadow: '0 -16px 50px rgba(31,42,46,0.18)',
          padding: '12px 22px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{width: 40, height: 5, borderRadius: 5, background: '#E2DCD2', margin: '0 auto 16px'}} />
        <div style={{opacity: 1 - done, position: 'absolute', left: 22, right: 22, top: 33}}>
          <div style={{fontSize: 20, fontWeight: 800, fontFamily: DISPLAY_STACK}}>{C.sheetTitle}</div>
          <div style={{fontSize: 14.5, color: COLORS.venueMuted, marginTop: 4}}>{C.sheetSub}</div>
          <div
            style={{
              marginTop: 20,
              height: 54,
              borderRadius: 16,
              background: COLORS.venueAccent,
              color: '#fff',
              fontSize: 16.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${1 - 0.05 * (sp(f, B.tapConfirm, SPRINGS.pop) - sp(f, B.tapConfirm + 4, SPRINGS.smooth))})`,
            }}
          >
            {C.sheetButton}
          </div>
        </div>
        <div style={{opacity: done, position: 'absolute', left: 22, right: 22, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${(1 - done) * 16}px)`}}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 64,
              background: COLORS.venueAccent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 0 ${10 * done}px ${alpha(COLORS.venueAccent, 0.12)}`,
              transform: `scale(${0.6 + 0.4 * done})`,
            }}
          >
            <IconCheck size={34} color="#fff" stroke={3} />
          </div>
          <div style={{fontSize: 21, fontWeight: 800, fontFamily: DISPLAY_STACK, marginTop: 16}}>{C.confirmedTitle}</div>
          <div style={{fontSize: 14.5, color: COLORS.venueMuted, marginTop: 6}}>{C.confirmedSub}</div>
        </div>
      </div>
    </div>
  );
};

export const S08RestoDM: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const phoneX = L.phoneCx - L.phoneW / 2;
  const light = f >= (B.siteOpen[0] + B.siteOpen[1]) / 2;
  // Tap targets in screen (logical) coordinates.
  const tableX = PLAN_X + tableCenter('T19').x * K;
  const tableY = PLAN_TOP + tableCenter('T19').y * K;

  return (
    <AbsoluteFill>
      <Background variant="calm" />
      <div style={{position: 'absolute', left: phoneX, top: L.phoneTop}}>
        <PhoneFrame width={L.phoneW} time="18:31" statusDark={light}>
          <DMThread
            theme={T}
            name={C.venueName}
            sub={C.venueSub}
            avatar={{initials: 'DY', bg: `linear-gradient(135deg, ${COLORS.venueAccent}, #2A9D8F)`}}
            items={items}
            composer={C.composer}
          >
            <BookingSite />
            <Tap x={180} y={350} at={B.tapLink} color="#FFFFFF" />
            <Tap x={tableX} y={tableY} at={B.tapTable} color={COLORS.venueAccent} />
            <Tap x={SCREEN_W / 2} y={SCREEN_H - 230 + 33 + 20 + 26 + 4 + 20 + 27} at={B.tapConfirm} color={COLORS.venueAccent} />
          </DMThread>
        </PhoneFrame>
      </div>
      <div style={{position: 'absolute', left: L.text.x, top: L.square ? L.H / 2 - 80 : L.text.y + 10}}>
        <KineticText lines={C.headline0} at={B.headline0} out={B.headline0Out} size={L.headlineSize} width={L.text.w} />
        <div style={{position: 'absolute', left: 0, top: 0}}>
          <KineticText lines={C.headline} at={B.headline} size={L.headlineSize} width={L.text.w} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
