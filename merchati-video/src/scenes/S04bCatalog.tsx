import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {ConvertyIcon, InstagramIcon, MessengerIcon, PixelIcon, ShopifyIcon, TelegramIcon} from '../components/BrandIcons';
import {IconCheck} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {DISPLAY_STACK, UI_STACK} from '../fonts';
import {EASE_IN_OUT, EASE_OUT, lerp, SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.catalog;

// Card design space; scaled to fit each format.
const DW = 520;
const DH = 540;
const BAR = 38;
const CX = DW / 2;
const CY = BAR + (DH - BAR) / 2 - 4;

type Node = {key: string; label: string; Icon: React.FC<{size: number}>; dx: number; dy: number; role: 'source' | 'channel'};

// Same arrangement as the merchati.tn e-commerce card.
const NODES: Node[] = [
  {key: 'converty', label: 'Converty', Icon: ConvertyIcon, dx: 0, dy: -172, role: 'source'},
  {key: 'instagram', label: 'Instagram', Icon: InstagramIcon, dx: 170, dy: -128, role: 'channel'},
  {key: 'telegram', label: 'Telegram', Icon: TelegramIcon, dx: -168, dy: -112, role: 'channel'},
  {key: 'pixel', label: 'Pixel', Icon: PixelIcon, dx: -160, dy: 62, role: 'source'},
  {key: 'shopify', label: 'Shopify', Icon: ShopifyIcon, dx: 166, dy: 70, role: 'source'},
  {key: 'messenger', label: 'Messenger', Icon: MessengerIcon, dx: 0, dy: 182, role: 'channel'},
];

const PRODUCT_COLORS = [COLORS.dressBlack, COLORS.dressBeige, COLORS.dressBordeaux];

/** Point along the straight line between a node and the hub, trimmed so it starts/ends at their edges. */
const along = (n: Node, t: number) => {
  const len = Math.hypot(n.dx, n.dy);
  const from = 30 / len;
  const to = 1 - 52 / len;
  const k = from + (to - from) * t;
  return {x: CX + n.dx * (1 - k), y: CY + n.dy * (1 - k)};
};

const Chip: React.FC<{node: Node; f: number; at: number; done: number}> = ({node, f, at, done}) => {
  const p = sp(f, at, SPRINGS.pop);
  const bob = Math.sin((f + at * 7) / 22) * 3;
  const {Icon} = node;
  return (
    <div
      style={{
        position: 'absolute',
        left: CX + node.dx,
        top: CY + node.dy + bob,
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * p})`,
        opacity: Math.min(1, p * 1.5),
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '8px 15px 8px 9px',
        borderRadius: 40,
        background: '#FFFFFF',
        border: `1px solid ${alpha('#0B1B3F', 0.06)}`,
        boxShadow: `0 8px 22px ${alpha('#0B1B3F', 0.1)}${done > 0 ? `, 0 0 0 ${3 * done}px ${alpha(COLORS.blue, 0.18 * done)}` : ''}`,
        fontFamily: UI_STACK,
        fontWeight: 700,
        fontSize: 15,
        color: COLORS.text,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon size={28} />
      {node.label}
      {done > 0 ? (
        <div
          style={{
            position: 'absolute',
            right: -6,
            top: -6,
            width: 20,
            height: 20,
            borderRadius: 20,
            background: COLORS.green,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${done})`,
            boxShadow: `0 4px 10px ${alpha(COLORS.green, 0.4)}`,
          }}
        >
          <IconCheck size={13} color="#fff" stroke={3.2} />
        </div>
      ) : null}
    </div>
  );
};

const Card: React.FC<{f: number}> = ({f}) => {
  const card = sp(f, B.card, SPRINGS.smooth);
  const hub = sp(f, B.hub, SPRINGS.pop);
  const sources = NODES.filter((n) => n.role === 'source');
  const channels = NODES.filter((n) => n.role === 'channel');
  // hub pulses each time a wave arrives
  const pulse = (at: number) => Math.max(0, 1 - Math.abs(f - at) / 12);
  const glow = 0.55 + 0.25 * Math.sin(f / 14) + 0.6 * pulse(B.flowIn + B.flowDur) + 0.4 * pulse(B.flowOut);
  const lines = lerp(f, [B.chips + 10, B.chips + 34], [0, 1], EASE_OUT);

  return (
    <div
      style={{
        position: 'relative',
        width: DW,
        height: DH,
        borderRadius: 22,
        background: '#FFFFFF',
        border: `1px solid ${alpha(COLORS.blueSoft, 0.28)}`,
        boxShadow: `0 30px 70px ${alpha('#0B1B3F', 0.12)}, 0 0 90px ${alpha(COLORS.blue, 0.1)}`,
        overflow: 'hidden',
        opacity: Math.min(1, card * 1.4),
        transform: `translateY(${(1 - card) * 60}px) scale(${0.94 + 0.06 * card})`,
      }}
    >
      {/* window bar */}
      <div
        style={{
          height: BAR,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '0 16px',
          borderBottom: `1px solid ${COLORS.dBorder}`,
          background: COLORS.bgPanel2,
          fontFamily: UI_STACK,
          fontWeight: 600,
          fontSize: 13,
          color: COLORS.dFaint,
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{width: 10, height: 10, borderRadius: 10, background: c}} />
        ))}
        <div style={{marginLeft: 12}}>{COPY.catalog.window}</div>
      </div>

      {/* soft field + dashed orbits + connection lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(45% 40% at 50% ${(CY / DH) * 100}%, ${alpha(COLORS.blue, 0.06)} 0%, transparent 100%)`,
        }}
      />
      <svg width={DW} height={DH} style={{position: 'absolute', inset: 0}}>
        <g transform={`rotate(${f * 0.12} ${CX} ${CY})`} opacity={card}>
          <ellipse cx={CX} cy={CY} rx={128} ry={118} fill="none" stroke={alpha(COLORS.blueSoft, 0.45)} strokeWidth={1.3} strokeDasharray="3 6" />
        </g>
        <g transform={`rotate(${-f * 0.08} ${CX} ${CY})`} opacity={card}>
          <ellipse cx={CX} cy={CY + 6} rx={212} ry={206} fill="none" stroke={alpha(COLORS.blueSoft, 0.35)} strokeWidth={1.3} strokeDasharray="3 6" />
        </g>
        {NODES.map((n) => {
          const a = along(n, 0);
          const b = along(n, 1);
          return (
            <line
              key={n.key}
              x1={a.x}
              y1={a.y}
              x2={a.x + (b.x - a.x) * lines}
              y2={a.y + (b.y - a.y) * lines}
              stroke={alpha(n.role === 'source' ? COLORS.blue : COLORS.cyan, 0.35)}
              strokeWidth={1.6}
              strokeDasharray="2 5"
              strokeDashoffset={n.role === 'source' ? -f * 0.6 : f * 0.6}
            />
          );
        })}
      </svg>

      {/* products travelling: stores → hub */}
      {sources.flatMap((n, si) =>
        PRODUCT_COLORS.map((c, pi) => {
          const at = B.flowIn + si * 4 + pi * 6;
          const t = lerp(f, [at, at + B.flowDur - 8], [0, 1], EASE_IN_OUT);
          if (t <= 0 || t >= 1) return null;
          const pt = along(n, t);
          return (
            <div
              key={`${n.key}-${pi}`}
              style={{
                position: 'absolute',
                left: pt.x - 11,
                top: pt.y - 11,
                width: 22,
                height: 22,
                borderRadius: 7,
                background: '#FFFFFF',
                boxShadow: `0 4px 10px ${alpha('#0B1B3F', 0.18)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: Math.min(1, t * 6, (1 - t) * 6),
              }}
            >
              <div style={{width: 10, height: 14, borderRadius: '4px 4px 2px 2px', background: c}} />
            </div>
          );
        }),
      )}

      {/* replies travelling: hub → channels */}
      {channels.map((n, ci) => {
        const at = B.flowOut + ci * 5;
        const t = lerp(f, [at, at + B.flowDur - 6], [0, 1], EASE_IN_OUT);
        if (t <= 0 || t >= 1) return null;
        const pt = along(n, 1 - t);
        return (
          <div
            key={n.key}
            style={{
              position: 'absolute',
              left: pt.x - 9,
              top: pt.y - 9,
              width: 18,
              height: 18,
              borderRadius: 18,
              background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.cyan} 130%)`,
              boxShadow: `0 0 14px ${alpha(COLORS.cyan, 0.8)}`,
              opacity: Math.min(1, t * 6, (1 - t) * 6),
            }}
          />
        );
      })}

      {/* hub */}
      <div
        style={{
          position: 'absolute',
          left: CX,
          top: CY,
          transform: `translate(-50%, -50%) scale(${0.5 + 0.5 * hub + 0.05 * pulse(B.flowIn + B.flowDur)})`,
          opacity: Math.min(1, hub * 1.5),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 96,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `radial-gradient(circle, ${alpha(COLORS.cyan, 0.32 * glow)} 0%, ${alpha(COLORS.blue, 0.16 * glow)} 45%, transparent 72%)`,
          }}
        >
          <div style={{width: 80, height: 80, borderRadius: 80, overflow: 'hidden', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Img src={staticFile('brand/merchati-icon.png')} style={{width: 72, height: 72}} />
          </div>
        </div>
        <div style={{fontFamily: DISPLAY_STACK, fontWeight: 800, fontSize: 15, letterSpacing: '0.01em', color: COLORS.navy}}>
          {COPY.catalog.hub} <span style={{color: COLORS.blue}}>AI</span>
        </div>
      </div>

      {NODES.map((n, i) => {
        const arrive = n.role === 'channel' ? B.flowOut + NODES.filter((m) => m.role === 'channel').indexOf(n) * 5 + B.flowDur - 6 : B.flowIn + 4 * NODES.filter((m) => m.role === 'source').indexOf(n);
        const done = n.role === 'channel' ? sp(f, arrive, SPRINGS.pop) : 0;
        return <Chip key={n.key} node={n} f={f} at={B.chips + i * B.chipStagger} done={done} />;
      })}
    </div>
  );
};

const Pill: React.FC<{f: number; size: number}> = ({f, size}) => {
  const p = sp(f, B.pill, SPRINGS.snappy);
  return (
    <div
      style={{
        display: 'inline-block',
        padding: `${size * 0.32}px ${size * 0.8}px`,
        borderRadius: size * 2,
        background: `linear-gradient(90deg, ${COLORS.blue} 0%, #12C8F0 100%)`,
        color: '#fff',
        fontFamily: UI_STACK,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '0.08em',
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        boxShadow: `0 8px 20px ${alpha(COLORS.blue, 0.25)}`,
      }}
    >
      {COPY.catalog.pill}
    </div>
  );
};

const Bullets: React.FC<{f: number; size: number; width: number}> = ({f, size, width}) => (
  <div style={{width, display: 'flex', flexDirection: 'column', gap: size * 0.62}}>
    {COPY.catalog.bullets.map((b, i) => {
      const p = sp(f, B.bullets + i * B.bulletStagger, SPRINGS.snappy);
      return (
        <div
          key={b}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: size * 0.55,
            fontFamily: UI_STACK,
            fontWeight: 500,
            fontSize: size,
            lineHeight: 1.3,
            color: COLORS.textDim,
            opacity: Math.min(1, p * 1.4),
            transform: `translateX(${(1 - p) * -30}px)`,
          }}
        >
          <div style={{width: size * 0.3, height: size * 0.3, borderRadius: size, background: COLORS.blue, flexShrink: 0, transform: `translateY(-${size * 0.1}px)`}} />
          <span>{b}</span>
        </div>
      );
    })}
  </div>
);

export const S04bCatalog: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const drift = lerp(f, [0, BEATS.catalog.flowOut + 60], [1, 1.03]);

  if (L.square) {
    const cardW = 470;
    const k = cardW / DW;
    return (
      <AbsoluteFill>
        <Background variant="brand" />
        <div style={{position: 'absolute', left: 64, top: 150, width: 470}}>
          <Pill f={f} size={18} />
          <div style={{height: 26}} />
          <KineticText lines={COPY.catalog.headline} at={B.headline} size={52} width={470} />
          <div style={{height: 44}} />
          <Bullets f={f} size={23} width={440} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: L.W - cardW - 50,
            top: (L.H - DH * k) / 2,
            transform: `scale(${k})`,
            transformOrigin: 'top left',
          }}
        >
          <div style={{transform: `scale(${drift})`}}>
            <Card f={f} />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  const cardW = L.W - 2 * 70;
  const k = cardW / DW;
  return (
    <AbsoluteFill>
      <Background variant="brand" />
      <div style={{position: 'absolute', left: L.text.x, top: L.text.y - 20}}>
        <Pill f={f} size={26} />
        <div style={{height: 26}} />
        <KineticText lines={COPY.catalog.headline} at={B.headline} size={L.headlineSize} width={L.text.w} />
      </div>
      <div style={{position: 'absolute', left: 70, top: 480, transform: `scale(${k})`, transformOrigin: 'top left'}}>
        <div style={{transform: `scale(${drift})`}}>
          <Card f={f} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 480 + DH * k + 50}}>
        <Bullets f={f} size={31} width={L.W - 170} />
      </div>
    </AbsoluteFill>
  );
};
