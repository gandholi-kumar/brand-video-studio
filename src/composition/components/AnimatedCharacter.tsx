import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from 'remotion';

export interface AnimatedCharacterProps {
  type?: string;
  imagePath?: string;
  accentColor?: string;
  size?: number;
  flipHorizontal?: boolean;
  pose?: 'front' | 'side' | 'back' | 'auto';
  label?: string;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  type = '',
  imagePath,
  accentColor = '#f59e0b',
  size = 320,
  flipHorizontal = false,
  pose = 'front',
  label
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro pop spring
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 }
  });
  const introScale = interpolate(introSpring, [0, 1], [0.4, 1]);
  const introOpacity = interpolate(introSpring, [0, 1], [0, 1]);

  // Gentle continuous breathing/bobbing (sine wave)
  const floatY = Math.sin((frame / fps) * 3) * 10;

  // Eye blinking logic
  const isBlinking = frame % 90 >= 86;

  // Wave / Thruster pulse
  const waveAngle = Math.sin((frame / fps) * 8) * 20;
  const pulseOpacity = interpolate(Math.sin((frame / fps) * 4), [-1, 1], [0.4, 0.9]);

  // Determine if a custom user image was supplied
  const effectiveImage = imagePath || (type && (type.includes('.') || type.includes('/') || type.includes('\\')) ? type : undefined);
  const isCustomImage = Boolean(effectiveImage);

  // =========================================================================
  // 1. DYNAMIC USER-PROVIDED CHARACTER (IMAGE / MODEL SHEET / AVATAR)
  // =========================================================================
  if (isCustomImage && effectiveImage) {
    const isModelSheet = effectiveImage.includes('sheet') || effectiveImage.includes('developer');
    const imageSrc = effectiveImage.startsWith('http') || effectiveImage.startsWith('data:')
      ? effectiveImage
      : staticFile(effectiveImage);

    return (
      <div
        style={{
          width: size * 0.62,
          height: size * 1.15,
          opacity: introOpacity,
          transform: `translateY(${floatY}px) scale(${introScale}) scaleX(${flipHorizontal ? -1 : 1})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: 24,
            border: `2px solid ${accentColor}55`,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(16px)',
            boxShadow: `0 25px 50px rgba(0, 0, 0, 0.8), 0 0 35px ${accentColor}33`,
            filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.6))'
          }}
        >
          {/* Cybernetic Ambient Halo */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '50%',
              width: '80%',
              height: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${accentColor}44 0%, transparent 75%)`,
              filter: 'blur(20px)',
              pointerEvents: 'none'
            }}
          />

          {isModelSheet ? (
            /* Multi-pose character sheet crop */
            <Img
              src={imageSrc}
              style={{
                position: 'absolute',
                width: size * 2.8,
                height: 'auto',
                maxWidth: 'none',
                left: pose === 'side' ? -(size * 1.1) : pose === 'back' ? -(size * 1.75) : -(size * 0.4),
                top: -(size * 0.32),
                filter: 'contrast(1.08) brightness(1.04)'
              }}
            />
          ) : (
            /* Single avatar / standalone character image */
            <Img
              src={imageSrc}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'contrast(1.05) brightness(1.02)'
              }}
            />
          )}

          {/* Optional Telemetry Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '3px 10px',
              borderRadius: 10,
              backgroundColor: 'rgba(9, 13, 22, 0.85)',
              border: `1px solid ${accentColor}66`,
              color: accentColor,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap'
            }}
          >
            {label || (pose === 'back' ? 'SYSTEM DIAGNOSTIC' : pose === 'side' ? 'LIVE SESSION' : 'LEAD ARCHITECT')}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. DEFAULT FALLBACK: PROCEDURAL ANIME ROBOT MASCOT
  // (Used when user provides no character image)
  // =========================================================================
  return (
    <div
      style={{
        width: size,
        height: size,
        opacity: introOpacity,
        transform: `translateY(${floatY}px) scale(${introScale}) scaleX(${flipHorizontal ? -1 : 1})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 20px 30px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 25px ${accentColor}33)`
      }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          {/* Thruster Flame / Energy Pulse */}
          <ellipse cx="100" cy="165" rx="16" ry="12" fill={accentColor} opacity={pulseOpacity * 0.8} />
          <ellipse cx="100" cy="162" rx="9" ry="7" fill="#ffffff" opacity={pulseOpacity} />

          {/* Droid Spherical Head & Torso */}
          <circle cx="100" cy="95" r="50" fill="#1e293b" stroke="#475569" strokeWidth="3" />
          <ellipse cx="100" cy="95" rx="42" ry="24" fill="#090d16" stroke={`${accentColor}55`} strokeWidth="2" />

          {/* Eye Ring & Pupils */}
          {!isBlinking ? (
            <>
              <circle cx="82" cy="95" r="9" fill={accentColor} />
              <circle cx="84" cy="93" r="3" fill="#ffffff" />
              <circle cx="118" cy="95" r="9" fill={accentColor} />
              <circle cx="120" cy="93" r="3" fill="#ffffff" />
            </>
          ) : (
            <>
              <line x1="74" y1="95" x2="90" y2="95" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
              <line x1="110" y1="95" x2="126" y2="95" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {/* Antenna with dual nodes */}
          <line x1="88" y1="46" x2="78" y2="28" stroke="#64748b" strokeWidth="3" />
          <circle cx="78" cy="28" r="5" fill="#06b6d4" opacity={pulseOpacity} />
          <line x1="112" y1="46" x2="122" y2="28" stroke="#64748b" strokeWidth="3" />
          <circle cx="122" cy="28" r="5" fill={accentColor} opacity={pulseOpacity} />

          {/* Waving Right Hand */}
          <g transform={`rotate(${waveAngle} 150 95)`}>
            <path d="M 148 95 Q 165 85 170 70" stroke="#64748b" strokeWidth="7" strokeLinecap="round" fill="none" />
            <circle cx="170" cy="70" r="7" fill={accentColor} />
          </g>

          {/* Left Resting Arm */}
          <path d="M 52 95 Q 38 115 48 130" stroke="#64748b" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="48" cy="130" r="6" fill="#475569" />
        </g>
      </svg>
    </div>
  );
};
