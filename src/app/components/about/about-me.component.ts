import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NgOptimizedImage, DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

import { AboutMeSection } from '../../models/about.types';

@Component({
  selector: 'portfolio-about-me',
  standalone: true,
  imports: [NgOptimizedImage, NgTemplateOutlet, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as sections) {
      <section class="about-me-section flex flex-col">
        @for (section of sections; track section.title; let i = $index) {
          <article class="section-row" [id]="getSectionId(section)" portfolioScrollReveal>
            
            @if (i % 2 === 0) {
              <!-- Text on Left, Visual on Right -->
              <div class="section-text">
                <span class="section-badge text-base font-bold">{{ section.badge }}</span>
                <h3 class="section-title text-3xl">{{ section.title }}</h3>
                <div class="section-desc text-base" [innerHTML]="getRenderedHtml(section.description)"></div>

                @if (section.linkUrl && section.linkLabel) {
                  <div class="section-cta">
                    <a [href]="section.linkUrl" target="_blank" rel="noopener noreferrer" class="btn-link">
                      {{ section.linkLabel }}
                    </a>
                  </div>
                }
                
                @if (section.metrics || section.title === 'Mentorship') {
                  <ng-container *ngTemplateOutlet="metricsBox; context: { $implicit: section.metrics, isMentorship: section.title === 'Mentorship' }" />
                }
              </div>

              <div class="section-visual">
                @if (section.videoUrl) {
                  <ng-container *ngTemplateOutlet="videoPlayer; context: { $implicit: section }" />
                } @else {
                  <ng-container *ngTemplateOutlet="imageVisual; context: { $implicit: section }" />
                }
              </div>
            } @else {
              <!-- Visual on Left, Text on Right -->
              <div class="section-visual">
                @if (section.videoUrl) {
                  <ng-container *ngTemplateOutlet="videoPlayer; context: { $implicit: section }" />
                } @else {
                  <ng-container *ngTemplateOutlet="imageVisual; context: { $implicit: section }" />
                }
              </div>

              <div class="section-text">
                <span class="section-badge text-base font-bold">{{ section.badge }}</span>
                <h3 class="section-title text-3xl">{{ section.title }}</h3>
                <div class="section-desc text-base" [innerHTML]="getRenderedHtml(section.description)"></div>

                @if (section.linkUrl && section.linkLabel) {
                  <div class="section-cta">
                    <a [href]="section.linkUrl" target="_blank" rel="noopener noreferrer" class="btn-link">
                      {{ section.linkLabel }}
                    </a>
                  </div>
                }
                
                @if (section.metrics || section.title === 'Mentorship') {
                  <ng-container *ngTemplateOutlet="metricsBox; context: { $implicit: section.metrics, isMentorship: section.title === 'Mentorship' }" />
                }
              </div>
            }

          </article>
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

    <ng-template #metricsBox let-metrics let-isMentorship="isMentorship">
      <ul class="quiet-metrics-box">
        @if (metrics) {
          @for (metric of metrics; track metric.label) {
            <li class="quiet-metric flex flex-col">
              <span class="metric-num text-2xl">{{ metric.num }}</span>
              <span class="metric-label text-base font-semibold">{{ metric.label }}</span>
            </li>
          }
        }
        @if (isMentorship) {
          <li class="adplist-badge-container">
            <img ngSrc="images/about/top_10.svg" width="160" height="161" alt="ADPList Top 10 Mentor" title="ADPList Top 10 Mentor" class="badge-svg" />
          </li>
        }
      </ul>
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
      color: var(--color-primary);
      margin-bottom: 1.5rem;
      display: inline-block;
    }

    .section-title {
      font-weight: 300;
      letter-spacing: -0.02em;
      color: var(--color-text);
      margin-bottom: 2rem;
    }

    .section-desc {
      line-height: 1.8;
      color: var(--color-text-muted);
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
      color: var(--color-text);
    }

    .comp-val {
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
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
      filter: blur(50px);
      will-change: transform;
      opacity: 0.9;
      z-index: -1;
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .section-visual::before {
      background: var(--color-bg-mentorship);
      bottom: -20px;
      right: -20px;
    }

    .section-visual::after {
      background: var(--color-bg-speaking);
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
      list-style: none;
    }

    .quiet-metric {
      gap: 0.5rem;
    }

    .metric-num {
      font-weight: 300;
      color: var(--color-text);
      letter-spacing: -0.03em;
    }

    .metric-label {
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
    }

    .adplist-badge-container {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
    }

    .badge-svg {
      height: var(--size-adplist-badge-height);
      width: auto;
      max-width: 100%;
      display: block;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .badge-svg:hover {
      transform: scale(1.05);
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
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .filmstrip-card {
      position: relative;
      width: 100%;
      aspect-ratio: 1.4485; /* Proportioned to make the inner transparent cutout exactly 16:9 */
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
      top: 10.39%;
      bottom: 10.67%;
      left: 1.56%;
      right: 1.56%;
      z-index: 1;
    }

    .player-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--color-bg-dark);
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
      box-shadow: inset 0 0 0 3px var(--color-primary);
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
      background: var(--color-bg);
    }

    .play-icon {
      width: 28px;
      height: 28px;
      color: var(--color-text);
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
    .section-cta {
      margin-top: 1rem;
      margin-bottom: 2.5rem;
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

  readonly activePlayingSection = signal<string | null>(null);
  private safeUrls = new Map<string, SafeResourceUrl>();

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

  getSectionId(section: AboutMeSection): string {
    const text = (section.badge || section.title).toLowerCase();
    if (text.includes('origins')) return 'origins';
    if (text.includes('work')) return 'at-work';
    if (text.includes('mentorship')) return 'mentorship';
    return section.title.toLowerCase().replace(/\s+/g, '-');
  }
}

