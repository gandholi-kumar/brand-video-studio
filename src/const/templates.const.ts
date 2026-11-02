import { VideoTopic } from './theme.const.js';

export type VisualStyle =
  | 'amalgam'
  | 'physics-3d'
  | 'rough-whiteboard'
  | 'organic-watercolor'
  | 'kinetic-vector';

export interface StyleDefinition {
  id: VisualStyle;
  name: string;
  description: string;
  primaryLibraries: string[];
  recommendedTopics: VideoTopic[];
  defaultCameraMotion: 'push-in' | 'pan-left' | 'breathing' | 'static-clamped';
}

export const VISUAL_STYLES: Record<VisualStyle, StyleDefinition> = {
  amalgam: {
    id: 'amalgam',
    name: 'Unified Amalgam (Brag + All Plugins)',
    description: 'Harmonious blend of Brag hooks, Rough.js wireframes, Matter.js physics drops, and Anime.js data flows.',
    primaryLibraries: ['brag', 'matter.js', 'rough.js', 'animejs', 'whisper.cpp'],
    recommendedTopics: ['tech', 'saas', 'news', 'sports', 'entertainment'],
    defaultCameraMotion: 'push-in'
  },
  'physics-3d': {
    id: 'physics-3d',
    name: 'Dynamic 3D & Rigid Physics',
    description: 'Sleek, modern perspective cards with Newtonian falling badges and bouncy settle collisions.',
    primaryLibraries: ['matter.js', 'remotion-springs', 'brag'],
    recommendedTopics: ['saas', 'tech', 'sports'],
    defaultCameraMotion: 'push-in'
  },
  'rough-whiteboard': {
    id: 'rough-whiteboard',
    name: 'Hand-Drawn Whiteboard Explainer',
    description: 'Paper-and-pencil aesthetic with sketchy architectural diagrams, hachure shading, and hand-drawn underlines.',
    primaryLibraries: ['rough.js', 'whisper.cpp'],
    recommendedTopics: ['tech', 'history', 'news'],
    defaultCameraMotion: 'breathing'
  },
  'organic-watercolor': {
    id: 'organic-watercolor',
    name: 'Organic Watercolor & Canvas',
    description: 'Natural pigment bleeds, graphite sketches, parchment grain, and vector Perlin noise fields.',
    primaryLibraries: ['p5.brush', 'whisper.cpp'],
    recommendedTopics: ['history', 'science'],
    defaultCameraMotion: 'breathing'
  },
  'kinetic-vector': {
    id: 'kinetic-vector',
    name: 'Kinetic Vector Flow',
    description: 'High-speed kinetic vector morphing, electrical circuit traces, and dynamic data pulse pipelines.',
    primaryLibraries: ['animejs', 'brag'],
    recommendedTopics: ['tech', 'news', 'entertainment'],
    defaultCameraMotion: 'push-in'
  }
};

