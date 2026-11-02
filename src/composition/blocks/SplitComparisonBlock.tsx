import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { springs } from '../../const/motion.const';

export interface SplitComparisonBlockProps {
  title: string;
  leftTitle?: string;
  leftItems?: string[];
  rightTitle?: string;
  rightItems?: string[];
  accentColor: string;
  isPortrait: boolean;
  sceneDurationInFrames: number;
}

export const SplitComparisonBlock: React.FC<SplitComparisonBlockProps> = ({
  title,
  leftTitle = 'The Old Way',
  leftItems = ['Slow manual edits', 'Expensive render farms', 'Rigid video templates', 'Non-deterministic errors'],
  rightTitle = 'Autonomous Studio',
  rightItems = ['Instant prompt-to-video', '$0-cost local execution', 'Fully dynamic dumb engine', '100% deterministic code'],
  accentColor,
  isPortrait,
  sceneDurationInFrames
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: springs.snappy });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const leftSpring = spring({ frame: frame - 10, fps, config: springs.gentle });
  const leftX = interpolate(leftSpring, [0, 1], [-40, 0]);
  const leftOpacity = interpolate(leftSpring, [0, 1], [0, 1]);

  const rightSpring = spring({ frame: frame - 20, fps, config: springs.bouncy });
  const rightX = interpolate(rightSpring, [0, 1], [40, 0]);
  const rightOpacity = interpolate(rightSpring, [0, 1], [0, 1]);

  const sceneFade = interpolate(
    frame,
    [sceneDurationInFrames - 15, sceneDurationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: isPortrait ? '0 24px' : '0 60px',
        opacity: sceneFade
      }}
    >
      <h2
        style={{
          opacity: titleOpacity,
          fontSize: isPortrait ? 44 : 54,
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: 32,
          textAlign: 'center'
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: isPortrait ? 'column' : 'row',
          gap: isPortrait ? 18 : 36,
          width: '100%',
          maxWidth: isPortrait ? 880 : 1240
        }}
      >
        {/* Left Column (Negative / Problem) */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${leftX}px)`,
            opacity: leftOpacity,
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 24,
            padding: isPortrait ? '20px' : '32px',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div style={{ color: '#f87171', fontWeight: 800, fontSize: isPortrait ? 20 : 24, marginBottom: 16 }}>
            ✕ {leftTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {leftItems.map((item, i) => (
              <div key={i} style={{ color: '#94a3b8', fontSize: isPortrait ? 16 : 20, display: 'flex', gap: 8 }}>
                <span style={{ color: '#ef4444' }}>•</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Positive / Solution) */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${rightX}px)`,
            opacity: rightOpacity,
            backgroundColor: `${accentColor}12`,
            border: `1.5px solid ${accentColor}`,
            borderRadius: 24,
            padding: isPortrait ? '20px' : '32px',
            boxShadow: `0 0 35px ${accentColor}25`,
            backdropFilter: 'blur(12px)'
          }}
        >
          <div style={{ color: accentColor, fontWeight: 800, fontSize: isPortrait ? 20 : 24, marginBottom: 16 }}>
            ✓ {rightTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rightItems.map((item, i) => (
              <div key={i} style={{ color: '#ffffff', fontSize: isPortrait ? 16 : 20, fontWeight: 600, display: 'flex', gap: 8 }}>
                <span style={{ color: accentColor }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

