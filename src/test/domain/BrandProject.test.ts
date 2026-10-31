import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BrandProject } from '../../domain/entities/BrandProject.js';

describe('BrandProject Entity', () => {
  const dummyColors = {
    background: '#090d16',
    foreground: '#f8fafc',
    accent: '#f59e0b',
    secondaryAccent: '#06b6d4',
    border: '#1e293b'
  };

  const dummyTypography = {
    display: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace'
  };

  it('creates an entity with slug generated from name', () => {
    const project = BrandProject.create({
      name: 'GoF Design Patterns Masterclass',
      url: 'https://design-patterns-cyan.vercel.app/',
      tagline: 'Master all 23 patterns with interactive playgrounds',
      colors: dummyColors,
      typography: dummyTypography,
      tone: 'cinematic'
    });

    assert.equal(project.name, 'GoF Design Patterns Masterclass');
    assert.equal(project.slug, 'gof-design-patterns-masterclass');
    assert.equal(project.url, 'https://design-patterns-cyan.vercel.app/');
    assert.equal(project.tone, 'cinematic');
    assert.deepEqual(project.colors, dummyColors);
  });

  it('handles special characters and whitespace when generating slug', () => {
    const project = BrandProject.create({
      name: '   My Awesome App! (v2.0) -- Launching Soon   ',
      url: 'https://example.com',
      tagline: 'Next-gen tool',
      colors: dummyColors,
      typography: dummyTypography
    });

    assert.equal(project.slug, 'my-awesome-app-v2-0-launching-soon');
  });

  it('defaults tone to cinematic if omitted', () => {
    const project = BrandProject.create({
      name: 'Simple App',
      url: 'https://simple.app',
      tagline: 'Just works',
      colors: dummyColors,
      typography: dummyTypography
    });

    assert.equal(project.tone, 'cinematic');
    assert.deepEqual(project.visuals, []);
  });
});
