export interface OpenverseTrack {
  id: string;
  title: string;
  creator?: string;
  url: string;
  downloadUrl: string;
  license: string;
  duration?: number;
}

export interface IOpenverseMediaPort {
  searchAudio(query: string, licenseType?: 'all-cc' | 'cc0' | 'by'): Promise<OpenverseTrack[]>;
  downloadTrack(track: OpenverseTrack, targetDir: string): Promise<string>;
  getAudioForTopic(topic: string, targetDir: string): Promise<string>;
}

