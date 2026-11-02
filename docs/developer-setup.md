# Brand Video Studio — Developer Setup & Operational Runbook

> **Complete guide for setting up, running, debugging, and extending Brand Video Studio locally.**  
> *Designed for local $0 workstation execution on Windows, macOS, and Linux.*

---

## 1. System Prerequisites

Brand Video Studio leverages high-performance native CLI tools to minimize RAM and CPU overhead during video synthesis:

| Tool | Minimum Version | Purpose | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 20.0.0` (LTS recommended) | TypeScript runtime & Remotion host | `node -v` |
| **pnpm** | `>= 9.0.0` | Package manager | `pnpm -v` |
| **FFmpeg & FFprobe** | `>= 6.0` (v9.0+ tested) | Scene cut analysis, video remuxing, poster capture | `ffmpeg -version` |
| **Google Chrome** | Current Stable | Remotion frame canvas & SPA scraping | `chrome.exe --version` |
| **whisper.cpp** | `>= 1.5.0` (Optional) | Speech cadence & word-level subtitle timing | `tools/whisper/Release/whisper-cli.exe --help` |
| **yt-dlp** | `>= 2024.0.0` (Optional) | Remote media & inspiration video ingestion | `yt-dlp --version` |

---

## 2. Quick Setup & Diagnostics

### 2.1 Install Dependencies
```bash
git clone <repo-url> brand-video-studio
cd brand-video-studio
pnpm install
```

### 2.2 Run System Doctor
The studio includes a built-in diagnostic tool to verify environment prerequisites and available system memory:
```bash
pnpm studio doctor
```

Example output:
```text
🔍 Running Brand Video Studio System Doctor...

✅ [OK]   Node.js Runtime            : v22.13.0
✅ [OK]   System Memory (RAM)        : 4.8 GB free / 16.0 GB total
✅ [OK]   FFmpeg Core Tool           : 9.0.2-full_build-www.gyan.dev
✅ [OK]   Chrome / Chromium          : Detected on host
✅ [OK]   Whisper.cpp Speech Intel   : Local binary ready

System Health Assessment: All Systems Operational 🚀
```

---

## 3. Native Tool Installation Guide

### Windows (PowerShell via `winget`)
```powershell
# 1. Install FFmpeg
winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements

# 2. (Optional) Install yt-dlp
winget install --id yt-dlp.yt-dlp -e --accept-source-agreements --accept-package-agreements

# 3. Refresh environment PATH in current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### macOS (Homebrew)
```bash
brew install ffmpeg yt-dlp
```

### Linux (Ubuntu / Debian)
```bash
sudo apt update && sudo apt install -y ffmpeg
```

---

## 4. Local Development & Workflow Modes

### Mode 1: Interactive Remotion Studio (Browser GUI)
For live previewing, visual debugging, and frame-by-frame scrubbing:
```bash
pnpm run dev
# Opens http://localhost:3000
```
- Toggle between `UniversalVideo-Landscape` (16:9) and `UniversalVideo-Portrait` (9:16).
- Edit props live in the sidebar with instant Hot Module Reloading (HMR).
- Verify mobile safe-zone clearance overlays.

### Mode 2: Instant Pre-Visualization Animatic (`--preview-only`)
Before committing compute to Chromium rendering, generate a standalone HTML storyboard in $<1$s:
```bash
pnpm studio --prompt "Quantum Computing Breakthrough in 30s" --preview-only
```
- Emits `output/quantum-computing-breakthrough/storyboard.html`.
- Double-click or open in browser to review scene cut pacing, cards, and script narration.

### Mode 3: Autonomous Full 1080p Video Render
Renders the complete master MP4 deliverable with settled Frame 0 poster and synchronized audio:
```bash
# 16:9 Landscape for Web & Laptop:
pnpm studio --prompt "Autonomous AI Agents Launch" --duration 20 --format landscape

# 9:16 Portrait for Shorts / Reels / TikTok:
pnpm studio --prompt "Ancient Rome Caesars and Gladiators" --duration 30 --format vertical
```

### Mode 4: Reference-Inspired Generation (Zero-Copy)
Extract pacing, cut frequency, and color mood from an existing video:
```bash
# Drop video in inputs/inspiration/ or pass direct path/URL:
pnpm studio --prompt "Next-Gen Database Engine" --reference inputs/inspiration/tech-launch.mp4
```

### Mode 5: Website & GitHub Repo Scraping (The Brag Skill)
Scrapes a live website or GitHub repository DOM, captures high-res 1080p desktop viewports, and builds a 20-second product launch trailer with procedural animated mascots:
```bash
# 1. 16:9 Landscape for Web & GitHub Releases:
pnpm studio --url https://github.com/my-org/my-project

# 2. 9:16 Portrait for Shorts / Reels / TikTok with animated coder mascot:
pnpm studio --url https://my-saas-app.com --format vertical --character coder

# 3. Minimal UI launch trailer without mascots:
pnpm studio --url https://my-app.com --character none

# 4. Instant re-render from custom brand config:
pnpm studio --config output/my-project/brand.config.json
```
- Emits `output/<project-slug>/brag.mp4` with Frame 0 poster baked.
- Extracts `output/<project-slug>/hero-live.png` desktop viewport capture.
- Generates platform-ready social launch caption in `output/<project-slug>/share-copy.txt`.

---

## 5. Hardware & Low-RAM Rules

If running on a workstation with limited RAM (e.g. 8 GB total with <1.5 GB free):

1. **Always Enforce Single-Worker Rendering (`--concurrency 1`):**
   Remotion defaults to multi-process Chromium rendering. Single-concurrency caps RAM usage safely below 1.1 GB.
2. **Use Pre-Visualization First:**
   Run `--preview-only` to review storyboards with zero GPU/RAM consumption.
3. **Use Quantized Whisper Models:**
   Keep `ggml-tiny.en.bin` (77 MB) for speech transcription.

---

## 6. How to Extend the Studio

### 6.1 Adding a New Scene Block
1. Create your block component under `src/composition/blocks/MyNewBlock.tsx`.
2. Add the layout type to `SceneLayoutType` in `src/domain/entities/VideoManifest.ts`.
3. Add the render case in `src/composition/UniversalMotionCanvas.tsx`.
4. The block is now universally available to all prompt generations without touching composition wrappers!

### 6.2 Adding a New Design Token or Topic Palette
1. Open `src/const/theme.const.ts`.
2. Add your topic and colors to `TOPIC_PALETTES`.
3. Update `VideoTopic` type.
4. The topic palette will be automatically selected when prompt keywords match!

---

## 7. Testing & Quality Verification

Run the 34-test unit test suite:
```bash
pnpm run test:unit
```

Verify zero TypeScript compilation errors:
```bash
pnpm run typecheck
```
