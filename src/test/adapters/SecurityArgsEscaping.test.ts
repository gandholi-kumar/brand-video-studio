import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { PuppeteerScraperAdapter } from '../../adapters/driven/scraper/PuppeteerScraperAdapter.js';
import { OpenverseMediaAdapter } from '../../adapters/driven/media/OpenverseMediaAdapter.js';

describe('Security & SSRF Hardening', () => {
  const scraper = new PuppeteerScraperAdapter();
  const openverse = new OpenverseMediaAdapter();

  it('rejects forbidden protocols (file://, javascript:, gopher:) to prevent LFI and XSS', () => {
    assert.throws(() => scraper.validateUrl('file:///etc/passwd'), /forbidden/i);
    assert.throws(() => scraper.validateUrl('javascript:alert(1)'), /forbidden/i);
  });

  it('rejects loopback and private intranet IP addresses (SSRF prevention)', () => {
    assert.throws(() => scraper.validateUrl('http://127.0.0.1:8080'), /blocked|forbidden|SSRF/i);
    assert.throws(() => scraper.validateUrl('http://localhost:3000'), /blocked|forbidden|SSRF/i);
    assert.throws(() => scraper.validateUrl('http://192.168.1.1/admin'), /blocked|forbidden|SSRF/i);
    assert.throws(() => scraper.validateUrl('http://10.0.0.1/secrets'), /blocked|forbidden|SSRF/i);
    assert.throws(() => scraper.validateUrl('http://169.254.169.254/latest/meta-data/'), /blocked|forbidden|SSRF/i);
  });

  it('allows legitimate public web URLs', () => {
    const valid = scraper.validateUrl('https://example.com/project');
    assert.equal(valid.hostname, 'example.com');
  });

  it('blocks private loopback URLs in Openverse downloader', async () => {
    await assert.rejects(
      async () => {
        await openverse.downloadTrack(
          {
            id: 'malicious',
            title: 'exploit',
            url: 'http://127.0.0.1:8000/steal',
            downloadUrl: 'http://127.0.0.1:8000/steal',
            license: 'cc0'
          },
          'output/temp'
        );
      },
      /SSRF blocked/i
    );
  });
});
