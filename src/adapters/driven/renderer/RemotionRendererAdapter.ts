import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { IVideoRendererPort, RenderConfig, RenderResult } from '../../../application/ports/outbound/IVideoRendererPort.js';
import { BrandProject } from '../../../domain/entities/BrandProject.js';
import { Storyboard } from '../../../domain/value-objects/Storyboard.js';
import { CaptionTrack } from '../../../domain/value-objects/CaptionTrack.js';

const execAsync = promisify(exec);

export class RemotionRendererAdapter implements IVideoRendererPort {
  public readonly engineName = 'Remotion (React 19)';

  public async render(
    project: BrandProject,
    storyboard: Storyboard,
    captions: CaptionTrack | null,
    config: RenderConfig
  ): Promise<RenderResult> {
    const propsJson = JSON.stringify({
      projectName: project.name,
      tagline: project.tagline,
      colors: project.colors,
      typography: project.typography,
      totalDuration: storyboard.getTotalDurationSeconds(),
      captions: captions ? captions.words : []
    }).replace(/"/g, '\\"');

    // Execute Remotion CLI with strict single-worker concurrency for low-RAM safety
    const cmd = `pnpm remotion render src/composition/Root.tsx BrandVideo "${config.outputFilePath}" --props="${propsJson}" --concurrency=${config.concurrency} --quality=${config.quality === 'draft' ? 50 : 80}`;

    await execAsync(cmd);

    const totalFrames = storyboard.getTotalDurationSeconds() * config.fps;

    return {
      outputFilePath: config.outputFilePath,
      durationSeconds: storyboard.getTotalDurationSeconds(),
      renderedFramesCount: totalFrames
    };
  }
}

