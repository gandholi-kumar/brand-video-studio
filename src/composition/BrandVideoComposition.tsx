import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile
} from 'remotion';
import { KineticCaptions, WordToken } from './components/KineticCaptions';
import { AnimatedCharacter } from './components/AnimatedCharacter';
import { CinematicCamera } from './components/CinematicCamera';
import { PerspectiveCard } from './components/PerspectiveCard';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { MessyCodeStream } from './components/MessyCodeStream';
import { LivingNodeSimulator } from './components/LivingNodeSimulator';
import { LiveCodeTyping } from './components/LiveCodeTyping';

export interface SerializedScene {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
}

export interface CharacterConfig {
  enabled?: boolean;
  type?: string;
  imagePath?: string;
  pose?: 'front' | 'side' | 'back' | 'auto';
  label?: string;
  size?: number;
}

export interface BrandVideoProps {
  [key: string]: unknown;
  projectName: string;
  tagline: string;
  projectUrl?: string;
  colors?: {
    background: string;
    foreground: string;
    accent: string;
    secondaryAccent?: string;
  };
  captions?: WordToken[];
  scenes?: SerializedScene[];
  character?: CharacterConfig;
}

export const BrandVideoComposition: React.FC<BrandVideoProps> = ({
  projectName = 'GoF Design Patterns Masterclass',
  tagline = 'Master all 23 Gang of Four patterns with interactive playgrounds',
  projectUrl,
  colors = {
    background: '#090d16',
    foreground: '#f8fafc',
    accent: '#f59e0b',
    secondaryAccent: '#06b6d4'
  },
  captions = [],
  scenes = [],
  character = {
    enabled: true,
    type: 'coder'
  }
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;

  const hookScene = scenes.find((s) => s.type === 'hook');
  const hookTitle = hookScene?.title || 'Still writing 800-line God Classes?';
  const cleanUrl = projectUrl
    ? projectUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : 'design-patterns-cyan.vercel.app';

  // Scene Transitions (Staggered overlaps with spring eases)
  // Scene 1: Hook (Frames 0 - 90 / 0.0s - 3.0s)
  const hookSpring = spring({ frame, fps, config: { damping: 14 } });
  const hookScale = interpolate(hookSpring, [0, 1], [0.85, 1]);
  const hookOpacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0]);

  // Scene 2: Reveal (Frames 90 - 210 / 3.0s - 7.0s)
  const revealFrame = frame - 90;
  const revealSpring = spring({ frame: revealFrame, fps, config: { damping: 14 } });
  const revealScale = interpolate(revealSpring, [0, 1], [0.9, 1]);
  const revealOpacity = interpolate(revealFrame, [0, 20, 100, 120], [0, 1, 1, 0]);

  // Scene 3: Living Simulator (Frames 210 - 360 / 7.0s - 12.0s)
  const deFrame = frame - 210;
  const deOpacity = interpolate(deFrame, [0, 20, 130, 150], [0, 1, 1, 0]);

  // Scene 4: Monaco Runner (Frames 360 - 510 / 12.0s - 17.0s)
  const monoFrame = frame - 360;
  const monoOpacity = interpolate(monoFrame, [0, 20, 130, 150], [0, 1, 1, 0]);

  // Scene 5: Outro (Frames 510 - 600 / 17.0s - 20.0s)
  const outroFrame = frame - 510;
  const outroSpring = spring({ frame: outroFrame, fps, config: { damping: 14 } });
  const outroScale = interpolate(outroSpring, [0, 1], [0.95, 1]);
  const outroOpacity = interpolate(outroFrame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Cinematic Background Atmosphere */}
      <BackgroundAtmosphere
        primaryAccent={colors.accent}
        secondaryAccent={colors.secondaryAccent || '#06b6d4'}
        backgroundColor={colors.background}
      />

      {/* ============================================================ */}
      {/* SCENE 1: THE FRUSTRATION (CHAOTIC CODE STREAM & REALITY CHECK) */}
      {/* ============================================================ */}
      <Sequence from={0} durationInFrames={90}>
        <CinematicCamera durationInFrames={90} startScale={1.0} endScale={1.08}>
          <AbsoluteFill
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: hookOpacity,
              transform: `scale(${hookScale})`,
              padding: isPortrait ? '0 30px' : '0 80px'
            }}
          >
            {/* Flashing Alert Badge */}
            <div
              style={{
                padding: isPortrait ? '8px 20px' : '10px 24px',
                borderRadius: 30,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1.5px solid #ef4444',
                color: '#f87171',
                fontSize: isPortrait ? 18 : 22,
                fontWeight: 800,
                marginBottom: 20,
                letterSpacing: '0.08em',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <span>🚨</span> ARCHITECTURE REALITY CHECK
            </div>

            {/* Hook Headline */}
            <h1
              style={{
                fontSize: isPortrait ? 52 : 72,
                fontWeight: 900,
                textAlign: 'center',
                maxWidth: isPortrait ? 920 : 1200,
                lineHeight: 1.15,
                margin: '0 0 24px 0',
                letterSpacing: '-0.02em',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)'
              }}
            >
              {hookTitle === 'Still writing 800-line God Classes?' ? (
                <>
                  Still writing <span style={{ color: '#ef4444' }}>800-line God Classes</span>?
                </>
              ) : (
                hookTitle
              )}
            </h1>

            {/* In 9:16 portrait, display the Developer character looking at the messy code */}
            {isPortrait && character?.enabled && (
              <div style={{ marginBottom: 20 }}>
                <AnimatedCharacter
                  type={character.type || 'developer'}
                  pose="back"
                  accentColor="#ef4444"
                  size={180}
                />
              </div>
            )}

            {/* Chaotic Scrolling Code Stream */}
            <PerspectiveCard
              width={isPortrait ? 820 : 960}
              rotateX={10}
              rotateY={-5}
              rotateZ={1}
              accentColor="#ef4444"
            >
              <MessyCodeStream isPortrait={isPortrait} accentColor="#ef4444" />
            </PerspectiveCard>
          </AbsoluteFill>
        </CinematicCamera>
      </Sequence>

      {/* ============================================================ */}
      {/* SCENE 2: THE HERO DROP (3D MOCKUP & PATTERN CATEGORY BURST)  */}
      {/* ============================================================ */}
      <Sequence from={90} durationInFrames={120}>
        <CinematicCamera durationInFrames={120} startScale={1.0} endScale={1.06}>
          <AbsoluteFill
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: revealOpacity,
              transform: `scale(${revealScale})`,
              padding: isPortrait ? '0 30px' : '0 60px'
            }}
          >
            {/* Category Badges with Staggered Entrance */}
            <div
              style={{
                display: 'flex',
                gap: isPortrait ? 12 : 20,
                marginBottom: 24
              }}
            >
              <span
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  border: '1.5px solid #10b981',
                  color: '#34d399',
                  padding: isPortrait ? '6px 16px' : '8px 22px',
                  borderRadius: 24,
                  fontSize: isPortrait ? 16 : 20,
                  fontWeight: 800,
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
                }}
              >
                Creational (5)
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.18)',
                  border: '1.5px solid #6366f1',
                  color: '#818cf8',
                  padding: isPortrait ? '6px 16px' : '8px 22px',
                  borderRadius: 24,
                  fontSize: isPortrait ? 16 : 20,
                  fontWeight: 800,
                  boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)'
                }}
              >
                Structural (7)
              </span>
              <span
                style={{
                  backgroundColor: `${colors.accent}22`,
                  border: `1.5px solid ${colors.accent}`,
                  color: colors.accent,
                  padding: isPortrait ? '6px 16px' : '8px 22px',
                  borderRadius: 24,
                  fontSize: isPortrait ? 16 : 20,
                  fontWeight: 800,
                  boxShadow: `0 0 25px ${colors.accent}44`
                }}
              >
                Behavioral (11)
              </span>
            </div>

            {/* Hero Project Title */}
            <h1
              style={{
                fontSize: isPortrait ? 64 : 86,
                fontWeight: 900,
                textAlign: 'center',
                margin: 0,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                textShadow: `0 0 40px ${colors.accent}55`
              }}
            >
              {projectName}
            </h1>

            <p
              style={{
                fontSize: isPortrait ? 24 : 32,
                color: '#94a3b8',
                maxWidth: isPortrait ? 840 : 1000,
                textAlign: 'center',
                marginTop: 16,
                lineHeight: 1.3
              }}
            >
              {tagline}
            </p>

            {/* Mascot Greeting */}
            {character?.enabled && (
              <div style={{ marginTop: 20 }}>
                <AnimatedCharacter
                  type={character.type || 'coder'}
                  accentColor={colors.accent}
                  size={isPortrait ? 220 : 200}
                />
              </div>
            )}
          </AbsoluteFill>
        </CinematicCamera>
      </Sequence>

      {/* ============================================================ */}
      {/* SCENE 3: LIVING ARCHITECTURE (EVENT BUS SIMULATOR & RADAR)   */}
      {/* ============================================================ */}
      <Sequence from={210} durationInFrames={150}>
        <CinematicCamera durationInFrames={150} startScale={1.0} endScale={1.07}>
          <AbsoluteFill
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: deOpacity,
              padding: isPortrait ? '0 20px' : '0 40px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span
                style={{
                  color: colors.secondaryAccent || '#06b6d4',
                  fontWeight: 800,
                  fontSize: isPortrait ? 18 : 22,
                  letterSpacing: '0.06em'
                }}
              >
                INTERACTIVE ARCHITECTURAL DECISION ENGINE
              </span>
              <h2
                style={{
                  fontSize: isPortrait ? 32 : 46,
                  fontWeight: 900,
                  margin: '8px 0 0 0',
                  color: '#ffffff'
                }}
              >
                Simulate Before You Refactor
              </h2>
            </div>

            <PerspectiveCard
              width={isPortrait ? 940 : 1150}
              rotateX={8}
              rotateY={-5}
              rotateZ={1}
              accentColor={colors.secondaryAccent || '#06b6d4'}
            >
              <LivingNodeSimulator
                primaryAccent={colors.accent}
                secondaryAccent={colors.secondaryAccent || '#06b6d4'}
                isPortrait={isPortrait}
              />
            </PerspectiveCard>
          </AbsoluteFill>
        </CinematicCamera>
      </Sequence>

      {/* ============================================================ */}
      {/* SCENE 4: REAL-TIME MONACO CODE RUNNER & TELEMETRY STREAM     */}
      {/* ============================================================ */}
      <Sequence from={360} durationInFrames={150}>
        <CinematicCamera durationInFrames={150} startScale={1.0} endScale={1.07}>
          <AbsoluteFill
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: monoOpacity,
              padding: isPortrait ? '0 20px' : '0 40px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span
                style={{
                  color: colors.accent,
                  fontWeight: 800,
                  fontSize: isPortrait ? 18 : 22,
                  letterSpacing: '0.06em'
                }}
              >
                LIVE MONACO PLAYGROUND & SIMULATORS
              </span>
              <h2
                style={{
                  fontSize: isPortrait ? 32 : 46,
                  fontWeight: 900,
                  margin: '8px 0 0 0',
                  color: '#ffffff'
                }}
              >
                Execute Real TypeScript in the Browser
              </h2>
            </div>

            {/* In 9:16 portrait, display the Developer character observing the live execution */}
            {isPortrait && character?.enabled && (
              <div style={{ marginBottom: 16 }}>
                <AnimatedCharacter
                  type={character.type || 'developer'}
                  pose="side"
                  accentColor={colors.accent}
                  size={190}
                />
              </div>
            )}

            <PerspectiveCard
              width={isPortrait ? 940 : 1150}
              rotateX={6}
              rotateY={-4}
              rotateZ={1}
              accentColor={colors.accent}
            >
              <LiveCodeTyping accentColor={colors.accent} isPortrait={isPortrait} />
            </PerspectiveCard>
          </AbsoluteFill>
        </CinematicCamera>
      </Sequence>

      {/* ============================================================ */}
      {/* SCENE 5: CLIMAX & METALLIC SHIMMER CALL TO ACTION            */}
      {/* ============================================================ */}
      <Sequence from={510} durationInFrames={90}>
        <CinematicCamera durationInFrames={90} startScale={1.0} endScale={1.05}>
          <AbsoluteFill
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: outroOpacity,
              transform: `scale(${outroScale})`,
              padding: isPortrait ? '0 30px' : '0'
            }}
          >
            {/* Celebrating Mascot / Developer Character */}
            {character?.enabled && (
              <div style={{ marginBottom: 16 }}>
                <AnimatedCharacter
                  type={character.type || 'developer'}
                  pose="front"
                  accentColor={colors.accent}
                  size={isPortrait ? 260 : 220}
                />
              </div>
            )}

            <div
              style={{
                padding: '8px 22px',
                borderRadius: 24,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '1.5px solid #10b981',
                color: '#34d399',
                fontSize: isPortrait ? 18 : 22,
                fontWeight: 800,
                marginBottom: 20,
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
              }}
            >
              100% FREE & OPEN SOURCE
            </div>

            <h1
              style={{
                fontSize: isPortrait ? 64 : 88,
                fontWeight: 900,
                textAlign: 'center',
                margin: 0,
                letterSpacing: '-0.03em',
                textShadow: '0 4px 30px rgba(0,0,0,0.8)'
              }}
            >
              {projectName}
            </h1>

            {/* Glowing CTA Pill with Shimmer */}
            <div
              style={{
                position: 'relative',
                marginTop: 28,
                padding: isPortrait ? '14px 40px' : '18px 52px',
                borderRadius: 18,
                backgroundColor: colors.accent,
                color: '#090d16',
                fontSize: isPortrait ? 24 : 32,
                fontWeight: 900,
                boxShadow: `0 0 60px ${colors.accent}88, 0 15px 35px rgba(0,0,0,0.5)`,
                letterSpacing: '-0.01em',
                overflow: 'hidden'
              }}
            >
              {cleanUrl}

              {/* Sweeping Highlight on Button */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%)',
                  transform: `translateX(${interpolate(frame % 60, [0, 40], [-100, 200])}%)`
                }}
              />
            </div>
          </AbsoluteFill>
        </CinematicCamera>
      </Sequence>

      {/* Kinetic Subtitles synchronized with whisper word timestamps */}
      <KineticCaptions words={captions} accentColor={colors.accent} textColor="#ffffff" />

      {/* Background Soundtrack with smooth 2s outro fade */}
      <Audio
        src={staticFile('soundtrack.mp3')}
        volume={(f) =>
          interpolate(f, [540, 600], [0.85, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          })
        }
      />
    </AbsoluteFill>
  );
};
