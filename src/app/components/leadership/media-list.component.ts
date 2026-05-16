import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface MediaItem {
  title: string;
  category: string;
  readTime: string;
  imageUrl: string;
  url: string;
  description: string;
}

@Component({
  selector: 'portfolio-media-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="thought-leadership-container">
      <h3 class="section-heading">Media & Insights</h3>
      <div class="media-list">
        @for (item of items; track item.title) {
          <a [href]="item.url" target="_blank" rel="noopener noreferrer" class="media-list-item">
            <div class="item-thumb-container">
              <img [src]="item.imageUrl" [alt]="item.title" class="item-thumb" />
            </div>
            <div class="item-text-content">
              <div class="item-meta">
                <span class="item-tag">{{ item.category }}</span>
                <span class="item-time">{{ item.readTime }}</span>
              </div>
              <h4 class="item-title">{{ item.title }}</h4>
              <p class="item-desc">{{ item.description }}</p>
            </div>
            <div class="item-arrow">&rarr;</div>
          </a>
        }
      </div>
    </div>
  `,
  styles: `
    .section-heading {
      font-size: 2rem;
      font-weight: 300;
      letter-spacing: -0.01em;
      color: #111;
      margin-bottom: 2rem;
    }

    .media-list {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .media-list-item {
      display: flex;
      align-items: center;
      gap: 3rem;
      padding: 2.5rem 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .media-list-item:first-of-type {
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }

    .media-list-item:hover {
      transform: translateX(8px);
    }

    .item-thumb-container {
      width: 200px;
      aspect-ratio: 16 / 10;
      border-radius: 10px;
      overflow: hidden;
      flex-shrink: 0;
      background: #eee;
      box-shadow: 0 8px 20px rgba(0,0,0,0.06);
    }

    .item-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .media-list-item:hover .item-thumb {
      transform: scale(1.05);
    }

    .item-text-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.6rem;
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .item-tag {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #3b9f98;
    }

    .item-time {
      font-size: 0.8125rem;
      color: #777;
      font-weight: 500;
    }

    .item-title {
      font-size: 1.6rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #111;
      margin: 0;
    }

    .item-desc {
      font-size: 1.05rem;
      color: #555;
      line-height: 1.6;
      margin: 0;
      max-width: 90%;
    }

    .item-arrow {
      font-size: 1.75rem;
      color: #bbb;
      transition: transform 0.2s ease, color 0.2s ease;
    }

    .media-list-item:hover .item-arrow {
      color: #111;
      transform: translateX(6px);
    }

    @media (max-width: 768px) {
      .media-list-item { flex-direction: column; align-items: flex-start; gap: 1.5rem; padding: 2rem 0; }
      .item-thumb-container { width: 100%; aspect-ratio: 16 / 9; }
      .item-desc { max-width: 100%; }
      .item-arrow { align-self: flex-end; }
    }
  `
})
export class MediaListComponent {
  @Input({ required: true }) items: MediaItem[] = [];
}
