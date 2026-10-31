import React from 'react';
import { Composition } from 'remotion';
import { BrandVideoComposition } from './BrandVideoComposition';

const defaultProps = {
  projectName: 'GoF Design Patterns Masterclass',
  tagline: 'Master all 23 Gang of Four design patterns with interactive playgrounds',
  projectUrl: 'https://design-patterns-cyan.vercel.app/',
  colors: {
    background: '#090d16',
    foreground: '#f8fafc',
    accent: '#f59e0b',
    secondaryAccent: '#06b6d4'
  },
  captions: [],
  character: {
    enabled: true,
    type: 'coder' as const
  }
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Default Composition (16:9 Landscape) */}
      <Composition
        id="BrandVideo"
        component={BrandVideoComposition}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />

      {/* 16:9 Landscape for Web & Desktop Feeds */}
      <Composition
        id="BrandVideo-Landscape"
        component={BrandVideoComposition}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
      />

      {/* 9:16 Portrait for YouTube Shorts, Instagram Reels & TikTok */}
      <Composition
        id="BrandVideo-Portrait"
        component={BrandVideoComposition}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultProps,
          character: {
            enabled: true,
            type: 'coder' as const
          }
        }}
      />
    </>
  );
};
