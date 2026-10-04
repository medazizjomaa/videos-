// All timings (frames @ 30 fps) and colors for the MERCHATI promo.

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);

export const TOTAL_FRAMES = s(60);

// Frames a scene keeps running underneath the next one while it transitions in.
export const TRANSITION = 14;

export const SCENES = {
  overload: {from: 0, dur: 150},
  split: {from: 150, dur: 150},
  consequences: {from: 300, dur: 180},
  reveal: {from: 480, dur: 120},
  shopDM: {from: 600, dur: 290},
  telegram: {from: 890, dur: 90},
  shopDash: {from: 980, dur: 180},
  restoDM: {from: 1160, dur: 195},
  restoDash: {from: 1355, dur: 150},
  highlights: {from: 1505, dur: 60},
  pricing: {from: 1565, dur: 120},
  cta: {from: 1685, dur: 115},
} as const;

export const COLORS = {
  // Brand (sampled from the MERCHATI logo)
  blue: '#097CF1',
  navy: '#011A4D',
  cyan: '#15EFF8',
  blueSoft: '#3BA0FF',

  // Video backgrounds
  bg: '#F4F7FC',
  bgDeep: '#E9EEF7',
  bgPanel: '#FFFFFF',
  bgPanel2: '#F7F9FD',
  line: 'rgba(11,27,63,0.07)',
  lineStrong: 'rgba(11,27,63,0.12)',
  text: '#0B1B3F',
  textDim: 'rgba(11,27,63,0.62)',
  textFaint: 'rgba(11,27,63,0.4)',

  // Alerts / states
  red: '#F0293E',
  redSoft: '#E5384B',
  amber: '#FFB547',
  green: '#22C55E',
  greenSoft: '#4ADE80',

  // Phone + apps
  phoneBody: '#16181D',
  phoneEdge: '#2A2E37',
  island: '#000000',
  lockWall1: '#CFE0FF',
  lockWall2: '#F3F6FD',
  notif: 'rgba(255,255,255,0.96)',
  notifText: '#0F1222',
  notifSub: 'rgba(60,60,67,0.6)',

  igBg: '#FFFFFF',
  igIn: '#EFEFEF',
  igOut1: '#8B3DFF',
  igOut2: '#3B6EFF',
  igIcon1: '#FEDA75',
  igIcon2: '#FA7E1E',
  igIcon3: '#D62976',
  igIcon4: '#962FBF',

  msBg: '#FFFFFF',
  msIn: '#F0F0F0',
  msOut1: '#1E7BFF',
  msOut2: '#7A4DFF',
  msIcon1: '#00B2FF',
  msIcon2: '#A033FF',

  tgBg: '#DCE6EF',
  tgHeader: '#FFFFFF',
  tgBubble: '#FFFFFF',
  tgAccent: '#3390EC',
  tgIcon: '#2AABEE',

  shopIcon1: '#097CF1',
  shopIcon2: '#15EFF8',
  resaIcon1: '#10B981',
  resaIcon2: '#0EA5E9',

  // Dashboards (light UI, matches the logo on white)
  dBg: '#F3F6FB',
  dCard: '#FFFFFF',
  dBorder: '#E2E8F2',
  dText: '#0B1B3F',
  dMuted: '#6A7894',
  dFaint: '#A4AFC4',
  dActive: '#EAF3FF',
  dGreen: '#16A34A',
  dGreenBg: '#E6F7EC',
  dAmber: '#B76E00',
  dAmberBg: '#FFF3DC',
  dRed: '#DC2626',
  dRedBg: '#FDECEC',
  dBlueBg: '#E8F2FF',

  // Restaurant booking site (venue branding: Dar Yasmine)
  venueBg: '#FBF7F1',
  venueInk: '#1F2A2E',
  venueMuted: '#7B827F',
  venueAccent: '#0F5C57',
  venueAccentSoft: '#DCEBE8',
  venueTaken: '#E4DED4',
  venueLine: '#E9E1D6',

  // Product illustrations
  dressBlack: '#17171A',
  dressBeige: '#D9C3A5',
  dressBordeaux: '#6E1F33',
  productBg1: '#EDE6DC',
  productBg2: '#E9EEF5',
  productBg3: '#F1E4E6',
} as const;

export const alpha = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const GRADIENTS = {
  accentText: `linear-gradient(92deg, ${COLORS.blue} 0%, #00A6D6 100%)`,
  brand: `linear-gradient(135deg, ${COLORS.blue} 0%, #2E9BFF 55%, ${COLORS.cyan} 130%)`,
  igOut: `linear-gradient(180deg, ${COLORS.igOut1} 0%, ${COLORS.igOut2} 100%)`,
  msOut: `linear-gradient(180deg, ${COLORS.msOut2} 0%, ${COLORS.msOut1} 100%)`,
  igIcon: `linear-gradient(45deg, ${COLORS.igIcon1} 0%, ${COLORS.igIcon2} 25%, ${COLORS.igIcon3} 60%, ${COLORS.igIcon4} 100%)`,
  msIcon: `linear-gradient(200deg, ${COLORS.msIcon2} 0%, ${COLORS.msIcon1} 100%)`,
  shopIcon: `linear-gradient(135deg, ${COLORS.shopIcon1} 0%, ${COLORS.shopIcon2} 100%)`,
  resaIcon: `linear-gradient(135deg, ${COLORS.resaIcon1} 0%, ${COLORS.resaIcon2} 100%)`,
  tgIcon: `linear-gradient(180deg, #37BBFE 0%, #1E96C8 100%)`,
};

export const FONTS = {
  display: 'Jakarta',
  ui: 'Inter',
};

// ---------------------------------------------------------------------------
// Per-scene beats (frames relative to the scene start)
// ---------------------------------------------------------------------------

export const BEATS = {
  overload: {
    headline1: 10,
    headline2: 66,
    firstNotif: 6,
    firstGap: 15,
    gapDecay: 0.86,
    minGap: 1.6,
    spillStart: 58,
    badge: [
      [0, 0],
      [34, 12],
      [84, 47],
      [118, 99],
      [128, 120],
    ] as [number, number][],
    vibrateFrom: 70,
  },
  split: {
    headline1: 8,
    headline1Out: 78,
    headline2: 84,
    phases: [0, 34, 70, 108],
    zoom: [1, 1.07],
  },
  consequences: {
    clock: [0, 40, 80],
    clockOut: 94,
    seenAt: 22,
    msgAt: 10,
    q1: 46,
    q2: 58,
    leave: 84,
    cancelAt: 50,
    tableAt: 66,
    lostAt: 96,
    lostCount: [104, 150],
    headline: 100,
    freeze: 152,
    fadeOut: [160, 178],
  },
  reveal: {
    pulse: 12,
    logo: 26,
    logoMove: 64,
    headline1: 34,
    headline1Out: 84,
    headline2: 88,
    organize: 66,
  },
  shopDM: {
    headline1: 6,
    headline1Out: 92,
    headline2: 98,
    headline2Out: 196,
    headline3: 202,
    msgCustomer1: 12,
    typing1: [34, 52],
    msgAI1: 52,
    cards: 60,
    swipe: [80, 96],
    msgCustomer2: 112,
    typing2: [124, 136],
    msgAI2: 136,
    msgCustomer3: 156,
    typing3: [168, 178],
    recap: 178,
    msgCustomer4: 196,
    typing4: [204, 212],
    msgAI3: 212,
    badge: 214,
    voice: 238,
    voicePlay: [244, 268],
    transcript: 256,
    typing5: [270, 280],
    msgAI4: 280,
  },
  telegram: {
    headline: 10,
    banner: 8,
    bannerOut: 40,
    bubble: 30,
  },
  shopDash: {
    headline: 8,
    kpiCount: [6, 44],
    navClick: 54,
    pageSwap: 58,
    newRow: 74,
    confirmClick: 100,
    deliveryClick: 128,
    revenue: [130, 158],
    toast: 134,
    camera: [
      {f: 0, x: 852, y: 300, s: 0.95},
      {f: 36, x: 760, y: 450, s: 1.28},
      {f: 56, x: 650, y: 430, s: 0.95},
      {f: 92, x: 740, y: 420, s: 1.32},
      {f: 150, x: 760, y: 420, s: 1.32},
      {f: 180, x: 770, y: 415, s: 1.35},
    ],
  },
  restoDM: {
    headline0: 8,
    headline0Out: 140,
    headline: 150,
    msgCustomer1: 10,
    typing1: [28, 42],
    msgAI1: 42,
    link: 50,
    tapLink: 74,
    siteOpen: [80, 96],
    tapTable: 116,
    sheet: 122,
    tapConfirm: 146,
    confirmed: 152,
  },
  restoDash: {
    headline: 6,
    ringCount: [6, 40],
    navClick: 58,
    pageSwap: 62,
    newRow: 78,
    alert: 96,
    camera: [
      {f: 0, x: 852, y: 240, s: 0.95},
      {f: 40, x: 700, y: 640, s: 1.25},
      {f: 56, x: 650, y: 430, s: 0.95},
      {f: 90, x: 800, y: 420, s: 1.3},
      {f: 150, x: 820, y: 420, s: 1.33},
    ],
  },
  highlights: {
    start: 4,
    stagger: 7,
    out: 52,
  },
  pricing: {
    headline: 6,
    cards: 16,
    stagger: 10,
    count: [24, 56],
  },
  cta: {
    badgeCount: [4, 30],
    phoneMove: [24, 48],
    logo: 30,
    line1: 40,
    line2: 50,
    line3: 60,
    pill: 72,
    url: 82,
  },
} as const;

// Set to true once public/audio/voiceover.wav exists (scripts/voiceover_gemini.py). Music is ducked under it.
export const VOICEOVER = true;
