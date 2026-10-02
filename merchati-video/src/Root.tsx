import React from 'react';
import {Composition} from 'remotion';
import {FPS, TOTAL_FRAMES} from './config';
import {MerchatiVideo} from './Video';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Merchati9x16" component={MerchatiVideo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Merchati1x1" component={MerchatiVideo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1080} />
  </>
);
