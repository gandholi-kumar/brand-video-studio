import * as path from 'node:path';
import { IGenerateBrandVideo, GenerateBrandVideoCommand } from '../ports/inbound/IGenerateBrandVideo.js';
import { IWebScraperPort } from '../ports/outbound/IWebScraperPort.js';
import { IAudioIntelligencePort } from '../ports/outbound/IAudioIntelligencePort.js';
import { IVideoRendererPort } from '../ports/outbound/IVideoRendererPort.js';
import { IVideoPostProcessorPort } from '../ports/outbound/IVideoPostProcessorPort.js';
import { IStoragePort } from '../ports/outbound/IStoragePort.js';
import { BrandProject } from '../../domain/entities/BrandProject.js';
import { VideoDeliverable } from '../../domain/entities/VideoDeliverable.js';
import { Storyboard } from '../../domain/value-objects/Storyboard.js';
import { Scene } from '../../domain/value-objects/Scene.js';
import { CaptionTrack } from '../../domain/value-objects/CaptionTrack.js';

export interface UseCaseDependencies {
  webScraper: IWebScraperPort;
  audioIntel: IAudioIntelligencePort;
  videoRenderer: IVideoRendererPort;
  postProcessor: IVideoPostProcessorPort;
  storage: IStoragePort;
}

export class GenerateBrandVideoUseCase implements IGenerateBrandVideo {
  constructor(private readonly deps: UseCaseDependencies) {}

  public async execute(command: GenerateBrandVideoCommand): Promise<VideoDeliverable> {
    const targetUrl = command.url;
    const tone = command.tone || 'cinematic';
    const concurrency = command.concurrency || 1; // Default to single-worker for low RAM safety

    // 1. Scrape live site metadata
    const tempDir = './output/temp';
    const scraped = await this.deps.webScraper.scrapeUrl(targetUrl, tempDir);

    // 2. Instantiate Domain Entity
    const project = BrandProject.create({
      name: scraped.title,
      url: targetUrl,
      tagline: scraped.tagline,
      colors: scraped.colors,
      typography: scraped.typography,
      visuals: scraped.screenshots,
      tone
    });

    const projectDir = await this.deps.storage.ensureProjectDirectory(project.slug);

    // 3. Construct 20s Storyboard
    const isGofApp = targetUrl.includes('design-patterns') || project.name.toLowerCase().includes('design pattern');
    const storyboard = new Storyboard([
      new Scene({
        id: 'scene-1-hook',
        type: 'hook',
        title: isGofApp ? 'Still writing 800-line God Classes?' : 'Tired of slow, bloated software?',
        durationSeconds: 3.0,
        sfxCue: 'boom.wav'
      }),
      new Scene({
        id: 'scene-2-reveal',
        type: 'reveal',
        title: project.name,
        subtitle: project.tagline,
        durationSeconds: 4.0,
        sfxCue: 'whoosh.wav'
      }),
      new Scene({
        id: 'scene-3-highlight',
        type: 'highlight',
        title: isGofApp ? 'Architectural Decision Engine' : 'Engineered for Performance',
        subtitle: isGofApp ? 'Diagnose code smells with live trade-off analysis' : 'Fast, intuitive, and modern UX out of the box',
        durationSeconds: 4.5
      }),
      new Scene({
        id: 'scene-4-feature',
        type: 'feature',
        title: isGofApp ? 'Monaco Playground & Simulators' : 'Live Interactive Capabilities',
        subtitle: isGofApp ? 'Observe patterns executing in real-time' : 'Seamless workflows designed for developers',
        durationSeconds: 5.5
      }),
      new Scene({
        id: 'scene-5-outro',
        type: 'outro',
        title: isGofApp ? 'Master Architecture. Free & Open Source.' : `${project.name} is Live.`,
        subtitle: project.url,
        durationSeconds: 3.0,
        sfxCue: 'chime.wav'
      })
    ]);

    // 4. Voiceover / Captions (Optional)
    let captions: CaptionTrack | null = null;
    try {
      captions = await this.deps.audioIntel.transcribe(`${projectDir}/voice.wav`);
    } catch {
      // Audio transcription optional if no voice track provided
    }

    // 5. Render Video via Renderer Port
    const rawVideoPath = `${projectDir}/raw-render.mp4`;
    await this.deps.videoRenderer.render(project, storyboard, captions, {
      fps: 30,
      width: 1920,
      height: 1080,
      concurrency,
      quality: 'delivery',
      outputFilePath: rawVideoPath
    });

    // 6. Post-Processing: Extract settled frame, mux audio, and bake frame 0
    const posterPath = `${projectDir}/brag.jpg`;
    const finalVideoPath = `${projectDir}/brag.mp4`;
    const audioTrackPath = path.resolve('assets/music/soundtrack.mp3');

    await this.deps.postProcessor.extractPosterFrame(rawVideoPath, 18.5, posterPath);
    await this.deps.postProcessor.bakePosterAndMuxAudio(rawVideoPath, posterPath, audioTrackPath, finalVideoPath);

    // 7. Generate Platform-Ready Share Copy
    const shareCopyText = isGofApp
      ? `Stop reading 30-year-old textbooks to learn software architecture.\n\nWe built ${project.name}: an interactive, visual playground covering all 23 Gang of Four patterns with live Monaco execution, architectural decision trees, and visual simulators.\n\nExplore it live (free & open source): ${project.url}`
      : `${project.name} is officially live.\n\n${project.tagline || 'Experience modern software built for fast execution and high productivity.'}\n\nCheck it out: ${project.url}`;
    const shareCopyPath = await this.deps.storage.saveTextFile(project.slug, 'share-copy.txt', shareCopyText);

    return new VideoDeliverable(
      project.slug,
      finalVideoPath,
      posterPath,
      shareCopyPath,
      shareCopyText,
      {
        durationSeconds: storyboard.getTotalDurationSeconds(),
        width: 1920,
        height: 1080,
        fps: 30,
        hasPosterFrame0: true,
        generatedAt: new Date()
      }
    );
  }
}

