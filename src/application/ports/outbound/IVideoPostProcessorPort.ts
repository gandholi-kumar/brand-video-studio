export interface IVideoPostProcessorPort {
  extractPosterFrame(videoPath: string, timestampSeconds: number, outputImagePath: string): Promise<string>;
  bakePosterAsFrame0(videoPath: string, posterImagePath: string, outputVideoPath: string): Promise<string>;
  muxAudio(videoPath: string, audioPath: string, outputVideoPath: string): Promise<string>;
  bakePosterAndMuxAudio(videoPath: string, posterImagePath: string, audioPath: string, outputVideoPath: string): Promise<string>;
}
