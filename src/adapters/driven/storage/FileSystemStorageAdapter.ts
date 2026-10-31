import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { IStoragePort } from '../../../application/ports/outbound/IStoragePort.js';

export class FileSystemStorageAdapter implements IStoragePort {
  private readonly baseOutputDir: string;
  private readonly allocatedDirs: Map<string, string> = new Map();

  constructor(baseOutputDir: string = './output') {
    this.baseOutputDir = path.resolve(baseOutputDir);
  }

  public async ensureProjectDirectory(projectSlug: string): Promise<string> {
    // If already allocated for this session/run, return it to keep all files together
    if (this.allocatedDirs.has(projectSlug)) {
      return this.allocatedDirs.get(projectSlug)!;
    }

    let targetDir = path.join(this.baseOutputDir, projectSlug);

    if (await this.fileExists(targetDir)) {
      try {
        const files = await fs.readdir(targetDir);
        // If directory already contains files (e.g. previous runs/deliverables), allocate a new unique timestamped folder
        if (files.length > 0) {
          const now = new Date();
          const pad = (n: number) => String(n).padStart(2, '0');
          const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
          targetDir = path.join(this.baseOutputDir, `${projectSlug}-${timestamp}`);
        }
      } catch {
        // Fallback to targetDir if readdir fails
      }
    }

    await fs.mkdir(targetDir, { recursive: true });
    // Pre-create internal .work/ directory for intermediate render frames/videos
    await fs.mkdir(path.join(targetDir, '.work'), { recursive: true });

    this.allocatedDirs.set(projectSlug, targetDir);
    return targetDir;
  }

  public async saveTextFile(
    projectSlugOrDir: string,
    relativePath: string,
    content: string
  ): Promise<string> {
    let targetDir: string;
    if (path.isAbsolute(projectSlugOrDir) || projectSlugOrDir.includes(path.sep)) {
      targetDir = projectSlugOrDir;
    } else {
      targetDir = await this.ensureProjectDirectory(projectSlugOrDir);
    }

    const fullPath = path.join(targetDir, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');
    return fullPath;
  }

  public async fileExists(absolutePath: string): Promise<boolean> {
    try {
      await fs.access(absolutePath);
      return true;
    } catch {
      return false;
    }
  }
}
