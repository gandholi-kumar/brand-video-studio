export type AspectRatio = '16:9' | '9:16' | '1:1';

export interface ResolutionConfig {
  width: number;
  height: number;
  label: string;
  bestFor: string;
}

export interface SafeZoneMargin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const VIDEO_CONFIG = {
  defaultFps: 30,
  defaultDurationSeconds: 20,
  maxSingleChunkDurationSeconds: 30, // Beyond 30s, chunk-and-concat is used
  resolutions: {
    '16:9': {
      width: 1920,
      height: 1080,
      label: 'Landscape 16:9',
      bestFor: 'Laptop, Desktop Web, TV, YouTube, Twitter/X'
    },
    '9:16': {
      width: 1080,
      height: 1920,
      label: 'Portrait 9:16',
      bestFor: 'YouTube Shorts, Instagram Reels, TikTok'
    },
    '1:1': {
      width: 1080,
      height: 1080,
      label: 'Square 1:1',
      bestFor: 'Instagram Feed, LinkedIn Post'
    }
  } as Record<AspectRatio, ResolutionConfig>,

  safeZones: {
    '16:9': {
      top: 60,
      bottom: 80,
      left: 80,
      right: 80
    },
    '9:16': {
      top: 220, // Clear of mobile status bar & app navigation
      bottom: 380, // Clear of TikTok/Reels caption & sound overlay thumb zone
      left: 48,
      right: 48
    },
    '1:1': {
      top: 60,
      bottom: 80,
      left: 60,
      right: 60
    }
  } as Record<AspectRatio, SafeZoneMargin>,

  camera: {
    defaultPushInStartScale: 1.0,
    defaultPushInEndScale: 1.08,
    defaultDriftY: -15
  }
} as const;

