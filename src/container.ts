import { GenerateBrandVideoUseCase } from './application/use-cases/GenerateBrandVideoUseCase.js';
import { PuppeteerScraperAdapter } from './adapters/driven/scraper/PuppeteerScraperAdapter.js';
import { YtDlpAdapter } from './adapters/driven/media/YtDlpAdapter.js';
import { WhisperCppAdapter } from './adapters/driven/speech/WhisperCppAdapter.js';
import { RemotionRendererAdapter } from './adapters/driven/renderer/RemotionRendererAdapter.js';
import { FfmpegPostProcessorAdapter } from './adapters/driven/postprocessor/FfmpegPostProcessorAdapter.js';
import { FileSystemStorageAdapter } from './adapters/driven/storage/FileSystemStorageAdapter.js';

export interface StudioContainer {
  generateVideoUseCase: GenerateBrandVideoUseCase;
  scraper: PuppeteerScraperAdapter;
  mediaDownloader: YtDlpAdapter;
  whisper: WhisperCppAdapter;
  renderer: RemotionRendererAdapter;
  postProcessor: FfmpegPostProcessorAdapter;
  storage: FileSystemStorageAdapter;
}

export function createStudioContainer(): StudioContainer {
  const scraper = new PuppeteerScraperAdapter();
  const mediaDownloader = new YtDlpAdapter();
  const whisper = new WhisperCppAdapter();
  const renderer = new RemotionRendererAdapter();
  const postProcessor = new FfmpegPostProcessorAdapter();
  const storage = new FileSystemStorageAdapter('./output');

  const generateVideoUseCase = new GenerateBrandVideoUseCase({
    webScraper: scraper,
    audioIntel: whisper,
    videoRenderer: renderer,
    postProcessor,
    storage
  });

  return {
    generateVideoUseCase,
    scraper,
    mediaDownloader,
    whisper,
    renderer,
    postProcessor,
    storage
  };
}

