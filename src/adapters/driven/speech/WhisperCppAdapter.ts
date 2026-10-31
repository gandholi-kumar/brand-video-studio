import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { IAudioIntelligencePort } from '../../../application/ports/outbound/IAudioIntelligencePort.js';
import { CaptionTrack, WordTimestamp } from '../../../domain/value-objects/CaptionTrack.js';

const execAsync = promisify(exec);

export class WhisperCppAdapter implements IAudioIntelligencePort {
  private readonly cliPath: string;
  private readonly modelPath: string;

  constructor(cliPath?: string, modelPath?: string) {
    this.cliPath = cliPath || path.resolve('tools/whisper/Release/whisper-cli.exe');
    this.modelPath = modelPath || path.resolve('tools/whisper/ggml-tiny.en.bin');
  }

  public async transcribe(audioFilePath: string): Promise<CaptionTrack> {
    const outputPrefix = audioFilePath.replace(/\.[^/.]+$/, '');
    const cmd = `"${this.cliPath}" -m "${this.modelPath}" -f "${audioFilePath}" -ojf -of "${outputPrefix}"`;

    await execAsync(cmd);

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

