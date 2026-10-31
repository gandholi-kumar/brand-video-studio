<div align="center">

# 🎬 Brand Video Studio

**Autonomous, \$0-cost programmatic brand video generation engine.**  
*Built with React 19, Remotion, Hyperframes, whisper.cpp, yt-dlp, and FFmpeg.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Remotion](https://img.shields.io/badge/Remotion-4.0-red.svg?logo=remotion)](https://remotion.dev/)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-9.0-green.svg?logo=ffmpeg)](https://ffmpeg.org/)
[![whisper.cpp](https://img.shields.io/badge/whisper.cpp-b5454-purple.svg)](https://github.com/ggerganov/whisper.cpp)
[![yt--dlp](https://img.shields.io/badge/yt--dlp-2024.10-red.svg)](https://github.com/yt-dlp/yt-dlp)
[![Architecture](https://img.shields.io/badge/Architecture-Hexagonal%20Ports%20%26%20Adapters-brightgreen.svg)](docs/architecture.md)
[![Cost](https://img.shields.io/badge/Cost-%240%20(100%25%20Local)-gold.svg)](#why-brand-video-studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#cli-usage">CLI Usage</a> •
  <a href="#deliverables">Deliverables</a> •
  <a href="docs/architecture.md">Architecture Deep Dive</a> •
  <a href="docs/developer-setup.md">Developer Runbook</a>
</p>

</div>

---

## 💡 Why Brand Video Studio?

Commercial video generation SaaS platforms (such as `letsbrag.app`) charge **\$19 per video**, queue your jobs on remote servers, and offer rigid templates.

**Brand Video Studio** is a completely free, local, open-source alternative designed for engineers and startup creators:

| Feature | Commercial SaaS (`letsbrag.app`) | Brand Video Studio |
| :--- | :--- | :--- |
| **Cost** | **\$19 / video** | **\$0 (100% Free & Open Source)** |
| **Privacy & Execution** | Cloud queues, remote telemetry | **100% Local on your machine** |
| **Codebase Coupling** | Often requires vendor scripts | **Zero Coupling** (Separate sovereign studio) |
| **Visual Customization** | Locked pre-made templates | **Full React 19 + CSS + Spring Physics** |
| **Interactive Preview** | Pre-rendered static previews | **Real-time Remotion Studio HMR scrubbing** |
| **Subtitles / Captions** | Coarse or paid add-on | **Word-by-word kinetic captions via whisper.cpp** |
| **Hardware Footprint** | Cloud-dependent | **Runs on 2-core / 1.2 GB RAM machines** |

---

## ✨ Key Features

- 🌐 **Automated Live SPA Scraping**: Headless Chrome (Puppeteer) discovers your app, extracts page titles, detects brand colors, and captures crisp 1080p desktop viewports without user intervention.
- ⚛️ **Declarative Motion Graphics with Remotion**: Build 60fps-smooth motion graphics using standard React 19 components, CSS Grid/Flexbox, and mathematical spring physics (`interpolate`, `spring`).
- ⚡ **Lightweight Speech Recognition via `whisper.cpp`**: Generates timed word-level caption tokens in <2 seconds using a quantized 77 MB model (`ggml-tiny.en.bin`), bypassing heavy Python/PyTorch dependencies.
- 🎵 **High-Energy Audio Multiplexing**: Downloads CC-BY soundtracks via `yt-dlp` and uses FFmpeg to multiplex synchronized AAC stereo audio with smooth 2-second outro fade curves.
- 🖼️ **Settled Frame-0 Poster Baking**: Automatically captures high-resolution settling posters (Frame 555 / 18.5s) and injects FastStart headers into the MP4 container for instant web playback.
- 🏛️ **Pure Hexagonal Architecture**: Clean separation between Application Core (Use Cases & Entities) and Infrastructure (Puppeteer, Remotion, FFmpeg, Whisper, yt-dlp). Swap any adapter without breaking business logic.

---

## 🏛️ Architecture

Brand Video Studio follows **Hexagonal Architecture (Ports and Adapters)** to guarantee that client repositories remain 100% clean and decoupled:

```
[Target Web Application] (e.g. GoF Design Patterns Masterclass)
          │  (Scraped via URL, zero repository dependencies)
          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BRAND VIDEO STUDIO                              │
│                                                                        │
│   Driving Adapters       Application Core             Driven Adapters  │
│   ┌──────────────┐      ┌─────────────────┐          ┌──────────────┐  │
│   │  Studio CLI  │─────▶│  GenerateBrand  │─────────▶│  Puppeteer   │  │
│   └──────────────┘      │  VideoUseCase   │          │  (Scraper)   │  │
│                         └────────┬────────┘          └──────────────┘  │
│                                  │                   ┌──────────────┐  │
│                                  ├──────────────────▶│   Remotion   │  │
│                                  │                   │  (Renderer)  │  │
│                                  │                   └──────────────┘  │
│                                  ├──────────────────▶│  whisper.cpp │  │
│                                  │                   │   (Speech)   │  │
│                                  │                   └──────────────┘  │
│                                  ├──────────────────▶│    yt-dlp    │  │
│                                  │                   │   (Audio)    │  │
│                                  │                   └──────────────┘  │
│                                  └──────────────────▶│    FFmpeg    │  │
│                                                      │ (PostProcess)│  │
│                                                      └──────────────┘  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ produces
                                   ▼
          ┌────────────────────────────────────────────────┐
          │                  DELIVERABLES                  │
          │  • brag.mp4 (1080p H.264 + AAC 194kbps Audio)  │
          │  • brag.jpg (Settled High-Res Video Poster)    │
          │  • share-copy.txt (Viral Launch Social Copy)   │
          └────────────────────────────────────────────────┘
```

> 📖 **Read the complete design specification:** [Architecture & Technical Specifications](docs/architecture.md)

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

*(See [Developer Setup Guide](docs/developer-setup.md) for Windows, macOS, and Linux setup instructions).*

### 2. Clone & Install
```bash
git clone https://github.com/your-username/brand-video-studio.git
cd brand-video-studio
pnpm install
```

### 3. Launch Remotion Studio Preview
Scrub through the video composition in real-time with live audio playback in your browser:
```bash
pnpm dev
# Opens http://localhost:3000
```

### 4. Generate a Full Video Deliverable
Run the autonomous end-to-end studio pipeline against any live website:
```bash
pnpm run studio --url https://design-patterns-cyan.vercel.app/ --name "GoF Design Patterns Masterclass"
```

---

## 💻 CLI Usage & Workflows

### Interactive Browser Preview (`pnpm dev`)
Launches the Remotion Web Player with Hot Module Reloading (HMR). You can edit React components in `src/composition/BrandVideoComposition.tsx` and see changes reflect live with zero render latency.

### Autonomous Production Render (`pnpm run studio`)
Executes the full hexagonal pipeline:
1. Scrapes the target URL for metadata, color palette, and 1080p screenshots.
2. Ingests or loads background soundtrack.
3. Transcribes voice/speech tracks into word-level tokens via `whisper.cpp`.
4. Renders the 600-frame (20s @ 30fps) React motion canvas with `--concurrency 1`.
5. Post-processes video with FFmpeg (AAC encoding, audio fade curves, poster extraction).
6. Generates viral social media copy formatted for X (Twitter), LinkedIn, and Reddit.

### Strict Typechecking (`pnpm run typecheck`)
Verifies full TypeScript 5.7 conformance with zero warnings across all domain entities, value objects, ports, and adapters.

---

## 📦 Output Deliverables

When the pipeline completes, artifacts are cleanly written to `output/<project-slug>/`:

```text
output/design-patterns/
├── brag.mp4          # 20.0s 1080p video (H.264 video + AAC stereo audio @ 194kbps)
├── brag.jpg          # Frame 555 settled thumbnail / poster image (55 KB)
├── hero-live.png     # Automated 1920x1080 desktop screenshot from Puppeteer
├── remotion.mp4      # Raw un-muxed video render from Remotion
└── share-copy.txt    # Ready-to-publish launch copy for X/Twitter & LinkedIn
```

---

## ⚡ Performance & Low-RAM Engineering

Brand Video Studio is engineered to run reliably on resource-constrained development machines (such as 2-core Intel i3 laptops with under 1.5 GB of free RAM):

- **Single-Worker Concurrency (`--concurrency 1`):** Prevents Chromium instance proliferation, capping peak render memory below 1.1 GB RAM.
- **Quantized C++ Inference (`whisper.cpp`):** Uses quantized 4-bit `ggml-tiny.en.bin` model, executing word-level transcription in 1.5 seconds using <150 MB RAM (saving >2.5 GB compared to PyTorch).
- **FastStart Container Flags:** Video outputs include `-movflags +faststart`, enabling instant web streaming before the entire file finishes buffering.

---

## 📂 Project Structure

```text
brand-video-studio/
├── docs/                           # Comprehensive technical documentation
│   ├── architecture.md             # Hexagonal architecture & ADRs
│   └── developer-setup.md          # Setup runbook, native tools & troubleshooting
├── public/                         # Public static assets & soundtrack
│   └── soundtrack.mp3              # CC-BY energetic tech soundtrack
├── src/
│   ├── domain/                     # Entities & Value Objects (Zero external dependencies)
│   ├── application/                # Inbound/Outbound Ports & Use Cases
│   ├── adapters/                   # Driving CLI & Driven infrastructure implementations
│   ├── composition/                # Remotion 4 React 19 motion graphics canvas
│   └── container.ts                # Composition Root (Dependency Injection)
├── tools/                          # Native portable binaries
│   └── whisper/                    # whisper-cli and quantized GGML models
├── package.json                    # Workspace scripts & dependencies
└── tsconfig.json                   # TypeScript configuration
```

---

## 📚 Documentation Index

- **[Architecture Deep Dive](docs/architecture.md)** — Architectural principles, Domain Model, Sequence Diagrams, and Architectural Decision Records (ADRs).
- **[Developer Setup & Operational Runbook](docs/developer-setup.md)** — Step-by-step setup for Windows, macOS, Linux, Remotion scene tutorials, adapter customization, and troubleshooting.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
