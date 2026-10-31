import React from 'react';
import { Composition } from 'remotion';
import { BrandVideoComposition } from './BrandVideoComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BrandVideo"
        component={BrandVideoComposition}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          projectName: 'GoF Design Patterns Masterclass',
          tagline: 'Master all 23 Gang of Four design patterns with interactive playgrounds',
          colors: {
            background: '#090d16',
            foreground: '#f8fafc',
            accent: '#f59e0b',
            secondaryAccent: '#06b6d4'
          },
          captions: []
        }}
      />
    </>
  );
};
