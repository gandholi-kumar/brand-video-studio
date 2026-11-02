import { GenerateBrandVideoUseCase } from './application/use-cases/GenerateBrandVideoUseCase.js';
import { GenerateUniversalVideoUseCase } from './application/use-cases/GenerateUniversalVideoUseCase.js';
import { GenerateScriptBreakdownUseCase } from './application/use-cases/GenerateScriptBreakdownUseCase.js';
import { AnalyzeReferenceVideoUseCase } from './application/use-cases/AnalyzeReferenceVideoUseCase.js';
import { PuppeteerScraperAdapter } from './adapters/driven/scraper/PuppeteerScraperAdapter.js';
import { YtDlpAdapter } from './adapters/driven/media/YtDlpAdapter.js';
import { WhisperCppAdapter } from './adapters/driven/speech/WhisperCppAdapter.js';
import { RemotionRendererAdapter } from './adapters/driven/renderer/RemotionRendererAdapter.js';
import { FfmpegPostProcessorAdapter } from './adapters/driven/postprocessor/FfmpegPostProcessorAdapter.js';
import { FileSystemStorageAdapter } from './adapters/driven/storage/FileSystemStorageAdapter.js';
import { FfmpegReferenceAnalyzerAdapter } from './adapters/driven/analyzer/FfmpegReferenceAnalyzerAdapter.js';
import { HtmlAnimaticGeneratorAdapter } from './adapters/driven/preview/HtmlAnimaticGeneratorAdapter.js';
import { OpenverseMediaAdapter } from './adapters/driven/media/OpenverseMediaAdapter.js';

export interface StudioContainer {
  generateVideoUseCase: GenerateBrandVideoUseCase;
  generateUniversalVideoUseCase: GenerateUniversalVideoUseCase;
  generateScriptBreakdownUseCase: GenerateScriptBreakdownUseCase;
  analyzeReferenceUseCase: AnalyzeReferenceVideoUseCase;
  scraper: PuppeteerScraperAdapter;
  mediaDownloader: YtDlpAdapter;
  whisper: WhisperCppAdapter;
  renderer: RemotionRendererAdapter;
  postProcessor: FfmpegPostProcessorAdapter;
  storage: FileSystemStorageAdapter;
  referenceAnalyzer: FfmpegReferenceAnalyzerAdapter;
  animaticGenerator: HtmlAnimaticGeneratorAdapter;
  openverseMedia: OpenverseMediaAdapter;
}

export function createStudioContainer(): StudioContainer {
  const scraper = new PuppeteerScraperAdapter();
  const mediaDownloader = new YtDlpAdapter();
  const whisper = new WhisperCppAdapter();
  const renderer = new RemotionRendererAdapter();
  const postProcessor = new FfmpegPostProcessorAdapter();
  const storage = new FileSystemStorageAdapter('./output');
  const referenceAnalyzer = new FfmpegReferenceAnalyzerAdapter(whisper);
  const animaticGenerator = new HtmlAnimaticGeneratorAdapter();
  const openverseMedia = new OpenverseMediaAdapter();

  const generateVideoUseCase = new GenerateBrandVideoUseCase({
    webScraper: scraper,
    audioIntel: whisper,
    videoRenderer: renderer,
    postProcessor,
    storage
  });

  const analyzeReferenceUseCase = new AnalyzeReferenceVideoUseCase(referenceAnalyzer, mediaDownloader);
  const scriptBreakdownUseCase = new GenerateScriptBreakdownUseCase(openverseMedia);

  const generateUniversalVideoUseCase = new GenerateUniversalVideoUseCase({
    analyzeReferenceUseCase,
    scriptBreakdownUseCase,
    animaticGenerator,
    renderer,
    postProcessor,
    storage,
    webScraper: scraper
  });

  return {
    generateVideoUseCase,
    generateUniversalVideoUseCase,
    generateScriptBreakdownUseCase: scriptBreakdownUseCase,
    analyzeReferenceUseCase,
    scraper,
    mediaDownloader,
    whisper,
    renderer,
    postProcessor,
    storage,
    referenceAnalyzer,
    animaticGenerator,
    openverseMedia
  };
}
