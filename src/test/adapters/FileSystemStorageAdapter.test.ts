import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { FileSystemStorageAdapter } from '../../adapters/driven/storage/FileSystemStorageAdapter.js';

describe('FileSystemStorageAdapter', () => {
  const testOutputDir = path.resolve('temp/test-storage-output');

  before(async () => {
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  after(async () => {
    await fs.rm(testOutputDir, { recursive: true, force: true });
  });

  it('allocates base project directory when no prior directory exists', async () => {
    const storage = new FileSystemStorageAdapter(testOutputDir);
    const dir = await storage.ensureProjectDirectory('fresh-project');

    assert.equal(dir, path.join(testOutputDir, 'fresh-project'));
    const workExists = await fs.stat(path.join(dir, '.work')).then((s) => s.isDirectory()).catch(() => false);
    assert.equal(workExists, true, '.work directory must be pre-created');
  });

  it('allocates a timestamped directory when prior directory contains existing files (non-destructive)', async () => {
    const existingDir = path.join(testOutputDir, 'occupied-project');
    await fs.mkdir(existingDir, { recursive: true });
    await fs.writeFile(path.join(existingDir, 'brag.mp4'), 'dummy-video-data');

    const storage = new FileSystemStorageAdapter(testOutputDir);
    const newDir = await storage.ensureProjectDirectory('occupied-project');

    assert.notEqual(newDir, existingDir, 'Must not return the existing occupied directory');
    assert.match(path.basename(newDir), /^occupied-project-\d{8}-\d{6}$/);

    const workExists = await fs.stat(path.join(newDir, '.work')).then((s) => s.isDirectory()).catch(() => false);
    assert.equal(workExists, true, 'New timestamped dir must also have .work directory pre-created');
  });

  it('memoizes allocated directory for the same project slug in the same session', async () => {
    const storage = new FileSystemStorageAdapter(testOutputDir);
    const dir1 = await storage.ensureProjectDirectory('memoized-project');
    const dir2 = await storage.ensureProjectDirectory('memoized-project');

    assert.equal(dir1, dir2, 'Must return the same allocated path for repeated calls in one run');
  });
});

