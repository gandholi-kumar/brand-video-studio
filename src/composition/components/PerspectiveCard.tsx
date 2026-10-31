import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface PerspectiveCardProps {
  children: React.ReactNode;
  width?: number | string;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  accentColor?: string;
  enableShimmer?: boolean;
  style?: React.CSSProperties;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({
  children,
  width = '100%',
  rotateX = 8,
  rotateY = -6,
  rotateZ = 1,
  accentColor = '#f59e0b',
  enableShimmer = true,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle continuous 3D tilt breathing
  const dynamicTiltX = rotateX + Math.sin((frame / fps) * 2) * 1.5;
  const dynamicTiltY = rotateY + Math.cos((frame / fps) * 2) * 1.5;

  // Shimmer position cycling every 90 frames (~3s)
  const shimmerCycle = frame % 90;
  const shimmerProgress = interpolate(shimmerCycle, [10, 50], [-150, 250], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const shimmerOpacity = interpolate(shimmerCycle, [10, 20, 40, 50], [0, 0.6, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        perspective: 1200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: typeof width === 'number' ? `${width}px` : width
      }}
    >
      <div
        style={{
          width: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${dynamicTiltX}deg) rotateY(${dynamicTiltY}deg) rotateZ(${rotateZ}deg)`,
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: '#0d1117',
          border: `1.5px solid ${accentColor}55`,
          boxShadow: `0 30px 80px rgba(0, 0, 0, 0.7), 0 0 50px ${accentColor}25`,
          willChange: 'transform',
          ...style
        }}
      >
        {children}

        {/* Diagonal Light Sweep Shimmer */}
        {enableShimmer && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `linear-gradient(115deg, transparent 0%, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%, transparent 100%)`,
              transform: `translateX(${shimmerProgress}%)`,
              opacity: shimmerOpacity,
              mixBlendMode: 'overlay'
            }}
          />
        )}
      </div>
    </div>
  );
};

