import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {COLORS, FPS, SCENES, TRANSITION, VOICEOVER} from './config';
import {VO_SEGMENTS} from './voiceoverSegments';
import {ensureFonts} from './fonts';
import {Enter, SceneWrap} from './components/SceneWrap';
import {S01Overload} from './scenes/S01Overload';
import {S02Split} from './scenes/S02Split';
import {S03Consequences} from './scenes/S03Consequences';
import {S04Reveal} from './scenes/S04Reveal';
import {S05ShopDM} from './scenes/S05ShopDM';
import {S06Telegram} from './scenes/S06Telegram';
import {S07ShopDash} from './scenes/S07ShopDash';
import {S08RestoDM} from './scenes/S08RestoDM';
import {S09RestoDash} from './scenes/S09RestoDash';
import {S10Highlights} from './scenes/S10Highlights';
import {S11CTA} from './scenes/S11CTA';
import {S12Pricing} from './scenes/S12Pricing';

ensureFonts();

const TIMELINE: [keyof typeof SCENES, React.FC, Enter][] = [
  ['overload', S01Overload, 'none'],
  ['split', S02Split, 'zoom'],
  ['consequences', S03Consequences, 'wipeUp'],
  ['reveal', S04Reveal, 'none'],
  ['shopDM', S05ShopDM, 'iris'],
  ['telegram', S06Telegram, 'wipeLeft'],
  ['shopDash', S07ShopDash, 'wipeUp'],
  ['restoDM', S08RestoDM, 'iris'],
  ['restoDash', S09RestoDash, 'wipeLeft'],
  ['highlights', S10Highlights, 'zoom'],
  ['pricing', S12Pricing, 'wipeUp'],
  ['cta', S11CTA, 'iris'],
];

// Music ducks smoothly (~0.25 s ramps) under each voice-over line.
const musicVolume = (f: number) => {
  if (!VOICEOVER) return 0.8;
  const t = f / FPS;
  let duck = 0;
  for (const [a, b] of VO_SEGMENTS) {
    const inR = Math.min(1, Math.max(0, (t - (a - 0.25)) / 0.25));
    const outR = Math.min(1, Math.max(0, ((b + 0.35) - t) / 0.35));
    duck = Math.max(duck, Math.min(inR, outR));
  }
  return 0.78 - 0.5 * duck;
};

export const MerchatiVideo: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bgDeep}}>
    <Audio src={staticFile('audio/music.wav')} volume={musicVolume} />
    {VOICEOVER ? <Audio src={staticFile('audio/voiceover.wav')} volume={1} /> : null}
    {TIMELINE.map(([key, Scene, enter]) => (
      <Sequence key={key} name={key} from={SCENES[key].from} durationInFrames={SCENES[key].dur + TRANSITION}>
        <SceneWrap enter={enter}>
          <Scene />
        </SceneWrap>
      </Sequence>
    ))}
  </AbsoluteFill>
);
