import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PublicationsData } from '../../pages/about.types';

@Component({
  selector: 'portfolio-about-publications',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as publications) {
      <section class="published-section">
        <div class="published-header">
          <span class="section-tag text-base font-bold">PUBLICATIONS</span>
          <h2 class="published-heading text-4xl">{{ publications.heading }}</h2>
        </div>

        @if (items().length > 0) {
          <div class="works-grid">
            @for (work of items(); track work.title) {
              <a [href]="work.url" target="_blank" rel="noopener noreferrer" class="work-card flex flex-col gap-6">
                <div class="work-thumb-box">
                  <img [ngSrc]="work.imageUrl" width="400" height="300" [alt]="work.title" class="work-thumb" />
                </div>
                <div class="work-info flex flex-col">
                  <h3 class="work-title text-lg font-semibold m-0">{{ work.title }}</h3>
                  <p class="work-desc text-base color-text-muted m-0">{{ work.description }}</p>
                </div>
              </a>
            }
          </div>

          @if (publications.moreArticlesUrl) {
            <div class="explore-more-container">
              <a [href]="publications.moreArticlesUrl" target="_blank" rel="noopener noreferrer" class="btn-link">
                {{ publications.moreArticlesLabel }}
              </a>
            </div>
          }
        }
      </section>
    }
  `,
  styles: `
    .published-section {
      margin-bottom: 16rem;
    }

    .section-tag {
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3b9f98;
      margin-bottom: 1rem;
      display: inline-block;
    }

    .published-heading {
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 6rem;
    }

    .works-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }

    .work-card {
      text-decoration: none;
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
      filter: brightness(1);
      transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .work-card:hover .work-thumb {
      filter: brightness(1.05);
      transform: scale(1.05);
    }

    @media (prefers-reduced-motion: reduce) {
      .work-thumb {
        transition: none !important;
        transform: none !important;
      }
    }



    .work-info {
      gap: 0.6rem;
    }

    .work-title {
      color: #111;
      line-height: 1.3;
    }

    .work-desc {
      line-height: 1.6;
    }



    .explore-more-container {
      display: flex;
      justify-content: center;
      margin-top: 5rem;
      grid-column: 1 / -1;
    }



    @media (max-width: 1024px) {
      .works-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .published-section { margin-bottom: 10rem; }
      .works-grid { grid-template-columns: 1fr; }
      .published-heading { font-size: 2rem; }
    }
  `
})
export class AboutPublicationsComponent {
  data = input<PublicationsData | undefined>();

  readonly items = computed(() => {
    return (this.data()?.items ?? []).map(item => ({
      ...item,
      imageUrl: item.imageUrl
    }));
  });
}
