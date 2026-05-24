import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActionData } from '../../pages/about.types';

@Component({
  selector: 'portfolio-about-action-carousel',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as action) {
      <section class="action-carousel-section">
        <div class="section-header">
          <span class="section-tag">{{ action.tag }}</span>
          <h2 class="carousel-heading">{{ action.heading }}</h2>
        </div>

        <div class="action-grid">
          @for (item of action.items; track item.title; let i = $index) {
            <div class="action-card" [class.video-card]="i === 0">
              <div class="media-box" [class.video-player-box]="i === 0">
                <img [src]="item.imageUrl" [alt]="item.title" [class.video-thumb]="i === 0" class="media-img" />
                @if (i === 0) {
                  <div class="play-indicator">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="play-svg"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                }
              </div>
              <div class="card-caption">
                <span class="caption-tag">{{ item.type }}</span>
                <h4 class="caption-title">{{ item.title }}</h4>
              </div>
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: `
    .action-carousel-section {
      margin-bottom: 12rem;
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

    .carousel-heading {
      font-size: 2.75rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 4rem;
    }

    .action-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 2rem;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: transparent;
      transition: transform 0.3s ease;
    }

    .action-card:hover {
      transform: translateY(-4px);
    }

    .video-player-box {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 14px;
      overflow: hidden;
      background: #111;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      cursor: pointer;
    }

    .video-thumb, .media-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s ease;
    }

    .video-player-box:hover .video-thumb {
      transform: scale(1.03);
    }

    .play-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
    }

    .video-player-box:hover .play-indicator {
      transform: translate(-50%, -50%) scale(1.1);
      background: #fff;
    }

    .play-svg {
      width: 24px;
      height: 24px;
      color: #111;
      margin-left: 3px;
    }

    .media-box {
      aspect-ratio: 4 / 3;
      border-radius: 12px;
      overflow: hidden;
      background: #eee;
    }

    .action-card:hover .media-img {
      transform: scale(1.05);
    }

    .caption-tag {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #3b9f98;
      text-transform: uppercase;
      margin-bottom: 0.4rem;
      display: block;
    }

    .caption-title {
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 1.4;
      color: #111;
      margin: 0;
    }

    @media (max-width: 1024px) {
      .action-grid { grid-template-columns: 1fr 1fr; }
      .video-card { grid-column: span 2; }
    }

    @media (max-width: 768px) {
      .action-grid { grid-template-columns: 1fr; }
      .video-card { grid-column: span 1; }
      .carousel-heading { font-size: 2rem; }
    }
  `
})
export class AboutActionCarouselComponent {
  data = input<ActionData | undefined>();
}
