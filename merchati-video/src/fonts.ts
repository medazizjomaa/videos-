import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {FONTS} from './config';

const faces: {family: string; file: string; weight: string}[] = [
  ...['400', '500', '600', '700', '800'].map((w) => ({
    family: FONTS.ui,
    file: `fonts/inter-latin-${w}-normal.woff2`,
    weight: w,
  })),
  ...['500', '600', '700', '800'].map((w) => ({
    family: FONTS.display,
    file: `fonts/plus-jakarta-sans-latin-${w}-normal.woff2`,
    weight: w,
  })),
];

let loaded = false;
export const ensureFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const f of faces) {
    loadFont({family: f.family, url: staticFile(f.file), weight: f.weight});
  }
};

export const UI_STACK = `${FONTS.ui}, "Noto Color Emoji", sans-serif`;
export const DISPLAY_STACK = `${FONTS.display}, ${FONTS.ui}, "Noto Color Emoji", sans-serif`;
