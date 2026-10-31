import { createStudioContainer } from '../../../container.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const urlArgIndex = args.indexOf('--url');

  if (urlArgIndex === -1 || !args[urlArgIndex + 1]) {
    console.log('Usage: pnpm studio --url <website-url> [--tone cinematic|polished|yc-parody]');
    process.exit(1);
  }

  const url = args[urlArgIndex + 1];
  const toneIndex = args.indexOf('--tone');
  const tone = toneIndex !== -1 ? args[toneIndex + 1] : 'cinematic';

  console.log(`[Studio] Launching autonomous brand video generation for: ${url}`);
  console.log(`[Studio] Tone: ${tone}`);

  const container = createStudioContainer();

  try {
    const deliverable = await container.generateVideoUseCase.execute({
      url,
      tone,
      concurrency: 1
    });

    console.log(`\n🎉 Success! Deliverables generated:`);
    console.log(`  - Video: ${deliverable.videoPath}`);
    console.log(`  - Poster: ${deliverable.posterPath}`);
    console.log(`  - Share Copy: ${deliverable.shareCopyPath}`);
    console.log(`\nPreview Copy:\n${deliverable.shareCopyText}\n`);
  } catch (err) {
    console.error('[Studio] Generation failed:', err);
    process.exit(1);
  }
}

main();

