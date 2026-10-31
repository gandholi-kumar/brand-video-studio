export interface DeliverableMetadata {
  durationSeconds: number;
  width: number;
  height: number;
  fps: number;
  hasPosterFrame0: boolean;
  generatedAt: Date;
}

export class VideoDeliverable {
  constructor(
    public readonly projectSlug: string,
    public readonly videoPath: string,
    public readonly posterPath: string,
    public readonly shareCopyPath: string,
    public readonly shareCopyText: string,
    public readonly metadata: DeliverableMetadata
  ) {}

  public isComplete(): boolean {
    return Boolean(
      this.videoPath &&
      this.posterPath &&
      this.shareCopyPath &&
      this.metadata.hasPosterFrame0
    );
  }
}

