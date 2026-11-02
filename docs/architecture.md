# Brand Video Studio — Architecture & Technical Specifications

> **Hexagonal Architecture (Ports & Adapters) Specification for Autonomous Universal Motion Graphics & Video Generation**  
> *Targeted at core contributors, system architects, and platform developers.*

---

## 1. Architectural Philosophy

Brand Video Studio is designed around **Hexagonal Architecture** (also known as *Ports and Adapters*), formulated by Alistair Cockburn. The primary architectural objectives are:

1. **Strict Domain Isolation**: Brand Video Studio is an independent, sovereign application. It does not import, depend upon, or mutate target repositories or user files.
2. **Infrastructure Independence**: The core business logic (analyzing reference videos, breaking down prompts into narrative beats, scheduling visual sub-beats, calculating speech cadence, and packaging deliverables) is decoupled from third-party tooling via abstract outbound ports.
3. **Dumb Component Rendering**: The visual Remotion composition (`UniversalMotionCanvas.tsx`) is a **pure dumb component**. It renders any concept across any topic (*Tech, Science, History, News, Entertainment, Sports, SaaS*) driven entirely by a dynamic, polymorphic `VideoManifest` without altering React code.
4. **Zero-Copy Reference Inspiration**: Ingesting reference videos in `inputs/inspiration/` extracts abstract rhythm metrics (average shot hold time $\Delta t_{\text{cut}}$, speech cadence, and color contrast) via pure code in 5–10 seconds. No video frames, audio tracks, or copyrighted copy from reference videos are ever reproduced.
5. **Zero-Cost Pre-Visualization Feedback Loop**: A standalone, interactive HTML Animatic (`storyboard.html`) is generated in milliseconds before launching headless Chromium rendering, saving compute and providing immediate visual feedback.

```
                   ┌─────────────────────────────────────────────────────────┐
                   │                     Driving Adapter                     │
                   │               (StudioCli / API Controller)              │
                   └────────────────────────────┬────────────────────────────┘
                                                │ invokes
                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ APPLICATION CORE                                                                          │
│                                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Use Cases                                                                           │  │
│  │  • GenerateUniversalVideoUseCase    (Master prompt & reference orchestrator)        │  │
│  │  • GenerateScriptBreakdownUseCase   (Dynamic narrative decomposition & anti-freeze) │  │
│  │  • AnalyzeReferenceVideoUseCase     (Zero-copy scene cut & cadence profiling)       │  │
│  │  • GenerateBrandVideoUseCase        (Legacy URL scraping orchestrator)              │  │
│  └────────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                               │ orchestrates                              │
│                                               ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ DOMAIN MODEL                                                                        │  │
│  │                                                                                     │  │
│  │  • Entities:       VideoManifest, BrandProject, VideoDeliverable                    │  │
│  │  • Value Objects:  Scene, Storyboard, CaptionTrack, WordToken                       │  │
│  │  • Design Tokens:  TOPIC_PALETTES, TYPOGRAPHY_TOKENS, VISUAL_STYLES, springs        │  │
│  │  • Layout Blocks:  headline, stat-counter, split-comparison, rough-diagram,         │  │
│  │                    physics-drop, watercolor-canvas, outro-badge                     │  │
│  └─────────────────────────────────────────────────────────────────────────────────────┘  │
│                                               │                                           │
│                                               ▼ delegates                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Outbound Ports (Abstract Interfaces)                                                │  │
│  │                                                                                     │  │
│  │  • IReferenceVideoAnalyzerPort   • IOpenverseMediaPort       • IStoragePort         │  │
│  │  • IVideoRendererPort            • IAudioIntelligencePort    • IWebScraperPort      │  │
│  │  • IVideoPostProcessorPort       • IMediaIngestionPort                              │  │
│  └─────────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────┬───────────────────────────────────────────────┘
                                            │ implemented by
                                            ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ DRIVEN ADAPTERS (Infrastructure Layer)                                                    │
│                                                                                           │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐                │
│  │ FfmpegRefAnalyzer   │  │   RemotionRenderer  │  │   WhisperCppSpeech  │                │
│  │ (Cut & Rhythm Intel)│  │   (React 19 Engine) │  │   (Quantized GGUF)  │                │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘                │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐                │
│  │   OpenverseMedia    │  │  HtmlAnimaticPreview│  │  PuppeteerScraper   │                │
│  │ (CC0/CC-BY Audio)   │  │ (Instant Storyboard)│  │  (Chrome Headless)  │                │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘                │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐                │
│  │  FfmpegPostProcess  │  │    YtDlpIngestion   │  │  FileSystemStorage  │                │
│  │ (Poster & Muxer)    │  │    (CLI Wrapper)    │  │  (Disk Isolation)   │                │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘                │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Layout & Layer Mapping

The codebase enforces strict separation of concerns under `src/`:

```text
src/
├── domain/                               # Pure enterprise business rules (Zero I/O)
│   ├── entities/
│   │   ├── VideoManifest.ts              # Polymorphic schema governing universal videos
│   │   ├── BrandProject.ts               # Brand aggregate root (legacy)
│   │   └── VideoDeliverable.ts           # Deliverable bundle entity (video, poster, copy)
│   └── value-objects/
│       ├── CaptionTrack.ts               # Timed word-by-word token array
│       ├── Scene.ts                      # Scene definition (frame ranges, transitions)
│       └── Storyboard.ts                 # Ordered sequence of scenes
│
├── const/                                # Centralized design & motion tokens (Zero hardcoding)
│   ├── theme.const.ts                    # 7 Topic palettes (tech, science, history, news, etc.)
│   ├── video.const.ts                    # Aspect ratios (16:9, 9:16), safe-zones, resolutions
│   ├── templates.const.ts                # Visual style archetypes (amalgam, physics-3d, etc.)
│   └── motion.const.ts                   # Spring configurations & motion tokens
│
├── application/                          # Application use cases & port contracts
│   ├── ports/
│   │   ├── inbound/                      # Use case execution contracts
│   │   └── outbound/                     # Secondary port interfaces (Renderer, Analyzer, Storage)
│   └── use-cases/
│       ├── GenerateUniversalVideoUseCase.ts # Master autonomous prompt orchestrator
│       ├── GenerateScriptBreakdownUseCase.ts # Narrative decomposition & pacing
│       ├── AnalyzeReferenceVideoUseCase.ts   # Scene cut & speech cadence extractor
│       └── GenerateBrandVideoUseCase.ts      # Legacy scraped URL orchestrator
│
├── adapters/                             # Infrastructure implementations
│   ├── driving/
│   │   └── cli/
│   │       ├── StudioCli.ts              # Universal CLI entrypoint (--prompt, --reference, etc.)
│   │       └── StudioDoctor.ts           # Environment health diagnostics (Node, FFmpeg, RAM)
│   └── driven/
│       ├── analyzer/
│       │   └── FfmpegReferenceAnalyzerAdapter.ts # Scene cut timestamps & duration detection
│       ├── preview/
│       │   └── HtmlAnimaticGeneratorAdapter.ts   # Instant zero-cost interactive storyboard HTML
│       ├── media/
│       │   ├── OpenverseMediaAdapter.ts         # Topic-based CC0/CC-BY audio downloader
│       │   └── YtDlpAdapter.ts                  # yt-dlp media downloader
│       ├── renderer/
│       │   ├── RemotionRendererAdapter.ts       # Headless Chromium renderer (direct node spawn)
│       │   └── HyperframesRendererAdapter.ts    # GSAP/HTML canvas fallback
│       ├── speech/
│       │   └── WhisperCppAdapter.ts             # High-performance speech-to-text
│       ├── postprocessor/
│       │   └── FfmpegPostProcessorAdapter.ts    # Frame 0 poster baking, audio ducking, concat
│       └── storage/
│           └── FileSystemStorageAdapter.ts      # Collision-free, human-readable directory manager
│
└── composition/                          # Remotion visual presentation layer
    ├── Root.tsx                          # Composition registration (UniversalVideo, BrandVideo)
    ├── UniversalMotionCanvas.tsx         # Universal dumb canvas component
    ├── blocks/                           # Polymorphic motion graphic blocks
    │   ├── KineticHeadlineBlock.tsx      # Punchy hook & hero title
    │   ├── StatHighlightBlock.tsx        # Dynamic metric counter badges
    │   ├── SplitComparisonBlock.tsx      # Side-by-side trade-off cards
    │   ├── RoughDiagramBlock.tsx         # Hand-drawn sketchy architectural topology
    │   ├── PhysicsDropBlock.tsx          # Gravity-falling Newtonian collision badges
    │   ├── WatercolorCanvasBlock.tsx     # Organic pigment fluid canvas
    │   └── OutroBadgeBlock.tsx           # Call-to-action & settled outro
    └── components/                       # Shared visual building blocks
        ├── CinematicCamera.tsx           # Push-in, pan, and breathing camera motions
        ├── BackgroundAtmosphere.tsx      # Dynamic living background particle mesh
        └── KineticCaptions.tsx           # Word-level synchronized subtitle tracks
```

---

## 3. The 5-Layer Amalgam Motion Architecture

Rather than treating tools in isolation, the studio fuses them into a structured visual stack:

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 5: Narration & Kinetic Captions (Whisper.cpp)             │
│ - Timed word highlights synchronized with speech cadence       │
├─────────────────────────────────────────────────────────────────┤
│ Layer 4: Organic Artistry & Sketch (Rough.js + p5.brush)        │
│ - Sketchy architectural diagrams, hachure shading, underlines   │
├─────────────────────────────────────────────────────────────────┤
│ Layer 3: Newtonian Rigid Bodies (Matter.js Physics Drops)       │
│ - Gravity-falling badges with bounce, restitution, and settle   │
├─────────────────────────────────────────────────────────────────┤
│ Layer 2: Hero Launch Hooks & Comparisons (Brag Core Blocks)     │
│ - High-contrast kinetic typography, stat counters, trade-offs   │
├─────────────────────────────────────────────────────────────────┤
│ Layer 1: Living Atmospheric Canvas (Remotion + Anime.js Shimmer)│
│ - Radial gradients, breathing camera motion, floating particles │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Pacing & Long-Duration Scaling (>20s to Minutes)

### Anti-Freeze Rule
To ensure videos maintain viewer retention regardless of duration:
- **No static hold exceeds 2.0 seconds.**
- Content unfolds in **progressive sub-beat staggers** (e.g., header lands at $t=0$, stat 1 activates at $t=3$, stat 2 slides in at $t=6$ while stat 1 dims to guide focus).

### Low-RAM Workstation Scaling Strategy
On low-power hardware (e.g. 8 GB RAM with 1.3 GB free):
1. **Single-Pass Render ($\le 30$s):** Rendered directly as a single Remotion pass with `--concurrency 1`.
2. **Chunked Scene Concatenation ($>30$s):** 
   - Long videos are rendered as discrete scene chunks in `.work/scene-01.mp4`, `.work/scene-02.mp4`.
   - FFmpeg concatenates chunks in seconds via the stream copy demuxer (`-f concat -safe 0 -c copy`), completely avoiding Chromium memory exhaustion.

---

## 5. Security & Hardening Architecture

1. **Zero Command Injection (RCE Prevention):**
   - All external child processes (`ffmpeg`, `whisper-cli`, `yt-dlp`, `node`) are invoked strictly through argument arrays (`execFileAsync(binary, [args])`). Shell interpolation is prohibited.
2. **SSRF Mitigation:**
   - Both `PuppeteerScraperAdapter` and `OpenverseMediaAdapter` parse and validate URLs against forbidden protocols (`file:`, `javascript:`, `gopher:`) and loopback/private intranet IP ranges (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`, `localhost`).
3. **Privacy & Path Isolation:**
   - Saved artifacts and manifests use relative paths (`assets/music/soundtrack.mp3`). Host machine paths and usernames are never leaked into output files or documentation.

---

## 6. Architectural Decision Records (ADRs)

### ADR-001: Hexagonal Architecture (Ports & Adapters)
- **Status:** Accepted
- **Context:** Standalone repo required to isolate video generation from client web applications.
- **Decision:** Encapsulate all I/O, renderers, speech engines, and downloaders behind outbound ports.

### ADR-002: Remotion (React 19) Dumb Canvas
- **Status:** Accepted
- **Context:** Need universal video synthesis across arbitrary topics without altering code.
- **Decision:** Build `UniversalMotionCanvas` as a pure dumb component driven entirely by `VideoManifest`.

### ADR-003: whisper.cpp over Python Whisper
- **Status:** Accepted
- **Context:** Word-level transcription needed with minimal RAM footprint (<150 MB).
- **Decision:** Use quantized `whisper.cpp` (`ggml-tiny.en.bin`) via native binary.

### ADR-004: Direct Node Binary Execution for Remotion CLI
- **Status:** Accepted
- **Context:** Spawning Windows batch files (`pnpm.cmd`) required `shell: true`, causing deprecation warnings and injection risks.
- **Decision:** Spawn `process.execPath` directly pointing to `node_modules/@remotion/cli/remotion-cli.js`.

### ADR-005: Zero-Copy Inspiration Profiling
- **Status:** Accepted
- **Context:** Users want videos inspired by existing reference videos without copyright issues.
- **Decision:** Extract numerical cut hold times ($\Delta t_{\text{cut}}$) and speech cadence via FFmpeg and Whisper. Synthesize 100% original copy from prompt.

### ADR-006: Standalone Zero-Cost Pre-Visualization Animatic
- **Status:** Accepted
- **Context:** Headless Chromium rendering takes 1–3 minutes. Users need instant visual feedback.
- **Decision:** Generate `storyboard.html` in milliseconds with interactive timeline cards before rendering.

---

## 7. Dependency Injection & Service Container

All adapters are wired in `src/container.ts`:

```typescript
export function createStudioContainer(): StudioContainer {
  const scraper = new PuppeteerScraperAdapter();
  const mediaDownloader = new YtDlpAdapter();
  const whisper = new WhisperCppAdapter();
  const renderer = new RemotionRendererAdapter();
  const postProcessor = new FfmpegPostProcessorAdapter();
  const storage = new FileSystemStorageAdapter('./output');
  const referenceAnalyzer = new FfmpegReferenceAnalyzerAdapter(whisper);
  const animaticGenerator = new HtmlAnimaticGeneratorAdapter();
  const openverseMedia = new OpenverseMediaAdapter();

  const analyzeReferenceUseCase = new AnalyzeReferenceVideoUseCase(referenceAnalyzer, mediaDownloader);
  const scriptBreakdownUseCase = new GenerateScriptBreakdownUseCase(openverseMedia);

  const generateUniversalVideoUseCase = new GenerateUniversalVideoUseCase({
    analyzeReferenceUseCase,
    scriptBreakdownUseCase,
    animaticGenerator,
    renderer,
    postProcessor,
    storage
  });

  return {
    generateUniversalVideoUseCase,
    generateScriptBreakdownUseCase,
    analyzeReferenceUseCase,
    renderer,
    postProcessor,
    storage,
    // ...
  };
}
```
