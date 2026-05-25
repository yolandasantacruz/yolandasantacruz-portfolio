import { inject, Injectable } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

/**
 * Centralises resolution of root-relative asset paths (e.g. imageUrl from
 * markdown frontmatter) against the app's deployed base href.
 *
 * Problem this solves: on GitHub Pages the site lives at a subpath like
 * `/yolandasantacruz-portfolio/`, so a raw `/images/foo.png` from a markdown
 * file resolves to the repo root instead of the subpath. Prepending the base
 * href mirrors the same mechanism Angular's router uses for all routed URLs.
 */
@Injectable({ providedIn: 'root' })
export class ImageUrlService {
  private readonly baseHref = inject(APP_BASE_HREF, { optional: true }) ?? '/';

  /**
   * Prepends the app's base href to any root-relative path coming from
   * markdown frontmatter. Absolute `http(s)://` URLs are returned unchanged,
   * so external placeholder images keep working without modification.
   *
   * @example
   * // GitHub Pages (base = '/yolandasantacruz-portfolio/')
   * resolve('/images/foo.png') → '/yolandasantacruz-portfolio/images/foo.png'
   *
   * @example
   * // Local dev (base = '/')
   * resolve('/images/foo.png') → '/images/foo.png'
   *
   * @example
   * // Absolute URL — pass-through
   * resolve('https://placehold.co/800x600') → 'https://placehold.co/800x600'
   */
  resolve(imageUrl: string): string {
    if (!imageUrl || imageUrl.startsWith('http')) {
      return imageUrl;
    }
    const base = this.baseHref.endsWith('/')
      ? this.baseHref.slice(0, -1)
      : this.baseHref;
    const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${base}${path}`;
  }
}
