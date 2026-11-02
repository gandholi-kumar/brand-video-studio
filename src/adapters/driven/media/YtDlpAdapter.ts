import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';
import { IMediaIngestionPort } from '../../../application/ports/outbound/IMediaIngestionPort.js';

const execFileAsync = promisify(execFile);

export class YtDlpAdapter implements IMediaIngestionPort {
  private validateUrl(rawUrl: string): string {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`Security Exception: Protocol '${parsed.protocol}' is forbidden for media download.`);
    }
    return parsed.toString();
  }

  public async downloadAudio(
    url: string,
    outputDir: string,
    fileName: string = 'audio.mp3'
  ): Promise<string> {
    const safeUrl = this.validateUrl(url);
    const fullOutputPath = path.join(outputDir, fileName);

    const args = [
      '-x',
      '--audio-format',
      'mp3',
      '-o',
      fullOutputPath,
      '--no-playlist',
      safeUrl
    ];

    await execFileAsync('yt-dlp', args);
    return fullOutputPath;
  }

  public async downloadVideo(
    url: string,
    outputDir: string,
    fileName: string = 'video.mp4'
  ): Promise<string> {
    const safeUrl = this.validateUrl(url);
    const fullOutputPath = path.join(outputDir, fileName);

    const args = [
      '-f',
      'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]',
      '-o',
      fullOutputPath,
      '--no-playlist',
      safeUrl
    ];

    await execFileAsync('yt-dlp', args);
    return fullOutputPath;
  }
}
