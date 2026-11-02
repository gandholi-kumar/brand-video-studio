import React from 'react';
import { Composition } from 'remotion';
import { BrandVideoComposition } from './BrandVideoComposition';
import { UniversalMotionCanvas } from './UniversalMotionCanvas';
import { TOPIC_PALETTES, TYPOGRAPHY_TOKENS } from '../const/theme.const';

const defaultManifest = {
  version: '2.0' as const,
  id: 'universal-demo',
  title: 'Autonomous Brand Video Studio',
  topic: 'tech' as const,
  aspectRatio: '16:9' as const,
  style: 'amalgam' as const,
  totalDurationSeconds: 20,
  fps: 30,
  theme: {
    palette: TOPIC_PALETTES.tech,
    typography: TYPOGRAPHY_TOKENS
  },
  audio: {},
  character: {
    enabled: true,
    type: 'coder'
  },
  scenes: [
    {
      id: 'scene-1',
      layoutType: 'headline' as const,
      title: 'Autonomous Brand Video Studio',
      subtitle: 'Universal Amalgam Motion Graphics Engine',
      durationSeconds: 4.0,
      badgeText: 'Launch Engine'
    },
    {
      id: 'scene-2',
      layoutType: 'physics-drop' as const,
      title: 'Physics & Motion Unleashed',
      subtitle: 'Dynamic Badge Collisions and Reactive Visuals',
      durationSeconds: 5.0,
      customProps: {
        badges: ['⚡ 0ms Cold Start', '🛡️ 100% Type-Safe', '📱 16:9 & 9:16 Dual Mode', '🎬 Deterministic FFmpeg']
      }
    },
    {
      id: 'scene-3',
      layoutType: 'rough-diagram' as const,
      title: 'Hexagonal Architecture Core',
      durationSeconds: 5.5
    },
    {
      id: 'scene-4',
      layoutType: 'outro-badge' as const,
      title: 'Open Source & Ready to Deploy',
      subtitle: 'Generate Any Video Without Altering Code',
      durationSeconds: 5.5,
      highlightText: 'github.com/brand-video-studio'
    }
  ]
};

const legacyDefaultProps = {
  projectName: 'GoF Design Patterns Masterclass',
  tagline: 'Master all 23 Gang of Four design patterns with interactive playgrounds',
  projectUrl: 'https://design-patterns-cyan.vercel.app/',
  colors: {
    background: '#090d16',
    foreground: '#f8fafc',
    accent: '#f59e0b',
    secondaryAccent: '#06b6d4'
  },
  captions: [],
  character: {
    enabled: true,
    imagePath: 'developer-model-sheet.jpg'
  }
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ============================================================ */}
      {/* UNIVERSAL DUMB CANVAS COMPOSITIONS (NEW AMALGAM SYSTEM)       */}
      {/* ============================================================ */}
      <Composition
        id="UniversalVideo"
        component={UniversalMotionCanvas}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ manifest: defaultManifest }}
      />

      <Composition
        id="UniversalVideo-Landscape"
        component={UniversalMotionCanvas}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ manifest: defaultManifest }}
      />

      <Composition
        id="UniversalVideo-Portrait"
        component={UniversalMotionCanvas}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          manifest: {
            ...defaultManifest,
            aspectRatio: '9:16'
          }
        }}
      />

      {/* ============================================================ */}
      {/* LEGACY COMPOSITIONS (BACKWARDS-COMPATIBILITY)                */}
      {/* ============================================================ */}
      <Composition
        id="BrandVideo"
        component={BrandVideoComposition}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={legacyDefaultProps}
      />

      <Composition
        id="BrandVideo-Landscape"
        component={BrandVideoComposition}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={legacyDefaultProps}
      />

      <Composition
        id="BrandVideo-Portrait"
        component={BrandVideoComposition}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...legacyDefaultProps,
          character: {
            enabled: true,
            type: 'coder' as const
          }
        }}
      />
    </>
  );
};
