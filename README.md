<div align="center">

# 🎬 Brand Video Studio

**Autonomous, $0-cost programmatic brand video generation engine.**  
*Built with React 19, Remotion, whisper.cpp, yt-dlp, and FFmpeg.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Remotion](https://img.shields.io/badge/Remotion-4.0-red.svg?logo=remotion)](https://remotion.dev/)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-9.0-green.svg?logo=ffmpeg)](https://ffmpeg.org/)
[![whisper.cpp](https://img.shields.io/badge/whisper.cpp-b5454-purple.svg)](https://github.com/ggerganov/whisper.cpp)
[![yt--dlp](https://img.shields.io/badge/yt--dlp-2024.10-red.svg)](https://github.com/yt-dlp/yt-dlp)
[![Architecture](https://img.shields.io/badge/Architecture-Hexagonal%20Ports%20%26%20Adapters-brightgreen.svg)](docs/architecture.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<p align="center">
  <a href="#why-brand-video-studio-repo-vs-ai-skill">Why This Repo vs AI Skill</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#multi-format-support-169--916">16:9 & 9:16 Formats</a> •
  <a href="#animated-characters--motion-graphics">Characters & Motion</a> •
  <a href="#customizing-your-video">Customization</a> •
  <a href="#audio-intelligence--music-tracks">Audio & Music</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#cli-usage">CLI Usage</a>
</p>

</div>

---

## 💡 Why Brand Video Studio? (Repo vs AI Skill)

### The Problem with AI Agent Prompt Skills (e.g. `/brag`)
Agent skills (such as `latent-spaces/brag`) are markdown prompt files that instruct an LLM to improvise shell commands and scripts on the fly. While innovative, relying purely on a prompt skill has severe limitations:
1. **Non-deterministic & Fragile:** LLMs hallucinate shell syntax, miss edge cases, and break when tools change.
2. **Blind Black Box:** An agent skill runs in the background and dumps an MP4. You cannot scrub through frames, inspect animations, or hear audio in real time before rendering.
3. **Repo Pollution:** Running ad-hoc video scripts inside your application repository pollutes your git history with gigabytes of raw frames, audio stems, and headless browser caches.

### The Advantage of the Standalone Brand Video Studio Repository
**Brand Video Studio** is a sovereign, production-grade video studio that runs locally:
- **Zero Pollution:** Lives in its own repository (`H:\Projects\brand-video-studio`). Your target web apps stay 100% clean and untouched.
- **Interactive Visual Scrubber (`pnpm dev`):** Open `http://localhost:3000` to scrub through your video frame-by-frame with synchronized live audio, hot-module reload, and visual prop editing.
- **Strict Hexagonal Architecture & 100% Tested:** Core domain entities and use cases are decoupled from third-party tools via TypeScript Port interfaces, backed by a 16-test unit suite.
- **Can Still Be Controlled by an Agent Skill:** You can trigger `pnpm studio` from an Antigravity slash command (`/brag`), giving you conversational speed with engine-grade stability.

---

## ✨ Key Features

- 📱 **Dual Aspect Ratios (16:9 Landscape & 9:16 Portrait):** Render high-impact landscape videos for Twitter/X and YouTube, or vertical mobile videos for TikTok, Instagram Reels, and YouTube Shorts.
- 🤖 **Procedural Animated Characters:** Built-in animated SVG mascots (`coder` and `mascot`) with spring-physics floating, procedural eye blinking, typing arms, and interactive speech moods.
- 🎨 **Deep Customization via `brand.config.json`:** Customize titles, durations, brand colors, fonts, music, and character mascots without touching code.
- 🌐 **Automated Live SPA Scraping:** Headless Chrome (Puppeteer) discovers your app, extracts page titles, detects brand colors, and captures crisp 1080p desktop viewports automatically.
- ⚡ **Lightweight Speech Recognition via `whisper.cpp`:** Generates timed word-level caption tokens in <2 seconds using a quantized 77 MB model (`ggml-tiny.en.bin`), bypassing heavy Python/PyTorch dependencies.
- 🎵 **Native Soundtrack & Audio Multiplexing:** Built-in CC-BY energetic soundtrack with automated 2-second outro fade curves, plus on-demand download via `yt-dlp`.
- 🖼️ **Settled Frame-0 Poster Baking:** Automatically captures the optimal outro frame (Frame 555 / 18.5s) and injects it into Frame 0 of `brag.mp4` with FastStart streaming headers.

---

## 📱 Multi-Format Support: 16:9 & 9:16

Brand Video Studio natively supports both major video form factors out of the box:

| Format | Resolution | Aspect Ratio | Best For | Remotion Composition ID |
| :--- | :---: | :---: | :--- | :--- |
| **Landscape** | `1920 × 1080` | `16:9` | Desktop web, YouTube, Twitter/X, LinkedIn | `BrandVideo-Landscape` (or `BrandVideo`) |
| **Portrait / Vertical** | `1080 × 1920` | `9:16` | TikTok, Instagram Reels, YouTube Shorts, Mobile | `BrandVideo-Portrait` |

### Responsive Layout Engine
The composition automatically adapts based on aspect ratio:
* **Landscape:** Dual-column split layout with hook title on the left and interactive simulators / animated mascot on the right.
* **Portrait:** Vertical mobile-first layout with high-contrast hook on top, centered animated mascot, compact card stacks, and kinetic subtitles docked in the thumb zone.

### Rendering Different Formats via CLI
```bash
# Render 16:9 Landscape (Default)
pnpm studio --url https://your-app.com --format landscape

# Render 9:16 Portrait for Shorts / Reels / TikTok
pnpm studio --url https://your-app.com --format vertical
```

---

## 🤖 Animated Characters & Motion Graphics

### Built-in Character Mascots
The studio includes `<AnimatedCharacter />` (`src/composition/components/AnimatedCharacter.tsx`), a procedural SVG animated mascot with zero external asset dependencies:

1. **`coder` Mascot:**
   - Droid character with animated typing arms oscillating on laptop keys.
   - Screen visor reflection displaying color-coded code syntax.
   - Periodic eye blinking (calculated via modulo frame arithmetic).
   - Floating breathing bobbing powered by sine wave motion.
2. **`mascot` Droid:**
   - Spherical floating robot with energy thruster pulse.
   - Waving right hand gesturing toward calls-to-action.
   - Glowing dual-node antenna with spring pulse.

### Enabling or Toggling Characters
You can select characters via CLI:
```bash
# Use coder mascot (default)
pnpm studio --url https://your-app.com --character coder

# Use friendly waving droid
pnpm studio --url https://your-app.com --character mascot

# Disable character for a purely minimal UI video
pnpm studio --url https://your-app.com --character none
```

---

## 🛠️ Customizing Your Video

You have 3 easy ways to customize your videos:

### Method 1: Configuration File (`brand.config.json`)
The most powerful way to customize. When you run `pnpm studio`, the engine automatically saves `output/<slug>/brand.config.json`. You can edit this file and re-render instantly:

```bash
pnpm studio --config brand.config.example.json
```

#### Example `brand.config.json`:
```json
{
  "projectName": "My Custom SaaS",
  "url": "https://mysaas.com",
  "tagline": "AI Workflows in Seconds",
  "format": "landscape",
  "tone": "cinematic",
  "character": {
    "enabled": true,
    "type": "coder"
  },
  "colors": {
    "background": "#090d16",
    "foreground": "#f8fafc",
    "accent": "#f59e0b",
    "secondaryAccent": "#06b6d4"
  },
  "scenes": [
    {
      "id": "scene-1-hook",
      "type": "hook",
      "title": "Tired of slow, repetitive data entry?",
      "durationSeconds": 3.0
    },
    {
      "id": "scene-2-reveal",
      "type": "reveal",
      "title": "Meet AutoFlow",
      "subtitle": "Zero-code automation powered by Next.js",
      "durationSeconds": 4.0
    },
    {
      "id": "scene-5-outro",
      "type": "outro",
      "title": "Start Free Today.",
      "subtitle": "https://mysaas.com",
      "durationSeconds": 3.0
    }
  ]
}
```

### Method 2: Interactive Remotion Studio (`pnpm dev`)
1. Run `pnpm dev`.
2. Open `http://localhost:3000` in your browser.
3. Switch between `BrandVideo-Landscape` and `BrandVideo-Portrait` in the left sidebar.
4. Scrub frame-by-frame with live audio.
5. Use the **Props Panel** on the right to edit text, colors, and characters live with instant Hot Module Reloading (HMR).

### Method 3: CLI Flags
Override any setting directly from the command line:
```bash
pnpm studio --url https://example.com --format vertical --character mascot --tone playful
```

---

## 🎵 Audio Intelligence & Music Tracks

### Do You Need to Manually Download Audio?
**No.** The studio handles audio automatically:
1. **Bundled Default Soundtrack:** The studio includes a curated, high-energy CC-BY soundtrack (`public/soundtrack.mp3` & `assets/music/soundtrack.mp3` from `ende.app`). Every video automatically plays this track with a smooth 2-second outro fade.
2. **Interactive Audio Preview:** Audio is rendered natively by Remotion's `<Audio />` component during preview (`pnpm dev`) and muxed via FFmpeg in final production.
3. **Voiceover Transcription:** If you place a voiceover recording (`voice.wav`) in the project folder, native C++ `whisper.cpp` (`ggml-tiny.en.bin`) automatically extracts word-by-word timestamps into `captions.json` and renders synchronized kinetic subtitles.
4. **On-Demand Music Sourcing:** The `YtDlpAdapter` can download any royalty-free audio URL on the fly via `yt-dlp`.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have **Node.js 20+**, **pnpm 9+**, and **FFmpeg** installed.

```bash
# Verify system tools
node -v
pnpm -v
ffmpeg -version
```

### 2. Clone & Install
```bash
git clone https://github.com/your-username/brand-video-studio.git
cd brand-video-studio
pnpm install
```

### 3. Launch Remotion Studio Preview
```bash
pnpm dev
# Opens http://localhost:3000
```

### 4. Generate a Full Video Deliverable
```bash
# Generate 16:9 Landscape video:
pnpm studio --url https://design-patterns-cyan.vercel.app/

# Generate 9:16 Portrait Shorts/TikTok video with mascot:
pnpm studio --url https://design-patterns-cyan.vercel.app/ --format vertical --character mascot
```

---

## 🧪 Testing & Quality Gates

Run the comprehensive unit test suite:
```bash
pnpm run test:unit
```
```text
✔ GenerateBrandVideoUseCase (Hexagonal Orchestration)
✔ BrandProject Entity
✔ CaptionTrack Value Object
✔ Scene Value Object
✔ Storyboard Value Object
✔ VideoDeliverable Entity
ℹ tests 16 | pass 16 | fail 0
```

Verify strict TypeScript compilation:
```bash
pnpm run typecheck
# tsc --noEmit (0 errors)
```

---

## 📦 Output Deliverables

Deliverables are cleanly written to `output/<project-slug>/`:

```text
output/design-patterns/
├── brag.mp4          # 20.0s 1080p MP4 (Frame 0 poster baked + 192k AAC stereo audio + faststart)
├── brag.jpg          # High-contrast settled thumbnail for YouTube, X, and LinkedIn
├── hero-live.png     # Automated 1920x1080 desktop capture from Puppeteer
├── brand.config.json # Resolved configuration snapshot ready for instant customization
├── remotion.mp4      # Raw composition render
└── share-copy.txt    # Platform-ready social launch caption
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
