/**
 * Unit tests for the resolveImageUrl path-resolution logic in index.page.ts.
 *
 * The function must prepend APP_BASE_HREF to root-relative image paths from
 * markdown frontmatter so that images work on GitHub Pages subpath deployments
 * (e.g. /yolandasantacruz-portfolio/) as well as root-level deployments (/).
 */
import { describe, it, expect } from 'vitest';

/** Mirror of the private helper extracted for isolated testing. */
function resolveImageUrl(imageUrl: string, baseHref: string): string {
  if (!imageUrl || imageUrl.startsWith('http')) {
    return imageUrl;
  }
  const base = baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${base}${path}`;
}

describe('resolveImageUrl', () => {
  describe('GitHub Pages subpath deployment', () => {
    const baseHref = '/yolandasantacruz-portfolio/';

    it('prepends the base href to a root-relative path', () => {
      expect(resolveImageUrl('/images/PayWithApp-HomeCover.png', baseHref))
        .toBe('/yolandasantacruz-portfolio/images/PayWithApp-HomeCover.png');
    });

    it('prepends the base href to a path without leading slash', () => {
      expect(resolveImageUrl('images/FetchPay_HomeCover.png', baseHref))
        .toBe('/yolandasantacruz-portfolio/images/FetchPay_HomeCover.png');
    });

    it('handles a base href without a trailing slash', () => {
      expect(resolveImageUrl('/images/foo.png', '/yolandasantacruz-portfolio'))
        .toBe('/yolandasantacruz-portfolio/images/foo.png');
    });
  });

  describe('root-level deployment (local dev and custom domains)', () => {
    const baseHref = '/';

    it('returns the same root-relative path when base is /', () => {
      expect(resolveImageUrl('/images/PlantMe-HomeCover.png', baseHref))
        .toBe('/images/PlantMe-HomeCover.png');
    });

    it('adds a leading slash to a path without one', () => {
      expect(resolveImageUrl('images/PlantMe-HomeCover.png', baseHref))
        .toBe('/images/PlantMe-HomeCover.png');
    });
  });

  describe('absolute URLs — pass-through', () => {
    const baseHref = '/yolandasantacruz-portfolio/';

    it('does not modify an https:// URL', () => {
      const url = 'https://placehold.co/800x600/1a1a1a/5ed6cc?text=SaaS+Permissions';
      expect(resolveImageUrl(url, baseHref)).toBe(url);
    });

    it('does not modify an http:// URL', () => {
      const url = 'http://example.com/image.png';
      expect(resolveImageUrl(url, baseHref)).toBe(url);
    });
  });

  describe('edge cases', () => {
    it('returns an empty string unchanged', () => {
      expect(resolveImageUrl('', '/')).toBe('');
    });

    it('handles a base href of empty string gracefully', () => {
      // Treats as root-level: just adds leading slash normalization
      expect(resolveImageUrl('/images/foo.png', '')).toBe('/images/foo.png');
    });
  });
});
