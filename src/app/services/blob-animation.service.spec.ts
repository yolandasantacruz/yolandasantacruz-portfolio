import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { BlobAnimationService, INITIAL_BLOB_PATH } from './blob-animation.service';
import { CatmullRomService } from '../components/about/catmull-rom.service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('BlobAnimationService', () => {
  let service: BlobAnimationService;
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock requestAnimationFrame to prevent real RAF scheduling in jsdom
    rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(42);
    cafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [BlobAnimationService, CatmullRomService],
    });
    service = TestBed.inject(BlobAnimationService);
  });

  afterEach(() => {
    rafSpy.mockRestore();
    cafSpy.mockRestore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialBlobPath', () => {
    it('exposes the static initial path string', () => {
      expect(service.initialBlobPath).toBe(INITIAL_BLOB_PATH);
      expect(service.initialBlobPath.startsWith('M')).toBe(true);
    });
  });

  describe('getBlobColor', () => {
    it('returns the first color for index 0', () => {
      const color = service.getBlobColor(0);
      expect(color).toBe('#F3FCFB');
    });

    it('returns the second color for index 1', () => {
      const color = service.getBlobColor(1);
      expect(color).toBe('#FFFDF2');
    });

    it('returns the third color for index 2', () => {
      const color = service.getBlobColor(2);
      expect(color).toBe('#F9F7FD');
    });

    it('wraps around — index 3 maps back to the first color', () => {
      expect(service.getBlobColor(3)).toBe(service.getBlobColor(0));
    });

    it('wraps around — index 5 maps to the third color (5 % 3 = 2)', () => {
      expect(service.getBlobColor(5)).toBe(service.getBlobColor(2));
    });
  });

  describe('startLoop', () => {
    it('starts the RAF loop when given a path element', () => {
      const mockPath = { setAttribute: vi.fn() } as unknown as SVGPathElement;
      service.startLoop(mockPath);
      expect(rafSpy).toHaveBeenCalled();
    });

    it('runs outside Angular zone to avoid triggering change detection', () => {
      const ngZone = TestBed.inject(NgZone);
      const runOutsideSpy = vi.spyOn(ngZone, 'runOutsideAngular');
      const mockPath = { setAttribute: vi.fn() } as unknown as SVGPathElement;
      service.startLoop(mockPath);
      expect(runOutsideSpy).toHaveBeenCalled();
    });
  });

  describe('stopLoop', () => {
    it('cancels the animation frame and clears the frame ID', () => {
      const mockPath = { setAttribute: vi.fn() } as unknown as SVGPathElement;
      service.startLoop(mockPath);
      service.stopLoop();
      expect(cafSpy).toHaveBeenCalledWith(42);
    });

    it('is safe to call multiple times without throwing', () => {
      expect(() => {
        service.stopLoop();
        service.stopLoop();
      }).not.toThrow();
    });
  });

  describe('triggerMorph', () => {
    it('sets isMorphing when called with a new shape index', () => {
      // Access private state via type cast for white-box testing of morph trigger
      const svc = service as unknown as { isMorphing: boolean; targetShapeIndex: number };
      expect(svc.isMorphing).toBe(false);

      service.triggerMorph(1);
      expect(svc.isMorphing).toBe(true);
      expect(svc.targetShapeIndex).toBe(1);
    });

    it('does not restart morphing when called with the same index', () => {
      const svc = service as unknown as { isMorphing: boolean; morphStartTime: number };
      service.triggerMorph(0); // already at 0 — no-op
      expect(svc.isMorphing).toBe(false);
    });

    it('wraps shape index using modulo (index 3 → shape 0)', () => {
      const svc = service as unknown as { targetShapeIndex: number };
      service.triggerMorph(1); // move away from 0 first
      service.triggerMorph(3); // 3 % 3 === 0
      expect(svc.targetShapeIndex).toBe(0);
    });
  });

  describe('ngOnDestroy', () => {
    it('calls stopLoop on destroy', () => {
      const stopSpy = vi.spyOn(service, 'stopLoop');
      service.ngOnDestroy();
      expect(stopSpy).toHaveBeenCalled();
    });
  });
});
