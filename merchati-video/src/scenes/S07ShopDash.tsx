import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BEATS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {DashCamera} from '../components/DashShell';
import {KineticText} from '../components/KineticText';
import {ShopDashboard} from '../components/ShopDashboard';
import {keyframes, lerp, EASE_OUT} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.shopDash;

export const S07ShopDash: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const cam = keyframes(f, B.camera.map((k) => ({...k})), ['x', 'y', 's']);
  const tilt = lerp(f, [0, 34], [16, 0], EASE_OUT);
  const enter = lerp(f, [0, 30], [0.86, 1], EASE_OUT);
  return (
    <AbsoluteFill>
      <Background variant="brand" />
      <DashCamera
        cx={L.W / 2}
        cy={L.square ? 650 : 1090}
        base={L.square ? 0.7 : 0.95}
        x={L.square ? 720 + (cam.x - 720) * 0.3 : cam.x}
        y={cam.y}
        s={cam.s * enter}
        tilt={tilt}
      >
        <ShopDashboard />
      </DashCamera>
      <div style={{position: 'absolute', left: L.square ? 72 : L.text.x, top: L.square ? 64 : L.text.y + 10}}>
        <KineticText lines={COPY.shopDash.headline} at={B.headline} size={L.square ? 64 : L.headlineSize} width={L.square ? 900 : L.text.w} />
      </div>
    </AbsoluteFill>
  );
};
