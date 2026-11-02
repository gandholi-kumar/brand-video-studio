import React, { useRef, useEffect } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import rough from 'roughjs';
import { springs } from '../../const/motion.const';

export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type?: string;
}

export interface DiagramLink {
  from: string;
  to: string;
  label?: string;
}

export interface RoughDiagramBlockProps {
  title: string;
  nodes?: DiagramNode[];
  links?: DiagramLink[];
  accentColor: string;
  secondaryAccent: string;
  isPortrait: boolean;
  sceneDurationInFrames: number;
}

export const RoughDiagramBlock: React.FC<RoughDiagramBlockProps> = ({
  title,
  nodes = [
    { id: 'client', label: 'Client / CLI', x: 80, y: 150 },
    { id: 'core', label: 'Hexagonal Core', x: 300, y: 150 },
    { id: 'adapters', label: 'Driven Adapters', x: 520, y: 80 },
    { id: 'canvas', label: 'Dumb Canvas', x: 520, y: 220 }
  ],
  links = [
    { from: 'client', to: 'core' },
    { from: 'core', to: 'adapters' },
    { from: 'core', to: 'canvas' }
  ],
  accentColor,
  secondaryAccent,
  isPortrait,
  sceneDurationInFrames
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const svgRef = useRef<SVGSVGElement>(null);

  const titleSpring = spring({ frame, fps, config: springs.snappy });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const sceneFade = interpolate(
    frame,
    [sceneDurationInFrames - 15, sceneDurationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const rc = rough.svg(svg);

    // Draw links
    links.forEach((link) => {
      const fromNode = nodes.find((n) => n.id === link.from);
      const toNode = nodes.find((n) => n.id === link.to);
      if (fromNode && toNode) {
        const line = rc.line(fromNode.x + 80, fromNode.y + 35, toNode.x + 80, toNode.y + 35, {
          roughness: 1.8,
          stroke: '#64748b',
          strokeWidth: 2.5
        });
        svg.appendChild(line);
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const isCore = node.id === 'core';
      const nodeColor = isCore ? accentColor : secondaryAccent;

      const rect = rc.rectangle(node.x, node.y, 160, 70, {
        roughness: 1.6,
        stroke: nodeColor,
        strokeWidth: 2,
        fill: `${nodeColor}22`,
        fillStyle: 'hachure',
        hachureAngle: -45,
        hachureGap: 6
      });
      svg.appendChild(rect);

      // Add text label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(node.x + 80));
      text.setAttribute('y', String(node.y + 42));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#ffffff');
      text.setAttribute('font-family', 'Inter, system-ui, sans-serif');
      text.setAttribute('font-weight', '800');
      text.setAttribute('font-size', '13');
      text.textContent = node.label;
      svg.appendChild(text);
    });
  }, [nodes, links, accentColor, secondaryAccent]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: isPortrait ? '0 20px' : '0 60px',
        opacity: sceneFade
      }}
    >
      <h2
        style={{
          opacity: titleOpacity,
          fontSize: isPortrait ? 42 : 52,
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: 24,
          textAlign: 'center'
        }}
      >
        {title}
      </h2>

      <div
        style={{
          width: isPortrait ? 880 : 1000,
          height: isPortrait ? 380 : 360,
          backgroundColor: '#0a0d14',
          border: '1.5px solid #334155',
          borderRadius: 24,
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 760 360"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};
