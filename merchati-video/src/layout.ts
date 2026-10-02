import {useVideoConfig} from 'remotion';

export type Box = {x: number; y: number; w: number; h: number};

/**
 * Shared stage metrics for the two formats.
 * 9:16 → headline on top, visual below. 1:1 → headline left, visual right.
 */
export const useLayout = () => {
  const {width: W, height: H} = useVideoConfig();
  const square = Math.abs(W - H) < 4;
  if (square) {
    return {
      W,
      H,
      square,
      text: {x: 64, y: 0, w: 500, h: H} as Box,
      visual: {x: 560, y: 0, w: W - 560, h: H} as Box,
      headlineSize: 52,
      phoneW: 430,
      phoneTop: (H - 430 * 2.097) / 2,
      phoneCx: 560 + (W - 560) / 2 - 10,
    };
  }
  return {
    W,
    H,
    square,
    text: {x: 76, y: 150, w: W - 152, h: 300} as Box,
    visual: {x: 0, y: 470, w: W, h: H - 470} as Box,
    headlineSize: 78,
    phoneW: 640,
    phoneTop: 500,
    phoneCx: W / 2,
  };
};

export type Layout = ReturnType<typeof useLayout>;
