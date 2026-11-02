import * as os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs';
import * as path from 'node:path';

const execFileAsync = promisify(execFile);

export interface DiagnosticCheckResult {
  name: string;
  status: 'ok' | 'warn' | 'error';
  versionOrDetail: string;
  recommendation?: string;
}

export class StudioDoctor {
  public static async runDiagnostics(): Promise<DiagnosticCheckResult[]> {
    const results: DiagnosticCheckResult[] = [];

    // 1. Node.js Check
    const nodeVer = process.version;
    const majorVer = parseInt(nodeVer.replace('v', '').split('.')[0], 10);
    if (majorVer >= 20) {
      results.push({ name: 'Node.js Runtime', status: 'ok', versionOrDetail: nodeVer });
    } else {
      results.push({
        name: 'Node.js Runtime',
        status: 'error',
        versionOrDetail: nodeVer,
        recommendation: 'Node.js >= 20 required for Remotion and React 19.'
      });
    }

    // 2. System RAM Check
    const totalRamGb = Math.round((os.totalmem() / 1024 / 1024 / 1024) * 10) / 10;
    const freeRamGb = Math.round((os.freemem() / 1024 / 1024 / 1024) * 10) / 10;
    if (freeRamGb >= 2.0) {
      results.push({
        name: 'System Memory (RAM)',
        status: 'ok',
        versionOrDetail: `${freeRamGb} GB free / ${totalRamGb} GB total`
      });
    } else {
      results.push({
        name: 'System Memory (RAM)',
        status: 'warn',
        versionOrDetail: `${freeRamGb} GB free / ${totalRamGb} GB total`,
        recommendation: 'Low free memory. Recommend running with --concurrency 1.'
      });
    }

    // 3. FFmpeg Check
    let ffmpegFound = false;
    let ffmpegDetail = 'Not found in PATH';

    const localAppData = process.env.LOCALAPPDATA || '';
    const userProfile = process.env.USERPROFILE || '';
    const candidates = [
      path.join(localAppData, 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'),
      path.join(userProfile, 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'),
      'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe',
      'C:\\ffmpeg\\bin\\ffmpeg.exe',
      '/usr/bin/ffmpeg',
      '/usr/local/bin/ffmpeg'
    ];

    let ffmpegBinary = 'ffmpeg';
    for (const c of candidates) {
      if (c && fs.existsSync(c)) {
        ffmpegBinary = c;
        break;
      }
    }

    try {
      const { stdout } = await execFileAsync(ffmpegBinary, ['-version']);
      const match = stdout.match(/ffmpeg version\s+([^\s]+)/i);
      ffmpegFound = true;
      ffmpegDetail = match ? match[1] : 'Installed';
    } catch {
      // Fallback check
    }

    results.push({
      name: 'FFmpeg Core Tool',
      status: ffmpegFound ? 'ok' : 'error',
      versionOrDetail: ffmpegDetail,
      recommendation: ffmpegFound
        ? undefined
        : 'Install FFmpeg via "winget install Gyan.FFmpeg" (Windows) or package manager.'
    });

    // 4. Chromium / Puppeteer Check
    const chromeCandidates = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      path.join(localAppData, 'Google\\Chrome\\Application\\chrome.exe'),
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser'
    ];
    let chromeFound = false;
    for (const p of chromeCandidates) {
      if (p && fs.existsSync(p)) {
        chromeFound = true;
        break;
      }
    }

    results.push({
      name: 'Chrome / Chromium',
      status: chromeFound ? 'ok' : 'warn',
      versionOrDetail: chromeFound ? 'Detected on host' : 'Puppeteer bundled fallback',
      recommendation: chromeFound ? undefined : 'Install Google Chrome for optimal Remotion render speed.'
    });

    // 5. Whisper CPP Check
    const whisperFound = fs.existsSync('bin/whisper-cli.exe') || fs.existsSync('bin/whisper');
    results.push({
      name: 'Whisper.cpp Speech Intel',
      status: whisperFound ? 'ok' : 'warn',
      versionOrDetail: whisperFound ? 'Local binary ready' : 'Not installed in bin/ (optional for prompt mode)',
      recommendation: whisperFound
        ? undefined
        : 'Whisper is optional for prompt-only generation; required for audio transcription.'
    });

    return results;
  }
}

