import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { IVideoRendererPort, RenderConfig, RenderResult } from '../../../application/ports/outbound/IVideoRendererPort.js';
import { BrandProject } from '../../../domain/entities/BrandProject.js';
import { Storyboard } from '../../../domain/value-objects/Storyboard.js';
import { CaptionTrack } from '../../../domain/value-objects/CaptionTrack.js';
import { VideoManifest } from '../../../domain/entities/VideoManifest.js';

const execFileAsync = promisify(execFile);

export class RemotionRendererAdapter implements IVideoRendererPort {
  public readonly engineName = 'Remotion (React 19)';

  public async render(
    project: BrandProject,
    storyboard: Storyboard,
    captions: CaptionTrack | null,
    config: RenderConfig
  ): Promise<RenderResult> {
    const propsDir = path.dirname(path.resolve(config.outputFilePath));
    await fs.mkdir(propsDir, { recursive: true });
    const propsFilePath = path.join(propsDir, 'render-props.json');

    const propsPayload = {
      projectName: project.name,
      projectUrl: project.url,
      tagline: project.tagline,
      colors: project.colors,
      typography: project.typography,
      character: config.character,
      totalDuration: storyboard.getTotalDurationSeconds(),
      captions: captions ? captions.words : [],
      scenes: storyboard.scenes.map((s) => ({
        id: s.id,
        type: s.type,
        title: s.title,
        subtitle: s.subtitle,
        durationSeconds: s.durationSeconds
      }))
    };

    await fs.writeFile(propsFilePath, JSON.stringify(propsPayload, null, 2), 'utf-8');

    // Securely invoke Remotion CLI directly via node executable (no shell, zero RCE risk)
    const compositionId = config.compositionId || 'BrandVideo';
    const nodeBin = process.execPath;
    const remotionCli = path.resolve('node_modules/@remotion/cli/remotion-cli.js');
    const qualityVal = String(config.quality === 'draft' ? 50 : 80);

    const args = [
      remotionCli,
      'render',
      'src/composition/index.ts',
      compositionId,
      path.resolve(config.outputFilePath),
      `--props=${propsFilePath}`,
      `--concurrency=${config.concurrency}`,
      `--quality=${qualityVal}`
    ];

    await execFileAsync(nodeBin, args);

    const totalFrames = storyboard.getTotalDurationSeconds() * config.fps;

    return {
      outputFilePath: config.outputFilePath,
      durationSeconds: storyboard.getTotalDurationSeconds(),
      renderedFramesCount: totalFrames
    };
  }

  public async renderManifest(
    manifest: VideoManifest,
    config: RenderConfig
  ): Promise<RenderResult> {
    const propsDir = path.dirname(path.resolve(config.outputFilePath));
    await fs.mkdir(propsDir, { recursive: true });
    const propsFilePath = path.join(propsDir, 'render-props.json');

    const propsPayload = {
      manifest: manifest.data
    };

    await fs.writeFile(propsFilePath, JSON.stringify(propsPayload, null, 2), 'utf-8');

    const isPortrait = manifest.data.aspectRatio === '9:16';
    const compositionId =
      config.compositionId || (isPortrait ? 'UniversalVideo-Portrait' : 'UniversalVideo-Landscape');
    const nodeBin = process.execPath;
    const remotionCli = path.resolve('node_modules/@remotion/cli/remotion-cli.js');
    const qualityVal = String(config.quality === 'draft' ? 50 : 80);

    const args = [
      remotionCli,
      'render',
      'src/composition/index.ts',
      compositionId,
      path.resolve(config.outputFilePath),
      `--props=${propsFilePath}`,
      `--concurrency=${config.concurrency}`,
      `--quality=${qualityVal}`
    ];

    await execFileAsync(nodeBin, args);

    const totalFrames = manifest.data.totalDurationSeconds * config.fps;

    return {
      outputFilePath: config.outputFilePath,
      durationSeconds: manifest.data.totalDurationSeconds,
      renderedFramesCount: totalFrames
    };
  }
}

