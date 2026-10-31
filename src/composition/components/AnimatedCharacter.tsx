import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export type CharacterType = 'coder' | 'mascot';

export interface AnimatedCharacterProps {
  type?: CharacterType;
  accentColor?: string;
  size?: number;
  flipHorizontal?: boolean;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  type = 'coder',
  accentColor = '#f59e0b',
  size = 320,
  flipHorizontal = false
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

  // Eye blinking logic: close for 4 frames every 90 frames (~3s)
  const isBlinking = frame % 90 >= 86;

  // Arm/Hands animation
  const typingOscillation = Math.sin((frame / fps) * 16) * 12;
  const waveAngle = Math.sin((frame / fps) * 8) * 20;

  // Antenna / Screen glow pulse
  const pulseOpacity = interpolate(Math.sin((frame / fps) * 4), [-1, 1], [0.4, 0.9]);

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
        {type === 'coder' ? (
          /* ================= CODER BOT MASCOT ================= */
          <g>
            {/* Ambient Body Shadow */}
            <ellipse cx="100" cy="180" rx="45" ry="8" fill="rgba(0,0,0,0.3)" />

            {/* Droid Body */}
            <rect x="65" y="90" width="70" height="65" rx="18" fill="#1e293b" stroke="#334155" strokeWidth="3" />
            <rect x="75" y="102" width="50" height="35" rx="10" fill="#0f172a" stroke={`${accentColor}55`} strokeWidth="1.5" />
            {/* Chest telemetry lines */}
            <line x1="82" y1="114" x2="118" y2="114" stroke={accentColor} strokeWidth="2" strokeLinecap="round" opacity={pulseOpacity} />
            <line x1="82" y1="122" x2="105" y2="122" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />

            {/* Droid Head */}
            <rect x="55" y="35" width="90" height="60" rx="20" fill="#1e293b" stroke="#475569" strokeWidth="3" />
            
            {/* Screen Visor */}
            <rect x="65" y="45" width="70" height="38" rx="12" fill="#090d16" stroke={`${accentColor}66`} strokeWidth="2" />

            {/* Eyes */}
            {!isBlinking ? (
              <>
                <circle cx="85" cy="64" r="7" fill={accentColor} />
                <circle cx="87" cy="62" r="2.5" fill="#ffffff" />
                <circle cx="115" cy="64" r="7" fill={accentColor} />
                <circle cx="117" cy="62" r="2.5" fill="#ffffff" />
              </>
            ) : (
              <>
                <line x1="77" y1="64" x2="93" y2="64" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
                <line x1="107" y1="64" x2="123" y2="64" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
              </>
            )}

            {/* Antenna */}
            <line x1="100" y1="35" x2="100" y2="18" stroke="#64748b" strokeWidth="3" />
            <circle cx="100" cy="15" r="6" fill={accentColor} opacity={pulseOpacity} />

            {/* Animated Typing Arms & Laptop */}
            <g transform={`translate(0, ${typingOscillation * 0.2})`}>
              {/* Laptop Screen & Base */}
              <rect x="68" y="130" width="64" height="38" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="2" />
              <rect x="74" y="134" width="52" height="26" rx="2" fill="#090d16" />
              {/* Code lines on screen */}
              <line x1="78" y1="140" x2="100" y2="140" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              <line x1="78" y1="146" x2="114" y2="146" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="78" y1="152" x2="94" y2="152" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
              {/* Laptop Keyboard Lip */}
              <polygon points="62,168 138,168 130,174 70,174" fill="#334155" />

              {/* Left Arm / Hand typing */}
              <path
                d={`M 55 110 Q 50 145 74 ${160 + typingOscillation * 0.5}`}
                stroke="#64748b"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Arm / Hand typing */}
              <path
                d={`M 145 110 Q 150 145 126 ${160 - typingOscillation * 0.5}`}
                stroke="#64748b"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>
        ) : (
          /* ================= FLOATING FRIENDLY DROID MASCOT ================= */
          <g>
            {/* Thruster Flame/Energy Pulse */}
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
        )}
      </svg>
    </div>
  );
};
