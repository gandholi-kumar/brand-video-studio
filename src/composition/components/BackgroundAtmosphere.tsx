import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface BackgroundAtmosphereProps {
  primaryAccent?: string;
  secondaryAccent?: string;
  backgroundColor?: string;
}

export const BackgroundAtmosphere: React.FC<BackgroundAtmosphereProps> = ({
  primaryAccent = '#f59e0b',
  secondaryAccent = '#06b6d4',
  backgroundColor = '#090d16'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow continuous grid drift
  const gridOffsetY = (frame * 0.8) % 60;

  // Pulse intensity for radial glows (sine wave)
  const primaryPulse = interpolate(Math.sin((frame / fps) * 3), [-1, 1], [0.12, 0.22]);
  const secondaryPulse = interpolate(Math.cos((frame / fps) * 2.5), [-1, 1], [0.08, 0.18]);

  // Floating particles
  const particles = [
    { x: 15, speed: 1.2, size: 3, delay: 0 },
    { x: 30, speed: 0.9, size: 2, delay: 20 },
    { x: 45, speed: 1.5, size: 4, delay: 40 },
    { x: 65, speed: 1.1, size: 2.5, delay: 10 },
    { x: 80, speed: 0.8, size: 3, delay: 35 },
    { x: 92, speed: 1.3, size: 2, delay: 55 }
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {/* Drifting Cybernetic Grid */}
      <div
        style={{
          position: 'absolute',
          inset: -100,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `translateY(${gridOffsetY}px)`,
          opacity: 0.7
        }}
      />

      {/* Breathing Primary Light Glow (Top-Right) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '70vw',
          height: '70vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryAccent} 0%, transparent 65%)`,
          opacity: primaryPulse,
          filter: 'blur(80px)'
        }}
      />

      {/* Breathing Secondary Light Glow (Bottom-Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-15%',
          width: '75vw',
          height: '75vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${secondaryAccent} 0%, transparent 65%)`,
          opacity: secondaryPulse,
          filter: 'blur(90px)'
        }}
      />

      {/* Floating Luminous Particles */}
      {particles.map((p, i) => {
        const particleY = 110 - (((frame * p.speed + p.delay * 10) % 130));
        const particleOpacity = interpolate(particleY, [0, 20, 80, 110], [0, 0.7, 0.7, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${particleY}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: i % 2 === 0 ? primaryAccent : secondaryAccent,
              boxShadow: `0 0 10px ${i % 2 === 0 ? primaryAccent : secondaryAccent}`,
              opacity: particleOpacity
            }}
          />
        );
      })}

      {/* Vignette border fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(9, 13, 22, 0.85) 100%)'
        }}
      />
    </div>
  );
};

