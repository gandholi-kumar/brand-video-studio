import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';
import { IVideoRendererPort, RenderConfig, RenderResult } from '../../../application/ports/outbound/IVideoRendererPort.js';
import { BrandProject } from '../../../domain/entities/BrandProject.js';
import { Storyboard } from '../../../domain/value-objects/Storyboard.js';
import { CaptionTrack } from '../../../domain/value-objects/CaptionTrack.js';

const execFileAsync = promisify(execFile);

export class HyperframesRendererAdapter implements IVideoRendererPort {
  public readonly engineName = 'Hyperframes (HTML/GSAP)';

  public async render(
    _project: BrandProject,
    storyboard: Storyboard,
    _captions: CaptionTrack | null,
    config: RenderConfig
  ): Promise<RenderResult> {
    const isWindows = process.platform === 'win32';
    const pnpmBin = isWindows ? 'pnpm.cmd' : 'pnpm';
    const args = [
      'dlx',
      'hyperframes',
      'render',
      '--output',
      path.resolve(config.outputFilePath),
      '--quality',
      String(config.quality)
    ];

    await execFileAsync(pnpmBin, args, { shell: isWindows });

    return {
      outputFilePath: config.outputFilePath,
      durationSeconds: storyboard.getTotalDurationSeconds(),
      renderedFramesCount: storyboard.getTotalDurationSeconds() * config.fps
    };
  }
}
