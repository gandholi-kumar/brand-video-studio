import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface LiveCodeTypingProps {
  accentColor?: string;
  isPortrait?: boolean;
}

export const LiveCodeTyping: React.FC<LiveCodeTypingProps> = ({
  accentColor = '#f59e0b',
  isPortrait = false
}) => {
  const frame = useCurrentFrame();

  // Full snippet to type
  const targetCode = `// Gang of Four: Observer Pattern Implementation
interface Observer { update(state: State): void; }

class EventDispatcher implements Subject {
  private listeners: Observer[] = [];

  public subscribe(listener: Observer): void {
    this.listeners.push(listener);
  }

  public dispatch(event: DomainEvent): void {
    this.listeners.forEach(l => l.update(event));
  }
}`;

  // Typing speed: reveal ~3.5 characters per frame
  const charactersTyped = Math.min(targetCode.length, Math.floor(frame * 3.5));
  const currentSnippet = targetCode.slice(0, charactersTyped);

  // Blinking caret (toggles every 15 frames)
  const isCaretVisible = Math.floor(frame / 12) % 2 === 0;

  // Virtual cursor click simulation (occurs around frame 80)
  const isExecuting = frame >= 75;
  const consoleVisible = frame >= 85;

  return (
    <div
      style={{
        width: isPortrait ? 920 : 1100,
        backgroundColor: '#0a0d14',
        border: '1.5px solid #30363d',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(6, 182, 212, 0.15)',
        fontFamily: 'JetBrains Mono, monospace'
      }}
    >
      {/* Editor Tab Bar */}
      <div
        style={{
          backgroundColor: '#161b22',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #21262d'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#27c93f' }} />
          <div
            style={{
              marginLeft: 16,
              backgroundColor: '#0a0d14',
              padding: '4px 14px',
              borderRadius: '6px 6px 0 0',
              borderTop: `2px solid ${accentColor}`,
              color: '#e6edf3',
              fontSize: isPortrait ? 12 : 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>TS</span> observer-pattern.ts
          </div>
        </div>

        {/* Live Run Button */}
        <div
          style={{
            backgroundColor: isExecuting ? '#10b981' : '#238636',
            color: '#ffffff',
            padding: '5px 14px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transform: isExecuting ? 'scale(0.96)' : 'scale(1)',
            transition: 'transform 0.1s ease',
            boxShadow: isExecuting ? '0 0 15px #10b981' : 'none'
          }}
        >
          <span>▶</span> {isExecuting ? 'EXECUTING...' : 'RUN'}
        </div>
      </div>

      {/* Code Editor Typing Area */}
      <div
        style={{
          padding: isPortrait ? '18px 22px' : '28px 36px',
          fontSize: isPortrait ? 16 : 20,
          lineHeight: 1.6,
          color: '#e6edf3',
          minHeight: isPortrait ? 180 : 230,
          whiteSpace: 'pre-wrap'
        }}
      >
        {currentSnippet}
        {isCaretVisible && (
          <span
            style={{
              display: 'inline-block',
              width: 9,
              height: 22,
              backgroundColor: accentColor,
              marginLeft: 3,
              verticalAlign: 'middle'
            }}
          />
        )}
      </div>

      {/* Real-time Streaming Telemetry Console */}
      {consoleVisible && (
        <div
          style={{
            backgroundColor: '#05070a',
            borderTop: '1px solid #21262d',
            padding: '14px 24px',
            fontSize: isPortrait ? 12 : 14,
            lineHeight: 1.5,
            color: '#7ee787'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span>⚡ [Telemetry Engine]</span>
            <span style={{ color: '#8b949e' }}>Compiled in 18ms</span>
            <span style={{ color: '#38bdf8' }}>Memory: 1.1 MB</span>
          </div>
          <div style={{ color: '#f8fafc' }}>
            ✔ 3 Observers notified · <span style={{ color: accentColor }}>Real-time EventBus Dispatched</span>
          </div>
        </div>
      )}
    </div>
  );
};
