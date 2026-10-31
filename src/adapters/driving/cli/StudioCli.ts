import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { createStudioContainer } from '../../../container.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const urlArgIndex = args.indexOf('--url');
  const configArgIndex = args.indexOf('--config');

  if (urlArgIndex === -1 && configArgIndex === -1) {
    console.log(`
Brand Video Studio CLI
Usage:
  pnpm studio --url <website-url> [options]
  pnpm studio --config <path-to-brand.config.json> [options]

Options:
  --format <landscape|vertical>     Aspect ratio: 16:9 Landscape (default) or 9:16 Portrait for Shorts/Reels/TikTok
  --character <path-to-image|none>  Custom character image, model sheet, or 'none' (default: dynamic / anime robot fallback)
  --tone <cinematic|playful|fast>   Narrative style & music mood (default: cinematic)
  --concurrency <1-4>               Render worker concurrency (default: 1 for low RAM)
`);
    process.exit(1);
  }

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
      character = parsed.character.enabled === false ? 'none' : (parsed.character.type || parsed.character.imagePath || '');
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

  // If a local image file was passed, copy it to public/ for Remotion static asset serving
  if (character && character !== 'none') {
    try {
      const charPath = path.resolve(character);
      const stat = await fs.stat(charPath);
      if (stat.isFile()) {
        const ext = path.extname(charPath);
        const destName = `user-character${ext}`;
        await fs.copyFile(charPath, path.join('public', destName));
        character = destName;
      }
    } catch {
      // Keep as-is if already in public or not a direct file path
    }
  }

  console.log(`[Studio] Launching autonomous brand video generation:`);
  console.log(`  - URL:       ${url}`);
  console.log(`  - Format:    ${format} (${format === 'vertical' ? '1080x1920 (9:16 Portrait)' : '1920x1080 (16:9 Landscape)'})`);
  console.log(`  - Character: ${character}`);
  console.log(`  - Tone:      ${tone}`);

  const container = createStudioContainer();

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
