import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface MessyCodeStreamProps {
  accentColor?: string;
  isPortrait?: boolean;
}

export const MessyCodeStream: React.FC<MessyCodeStreamProps> = ({
  accentColor = '#ef4444',
  isPortrait = false
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rapid scrolling code stream
  const scrollY = (frame * 18) % 450;

  // Staggered pop for warning badges
  const badge1Spring = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 200 } });
  const badge2Spring = spring({ frame: frame - 25, fps, config: { damping: 10, stiffness: 200 } });

  const badge1Scale = interpolate(badge1Spring, [0, 1], [0.3, 1]);
  const badge2Scale = interpolate(badge2Spring, [0, 1], [0.3, 1]);

  const rawCodeLines = [
    '// TODO: Refactor this 1,200 line monstrosity',
    'export class LegacyEnterpriseMegaManager {',
    '  private dbConnectionPool: any;',
    '  private globalEventBus: any;',
    '  private userSessionState: any;',
    '  private paymentGatewayHandler: any;',
    '  private emailDispatcherService: any;',
    '  private cacheLayerRedisManager: any;',
    '  private notificationRouterManager: any;',
    '  constructor() { /* 850 lines of tight initialization */ }',
    '  public processEverything(data: any): any {',
    '    if (data.type === 1) { this.handleTypeOne(); }',
    '    else if (data.type === 2) { this.handleTypeTwo(); }',
    '    else if (data.type === 3) { this.handleTypeThree(); }',
    '    else if (data.type === 4) { this.handleTypeFour(); }',
    '    // 35 more else-if conditions without Strategy Pattern...',
    '    this.dbConnectionPool.rawQuery("SELECT * FROM everything");',
    '    this.emailDispatcherService.sendSyncBlockingEmail();',
    '  }',
    '  // Warning: Memory leak detected at line 940',
    '  // Warning: Violates Single Responsibility Principle',
    '  // Error: Cannot mock dependencies for unit testing'
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: isPortrait ? 780 : 960,
        height: isPortrait ? 260 : 320,
        backgroundColor: '#0a0d14',
        border: '1.5px solid #334155',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, 0.2)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: isPortrait ? 13 : 15,
        color: '#64748b',
        opacity: 0.85
      }}
    >
      {/* Editor Header Bar */}
      <div
        style={{
          height: 32,
          backgroundColor: '#111726',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: 8
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
        <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>
          LegacyEnterpriseMegaManager.ts — 1,240 Lines (God Class)
        </span>
      </div>

      {/* Scrolling Code Content */}
      <div
        style={{
          padding: 16,
          transform: `translateY(-${scrollY}px)`,
          lineHeight: 1.6
        }}
      >
        {rawCodeLines.concat(rawCodeLines).map((line, idx) => {
          const isError = line.includes('TODO') || line.includes('Warning') || line.includes('Error') || line.includes('35 more');
          return (
            <div
              key={idx}
              style={{
                color: isError ? accentColor : '#64748b',
                fontWeight: isError ? 700 : 400,
                backgroundColor: isError ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                borderRadius: 4,
                padding: '1px 6px'
              }}
            >
              <span style={{ color: '#334155', marginRight: 16, userSelect: 'none' }}>
                {String(idx + 1).padStart(3, ' ')}
              </span>
              {line}
            </div>
          );
        })}
      </div>

      {/* Floating Warning Popups */}
      {frame >= 10 && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            backgroundColor: '#1f1315',
            border: '1.5px solid #ef4444',
            borderRadius: 10,
            padding: '8px 16px',
            color: '#fca5a5',
            fontSize: 13,
            fontWeight: 800,
            transform: `scale(${badge1Scale})`,
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span>⚠️</span> GOD CLASS DETECTED (1,240 L)
        </div>
      )}

      {frame >= 25 && (
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            backgroundColor: '#1a101f',
            border: '1.5px solid #a855f7',
            borderRadius: 10,
            padding: '8px 16px',
            color: '#e9d5ff',
            fontSize: 13,
            fontWeight: 800,
            transform: `scale(${badge2Scale})`,
            boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span>🔥</span> CYCLOMATIC COMPLEXITY &gt; 45
        </div>
      )}
    </div>
  );
};
