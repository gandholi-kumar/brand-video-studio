import puppeteer from 'puppeteer';
import * as fs from 'node:fs';

function findChrome(): string {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Users\\User\\.cache\\puppeteer\\chrome\\win64-131.0.6778.204\\chrome-win64\\chrome.exe'
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

async function main() {
  const chromePath = findChrome();
  console.log('Using Chrome executable:', chromePath);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-gpu']
  });

  console.log('Browser launched successfully!');
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://design-patterns-cyan.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');
  const title = await page.title();
  console.log('Page Title:', title);

  fs.mkdirSync('./output/design-patterns', { recursive: true });
  await page.screenshot({ path: './output/design-patterns/hero-live.png' });
  console.log('Screenshot saved to ./output/design-patterns/hero-live.png');

  await browser.close();
  console.log('Browser closed cleanly.');
}

main().catch(err => {
  console.error('Fatal Scraper Test Error:', err);
  process.exit(1);
});
