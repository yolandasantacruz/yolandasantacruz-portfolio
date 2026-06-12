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
  ViewChildren,
  QueryList,
  linkedSignal,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Testimonial } from '../../models/about.types';
import { TestimonialBackgroundAnimationService } from './about-testimonial-background-animation.service';

@Component({
  selector: 'portfolio-about-testimonials',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TestimonialBackgroundAnimationService],
  template: `
    @if (items(); as testimonials) {
      @if (currentTestimonial(); as activeTestimonial) {
        <section class="premium-testimonial-section">
          <div class="testimonial-card-wrapper" [style.--testimonial-shadow-color]="currentBlobColor()">
            <svg 
              viewBox="0 0 1200 600" 
              preserveAspectRatio="none" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              class="testimonial-wavy-bg">
              <path #wavyBlobPath class="wavy-card-path" [attr.d]="testimonialBackgroundAnimationService.initialShapePath" [style.fill]="currentBlobColor()" />
            </svg>
            <div class="testimonial-container flex flex-col">
              <div class="testimonial-header flex items-start justify-between">
                <div class="active-author-info flex items-start gap-6">
                  @if (avatarError()) {
                    <div class="author-avatar-fallback flex items-center justify-center font-normal text-md">
                      {{ getInitials(activeTestimonial.name) }}
                    </div>
                  } @else {
                    <img [ngSrc]="activeTestimonial.avatar" width="64" height="64" [alt]="activeTestimonial.name" class="author-avatar" (error)="avatarError.set(true)" />
                  }
                  <div class="author-details flex flex-col">
                    @if (activeTestimonial.profileUrl) {
                      <a [href]="activeTestimonial.profileUrl" target="_blank" rel="noopener noreferrer" class="author-link" [attr.aria-label]="'Visit ' + activeTestimonial.name + ' on LinkedIn'">
                        <span class="author-name text-md font-normal">{{ activeTestimonial.name }}</span>
                        <svg class="lnk-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    } @else {
                      <span class="author-name text-md font-normal">{{ activeTestimonial.name }}</span>
                    }
                    <span class="author-role text-base color-text-muted">{{ activeTestimonial.role }}</span>
                  </div>
                </div>

                <div class="testimonial-nav flex items-center">
                  <button class="quote-nav-btn flex items-center justify-center" (click)="prevSlide()" [disabled]="currentIndex() === 0" aria-label="Previous testimonial">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="testimonial-counter text-base font-bold color-text text-center">{{ currentIndex() + 1 }} / {{ testimonials.length }}</span>
                  <button class="quote-nav-btn flex items-center justify-center" (click)="nextSlide()" [disabled]="currentIndex() === testimonials.length - 1" aria-label="Next testimonial">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>

              <div class="testimonial-viewport" [style.height.px]="currentHeight()">
                <div class="testimonial-track flex items-start" [style.transform]="'translateX(-' + (currentIndex() * 100) + '%)'">
                  @for (item of testimonials; track item.name; let i = $index) {
                    <div #slideElement class="testimonial-slide" [attr.aria-hidden]="i !== currentIndex() ? 'true' : null">
                      <p class="testimonial-quote text-base font-normal color-text m-0">"{{ item.quote }}"</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      }
    }
  `,
  styles: `
    .premium-testimonial-section {
      margin-bottom: 18rem;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }

    .testimonial-card-wrapper {
      position: relative;
      padding: 160px;
      margin: 0 auto;
    }

    .testimonial-card-wrapper::before,
    .testimonial-card-wrapper::after {
      content: '';
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(50px);
      will-change: transform;
      opacity: 0.8;
      z-index: -2;
    }

    .testimonial-card-wrapper::before {
      background: color-mix(in srgb, var(--color-primary) 30%, transparent);
      bottom: -20px;
      right: -20px;
    }

    .testimonial-card-wrapper::after {
      background: var(--testimonial-shadow-color, rgba(0, 162, 154, 0.3));
      top: -20px;
      left: -20px;
      transition: --testimonial-shadow-color 0.8s cubic-bezier(0.25, 1, 0.5, 1);
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
      gap: 3.5rem;
    }

    .author-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-accent);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }

    .author-avatar-fallback {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2px solid var(--color-accent);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
      background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
      color: var(--color-bg);
      font-family: var(--font-header);
      letter-spacing: -0.02em;
      user-select: none;
    }

    .author-details {
      gap: 0.3rem;
      min-height: 90px;
    }

    .author-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--color-text);
      transition: color 0.2s ease;
    }

    .author-link:hover {
      color: var(--color-primary); /* Contrast Accent from design system */
    }

    .lnk-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    .author-link:hover .lnk-icon {
      opacity: 1;
    }

    .author-name {
      font-family: var(--font-header);
      color: inherit;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }

    .testimonial-nav {
      gap: 1.25rem;
    }

    .testimonial-counter {
      letter-spacing: 0.08em;
      min-width: 3rem;
    }

    .quote-nav-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.12);
      background: transparent;
      cursor: pointer;
      color: var(--color-text);
      transition: all 0.25s ease;
    }

    .quote-nav-btn:hover:not(:disabled) {
      border-color: var(--color-accent);
      background: var(--color-accent);
      color: var(--color-text);
      transform: scale(1.05);
    }

    .quote-nav-btn:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }

    .testimonial-viewport {
      overflow: hidden;
      width: 100%;
      transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .testimonial-track {
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .testimonial-slide {
      min-width: 100%;
      box-sizing: border-box;
    }

    .testimonial-quote {
      font-family: var(--font-main);
      font-style: normal;
      line-height: 1.8;
      max-width: 65ch;
      letter-spacing: -0.01em;
    }

    @media (max-width: 1024px) {
      .testimonial-card-wrapper { padding: 100px 80px; }
    }

    @media (max-width: 768px) {
      .premium-testimonial-section { margin-bottom: 12rem; }
      .testimonial-card-wrapper { padding: 80px 40px; }
      .testimonial-header { flex-direction: column; gap: 2rem; align-items: flex-start; }
      .testimonial-nav { align-self: flex-end; }
      .testimonial-quote { font-size: var(--text-base); }
      .author-details {
        min-height: 150px;
      }
    }
  `
})
export class AboutTestimonialsComponent implements OnDestroy {
  @ViewChild('wavyBlobPath', { static: false }) blobPathElement?: ElementRef<SVGPathElement>;
  @ViewChildren('slideElement') slideElements?: QueryList<ElementRef<HTMLDivElement>>;

  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  readonly testimonialBackgroundAnimationService = inject(TestimonialBackgroundAnimationService);

  private resizeObserver?: ResizeObserver;

  items = input<Testimonial[] | undefined>();
  readonly currentIndex = signal(0);

  readonly avatarError = linkedSignal({
    source: () => this.currentIndex(),
    computation: () => false
  });

  readonly currentBlobColor = computed(() =>
    this.testimonialBackgroundAnimationService.getShapeColor(this.currentIndex())
  );

  readonly currentTestimonial = computed(() => {
    const list = this.items();
    return list ? (list.at(this.currentIndex()) ?? null) : null;
  });

  readonly currentHeight = signal<number | undefined>(undefined);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.blobPathElement?.nativeElement) {
          this.testimonialBackgroundAnimationService.startLoop(this.blobPathElement.nativeElement);
        }

        this.ngZone.runOutsideAngular(() => {
          if (typeof globalThis.ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => {
              this.ngZone.run(() => this.updateHeight());
            });

            this.slideElements?.forEach(slide => {
              this.resizeObserver?.observe(slide.nativeElement);
            });

            // Re-observe if the list changes
            this.slideElements?.changes.subscribe(() => {
              this.resizeObserver?.disconnect();
              this.slideElements?.forEach(slide => {
                this.resizeObserver?.observe(slide.nativeElement);
              });
              this.ngZone.run(() => this.updateHeight());
            });
          }
        });

        // Trigger initial height calculation
        this.updateHeight();
      }
    });
  }

  updateHeight(): void {
    if (isPlatformBrowser(this.platformId) && this.slideElements) {
      const slides = this.slideElements.toArray();
      const activeIndex = this.currentIndex();
      const activeSlide = slides.at(activeIndex);
      if (activeSlide) {
        this.currentHeight.set(activeSlide.nativeElement.offsetHeight);
      }
    }
  }

  nextSlide(): void {
    const list = this.items();
    if (list && this.currentIndex() < list.length - 1) {
      this.currentIndex.update(v => v + 1);
      this.testimonialBackgroundAnimationService.triggerMorph(this.currentIndex());
      this.updateHeight();
    }
  }

  prevSlide(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(v => v - 1);
      this.testimonialBackgroundAnimationService.triggerMorph(this.currentIndex());
      this.updateHeight();
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const first = parts.at(0)?.charAt(0) ?? '';
      const last = parts.at(-1)?.charAt(0) ?? '';
      return (first + last).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    // TestimonialBackgroundAnimationService.ngOnDestroy() handles RAF cancellation automatically
    // as it is component-scoped and destroyed alongside this component.
  }
}

