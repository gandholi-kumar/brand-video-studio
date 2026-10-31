import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { IVideoPostProcessorPort } from '../../../application/ports/outbound/IVideoPostProcessorPort.js';

const execAsync = promisify(exec);

export class FfmpegPostProcessorAdapter implements IVideoPostProcessorPort {
  public async extractPosterFrame(
    videoPath: string,
    timestampSeconds: number,
    outputImagePath: string
  ): Promise<string> {
    const cmd = `ffmpeg -y -ss ${timestampSeconds} -i "${videoPath}" -frames:v 1 -q:v 2 "${outputImagePath}"`;
    await execAsync(cmd);
    return outputImagePath;
  }

  public async bakePosterAsFrame0(
    videoPath: string,
    posterImagePath: string,
    outputVideoPath: string
  ): Promise<string> {
    const cmd = `ffmpeg -y -i "${videoPath}" -i "${posterImagePath}" -filter_complex "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]" -map "[v]" -map "0:a?" -c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p -c:a copy -movflags +faststart "${outputVideoPath}"`;
    await execAsync(cmd);
    return outputVideoPath;
  }

  public async muxAudio(
    videoPath: string,
    audioPath: string,
    outputVideoPath: string
  ): Promise<string> {
    const cmd = `ffmpeg -y -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -b:a 192k -shortest "${outputVideoPath}"`;
    await execAsync(cmd);
    return outputVideoPath;
  }

  public async bakePosterAndMuxAudio(
    videoPath: string,
    posterImagePath: string,
    audioPath: string,
    outputVideoPath: string
  ): Promise<string> {
    const cmd = `ffmpeg -y -i "${videoPath}" -i "${posterImagePath}" -i "${audioPath}" -filter_complex "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v];[2:a]afade=t=out:st=18:d=2[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "${outputVideoPath}"`;
    await execAsync(cmd);
    return outputVideoPath;
  }
}
