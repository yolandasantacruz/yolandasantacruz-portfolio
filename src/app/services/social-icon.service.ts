import { Injectable } from '@angular/core';

/**
 * Central registry of SVG path data for social platform icons.
 *
 * Design-system analogy: this is the "icon library" component — a shared
 * Figma library that every consumer links to instead of embedding detached
 * copies of the same SVG inside individual artboards.
 *
 * Add new platforms here; every consumer automatically gets the new icon
 * without touching individual components.
 */
const SOCIAL_ICON_PATHS: Readonly<Record<string, string>> = {
  linkedin:
    'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.91h2.79v8.37H6.46v-8.37M7.86 6.32a1.62 1.62 0 0 0-1.63 1.62 1.62 1.62 0 0 0 1.63 1.63 1.62 1.62 0 0 0 1.62-1.63 1.62 1.62 0 0 0-1.62-1.62z',
  twitter:
    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  dribbble:
    'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm8.17 7.7a8.55 8.55 0 0 1 .33 2.3 8.35 8.35 0 0 1-.72 3.44c-.3-.14-3.52-1.57-6.22-1.16v-.06a26.24 26.24 0 0 0 1.54-6.42 16.7 16.7 0 0 1 5.07 1.9zm-8.17-6.2a8.5 8.5 0 0 1 5.62 2.1c-1.32.96-3.78 1.66-5.48 1.83a28.44 28.44 0 0 0-3.32-5.75A8.34 8.34 0 0 1 12 3.5zm-5 2.53a8.4 8.4 0 0 1 3.5-1.58c1.1 1.76 2.17 3.84 2.8 5.34-3.38.8-6.8 1-7.85 1a8.45 8.45 0 0 1 1.55-4.76zm-1.5 6c1.1-.03 4.8-.23 8.4-1.14a28.2 28.2 0 0 1-1.36 5.66 18.15 18.15 0 0 1-5.7 1.7 8.5 8.5 0 0 1-1.34-6.22zm6.85 7.17a15.7 15.7 0 0 0 5-1.5 15.4 15.4 0 0 0 2.45 2.1 8.5 8.5 0 0 1-7.45-.6z',
} as const;

@Injectable({ providedIn: 'root' })
export class SocialIconService {
  /**
   * Returns the SVG `<path d="...">` data for a known social platform.
   * Returns `undefined` for unrecognised platform names so callers can
   * conditionally render the icon element without crashing.
   */
  getPath(platform: string): string | undefined {
    return Object.prototype.hasOwnProperty.call(SOCIAL_ICON_PATHS, platform)
      ? SOCIAL_ICON_PATHS[platform]
      : undefined;
  }
}
