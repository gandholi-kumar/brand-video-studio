import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { springs } from '../../const/motion.const';

export interface StatItem {
  label: string;
  value: number | string;
  suffix?: string;
}

export interface StatHighlightBlockProps {
  title: string;
  stats?: StatItem[];
  accentColor: string;
  secondaryAccent: string;
  isPortrait: boolean;
  sceneDurationInFrames: number;
}

export const StatHighlightBlock: React.FC<StatHighlightBlockProps> = ({
  title,
  stats = [
    { label: 'Rendering Speed', value: 10, suffix: 'x' },
    { label: 'Production Cost', value: 0, suffix: '$' },
    { label: 'Time Saved', value: 95, suffix: '%' }
  ],
  accentColor,
  secondaryAccent,
  isPortrait,
  sceneDurationInFrames
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: springs.snappy });
  const titleY = interpolate(titleSpring, [0, 1], [30, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

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
        textAlign: 'center',
        width: '100%',
        height: '100%',
        padding: isPortrait ? '0 30px' : '0 60px',
        opacity: sceneFade
      }}
    >
      <h2
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          fontSize: isPortrait ? 48 : 58,
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: 36,
          letterSpacing: '-0.02em'
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: isPortrait ? 'column' : 'row',
          gap: isPortrait ? 20 : 32,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: isPortrait ? 880 : 1200
        }}
      >
        {stats.map((stat, idx) => {
          const delay = 10 + idx * 8;
          const cardSpring = spring({ frame: frame - delay, fps, config: springs.bouncy });
          const cardScale = interpolate(cardSpring, [0, 1], [0.6, 1]);
          const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

          // Counter progression
          const numericVal = typeof stat.value === 'number' ? stat.value : parseFloat(stat.value) || 0;
          const countProgress = interpolate(frame - delay, [0, 30], [0, numericVal], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          });
          const displayCount = Math.round(countProgress);

          const cardAccent = idx % 2 === 0 ? accentColor : secondaryAccent;

          return (
            <div
              key={idx}
              style={{
                transform: `scale(${cardScale})`,
                opacity: cardOpacity,
                flex: 1,
                width: isPortrait ? '100%' : 'auto',
                backgroundColor: 'rgba(15, 23, 42, 0.88)',
                border: `1.5px solid ${cardAccent}55`,
                borderRadius: 24,
                padding: isPortrait ? '24px 20px' : '36px 28px',
                boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${cardAccent}22`,
                backdropFilter: 'blur(16px)'
              }}
            >
              <div
                style={{
                  fontSize: isPortrait ? 56 : 72,
                  fontWeight: 900,
                  color: cardAccent,
                  letterSpacing: '-0.03em',
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              >
                {stat.suffix === '$' ? `$${displayCount}` : `${displayCount}${stat.suffix || ''}`}
              </div>
              <div
                style={{
                  fontSize: isPortrait ? 20 : 22,
                  fontWeight: 700,
                  color: '#94a3b8',
                  marginTop: 8
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

