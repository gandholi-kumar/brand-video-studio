import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { AspectRatio } from '../../const/video.const.js';
import { VideoTopic } from '../../const/theme.const.js';
import { VisualStyle } from '../../const/templates.const.js';
import { IVideoRendererPort } from '../ports/outbound/IVideoRendererPort.js';
import { IVideoPostProcessorPort } from '../ports/outbound/IVideoPostProcessorPort.js';
import { IStoragePort } from '../ports/outbound/IStoragePort.js';
import { IWebScraperPort, ScrapedSiteData } from '../ports/outbound/IWebScraperPort.js';
import { AnalyzeReferenceVideoUseCase } from './AnalyzeReferenceVideoUseCase.js';
import { GenerateScriptBreakdownUseCase } from './GenerateScriptBreakdownUseCase.js';
import { HtmlAnimaticGeneratorAdapter } from '../../adapters/driven/preview/HtmlAnimaticGeneratorAdapter.js';

export interface GenerateUniversalVideoCommand {
  prompt?: string;
  url?: string;
  referenceInput?: string;
  durationSeconds?: number;
  format?: 'landscape' | 'vertical';
  topic?: VideoTopic;
  style?: VisualStyle;
  character?: string;
  previewOnly?: boolean;
  concurrency?: number;
}

export interface UniversalVideoDependencies {
  analyzeReferenceUseCase: AnalyzeReferenceVideoUseCase;
  scriptBreakdownUseCase: GenerateScriptBreakdownUseCase;
  animaticGenerator: HtmlAnimaticGeneratorAdapter;
  renderer: IVideoRendererPort;
  postProcessor: IVideoPostProcessorPort;
  storage: IStoragePort;
  webScraper?: IWebScraperPort;
}

export class GenerateUniversalVideoUseCase {
  constructor(private readonly deps: UniversalVideoDependencies) {}

  public async execute(command: GenerateUniversalVideoCommand): Promise<{
    projectSlug: string;
    manifestPath: string;
    storyboardHtmlPath: string;
    videoPath?: string;
    posterPath?: string;
    shareCopyPath?: string;
    shareCopyText?: string;
    previewOnly: boolean;
  }> {
    // 1. Live Website / GitHub Scraping (Brag Skill integration)
    let scrapedData: ScrapedSiteData | undefined;
    if (command.url && this.deps.webScraper) {
      const tempDir = './output/temp';
      scrapedData = await this.deps.webScraper.scrapeUrl(command.url, tempDir);
    }

    // 2. Reference Video Analysis (if provided or present in inputs/inspiration)
    const inspirationProfile = await this.deps.analyzeReferenceUseCase.execute({
      referenceInput: command.referenceInput
    });

    // 3. Generate Polymorphic Script Breakdown & Manifest (fuses Prompt + Scraped Assets + Reference Rhythm)
    const aspectRatio: AspectRatio = command.format === 'vertical' ? '9:16' : '16:9';
    const manifest = await this.deps.scriptBreakdownUseCase.execute({
      prompt: command.prompt,
      scrapedData,
      durationSeconds: command.durationSeconds,
      aspectRatio,
      topic: command.topic,
      style: command.style,
      character: command.character,
      inspirationProfile
    });

    // 3. Human-readable slug from title (e.g., "quantum-computing-breakthrough")
    const titleSlug =
      manifest.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'video-project';

    const projectDir = await this.deps.storage.ensureProjectDirectory(titleSlug);
    const slug = path.basename(projectDir);

    // Save resolved manifest in project output directory
    const manifestPath = path.join(projectDir, 'manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest.data, null, 2), 'utf-8');

    // 4. Generate Interactive Pre-Visualization Storyboard HTML
    const storyboardHtmlPath = await this.deps.animaticGenerator.generateAnimaticHtml(
      manifest.data,
      projectDir
    );

    // 5. Early Exit if Preview Only
    if (command.previewOnly) {
      return {
        projectSlug: slug,
        manifestPath,
        storyboardHtmlPath,
        previewOnly: true
      };
    }

    // 5. Remotion Render
    const rawVideoPath = `${projectDir}/.work/raw-render.mp4`;
    const width = manifest.getWidth();
    const height = manifest.getHeight();
    const concurrency = command.concurrency || 1;

    if (this.deps.renderer.renderManifest) {
      await this.deps.renderer.renderManifest(manifest, {
        fps: 30,
        width,
        height,
        concurrency,
        quality: 'delivery',
        outputFilePath: rawVideoPath
      });
    } else {
      throw new Error('Renderer adapter does not support renderManifest');
    }

    // 6. Post-Processing & Audio Muxing
    const posterPath = `${projectDir}/poster.jpg`;
    const finalVideoPath = `${projectDir}/video.mp4`;
    const audioTrackPath =
      manifest.data.audio.soundtrackPath || path.resolve('assets/music/soundtrack.mp3');

    const totalDur = manifest.data.totalDurationSeconds;
    const posterSecond = Math.max(0.5, totalDur - 1.5);

    await this.deps.postProcessor.extractPosterFrame(rawVideoPath, posterSecond, posterPath);
    await this.deps.postProcessor.bakePosterAndMuxAudio(
      rawVideoPath,
      posterPath,
      audioTrackPath,
      finalVideoPath,
      totalDur
    );

    // 7. Share Copy
    const shareCopyText = `🎬 New Autonomous Video Generated: "${manifest.data.title}"\n\nStyle: ${manifest.data.style.toUpperCase()} | Format: ${manifest.data.aspectRatio} | Duration: ${totalDur}s\nTopic: ${manifest.data.topic.toUpperCase()}\n\nPowered by Universal Brand Video Studio.`;
    const shareCopyPath = await this.deps.storage.saveTextFile(projectDir, 'share-copy.txt', shareCopyText);

    return {
      projectSlug: slug,
      manifestPath,
      storyboardHtmlPath,
      videoPath: finalVideoPath,
      posterPath,
      shareCopyPath,
      shareCopyText,
      previewOnly: false
    };
  }
}
