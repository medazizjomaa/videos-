import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, COLORS, GRADIENTS} from '../config';
import {COPY} from '../copy';
import {UI_STACK} from '../fonts';
import {lerp} from '../lib/anim';
import {IconPause, IconPlay, IconSparkle} from './Icons';

export const VOICE_NOTE_H = 104;
const BARS = [6, 10, 15, 9, 18, 22, 13, 8, 16, 24, 19, 11, 7, 14, 20, 12, 9, 17, 23, 15, 8, 12, 18, 10, 6, 9];

/** Outgoing voice note with playback progress, plus the AI transcription underneath. */
export const VoiceNote: React.FC<{play: readonly [number, number]; transcriptAt: number}> = ({play, transcriptAt}) => {
  const f = useCurrentFrame();
  const prog = lerp(f, [play[0], play[1]], [0, 1]);
  const playing = f >= play[0] && f < play[1];
  const tp = lerp(f, [transcriptAt, transcriptAt + 10], [0, 1]);
  const chars = Math.round(lerp(f, [transcriptAt + 4, transcriptAt + 22], [0, COPY.shopDM.transcript.length]));
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontFamily: UI_STACK}}>
      <div
        style={{
          width: 236,
          height: 46,
          borderRadius: 23,
          background: GRADIENTS.igOut,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px 0 12px',
          boxSizing: 'border-box',
          gap: 10,
        }}
      >
        {playing ? <IconPause size={18} color="#fff" /> : <IconPlay size={18} color="#fff" />}
        <div style={{display: 'flex', alignItems: 'center', gap: 2.5, flex: 1, height: 26}}>
          {BARS.map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: i / BARS.length <= prog ? '#fff' : alpha('#FFFFFF', 0.45),
              }}
            />
          ))}
        </div>
        <span style={{fontSize: 13, color: '#fff', fontVariantNumeric: 'tabular-nums'}}>{COPY.shopDM.voiceDuration}</span>
      </div>
      <div
        style={{
          marginTop: 8,
          width: 236,
          opacity: tp,
          transform: `translateY(${(1 - tp) * 6}px)`,
          borderRadius: 14,
          border: `1px solid ${alpha(COLORS.cyan, 0.35)}`,
          background: alpha(COLORS.blue, 0.14),
          padding: '7px 11px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: COLORS.cyan, letterSpacing: '0.03em'}}>
          <IconSparkle size={11} color={COLORS.cyan} />
          {COPY.shopDM.transcriptLabel}
        </div>
        <div style={{fontSize: 13.5, color: '#fff', marginTop: 3, whiteSpace: 'nowrap'}}>
          {COPY.shopDM.transcript.slice(0, chars)}
        </div>
      </div>
    </div>
  );
};
