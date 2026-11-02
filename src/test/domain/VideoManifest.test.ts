import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { VideoManifest, VideoManifestData } from '../../domain/entities/VideoManifest.js';
import { TOPIC_PALETTES, TYPOGRAPHY_TOKENS } from '../../const/theme.const.js';

describe('VideoManifest Domain Entity', () => {
  const createSampleData = (overrides?: Partial<VideoManifestData>): VideoManifestData => ({
    version: '2.0',
    id: 'test-manifest-1',
    title: 'Quantum Advantage Explainer',
    topic: 'science',
    aspectRatio: '16:9',
    style: 'amalgam',
    totalDurationSeconds: 60,
    fps: 30,
    theme: {
      palette: TOPIC_PALETTES.science,
      typography: TYPOGRAPHY_TOKENS
    },
    audio: {
      duckingDb: -14
    },
    scenes: [
      {
        id: 's1',
        layoutType: 'headline',
        title: 'Superposition Unlocked',
        durationSeconds: 15
      },
      {
        id: 's2',
        layoutType: 'stat-counter',
        title: 'Qubit Coherence Milestones',
        durationSeconds: 25
      },
      {
        id: 's3',
        layoutType: 'outro-badge',
        title: 'Next-Gen Quantum Systems',
        durationSeconds: 20
      }
    ],
    ...overrides
  });

  it('calculates total frames and resolution accurately for 16:9 Landscape', () => {
    const manifest = new VideoManifest(createSampleData({ aspectRatio: '16:9', totalDurationSeconds: 60 }));
    assert.equal(manifest.getWidth(), 1920);
    assert.equal(manifest.getHeight(), 1080);
    assert.equal(manifest.getTotalFrames(), 1800); // 60s * 30fps
  });

  it('calculates resolution accurately for 9:16 Portrait (Shorts/Reels)', () => {
    const manifest = new VideoManifest(
      createSampleData({
        aspectRatio: '9:16',
        totalDurationSeconds: 20,
        scenes: [
          { id: '1', layoutType: 'headline', title: 'Part 1', durationSeconds: 5 },
          { id: '2', layoutType: 'stat-counter', title: 'Part 2', durationSeconds: 10 },
          { id: '3', layoutType: 'outro-badge', title: 'Part 3', durationSeconds: 5 }
        ]
      })
    );
    assert.equal(manifest.getWidth(), 1080);
    assert.equal(manifest.getHeight(), 1920);
    assert.equal(manifest.getTotalFrames(), 600); // 20s * 30fps
  });

  it('throws an error if title is empty', () => {
    assert.throws(() => {
      new VideoManifest(createSampleData({ title: '   ' }));
    }, /non-empty title/i);
  });

  it('throws an error if scenes array is empty', () => {
    assert.throws(() => {
      new VideoManifest(createSampleData({ scenes: [] }));
    }, /at least one scene/i);
  });

  it('automatically reconciles slight duration discrepancies', () => {
    const manifest = new VideoManifest(
      createSampleData({
        totalDurationSeconds: 58,
        scenes: [
          { id: '1', layoutType: 'headline', title: 'Part 1', durationSeconds: 30 },
          { id: '2', layoutType: 'outro-badge', title: 'Part 2', durationSeconds: 30 }
        ]
      })
    );
    assert.equal(manifest.data.totalDurationSeconds, 60);
  });
});
