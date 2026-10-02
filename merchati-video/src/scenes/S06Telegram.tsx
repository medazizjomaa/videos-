import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {IconChevronLeft} from '../components/Icons';
import {KineticText} from '../components/KineticText';
import {LogoMark} from '../components/Logo';
import {NotificationCard, NOTIF_W} from '../components/Notification';
import {PhoneFrame, SCREEN_W} from '../components/PhoneFrame';
import {TelegramAlert} from '../components/TelegramAlert';
import {UI_STACK} from '../fonts';
import {SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.telegram;
const C = COPY.telegram;

const TelegramChat: React.FC = () => {
  const f = useCurrentFrame();
  const p = sp(f, B.bubble, SPRINGS.snappy);
  const glow = Math.max(0, p - sp(f, B.bubble + 30, SPRINGS.soft) * 0.7);
  return (
    <div style={{position: 'absolute', inset: 0, background: COLORS.tgBg, fontFamily: UI_STACK, color: '#0F1222'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(90% 50% at 50% 100%, ${alpha(COLORS.tgAccent, 0.12)} 0%, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SCREEN_W,
          height: 112,
          background: COLORS.tgHeader,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 14px 12px 6px',
          boxSizing: 'border-box',
          gap: 8,
        }}
      >
        <IconChevronLeft size={28} color={COLORS.tgAccent} stroke={2.4} />
        <div style={{flex: 1}}>
          <div style={{fontWeight: 700, fontSize: 16.5}}>{C.chatName}</div>
          <div style={{fontSize: 13, color: alpha('#000000', 0.45)}}>{C.chatSub}</div>
        </div>
        <div style={{width: 40, height: 40, borderRadius: 40, overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <LogoMark size={40} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 12, right: 12, bottom: 96, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start'}}>
        <div style={{alignSelf: 'center', fontSize: 12.5, fontWeight: 600, color: '#fff', background: alpha('#4A6A85', 0.45), padding: '4px 10px', borderRadius: 12}}>
          Aujourd’hui
        </div>
        <div style={{background: COLORS.tgBubble, borderRadius: 16, padding: '9px 14px', fontSize: 14.5, lineHeight: '21px', whiteSpace: 'pre', opacity: 0.55}}>
          {C.olderAlert}
        </div>
        <div style={{opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p})`, transformOrigin: 'bottom left'}}>
          <TelegramAlert data={C.order} width={330} glow={glow} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: SCREEN_W,
          height: 84,
          background: COLORS.tgHeader,
          display: 'flex',
          alignItems: 'flex-start',
          padding: '10px 14px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{flex: 1, height: 38, borderRadius: 19, background: '#F1F3F5', color: alpha('#000000', 0.4), fontSize: 15.5, display: 'flex', alignItems: 'center', padding: '0 14px'}}>
          Message
        </div>
      </div>
    </div>
  );
};

export const S06Telegram: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const banner = sp(f, B.banner, SPRINGS.snappy) - sp(f, B.bannerOut, SPRINGS.smooth);
  const phoneX = L.phoneCx - L.phoneW / 2;
  const overlay = (
    <div
      style={{
        position: 'absolute',
        left: (SCREEN_W - NOTIF_W) / 2,
        top: 58 + (banner - 1) * 120,
        opacity: Math.max(0, banner),
        zIndex: 80,
      }}
    >
      <NotificationCard app="tg" title={C.bannerTitle} body={C.bannerBody} bg="rgba(255,255,255,0.98)" />
    </div>
  );
  return (
    <AbsoluteFill>
      <Background variant="calm" intensity={0.9} />
      <div style={{position: 'absolute', left: phoneX, top: L.phoneTop}}>
        <PhoneFrame width={L.phoneW} time="20:14" overlay={overlay} statusDark>
          <TelegramChat />
        </PhoneFrame>
      </div>
      <div
        style={{
          position: 'absolute',
          left: L.text.x,
          top: L.square ? L.H / 2 - 80 : L.text.y + 10,
        }}
      >
        <KineticText lines={C.headline} at={B.headline} size={L.headlineSize} width={L.text.w} />
      </div>
    </AbsoluteFill>
  );
};
