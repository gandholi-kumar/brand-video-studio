import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { springs } from '../../const/motion.const';

export interface WatercolorCanvasBlockProps {
  title: string;
  subtitle?: string;
  accentColor: string;
  secondaryAccent: string;
  isPortrait: boolean;
  sceneDurationInFrames: number;
}

export const WatercolorCanvasBlock: React.FC<WatercolorCanvasBlockProps> = ({
  title,
  subtitle,
  accentColor,
  secondaryAccent,
  isPortrait,
  sceneDurationInFrames
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: springs.snappy });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  // Expanding watercolor pigment bleed (sine wave radius growth)
  const bleedRadius1 = interpolate(frame, [0, 90], [20, 280], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const bleedRadius2 = interpolate(frame, [15, 110], [10, 240], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

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
        opacity: sceneFade,
        position: 'relative'
      }}
    >
      {/* Organic Watercolor Bleed Canvas Backing */}
      <div
        style={{
          position: 'absolute',
          width: isPortrait ? 700 : 900,
          height: isPortrait ? 500 : 400,
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
          filter: 'blur(45px)',
          transform: `scale(${bleedRadius1 / 200})`,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: isPortrait ? 600 : 800,
          height: isPortrait ? 400 : 350,
          borderRadius: '60% 40% 30% 70% / 50% 30% 70% 40%',
          background: `radial-gradient(circle, ${secondaryAccent}25 0%, transparent 65%)`,
          filter: 'blur(50px)',
          transform: `scale(${bleedRadius2 / 180}) translate(60px, -40px)`,
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: isPortrait ? 860 : 1100,
          backgroundColor: 'rgba(18, 16, 24, 0.75)',
          border: '1.5px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 28,
          padding: isPortrait ? '36px 28px' : '48px 40px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <h2
          style={{
            opacity: titleOpacity,
            fontSize: isPortrait ? 46 : 58,
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              color: '#cbd5e1',
              fontSize: isPortrait ? 22 : 28,
              marginTop: 18,
              lineHeight: 1.4,
              fontWeight: 500
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

