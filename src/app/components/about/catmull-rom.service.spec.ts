import { TestBed } from '@angular/core/testing';
import { CatmullRomService } from './catmull-rom.service';

describe('CatmullRomService', () => {
  let service: CatmullRomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatmullRomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('computeClosedTangents', () => {
    it('should return empty array for empty inputs', () => {
      expect(service.computeClosedTangents([], 0.22)).toEqual([]);
    });

    it('should compute closed tangents based on neighbor points', () => {
      // 4 points forming a unit square:
      // P0(0,0), P1(1,0), P2(1,1), P3(0,1)
      const points: [number, number][] = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ];
      const tension = 0.5;

      const expectedTangents: [number, number][] = [
        [0.5, -0.5],
        [0.5, 0.5],
        [-0.5, 0.5],
        [-0.5, -0.5],
      ];

      const computed = service.computeClosedTangents(points, tension);
      expect(computed).toEqual(expectedTangents);
    });

    it('should scale tangents proportionally with tension', () => {
      const points: [number, number][] = [
        [0, 0],
        [10, 0],
        [10, 10],
      ];
      const k1 = 0.22;
      const k2 = 0.44;

      const tangents1 = service.computeClosedTangents(points, k1);
      const tangents2 = service.computeClosedTangents(points, k2);

      for (let i = 0; i < points.length; i++) {
        expect(tangents2[i][0]).toBeCloseTo(tangents1[i][0] * 2, 5);
        expect(tangents2[i][1]).toBeCloseTo(tangents1[i][1] * 2, 5);
      }
    });
  });

  describe('generateClosedPath', () => {
    it('should return empty string for empty inputs', () => {
      expect(service.generateClosedPath([], [])).toBe('');
    });

    it('should construct SVG path data string with correct format', () => {
      const points: [number, number][] = [
        [10, 20],
        [30, 40],
      ];
      const tangents: [number, number][] = [
        [1, 2],
        [-3, -4],
      ];

      const expectedPath = 'M 10.0 20.0 C 11.0 22.0, 33.0 44.0, 30.0 40.0 C 27.0 36.0, 9.0 18.0, 10.0 20.0 Z';

      const path = service.generateClosedPath(points, tangents);
      expect(path).toBe(expectedPath);
    });
  });

  describe('generateCatmullRomPath', () => {
    it('should generate path matching combined operations', () => {
      const points: [number, number][] = [
        [100, 80],
        [350, 25],
        [650, 55],
      ];
      const tension = 0.22;

      const pathDirect = service.generateCatmullRomPath(points, tension);
      const computedTangents = service.computeClosedTangents(points, tension);
      const pathCombined = service.generateClosedPath(points, computedTangents);

      expect(pathDirect).toBe(pathCombined);
    });
  });
});
