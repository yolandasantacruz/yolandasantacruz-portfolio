import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaListComponent, MediaItem } from './media-list.component';

@Component({
  selector: 'portfolio-home-publications',
  standalone: true,
  imports: [MediaListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="full-width-publications-section">
      <div class="publications-content-container">
        <!-- Section Header -->
        <div class="section-header">
          <div class="subtitle">
            <span class="dash"></span>
            LEADERSHIP & COMMUNITY
          </div>
          <h2 class="main-title">Publications</h2>
        </div>

        <portfolio-media-list [items]="mediaItems()" />
      </div>
    </section>
  `,
  styles: `
    .full-width-publications-section {
      position: relative;
      width: 100vw;
      left: 50%;
      right: 50%;
      margin-left: -50vw;
      margin-right: -50vw;
      background: linear-gradient(180deg, rgba(240, 251, 249, 0.4) 0%, rgba(255, 255, 255, 1) 100%);
      margin-top: 0;
      margin-bottom: 0;
      padding: 4rem 0;
    }

    .publications-content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 5rem 0 2rem;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    /* Section Header */
    .section-header {
      margin-bottom: 3rem;
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
      margin-bottom: 1.25rem;
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

    @media (max-width: 1024px) {
      .publications-content-container {
        padding: 0 3.5rem 0 2rem;
      }
    }

    @media (max-width: 768px) {
      .full-width-publications-section {
        padding: 4rem 0;
        margin-top: 6rem;
        margin-bottom: 0;
      }
      .publications-content-container {
        padding: 0 1.5rem;
      }
    }
  `
})
export class PublicationsComponent implements OnInit {
  private http = inject(HttpClient);

  readonly mediaItems = signal<MediaItem[]>([
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
  ]);

  ngOnInit() {
    this.http.get<{ success: boolean; items?: MediaItem[] }>('/api/v1/publications').subscribe({
      next: (res) => {
        if (res.success && res.items?.length) {
          this.mediaItems.set(res.items.slice(0, 3));
        }
      },
      error: () => {
        // Keep the already set fallbackItems
      }
    });
  }
}
