import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WordToken {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface KineticCaptionsProps {
  words: WordToken[];
  accentColor?: string;
  textColor?: string;
}

export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
  words,
  accentColor = '#f59e0b',
  textColor = '#ffffff'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  if (!words || words.length === 0) {
    return null;
  }

  // Find active word
  const activeIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  if (activeIndex === -1) {
    return null;
  }

  const activeWord = words[activeIndex];

  // Animate the active word pop with spring
  const wordStartFrame = activeWord.start * fps;
  const wordScale = spring({
    frame: frame - wordStartFrame,
    fps,
    config: { damping: 12, stiffness: 200 }
  });

  const scale = interpolate(wordScale, [0, 1], [0.85, 1.15]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 120,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(9, 13, 22, 0.85)',
          border: `2px solid ${accentColor}`,
          borderRadius: 16,
          padding: '16px 36px',
          boxShadow: `0 0 40px ${accentColor}44`,
          transform: `scale(${scale})`,
          transition: 'transform 0.05s ease-out'
        }}
      >
        <span
          style={{
            color: textColor,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase'
          }}
        >
          {activeWord.word}
        </span>
      </div>
    </div>
  );
};

