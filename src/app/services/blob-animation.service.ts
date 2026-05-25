import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { CatmullRomService } from '../components/about/catmull-rom.service';

// ---------------------------------------------------------------------------
// Blob shape data — the "motion design tokens" for the testimonial background.
// Each shape is defined by a set of control-point coordinates and their
// corresponding tangent vectors. These are consumed by CatmullRomService to
// generate smooth SVG paths.
// ---------------------------------------------------------------------------

const SHAPE_0_ENDPOINTS: [number, number][] = [
  [100, 80], [350, 25], [650, 55], [1000, 20],
  [1180, 180], [1150, 480], [850, 585], [500, 520],
  [150, 550], [20, 280],
];
const SHAPE_0_TANGENTS: [number, number][] = [
  [50, -60], [100, 15], [100, -5], [100, 10], [20, 100],
  [-40, 80], [-150, -5], [-100, 0], [-100, -20], [10, -120],
];

const SHAPE_1_ENDPOINTS: [number, number][] = [
  [120, 90], [360, 40], [660, 45], [980, 30],
  [1160, 160], [1140, 460], [860, 570], [520, 535],
  [170, 545], [30, 290],
];
const SHAPE_1_TANGENTS: [number, number][] = [
  [60, -40], [100, 0], [100, 5], [90, 5], [15, 80],
  [-30, 80], [-120, 0], [-100, -5], [-100, -10], [10, -100],
];

const SHAPE_2_ENDPOINTS: [number, number][] = [
  [90, 70], [340, 30], [640, 40], [960, 25],
  [1150, 190], [1130, 470], [840, 575], [510, 530],
  [160, 555], [25, 275],
];
const SHAPE_2_TANGENTS: [number, number][] = [
  [45, -50], [90, -10], [90, 5], [80, 5], [10, 75],
  [-35, 75], [-110, -5], [-90, 5], [-90, -10], [5, -90],
];

interface BlobDefinition {
  endpoints: [number, number][];
  tangents: [number, number][];
}

const BLOB_DEFINITIONS: BlobDefinition[] = [
  { endpoints: SHAPE_0_ENDPOINTS, tangents: SHAPE_0_TANGENTS },
  { endpoints: SHAPE_1_ENDPOINTS, tangents: SHAPE_1_TANGENTS },
  { endpoints: SHAPE_2_ENDPOINTS, tangents: SHAPE_2_TANGENTS },
];

const BLOB_COLORS: readonly string[] = [
  '#EDFBF9', // Soft mint green
  '#FFFCEB', // Soft pale yellow
  '#F4F0FC', // Soft pale lavender
] as const;

export const INITIAL_BLOB_PATH =
  'M 100 80 C 150 20, 250 10, 350 25 C 450 40, 550 60, 650 55 C 750 50, 900 10, 1000 20 C 1100 30, 1160 80, 1180 180 C 1200 280, 1190 400, 1150 480 C 1110 560, 1000 590, 850 585 C 700 580, 600 520, 500 520 C 400 520, 250 570, 150 550 C 50 530, 10 400, 20 280 C 30 160, 50 140, 100 80 Z';

/**
 * Owns the entire blob animation lifecycle for the testimonial section:
 * shape data, RAF loop, morph interpolation, and cleanup.
 *
 * Design-system analogy: this is the "animation prototype" component — the
 * testimonial card component links to it the same way a Figma frame links
 * to a Main Component for its motion behaviour.
 *
 * **Scope**: Component-level (`providers: [BlobAnimationService]` in the
 * consumer). This ensures a fresh instance — and RAF lifecycle — is created
 * and destroyed with each testimonials component instance.
 */
@Injectable()
export class BlobAnimationService implements OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly catmullRom = inject(CatmullRomService);

  private animFrameId?: number;
  private pathElement: SVGPathElement | null = null;

  private currentShapeIndex = 0;
  private targetShapeIndex = 0;
  private morphStartTime = 0;
  private isMorphing = false;
  private readonly morphDuration = 800; // ms — satisfying organic transformation

  /** The static starting path used before the first animation frame fires. */
  readonly initialBlobPath = INITIAL_BLOB_PATH;

  /**
   * Returns the fill color for a given testimonial index, wrapping around
   * the color palette so it is always in bounds.
   */
  getBlobColor(index: number): string {
    return BLOB_COLORS.at(index % BLOB_COLORS.length) ?? (BLOB_COLORS.at(0) ?? '#EDFBF9');
  }

  /**
   * Attaches the service to a live SVG path element and starts the RAF loop.
   * Must be called from within `afterNextRender` (browser-only context).
   */
  startLoop(pathElement: SVGPathElement): void {
    this.pathElement = pathElement;
    this.ngZone.runOutsideAngular(() => {
      this.animationLoop();
    });
  }

  /** Cancels the RAF loop and releases the DOM reference. */
  stopLoop(): void {
    if (this.animFrameId !== undefined) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = undefined;
    }
    this.pathElement = null;
  }

  /**
   * Triggers a morph transition to the shape corresponding to `newIndex`.
   * No-ops if the target shape is already the current one.
   */
  triggerMorph(newIndex: number): void {
    const nextShapeIndex = newIndex % BLOB_DEFINITIONS.length;
    if (this.targetShapeIndex !== nextShapeIndex) {
      this.currentShapeIndex = this.targetShapeIndex;
      this.targetShapeIndex = nextShapeIndex;
      this.morphStartTime = performance.now();
      this.isMorphing = true;
    }
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  private animationLoop(): void {
    const loop = () => {
      if (this.pathElement) {
        const now = performance.now();
        const time = now * 0.0015;

        let currentEndpoints: [number, number][];

        if (this.isMorphing) {
          const elapsed = now - this.morphStartTime;
          const progress = Math.min(elapsed / this.morphDuration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 4); // Quartic ease-out

          const startDef = BLOB_DEFINITIONS.at(this.currentShapeIndex) ?? BLOB_DEFINITIONS.at(0);
          const endDef = BLOB_DEFINITIONS.at(this.targetShapeIndex) ?? BLOB_DEFINITIONS.at(0);

          currentEndpoints = [];
          if (startDef && endDef) {
            for (let i = 0; i < startDef.endpoints.length; i++) {
              const sE = startDef.endpoints.at(i) ?? [0, 0];
              const eE = endDef.endpoints.at(i) ?? [0, 0];
              currentEndpoints.push([
                sE[0] + (eE[0] - sE[0]) * easeProgress,
                sE[1] + (eE[1] - sE[1]) * easeProgress,
              ]);
            }
          }

          if (progress === 1) {
            this.isMorphing = false;
            this.currentShapeIndex = this.targetShapeIndex;
          }
        } else {
          currentEndpoints =
            (BLOB_DEFINITIONS.at(this.targetShapeIndex) ?? BLOB_DEFINITIONS.at(0))?.endpoints ?? [];
        }

        // Gentle drift animation — 12px amplitude to prevent extreme stretching
        const animatedEndpoints: [number, number][] = currentEndpoints.map((ep, i) => [
          ep[0] + Math.sin(time + i * 0.8) * 12,
          ep[1] + Math.cos(time + i * 0.9) * 12,
        ]);

        // tension k=0.22 inflates the curve into a soft, bulbous water-bubble shape
        const d = this.catmullRom.generateCatmullRomPath(animatedEndpoints, 0.22);
        this.pathElement.setAttribute('d', d);
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }
}
