import { VideoDeliverable } from '../../../domain/entities/VideoDeliverable.js';

export interface GenerateBrandVideoCommand {
  url: string;
  tone?: string;
  durationSeconds?: number;
  format?: 'landscape' | 'vertical' | 'square';
  character?: 'coder' | 'mascot' | 'none';
  concurrency?: number;
}

export interface IGenerateBrandVideo {
  execute(command: GenerateBrandVideoCommand): Promise<VideoDeliverable>;
}

