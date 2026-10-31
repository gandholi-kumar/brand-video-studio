export interface IStoragePort {
  ensureProjectDirectory(projectSlug: string): Promise<string>;
  saveTextFile(projectSlug: string, relativePath: string, content: string): Promise<string>;
  fileExists(absolutePath: string): Promise<boolean>;
}

