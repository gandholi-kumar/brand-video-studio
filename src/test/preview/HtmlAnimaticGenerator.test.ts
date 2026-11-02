import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { HtmlAnimaticGeneratorAdapter } from '../../adapters/driven/preview/HtmlAnimaticGeneratorAdapter.js';
import { GenerateScriptBreakdownUseCase } from '../../application/use-cases/GenerateScriptBreakdownUseCase.js';

describe('HtmlAnimaticGeneratorAdapter (Instant Storyboard)', () => {
  const generator = new HtmlAnimaticGeneratorAdapter();
  const scriptUseCase = new GenerateScriptBreakdownUseCase();
  const testOutputDir = path.resolve('output/test-preview');

  it('generates an interactive HTML animatic file with scenes and timeline', async () => {
    const manifest = await scriptUseCase.execute({
      prompt: 'Next-Gen Cloud Architecture in 30s',
      durationSeconds: 30,
      aspectRatio: '16:9'
    });

    const htmlPath = await generator.generateAnimaticHtml(manifest.data, testOutputDir);
    assert.ok(htmlPath.endsWith('storyboard.html'));

    const content = await fs.readFile(htmlPath, 'utf-8');
    assert.ok(content.includes('Pre-Visualization Animatic'));
    assert.ok(content.includes('Pacing & Scene Cut Timeline'));
    assert.ok(content.includes('Next-Gen Cloud Architecture'));
    assert.ok(content.includes('Confirm & Render Video'));
  });

  it('adjusts wireframe aspect ratio classes for 9:16 Portrait format', async () => {
    const manifest = await scriptUseCase.execute({
      prompt: 'Viral Sports Highlights',
      durationSeconds: 20,
      aspectRatio: '9:16'
    });

    const htmlPath = await generator.generateAnimaticHtml(manifest.data, testOutputDir);
    const content = await fs.readFile(htmlPath, 'utf-8');

    assert.ok(content.includes('9:16 Portrait (Shorts/Reels/TikTok)'));
    assert.ok(content.includes('portrait-box'));
  });
});

