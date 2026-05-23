import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CatmullRomService {
  /**
   * Computes the tangents for a closed set of 2D points using Catmull-Rom spline logic.
   *
   * @param points An array of 2D coordinates representing the vertices of a closed shape.
   * @param tension The tension factor (k) which influences the curliness/tightness of the curve.
   *                A value of 0.22 is typically used in the design system to inflate the curve.
   * @returns An array of tangent vectors matching the input points.
   */
  computeClosedTangents(points: [number, number][], tension: number): [number, number][] {
    const n = points.length;
    if (n === 0) return [];

    const tangents: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const prevIdx = (i - 1 + n) % n;
      const nextIdx = (i + 1) % n;
      const pPrev = points[prevIdx];
      const pNext = points[nextIdx];

      const tx = (pNext[0] - pPrev[0]) * tension;
      const ty = (pNext[1] - pPrev[1]) * tension;
      tangents.push([tx, ty]);
    }
    return tangents;
  }

  /**
   * Generates a closed SVG path string ("d" attribute) using cubic Bezier curves defined by
   * endpoints and their tangent vectors.
   *
   * @param points An array of 2D coordinates.
   * @param tangents An array of tangent vectors corresponding to each point.
   * @returns A string representing the SVG path.
   */
  generateClosedPath(points: [number, number][], tangents: [number, number][]): string {
    const n = points.length;
    if (n === 0) return '';

    const startPt = points[0];
    let d = `M ${startPt[0].toFixed(1)} ${startPt[1].toFixed(1)}`;

    for (let i = 0; i < n; i++) {
      const nextIdx = (i + 1) % n;
      const pCurrent = points[i];
      const pNext = points[nextIdx];
      const tCurrent = tangents[i];
      const tNext = tangents[nextIdx];

      const c1x = pCurrent[0] + tCurrent[0];
      const c1y = pCurrent[1] + tCurrent[1];
      const c2x = pNext[0] - tNext[0];
      const c2y = pNext[1] - tNext[1];

      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${pNext[0].toFixed(1)} ${pNext[1].toFixed(1)}`;
    }
    d += ' Z';
    return d;
  }

  /**
   * Computes tangents and generates the closed SVG path string in a single operation.
   *
   * @param points An array of 2D coordinates.
   * @param tension The tension factor (k).
   * @returns A string representing the SVG path.
   */
  generateCatmullRomPath(points: [number, number][], tension: number): string {
    const tangents = this.computeClosedTangents(points, tension);
    return this.generateClosedPath(points, tangents);
  }
}
