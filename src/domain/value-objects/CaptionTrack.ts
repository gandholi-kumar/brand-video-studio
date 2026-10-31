export interface WordTimestamp {
  word: string;
  start: number; // In seconds
  end: number;   // In seconds
  confidence?: number;
}

export class CaptionTrack {
  constructor(public readonly words: readonly WordTimestamp[]) {}

  public getActiveWord(currentTimestampSeconds: number): WordTimestamp | undefined {
    return this.words.find(
      (w) => currentTimestampSeconds >= w.start && currentTimestampSeconds <= w.end
    );
  }

  public getFullTranscript(): string {
    return this.words.map((w) => w.word).join(' ');
  }
}

