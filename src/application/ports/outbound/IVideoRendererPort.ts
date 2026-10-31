import { BrandProject } from '../../../domain/entities/BrandProject.js';
import { Storyboard } from '../../../domain/value-objects/Storyboard.js';
import { CaptionTrack } from '../../../domain/value-objects/CaptionTrack.js';

export interface RenderConfig {
  fps: 30 | 60;
  width: number;
  height: number;
  concurrency: number;
  quality: 'draft' | 'delivery';
  outputFilePath: string;
  compositionId?: string;
  character?: {
    enabled: boolean;
    type: 'coder' | 'mascot';
  };
}

export interface RenderResult {
  outputFilePath: string;
  durationSeconds: number;
  renderedFramesCount: number;
}

export interface IVideoRendererPort {
  readonly engineName: string;
  render(
    project: BrandProject,
    storyboard: Storyboard,
    captions: CaptionTrack | null,
    config: RenderConfig
  ): Promise<RenderResult>;
}

