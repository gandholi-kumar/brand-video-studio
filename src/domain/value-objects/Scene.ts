export type SceneType = 'hook' | 'reveal' | 'highlight' | 'feature' | 'outro';

export interface SceneProps {
  id: string;
  type: SceneType;
  title: string;
  subtitle?: string;
  durationSeconds: number;
  visualAsset?: string;
  sfxCue?: string;
}

export class Scene {
  public readonly id: string;
  public readonly type: SceneType;
  public readonly title: string;
  public readonly subtitle?: string;
  public readonly durationSeconds: number;
  public readonly visualAsset?: string;
  public readonly sfxCue?: string;

  constructor(props: SceneProps) {
    if (props.durationSeconds <= 0) {
      throw new Error(`Scene ${props.id} duration must be positive`);
    }
    this.id = props.id;
    this.type = props.type;
    this.title = props.title;
    this.subtitle = props.subtitle;
    this.durationSeconds = props.durationSeconds;
    this.visualAsset = props.visualAsset;
    this.sfxCue = props.sfxCue;
  }
}

