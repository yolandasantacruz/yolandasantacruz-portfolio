import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TimelineData } from '../../pages/about.types';

@Component({
  selector: 'portfolio-about-timeline',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as timeline) {
      <section class="timeline-section">
        <div class="timeline-header-grid">
          <div class="header-left">
            <span class="section-tag">TRACK RECORD</span>
            <h2 class="timeline-heading">{{ timeline.heading }}</h2>
          </div>
          <div class="header-right">
            <p class="timeline-subhead">{{ timeline.subhead }}</p>
          </div>
        </div>

        <div class="timeline-positions-container">
          <div class="positions-col left-col">
            @for (item of leftTimelineItems(); track item.company) {
              <div class="position-item">
                <div class="position-logo-box" [class.has-text-logo]="!isImagePath(item.logo)">
                  @if (isImagePath(item.logo)) {
                    <img [src]="item.logo" [alt]="item.company + ' logo'" class="logo-image" />
                  } @else {
                    <span class="logo-text">{{ item.logo }}</span>
                  }
                </div>
                <div class="position-copy">
                  <span class="position-period">{{ item.period }}</span>
                  <h3 class="position-role">{{ item.role }}</h3>
                  <span class="position-loc">{{ item.company }} · {{ item.location }}</span>
                </div>
              </div>
            }
          </div>

          <div class="positions-divider" aria-hidden="true"></div>

          <div class="positions-col right-col">
            @for (item of rightTimelineItems(); track item.company) {
              <div class="position-item">
                <div class="position-logo-box" [class.has-text-logo]="!isImagePath(item.logo)">
                  @if (isImagePath(item.logo)) {
                    <img [src]="item.logo" [alt]="item.company + ' logo'" class="logo-image" />
                  } @else {
                    <span class="logo-text">{{ item.logo }}</span>
                  }
                </div>
                <div class="position-copy">
                  <span class="position-period">{{ item.period }}</span>
                  <h3 class="position-role">{{ item.role }}</h3>
                  <span class="position-loc">{{ item.company }} · {{ item.location }}</span>
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
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3b9f98;
      margin-bottom: 1rem;
      display: inline-block;
    }

    .timeline-heading {
      font-size: 2.75rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin: 0;
      line-height: 1.2;
    }

    .timeline-subhead {
      font-size: 1.1rem;
      line-height: 1.7;
      color: #666;
      font-weight: 300;
      margin: 0;
    }

    .timeline-positions-container {
      display: flex;
      gap: 4rem;
      position: relative;
    }

    .positions-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .positions-divider {
      width: 1px;
      background: rgba(0,0,0,0.08);
    }

    .position-item {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
    }

    .position-logo-box {
      width: 72px;
      height: 72px;
      background: #ffffff;
      border: 1px solid rgba(59, 159, 152, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
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
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 12px;
      box-sizing: border-box;
    }

    .position-copy {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .position-period {
      font-size: 0.75rem;
      font-weight: 700;
      color: #3b9f98;
      letter-spacing: 0.05em;
    }

    .position-role {
      font-family: var(--font-header);
      font-size: 1.25rem;
      font-weight: 700;
      color: #111;
      margin: 0;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }

    .position-loc {
      font-size: 0.85rem;
      color: #888;
    }

    @media (max-width: 1024px) {
      .timeline-header-grid { grid-template-columns: 1fr; gap: 2rem; }
    }

    @media (max-width: 768px) {
      .timeline-positions-container { flex-direction: column; gap: 3rem; }
      .positions-divider { display: none; }
      .timeline-heading { font-size: 2rem; }
    }
  `
})
export class AboutTimelineComponent {
  data = input<TimelineData | undefined>();

  leftTimelineItems = computed(() => {
    const items = this.data()?.items || [];
    return items.slice(0, Math.ceil(items.length / 2));
  });

  rightTimelineItems = computed(() => {
    const items = this.data()?.items || [];
    return items.slice(Math.ceil(items.length / 2));
  });

  isImagePath(logo: string): boolean {
    return logo.startsWith('/') || logo.endsWith('.png') || logo.endsWith('.svg') || logo.endsWith('.jpg') || logo.endsWith('.jpeg');
  }
}
