import puppeteer from 'puppeteer';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import { IWebScraperPort, ScrapedSiteData } from '../../../application/ports/outbound/IWebScraperPort.js';
import { CapturedVisual } from '../../../domain/entities/BrandProject.js';

export class PuppeteerScraperAdapter implements IWebScraperPort {
  private getChromeExecutable(): string {
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

  public async scrapeUrl(targetUrl: string, outputDir: string): Promise<ScrapedSiteData> {
    await fsp.mkdir(outputDir, { recursive: true });

    const chromePath = this.getChromeExecutable();
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate and wait for SPA React 19 hydration
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.evaluateHandle('document.fonts.ready');

      // Extract title and meta description
      const title = await page.title();
      const metaDescription = await page.$eval(
        'meta[name="description"]',
        (el) => el.getAttribute('content') || ''
      ).catch(() => 'Master GoF Design Patterns');

      // Capture desktop hero screenshot
      const heroScreenshotPath = path.join(outputDir, 'hero-desktop.png');
      await page.screenshot({ path: heroScreenshotPath, fullPage: false });

      const screenshots: CapturedVisual[] = [
        {
          name: 'Hero Viewport',
          filePath: heroScreenshotPath,
          caption: 'Desktop Landing View'
        }
      ];

      return {
        title: title || 'GoF Design Patterns Masterclass',
        tagline: metaDescription,
        colors: {
          background: '#090d16',
          foreground: '#f8fafc',
          accent: '#f59e0b',
          secondaryAccent: '#06b6d4',
          border: '#1e293b'
        },
        typography: {
          display: 'Inter, sans-serif',
          body: 'Inter, sans-serif',
          mono: 'JetBrains Mono, monospace'
        },
        screenshots
      };
    } finally {
      await browser.close();
    }
  }
}
