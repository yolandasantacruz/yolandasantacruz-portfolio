import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { TestimonialBackgroundAnimationService, INITIAL_SHAPE_PATH } from './about-testimonial-background-animation.service';
import { CatmullRomService } from './catmull-rom.service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('TestimonialBackgroundAnimationService', () => {
  let service: TestimonialBackgroundAnimationService;
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock requestAnimationFrame to prevent real RAF scheduling in jsdom
    rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(42);
    cafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [TestimonialBackgroundAnimationService, CatmullRomService],
    });
    service = TestBed.inject(TestimonialBackgroundAnimationService);
  });

  afterEach(() => {
    rafSpy.mockRestore();
    cafSpy.mockRestore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialShapePath', () => {
    it('exposes the static initial path string', () => {
      expect(service.initialShapePath).toBe(INITIAL_SHAPE_PATH);
      expect(service.initialShapePath.startsWith('M')).toBe(true);
    });
  });

  describe('getShapeColor', () => {
    it('returns the first color for index 0', () => {
      const color = service.getShapeColor(0);
      expect(color).toBe('var(--color-shape-mint)');
    });

    it('returns the second color for index 1', () => {
      const color = service.getShapeColor(1);
      expect(color).toBe('var(--color-shape-yellow)');
    });

    it('returns the third color for index 2', () => {
      const color = service.getShapeColor(2);
      expect(color).toBe('var(--color-shape-lavender)');
    });

    it('wraps around — index 3 maps back to the first color', () => {
      expect(service.getShapeColor(3)).toBe(service.getShapeColor(0));
    });

    it('wraps around — index 5 maps to the third color (5 % 3 = 2)', () => {
      expect(service.getShapeColor(5)).toBe(service.getShapeColor(2));
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
