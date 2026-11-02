import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { springs } from '../../const/motion.const';

export interface PhysicsDropBlockProps {
  title: string;
  subtitle?: string;
  badges?: string[];
  accentColor: string;
  secondaryAccent: string;
  isPortrait: boolean;
  sceneDurationInFrames: number;
}

export const PhysicsDropBlock: React.FC<PhysicsDropBlockProps> = ({
  title,
  subtitle,
  badges = [
    '⚡ 0ms Cold Start',
    '🛡️ 100% Type-Safe',
    '📱 16:9 & 9:16 Dual Mode',
    '🎵 Automated CC Audio',
    '🎬 Deterministic FFmpeg'
  ],
  accentColor,
  secondaryAccent,
  isPortrait,
  sceneDurationInFrames
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: springs.snappy });
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
        padding: isPortrait ? '0 24px' : '0 60px',
        opacity: sceneFade
      }}
    >
      <h2
        style={{
          opacity: titleOpacity,
          fontSize: isPortrait ? 46 : 58,
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: 12,
          letterSpacing: '-0.02em'
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p style={{ color: '#94a3b8', fontSize: isPortrait ? 20 : 26, margin: '0 0 36px 0' }}>
          {subtitle}
        </p>
      )}

      {/* Physics Container Floor */}
      <div
        style={{
          position: 'relative',
          width: isPortrait ? 880 : 1060,
          height: isPortrait ? 380 : 340,
          backgroundColor: 'rgba(10, 14, 24, 0.75)',
          border: '1.5px solid #1e293b',
          borderRadius: 24,
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          overflow: 'hidden'
        }}
      >
        {badges.map((badge, idx) => {
          // Staggered gravity drop for each badge
          const dropDelay = 12 + idx * 7;
          const dropSpring = spring({
            frame: frame - dropDelay,
            fps,
            config: springs.bouncy
          });

          // Drop from above (-300px to 0) with a slight bounce settle
          const dropY = interpolate(dropSpring, [0, 1], [-250, 0]);
          const dropScale = interpolate(dropSpring, [0, 1], [0.4, 1]);
          const dropRotation = interpolate(dropSpring, [0, 1], [(idx % 2 === 0 ? -12 : 12), 0]);
          const opacity = interpolate(dropSpring, [0, 0.2, 1], [0, 1, 1]);

          const badgeAccent = idx % 2 === 0 ? accentColor : secondaryAccent;

          return (
            <div
              key={idx}
              style={{
                transform: `translateY(${dropY}px) scale(${dropScale}) rotate(${dropRotation}deg)`,
                opacity,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: `1.5px solid ${badgeAccent}`,
                borderRadius: 20,
                padding: isPortrait ? '14px 24px' : '18px 32px',
                color: '#ffffff',
                fontSize: isPortrait ? 20 : 24,
                fontWeight: 800,
                boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 25px ${badgeAccent}33`,
                letterSpacing: '-0.01em'
              }}
            >
              {badge}
            </div>
          );
        })}
      </div>
    </div>
  );
};

