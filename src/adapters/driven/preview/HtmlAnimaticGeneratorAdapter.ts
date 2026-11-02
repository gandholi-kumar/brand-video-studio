import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { VideoManifestData } from '../../../domain/entities/VideoManifest.js';

export class HtmlAnimaticGeneratorAdapter {
  public async generateAnimaticHtml(
    manifest: VideoManifestData,
    outputDirectory: string
  ): Promise<string> {
    await fs.mkdir(outputDirectory, { recursive: true });
    const outputFilePath = path.join(outputDirectory, 'storyboard.html');

    const isPortrait = manifest.aspectRatio === '9:16';
    const aspectRatioLabel = isPortrait ? '9:16 Portrait (Shorts/Reels/TikTok)' : '16:9 Landscape (Laptop/Web/YouTube)';
    const palette = manifest.theme.palette;

    const scenesHtml = manifest.scenes
      .map((scene, i) => {
        return `
        <div class="scene-card">
          <div class="scene-header">
            <span class="scene-index">SCENE ${i + 1}</span>
            <span class="scene-duration">${scene.durationSeconds}s</span>
            <span class="scene-type">${scene.layoutType.toUpperCase()}</span>
          </div>
          <div class="scene-preview-box ${isPortrait ? 'portrait-box' : 'landscape-box'}">
            <div class="scene-badge">${scene.badgeText || 'HIGHLIGHT'}</div>
            <h3 class="scene-title">${scene.title}</h3>
            ${scene.subtitle ? `<p class="scene-subtitle">${scene.subtitle}</p>` : ''}
            <div class="scene-visual-hint">Visual: [${scene.layoutType}] active motion</div>
          </div>
          <div class="scene-script">
            <strong>Narration / On-Screen:</strong>
            <p>${scene.subtitle || scene.title}</p>
          </div>
        </div>
      `;
      })
      .join('\n');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pre-Visualization Animatic: ${manifest.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: #060911; color: #f8fafc; padding: 32px 20px; line-height: 1.5; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; border-bottom: 1px solid #1e293b; padding-bottom: 20px; }
    .title-area h1 { font-size: 28px; font-weight: 800; color: #ffffff; }
    .title-area p { color: #94a3b8; font-size: 15px; margin-top: 6px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700; background: ${palette.accent}22; color: ${palette.accent}; border: 1px solid ${palette.accent}; margin-right: 8px; }
    
    .timeline-bar { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 32px; }
    .timeline-title { font-size: 13px; font-weight: 700; color: #94a3b8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .track { display: flex; height: 36px; border-radius: 8px; overflow: hidden; background: #1e293b; }
    .track-segment { display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #ffffff; border-right: 1px solid #060911; transition: opacity 0.2s; }
    .track-segment:hover { opacity: 0.85; cursor: pointer; }

    .swatches { display: flex; gap: 12px; align-items: center; margin-bottom: 28px; }
    .swatch { display: flex; align-items: center; gap: 8px; background: #0f172a; padding: 6px 14px; border-radius: 8px; border: 1px solid #1e293b; font-size: 13px; }
    .swatch-color { width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); }

    .scenes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(${isPortrait ? '260px' : '360px'}, 1fr)); gap: 24px; }
    .scene-card { background: #0b1120; border: 1.5px solid #1e293b; border-radius: 18px; padding: 20px; transition: transform 0.2s, border-color 0.2s; }
    .scene-card:hover { transform: translateY(-4px); border-color: ${palette.accent}; }
    .scene-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-size: 12px; font-weight: 800; color: #94a3b8; }
    .scene-index { color: ${palette.accent}; }
    
    .scene-preview-box { border-radius: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; background: #020617; border: 1px dashed #334155; position: relative; margin-bottom: 14px; }
    .landscape-box { height: 190px; }
    .portrait-box { height: 320px; }
    
    .scene-badge { font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; background: ${palette.accent}22; color: ${palette.accent}; margin-bottom: 10px; text-transform: uppercase; }
    .scene-title { font-size: 16px; font-weight: 800; color: #ffffff; line-height: 1.25; margin-bottom: 6px; }
    .scene-subtitle { font-size: 12px; color: #94a3b8; line-height: 1.3; }
    .scene-visual-hint { position: absolute; bottom: 8px; font-size: 10px; color: #64748b; font-family: monospace; }

    .scene-script { background: #080d1a; padding: 12px; border-radius: 8px; font-size: 12px; color: #cbd5e1; }
    .scene-script strong { color: #f8fafc; display: block; margin-bottom: 4px; }

    .actions-bar { position: sticky; bottom: 20px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(16px); border: 1.5px solid ${palette.accent}; padding: 16px 28px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; margin-top: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
    .actions-bar p { font-size: 14px; color: #94a3b8; }
    .btn { background: ${palette.accent}; color: #090d16; font-weight: 800; border: none; padding: 10px 24px; border-radius: 10px; font-size: 14px; cursor: pointer; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title-area">
        <span class="badge">${manifest.topic.toUpperCase()}</span>
        <span class="badge">${manifest.style.toUpperCase()}</span>
        <h1>${manifest.title}</h1>
        <p>Target Aspect Ratio: ${aspectRatioLabel} • Total Duration: ${manifest.totalDurationSeconds}s @ ${manifest.fps}fps</p>
      </div>
      <div>
        <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: #10b981;">PRE-VISUALIZATION READY</span>
      </div>
    </div>

    <!-- Pacing Timeline Bar -->
    <div class="timeline-bar">
      <div class="timeline-title">Pacing & Scene Cut Timeline</div>
      <div class="track">
        ${manifest.scenes
          .map((s, idx) => {
            const widthPct = (s.durationSeconds / manifest.totalDurationSeconds) * 100;
            const bg = idx % 2 === 0 ? palette.accent : palette.secondaryAccent;
            return `<div class="track-segment" style="width: ${widthPct}%; background: ${bg}cc;">S${idx + 1} (${s.durationSeconds}s)</div>`;
          })
          .join('')}
      </div>
    </div>

    <!-- Color Palette Swatches -->
    <div class="swatches">
      <div class="swatch"><div class="swatch-color" style="background: ${palette.background};"></div> Background: ${palette.background}</div>
      <div class="swatch"><div class="swatch-color" style="background: ${palette.accent};"></div> Accent: ${palette.accent}</div>
      <div class="swatch"><div class="swatch-color" style="background: ${palette.secondaryAccent};"></div> Secondary: ${palette.secondaryAccent}</div>
    </div>

    <!-- Scenes Wireframe Grid -->
    <div class="scenes-grid">
      ${scenesHtml}
    </div>

    <!-- Approval Action Bar -->
    <div class="actions-bar">
      <div>
        <strong style="color: #ffffff;">Pre-Visualization Approved?</strong>
        <p>Review wireframe layout and narration beats above before running Remotion headless render.</p>
      </div>
      <button class="btn" onclick="alert('Storyboard Confirmed! Ready for Remotion video render.')">Confirm & Render Video</button>
    </div>
  </div>
</body>
</html>`;

    await fs.writeFile(outputFilePath, htmlContent, 'utf-8');
    return outputFilePath;
  }
}

