import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { springs } from '../../const/motion.const';
import { AnimatedCharacter } from '../components/AnimatedCharacter';

export interface OutroBadgeBlockProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  badgeText?: string;
  accentColor: string;
  characterEnabled?: boolean;
  characterType?: string;
  isPortrait: boolean;
  sceneDurationInFrames?: number;
}

export const OutroBadgeBlock: React.FC<OutroBadgeBlockProps> = ({
  title,
  subtitle,
  ctaText,
  badgeText = '100% Free & Open Source',
  accentColor,
  characterEnabled = true,
  characterType = 'coder',
  isPortrait
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceSpring = spring({ frame, fps, config: springs.snappy });
  const scale = interpolate(entranceSpring, [0, 1], [0.92, 1]);
  const opacity = interpolate(entranceSpring, [0, 1], [0, 1]);

  // Shimmer cycle across CTA button (cycles every 60 frames ~ 2s)
  const shimmerTranslate = interpolate(frame % 60, [0, 45], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

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
        transform: `scale(${scale})`,
        opacity
      }}
    >
      {characterEnabled && (
        <div style={{ marginBottom: isPortrait ? 16 : 20 }}>
          <AnimatedCharacter
            type={characterType}
            pose="front"
            accentColor={accentColor}
            size={isPortrait ? 220 : 190}
          />
        </div>
      )}

      {badgeText && (
        <div
          style={{
            padding: isPortrait ? '8px 20px' : '10px 24px',
            borderRadius: 24,
            backgroundColor: 'rgba(16, 185, 129, 0.18)',
            border: '1.5px solid #10b981',
            color: '#34d399',
            fontSize: isPortrait ? 18 : 20,
            fontWeight: 800,
            marginBottom: 18,
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
          }}
        >
          {badgeText}
        </div>
      )}

      <h1
        style={{
          fontSize: isPortrait ? 58 : 78,
          fontWeight: 900,
          margin: 0,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          textShadow: '0 4px 30px rgba(0,0,0,0.85)'
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            color: '#94a3b8',
            fontSize: isPortrait ? 22 : 28,
            marginTop: 14,
            fontWeight: 500,
            maxWidth: isPortrait ? 860 : 1000
          }}
        >
          {subtitle}
        </p>
      )}

      {ctaText && (
        <div
          style={{
            position: 'relative',
            marginTop: 24,
            padding: isPortrait ? '14px 38px' : '18px 48px',
            borderRadius: 18,
            backgroundColor: accentColor,
            color: '#090d16',
            fontSize: isPortrait ? 24 : 30,
            fontWeight: 900,
            boxShadow: `0 0 60px ${accentColor}88, 0 15px 35px rgba(0,0,0,0.5)`,
            letterSpacing: '-0.01em',
            overflow: 'hidden'
          }}
        >
          {ctaText}

          {/* Sweeping diagonal light shimmer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.4) 50%, transparent 80%)',
              transform: `translateX(${shimmerTranslate}%)`
            }}
          />
        </div>
      )}
    </div>
  );
};
