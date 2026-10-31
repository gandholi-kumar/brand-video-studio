# Brand Video Studio — Developer Setup & Operational Runbook

> **Complete guide for setting up, running, debugging, and extending Brand Video Studio locally.**  
> *Designed for local $0 workstation execution on macOS, Linux, and Windows.*

---

## 1. System Prerequisites

Brand Video Studio leverages high-performance native CLI tools to minimize RAM and CPU overhead during video synthesis. Ensure the following tools are installed:

| Tool | Minimum Version | Purpose | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 20.0.0` (LTS recommended) | TypeScript runtime & Remotion host | `node -v` |
| **pnpm** | `>= 9.0.0` | Monorepo-compatible package manager | `pnpm -v` |
| **FFmpeg & FFprobe** | `>= 6.0` (v9.0+ tested) | Video remuxing, AAC encoding, poster capture | `ffmpeg -version` |
| **yt-dlp** | `>= 2024.0.0` | Open-source soundtrack & media ingestion | `yt-dlp --version` |
| **whisper.cpp** | `>= 1.5.0` (Release b5454+) | Quantized, lightweight word-level speech transcription | `tools/whisper/Release/whisper-cli.exe --help` |
| **Google Chrome** | Current Stable | Headless SPA DOM scraping & Remotion frame canvas | `chrome.exe --version` |

---

## 2. Step-by-Step Installation

### 2.1 Repository Setup
Clone the repository and install Node.js dependencies:
```bash
git clone <repo-url> brand-video-studio
cd brand-video-studio
pnpm install
```

---

### 2.2 Native Tool Installation by Operating System

#### Windows (PowerShell / Windows Terminal)
Install FFmpeg and yt-dlp via `winget`:
```powershell
# 1. Install FFmpeg Full Build
winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements

# 2. Install yt-dlp
winget install --id yt-dlp.yt-dlp -e --accept-source-agreements --accept-package-agreements

# 3. Reload environment PATH in current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

#### macOS (Homebrew)
```bash
brew install ffmpeg yt-dlp
```

#### Linux (Ubuntu / Debian)
```bash
sudo apt update
sudo apt install -y ffmpeg
# Install latest yt-dlp binary
sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

---

### 2.3 Setting Up whisper.cpp & Speech Models

Brand Video Studio uses pre-quantized GGUF/GGML models to eliminate Python and PyTorch dependencies, keeping memory consumption under 150 MB.

1. Ensure the directory structure exists:
   ```text
   tools/whisper/
   ├── Release/
   │   └── whisper-cli.exe   (or 'whisper-cli' on Unix)
   └── ggml-tiny.en.bin      (77.7 MB quantized model)
   ```

2. Download `whisper-cli` binary:
   - **Windows:** Download the precompiled release `whisper-bin-x64.zip` from [ggerganov/whisper.cpp releases](https://github.com/ggerganov/whisper.cpp/releases) and place `whisper-cli.exe` into `tools/whisper/Release/`.
   - **macOS / Linux:** Clone and build in 30 seconds:
     ```bash
     git clone https://github.com/ggerganov/whisper.cpp.git
     cd whisper.cpp && make whisper-cli
     cp build/bin/whisper-cli path/to/brand-video-studio/tools/whisper/Release/
     ```

3. Download the quantized model (`ggml-tiny.en.bin`):
   ```bash
   # From project root
   curl -L -o tools/whisper/ggml-tiny.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.en.bin
   ```

4. Verify local execution:
   ```bash
   # Windows
   .\tools\whisper\Release\whisper-cli.exe --help
   # macOS / Linux
   ./tools/whisper/Release/whisper-cli --help
   ```

---

## 3. Hardware & Low-RAM Guidelines

If you are developing or rendering on a resource-constrained machine (e.g. 2 CPU cores, 8 GB total RAM with <1.5 GB free), follow these critical performance rules:

### Rule 1: Always Enforce Single-Worker Rendering (`--concurrency 1`)
Remotion's default behavior is to spin up multiple concurrent headless Chrome browser instances (matching CPU core count). In low-memory environments, multiple instances cause memory exhaustion, swap trashing, and OS kills.

Our adapters enforce `--concurrency 1` by default:
```bash
# Correct: Uses ~950 MB RAM safely
pnpm remotion render src/composition/index.ts BrandVideo output/video.mp4 --concurrency 1

# CAUTION: Do NOT omit --concurrency on low-RAM machines
```

### Rule 2: Keep Whisper Models Quantized
- `ggml-tiny.en.bin`: **77 MB RAM**, 1.5s transcription time. (Recommended)
- `ggml-base.en.bin`: **145 MB RAM**, 3.0s transcription time.
- Avoid unquantized PyTorch models or `large-v3` unless running with a dedicated GPU.

---

## 4. Local Development Commands

The following scripts are defined in `package.json`:

```bash
# 1. Launch Remotion Studio (Interactive Browser Player with Hot Module Reloading)
pnpm dev
# Opens http://localhost:3000 — Scrub frame-by-frame with live audio playback

# 2. Execute headless Remotion video render
pnpm run render
# Renders 600 frames (20s @ 30fps) to output/design-patterns/remotion.mp4

# 3. Execute the full Autonomous Hexagonal Studio Pipeline via CLI
pnpm run studio --url https://design-patterns-cyan.vercel.app/ --name "GoF Design Patterns"
# Automatically runs: Scrape -> Storyboard -> Audio Ingest -> Remotion Render -> FFmpeg Mux -> Deliverable Bundle

# 4. Strict TypeScript Typecheck
pnpm run typecheck
```

---

## 5. How to Extend the Studio

### 5.1 Adding a New Scene to `BrandVideoComposition.tsx`

Each scene is declared as a `<Sequence>` with explicit frame timing and spring physics:

1. Open [`src/composition/BrandVideoComposition.tsx`](file:///H:/Projects/brand-video-studio/src/composition/BrandVideoComposition.tsx).
2. Calculate frame offsets based on 30 FPS:
   - 0.0s – 3.0s = `from={0} durationInFrames={90}`
   - 3.0s – 7.0s = `from={90} durationInFrames={120}`
3. Use Remotion's `spring()` and `interpolate()` for smooth 60fps-equivalent interpolation:
   ```tsx
   const frame = useCurrentFrame();
   const { fps } = useVideoConfig();

   // Spring animation with custom damping
   const mySpring = spring({ frame: frame - 210, fps, config: { damping: 15 } });
   const scale = interpolate(mySpring, [0, 1], [0.9, 1]);
   const opacity = interpolate(frame - 210, [0, 15, 100, 120], [0, 1, 1, 0]);

   return (
     <Sequence from={210} durationInFrames={120}>
       <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
         {/* Your React UI components */}
       </AbsoluteFill>
     </Sequence>
   );
   ```

---

### 5.2 Implementing an Alternative Driven Adapter

Because the studio is built on Hexagonal Architecture, swapping an adapter requires zero modifications to the application core.

#### Example: Adding a Cloud Text-to-Speech Adapter (`IAudioIntelligencePort`)
1. Create `src/adapters/driven/speech/ElevenLabsSpeechAdapter.ts`:
   ```typescript
   import { IAudioIntelligencePort } from '../../../application/ports/outbound/IAudioIntelligencePort';
   import { CaptionTrack } from '../../../domain/value-objects/CaptionTrack';

   export class ElevenLabsSpeechAdapter implements IAudioIntelligencePort {
     async generateVoiceover(text: string, voiceId: string): Promise<string> {
       // Call ElevenLabs API and return local audio file path
       return 'output/voice.mp3';
     }

     async transcribeWords(audioFilePath: string): Promise<CaptionTrack> {
       // Return timed word tokens
       return new CaptionTrack([]);
     }
   }
   ```
2. Wire the new adapter in [`src/container.ts`](file:///H:/Projects/brand-video-studio/src/container.ts):
   ```typescript
   // Swap WhisperCppAdapter with ElevenLabsSpeechAdapter
   this.speech = new ElevenLabsSpeechAdapter();
   ```
3. Run `pnpm run typecheck` to verify contract conformance.

---

## 6. Troubleshooting & Diagnostics

### Issue 1: `ffmpeg` is not recognized as an internal or external command
- **Cause:** Windows PowerShell child sessions launched immediately after `winget` installation do not have the updated machine `PATH`.
- **Solution:** Execute:
  ```powershell
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
  ```

### Issue 2: Puppeteer cannot locate Chrome (`Browser was not found at configured executablePath`)
- **Cause:** Puppeteer by default checks for a cached browser inside `node_modules/puppeteer/.local-chromium`.
- **Solution:** Our [`PuppeteerScraperAdapter.ts`](file:///H:/Projects/brand-video-studio/src/adapters/driven/scraper/PuppeteerScraperAdapter.ts) contains an automated fallback helper `getChromeExecutable()` that automatically discovers standard system Chrome installations (`C:\Program Files\Google\Chrome\Application\chrome.exe` on Windows or `/Applications/Google Chrome.app` on macOS). Ensure Google Chrome is installed on the machine.

### Issue 3: Remotion Bundler Module Resolution Error (`Can't resolve './Root.js'`)
- **Cause:** `tsconfig.json` was set to NodeNext resolution expecting explicit `.js` extensions on TypeScript imports.
- **Solution:** Ensure `tsconfig.json` has:
  ```json
  {
    "compilerOptions": {
      "module": "ESNext",
      "moduleResolution": "bundler",
      "jsx": "react-jsx"
    }
  }
  ```
  and all composition imports in `src/composition/` use extensionless paths (`import { Root } from './Root';`).

### Issue 4: Rendered MP4 Video has No Audio
- **Cause:** The raw Remotion renderer (`remotion.mp4`) only outputs video frames if no `<Audio />` node was active or if rendering without post-processing.
- **Solution:** Use [`FfmpegPostProcessorAdapter`](file:///H:/Projects/brand-video-studio/src/adapters/driven/postprocessor/FfmpegPostProcessorAdapter.ts) to mux `soundtrack.mp3` with AAC audio and 2-second fade-out into the final `brag.mp4`.
