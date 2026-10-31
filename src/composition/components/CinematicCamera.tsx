import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export interface CinematicCameraProps {
  children: React.ReactNode;
  durationInFrames: number;
  startScale?: number;
  endScale?: number;
  driftX?: number;
  driftY?: number;
  style?: React.CSSProperties;
}

export const CinematicCamera: React.FC<CinematicCameraProps> = ({
  children,
  durationInFrames,
  startScale = 1.0,
  endScale = 1.07,
  driftX = 0,
  driftY = -15,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous Ken Burns push-in over scene lifetime (eliminates static freeze)
  const scale = interpolate(frame, [0, durationInFrames], [startScale, endScale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  // Subtle continuous drift
  const currentDriftX = interpolate(frame, [0, durationInFrames], [0, driftX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  const currentDriftY = interpolate(frame, [0, durationInFrames], [0, driftY], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  // Very subtle breathing oscillation (sine wave)
  const subtleBreath = Math.sin((frame / fps) * 2) * 2;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${scale}) translate(${currentDriftX}px, ${currentDriftY + subtleBreath}px)`,
        transformOrigin: 'center center',
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </div>
  );
};

