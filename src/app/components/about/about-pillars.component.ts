import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { NgOptimizedImage, DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { PillarsData } from '../../pages/about.types';

@Component({
  selector: 'portfolio-about-pillars',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as pillars) {
      <section class="dual-pillars-section flex flex-col">
        <!-- Pillar 1: At Work -->
        <div class="pillar-row pillar-work">
          <div class="pillar-text">
            <span class="pillar-badge text-base font-bold">{{ pillars.work.badge }}</span>
            <h3 class="pillar-title text-3xl">{{ pillars.work.title }}</h3>
            <p class="pillar-desc text-base">{{ pillars.work.description }}</p>
            
            @if (pillars.work.competencies) {
              <div class="competencies flex flex-col">
                @for (comp of pillars.work.competencies; track comp.label) {
                  <div class="competency-item flex justify-between items-center text-base">
                    <span class="comp-label font-semibold">{{ comp.label }}</span>
                    <span class="comp-val text-base font-normal">{{ comp.value }}</span>
                  </div>
                }
              </div>
            }
          </div>
          <div class="pillar-visual">
              <img [ngSrc]="atWorkUrl()" ngSrcset="400w, 800w, 1200w" sizes="(max-width: 768px) 100vw, 480px" width="480" height="595" alt="Design Execution" />
          </div>
        </div>

        <!-- Pillar 2: Philosophy & Mentorship -->
        <div class="pillar-row pillar-philosophy">
          <div class="pillar-visual">
            <div class="adplist-video">
              <div class="video-header">
                <span class="video-label text-base font-semibold">VIEW: A Sample Mentorship Session</span>
              </div>
              <div class="player-wrapper">
                @if (isPlaying()) {
                  <iframe 
                    [src]="safeVideoUrl()" 
                    title="Sample Mentorship Session" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen 
                    class="video-iframe">
                  </iframe>
                } @else {
                  <button class="play-trigger" (click)="playVideo()" type="button" aria-label="Play sample mentorship session">
                    <img [ngSrc]="'https://img.youtube.com/vi/yL_yRyzp7oo/maxresdefault.jpg'" width="1280" height="720" alt="Sample Mentorship Session" class="video-thumbnail" />
                    <div class="play-overlay flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </button>
                }
              </div>
            </div>
          </div>
          <div class="pillar-text">
            <span class="pillar-badge text-base font-bold">{{ pillars.philosophy.badge }}</span>
            <h3 class="pillar-title text-3xl">{{ pillars.philosophy.title }}</h3>
            <p class="pillar-desc text-base">{{ pillars.philosophy.description }}</p>

            @if (pillars.philosophy.linkUrl && pillars.philosophy.linkLabel) {
              <div class="pillar-cta">
                <a [href]="pillars.philosophy.linkUrl" target="_blank" rel="noopener noreferrer" class="pillar-btn flex items-center font-semibold text-base">
                  {{ pillars.philosophy.linkLabel }} &rarr;
                </a>
              </div>
            }
            
            @if (pillars.philosophy.metrics) {
              <div class="quiet-metrics-box">
                @for (metric of pillars.philosophy.metrics; track metric.label) {
                  <div class="quiet-metric flex flex-col">
                    <span class="metric-num text-2xl">{{ metric.num }}</span>
                    <span class="metric-label text-base font-semibold">{{ metric.label }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .dual-pillars-section {
      gap: 12rem;
      margin-bottom: 12rem;
    }

    .pillar-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      align-items: center;
    }

    .pillar-badge {
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3b9f98;
      margin-bottom: 1rem;
      display: inline-block;
    }

    .pillar-title {
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 1.5rem;
    }

    .pillar-desc {
      line-height: 1.8;
      color: #555;
      margin-bottom: 2.5rem;
      font-weight: 300;
    }

    .competencies {
      gap: 1.25rem;
      border-top: 1px solid rgba(0,0,0,0.08);
      padding-top: 2rem;
    }

    .comp-label {
      color: #222;
    }

    .comp-val {
      color: #3b9f98;
      background: rgba(59, 159, 152, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
    }

    .masked-image {
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      background: #f0f0f0;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .masked-image:hover {
      transform: translateY(-8px);
    }

    .arch-mask {
      aspect-ratio: 4 / 5;
      border-radius: 200px 200px 16px 16px;
    }

    .pill-mask {
      aspect-ratio: 4 / 5;
      border-radius: 16px 200px 200px 16px;
    }

    .masked-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s ease;
    }

    .masked-image:hover img {
      transform: scale(1.05);
    }

    .quiet-metrics-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      border-top: 1px solid rgba(0,0,0,0.08);
      padding-top: 2.5rem;
    }

    .quiet-metric {
      gap: 0.5rem;
    }

    .metric-num {
      font-weight: 300;
      color: #111;
      letter-spacing: -0.03em;
    }

    .metric-label {
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #777;
    }

    /* Video Player Styles */
    .adplist-video {
      width: 100%;
    }

    .video-header {
      margin-bottom: 1rem;
    }

    .video-label {
      letter-spacing: 0.1em;
      color: #666;
      text-transform: uppercase;
    }

    .player-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 14px;
      overflow: hidden;
      background: #121212;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .play-trigger {
      display: block;
      width: 100%;
      height: 100%;
      border: none;
      padding: 0;
      background: transparent;
      cursor: pointer;
      position: relative;
    }

    .play-trigger:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 3px #3b9f98;
    }

    .video-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s;
    }

    .play-trigger:hover .video-thumbnail,
    .play-trigger:focus-visible .video-thumbnail {
      transform: scale(1.03);
      opacity: 0.8;
    }

    .play-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 72px;
      height: 72px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
      z-index: 2;
    }

    .play-trigger:hover .play-overlay,
    .play-trigger:focus-visible .play-overlay {
      transform: translate(-50%, -50%) scale(1.1);
      background: #ffffff;
    }

    .play-icon {
      width: 28px;
      height: 28px;
      color: #111;
      margin-left: 4px;
    }

    .video-iframe {
      width: 100%;
      height: 100%;
      border: 0;
      position: absolute;
      top: 0;
      left: 0;
    }

    /* CTA Button Styles */
    .pillar-cta {
      margin-top: 1rem;
      margin-bottom: 2.5rem;
    }

    .pillar-btn {
      gap: 0.5rem;
      background: #111a19;
      color: #ffffff;
      padding: 0.9rem 2.25rem;
      border-radius: 100px;
      letter-spacing: 0.05em;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }

    .pillar-btn:hover {
      background: #5ed6cc;
      color: #111;
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(94, 214, 204, 0.25);
    }

    @media (max-width: 1024px) {
      .pillar-row { gap: 3rem; }
    }

    @media (max-width: 768px) {
      .dual-pillars-section { gap: 6rem; }
      .pillar-row { grid-template-columns: 1fr; }
      .pillar-work .pillar-visual { order: -1; }
      .quiet-metrics-box { grid-template-columns: 1fr; }
    }
  `
})
export class AboutPillarsComponent {
  data = input<PillarsData | undefined>();
  private sanitizer = inject(DomSanitizer);
  private document = inject(DOCUMENT);

  readonly atWorkUrl = computed(() => 'images/about/at-work.webp');

  readonly isPlaying = signal(false);

  readonly safeVideoUrl = computed(() => {
    const url = this.data()?.philosophy?.videoUrl ?? '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  playVideo(): void {
    this.isPlaying.set(true);
    setTimeout(() => {
      const iframe = this.document.querySelector('.video-iframe') as HTMLIFrameElement;
      iframe?.focus();
    }, 150);
  }
}


