export type VideoTopic =
  | 'tech'
  | 'science'
  | 'history'
  | 'news'
  | 'entertainment'
  | 'sports'
  | 'saas';

export interface ColorPaletteTokens {
  background: string;
  foreground: string;
  accent: string;
  secondaryAccent: string;
  cardBg: string;
  border: string;
  highlight: string;
}

export interface TypographyFontTokens {
  display: string;
  body: string;
  mono: string;
}

export const TOPIC_PALETTES: Record<VideoTopic, ColorPaletteTokens> = {
  tech: {
    background: '#090d16',
    foreground: '#f8fafc',
    accent: '#f59e0b', // Cyber Amber
    secondaryAccent: '#06b6d4', // Cyan
    cardBg: 'rgba(15, 23, 42, 0.85)',
    border: '#1e293b',
    highlight: '#38bdf8'
  },
  science: {
    background: '#030712',
    foreground: '#f9fafb',
    accent: '#38bdf8', // Stellar Blue
    secondaryAccent: '#a855f7', // Nebula Purple
    cardBg: 'rgba(17, 24, 39, 0.85)',
    border: '#1f2937',
    highlight: '#67e8f9'
  },
  history: {
    background: '#14120e', // Warm Charcoal
    foreground: '#fef3c7', // Parchment Ivory
    accent: '#d97706', // Antique Gold
    secondaryAccent: '#b45309', // Terracotta
    cardBg: 'rgba(28, 25, 23, 0.88)',
    border: '#44403c',
    highlight: '#fde68a'
  },
  news: {
    background: '#0a0a0c',
    foreground: '#ffffff',
    accent: '#ef4444', // Breaking Red
    secondaryAccent: '#3b82f6', // Trusted Blue
    cardBg: 'rgba(18, 18, 22, 0.9)',
    border: '#27272a',
    highlight: '#f87171'
  },
  entertainment: {
    background: '#0b0813',
    foreground: '#fdf4ff',
    accent: '#ec4899', // Electric Magenta
    secondaryAccent: '#8b5cf6', // Violet
    cardBg: 'rgba(24, 15, 38, 0.85)',
    border: '#3b0764',
    highlight: '#f472b6'
  },
  sports: {
    background: '#04100c',
    foreground: '#f0fdf4',
    accent: '#10b981', // Kinetic Turf Green
    secondaryAccent: '#f59e0b', // Trophy Gold
    cardBg: 'rgba(6, 30, 22, 0.85)',
    border: '#064e3b',
    highlight: '#34d399'
  },
  saas: {
    background: '#080c14',
    foreground: '#ffffff',
    accent: '#6366f1', // Indigo Brand
    secondaryAccent: '#06b6d4', // Cyan Flow
    cardBg: 'rgba(15, 23, 42, 0.85)',
    border: '#1e293b',
    highlight: '#818cf8'
  }
};

export const TYPOGRAPHY_TOKENS: TypographyFontTokens = {
  display: 'Inter, system-ui, -apple-system, sans-serif',
  body: 'Inter, system-ui, -apple-system, sans-serif',
  mono: 'JetBrains Mono, Menlo, monospace'
};

export const FONT_SIZES = {
  '16:9': {
    headline: 76,
    subHeadline: 46,
    body: 28,
    caption: 42,
    badge: 20
  },
  '9:16': {
    headline: 62,
    subHeadline: 36,
    body: 32, // Scaled up for mobile readability
    caption: 38,
    badge: 18
  },
  '1:1': {
    headline: 68,
    subHeadline: 40,
    body: 30,
    caption: 40,
    badge: 18
  }
} as const;

