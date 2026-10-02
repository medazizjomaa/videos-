import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {COLORS, SCENES, TRANSITION, VOICEOVER} from './config';
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

export const MerchatiVideo: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bgDeep}}>
    <Audio src={staticFile('audio/music.wav')} volume={VOICEOVER ? 0.42 : 0.8} />
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
