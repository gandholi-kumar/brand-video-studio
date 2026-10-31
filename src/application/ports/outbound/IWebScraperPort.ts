import { ColorPalette, TypographyTokens, CapturedVisual } from '../../../domain/entities/BrandProject.js';

export interface ScrapedSiteData {
  title: string;
  tagline: string;
  colors: ColorPalette;
  typography: TypographyTokens;
  screenshots: CapturedVisual[];
}

export interface IWebScraperPort {
  scrapeUrl(targetUrl: string, outputDir: string): Promise<ScrapedSiteData>;
}

