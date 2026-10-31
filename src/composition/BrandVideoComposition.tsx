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

export interface BrandVideoProps {
  [key: string]: unknown;
  projectName: string;
  tagline: string;
  colors?: {
    background: string;
    foreground: string;
    accent: string;
    secondaryAccent?: string;
  };
  captions?: WordToken[];
}

export const BrandVideoComposition: React.FC<BrandVideoProps> = ({
  projectName = 'GoF Design Patterns Masterclass',
  tagline = 'Master all 23 Gang of Four patterns with interactive playgrounds',
  colors = {
    background: '#090d16',
    foreground: '#f8fafc',
    accent: '#f59e0b',
    secondaryAccent: '#06b6d4'
  },
  captions = []
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene 1: Hook (Frames 0 - 90 / 0.0s - 3.0s)
  const hookSpring = spring({ frame, fps, config: { damping: 14 } });
  const hookScale = interpolate(hookSpring, [0, 1], [0.8, 1]);
  const hookOpacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0]);

  // Scene 2: Reveal (Frames 90 - 210 / 3.0s - 7.0s)
  const revealFrame = frame - 90;
  const revealSpring = spring({ frame: revealFrame, fps, config: { damping: 15 } });
  const revealScale = interpolate(revealSpring, [0, 1], [0.9, 1]);
  const revealOpacity = interpolate(revealFrame, [0, 20, 100, 120], [0, 1, 1, 0]);

  // Scene 3: Decision Engine (Frames 210 - 360 / 7.0s - 12.0s)
  const deFrame = frame - 210;
  const deSpring = spring({ frame: deFrame, fps, config: { damping: 16 } });
  const deScale = interpolate(deSpring, [0, 1], [0.92, 1]);
  const deOpacity = interpolate(deFrame, [0, 20, 130, 150], [0, 1, 1, 0]);

  // Scene 4: Monaco Playground & Simulators (Frames 360 - 510 / 12.0s - 17.0s)
  const monoFrame = frame - 360;
  const monoSpring = spring({ frame: monoFrame, fps, config: { damping: 16 } });
  const monoScale = interpolate(monoSpring, [0, 1], [0.95, 1]);
  const monoOpacity = interpolate(monoFrame, [0, 20, 130, 150], [0, 1, 1, 0]);

  // Scene 5: Outro & Call to Action (Frames 510 - 600 / 17.0s - 20.0s)
  const outroFrame = frame - 510;
  const outroSpring = spring({ frame: outroFrame, fps, config: { damping: 14 } });
  const outroScale = interpolate(outroSpring, [0, 1], [0.95, 1]);
  const outroOpacity = interpolate(outroFrame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Background Subtle Gradient Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.accent}12 0%, transparent 70%)`
        }}
      />

      {/* SCENE 1: THE HOOK */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: hookOpacity,
            transform: `scale(${hookScale})`
          }}
        >
          <div
            style={{
              padding: '12px 28px',
              borderRadius: 30,
              backgroundColor: `${colors.accent}22`,
              border: `1px solid ${colors.accent}`,
              color: colors.accent,
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 30,
              letterSpacing: '0.05em'
            }}
          >
            ARCHITECTURE REALITY CHECK
          </div>
          <h1
            style={{
              fontSize: 76,
              fontWeight: 900,
              textAlign: 'center',
              maxWidth: 1200,
              lineHeight: 1.15,
              margin: 0
            }}
          >
            Still writing <span style={{ color: '#ef4444' }}>800-line God Classes</span>?
          </h1>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2: THE REVEAL */}
      <Sequence from={90} durationInFrames={120}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: revealOpacity,
            transform: `scale(${revealScale})`
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginBottom: 24
            }}
          >
            <span style={{ backgroundColor: '#10b98122', border: '1px solid #10b981', color: '#10b981', padding: '6px 16px', borderRadius: 20, fontSize: 18, fontWeight: 700 }}>
              Creational
            </span>
            <span style={{ backgroundColor: '#6366f122', border: '1px solid #6366f1', color: '#6366f1', padding: '6px 16px', borderRadius: 20, fontSize: 18, fontWeight: 700 }}>
              Structural
            </span>
            <span style={{ backgroundColor: `${colors.accent}22`, border: `1px solid ${colors.accent}`, color: colors.accent, padding: '6px 16px', borderRadius: 20, fontSize: 18, fontWeight: 700 }}>
              Behavioral
            </span>
          </div>
          <h1
            style={{
              fontSize: 82,
              fontWeight: 900,
              textAlign: 'center',
              margin: 0,
              color: '#ffffff',
              letterSpacing: '-0.03em'
            }}
          >
            {projectName}
          </h1>
          <p
            style={{
              fontSize: 32,
              color: '#94a3b8',
              maxWidth: 900,
              textAlign: 'center',
              marginTop: 20
            }}
          >
            {tagline}
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 3: ARCHITECTURAL DECISION ENGINE */}
      <Sequence from={210} durationInFrames={150}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: deOpacity,
            transform: `scale(${deScale})`
          }}
        >
          <div
            style={{
              width: 1100,
              backgroundColor: '#111726',
              border: `2px solid ${colors.secondaryAccent || '#06b6d4'}`,
              borderRadius: 24,
              padding: 48,
              boxShadow: `0 0 50px ${colors.secondaryAccent || '#06b6d4'}33`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ color: colors.secondaryAccent || '#06b6d4', fontWeight: 800, fontSize: 24 }}>
                ⚡ Architectural Decision Engine
              </span>
              <span style={{ backgroundColor: '#1e293b', padding: '6px 16px', borderRadius: 12, color: '#94a3b8', fontSize: 16 }}>
                Diagnosis Mode
              </span>
            </div>
            <h2 style={{ fontSize: 44, fontWeight: 800, margin: '0 0 16px 0' }}>
              &quot;Need to swap algorithms at runtime without modifying client code?&quot;
            </h2>
            <div style={{ display: 'flex', gap: 20, marginTop: 28 }}>
              <div style={{ flex: 1, backgroundColor: '#1e293b', border: `2px solid ${colors.accent}`, borderRadius: 16, padding: 20 }}>
                <div style={{ color: colors.accent, fontWeight: 800, fontSize: 20 }}>RECOMMENDED PATTERN</div>
                <div style={{ color: '#ffffff', fontSize: 32, fontWeight: 900, marginTop: 8 }}>Strategy Pattern</div>
                <div style={{ color: '#94a3b8', fontSize: 16, marginTop: 6 }}>Eliminates tight coupling · Open/Closed Principle</div>
              </div>
              <div style={{ flex: 1, backgroundColor: '#0f172a', borderRadius: 16, padding: 20, border: '1px solid #334155' }}>
                <div style={{ color: '#64748b', fontWeight: 800, fontSize: 20 }}>TRADE-OFF IMPACT</div>
                <div style={{ color: '#10b981', fontSize: 32, fontWeight: 900, marginTop: 8 }}>High Modularity</div>
                <div style={{ color: '#94a3b8', fontSize: 16, marginTop: 6 }}>+100% Extensibility · Clean Isolation</div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 4: MONACO PLAYGROUND & SIMULATORS */}
      <Sequence from={360} durationInFrames={150}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: monoOpacity,
            transform: `scale(${monoScale})`
          }}
        >
          <div
            style={{
              width: 1200,
              backgroundColor: '#0d1117',
              border: '2px solid #30363d',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ backgroundColor: '#161b22', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#27c93f' }} />
              <span style={{ marginLeft: 20, color: '#8b949e', fontFamily: 'JetBrains Mono, monospace', fontSize: 16 }}>
                observer-pattern.ts — Monaco Editor & Interactive Execution
              </span>
            </div>
            <div style={{ padding: 36, fontFamily: 'JetBrains Mono, monospace', fontSize: 22, lineHeight: 1.6 }}>
              <div><span style={{ color: '#ff7b72' }}>interface</span> <span style={{ color: '#79c0ff' }}>Observer</span> {'{'} <span style={{ color: '#d2a8ff' }}>update</span>(state: <span style={{ color: '#79c0ff' }}>State</span>): <span style={{ color: '#ff7b72' }}>void</span>; {'}'}</div>
              <div><span style={{ color: '#ff7b72' }}>class</span> <span style={{ color: '#79c0ff' }}>Subject</span> {'{'}</div>
              <div style={{ paddingLeft: 30 }}><span style={{ color: '#ff7b72' }}>private</span> observers: <span style={{ color: '#79c0ff' }}>Observer</span>[] = [];</div>
              <div style={{ paddingLeft: 30 }}><span style={{ color: '#d2a8ff' }}>notify</span>() {'{'} <span style={{ color: '#ff7b72' }}>this</span>.observers.<span style={{ color: '#d2a8ff' }}>forEach</span>(o =&gt; o.<span style={{ color: '#d2a8ff' }}>update</span>(<span style={{ color: '#ff7b72' }}>this</span>.state)); {'}'}</div>
              <div>{'}'}</div>
              <div style={{ marginTop: 24, padding: '14px 20px', backgroundColor: '#1f242c', borderRadius: 10, borderLeft: `4px solid ${colors.accent}`, color: '#a5d6ff' }}>
                🚀 [Execution Console] 3 Observers notified · Real-time event dispatched
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 5: OUTRO & CALL TO ACTION */}
      <Sequence from={510} durationInFrames={90}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: outroOpacity,
            transform: `scale(${outroScale})`
          }}
        >
          <div
            style={{
              padding: '10px 24px',
              borderRadius: 20,
              backgroundColor: '#10b98122',
              border: '1px solid #10b981',
              color: '#10b981',
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 24
            }}
          >
            FREE & OPEN SOURCE
          </div>
          <h1
            style={{
              fontSize: 88,
              fontWeight: 900,
              textAlign: 'center',
              margin: 0,
              letterSpacing: '-0.03em'
            }}
          >
            {projectName}
          </h1>
          <div
            style={{
              marginTop: 36,
              padding: '18px 48px',
              borderRadius: 16,
              backgroundColor: colors.accent,
              color: '#090d16',
              fontSize: 32,
              fontWeight: 900,
              boxShadow: `0 0 50px ${colors.accent}66`,
              letterSpacing: '-0.01em'
            }}
          >
            design-patterns-cyan.vercel.app
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* KINETIC CAPTIONS OVERLAY (Synchronized with Whisper) */}
      <KineticCaptions words={captions} accentColor={colors.accent} textColor="#ffffff" />

      {/* BACKGROUND SOUNDTRACK (Native Remotion Audio with 2s outro fade) */}
      <Audio
        src={staticFile('soundtrack.mp3')}
        volume={(f) =>
          interpolate(f, [540, 600], [0.8, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          })
        }
      />
    </AbsoluteFill>
  );
};
