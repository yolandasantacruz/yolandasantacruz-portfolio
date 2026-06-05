import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NgOptimizedImage, DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';

import { AboutMeSection } from '../../pages/about.types';

@Component({
  selector: 'portfolio-about-me',
  standalone: true,
  imports: [NgOptimizedImage, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as sections) {
      <section class="about-me-section flex flex-col">
        @for (section of sections; track section.title; let i = $index) {
          <div class="section-row" [id]="getSectionId(section.title)">
            
            @if (i % 2 === 0) {
              <!-- Text on Left, Visual on Right -->
              <div class="section-text">
                <span class="section-badge text-base font-bold">{{ section.badge }}</span>
                <h3 class="section-title text-3xl">{{ section.title }}</h3>
                <div class="section-desc text-base" [innerHTML]="getRenderedHtml(section.description)"></div>
              </div>

              <div class="section-visual">
                @if (section.videoUrl) {
                  <ng-container *ngTemplateOutlet="videoPlayer; context: { $implicit: section }"></ng-container>
                } @else {
                  <ng-container *ngTemplateOutlet="imageVisual; context: { $implicit: section }"></ng-container>
                }
              </div>
            } @else {
              <!-- Visual on Left, Text on Right -->
              <div class="section-visual">
                @if (section.videoUrl) {
                  <ng-container *ngTemplateOutlet="videoPlayer; context: { $implicit: section }"></ng-container>
                } @else {
                  <ng-container *ngTemplateOutlet="imageVisual; context: { $implicit: section }"></ng-container>
                }
              </div>

              <div class="section-text">
                <span class="section-badge text-base font-bold">{{ section.badge }}</span>
                <h3 class="section-title text-3xl">{{ section.title }}</h3>
                <div class="section-desc text-base" [innerHTML]="getRenderedHtml(section.description)"></div>

                @if (section.linkUrl && section.linkLabel) {
                  <div class="section-cta">
                    <a [href]="section.linkUrl" target="_blank" rel="noopener noreferrer" class="section-btn flex items-center font-semibold text-base">
                      {{ section.linkLabel }} &rarr;
                    </a>
                  </div>
                }
                
                @if (section.metrics) {
                  <div class="quiet-metrics-box">
                    @for (metric of section.metrics; track metric.label) {
                      <div class="quiet-metric flex flex-col">
                        <span class="metric-num text-2xl">{{ metric.num }}</span>
                        <span class="metric-label text-base font-semibold">{{ metric.label }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            }

          </div>
        }
      </section>
    }

    <!-- Shared Visual Templates -->
    <ng-template #videoPlayer let-section>
      <div class="adplist-video">
        <div class="filmstrip-card">
          <div class="video-container">
            <div class="player-wrapper">
              @if (activePlayingSection() === section.title) {
                <iframe 
                  [src]="getSafeVideoUrl(section.videoUrl)" 
                  title="Sample Mentorship Session" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerpolicy="strict-origin-when-cross-origin" 
                  allowfullscreen 
                  class="video-iframe">
                </iframe>
              } @else {
                <button class="play-trigger" (click)="playVideo(section.title)" type="button" aria-label="Play sample mentorship session">
                  <img [ngSrc]="getYoutubeThumbnail(section.videoUrl)" width="1280" height="720" alt="Sample Mentorship Session" class="video-thumbnail" />
                  <div class="play-overlay flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </button>
              }
            </div>
          </div>
          <div class="filmstrip-overlay" aria-hidden="true"></div>
        </div>
      </div>
    </ng-template>

    <ng-template #imageVisual let-section>
      @if (section.image === 'images/about/origins.webp') {
        <img [ngSrc]="section.image" ngSrcset="400w, 800w, 1200w" sizes="(max-width: 768px) 100vw, 504px" width="1200" height="1386" alt="Design Execution" />
      } @else {
        <img [ngSrc]="section.image || 'images/about/at-work.webp'" ngSrcset="400w, 800w, 1200w" sizes="(max-width: 768px) 100vw, 504px" width="1200" height="1487" alt="Design Execution" />
      }
    </ng-template>
  `,
  styles: `
    .about-me-section {
      gap: 18rem;
      margin-bottom: 18rem;
    }

    .section-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8rem;
      align-items: center;
    }

    .section-text {
      position: relative;
      z-index: 10;
    }

    .section-visual {
      position: relative;
      z-index: 1;
    }

    .section-badge {
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3b9f98;
      margin-bottom: 1.5rem;
      display: inline-block;
    }

    .section-title {
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 2rem;
    }

    .section-desc {
      line-height: 1.8;
      color: #555;
      margin-bottom: 3rem;
      font-weight: 300;
    }

    :host ::ng-deep .section-desc p {
      margin: 0 0 1em 0;
    }

    :host ::ng-deep .section-desc p:last-child {
      margin-bottom: 0;
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

    .section-visual::before,
    .section-visual::after {
      content: '';
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.9;
      z-index: -1;
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .section-visual::before {
      background: radial-gradient(circle, #FFE59E 0%, rgba(255, 229, 158, 0) 70%);
      bottom: -20px;
      right: -20px;
    }

    .section-visual::after {
      background: radial-gradient(circle, #FFD5BA 0%, rgba(255, 213, 186, 0) 70%);
      top: -20px;
      left: -20px;
    }

    .section-visual:hover::before,
    .section-visual:hover::after {
      opacity: 1.05;
    }

    .section-visual img {
      width: 100%;
      height: auto;
      filter: brightness(1);
      transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .section-visual img:hover {
      filter: brightness(1.05);
      transform: scale(1.01);
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

    .filmstrip-card {
      position: relative;
      width: 100%;
      aspect-ratio: 1.48; /* Aspect ratio of the user's filmstrip image (900x608 is ~1.48) */
      overflow: hidden;
      border-radius: 16px;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.02);
    }

    .filmstrip-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('images/about/filmstrip-frame.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      pointer-events: none; /* Let click events pass through transparent cutout to the play button and iframe */
      z-index: 10;
    }

    .video-container {
      position: absolute;
      top: 11.5%;
      bottom: 11.5%;
      left: 2%;
      right: 2%;
      z-index: 1;
    }

    .player-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 8px; /* Slight rounding matching inner frame boundaries */
      overflow: hidden;
      background: #121212;
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
      transform: scale(1.02); /* Scale up slightly to crop the thumbnail's thin black borders */
      filter: brightness(1);
      transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .play-trigger:hover .video-thumbnail,
    .play-trigger:focus-visible .video-thumbnail {
      filter: brightness(1.05);
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
      transform: scale(1.15); /* Scale up to crop black borders on the sides */
    }

    /* CTA Button Styles */
    .section-cta {
      margin-top: 1rem;
      margin-bottom: 2.5rem;
    }

    .section-btn {
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

    .section-btn:hover {
      background: #5ed6cc;
      color: #111;
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(94, 214, 204, 0.25);
    }

    @media (max-width: 1024px) {
      .section-row { gap: 3rem; }
    }

    @media (max-width: 768px) {
      .about-me-section { gap: 10rem; }
      .section-row { grid-template-columns: 1fr; }
      .section-visual { order: -1; }
      .quiet-metrics-box { grid-template-columns: 1fr; }
    }
  `
})
export class AboutMeComponent {
  data = input<AboutMeSection[] | undefined>();
  private sanitizer = inject(DomSanitizer);
  private document = inject(DOCUMENT);

  /** Cache of trusted HTML per description string */
  private readonly renderedCache = new Map<string, SafeHtml>();

  /** injectContent returns pre-rendered HTML from Analog's Vite plugin — just trust and pass through */
  getRenderedHtml(html: string | undefined): SafeHtml {
    if (!html) return this.sanitizer.bypassSecurityTrustHtml('');
    const cached = this.renderedCache.get(html);
    if (cached) return cached;
    const safe = this.sanitizer.bypassSecurityTrustHtml(html);
    this.renderedCache.set(html, safe);
    return safe;
  }

  readonly activePlayingSection = signal<string | null>(null);
  private safeUrls = new Map<string, SafeResourceUrl>();

  getSafeVideoUrl(url: string): SafeResourceUrl {
    let safe = this.safeUrls.get(url);
    if (!safe) {
      safe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.safeUrls.set(url, safe);
    }
    return safe;
  }

  getYoutubeThumbnail(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : '';
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  }

  playVideo(title: string): void {
    this.activePlayingSection.set(title);
    setTimeout(() => {
      const iframe = this.document.querySelector('.video-iframe') as HTMLIFrameElement;
      iframe?.focus();
    }, 150);
  }

  getSectionId(title: string): string {
    if (title.toLowerCase().includes('origins')) return 'origins';
    if (title.toLowerCase().includes('work')) return 'at-work';
    if (title.toLowerCase().includes('mentorship')) return 'mentorship';
    return title.toLowerCase().replace(/\s+/g, '-');
  }
}

