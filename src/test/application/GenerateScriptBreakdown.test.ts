import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { GenerateScriptBreakdownUseCase } from '../../application/use-cases/GenerateScriptBreakdownUseCase.js';
import { InspirationProfile } from '../../application/ports/outbound/IReferenceVideoAnalyzerPort.js';

describe('GenerateScriptBreakdownUseCase', () => {
  const useCase = new GenerateScriptBreakdownUseCase();

  it('auto-detects science topic from prompt keywords and applies science palette', async () => {
    const manifest = await useCase.execute({
      prompt: 'Quantum Computing and Superposition in 20s',
      durationSeconds: 20
    });

    assert.equal(manifest.data.topic, 'science');
    assert.equal(manifest.data.theme.palette.accent, '#38bdf8'); // Stellar blue
    assert.ok(manifest.data.scenes.length >= 3);
  });

  it('auto-detects history topic and creates narrative pacing', async () => {
    const manifest = await useCase.execute({
      prompt: 'Ancient Rome and the Rise of the Republic',
      durationSeconds: 60
    });

    assert.equal(manifest.data.topic, 'history');
    assert.equal(manifest.data.totalDurationSeconds, 60);
    assert.ok(manifest.data.scenes.length >= 8); // ~6s pacing for 60s
  });

  it('incorporates inspiration profile pacing metrics when provided', async () => {
    const mockInspiration: InspirationProfile = {
      sourceFileName: 'fast-pace-reference.mp4',
      durationSeconds: 30,
      pacing: {
        sceneCutCount: 12,
        averageShotHoldSeconds: 2.5, // Rapid cuts
        cutTimestamps: [0, 2.5, 5.0, 7.5],
        intensity: 'fast-paced'
      },
      palette: {
        accent: '#ff0055',
        secondaryAccent: '#00ffff'
      },
      cadence: {
        wordsPerMinute: 175,
        totalSpokenWords: 80,
        averageWordDurationMs: 340
      },
      analyzedAt: new Date()
    };

    const manifest = await useCase.execute({
      prompt: 'Next Generation AI Agents',
      durationSeconds: 25,
      inspirationProfile: mockInspiration
    });

    // Pacing should generate ~10 scenes for 25s at 2.5s pacing
    assert.ok(manifest.data.scenes.length >= 8);
    // Custom accent from inspiration profile should be adopted without copying frames
    assert.equal(manifest.data.theme.palette.accent, '#ff0055');
  });

  it('ensures every scene has active visual blocks (no empty scenes or freezing)', async () => {
    const manifest = await useCase.execute({
      prompt: 'Autonomous Brand Launch',
      durationSeconds: 30
    });

    for (const scene of manifest.data.scenes) {
      assert.ok(scene.title.length > 0);
      assert.ok(scene.durationSeconds > 0);
      assert.ok(
        ['headline', 'stat-counter', 'split-comparison', 'rough-diagram', 'physics-drop', 'watercolor-canvas', 'outro-badge'].includes(
          scene.layoutType
        )
      );
    }
  });
});

