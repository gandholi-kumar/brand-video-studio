<div align="center">

# 🎬 Autonomous Brand Video Studio (v2.0)

**Autonomous, prompt-driven motion graphics engine & programmatic video studio.**  
*Synthesizes Remotion, FFmpeg, whisper.cpp, yt-dlp, and Hyperframes with the 5-Layer Amalgam Motion Architecture and the Brag Launch Skill.*

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
  <a href="#-two-creative-engines">Two Creative Engines</a> •
  <a href="#-engine-1-universal-prompt-mode">1. Prompt Mode</a> •
  <a href="#-engine-2-website--github-repo-scraping-brag-skill">2. Brag Scraping</a> •
  <a href="#-reference-video-inspiration-zero-copy">Reference Inspiration</a> •
  <a href="#-the-5-layer-amalgam-motion-architecture">Amalgam Architecture</a> •
  <a href="#-dual-aspect-ratio-engine">16:9 & 9:16 Formats</a> •
  <a href="#-system-doctor--diagnostics">Doctor Command</a> •
  <a href="#-quick-start">Quick Start</a>
</p>

</div>

---

## 🌟 Overview: What is v2.0?

**Brand Video Studio v2.0** provides two complementary, sovereign video generation engines in a single codebase:

1. **Universal Prompt Engine**: Generate high-production motion videos on **any topic** (*Tech, Science, History, News, Entertainment, Sports, SaaS*) from a detailed text prompt with dynamic duration scaling (15s to 120s+) and progressive anti-freeze animation.
2. **Brag Launch Skill Engine**: Point to **any live website or GitHub repository URL**, and headless Puppeteer automatically scrapes project metadata, DOM colors, typography, and 1080p hero viewports to synthesize a high-impact 20-second product launch trailer (`brag.mp4`) with procedural animated mascots, Frame-0 poster baking, and social launch copy.

Both engines support **Dual Aspect Ratios** (16:9 Landscape for laptops/monitors and 9:16 Portrait for YouTube Shorts, Reels, and TikTok), reference video rhythm analysis without copyright copying, and zero-cost browser animatics.

---

## ✨ Key Capabilities

| Capability | Description |
| :--- | :--- |
| **Website & GitHub Repo Scraping (Brag Skill)** | Puppeteer discovers your app or repo URL, extracts headings, detects brand palettes, captures crisp viewports, and builds a 20s launch trailer. |
| **Universal Prompt Generation** | Generate motion videos on any concept (*Quantum Computing, Ancient Rome, Premier League, Breaking News*) without hardcoding or altering React code. |
| **Zero-Copy Reference Inspiration** | Ingest reference MP4s to extract average cut hold times ($\Delta t_{\text{cut}}$) and speech cadence via pure code in 5–10s, synthesizing 100% original scripts. |
| **Anti-Freeze Dynamic Pacing** | Content unfolds progressively (sub-beat stagger, stat counters, split comparisons, particle drops) so no visual frame sits static for $>2$s. |
| **Dual Aspect Ratios (16:9 & 9:16)** | Render 1920×1080 (16:9) or 1080×1920 (9:16) with safe-zone thumb clearance and responsive WCAG-compliant typography. |
| **Procedural Animated Mascots** | Built-in animated SVG characters (`coder` typing on laptop, `mascot` floating droid) with eye blinking, typing arms, and spring physics. |
| **Zero-Cost Pre-Visualization** | Generates an interactive `storyboard.html` in milliseconds, allowing visual review before launching Chromium rendering. |
| **Frame 0 Poster Baking** | Settled outro frame is automatically extracted and baked into Frame 0 of the MP4 with FastStart headers for instant web playback. |
| **Hardened Security** | 100% command-injection free (argument arrays via `execFile`), SSRF intranet protection, and zero personal/system path leaks. |

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
- **Composition Selector**: Switch between `UniversalVideo-Landscape`, `UniversalVideo-Portrait`, `BrandVideo-Landscape`, and `BrandVideo-Portrait`.
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

## 🎬 Two Creative Engines

Brand Video Studio provides two distinct generation modes depending on your input source:

```
                     ┌──────────────────────────────────────────────┐
                     │            Brand Video Studio CLI            │
                     └──────┬────────────────────────────────┬──────┘
                            │                                │
                 --prompt   │                                │ --url
                            ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│ ENGINE 1: Universal Prompt Mode      │  │ ENGINE 2: Brag Scraping Mode         │
│ • Any concept or topic               │  │ • Any website or GitHub repo URL     │
│ • Dynamic durations (15s – 120s+)    │  │ • Automated Puppeteer DOM scraping   │
│ • 5-Layer Amalgam Motion Canvas      │  │ • 20s High-Energy Launch Storyboard  │
│ • Rough.js, Matter.js, Watercolor    │  │ • Procedural Mascots & Live Viewport │
│ • Reference rhythm & pacing analysis │  │ • Frame 0 poster & brand.config.json │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

## 🚀 Engine 1: Universal Prompt Mode

Generate motion videos on any concept or creative prompt:

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

## 🌐 Engine 2: Website & GitHub Repo Scraping (Brag Skill)

The **Brag Skill** automates the entire product launch video workflow for software developers and creators. You pass a website URL or GitHub repository URL, and the engine handles everything:

```bash
# 1. Launch 16:9 Landscape Video for Web, YouTube & X (Twitter):
pnpm studio --url https://github.com/my-org/my-project

# 2. Launch 9:16 Portrait Video for TikTok, Reels & Shorts with Coder Mascot:
pnpm studio --url https://my-saas-app.com --format vertical --character coder

# 3. Fast-Paced Playful Trailer with Spherical Waving Mascot:
pnpm studio --url https://my-portfolio.dev --tone playful --character mascot

# 4. Minimalist UI Launch without character mascot:
pnpm studio --url https://my-app.com --character none
```

### How the Brag Scraping Pipeline Operates:
1. **Automated Headless Chrome DOM Inspection:**
   - Puppeteer launches an isolated, SSRF-hardened Chrome instance.
   - Discovers project title, headings (`<h1>`, `<title>`, `<meta property="og:title">`).
   - Extracts product tagline and description (`<meta name="description">`).
   - Analyzes CSS custom properties to detect brand background, foreground, and accent colors.
   - Captures crisp 1080p desktop viewports (`hero-live.png`) of the application in action.
2. **Synthesizes a 20-Second High-Energy Launch Storyboard:**
   - **Scene 1: Problem Hook (3.0s)**: Bold question challenging legacy workflows (e.g., *"Still writing 800-line God Classes?"* or *"Tired of slow, bloated software?"*) with whoosh sound effect.
   - **Scene 2: Product Reveal (4.0s)**: Animated brand title, tagline, and procedural character mascot.
   - **Scene 3: Architectural Highlight (4.5s)**: Feature cards and trade-off analysis.
   - **Scene 4: Live Interactive Showcase (5.5s)**: Live interactive simulators, Monaco code typing, or high-velocity feature previews.
   - **Scene 5: Outro & Call to Action (3.0s)**: Verified repository / website URL with settled chime cue.
3. **Instant Re-rendering & Customization via `brand.config.json`:**
   When you run `--url`, the engine saves `output/<slug>/brand.config.json`. You can tweak any text or colors in this file and re-render in seconds:
   ```bash
   pnpm studio --config output/my-project/brand.config.json
   ```
4. **Frame 0 Poster & Social Share Copy:**
   - Captures Frame 555 (18.5s) as `brag.jpg` and bakes it into Frame 0 of `brag.mp4` with FastStart streaming headers.
   - Generates ready-to-post launch copy (`share-copy.txt`) for Twitter/X, LinkedIn, and GitHub Releases.

---

## 🤖 Animated Characters & Mascots (`--character <type>`)

The studio includes `<AnimatedCharacter />` (`src/composition/components/AnimatedCharacter.tsx`), a procedural SVG animated mascot with zero external asset dependencies:

| Character Type | Visual Behavior | CLI Flag |
| :--- | :--- | :--- |
| **`coder`** (Default) | Droid character with animated typing arms oscillating on laptop keys, screen visor displaying color-coded code syntax, periodic eye blinking, and floating breathing bobbing. | `--character coder` |
| **`mascot`** | Spherical floating robot with energy thruster pulse, glowing dual-node antenna with spring pulse, and waving right hand gesturing toward CTAs. | `--character mascot` |
| **`none`** | Disables all character overlays for a clean, minimal UI-only trailer. | `--character none` |
| **Custom Image** | Provide any local PNG/JPG image file, and the engine automatically mounts and floats your custom mascot sheet. | `--character path/to/character.png` |

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

| Format | Resolution | Safe Zone Clearance | Primary Target | Remotion Compositions |
| :--- | :---: | :---: | :--- | :--- |
| **`landscape`** (Default) | `1920 × 1080` | Full 1080p bleed, 16:9 | Laptops, Desktops, YouTube, Twitter/X, Web | `UniversalVideo-Landscape`, `BrandVideo-Landscape` |
| **`vertical`** | `1080 × 1920` | Top 15% header safe, Bottom 20% thumb safe | YouTube Shorts, Instagram Reels, TikTok | `UniversalVideo-Portrait`, `BrandVideo-Portrait` |

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
# Option A: From any Concept Prompt (1080p Master):
pnpm studio --prompt "Autonomous AI Agents Launch" --duration 15 --format landscape

# Option B: From any Live Website or GitHub Repo (Brag Trailer):
pnpm studio --url https://github.com/your-username/your-repo --format vertical

# Option C: Instant Zero-Cost Storyboard Review:
pnpm studio --prompt "Autonomous AI Agents Launch" --preview-only
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
# Prompt-Driven Project:
output/quantum-computing-breakthrough/
├── video.mp4          # 1080p Master Video (Frame 0 poster baked + AAC stereo + faststart)
├── poster.jpg         # High-contrast settled thumbnail for YouTube & social cards
├── storyboard.html    # Interactive pre-visualization animatic with timeline review
├── manifest.json      # Dynamic polymorphic manifest governing all scene blocks
└── share-copy.txt     # Platform-ready social launch caption

# Scraped Website / GitHub Repo Project (Brag Skill):
output/my-project/
├── brag.mp4           # 20.0s 1080p Product Launch Trailer
├── brag.jpg           # Settled Frame-0 thumbnail
├── hero-live.png      # High-res 1080p desktop capture from Puppeteer
├── brand.config.json  # Resolved brand snapshot for instant re-rendering
└── share-copy.txt     # Platform-ready launch announcement copy
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
