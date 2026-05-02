/**
 * Portrait SVG generator — abstract head/shoulders silhouette tinted by hue/sat.
 *
 * Replicates the visual contract from the design mockup. Used as a placeholder
 * until real portrait images are added in Phase 2. Deterministic per `code`
 * so the same talent always looks the same across renders.
 */

export interface PortraitOptions {
  hue: number;
  sat: number;
  /** Used as a deterministic seed and for accessibility labels. */
  code: string;
  /** Optional offset to derive variations (e.g. gallery thumbs). */
  variant?: number;
}

/** Returns a string of SVG markup safe to inject via `dangerouslySetInnerHTML`. */
export function buildPortraitSVG({
  hue,
  sat,
  code,
  variant = 0,
}: PortraitOptions): string {
  const seed =
    code.charCodeAt(Math.min(3, code.length - 1)) +
    code.charCodeAt(Math.min(4, code.length - 1)) +
    variant * 7;
  const variation = seed % 100;
  const gradientId = `bg-${code}-${variant}`;
  const lightId = `light-${code}-${variant}`;
  const skinId = `skin-${code}-${variant}`;

  const bgStart = `hsl(${hue}, ${sat}%, ${15 + variation * 0.1}%)`;
  const bgEnd = `hsl(${(hue + 30) % 360}, ${Math.max(0, sat - 10)}%, ${
    8 + variation * 0.05
  }%)`;
  const lightStart = `hsl(${hue}, ${sat + 10}%, ${45 + variation * 0.15}%)`;
  const lightEnd = `hsl(${hue}, ${sat}%, 10%)`;
  const skinStart = `hsl(${20 + variation * 0.3}, 35%, ${55 + variation * 0.1}%)`;
  const skinEnd = `hsl(${20 + variation * 0.3}, 30%, ${30 + variation * 0.1}%)`;
  const shoulderColor = `hsl(${hue}, ${Math.max(0, sat - 10)}%, ${
    20 + variation * 0.1
  }%)`;
  const hairColor = `hsl(${20 + variation * 0.5}, ${
    15 + variation * 0.3
  }%, ${10 + variation * 0.1}%)`;
  const faceShadow = `hsl(${hue}, ${sat}%, 8%)`;

  return `
<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Portrait ${code}" style="width:100%;height:100%;display:block;">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgStart}"/>
      <stop offset="100%" stop-color="${bgEnd}"/>
    </linearGradient>
    <radialGradient id="${lightId}" cx="50%" cy="35%" r="50%">
      <stop offset="0%" stop-color="${lightStart}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${lightEnd}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${skinId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${skinStart}"/>
      <stop offset="100%" stop-color="${skinEnd}"/>
    </linearGradient>
  </defs>
  <rect width="300" height="400" fill="url(#${gradientId})"/>
  <circle cx="150" cy="160" r="180" fill="url(#${lightId})"/>
  <path d="M 50 400 Q 150 280, 250 400 Z" fill="${shoulderColor}"/>
  <rect x="130" y="200" width="40" height="60" fill="url(#${skinId})" opacity="0.85"/>
  <ellipse cx="150" cy="170" rx="62" ry="78" fill="url(#${skinId})"/>
  <path d="M 88 140 Q 90 90, 150 80 Q 210 90, 212 140 Q 215 105, 195 95 Q 175 75, 150 75 Q 125 75, 105 95 Q 85 105, 88 140 Z" fill="${hairColor}"/>
  <ellipse cx="150" cy="175" rx="60" ry="76" fill="${faceShadow}" opacity="0.15"/>
  <rect width="300" height="400" fill="url(#${lightId})" opacity="0.3" style="mix-blend-mode: overlay;"/>
</svg>
`.trim();
}
