import { TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { ImageUrlService } from './image-url.service';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Helper to bootstrap a fresh TestBed with a specific APP_BASE_HREF value
 * and return the service under test.
 */
function createService(baseHref: string): ImageUrlService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [{ provide: APP_BASE_HREF, useValue: baseHref }],
  });
  return TestBed.inject(ImageUrlService);
}

describe('ImageUrlService', () => {
  describe('GitHub Pages subpath deployment (base = /yolandasantacruz-portfolio/)', () => {
    let service: ImageUrlService;

    beforeEach(() => {
      service = createService('/yolandasantacruz-portfolio/');
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('prepends the base href to a root-relative path', () => {
      expect(service.resolve('/images/PayWithApp-HomeCover.png'))
        .toBe('/yolandasantacruz-portfolio/images/PayWithApp-HomeCover.png');
    });

    it('adds a leading slash when the path has none', () => {
      expect(service.resolve('images/FetchPay_HomeCover.png'))
        .toBe('/yolandasantacruz-portfolio/images/FetchPay_HomeCover.png');
    });

    it('handles a base href without a trailing slash', () => {
      const svc = createService('/yolandasantacruz-portfolio');
      expect(svc.resolve('/images/foo.png'))
        .toBe('/yolandasantacruz-portfolio/images/foo.png');
    });
  });

  describe('root-level deployment (base = /)', () => {
    let service: ImageUrlService;

    beforeEach(() => {
      service = createService('/');
    });

    it('returns the same root-relative path unchanged', () => {
      expect(service.resolve('/images/PlantMe-HomeCover.png'))
        .toBe('/images/PlantMe-HomeCover.png');
    });

    it('adds a leading slash to a path without one', () => {
      expect(service.resolve('images/PlantMe-HomeCover.png'))
        .toBe('/images/PlantMe-HomeCover.png');
    });
  });

  describe('absolute URLs — pass-through', () => {
    let service: ImageUrlService;

    beforeEach(() => {
      service = createService('/yolandasantacruz-portfolio/');
    });

    it('does not modify an https:// URL', () => {
      const url = 'https://placehold.co/800x600/1a1a1a/5ed6cc?text=SaaS+Permissions';
      expect(service.resolve(url)).toBe(url);
    });

    it('does not modify an http:// URL', () => {
      const url = 'http://example.com/image.png';
      expect(service.resolve(url)).toBe(url);
    });
  });

  describe('edge cases', () => {
    it('returns an empty string unchanged', () => {
      const service = createService('/');
      expect(service.resolve('')).toBe('');
    });
  });
});
