<div align="center">

# 🎬 Autonomous Brand Video Studio (v2.0)

**Autonomous, prompt-driven motion graphics engine & programmatic video studio.**  
*Synthesizes Remotion, FFmpeg, whisper.cpp, yt-dlp, and Hyperframes with the 5-Layer Amalgam Motion Architecture.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Remotion](https://img.shields.io/badge/Remotion-4.0-red.svg?logo=remotion)](https://remotion.dev/)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-9.0-green.svg?logo=ffmpeg)](https://ffmpeg.org/)
[![whisper.cpp](https://img.shields.io/badge/whisper.cpp-b5454-purple.svg)](https://github.com/ggerganov/whisper.cpp)
[![yt--dlp](https://img.shields.io/badge/yt--dlp-2024.10-red.svg)](https://github.com/yt-dlp/yt-dlp)
[![Architecture](https://img.shields.io/badge/Architecture-Hexagonal%20Ports%20%26%20Adapters-brightgreen.svg)](docs/architecture.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<p align="center">
  <a href="#-overview--what-is-v20">Overview</a> •
  <a href="#-key-capabilities">Key Capabilities</a> •
  <a href="#-browser-ui--remotion-studio">Browser UI</a> •
  <a href="#-universal-prompt-mode">Universal Prompt Mode</a> •
  <a href="#-reference-video-inspiration-zero-copy">Reference Inspiration</a> •
  <a href="#-the-5-layer-amalgam-motion-architecture">Amalgam Architecture</a> •
  <a href="#-dual-aspect-ratio-engine">16:9 & 9:16 Formats</a> •
  <a href="#-system-doctor--diagnostics">Doctor Command</a> •
  <a href="#-quick-start">Quick Start</a>
</p>

</div>

---

## 🌟 Overview: What is v2.0?

**Brand Video Studio v2.0** evolves from a website scraper into a **Universal Autonomous Motion Studio**.

You provide a text prompt on **any topic** (*Technology, Science, History, News, Entertainment, Sports, SaaS*), and the engine:
1. Deconstructs the concept into narrative beats with active visual progression every second (no frozen scenes).
2. Optionally analyzes reference videos dropped in `inputs/inspiration/` to extract pacing, cut rhythm, and mood palette—**without copying or reusing any copyrighted video frames or text**.
3. Outputs an instant, zero-cost **interactive HTML Storyboard Animatic** for immediate review.
4. Renders cinematic 1080p video in dual aspect ratios (**16:9 Landscape** for laptops/desktops and **9:16 Portrait** for YouTube Shorts, Reels, and TikTok) via Remotion (React 19) and FFmpeg.

---

## ✨ Key Capabilities

| Capability | Description |
| :--- | :--- |
| **Universal Prompt Generation** | Generate motion videos on any topic (*Quantum Computing, Ancient Rome, Premier League, Breaking News*) without altering a single line of React code. |
| **Zero-Copy Reference Inspiration** | Ingest reference MP4s to extract average cut hold times ($\Delta t_{\text{cut}}$) and speech cadence via pure code in 5–10s, synthesizing 100% original scripts. |
| **Anti-Freeze Dynamic Pacing** | Content unfolds progressively (sub-beat stagger, stat counters, split comparisons, particle drops) so no visual frame sits static for $>2$s. |
| **Dual Aspect Ratios (16:9 & 9:16)** | Render 1920×1080 (16:9) or 1080×1920 (9:16) with safe-zone thumb clearance and responsive WCAG-compliant typography. |
| **Zero-Cost Pre-Visualization** | Generates an interactive `storyboard.html` in milliseconds, allowing visual review before launching Chromium rendering. |
| **Hexagonal Core & Zero Hardcoding** | Dumb-component architecture where all visual parameters are governed by dynamic `VideoManifest` schemas and `src/const/` design tokens. |
| **Hardened Security** | 100% command-injection free (argument arrays via `execFile`), SSRF intranet protection, and zero system path leaks. |

---

## 🖥️ Browser UI & Remotion Studio

The studio provides two browser-based interfaces:

### 1. Interactive Remotion Studio (`pnpm run dev`)
Launch the built-in visual development environment:
```bash
pnpm run dev
# Opens http://localhost:3000
```
- **Real-Time Playhead**: Scrub frame-by-frame through any scene with live audio and 30/60 fps playback.
- **Composition Selector**: Switch between `UniversalVideo-Landscape`, `UniversalVideo-Portrait`, and `BrandVideo`.
- **Live Props Inspector**: Edit titles, subtitles, color tokens, and layout blocks live in the sidebar with Hot Module Reloading (HMR).
- **Safe Zone Guides**: Toggle mobile overlay guides to ensure titles avoid TikTok/Instagram buttons and comment regions.

### 2. Standalone HTML Animatic (`storyboard.html`)
Generated automatically in every project build or via `--preview-only`:
```bash
pnpm studio --prompt "Quantum Computing Breakthrough in 30s" --preview-only
# Emits output/quantum-computing-breakthrough/storyboard.html
```
Open `storyboard.html` in any browser to review the visual cut timeline, scene cards, and narration beats before rendering.

---

## 🚀 Universal Prompt Mode

Generate videos on any concept directly from the command line:

```bash
# 1. Standard 20s Landscape video on Tech
pnpm studio --prompt "Next-Gen Autonomous AI Agents"

# 2. 60s Landscape deep-dive on Science
pnpm studio --prompt "Quantum Coherence and Superposition" --duration 60 --topic science

# 3. 30s Vertical Portrait for Shorts / Reels / TikTok
pnpm studio --prompt "Ancient Rome Caesars and Gladiators" --duration 30 --format vertical

# 4. Instant Pre-Visualization (No Chromium render)
pnpm studio --prompt "Champions League Final Tactics" --format vertical --preview-only
```

---

## 🎯 Reference Video Inspiration (Zero-Copy)

Want your video to match the pacing, energy, or color mood of an existing video without copyright infringement?

1. Drop any reference video into `inputs/inspiration/`:
   ```bash
   inputs/inspiration/
   └── tech-launch-reference.mp4
   ```
   *(Or pass a direct URL or path via `--reference <url|path>`)*

2. Run the studio:
   ```bash
   pnpm studio --prompt "Next-Gen Database Engine" --reference inputs/inspiration/tech-launch-reference.mp4
   ```

3. **What Happens (Pure Code, 5–10s):**
   - **Scene Cut Detection**: FFmpeg analyzes visual scene transitions (`select='gt(scene,0.3)'`) to calculate average shot hold time (e.g. 2.1s fast cuts vs. 5.2s deep-dive holds).
   - **Speech Cadence**: `whisper.cpp` measures speech pace (words per minute).
   - **Color Harmony**: Extracts dominant contrast tones.
   - **Original Script Synthesis**: The engine uses the measured pacing metrics to structure an **entirely original** script and layout schema. **Zero video frames, text, or copyrighted assets are copied.**

---

## 🎨 The 5-Layer Amalgam Motion Architecture

The studio integrates 8 specialized tools into a cohesive visual pipeline:

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 5: Narration & Kinetic Captions (Whisper.cpp)             │
├─────────────────────────────────────────────────────────────────┤
│ Layer 4: Organic Artistry & Sketch (Rough.js + p5.brush)        │
├─────────────────────────────────────────────────────────────────┤
│ Layer 3: Newtonian Rigid Bodies (Matter.js Physics Drops)       │
├─────────────────────────────────────────────────────────────────┤
│ Layer 2: Hero Launch Hooks & Comparisons (Brag Core Blocks)     │
├─────────────────────────────────────────────────────────────────┤
│ Layer 1: Living Atmospheric Canvas (Remotion + Anime.js Shimmer)│
└─────────────────────────────────────────────────────────────────┘
```

### Visual Style Archetypes (`--style <name>`)
- **`amalgam`** (Default): Harmonious blend of Brag hooks, Rough.js diagrams, Matter.js physics drops, and Anime.js data flows.
- **`physics-3d`**: Sleek perspective cards with gravity-driven falling badges and bouncy settle collisions.
- **`rough-whiteboard`**: Hand-drawn sketchy architectural topology and hachure shading.
- **`organic-watercolor`**: Natural pigment bleeds, parchment grain, and vector Perlin noise fields.
- **`kinetic-vector`**: High-speed vector pipelines and electric circuit traces.

---

## 📱 Dual Aspect Ratio Engine

| Format | Resolution | Safe Zone Clearance | Primary Target |
| :--- | :---: | :---: | :--- |
| **`landscape`** (Default) | `1920 × 1080` | Full 1080p bleed, 16:9 | Laptops, Desktops, YouTube, Twitter/X, Web |
| **`vertical`** | `1080 × 1920` | Top 15% header safe, Bottom 20% thumb safe | YouTube Shorts, Instagram Reels, TikTok |

---

## 🔍 System Doctor & Diagnostics

Verify your local or server environment prerequisites at any time:

```bash
pnpm studio doctor
```

Example diagnostic report:
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

## 🚀 Quick Start

### 1. Prerequisites
Ensure **Node.js 20+**, **pnpm 9+**, and **FFmpeg** are installed on your machine.

### 2. Installation
```bash
git clone https://github.com/your-username/brand-video-studio.git
cd brand-video-studio
pnpm install
```

### 3. Verify Health
```bash
pnpm studio doctor
```

### 4. Generate Your First Video
```bash
# Instant storyboard review:
pnpm studio --prompt "Autonomous AI Agents Launch" --preview-only

# Full 1080p render:
pnpm studio --prompt "Autonomous AI Agents Launch" --duration 15 --format landscape
```

---

## 🧪 Testing & Verification

Run the comprehensive unit test suite:
```bash
pnpm run test:unit
```
```text
✔ FileSystemStorageAdapter (3 tests)
✔ Security & SSRF Hardening (4 tests)
✔ GenerateBrandVideoUseCase (1 test)
✔ GenerateScriptBreakdownUseCase (4 tests)
✔ BrandProject Entity (3 tests)
✔ CaptionTrack Value Object (4 tests)
✔ Scene Value Object (2 tests)
✔ Storyboard Value Object (4 tests)
✔ VideoDeliverable Entity (2 tests)
✔ VideoManifest Domain Entity (5 tests)
✔ HtmlAnimaticGeneratorAdapter (2 tests)
ℹ tests 34 | pass 34 | fail 0
```

Verify zero TypeScript compilation errors:
```bash
pnpm run typecheck
```

---

## 📦 Output Deliverables

Deliverables are cleanly organized under `output/<title-slug>/`:

```text
output/quantum-computing-breakthrough/
├── video.mp4          # 1080p Master Video (Frame 0 poster baked + AAC stereo + faststart)
├── poster.jpg         # High-contrast settled thumbnail for YouTube & social cards
├── storyboard.html    # Interactive pre-visualization animatic with timeline review
├── manifest.json      # Dynamic polymorphic manifest governing all scene blocks
└── share-copy.txt     # Platform-ready social launch caption
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
