import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VideoDeliverable } from '../../domain/entities/VideoDeliverable.js';

describe('VideoDeliverable Entity', () => {
  it('reports complete when all paths and poster flags are satisfied', () => {
    const deliverable = new VideoDeliverable(
      'my-project',
      '/output/my-project/brag.mp4',
      '/output/my-project/brag.jpg',
      '/output/my-project/share-copy.txt',
      'Launch post text',
      {
        durationSeconds: 20,
        width: 1920,
        height: 1080,
        fps: 30,
        hasPosterFrame0: true,
        generatedAt: new Date()
      }
    );

    assert.equal(deliverable.isComplete(), true);
  });

  it('reports incomplete if any artifact path is missing or hasPosterFrame0 is false', () => {
    const deliverable = new VideoDeliverable(
      'my-project',
      '',
      '/output/my-project/brag.jpg',
      '/output/my-project/share-copy.txt',
      'Launch post text',
      {
        durationSeconds: 20,
        width: 1920,
        height: 1080,
        fps: 30,
        hasPosterFrame0: true,
        generatedAt: new Date()
      }
    );

    assert.equal(deliverable.isComplete(), false);
  });
});
