import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';
import { IMediaIngestionPort } from '../../../application/ports/outbound/IMediaIngestionPort.js';

const execAsync = promisify(exec);

export class YtDlpAdapter implements IMediaIngestionPort {
  public async downloadAudio(
    url: string,
    outputDir: string,
    fileName: string = 'audio.mp3'
  ): Promise<string> {
    const fullOutputPath = path.join(outputDir, fileName);
    const cmd = `yt-dlp -x --audio-format mp3 -o "${fullOutputPath}" "${url}"`;
    await execAsync(cmd);
    return fullOutputPath;
  }

  public async downloadVideo(
    url: string,
    outputDir: string,
    fileName: string = 'video.mp4'
  ): Promise<string> {
    const fullOutputPath = path.join(outputDir, fileName);
    const cmd = `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" -o "${fullOutputPath}" "${url}"`;
    await execAsync(cmd);
    return fullOutputPath;
  }
}

