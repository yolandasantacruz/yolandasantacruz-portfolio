import { TestBed } from '@angular/core/testing';
import { AboutSocialIconService } from './about-social-icon.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AboutSocialIconService', () => {
  let service: AboutSocialIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutSocialIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPath — known platforms', () => {
    it('returns a non-empty string for "linkedin"', () => {
      const path = service.getPath('linkedin');
      expect(typeof path).toBe('string');
      expect((path ?? '').length).toBeGreaterThan(0);
    });

    it('returns a non-empty string for "twitter"', () => {
      const path = service.getPath('twitter');
      expect(typeof path).toBe('string');
      expect((path ?? '').length).toBeGreaterThan(0);
    });

    it('returns a non-empty string for "dribbble"', () => {
      const path = service.getPath('dribbble');
      expect(typeof path).toBe('string');
      expect((path ?? '').length).toBeGreaterThan(0);
    });

    it('returns SVG path data that starts with an SVG command character', () => {
      const path = service.getPath('linkedin') ?? '';
      expect(/^[MLCZHVSQTAmhvlcsqtza]/.test(path)).toBe(true);
    });
  });

  describe('getPath — unknown platforms', () => {
    it('returns undefined for an unrecognised platform', () => {
      expect(service.getPath('instagram')).toBeUndefined();
    });

    it('returns undefined for an empty string', () => {
      expect(service.getPath('')).toBeUndefined();
    });

    it('returns undefined for prototype-polluting keys like "__proto__"', () => {
      expect(service.getPath('__proto__')).toBeUndefined();
    });

    it('returns undefined for "constructor"', () => {
      expect(service.getPath('constructor')).toBeUndefined();
    });
  });
});
