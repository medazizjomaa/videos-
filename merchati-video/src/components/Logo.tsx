import React from 'react';
import {Img, OffthreadVideo, staticFile} from 'remotion';
import {alpha, COLORS} from '../config';

// Source logo (cropped, untouched pixels) is 1108×396; the animation is 1280×720.
const LOGO_RATIO = 396 / 1108;
const ANIM_CROP = {x: 50, y: 126, w: 1180, h: 444};

type Props = {
  /** Width of the white plate the logo sits on. */
  width: number;
  /** Play the original MERCHATI loading animation instead of the still. */
  animated?: boolean;
  /** Seconds into the source animation to start from. */
  startFrom?: number;
  plate?: boolean;
  glow?: number;
  style?: React.CSSProperties;
};

/**
 * The MERCHATI logo exactly as provided (navy + blue on white), shown on a white plate
 * so it reads on the dark stage without any recoloring.
 */
export const Logo: React.FC<Props> = ({width, animated, startFrom = 0, plate = true, glow = 1, style}) => {
  const padX = plate ? width * 0.07 : 0;
  const innerW = width - padX * 2;
  const innerH = animated ? innerW * (ANIM_CROP.h / ANIM_CROP.w) : innerW * LOGO_RATIO;
  const padY = plate ? width * 0.045 : 0;

  const k = innerW / ANIM_CROP.w;
  return (
    <div
      style={{
        width,
        height: innerH + padY * 2,
        padding: `${padY}px ${padX}px`,
        borderRadius: plate ? width * 0.07 : 0,
        background: plate ? '#FFFFFF' : 'transparent',
        boxShadow: plate
          ? `0 0 0 1px ${alpha('#0B1B3F', 0.06)}, 0 24px 60px ${alpha(COLORS.blue, 0.22 * glow)}, 0 0 120px ${alpha(COLORS.cyan, 0.16 * glow)}`
          : undefined,
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...style,
      }}
    >
      {animated ? (
        <div style={{width: innerW, height: innerH, position: 'relative', overflow: 'hidden'}}>
          <OffthreadVideo
            src={staticFile('brand/merchati-logo-anim.webm')}
            muted
            startFrom={Math.round(startFrom * 30)}
            style={{
              position: 'absolute',
              width: 1280 * k,
              height: 720 * k,
              left: -ANIM_CROP.x * k,
              top: -ANIM_CROP.y * k,
              maxWidth: 'none',
            }}
          />
        </div>
      ) : (
        <Img src={staticFile('brand/merchati-logo.png')} style={{width: innerW, height: innerH, display: 'block'}} />
      )}
    </div>
  );
};

/** Bubble mark only (cropped from the same source). */
export const LogoMark: React.FC<{size: number; plate?: boolean; style?: React.CSSProperties}> = ({
  size,
  plate = true,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: plate ? '#FFFFFF' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      ...style,
    }}
  >
    <Img src={staticFile('brand/merchati-icon.png')} style={{width: size * 0.92, height: size * 0.92}} />
  </div>
);
