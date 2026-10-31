import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { IStoragePort } from '../../../application/ports/outbound/IStoragePort.js';

export class FileSystemStorageAdapter implements IStoragePort {
  private readonly baseOutputDir: string;

  constructor(baseOutputDir: string = './output') {
    this.baseOutputDir = path.resolve(baseOutputDir);
  }

  public async ensureProjectDirectory(projectSlug: string): Promise<string> {
    const projectDir = path.join(this.baseOutputDir, projectSlug);
    await fs.mkdir(projectDir, { recursive: true });
    return projectDir;
  }

  public async saveTextFile(
    projectSlug: string,
    relativePath: string,
    content: string
  ): Promise<string> {
    const projectDir = await this.ensureProjectDirectory(projectSlug);
    const fullPath = path.join(projectDir, relativePath);
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

