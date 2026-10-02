import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {alpha, BEATS, COLORS} from '../config';
import {COPY} from '../copy';
import {Background} from '../components/Background';
import {KineticText} from '../components/KineticText';
import {SplitPanels} from '../components/SplitPanels';
import {lerp} from '../lib/anim';
import {useLayout} from '../layout';

const B = BEATS.split;

export const S02Split: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const zoom = lerp(f, [0, 164], [B.zoom[0], B.zoom[1]]);
  const area = L.square
    ? {x: 548, y: 36, w: L.W - 548 - 36, h: L.H - 72}
    : {x: 40, y: 470, w: L.W - 80, h: L.H - 470 - 40};
  const cx = area.x + area.w / 2;
  const cy = area.y + area.h / 2;

  return (
    <AbsoluteFill>
      <Background variant="chaos" intensity={1.1} />
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${cx}px ${cy}px`}}>
        <SplitPanels area={area} phases={B.phases} square={L.square} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: L.square
            ? `linear-gradient(90deg, ${alpha(COLORS.bg, 1)} 0%, ${alpha(COLORS.bg, 0.9)} 46%, transparent 52%)`
            : `linear-gradient(180deg, ${alpha(COLORS.bg, 1)} 0%, ${alpha(COLORS.bg, 0.9)} 22%, transparent 25%)`,
        }}
      />
      {L.square ? (
        <div style={{position: 'absolute', left: L.text.x, top: 0, height: L.H, width: L.text.w, display: 'flex', alignItems: 'center'}}>
          <div style={{position: 'relative', width: L.text.w}}>
            <KineticText lines={COPY.split.headline1} at={B.headline1} out={B.headline1Out} size={L.headlineSize} width={L.text.w} />
            <div style={{position: 'absolute', top: 0, left: 0}}>
              <KineticText lines={COPY.split.headline2} at={B.headline2} size={L.headlineSize} width={L.text.w} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: L.text.x, top: L.text.y + 20}}>
          <KineticText lines={COPY.split.headline1} at={B.headline1} out={B.headline1Out} size={L.headlineSize} width={L.text.w} />
          <div style={{position: 'absolute', top: 0, left: 0}}>
            <KineticText lines={COPY.split.headline2} at={B.headline2} size={L.headlineSize} width={L.text.w} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
