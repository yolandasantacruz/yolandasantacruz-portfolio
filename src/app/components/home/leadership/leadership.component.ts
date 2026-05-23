import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';
import { MediaListComponent, MediaItem } from './media-list.component';
import { MentorshipSectionComponent } from './mentorship-section.component';

@Component({
  selector: 'portfolio-leadership',
  standalone: true,
  imports: [ScrollRevealDirective, MediaListComponent, MentorshipSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="full-width-leadership-section" portfolioScrollReveal>
      <!-- Top Wave Border -->
      <div class="wave-container top-wave" aria-hidden="true">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" class="wave-svg">
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

        <!-- Part 1: Media & Insights -->
        <portfolio-media-list [items]="mediaItems" />

        <!-- Horizontal Separator Line -->
        <div class="section-divider" aria-hidden="true"></div>

        <!-- Part 2: ADPList Mentorship -->
        <portfolio-mentorship-section />
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

    /* Horizontal Line Separator */
    .section-divider {
      width: 240px;
      height: 2px;
      background: #5ed6cc;
      margin: 6rem auto;
      border-radius: 2px;
    }

    @media (max-width: 768px) {
      .full-width-leadership-section { padding: 4rem 0; margin-top: 8rem; margin-bottom: 6rem; }
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
