import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TimelineData } from '../../pages/about.types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'portfolio-about-timeline',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as timeline) {
      <section class="timeline-section">
        <div class="timeline-header-grid">
          <div class="header-left">
            <span class="section-tag text-base font-bold">Career Overview</span>
            <h2 class="timeline-heading text-4xl m-0">{{ timeline.heading }}</h2>
          </div>
          <div class="header-right flex justify-end">
            <a routerLink="/resume" class="btn-blob download-btn">View My Resume</a>
          </div>
        </div>

        <div class="timeline-positions-container flex gap-16 relative">
          <div class="positions-col left-col flex flex-col gap-12">
            @for (item of leftTimelineItems(); track item.company) {
              <div class="position-item flex gap-6 items-start">
                <div class="position-logo-box flex items-center justify-center" [class.has-text-logo]="!isImagePath(item.logo)">
                  @if (isImagePath(item.logo)) {
                    <img [ngSrc]="item.logo" width="72" height="72" [alt]="item.company + ' logo'" class="logo-image w-full" />
                  } @else {
                    <span class="logo-text">{{ item.logo }}</span>
                  }
                </div>
                <div class="position-copy flex flex-col">
                  <span class="position-period text-base font-bold">{{ item.period }}</span>
                  <h3 class="position-role text-md font-bold m-0">{{ item.role }}</h3>
                  <span class="position-company text-base">{{ item.company }}</span>
                </div>
              </div>
            }
          </div>

          <div class="positions-col right-col flex flex-col gap-12">
            @for (item of rightTimelineItems(); track item.company) {
              <div class="position-item flex gap-6 items-start">
                <div class="position-logo-box flex items-center justify-center" [class.has-text-logo]="!isImagePath(item.logo)">
                  @if (isImagePath(item.logo)) {
                    <img [ngSrc]="item.logo" width="72" height="72" [alt]="item.company + ' logo'" class="logo-image w-full" />
                  } @else {
                    <span class="logo-text">{{ item.logo }}</span>
                  }
                </div>
                <div class="position-copy flex flex-col">
                  <span class="position-period text-base font-bold">{{ item.period }}</span>
                  <h3 class="position-role text-md font-bold m-0">{{ item.role }}</h3>
                  <span class="position-company text-base">{{ item.company }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .timeline-section {
      margin-bottom: 12rem;
    }

    .timeline-header-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 4rem;
      margin-bottom: 6rem;
      align-items: end;
    }

    .section-tag {
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3b9f98;
      margin-bottom: 1rem;
      display: inline-block;
    }

    .timeline-heading {
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      line-height: 1.2;
    }

    .timeline-positions-container {
      position: relative;
    }

    .positions-col {
      flex: 1;
    }

    .position-logo-box {
      width: 72px;
      height: 72px;
      background: #ffffff;
      border: 1px solid rgba(59, 159, 152, 0.2);
      border-radius: 16px;
      flex-shrink: 0;
      overflow: hidden;
      box-sizing: border-box;
    }

    .position-logo-box.has-text-logo {
      background: #111;
      color: #fff;
      border: none;
      font-weight: 800;
      font-size: 1.1rem;
    }

    .logo-text {
      text-transform: uppercase;
    }

    .logo-image {
      height: 100%;
      object-fit: contain;
      padding: 12px;
      box-sizing: border-box;
    }

    .position-copy {
      gap: 0.3rem;
    }

    .position-period {
      color: #3b9f98;
      letter-spacing: 0.05em;
    }

    .position-role {
      font-family: var(--font-header);
      color: #111;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }

    .position-company {
      color: #888;
    }

    @media (max-width: 1024px) {
      .timeline-header-grid { grid-template-columns: 1fr; gap: 2rem;  }
      .header-right { justify-content: flex-start; }
    }

    @media (max-width: 768px) {
      .timeline-positions-container { flex-direction: column; gap: 3rem; }
      .timeline-heading { font-size: 2rem; }
    }
  `
})
export class AboutTimelineComponent {
  data = input<TimelineData | undefined>();
 
  leftTimelineItems = computed(() => {
    const items = this.data()?.items || [];
    return items.slice(0, Math.ceil(items.length / 2)).map(item => ({
      ...item,
      logo: item.logo
    }));
  });
 
  rightTimelineItems = computed(() => {
    const items = this.data()?.items || [];
    return items.slice(Math.ceil(items.length / 2)).map(item => ({
      ...item,
      logo: item.logo
    }));
  });
 
  isImagePath(logo: string): boolean {
    if (!logo) return false;
    return logo.startsWith('/') || logo.endsWith('.png') || logo.endsWith('.svg') || logo.endsWith('.jpg') || logo.endsWith('.jpeg') || logo.endsWith('.webp');
  }
}

