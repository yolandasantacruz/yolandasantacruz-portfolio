import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  input,
  afterNextRender,
  inject,
  PLATFORM_ID,
  NgZone,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { Testimonial } from '../../pages/about.types';

interface BlobShape {
  start: [number, number];
  curves: [number, number, number, number, number, number][];
}

const BLOB_SHAPES: BlobShape[] = [
  // Slide 0: Soft mint green shape
  {
    start: [100, 80],
    curves: [
      [150, 20, 250, 10, 350, 25],
      [450, 40, 550, 60, 650, 55],
      [750, 50, 900, 10, 1000, 20],
      [1100, 30, 1160, 80, 1180, 180],
      [1200, 280, 1190, 400, 1150, 480],
      [1110, 560, 1000, 590, 850, 585],
      [700, 580, 600, 520, 500, 520],
      [400, 520, 250, 570, 150, 550],
      [50, 530, 10, 400, 20, 280],
      [30, 160, 50, 140, 100, 80],
    ],
  },
  // Slide 1: Soft pale yellow shape
  {
    start: [140, 120],
    curves: [
      [240, 30, 320, 90, 420, 70],
      [520, 50, 620, 20, 720, 80],
      [820, 140, 920, 40, 1020, 60],
      [1120, 80, 1140, 140, 1150, 250],
      [1160, 360, 1110, 440, 1040, 500],
      [970, 560, 880, 530, 780, 560],
      [680, 590, 580, 550, 480, 560],
      [380, 570, 260, 590, 160, 530],
      [60, 470, 30, 370, 40, 270],
      [50, 170, 80, 140, 140, 120],
    ],
  },
  // Slide 2: Soft pale lavender shape (future 3rd testimonial)
  {
    start: [80, 100],
    curves: [
      [180, 60, 280, 40, 380, 60],
      [480, 80, 580, 40, 680, 50],
      [780, 60, 880, 20, 980, 80],
      [1080, 140, 1160, 100, 1170, 200],
      [1180, 300, 1150, 420, 1100, 490],
      [1050, 560, 950, 580, 850, 550],
      [750, 520, 650, 580, 550, 540],
      [450, 500, 320, 560, 200, 540],
      [80, 520, 20, 400, 30, 280],
      [40, 160, 50, 120, 80, 100],
    ],
  },
];

const BLOB_COLORS = [
  '#EDFBF9', // Soft mint green
  '#FFFCEB', // Soft pale yellow
  '#F4F0FC', // Soft pale lavender
];

const INITIAL_BLOB_PATH =
  'M 100 80 C 150 20, 250 10, 350 25 C 450 40, 550 60, 650 55 C 750 50, 900 10, 1000 20 C 1100 30, 1160 80, 1180 180 C 1200 280, 1190 400, 1150 480 C 1110 560, 1000 590, 850 585 C 700 580, 600 520, 500 520 C 400 520, 250 570, 150 550 C 50 530, 10 400, 20 280 C 30 160, 50 140, 100 80 Z';

@Component({
  selector: 'portfolio-about-testimonials',
  standalone: true,
  imports: [ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (items(); as testimonials) {
      <section class="premium-testimonial-section" portfolioScrollReveal>
        <div class="testimonial-card-wrapper">
          <svg viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="testimonial-wavy-bg">
            <path #wavyBlobPath class="wavy-card-path" [attr.d]="initialBlobPath" [style.fill]="currentBlobColor()" />
          </svg>
          <div class="testimonial-container">
            <div class="testimonial-header">
              <div class="active-author-info">
                <img [src]="testimonials[currentIndex()].avatar" [alt]="testimonials[currentIndex()].name" class="author-avatar" />
                <div class="author-details">
                  <span class="author-name">{{ testimonials[currentIndex()].name }}</span>
                  <span class="author-role">{{ testimonials[currentIndex()].role }}</span>
                </div>
              </div>

              <div class="testimonial-nav">
                <button class="quote-nav-btn" (click)="prevSlide()" [disabled]="currentIndex() === 0" aria-label="Previous testimonial">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span class="testimonial-counter">{{ currentIndex() + 1 }} / {{ testimonials.length }}</span>
                <button class="quote-nav-btn" (click)="nextSlide()" [disabled]="currentIndex() === testimonials.length - 1" aria-label="Next testimonial">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            <div class="testimonial-viewport">
              <div class="testimonial-track" [style.transform]="'translateX(-' + (currentIndex() * 100) + '%)'">
                @for (item of testimonials; track item.name) {
                  <div class="testimonial-slide">
                    <p class="testimonial-quote">"{{ item.quote }}"</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .premium-testimonial-section {
      margin-bottom: 12rem;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }

    .testimonial-card-wrapper {
      position: relative;
      padding: 160px;
      margin: 0 auto;
    }

    .testimonial-wavy-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }

    .wavy-card-path {
      transition: fill 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .testimonial-container {
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }

    .testimonial-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      padding-bottom: 2.5rem;
    }

    .active-author-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .author-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #5ed6cc;
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }

    .author-details {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .author-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111;
      letter-spacing: -0.01em;
    }

    .author-role {
      font-size: 0.9rem;
      color: #666;
    }

    .testimonial-nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .testimonial-counter {
      font-size: 1.1rem;
      font-weight: 600;
      color: #111;
      letter-spacing: 0.08em;
      min-width: 3rem;
      text-align: center;
    }

    .quote-nav-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.12);
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #333;
      transition: all 0.25s ease;
    }

    .quote-nav-btn:hover:not(:disabled) {
      border-color: #5ed6cc;
      background: #5ed6cc;
      color: #111;
      transform: scale(1.05);
    }

    .quote-nav-btn:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }

    .testimonial-viewport {
      overflow: hidden;
      width: 100%;
    }

    .testimonial-track {
      display: flex;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .testimonial-slide {
      min-width: 100%;
      box-sizing: border-box;
    }

    .testimonial-quote {
      font-size: 1.15rem;
      font-weight: 300;
      font-style: italic;
      line-height: 1.8;
      color: #111;
      margin: 0;
      letter-spacing: -0.01em;
    }

    @media (max-width: 1024px) {
      .testimonial-card-wrapper { padding: 100px 80px; }
    }

    @media (max-width: 768px) {
      .premium-testimonial-section { margin-bottom: 8rem; }
      .testimonial-card-wrapper { padding: 80px 40px; }
      .testimonial-header { flex-direction: column; gap: 2rem; align-items: flex-start; }
      .testimonial-nav { align-self: flex-end; }
      .testimonial-quote { font-size: 1rem; }
    }
  `
})
export class AboutTestimonialsComponent implements OnDestroy {
  @ViewChild('wavyBlobPath', { static: false }) blobPathElement?: ElementRef<SVGPathElement>;

  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private animFrameId?: number;

  items = input<Testimonial[] | undefined>();
  readonly initialBlobPath = INITIAL_BLOB_PATH;
  readonly currentIndex = signal(0);
  readonly currentBlobColor = computed(() => BLOB_COLORS[this.currentIndex() % BLOB_COLORS.length]);

  private currentShapeIndex = 0;
  private targetShapeIndex = 0;
  private morphStartTime = 0;
  private isMorphing = false;
  private readonly morphDuration = 800; // 800ms for a satisfying organic transformation

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.ngZone.runOutsideAngular(() => {
          this.startAnimationLoop();
        });
      }
    });
  }

  private startAnimationLoop(): void {
    const loop = () => {
      if (this.blobPathElement?.nativeElement) {
        const now = performance.now();
        const time = now * 0.0015;
        let baseShape: BlobShape;

        if (this.isMorphing) {
          const elapsed = now - this.morphStartTime;
          const progress = Math.min(elapsed / this.morphDuration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 4); // Quartic ease out

          const startShape = BLOB_SHAPES[this.currentShapeIndex];
          const endShape = BLOB_SHAPES[this.targetShapeIndex];

          baseShape = {
            start: [
              startShape.start[0] + (endShape.start[0] - startShape.start[0]) * easeProgress,
              startShape.start[1] + (endShape.start[1] - startShape.start[1]) * easeProgress,
            ],
            curves: startShape.curves.map((c, i) => {
              const targetC = endShape.curves[i];
              return [
                c[0] + (targetC[0] - c[0]) * easeProgress,
                c[1] + (targetC[1] - c[1]) * easeProgress,
                c[2] + (targetC[2] - c[2]) * easeProgress,
                c[3] + (targetC[3] - c[3]) * easeProgress,
                c[4] + (targetC[4] - c[4]) * easeProgress,
                c[5] + (targetC[5] - c[5]) * easeProgress,
              ] as [number, number, number, number, number, number];
            }),
          };

          if (progress === 1) {
            this.isMorphing = false;
            this.currentShapeIndex = this.targetShapeIndex;
          }
        } else {
          baseShape = BLOB_SHAPES[this.targetShapeIndex];
        }

        const startX = baseShape.start[0] + Math.sin(time + 9 * 0.8) * 18;
        const startY = baseShape.start[1] + Math.cos(time + 9 * 0.9) * 18;
        let d = `M ${startX.toFixed(1)} ${startY.toFixed(1)}`;

        for (let i = 0; i < baseShape.curves.length; i++) {
          const curve = baseShape.curves[i];
          const c1x = curve[0] + Math.sin(time + i * 0.8 + 0.3) * 14;
          const c1y = curve[1] + Math.cos(time + i * 0.9 + 0.3) * 14;
          const c2x = curve[2] + Math.sin(time + i * 0.8 + 0.6) * 14;
          const c2y = curve[3] + Math.cos(time + i * 0.9 + 0.6) * 14;
          const ex = curve[4] + Math.sin(time + i * 0.8) * 18;
          const ey = curve[5] + Math.cos(time + i * 0.9) * 18;
          d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
        }
        d += ' Z';

        this.blobPathElement.nativeElement.setAttribute('d', d);
      }
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  nextSlide(): void {
    const list = this.items();
    if (list && this.currentIndex() < list.length - 1) {
      this.currentIndex.update(v => v + 1);
      this.triggerMorph(this.currentIndex());
    }
  }

  prevSlide(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(v => v - 1);
      this.triggerMorph(this.currentIndex());
    }
  }

  private triggerMorph(newIndex: number): void {
    const nextShapeIndex = newIndex % BLOB_SHAPES.length;
    if (this.targetShapeIndex !== nextShapeIndex) {
      this.currentShapeIndex = this.targetShapeIndex;
      this.targetShapeIndex = nextShapeIndex;
      this.morphStartTime = performance.now();
      this.isMorphing = true;
    }
  }

  ngOnDestroy(): void {
    if (this.animFrameId !== undefined) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
