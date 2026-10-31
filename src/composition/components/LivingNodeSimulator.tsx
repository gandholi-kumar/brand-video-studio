import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface LivingNodeSimulatorProps {
  primaryAccent?: string;
  secondaryAccent?: string;
  isPortrait?: boolean;
}

export const LivingNodeSimulator: React.FC<LivingNodeSimulatorProps> = ({
  primaryAccent = '#f59e0b',
  secondaryAccent = '#06b6d4',
  isPortrait = false
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Radar polygon expansion spring
  const radarSpring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 120 } });
  const radarScale = interpolate(radarSpring, [0, 1], [0.1, 1]);

  // Signal pulse traveling between nodes (cycles every 45 frames ~ 1.5s)
  const pulsePhase = (frame % 45) / 45;

  // Active pulse positions
  const pulse1 = {
    x: interpolate(pulsePhase, [0, 1], [150, 70]),
    y: interpolate(pulsePhase, [0, 1], [110, 50])
  };
  const pulse2 = {
    x: interpolate(pulsePhase, [0, 1], [150, 230]),
    y: interpolate(pulsePhase, [0, 1], [110, 50])
  };
  const pulse3 = {
    x: interpolate(pulsePhase, [0, 1], [150, 150]),
    y: interpolate(pulsePhase, [0, 1], [110, 180])
  };

  const targetNodeFlash = interpolate(pulsePhase, [0.85, 1], [0.4, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isPortrait ? 'column' : 'row',
        gap: isPortrait ? 20 : 36,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: isPortrait ? '12px' : '24px'
      }}
    >
      {/* Node Graph Circuit Simulator */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#0a0e18',
          border: `1.5px solid ${secondaryAccent}44`,
          borderRadius: 18,
          padding: 20,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 15px 40px rgba(0,0,0,0.6), 0 0 30px ${secondaryAccent}22`,
          minWidth: isPortrait ? 320 : 420
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: secondaryAccent, letterSpacing: '0.05em' }}>
            ⚡ LIVING EVENT BUS SIMULATOR
          </span>
          <span style={{ fontSize: 11, backgroundColor: '#1e293b', padding: '3px 8px', borderRadius: 6, color: '#10b981', fontWeight: 700 }}>
            ● DISPATCHING LIVE
          </span>
        </div>

        <svg width="100%" height={isPortrait ? 180 : 220} viewBox="0 0 300 220" fill="none">
          {/* Connection Traces */}
          <line x1="150" y1="110" x2="70" y2="50" stroke="#334155" strokeWidth="2.5" strokeDasharray="4 4" />
          <line x1="150" y1="110" x2="230" y2="50" stroke="#334155" strokeWidth="2.5" strokeDasharray="4 4" />
          <line x1="150" y1="110" x2="150" y2="180" stroke="#334155" strokeWidth="2.5" strokeDasharray="4 4" />

          {/* Traveling Energy Signals */}
          <circle cx={pulse1.x} cy={pulse1.y} r="5" fill={primaryAccent} filter="drop-shadow(0 0 6px #f59e0b)" />
          <circle cx={pulse2.x} cy={pulse2.y} r="5" fill={secondaryAccent} filter="drop-shadow(0 0 6px #06b6d4)" />
          <circle cx={pulse3.x} cy={pulse3.y} r="5" fill="#10b981" filter="drop-shadow(0 0 6px #10b981)" />

          {/* Central Subject Node */}
          <circle cx="150" cy="110" r="28" fill="#1e293b" stroke={primaryAccent} strokeWidth="3" />
          <text x="150" y="114" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="Inter, sans-serif">
            SUBJECT
          </text>

          {/* Observer Node 1 */}
          <circle cx="70" cy="50" r="22" fill="#0f172a" stroke={secondaryAccent} strokeWidth="2.5" opacity={targetNodeFlash} />
          <text x="70" y="54" fill="#a5f3fc" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">
            OBSERVER A
          </text>

          {/* Observer Node 2 */}
          <circle cx="230" cy="50" r="22" fill="#0f172a" stroke={primaryAccent} strokeWidth="2.5" opacity={targetNodeFlash} />
          <text x="230" y="54" fill="#fde68a" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">
            OBSERVER B
          </text>

          {/* Observer Node 3 */}
          <circle cx="150" cy="180" r="22" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" opacity={targetNodeFlash} />
          <text x="150" y="184" fill="#a7f3d0" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="Inter, sans-serif">
            ROUTER
          </text>
        </svg>

        <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
          Real-time Event Broadcast · Zero Coupling · Decoupled Listeners
        </div>
      </div>

      {/* Dynamic Trade-off Radar Chart */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#0a0e18',
          border: '1.5px solid #334155',
          borderRadius: 18,
          padding: 20,
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
          minWidth: isPortrait ? 320 : 380,
          transform: `scale(${radarScale})`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.05em' }}>
            TRADE-OFF IMPACT RADAR
          </span>
          <span style={{ fontSize: 11, backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '3px 8px', borderRadius: 6, color: '#10b981', fontWeight: 800 }}>
            +100% MODULAR
          </span>
        </div>

        {/* Trade-off Metrics Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#94a3b8' }}>Extensibility (Open/Closed)</span>
              <span style={{ color: '#10b981', fontWeight: 800 }}>100%</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, frame * 3)}%`, height: '100%', backgroundColor: '#10b981', borderRadius: 3 }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#94a3b8' }}>Testability (Mock Isolation)</span>
              <span style={{ color: secondaryAccent, fontWeight: 800 }}>98%</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(98, frame * 2.8)}%`, height: '100%', backgroundColor: secondaryAccent, borderRadius: 3 }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#94a3b8' }}>Spaghetti Tight Coupling</span>
              <span style={{ color: '#ef4444', fontWeight: 800 }}>ELIMINATED</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(5, 100 - frame * 3)}%`, height: '100%', backgroundColor: '#ef4444', borderRadius: 3 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
