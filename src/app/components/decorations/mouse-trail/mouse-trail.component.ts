import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, PLATFORM_ID, ViewChild, inject, afterNextRender } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { MouseTrailService } from './mouse-trail.service';

/**
 * @component MouseTrailComponent
 * @description Angular wrapper for the WebGL Mouse Trail Shader.
 * Follows SRP by delegating rendering and physics to MouseTrailEngine.
 */
@Component({
  selector: 'portfolio-mouse-trail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mouse-trail" aria-hidden="true">
      <canvas #shaderCanvas class="shader-canvas"></canvas>
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: fixed;
      pointer-events: none;
      z-index: 999999;
      inset: 0;
    }

    .mouse-trail {
      position: fixed;
      inset: 0;
      z-index: 999999;
      overflow: hidden;
      pointer-events: none;
      background: transparent !important;
    }

    .shader-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
      mix-blend-mode: multiply;
      opacity: 0.50;
    }
  `
})
export class MouseTrailComponent implements OnDestroy {
  @ViewChild('shaderCanvas', { static: true }) shaderCanvas!: ElementRef<HTMLCanvasElement>;

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private document = inject(DOCUMENT);
  private mouseTrailService = inject(MouseTrailService);
  private resizeListener?: () => void;

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.initEngine();
      }
    });
  }

  private initEngine() {
    const canvas = this.shaderCanvas?.nativeElement;
    const win = this.document.defaultView;
    if (!canvas || !win) return;

    this.mouseTrailService.init(canvas);

    this.setupEventListeners(win);
    this.handleResize(win);
  }

  private setupEventListeners(win: Window) {
    this.ngZone.runOutsideAngular(() => {
      win.addEventListener('mousemove', (e: MouseEvent) => {
        this.mouseTrailService.setMousePosition(e.clientX, e.clientY);
      }, { passive: true });

      this.resizeListener = () => this.handleResize(win);
      win.addEventListener('resize', this.resizeListener);
    });
  }

  private handleResize(win: Window) {
    const pixelRatio = Math.min(win.devicePixelRatio || 1, 1.25);
    this.mouseTrailService.resize(win.innerWidth, win.innerHeight, pixelRatio);
  }

  ngOnDestroy() {
    this.mouseTrailService.destroy();
    const win = this.document.defaultView;
    if (win && this.resizeListener) {
      win.removeEventListener('resize', this.resizeListener);
    }
  }
}
