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
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Testimonial } from '../../pages/about.types';
import { BlobAnimationService } from '../../services/blob-animation.service';

@Component({
  selector: 'portfolio-about-testimonials',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BlobAnimationService],
  template: `
    @if (items(); as testimonials) {
      @if (currentTestimonial(); as activeTestimonial) {
        <section class="premium-testimonial-section">
          <div class="testimonial-card-wrapper">
            <svg viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="testimonial-wavy-bg">
              <path #wavyBlobPath class="wavy-card-path" [attr.d]="blobAnimationService.initialBlobPath" [style.fill]="currentBlobColor()" />
            </svg>
            <div class="testimonial-container">
              <div class="testimonial-header">
                <div class="active-author-info">
                  <img [src]="activeTestimonial.avatar" [alt]="activeTestimonial.name" class="author-avatar" />
                  <div class="author-details">
                    @if (activeTestimonial.profileUrl) {
                      <a [href]="activeTestimonial.profileUrl" target="_blank" rel="noopener noreferrer" class="author-link" [attr.aria-label]="'Visit ' + activeTestimonial.name + ' on LinkedIn'">
                        <span class="author-name">{{ activeTestimonial.name }}</span>
                        <svg class="lnk-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    } @else {
                      <span class="author-name">{{ activeTestimonial.name }}</span>
                    }
                    <span class="author-role">{{ activeTestimonial.role }}</span>
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

              <div class="testimonial-viewport" [style.height.px]="currentHeight()">
                <div class="testimonial-track" [style.transform]="'translateX(-' + (currentIndex() * 100) + '%)'">
                  @for (item of testimonials; track item.name) {
                    <div #slideElement class="testimonial-slide">
                      <p class="testimonial-quote">"{{ item.quote }}"</p>
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

    .author-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #111;
      transition: color 0.2s ease;
    }

    .author-link:hover {
      color: #3b9f98; /* Contrast Accent from design system */
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
      font-size: 1.25rem;
      font-weight: 700;
      color: inherit;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }

    .author-role {
      font-size: 1.2rem;
      color: #666;
    }

    .testimonial-nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .testimonial-counter {
      font-size: 1.2rem;
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
      transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .testimonial-track {
      display: flex;
      align-items: flex-start;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .testimonial-slide {
      min-width: 100%;
      box-sizing: border-box;
    }

    .testimonial-quote {
      font-family: var(--font-main);
      font-size: 1.2rem;
      font-weight: 400;
      font-style: normal;
      line-height: 1.8;
      max-width: 65ch;
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
      .testimonial-quote { font-size: 1.2rem; }
    }
  `
})
export class AboutTestimonialsComponent implements OnDestroy {
  @ViewChild('wavyBlobPath', { static: false }) blobPathElement?: ElementRef<SVGPathElement>;
  @ViewChildren('slideElement') slideElements?: QueryList<ElementRef<HTMLDivElement>>;

  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  readonly blobAnimationService = inject(BlobAnimationService);

  private resizeListener?: () => void;

  items = input<Testimonial[] | undefined>();
  readonly currentIndex = signal(0);

  readonly currentBlobColor = computed(() =>
    this.blobAnimationService.getBlobColor(this.currentIndex())
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
          this.blobAnimationService.startLoop(this.blobPathElement.nativeElement);
        }

        this.ngZone.run(() => {
          this.resizeListener = () => this.updateHeight();
          const win = this.document.defaultView;
          if (win) {
            win.addEventListener('resize', this.resizeListener);
          }
          this.updateHeight();
          setTimeout(() => this.updateHeight(), 0);
        });
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
      this.blobAnimationService.triggerMorph(this.currentIndex());
      this.updateHeight();
    }
  }

  prevSlide(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(v => v - 1);
      this.blobAnimationService.triggerMorph(this.currentIndex());
      this.updateHeight();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeListener && isPlatformBrowser(this.platformId)) {
      const win = this.document.defaultView;
      if (win) {
        win.removeEventListener('resize', this.resizeListener);
      }
    }
    // BlobAnimationService.ngOnDestroy() handles RAF cancellation automatically
    // as it is component-scoped and destroyed alongside this component.
  }
}
