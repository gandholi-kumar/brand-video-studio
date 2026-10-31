import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GenerateBrandVideoUseCase } from '../../application/use-cases/GenerateBrandVideoUseCase.js';
import { IWebScraperPort, ScrapedSiteData } from '../../application/ports/outbound/IWebScraperPort.js';
import { IAudioIntelligencePort } from '../../application/ports/outbound/IAudioIntelligencePort.js';
import { IVideoRendererPort, RenderConfig, RenderResult } from '../../application/ports/outbound/IVideoRendererPort.js';
import { IVideoPostProcessorPort } from '../../application/ports/outbound/IVideoPostProcessorPort.js';
import { IStoragePort } from '../../application/ports/outbound/IStoragePort.js';
import { BrandProject } from '../../domain/entities/BrandProject.js';
import { Storyboard } from '../../domain/value-objects/Storyboard.js';
import { CaptionTrack } from '../../domain/value-objects/CaptionTrack.js';

describe('GenerateBrandVideoUseCase (Hexagonal Orchestration)', () => {
  it('executes end-to-end pipeline using mocked outbound ports', async () => {
    // 1. Mock Outbound Driven Ports
    const mockScraper: IWebScraperPort = {
      async scrapeUrl(_url: string, _outputDir: string): Promise<ScrapedSiteData> {
        return {
          title: 'Test Masterclass',
          tagline: 'Interactive testing playground',
          colors: {
            background: '#0a0a0a',
            foreground: '#ffffff',
            accent: '#3b82f6',
            secondaryAccent: '#10b981',
            border: '#27272a'
          },
          typography: {
            display: 'Inter, sans-serif',
            body: 'Inter, sans-serif',
            mono: 'JetBrains Mono, monospace'
          },
          screenshots: [
            {
              name: 'Hero Viewport',
              filePath: '/tmp/hero.png',
              caption: 'Landing'
            }
          ]
        };
      }
    };

    const mockAudioIntel: IAudioIntelligencePort = {
      async transcribe(_audioFilePath: string): Promise<CaptionTrack> {
        return new CaptionTrack([
          { word: 'Test', start: 0, end: 1 }
        ]);
      }
    };

    let renderedProject: BrandProject | null = null;
    let renderedStoryboard: Storyboard | null = null;
    const mockRenderer: IVideoRendererPort = {
      engineName: 'MockEngine',
      async render(
        project: BrandProject,
        storyboard: Storyboard,
        _captions: CaptionTrack | null,
        config: RenderConfig
      ): Promise<RenderResult> {
        renderedProject = project;
        renderedStoryboard = storyboard;
        return {
          outputFilePath: config.outputFilePath,
          durationSeconds: storyboard.getTotalDurationSeconds(),
          renderedFramesCount: storyboard.getTotalDurationSeconds() * config.fps
        };
      }
    };

    let bakedAudio = false;
    let extractedPoster = false;
    const mockPostProcessor: IVideoPostProcessorPort = {
      async extractPosterFrame(_videoPath: string, _timestampSeconds: number, outputImagePath: string): Promise<string> {
        extractedPoster = true;
        return outputImagePath;
      },
      async bakePosterAsFrame0(_videoPath: string, _posterImagePath: string, outputVideoPath: string): Promise<string> {
        return outputVideoPath;
      },
      async muxAudio(_videoPath: string, _audioPath: string, outputVideoPath: string): Promise<string> {
        return outputVideoPath;
      },
      async bakePosterAndMuxAudio(
        _videoPath: string,
        _posterImagePath: string,
        _audioPath: string,
        outputVideoPath: string
      ): Promise<string> {
        bakedAudio = true;
        return outputVideoPath;
      }
    };

    const savedFiles = new Map<string, string>();
    const mockStorage: IStoragePort = {
      async ensureProjectDirectory(projectSlug: string): Promise<string> {
        return `/mock/output/${projectSlug}`;
      },
      async saveTextFile(projectSlug: string, relativePath: string, content: string): Promise<string> {
        const fullPath = `/mock/output/${projectSlug}/${relativePath}`;
        savedFiles.set(fullPath, content);
        return fullPath;
      },
      async fileExists(_absolutePath: string): Promise<boolean> {
        return true;
      }
    };

    // 2. Instantiate Use Case
    const useCase = new GenerateBrandVideoUseCase({
      webScraper: mockScraper,
      audioIntel: mockAudioIntel,
      videoRenderer: mockRenderer,
      postProcessor: mockPostProcessor,
      storage: mockStorage
    });

    // 3. Execute
    const deliverable = await useCase.execute({
      url: 'https://example.com/test-masterclass',
      tone: 'cinematic',
      concurrency: 1
    });

    // 4. Assert Domain State & Deliverable
    assert.ok(deliverable);
    assert.equal(deliverable.projectSlug, 'test-masterclass');
    assert.equal(deliverable.isComplete(), true);
    assert.equal(extractedPoster, true);
    assert.equal(bakedAudio, true);
    assert.ok(renderedProject);
    assert.ok(renderedStoryboard);
    assert.equal((renderedStoryboard as Storyboard).getTotalDurationSeconds(), 20.0);
    assert.equal(savedFiles.has('/mock/output/test-masterclass/share-copy.txt'), true);
  });
});
