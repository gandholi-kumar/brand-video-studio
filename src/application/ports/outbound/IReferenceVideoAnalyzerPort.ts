import { ColorPaletteTokens } from '../../../const/theme.const.js';

export interface InspirationPacingMetrics {
  sceneCutCount: number;
  averageShotHoldSeconds: number; // Delta t_cut
  cutTimestamps: number[];
  intensity: 'fast-paced' | 'moderate' | 'contemplative';
}

export interface InspirationCadenceMetrics {
  wordsPerMinute: number;
  totalSpokenWords: number;
  averageWordDurationMs: number;
}

export interface InspirationProfile {
  sourceFileName: string;
  durationSeconds: number;
  pacing: InspirationPacingMetrics;
  palette: Partial<ColorPaletteTokens>;
  cadence: InspirationCadenceMetrics;
  analyzedAt: Date;
}

export interface IReferenceVideoAnalyzerPort {
  analyzeVideo(videoPath: string): Promise<InspirationProfile>;
}

