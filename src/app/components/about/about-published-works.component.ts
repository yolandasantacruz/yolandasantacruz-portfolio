import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PublicationsData } from '../../pages/about.types';

@Component({
  selector: 'portfolio-about-published-works',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as publications) {
      <section class="published-section">
        <div class="published-header">
          <span class="section-tag">PUBLICATIONS</span>
          <h2 class="published-heading">{{ publications.heading }}</h2>
        </div>

        <div class="works-grid">
          @for (work of publications.items; track work.title) {
            <a [href]="work.url" target="_blank" rel="noopener noreferrer" class="work-card">
              <div class="work-thumb-box">
                <img [src]="work.imageUrl" [alt]="work.title" class="work-thumb" />
                <span class="work-badge">{{ work.tag }}</span>
              </div>
              <div class="work-info">
                <h3 class="work-title">{{ work.title }}</h3>
                <p class="work-desc">{{ work.description }}</p>
                <span class="work-arrow">Explore &rarr;</span>
              </div>
            </a>
          }
        </div>
      </section>
    }
  `,
  styles: `
    .published-section {
      margin-bottom: 8rem;
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

    .published-heading {
      font-size: 2.75rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 4rem;
    }

    .works-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }

    .work-card {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .work-card:hover {
      transform: translateY(-8px);
    }

    .work-thumb-box {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      border-radius: 12px;
      overflow: hidden;
      background: #f5f5f5;
    }

    .work-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .work-card:hover .work-thumb {
      transform: scale(1.05);
    }

    .work-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(255,255,255,0.9);
      padding: 0.4rem 0.8rem;
      border-radius: 100px;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #111;
      backdrop-filter: blur(4px);
    }

    .work-info {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .work-title {
      font-size: 1.4rem;
      font-weight: 600;
      color: #111;
      line-height: 1.3;
      margin: 0;
    }

    .work-desc {
      font-size: 1rem;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .work-arrow {
      font-size: 0.85rem;
      font-weight: 700;
      color: #3b9f98;
      margin-top: 0.5rem;
    }

    @media (max-width: 1024px) {
      .works-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .works-grid { grid-template-columns: 1fr; }
      .published-heading { font-size: 2rem; }
    }
  `
})
export class AboutPublishedWorksComponent {
  data = input<PublicationsData | undefined>();
}
