export interface DownloadMediaOptions {
  url: string;
  outputDirectory: string;
  outputFileName: string;
  extractAudioOnly?: boolean;
}

export interface IMediaIngestionPort {
  downloadAudio(url: string, outputDir: string, fileName?: string): Promise<string>;
  downloadVideo(url: string, outputDir: string, fileName?: string): Promise<string>;
}

