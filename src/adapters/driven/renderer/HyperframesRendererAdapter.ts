import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { IVideoRendererPort, RenderConfig, RenderResult } from '../../../application/ports/outbound/IVideoRendererPort.js';
import { BrandProject } from '../../../domain/entities/BrandProject.js';
import { Storyboard } from '../../../domain/value-objects/Storyboard.js';
import { CaptionTrack } from '../../../domain/value-objects/CaptionTrack.js';

const execAsync = promisify(exec);

export class HyperframesRendererAdapter implements IVideoRendererPort {
  public readonly engineName = 'Hyperframes (HTML/GSAP)';

  public async render(
    _project: BrandProject,
    storyboard: Storyboard,
    _captions: CaptionTrack | null,
    config: RenderConfig
  ): Promise<RenderResult> {
    const cmd = `pnpm dlx hyperframes render --output "${config.outputFilePath}" --quality ${config.quality}`;
    await execAsync(cmd);

    return {
      outputFilePath: config.outputFilePath,
      durationSeconds: storyboard.getTotalDurationSeconds(),
      renderedFramesCount: storyboard.getTotalDurationSeconds() * config.fps
    };
  }
}

