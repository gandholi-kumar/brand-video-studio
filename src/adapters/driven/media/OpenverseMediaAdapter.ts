import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  IOpenverseMediaPort,
  OpenverseTrack
} from '../../../application/ports/outbound/IOpenverseMediaPort.js';

export class OpenverseMediaAdapter implements IOpenverseMediaPort {
  private readonly defaultFallbackTrack = path.join('assets', 'music', 'soundtrack.mp3');

  private isPrivateOrLoopback(hostname: string): boolean {
    const lower = hostname.toLowerCase();
    if (lower === 'localhost' || lower === '127.0.0.1' || lower === '::1') return true;
    if (lower.startsWith('10.') || lower.startsWith('192.168.')) return true;
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)) return true;
    if (lower.endsWith('.local') || lower.endsWith('.internal')) return true;
    return false;
  }

  public async searchAudio(
    query: string,
    licenseType: 'all-cc' | 'cc0' | 'by' = 'all-cc'
  ): Promise<OpenverseTrack[]> {
    const encoded = encodeURIComponent(query);
    const apiUrl = `https://api.openverse.org/v1/audio/?q=${encoded}&license_type=${licenseType}&page_size=5`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(apiUrl, {
        headers: { 'User-Agent': 'BrandVideoStudio/1.0' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return [];
      }

      const data = (await res.json()) as {
        results?: Array<{
          id: string;
          title: string;
          creator?: string;
          url: string;
          download_url?: string;
          license: string;
          duration?: number;
        }>;
      };

      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results
        .filter((item) => item.download_url || item.url)
        .map((item) => ({
          id: item.id,
          title: item.title,
          creator: item.creator,
          url: item.url,
          downloadUrl: item.download_url || item.url,
          license: item.license,
          duration: item.duration ? Math.round(item.duration / 1000) : undefined
        }));
    } catch {
      // Offline or network error - return empty array to trigger graceful local fallback
      return [];
    }
  }

  public async downloadTrack(track: OpenverseTrack, targetDir: string): Promise<string> {
    await fs.mkdir(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, `openverse-${track.id}.mp3`);

    const parsedUrl = new URL(track.downloadUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error(`Invalid protocol for audio download: ${parsedUrl.protocol}`);
    }
    if (this.isPrivateOrLoopback(parsedUrl.hostname)) {
      throw new Error(`SSRF blocked: Private or loopback target hostname: ${parsedUrl.hostname}`);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(track.downloadUrl, {
        headers: { 'User-Agent': 'BrandVideoStudio/1.0' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to download audio track: HTTP ${res.status}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(targetFile, buffer);
      return targetFile;
    } catch {
      return this.defaultFallbackTrack;
    }
  }

  public async getAudioForTopic(topic: string, targetDir: string): Promise<string> {
    const tracks = await this.searchAudio(topic);
    if (tracks.length > 0 && tracks[0].downloadUrl) {
      try {
        const downloaded = await this.downloadTrack(tracks[0], targetDir);
        return downloaded;
      } catch {
        return this.defaultFallbackTrack;
      }
    }
    return this.defaultFallbackTrack;
  }
}
