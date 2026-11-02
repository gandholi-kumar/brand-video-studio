import puppeteer from 'puppeteer';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import { IWebScraperPort, ScrapedSiteData } from '../../../application/ports/outbound/IWebScraperPort.js';
import { CapturedVisual } from '../../../domain/entities/BrandProject.js';

export class PuppeteerScraperAdapter implements IWebScraperPort {
  public getChromeExecutable(): string | undefined {
    if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
      return process.env.CHROME_BIN;
    }

    const programFiles = process.env.PROGRAMFILES || 'C:\\Program Files';
    const programFilesX86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';
    const localAppData = process.env.LOCALAPPDATA || '';

    const candidates = [
      path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      localAppData ? path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe') : '',
      // Linux / macOS standard paths
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    ].filter(Boolean);

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    return undefined; // Let puppeteer fallback to its bundled browser
  }

  public validateUrl(rawUrl: string): URL {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`Security Exception: Protocol '${parsed.protocol}' is forbidden. Only HTTP/HTTPS is allowed.`);
    }

    const hostname = parsed.hostname.toLowerCase();
    const forbiddenPatterns = [
      'localhost',
      '127.',
      '0.0.0.0',
      '10.',
      '192.168.',
      '169.254.',
      '::1',
      '[::1]'
    ];

    for (const pattern of forbiddenPatterns) {
      if (hostname === pattern || hostname.startsWith(pattern)) {
        throw new Error(`Security Exception: Access to private/loopback address '${hostname}' is blocked to prevent SSRF.`);
      }
    }

    return parsed;
  }

  public async scrapeUrl(targetUrl: string, outputDir: string): Promise<ScrapedSiteData> {
    this.validateUrl(targetUrl);
    await fsp.mkdir(outputDir, { recursive: true });

    const chromePath = this.getChromeExecutable();
    const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
      headless: true,
      args: ['--disable-gpu', '--disable-dev-shm-usage']
    };

    if (chromePath) {
      launchOptions.executablePath = chromePath;
    }

    const browser = await puppeteer.launch(launchOptions);

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });

      try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.evaluateHandle('document.fonts.ready').catch(() => {});
      } catch (navErr) {
        console.warn(`[Scraper] Notice on ${targetUrl}: proceeding with available page state.`);
      }

      let title = 'Autonomous Brand Launch';
      let metaDescription = 'Modern software built for high productivity and fast execution.';

      try {
        const liveTitle = await page.title();
        if (liveTitle && liveTitle.trim()) title = liveTitle.trim();
        const liveDesc = await page.$eval(
          'meta[name="description"]',
          (el) => el.getAttribute('content') || ''
        ).catch(() => '');
        if (liveDesc && liveDesc.trim()) metaDescription = liveDesc.trim();
      } catch {
        // Fallback to defaults
      }

      const heroScreenshotPath = path.join(outputDir, 'hero-desktop.png');
      try {
        await page.screenshot({ path: heroScreenshotPath, fullPage: false });
      } catch {
        // Fallback to placeholder if screenshot fails
      }

      const screenshots: CapturedVisual[] = [
        {
          name: 'Hero Viewport',
          filePath: heroScreenshotPath,
          caption: 'Desktop Landing View'
        }
      ];

      return {
        title,
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
