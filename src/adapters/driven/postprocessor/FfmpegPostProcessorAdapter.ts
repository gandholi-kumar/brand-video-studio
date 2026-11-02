import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';
import { IVideoPostProcessorPort } from '../../../application/ports/outbound/IVideoPostProcessorPort.js';

const execFileAsync = promisify(execFile);

export class FfmpegPostProcessorAdapter implements IVideoPostProcessorPort {
  private ffmpegPath: string | null = null;

  public getFfmpegExecutable(): string {
    if (this.ffmpegPath) {
      return this.ffmpegPath;
    }

    const localAppData = process.env.LOCALAPPDATA || '';
    const userProfile = process.env.USERPROFILE || '';
    const candidates = [
      path.join(localAppData, 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'),
      path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'),
      path.join(localAppData, 'Microsoft', 'WinGet', 'Packages', 'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe', 'ffmpeg-9.0.2-full_build', 'bin', 'ffmpeg.exe'),
      'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe',
      'C:\\ffmpeg\\bin\\ffmpeg.exe',
      '/usr/bin/ffmpeg',
      '/usr/local/bin/ffmpeg'
    ];

    for (const candidate of candidates) {
      if (candidate && fs.existsSync(candidate)) {
        this.ffmpegPath = candidate;
        return this.ffmpegPath;
      }
    }

    this.ffmpegPath = 'ffmpeg';
    return this.ffmpegPath;
  }

  public async extractPosterFrame(
    videoPath: string,
    timestampSeconds: number,
    outputImagePath: string
  ): Promise<string> {
    const ffmpeg = this.getFfmpegExecutable();
    const args = [
      '-y',
      '-ss',
      String(timestampSeconds),
      '-i',
      path.resolve(videoPath),
      '-frames:v',
      '1',
      '-q:v',
      '2',
      path.resolve(outputImagePath)
    ];

    await execFileAsync(ffmpeg, args);
    return outputImagePath;
  }

  public async bakePosterAsFrame0(
    videoPath: string,
    posterImagePath: string,
    outputVideoPath: string
  ): Promise<string> {
    const ffmpeg = this.getFfmpegExecutable();
    const args = [
      '-y',
      '-i',
      path.resolve(videoPath),
      '-i',
      path.resolve(posterImagePath),
      '-filter_complex',
      "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]",
      '-map',
      '[v]',
      '-map',
      '0:a?',
      '-c:v',
      'libx264',
      '-crf',
      '18',
      '-preset',
      'fast',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'copy',
      '-movflags',
      '+faststart',
      path.resolve(outputVideoPath)
    ];

    await execFileAsync(ffmpeg, args);
    return outputVideoPath;
  }

  public async muxAudio(
    videoPath: string,
    audioPath: string,
    outputVideoPath: string
  ): Promise<string> {
    const ffmpeg = this.getFfmpegExecutable();
    const args = [
      '-y',
      '-i',
      path.resolve(videoPath),
      '-i',
      path.resolve(audioPath),
      '-c:v',
      'copy',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-shortest',
      path.resolve(outputVideoPath)
    ];

    await execFileAsync(ffmpeg, args);
    return outputVideoPath;
  }

  public async bakePosterAndMuxAudio(
    videoPath: string,
    posterImagePath: string,
    audioPath: string,
    outputVideoPath: string,
    totalDurationSeconds: number = 20
  ): Promise<string> {
    const ffmpeg = this.getFfmpegExecutable();
    const fadeStart = Math.max(0, totalDurationSeconds - 2);

    const args = [
      '-y',
      '-i',
      path.resolve(videoPath),
      '-i',
      path.resolve(posterImagePath),
      '-i',
      path.resolve(audioPath),
      '-filter_complex',
      `[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v];[2:a]afade=t=out:st=${fadeStart}:d=2[a]`,
      '-map',
      '[v]',
      '-map',
      '[a]',
      '-c:v',
      'libx264',
      '-crf',
      '18',
      '-preset',
      'fast',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-shortest',
      '-movflags',
      '+faststart',
      path.resolve(outputVideoPath)
    ];

    await execFileAsync(ffmpeg, args);
    return outputVideoPath;
  }

  public async concatVideoChunks(
    chunkPaths: string[],
    outputVideoPath: string
  ): Promise<string> {
    const ffmpeg = this.getFfmpegExecutable();
    const listDir = path.dirname(path.resolve(outputVideoPath));
    const listFilePath = path.join(listDir, 'chunks-concat-list.txt');

    const fileContent = chunkPaths
      .map((p) => `file '${path.resolve(p).replace(/'/g, "'\\''")}'`)
      .join('\n');

    await fsp.writeFile(listFilePath, fileContent, 'utf-8');

    const args = [
      '-y',
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      listFilePath,
      '-c',
      'copy',
      '-movflags',
      '+faststart',
      path.resolve(outputVideoPath)
    ];

    await execFileAsync(ffmpeg, args);
    await fsp.unlink(listFilePath).catch(() => {});
    return outputVideoPath;
  }
}
