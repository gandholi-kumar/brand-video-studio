import { CaptionTrack } from '../../../domain/value-objects/CaptionTrack.js';

export interface IAudioIntelligencePort {
  transcribe(audioFilePath: string): Promise<CaptionTrack>;
}

