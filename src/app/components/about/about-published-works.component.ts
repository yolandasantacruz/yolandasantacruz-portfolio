import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, linkedSignal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { PublicationsData, PublishedWork } from '../../pages/about.types';
import { PublicationsService } from '../../services/publications.service';

@Component({
  selector: 'portfolio-about-published-works',
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

        <div class="works-grid">
          @for (work of items(); track work.title) {
            <a [href]="work.url" target="_blank" rel="noopener noreferrer" class="work-card flex flex-col gap-6">
              <div class="work-thumb-box">
                <img [ngSrc]="work.imageUrl" width="400" height="300" [alt]="work.title" class="work-thumb" />
                <span class="work-badge">{{ work.tag }}</span>
              </div>
              <div class="work-info flex flex-col">
                <h3 class="work-title text-lg font-semibold m-0">{{ work.title }}</h3>
                <p class="work-desc text-base color-text-muted m-0">{{ work.description }}</p>
                <span class="work-arrow text-base font-bold">Explore &rarr;</span>
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
      margin-bottom: 4rem;
    }

    .works-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }

    .work-card {
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
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #111;
      backdrop-filter: blur(4px);
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

    .work-arrow {
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
export class AboutPublishedWorksComponent implements OnInit {
  private publicationsService = inject(PublicationsService);
  private destroyRef = inject(DestroyRef);

  data = input<PublicationsData | undefined>();

  readonly items = linkedSignal<PublicationsData | undefined, PublishedWork[]>({
    source: () => this.data(),
    computation: (data) => (data?.items ?? []).map(item => ({
      ...item,
      imageUrl: item.imageUrl
    }))
  });

  ngOnInit() {
    this.publicationsService.load().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((works) => {
      if (works.length > 0) {
        this.items.set(works.map(work => ({
          ...work,
          imageUrl: work.imageUrl
        })));
      }
      // Empty result means API failed — linkedSignal fallback from markdown stays active
    });
  }
}


