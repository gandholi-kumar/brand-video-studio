import { AspectRatio } from '../../const/video.const.js';
import { VideoTopic, ColorPaletteTokens, TypographyFontTokens } from '../../const/theme.const.js';
import { VisualStyle } from '../../const/templates.const.js';
import { WordTimestamp } from '../value-objects/CaptionTrack.js';

export type SceneLayoutType =
  | 'headline'
  | 'stat-counter'
  | 'split-comparison'
  | 'rough-diagram'
  | 'physics-drop'
  | 'watercolor-canvas'
  | 'code-live'
  | 'outro-badge';

export interface SoundEffectCue {
  second: number;
  soundName: string;
  volume?: number;
}

export interface DynamicSceneBlock {
  id: string;
  layoutType: SceneLayoutType;
  title: string;
  subtitle?: string;
  durationSeconds: number;
  highlightText?: string;
  badgeText?: string;
  sfxCue?: string;
  customProps?: {
    stats?: Array<{ label: string; value: number | string; suffix?: string }>;
    comparison?: {
      leftTitle: string;
      leftItems: string[];
      rightTitle: string;
      rightItems: string[];
    };
    diagram?: {
      nodes: Array<{ id: string; label: string; x: number; y: number; type?: string }>;
      links: Array<{ from: string; to: string; label?: string }>;
    };
    badges?: string[];
    codeSnippet?: string;
    mediaUrl?: string;
  };
}

export interface VideoManifestData {
  version: '2.0';
  id: string;
  title: string;
  topic: VideoTopic;
  aspectRatio: AspectRatio;
  style: VisualStyle;
  totalDurationSeconds: number;
  fps: number;
  theme: {
    palette: ColorPaletteTokens;
    typography: TypographyFontTokens;
  };
  audio: {
    soundtrackUrl?: string;
    soundtrackPath?: string;
    voiceoverTrackPath?: string;
    duckingDb?: number;
    sfxCues?: SoundEffectCue[];
  };
  character?: {
    enabled: boolean;
    type?: string;
  };
  captions?: WordTimestamp[];
  scenes: DynamicSceneBlock[];
}

export class VideoManifest {
  constructor(public readonly data: VideoManifestData) {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('VideoManifest requires a non-empty title');
    }
    if (!data.scenes || data.scenes.length === 0) {
      throw new Error('VideoManifest must contain at least one scene');
    }
    const computedDuration = data.scenes.reduce((sum, s) => sum + s.durationSeconds, 0);
    if (Math.abs(computedDuration - data.totalDurationSeconds) > 0.5) {
      // Auto-align totalDurationSeconds if slight rounding difference
      data.totalDurationSeconds = Math.round(computedDuration * 10) / 10;
    }
  }

  public getTotalFrames(): number {
    return Math.round(this.data.totalDurationSeconds * this.data.fps);
  }

  public getWidth(): number {
    return this.data.aspectRatio === '9:16' ? 1080 : 1920;
  }

  public getHeight(): number {
    return this.data.aspectRatio === '9:16' ? 1920 : 1080;
  }
}

