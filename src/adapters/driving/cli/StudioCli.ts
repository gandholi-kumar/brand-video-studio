import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { createStudioContainer } from '../../../container.js';
import { StudioDoctor } from './StudioDoctor.js';
import { VideoTopic } from '../../../const/theme.const.js';
import { VisualStyle } from '../../../const/templates.const.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // 1. Doctor command
  if (args.includes('doctor') || args.includes('--doctor')) {
    console.log('\n🔍 Running Brand Video Studio System Doctor...\n');
    const diagnostics = await StudioDoctor.runDiagnostics();

    let hasError = false;
    for (const d of diagnostics) {
      const badge =
        d.status === 'ok' ? '✅ [OK]  ' : d.status === 'warn' ? '⚠️  [WARN]' : '❌ [FAIL]';
      console.log(`${badge} ${d.name.padEnd(26)} : ${d.versionOrDetail}`);
      if (d.recommendation) {
        console.log(`         ↳ Tip: ${d.recommendation}`);
      }
      if (d.status === 'error') hasError = true;
    }

    console.log('\nSystem Health Assessment: ' + (hasError ? 'Action Required ⚠️' : 'All Systems Operational 🚀\n'));
    process.exit(hasError ? 1 : 0);
  }

  const promptArgIndex = args.indexOf('--prompt');
  const urlArgIndex = args.indexOf('--url');
  const configArgIndex = args.indexOf('--config');

  if (promptArgIndex === -1 && urlArgIndex === -1 && configArgIndex === -1) {
    console.log(`
Brand Video Studio CLI (v2.0 Universal Motion Engine)
=====================================================

Usage:
  1. Universal Prompt Mode:
     pnpm studio --prompt "<topic or creative prompt>" [options]

  2. Reference-Informed Prompt Mode:
     pnpm studio --prompt "<topic>" --reference <video.mp4|url> [options]

  3. Scraped Brand Mode (Legacy):
     pnpm studio --url <website-url> [options]

  4. System Diagnostics:
     pnpm studio doctor

Options:
  --format <landscape|vertical>     Aspect ratio: 16:9 Landscape (default) or 9:16 Portrait (Shorts/Reels/TikTok)
  --duration <seconds>              Total video length in seconds (default: 20s, supports 15s to 120s+)
  --style <name>                    Visual style archetype:
                                    • amalgam (default: Brag + Rough.js + Matter.js + Anime.js)
                                    • physics-3d (Rigid body drops, perspective cards)
                                    • rough-whiteboard (Sketchy hand-drawn diagrams)
                                    • organic-watercolor (Parchment, fluid noise fields)
                                    • kinetic-vector (High-speed vector flow)
  --topic <name>                    Topic category (auto-detected if omitted):
                                    tech | science | history | news | entertainment | sports | saas
  --reference <file|url>            Drop-in inspiration video to extract pacing, rhythm & palette (no frame copying)
  --preview-only                    Instantly generate zero-cost HTML Storyboard Animatic without Remotion render
  --concurrency <1-4>               Render worker concurrency (default: 1 for low RAM safety)
`);
    process.exit(1);
  }

  const container = createStudioContainer();

  // Mode A: Universal Prompt-Driven Video Generation
  if (promptArgIndex !== -1 && args[promptArgIndex + 1]) {
    const prompt = args[promptArgIndex + 1];

    let format: 'landscape' | 'vertical' = 'landscape';
    const formatIndex = args.indexOf('--format');
    if (formatIndex !== -1 && args[formatIndex + 1]) {
      const f = args[formatIndex + 1].toLowerCase();
      format = f === 'vertical' || f === 'portrait' || f === '9:16' ? 'vertical' : 'landscape';
    }

    let durationSeconds = 20;
    const durIndex = args.indexOf('--duration');
    if (durIndex !== -1 && args[durIndex + 1]) {
      durationSeconds = Math.max(15, parseInt(args[durIndex + 1], 10) || 20);
    }

    let style: VisualStyle = 'amalgam';
    const styleIndex = args.indexOf('--style');
    if (styleIndex !== -1 && args[styleIndex + 1]) {
      style = args[styleIndex + 1].toLowerCase() as VisualStyle;
    }

    let topic: VideoTopic | undefined;
    const topicIndex = args.indexOf('--topic');
    if (topicIndex !== -1 && args[topicIndex + 1]) {
      topic = args[topicIndex + 1].toLowerCase() as VideoTopic;
    }

    let referenceInput: string | undefined;
    const refIndex = args.indexOf('--reference');
    if (refIndex !== -1 && args[refIndex + 1]) {
      referenceInput = args[refIndex + 1];
    }

    const previewOnly = args.includes('--preview-only');

    let concurrency = 1;
    const concIndex = args.indexOf('--concurrency');
    if (concIndex !== -1 && args[concIndex + 1]) {
      concurrency = Math.max(1, parseInt(args[concIndex + 1], 10) || 1);
    }

    console.log(`\n🚀 [Studio v2.0] Autonomous Universal Video Pipeline:`);
    console.log(`  - Prompt:        "${prompt}"`);
    console.log(`  - Format:        ${format} (${format === 'vertical' ? '1080x1920 (9:16 Portrait)' : '1920x1080 (16:9 Landscape)'})`);
    console.log(`  - Duration:      ${durationSeconds}s`);
    console.log(`  - Visual Style:  ${style}`);
    if (topic) console.log(`  - Topic:         ${topic}`);
    if (referenceInput) console.log(`  - Reference:     ${referenceInput} (Analyzing rhythm & pacing)`);
    if (previewOnly) console.log(`  - Mode:          PREVIEW-ONLY (Instant zero-cost HTML Animatic)`);

    try {
      const result = await container.generateUniversalVideoUseCase.execute({
        prompt,
        referenceInput,
        durationSeconds,
        format,
        topic,
        style,
        previewOnly,
        concurrency
      });

      console.log(`\n✨ Generation Finished!`);
      console.log(`  - Project Slug:     ${result.projectSlug}`);
      console.log(`  - Manifest:         ${result.manifestPath}`);
      console.log(`  - Storyboard HTML:  ${result.storyboardHtmlPath}`);

      if (result.previewOnly) {
        console.log(`\n📋 Pre-visualization animatic created! Open in browser:`);
        console.log(`   file://${path.resolve(result.storyboardHtmlPath).replace(/\\/g, '/')}`);
        console.log(`\nTo render 1080p video after review, run without --preview-only.`);
      } else {
        console.log(`  - Master Video:     ${result.videoPath}`);
        console.log(`  - Poster (Frame 0): ${result.posterPath}`);
        console.log(`  - Share Copy:       ${result.shareCopyPath}`);
        if (result.shareCopyText) {
          console.log(`\nShare Copy:\n${result.shareCopyText}\n`);
        }
      }
    } catch (err) {
      console.error('\n❌ [Studio] Universal generation failed:', err);
      process.exit(1);
    }
    return;
  }

  // Mode B: Legacy Scraped Brand Video Generation
  let url = '';
  let tone = 'cinematic';
  let format: 'landscape' | 'vertical' = 'landscape';
  let character = '';

  if (configArgIndex !== -1 && args[configArgIndex + 1]) {
    const configPath = args[configArgIndex + 1];
    const fileContent = await fs.readFile(configPath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    url = parsed.url;
    tone = parsed.tone || tone;
    format = parsed.format === 'vertical' ? 'vertical' : 'landscape';
    if (parsed.character) {
      character =
        parsed.character.enabled === false
          ? 'none'
          : parsed.character.type || parsed.character.imagePath || '';
    }
  }

  if (urlArgIndex !== -1 && args[urlArgIndex + 1]) {
    url = args[urlArgIndex + 1];
  }

  const toneIndex = args.indexOf('--tone');
  if (toneIndex !== -1 && args[toneIndex + 1]) {
    tone = args[toneIndex + 1];
  }

  const formatIndex = args.indexOf('--format');
  if (formatIndex !== -1 && args[formatIndex + 1]) {
    const rawFormat = args[formatIndex + 1].toLowerCase();
    format = rawFormat === 'vertical' || rawFormat === 'portrait' ? 'vertical' : 'landscape';
  }

  const charIndex = args.indexOf('--character');
  if (charIndex !== -1 && args[charIndex + 1]) {
    character = args[charIndex + 1];
  }

  console.log(`[Studio] Launching autonomous brand video generation:`);
  console.log(`  - URL:       ${url}`);
  console.log(`  - Format:    ${format} (${format === 'vertical' ? '1080x1920 (9:16 Portrait)' : '1920x1080 (16:9 Landscape)'})`);
  console.log(`  - Character: ${character}`);
  console.log(`  - Tone:      ${tone}`);

  try {
    const deliverable = await container.generateVideoUseCase.execute({
      url,
      tone,
      format,
      character,
      concurrency: 1
    });

    console.log(`\n🎉 Success! Deliverables generated:`);
    console.log(`  - Video:       ${deliverable.videoPath}`);
    console.log(`  - Poster:      ${deliverable.posterPath}`);
    console.log(`  - Share Copy:  ${deliverable.shareCopyPath}`);
    console.log(`  - Brand Config: output/${deliverable.projectSlug}/brand.config.json`);
    console.log(`\nPreview Share Copy:\n${deliverable.shareCopyText}\n`);
  } catch (err) {
    console.error('[Studio] Generation failed:', err);
    process.exit(1);
  }
}

main();
