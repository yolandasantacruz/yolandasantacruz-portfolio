import { ChangeDetectionStrategy, Component, signal, input } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { Testimonial } from '../../pages/about.types';

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
            <path class="wavy-card-path" d="M 100 80 C 150 20, 250 10, 350 25 C 450 40, 550 60, 650 55 C 750 50, 900 10, 1000 20 C 1100 30, 1160 80, 1180 180 C 1200 280, 1190 400, 1150 480 C 1110 560, 1000 590, 850 585 C 700 580, 600 520, 500 520 C 400 520, 250 570, 150 550 C 50 530, 10 400, 20 280 C 30 160, 50 140, 100 80 Z" />
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
      fill: #EDFBF9;
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
export class AboutTestimonialsComponent {
  items = input<Testimonial[] | undefined>();
  currentIndex = signal(0);

  nextSlide() {
    const list = this.items();
    if (list && this.currentIndex() < list.length - 1) {
      this.currentIndex.update(v => v + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(v => v - 1);
    }
  }
}
