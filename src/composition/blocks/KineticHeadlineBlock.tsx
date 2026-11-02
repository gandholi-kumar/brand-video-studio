import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { springs } from '../../const/motion.const';
import { FONT_SIZES } from '../../const/theme.const';

export interface KineticHeadlineBlockProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  highlightText?: string;
  accentColor: string;
  isPortrait: boolean;
  sceneDurationInFrames: number;
}

export const KineticHeadlineBlock: React.FC<KineticHeadlineBlockProps> = ({
  title,
  subtitle,
  badgeText,
  highlightText,
  accentColor,
  isPortrait,
  sceneDurationInFrames
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge spring entrance (Frame 0-20)
  const badgeSpring = spring({ frame, fps, config: springs.bouncy });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.5, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);

  // Title spring entrance (Frame 5-30)
  const titleSpring = spring({ frame: frame - 5, fps, config: springs.snappy });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  // Subtitle stagger entrance (Frame 18-45)
  const subtitleSpring = spring({ frame: frame - 18, fps, config: springs.gentle });
  const subtitleY = interpolate(subtitleSpring, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);

  // Continuous subtle pulse on highlight
  const highlightGlow = interpolate(Math.sin((frame / fps) * 4), [-1, 1], [0.3, 0.7]);

  // Safe scene fadeout at the end
  const sceneFade = interpolate(
    frame,
    [sceneDurationInFrames - 15, sceneDurationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const fontSizes = isPortrait ? FONT_SIZES['9:16'] : FONT_SIZES['16:9'];

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
        padding: isPortrait ? '0 40px' : '0 80px',
        opacity: sceneFade
      }}
    >
      {badgeText && (
        <div
          style={{
            transform: `scale(${badgeScale})`,
            opacity: badgeOpacity,
            padding: isPortrait ? '8px 20px' : '10px 24px',
            borderRadius: 30,
            backgroundColor: `${accentColor}22`,
            border: `1.5px solid ${accentColor}`,
            color: accentColor,
            fontSize: fontSizes.badge,
            fontWeight: 800,
            marginBottom: 24,
            letterSpacing: '0.08em',
            boxShadow: `0 0 30px ${accentColor}33`,
            textTransform: 'uppercase'
          }}
        >
          {badgeText}
        </div>
      )}

      <h1
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          fontSize: fontSizes.headline,
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          margin: 0,
          maxWidth: isPortrait ? 960 : 1300,
          color: '#ffffff',
          textShadow: '0 4px 25px rgba(0,0,0,0.85)'
        }}
      >
        {highlightText && title.includes(highlightText) ? (
          <>
            {title.split(highlightText)[0]}
            <span
              style={{
                color: accentColor,
                textShadow: `0 0 35px ${accentColor}${Math.round(highlightGlow * 100)}`
              }}
            >
              {highlightText}
            </span>
            {title.split(highlightText)[1]}
          </>
        ) : (
          title
        )}
      </h1>

      {subtitle && (
        <p
          style={{
            transform: `translateY(${subtitleY}px)`,
            opacity: subtitleOpacity,
            fontSize: fontSizes.subHeadline,
            color: '#94a3b8',
            maxWidth: isPortrait ? 880 : 1000,
            marginTop: 20,
            lineHeight: 1.35,
            fontWeight: 500
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

