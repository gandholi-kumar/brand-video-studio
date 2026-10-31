import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
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
    const propsDir = path.dirname(path.resolve(config.outputFilePath));
    await fs.mkdir(propsDir, { recursive: true });
    const propsFilePath = path.join(propsDir, 'render-props.json');

    const propsPayload = {
      projectName: project.name,
      projectUrl: project.url,
      tagline: project.tagline,
      colors: project.colors,
      typography: project.typography,
      totalDuration: storyboard.getTotalDurationSeconds(),
      captions: captions ? captions.words : [],
      scenes: storyboard.scenes.map((s) => ({
        id: s.id,
        type: s.type,
        title: s.title,
        subtitle: s.subtitle
      }))
    };

    await fs.writeFile(propsFilePath, JSON.stringify(propsPayload, null, 2), 'utf-8');

    // Execute Remotion CLI passing the resilient props file
    const cmd = `pnpm remotion render src/composition/index.ts BrandVideo "${config.outputFilePath}" --props="${propsFilePath}" --concurrency=${config.concurrency} --quality=${config.quality === 'draft' ? 50 : 80}`;

    await execAsync(cmd);

    const totalFrames = storyboard.getTotalDurationSeconds() * config.fps;

    return {
      outputFilePath: config.outputFilePath,
      durationSeconds: storyboard.getTotalDurationSeconds(),
      renderedFramesCount: totalFrames
    };
  }
}

