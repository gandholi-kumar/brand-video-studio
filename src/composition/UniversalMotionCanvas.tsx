import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
  Audio,
  staticFile,
  interpolate
} from 'remotion';
import { VideoManifestData, DynamicSceneBlock } from '../domain/entities/VideoManifest';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { CinematicCamera } from './components/CinematicCamera';
import { KineticCaptions } from './components/KineticCaptions';
import { KineticHeadlineBlock } from './blocks/KineticHeadlineBlock';
import { StatHighlightBlock } from './blocks/StatHighlightBlock';
import { SplitComparisonBlock } from './blocks/SplitComparisonBlock';
import { RoughDiagramBlock } from './blocks/RoughDiagramBlock';
import { PhysicsDropBlock } from './blocks/PhysicsDropBlock';
import { WatercolorCanvasBlock } from './blocks/WatercolorCanvasBlock';
import { OutroBadgeBlock } from './blocks/OutroBadgeBlock';
import { TOPIC_PALETTES, TYPOGRAPHY_TOKENS } from '../const/theme.const';

export interface UniversalMotionCanvasProps {
  [key: string]: unknown;
  manifest?: VideoManifestData;
}

export const UniversalMotionCanvas: React.FC<UniversalMotionCanvasProps> = ({ manifest }) => {
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;

  // Safe fallback if manifest not passed
  const safeTopic = manifest?.topic || 'tech';
  const palette = manifest?.theme?.palette || TOPIC_PALETTES[safeTopic];
  const typography = manifest?.theme?.typography || TYPOGRAPHY_TOKENS;
  const scenes: DynamicSceneBlock[] = manifest?.scenes || [
    {
      id: 'default-scene-1',
      layoutType: 'headline',
      title: manifest?.title || 'Autonomous Brand Video Studio',
      subtitle: 'Universal Amalgam Motion Graphics Engine',
      durationSeconds: 4.0,
      badgeText: 'Launch Engine'
    },
    {
      id: 'default-scene-2',
      layoutType: 'physics-drop',
      title: 'Physics & Motion Unleashed',
      subtitle: '100% Deterministic Code-Driven Video Synthesis',
      durationSeconds: 4.0
    },
    {
      id: 'default-scene-3',
      layoutType: 'outro-badge',
      title: 'Built with Remotion & Hexagonal Core',
      subtitle: 'Free & Open Source Autonomous Studio',
      durationSeconds: 4.0,
      badgeText: 'Ready to Deploy'
    }
  ];

  // Calculate cumulative start frames
  let currentStartFrame = 0;
  const scheduledScenes = scenes.map((scene) => {
    const durationInFrames = Math.round(scene.durationSeconds * fps);
    const startFrame = currentStartFrame;
    currentStartFrame += durationInFrames;
    return {
      scene,
      startFrame,
      durationInFrames
    };
  });

  const totalCompositionFrames = Math.max(currentStartFrame, 300);

  const renderSceneContent = (scene: DynamicSceneBlock, durationInFrames: number) => {
    switch (scene.layoutType) {
      case 'headline':
        return (
          <KineticHeadlineBlock
            title={scene.title}
            subtitle={scene.subtitle}
            badgeText={scene.badgeText}
            highlightText={scene.highlightText}
            accentColor={palette.accent}
            isPortrait={isPortrait}
            sceneDurationInFrames={durationInFrames}
          />
        );
      case 'stat-counter':
        return (
          <StatHighlightBlock
            title={scene.title}
            stats={scene.customProps?.stats}
            accentColor={palette.accent}
            secondaryAccent={palette.secondaryAccent}
            isPortrait={isPortrait}
            sceneDurationInFrames={durationInFrames}
          />
        );
      case 'split-comparison':
        return (
          <SplitComparisonBlock
            title={scene.title}
            leftTitle={scene.customProps?.comparison?.leftTitle}
            leftItems={scene.customProps?.comparison?.leftItems}
            rightTitle={scene.customProps?.comparison?.rightTitle}
            rightItems={scene.customProps?.comparison?.rightItems}
            accentColor={palette.accent}
            isPortrait={isPortrait}
            sceneDurationInFrames={durationInFrames}
          />
        );
      case 'rough-diagram':
        return (
          <RoughDiagramBlock
            title={scene.title}
            nodes={scene.customProps?.diagram?.nodes}
            links={scene.customProps?.diagram?.links}
            accentColor={palette.accent}
            secondaryAccent={palette.secondaryAccent}
            isPortrait={isPortrait}
            sceneDurationInFrames={durationInFrames}
          />
        );
      case 'physics-drop':
        return (
          <PhysicsDropBlock
            title={scene.title}
            subtitle={scene.subtitle}
            badges={scene.customProps?.badges}
            accentColor={palette.accent}
            secondaryAccent={palette.secondaryAccent}
            isPortrait={isPortrait}
            sceneDurationInFrames={durationInFrames}
          />
        );
      case 'watercolor-canvas':
        return (
          <WatercolorCanvasBlock
            title={scene.title}
            subtitle={scene.subtitle}
            accentColor={palette.accent}
            secondaryAccent={palette.secondaryAccent}
            isPortrait={isPortrait}
            sceneDurationInFrames={durationInFrames}
          />
        );
      case 'outro-badge':
      default:
        return (
          <OutroBadgeBlock
            title={scene.title}
            subtitle={scene.subtitle}
            badgeText={scene.badgeText}
            ctaText={scene.highlightText}
            accentColor={palette.accent}
            characterEnabled={manifest?.character?.enabled !== false}
            characterType={manifest?.character?.type || 'coder'}
            isPortrait={isPortrait}
            sceneDurationInFrames={durationInFrames}
          />
        );
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        color: palette.foreground,
        fontFamily: typography.display,
        overflow: 'hidden'
      }}
    >
      {/* Living Atmospheric Background */}
      <BackgroundAtmosphere
        primaryAccent={palette.accent}
        secondaryAccent={palette.secondaryAccent}
        backgroundColor={palette.background}
      />

      {/* Dynamic Scenes Sequence Pipeline */}
      {scheduledScenes.map(({ scene, startFrame, durationInFrames }) => (
        <Sequence
          key={scene.id}
          from={startFrame}
          durationInFrames={durationInFrames}
          name={scene.title}
        >
          <CinematicCamera durationInFrames={durationInFrames}>
            {renderSceneContent(scene, durationInFrames)}
          </CinematicCamera>
        </Sequence>
      ))}

      {/* Kinetic Word-Level Subtitles synced to Whisper timestamps */}
      {manifest?.captions && manifest.captions.length > 0 && (
        <KineticCaptions
          words={manifest.captions}
          accentColor={palette.accent}
          textColor="#ffffff"
        />
      )}

      {/* Soundtrack with automated 2-second outro fade */}
      <Audio
        src={staticFile('soundtrack.mp3')}
        volume={(f) =>
          interpolate(
            f,
            [totalCompositionFrames - 60, totalCompositionFrames],
            [0.85, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          )
        }
      />
    </AbsoluteFill>
  );
};

