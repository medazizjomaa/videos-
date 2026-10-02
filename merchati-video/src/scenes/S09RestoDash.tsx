import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BEATS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {DashCamera} from '../components/DashShell';
import {KineticText} from '../components/KineticText';
import {RestaurantDashboard} from '../components/RestaurantDashboard';
import {TelegramAlert} from '../components/TelegramAlert';
import {EASE_OUT, keyframes, lerp, SPRINGS, sp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.restoDash;

export const S09RestoDash: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const cam = keyframes(f, B.camera.map((k) => ({...k})), ['x', 'y', 's']);
  const enter = lerp(f, [0, 26], [0.9, 1], EASE_OUT);
  const alert = sp(f, B.alert, SPRINGS.snappy);
  const alertW = L.square ? 380 : 560;
  return (
    <AbsoluteFill>
      <Background variant="brand" />
      <DashCamera cx={L.W / 2} cy={L.square ? 650 : 1170} base={L.square ? 0.68 : 0.9} x={L.square ? 720 + (cam.x - 720) * 0.3 : cam.x} y={cam.y} s={cam.s * enter}>
        <RestaurantDashboard />
      </DashCamera>
      <div
        style={{
          position: 'absolute',
          left: L.square ? L.W - alertW - 36 : (L.W - alertW) / 2,
          top: L.square ? 640 : 1440,
          opacity: alert,
          transform: `translateY(${(1 - alert) * 80}px) scale(${0.9 + 0.1 * alert})`,
        }}
      >
        <div style={{transform: `scale(${alertW / 380})`, transformOrigin: 'top left', width: 380}}>
          <TelegramAlert data={COPY.telegram.booking} width={380} floating glow={0.6} />
        </div>
      </div>
      <div style={{position: 'absolute', left: L.square ? 72 : L.text.x, top: L.square ? 64 : L.text.y + 10}}>
        <KineticText lines={COPY.restoDash.headline} at={B.headline} size={L.square ? 64 : L.headlineSize} width={L.square ? 900 : L.text.w} />
      </div>
    </AbsoluteFill>
  );
};
