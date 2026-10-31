export interface ColorPalette {
  background: string;
  foreground: string;
  accent: string;
  secondaryAccent?: string;
  border?: string;
}

export interface TypographyTokens {
  display: string;
  body: string;
  mono: string;
}

export interface CapturedVisual {
  name: string;
  filePath: string;
  caption?: string;
}

export class BrandProject {
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly url: string,
    public readonly tagline: string,
    public readonly colors: ColorPalette,
    public readonly typography: TypographyTokens,
    public readonly visuals: CapturedVisual[] = [],
    public readonly tone: string = 'cinematic'
  ) {}

  public static create(props: {
    name: string;
    url: string;
    tagline: string;
    colors: ColorPalette;
    typography: TypographyTokens;
    visuals?: CapturedVisual[];
    tone?: string;
  }): BrandProject {
    const slug = props.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return new BrandProject(
      props.name,
      slug,
      props.url,
      props.tagline,
      props.colors,
      props.typography,
      props.visuals || [],
      props.tone || 'cinematic'
    );
  }
}

