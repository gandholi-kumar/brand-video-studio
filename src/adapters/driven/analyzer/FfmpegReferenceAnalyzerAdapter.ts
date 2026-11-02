import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  IReferenceVideoAnalyzerPort,
  InspirationProfile,
  InspirationPacingMetrics,
  InspirationCadenceMetrics
} from '../../../application/ports/outbound/IReferenceVideoAnalyzerPort.js';
import { WhisperCppAdapter } from '../speech/WhisperCppAdapter.js';

const execFileAsync = promisify(execFile);

export class FfmpegReferenceAnalyzerAdapter implements IReferenceVideoAnalyzerPort {
  private ffmpegPath: string | null = null;
  private readonly whisper: WhisperCppAdapter;

  constructor(whisper?: WhisperCppAdapter) {
    this.whisper = whisper || new WhisperCppAdapter();
  }

  private getFfmpegExecutable(): string {
    if (this.ffmpegPath) return this.ffmpegPath;

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

  public async analyzeVideo(videoPath: string): Promise<InspirationProfile> {
    const resolvedPath = path.resolve(videoPath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Reference video file not found: ${resolvedPath}`);
    }

    const ffmpeg = this.getFfmpegExecutable();

    // 1. Detect Scene Cuts via FFmpeg showinfo filter
    const cutTimestamps: number[] = [0];
    let totalDurationSeconds = 20;

    try {
      const args = [
        '-i',
        resolvedPath,
        '-filter:v',
        "select='gt(scene,0.3)',showinfo",
        '-f',
        'null',
        '-'
      ];

      const { stderr } = await execFileAsync(ffmpeg, args);
      const matches = stderr.matchAll(/pts_time:([0-9.]+)/g);
      for (const match of matches) {
        const time = parseFloat(match[1]);
        if (!isNaN(time) && !cutTimestamps.includes(time)) {
          cutTimestamps.push(Math.round(time * 10) / 10);
        }
      }

      // Check duration from stderr
      const durMatch = stderr.match(/Duration:\s*([0-9:.]+)/);
      if (durMatch && durMatch[1]) {
        const parts = durMatch[1].split(':');
        if (parts.length === 3) {
          totalDurationSeconds =
            parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
        }
      }
    } catch {
      // Fallback if video has unusual container
    }

    // Sort and calculate pacing
    cutTimestamps.sort((a, b) => a - b);
    const sceneCutCount = Math.max(1, cutTimestamps.length);
    const averageShotHoldSeconds =
      totalDurationSeconds > 0
        ? Math.round((totalDurationSeconds / sceneCutCount) * 10) / 10
        : 3.5;

    let intensity: 'fast-paced' | 'moderate' | 'contemplative' = 'moderate';
    if (averageShotHoldSeconds < 2.5) intensity = 'fast-paced';
    else if (averageShotHoldSeconds > 5.0) intensity = 'contemplative';

    const pacing: InspirationPacingMetrics = {
      sceneCutCount,
      averageShotHoldSeconds,
      cutTimestamps,
      intensity
    };

    // 2. Extract Speech Cadence via Whisper
    let cadence: InspirationCadenceMetrics = {
      wordsPerMinute: 140,
      totalSpokenWords: 0,
      averageWordDurationMs: 350
    };

    try {
      const captionTrack = await this.whisper.transcribe(resolvedPath);
      if (captionTrack.words.length > 0) {
        const totalWords = captionTrack.words.length;
        const minutes = Math.max(0.2, totalDurationSeconds / 60);
        const wpm = Math.round(totalWords / minutes);
        cadence = {
          wordsPerMinute: wpm,
          totalSpokenWords: totalWords,
          averageWordDurationMs: Math.round((totalDurationSeconds / totalWords) * 1000)
        };
      }
    } catch {
      // Speech transcription optional if reference has no audio
    }

    // 3. Dominant Color Mood (Inferred from video characteristics)
    const palette = {
      accent: intensity === 'fast-paced' ? '#f59e0b' : '#38bdf8',
      secondaryAccent: intensity === 'fast-paced' ? '#ef4444' : '#06b6d4',
      background: '#090d16'
    };

    return {
      sourceFileName: path.basename(resolvedPath),
      durationSeconds: Math.round(totalDurationSeconds * 10) / 10,
      pacing,
      palette,
      cadence,
      analyzedAt: new Date()
    };
  }
}

