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
      const pPrev = points.at(prevIdx);
      const pNext = points.at(nextIdx);
      if (!pPrev || !pNext) continue;

      const [prevX, prevY] = pPrev;
      const [nextX, nextY] = pNext;

      const tx = (nextX - prevX) * tension;
      const ty = (nextY - prevY) * tension;
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

    const startPt = points.at(0);
    if (!startPt) return '';
    const [startX, startY] = startPt;
    let d = `M ${startX.toFixed(1)} ${startY.toFixed(1)}`;

    for (let i = 0; i < n; i++) {
      const nextIdx = (i + 1) % n;
      const pCurrent = points.at(i);
      const pNext = points.at(nextIdx);
      const tCurrent = tangents.at(i);
      const tNext = tangents.at(nextIdx);

      if (!pCurrent || !pNext || !tCurrent || !tNext) continue;

      const [currX, currY] = pCurrent;
      const [nextX, nextY] = pNext;
      const [tCurrX, tCurrY] = tCurrent;
      const [tNextX, tNextY] = tNext;

      const c1x = currX + tCurrX;
      const c1y = currY + tCurrY;
      const c2x = nextX - tNextX;
      const c2y = nextY - tNextY;

      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${nextX.toFixed(1)} ${nextY.toFixed(1)}`;
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
