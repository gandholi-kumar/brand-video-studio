import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  IReferenceVideoAnalyzerPort,
  InspirationProfile
} from '../ports/outbound/IReferenceVideoAnalyzerPort.js';
import { IMediaIngestionPort } from '../ports/outbound/IMediaIngestionPort.js';

export interface AnalyzeReferenceVideoCommand {
  referenceInput?: string; // Optional path or URL. If omitted, scans inputs/inspiration/
  inspirationDirectory?: string;
}

export class AnalyzeReferenceVideoUseCase {
  constructor(
    private readonly analyzer: IReferenceVideoAnalyzerPort,
    private readonly mediaDownloader?: IMediaIngestionPort
  ) {}

  public async execute(command: AnalyzeReferenceVideoCommand): Promise<InspirationProfile | null> {
    const inspirationDir = path.resolve(command.inspirationDirectory || 'inputs/inspiration');
    await fs.mkdir(inspirationDir, { recursive: true });

    let targetVideoPath: string | null = null;

    if (command.referenceInput) {
      const input = command.referenceInput.trim();
      const isUrl = input.startsWith('http://') || input.startsWith('https://');

      if (isUrl) {
        if (!this.mediaDownloader) {
          throw new Error('Media downloader port not configured for remote reference URL.');
        }
        targetVideoPath = await this.mediaDownloader.downloadVideo(input, inspirationDir, 'reference-download');
      } else {
        const resolved = path.resolve(input);
        try {
          await fs.access(resolved);
          targetVideoPath = resolved;
        } catch {
          throw new Error(`Reference video file not found at path: ${input}`);
        }
      }
    } else {
      // Auto-scan inputs/inspiration/ for dropped video files
      try {
        const files = await fs.readdir(inspirationDir);
        const videoExtensions = ['.mp4', '.mov', '.webm', '.mkv'];
        const found = files.find((f) => videoExtensions.includes(path.extname(f).toLowerCase()));
        if (found) {
          targetVideoPath = path.join(inspirationDir, found);
        }
      } catch {
        // Directory may be empty
      }
    }

    if (!targetVideoPath) {
      // No reference video provided or found
      return null;
    }

    const profile = await this.analyzer.analyzeVideo(targetVideoPath);

    // Save profile snapshot for inspection and agent reuse
    const profileSavePath = path.join(inspirationDir, 'inspiration-profile.json');
    await fs.writeFile(profileSavePath, JSON.stringify(profile, null, 2), 'utf-8');

    return profile;
  }
}

