import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs/promises';
import * as nfs from 'node:fs';
import * as path from 'node:path';
import { IAudioIntelligencePort } from '../../../application/ports/outbound/IAudioIntelligencePort.js';
import { CaptionTrack, WordTimestamp } from '../../../domain/value-objects/CaptionTrack.js';

const execFileAsync = promisify(execFile);

export class WhisperCppAdapter implements IAudioIntelligencePort {
  private readonly cliPath: string;
  private readonly modelPath: string;

  constructor(cliPath?: string, modelPath?: string) {
    if (cliPath && nfs.existsSync(cliPath)) {
      this.cliPath = cliPath;
    } else {
      const isWin = process.platform === 'win32';
      const defaultWinPath = path.resolve('tools/whisper/Release/whisper-cli.exe');
      const defaultUnixPath = path.resolve('tools/whisper/Release/whisper-cli');

      if (isWin && nfs.existsSync(defaultWinPath)) {
        this.cliPath = defaultWinPath;
      } else if (!isWin && nfs.existsSync(defaultUnixPath)) {
        this.cliPath = defaultUnixPath;
      } else {
        this.cliPath = isWin ? defaultWinPath : 'whisper-cli';
      }
    }

    this.modelPath = modelPath || path.resolve('tools/whisper/ggml-tiny.en.bin');
  }

  public async transcribe(audioFilePath: string): Promise<CaptionTrack> {
    const outputPrefix = audioFilePath.replace(/\.[^/.]+$/, '');
    const args = [
      '-m',
      this.modelPath,
      '-f',
      path.resolve(audioFilePath),
      '-ojf',
      '-of',
      outputPrefix
    ];

    await execFileAsync(this.cliPath, args);

    const jsonPath = `${outputPrefix}.json`;
    const rawContent = await fs.readFile(jsonPath, 'utf-8');
    const parsed = JSON.parse(rawContent);

    const words: WordTimestamp[] = [];

    if (parsed.transcription && Array.isArray(parsed.transcription)) {
      for (const segment of parsed.transcription) {
        if (segment.tokens && Array.isArray(segment.tokens)) {
          for (const token of segment.tokens) {
            if (token.text && token.text.trim()) {
              words.push({
                word: token.text.trim(),
                start: (token.timestamps?.from_ms || 0) / 1000,
                end: (token.timestamps?.to_ms || 0) / 1000
              });
            }
          }
        }
      }
    }

    return new CaptionTrack(words);
  }
}
