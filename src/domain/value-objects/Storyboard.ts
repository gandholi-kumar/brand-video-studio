import { Scene } from './Scene.js';

export class Storyboard {
  constructor(
    public readonly scenes: readonly Scene[],
    public readonly targetBpm: number = 120
  ) {
    if (scenes.length === 0) {
      throw new Error('Storyboard must contain at least one scene');
    }
  }

  public getTotalDurationSeconds(): number {
    return this.scenes.reduce((acc, scene) => acc + scene.durationSeconds, 0);
  }

  public getHook(): Scene | undefined {
    return this.scenes.find((s) => s.type === 'hook');
  }

  public getOutro(): Scene | undefined {
    return this.scenes.find((s) => s.type === 'outro');
  }
}

