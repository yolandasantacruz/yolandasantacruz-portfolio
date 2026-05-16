import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface MediaItem {
  title: string;
  category: string;
  readTime: string;
  imageUrl: string;
  url: string;
  description: string;
}

@Component({
  selector: 'portfolio-leadership',
  standalone: true,
  imports: [ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="full-width-leadership-section" portfolioScrollReveal>
      <!-- Top Wave Border (Shorter, gentler wave) -->
      <div class="wave-container top-wave" aria-hidden="true">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" class="wave-svg">
          <!-- Background polygon filling area below the gentle curve -->
          <path d="M 0 30 C 150 50, 150 50, 300 30 C 450 10, 450 10, 600 30 C 750 50, 750 50, 900 30 C 1050 10, 1050 10, 1200 30 L 1200 60 L 0 60 Z" class="wave-fill" stroke="none" />
        </svg>
      </div>

      <div class="leadership-content-container">
        <!-- Section Header -->
        <div class="section-header">
          <div class="subtitle">
            <span class="dash"></span>
            LEADERSHIP & COMMUNITY
          </div>
          <h2 class="main-title">Beyond the Pixels</h2>
        </div>

        <!-- Part 1: Media & Insights (Articles First, Separated by Lines) -->
        <div class="thought-leadership-container">
          <h3 class="section-heading">Media & Insights</h3>
          <div class="media-list">
            @for (item of mediaItems; track item.title) {
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

        <!-- Horizontal Separator Line -->
        <div class="section-divider" aria-hidden="true"></div>

        <!-- Part 2: ADPList Mentorship (Out of Card, Video Next to Copy) -->
        <div class="adplist-container">
          <div class="adplist-copy">
            <span class="quiet-badge">TOP 1% MENTOR ON ADPLIST</span>
            <h3 class="quiet-title">Guiding the next generation of product design leaders</h3>
            <p class="quiet-philosophy">
              I empower designers worldwide to navigate organizational ambiguity and align purposeful careers with complex business goals.
            </p>

            <div class="quiet-metrics">
              <div class="quiet-metric">
                <span class="metric-num">50+</span>
                <span class="metric-label">DESIGNERS MENTORED</span>
              </div>
              <div class="metric-divider"></div>
              <div class="quiet-metric">
                <span class="metric-num">120+</span>
                <span class="metric-label">SESSIONS HOSTED</span>
              </div>
              <div class="metric-divider"></div>
              <div class="quiet-metric">
                <span class="metric-num">5★</span>
                <span class="metric-label">RATING AVERAGE</span>
              </div>
            </div>

            <div class="quiet-cta">
              <a href="https://adplist.org" target="_blank" rel="noopener noreferrer" class="quiet-btn">
                Book a Session &rarr;
              </a>
            </div>
          </div>

          <div class="adplist-video">
            <div class="video-header">
              <span class="video-label">VIEW: A Sample Mentorship Session</span>
            </div>
            <div class="player-wrapper">
              <img src="https://placehold.co/1200x675/121212/ffffff?text=Sample+Mentorship+Session" alt="Sample Mentorship Session" class="video-thumbnail" />
              <div class="play-overlay">
                <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .full-width-leadership-section {
      position: relative;
      width: 100vw;
      left: 50%;
      right: 50%;
      margin-left: -50vw;
      margin-right: -50vw;
      background: linear-gradient(180deg, rgba(240, 251, 249, 1) 0%, rgba(240, 251, 249, 0) 100%);
      margin-top: 10rem;
      margin-bottom: 8rem;
      padding: 6rem 0;
    }

    .wave-container {
      position: absolute;
      left: 0;
      width: 100%;
      height: 48px;
      overflow: hidden;
      line-height: 0;
      z-index: 1;
    }

    .top-wave {
      top: -47px;
    }

    .wave-svg {
      width: 100%;
      height: 48px;
      display: block;
    }

    .wave-fill {
      fill: #f0fbf9;
    }

    .leadership-content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      flex-direction: column;
    }

    /* Section Header */
    .section-header {
      margin-bottom: 4rem;
    }

    .subtitle {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }

    .dash {
      width: 40px;
      height: 1px;
      background: #ccc;
    }

    .main-title {
      font-size: 3rem;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0;
      letter-spacing: -0.02em;
    }

    /* Section Headings */
    .section-heading {
      font-size: 2rem;
      font-weight: 300;
      letter-spacing: -0.01em;
      color: #111;
      margin-bottom: 2rem;
    }

    /* Part 1: Media List (Clean rows, separated by borders) */
    .thought-leadership-container {
      width: 100%;
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

    /* Horizontal Line Separator */
    .section-divider {
      width: 240px;
      height: 2px;
      background: #5ed6cc;
      margin: 6rem auto;
      border-radius: 2px;
    }

    /* Part 2: ADPList Container (Two columns side-by-side) */
    .adplist-container {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 5rem;
      align-items: center;
      width: 100%;
    }

    .adplist-copy {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .quiet-badge {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #777;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .quiet-title {
      font-size: 2.5rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 1.5rem;
      line-height: 1.25;
    }

    .quiet-philosophy {
      font-size: 1.2rem;
      font-weight: 300;
      color: #555;
      line-height: 1.8;
      margin-bottom: 3.5rem;
    }

    .quiet-metrics {
      display: flex;
      align-items: center;
      gap: 2.5rem;
      margin-bottom: 3.5rem;
      flex-wrap: wrap;
    }

    .quiet-metric {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
    }

    .metric-num {
      font-size: 1.5rem;
      font-weight: 400;
      color: #111;
    }

    .metric-label {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: #777;
      text-transform: uppercase;
    }

    .metric-divider {
      width: 1px;
      height: 20px;
      background-color: rgba(0, 0, 0, 0.12);
    }

    .quiet-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #111;
      color: #ffffff;
      padding: 1rem 2.25rem;
      border-radius: 100px;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-decoration: none;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .quiet-btn:hover {
      background-color: #333;
      transform: translateY(-2px);
    }

    /* Video Player Right Column */
    .adplist-video {
      width: 100%;
    }

    .video-header {
      margin-bottom: 1rem;
    }

    .video-label {
      font-size: 0.8125rem;
      font-weight: 600;
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
      cursor: pointer;
    }

    .video-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s;
    }

    .player-wrapper:hover .video-thumbnail {
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
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
    }

    .player-wrapper:hover .play-overlay {
      transform: translate(-50%, -50%) scale(1.1);
      background: #ffffff;
    }

    .play-icon {
      width: 28px;
      height: 28px;
      color: #111;
      margin-left: 4px;
    }

    @media (max-width: 1024px) {
      .adplist-container { grid-template-columns: 1fr; gap: 4rem; }
      .media-list-item { gap: 2rem; }
      .item-thumb-container { width: 160px; }
    }

    @media (max-width: 768px) {
      .full-width-leadership-section { padding: 4rem 0; margin-top: 8rem; margin-bottom: 6rem; }
      .media-list-item { flex-direction: column; align-items: flex-start; gap: 1.5rem; padding: 2rem 0; }
      .item-thumb-container { width: 100%; aspect-ratio: 16 / 9; }
      .item-desc { max-width: 100%; }
      .item-arrow { align-self: flex-end; }
      .quiet-metrics { gap: 1.5rem; flex-direction: column; align-items: flex-start; }
      .metric-divider { display: none; }
      .section-divider { margin: 4rem auto; }
    }
  `
})
export class LeadershipComponent {
  readonly mediaItems: MediaItem[] = [
    {
      title: 'Mastering Complex SaaS Workflows & Payment Systems',
      category: 'Article',
      readTime: '7 min read',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/55c5c7?text=SaaS+Workflows',
      url: 'https://medium.com',
      description: 'An architectural deep-dive into standardizing multi-tenant permissions, billing tiers, and compliant transactional flows.'
    },
    {
      title: 'Designing for Highly Regulated Financial Environments',
      category: 'Keynote',
      readTime: '25 min watch',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/eddd53?text=Fintech+UX',
      url: 'https://youtube.com',
      description: 'Navigating compliance constraints while delivering transparent, empowering, and delightful user experiences in Fintech.'
    },
    {
      title: 'Building Scalable Design Systems Engineering Teams Love',
      category: 'Guide',
      readTime: '12 min read',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/69ffa7?text=Design+Systems',
      url: 'https://medium.com',
      description: 'A practical framework for tokenizing UI components, maintaining Figma-to-code parity, and establishing robust governance.'
    }
  ];
}
