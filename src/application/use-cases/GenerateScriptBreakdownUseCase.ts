import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { AspectRatio } from '../../const/video.const.js';
import {
  VideoTopic,
  TOPIC_PALETTES,
  TYPOGRAPHY_TOKENS,
  ColorPaletteTokens
} from '../../const/theme.const.js';
import { VisualStyle } from '../../const/templates.const.js';
import {
  VideoManifest,
  VideoManifestData,
  DynamicSceneBlock,
  SceneLayoutType,
  SoundEffectCue
} from '../../domain/entities/VideoManifest.js';
import { InspirationProfile } from '../ports/outbound/IReferenceVideoAnalyzerPort.js';
import { IOpenverseMediaPort } from '../ports/outbound/IOpenverseMediaPort.js';
import { ScrapedSiteData } from '../ports/outbound/IWebScraperPort.js';

export interface GenerateScriptBreakdownCommand {
  prompt?: string;
  scrapedData?: ScrapedSiteData;
  durationSeconds?: number;
  aspectRatio?: AspectRatio;
  topic?: VideoTopic;
  style?: VisualStyle;
  character?: string;
  inspirationProfile?: InspirationProfile | null;
  outputDirectory?: string;
}

export class GenerateScriptBreakdownUseCase {
  constructor(private readonly openverseMedia?: IOpenverseMediaPort) {}

  private detectTopic(prompt: string): VideoTopic {
    const lower = prompt.toLowerCase();
    if (/\b(science|quantum|physics|biology|chemistry|space|galaxy|planet|molecule)\b/.test(lower)) return 'science';
    if (/\b(history|ancient|century|war|empire|rome|dynasty|medieval|revolution)\b/.test(lower)) return 'history';
    if (/\b(news|breaking|update|report|market|economy|election|global)\b/.test(lower)) return 'news';
    if (/\b(entertainment|movie|gaming|cinema|music|artist|festival|hollywood)\b/.test(lower)) return 'entertainment';
    if (/\b(sports|football|soccer|basketball|nba|olympics|championship|athlete|race)\b/.test(lower)) return 'sports';
    if (/\b(saas|platform|cloud|crm|workflow|enterprise|dashboard|analytics)\b/.test(lower)) return 'saas';
    return 'tech';
  }

  private cleanTitle(prompt: string): string {
    const clean = prompt
      .replace(/^(create|generate|make|build|render)\s+(a\s+)?(video\s+)?(about\s+|on\s+)?/i, '')
      .replace(/\s+in\s+\d+\s*(s|sec|seconds)?$/i, '')
      .trim();
    if (clean.length === 0) return 'Autonomous Motion Showcase';
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  public async execute(command: GenerateScriptBreakdownCommand): Promise<VideoManifest> {
    const rawPrompt = command.prompt?.trim() || '';
    const scraped = command.scrapedData;

    const effectivePrompt = rawPrompt || (scraped ? `${scraped.title} - ${scraped.tagline}` : 'Autonomous Launch');
    const topic = command.topic || this.detectTopic(effectivePrompt);
    const style: VisualStyle = command.style || 'amalgam';
    const aspectRatio: AspectRatio = command.aspectRatio || '16:9';
    const targetDuration = Math.max(15, Math.min(300, command.durationSeconds || 20));

    // Determine title and tagline from scraped site or prompt
    const title = scraped?.title ? scraped.title : this.cleanTitle(effectivePrompt);
    const tagline = scraped?.tagline || `What standard approaches fail to acknowledge about ${topic} in 2026`;
    const id = `video-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    // Pacing resolution from Inspiration Profile or Tone standards
    let shotPacingSeconds = 4.0;
    if (command.inspirationProfile?.pacing?.averageShotHoldSeconds) {
      shotPacingSeconds = Math.max(2.5, Math.min(6.5, command.inspirationProfile.pacing.averageShotHoldSeconds));
    } else if (targetDuration <= 25) {
      shotPacingSeconds = 3.8;
    } else if (targetDuration <= 60) {
      shotPacingSeconds = 5.0;
    } else {
      shotPacingSeconds = 6.0;
    }

    // Number of narrative scenes
    const sceneCount = Math.max(3, Math.round(targetDuration / shotPacingSeconds));
    const baseDuration = Math.round((targetDuration / sceneCount) * 10) / 10;

    // Palette synthesis (Scraped branding takes priority > Inspiration mood > Topic defaults)
    const topicPalette = TOPIC_PALETTES[topic];
    const palette: ColorPaletteTokens = {
      ...topicPalette,
      background: scraped?.colors?.background || topicPalette.background,
      accent: scraped?.colors?.accent || command.inspirationProfile?.palette?.accent || topicPalette.accent,
      secondaryAccent:
        scraped?.colors?.secondaryAccent ||
        command.inspirationProfile?.palette?.secondaryAccent ||
        topicPalette.secondaryAccent
    };

    // Audio cue assignment
    const sfxCues: SoundEffectCue[] = [
      { second: 0.1, soundName: 'whoosh.wav', volume: 0.8 },
      { second: Math.round(targetDuration * 0.4 * 10) / 10, soundName: 'stat-pop.wav', volume: 0.6 },
      { second: Math.max(0, targetDuration - 2.5), soundName: 'chime.wav', volume: 0.9 }
    ];

    // Character configuration
    const isCharEnabled = command.character !== 'none';
    const charType = command.character || 'coder';

    // Dynamic scene block allocation
    const scenes: DynamicSceneBlock[] = [];
    let allocatedTime = 0;

    for (let i = 0; i < sceneCount; i++) {
      const isFirst = i === 0;
      const isLast = i === sceneCount - 1;
      const sceneDuration = isLast
        ? Math.round((targetDuration - allocatedTime) * 10) / 10
        : baseDuration;
      allocatedTime += sceneDuration;

      const sceneId = `scene-${i + 1}`;

      if (isFirst) {
        // Cold Open / Hook (informed by prompt focus or scraped problem)
        const hookTitle = rawPrompt
          ? `The Breakthrough in ${title}`
          : `Still Struggling with Legacy ${topic.toUpperCase()}?`;
        scenes.push({
          id: sceneId,
          layoutType: 'headline',
          title: hookTitle,
          subtitle: rawPrompt ? `Addressing: "${rawPrompt}"` : tagline,
          durationSeconds: sceneDuration,
          badgeText: 'HOOK',
          highlightText: title
        });
      } else if (isLast) {
        // Climax / Outro
        scenes.push({
          id: sceneId,
          layoutType: 'outro-badge',
          title: `Build The Future With ${title}`,
          subtitle: `Autonomous Motion Engine • High-Velocity Production`,
          durationSeconds: sceneDuration,
          badgeText: 'NEXT STEP',
          highlightText: 'Production Ready'
        });
      } else {
        // Core Narrative Evolution
        const blockTypeCycle: SceneLayoutType[] =
          style === 'rough-whiteboard'
            ? ['rough-diagram', 'split-comparison', 'headline']
            : style === 'physics-3d'
            ? ['physics-drop', 'stat-counter', 'split-comparison']
            : style === 'organic-watercolor'
            ? ['watercolor-canvas', 'headline', 'stat-counter']
            : ['stat-counter', 'split-comparison', 'rough-diagram', 'physics-drop'];

        const chosenLayout = blockTypeCycle[(i - 1) % blockTypeCycle.length];

        if (chosenLayout === 'stat-counter') {
          scenes.push({
            id: sceneId,
            layoutType: 'stat-counter',
            title: `Measured Breakthroughs in ${title}`,
            subtitle: rawPrompt || `Empirical benchmarks demonstrating 10x improvement across core metrics`,
            durationSeconds: sceneDuration,
            badgeText: 'BENCHMARKS',
            highlightText: '10x Faster',
            customProps: {
              stats: [
                { label: 'Latency Drop', value: 85, suffix: '%' },
                { label: 'Throughput', value: 120, suffix: 'k/s' },
                { label: 'Reliability', value: 99.9, suffix: '%' }
              ]
            }
          });
        } else if (chosenLayout === 'split-comparison') {
          scenes.push({
            id: sceneId,
            layoutType: 'split-comparison',
            title: `Legacy Systems vs. Modern Paradigms`,
            subtitle: `Comparing manual friction against autonomous execution`,
            durationSeconds: sceneDuration,
            badgeText: 'TRADE-OFFS',
            highlightText: 'High Velocity',
            customProps: {
              comparison: {
                leftTitle: 'Traditional Methods',
                leftItems: ['High manual overhead', 'Slow iteration cycle', 'Fragile brittle tooling'],
                rightTitle: `Modern ${title}`,
                rightItems: ['Autonomous orchestration', 'Real-time feedback loop', 'Resilient dumb-component design']
              }
            }
          });
        } else if (chosenLayout === 'rough-diagram') {
          scenes.push({
            id: sceneId,
            layoutType: 'rough-diagram',
            title: `Core Architectural Topology`,
            subtitle: rawPrompt ? `Architectural flow for: ${rawPrompt}` : `Decoupled components cooperating across event boundaries`,
            durationSeconds: sceneDuration,
            badgeText: 'ARCHITECTURE',
            highlightText: 'Decoupled',
            customProps: {
              diagram: {
                nodes: [
                  { id: '1', label: scraped?.title ? scraped.title : 'Input Source', x: 200, y: 350 },
                  { id: '2', label: 'Amalgam Engine', x: 500, y: 350 },
                  { id: '3', label: '1080p Master', x: 800, y: 350 }
                ],
                links: [
                  { from: '1', to: '2', label: 'Stream' },
                  { from: '2', to: '3', label: 'Render' }
                ]
              }
            }
          });
        } else if (chosenLayout === 'physics-drop') {
          scenes.push({
            id: sceneId,
            layoutType: 'physics-drop',
            title: `Impact & Kinetic Weight`,
            subtitle: `Gravity-driven elements colliding and settling into locked alignments`,
            durationSeconds: sceneDuration,
            badgeText: 'PHYSICS',
            highlightText: 'Newtonian Motion',
            customProps: {
              badges: ['Accuracy', 'Purity', 'Velocity', 'Resilience', 'Autonomy']
            }
          });
        } else {
          scenes.push({
            id: sceneId,
            layoutType: 'watercolor-canvas',
            title: `Harmonic Fluid Dynamics`,
            subtitle: `Organic pigment dispersion visualizing complex data fields`,
            durationSeconds: sceneDuration,
            badgeText: 'ARTISTRY',
            highlightText: 'Organic Flow'
          });
        }
      }
    }

    // Audio soundtrack resolution (relative path for portable manifest)
    let soundtrackPath = 'assets/music/soundtrack.mp3';
    if (this.openverseMedia) {
      try {
        const audioDir = 'output/temp/audio';
        soundtrackPath = await this.openverseMedia.getAudioForTopic(topic, audioDir);
      } catch {
        // Fallback to local soundtrack
      }
    }

    const manifestData: VideoManifestData = {
      version: '2.0',
      id,
      title,
      topic,
      aspectRatio,
      style,
      totalDurationSeconds: targetDuration,
      fps: 30,
      theme: {
        palette,
        typography: TYPOGRAPHY_TOKENS
      },
      audio: {
        soundtrackPath,
        duckingDb: -14,
        sfxCues
      },
      character: {
        enabled: isCharEnabled,
        type: charType
      },
      scenes
    };

    const manifest = new VideoManifest(manifestData);

    if (command.outputDirectory) {
      await fs.mkdir(command.outputDirectory, { recursive: true });
      const manifestFile = path.join(command.outputDirectory, 'manifest.json');
      await fs.writeFile(manifestFile, JSON.stringify(manifestData, null, 2), 'utf-8');
    }

    return manifest;
  }
}
