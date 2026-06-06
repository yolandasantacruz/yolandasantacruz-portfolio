import { ChangeDetectionStrategy, Component, signal, inject, PLATFORM_ID, computed, afterNextRender, OnInit, OnDestroy, DestroyRef } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { injectContentFiles, injectContent, ContentFile } from '@analogjs/content';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { AboutHeroComponent } from '../components/about/about-hero.component';
import { AboutBeliefComponent } from '../components/about/about-belief.component';
import { AboutMeComponent } from '../components/about/about-me.component';
import { AboutTestimonialsComponent } from '../components/about/about-testimonials.component';
import { AboutTimelineComponent } from '../components/about/about-timeline.component';
import { AboutPublicationsComponent } from '../components/about/about-publications.component';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'About | Yolanda Santa Cruz',
  meta: [
    {
      name: 'description',
      content: 'Learn more about Yolanda Santa Cruz\'s design philosophy, work competencies, and community mentorship as a Product Designer.'
    },
    { property: 'og:title', content: 'About | Yolanda Santa Cruz' },
    { property: 'og:description', content: 'Learn more about Yolanda Santa Cruz\'s design philosophy, work competencies, and community mentorship as a Product Designer.' },
    { property: 'og:image', content: '/images/og-card.webp' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
};

import {
  HeroData,
  SocialsData,
  AboutMeSection,
  Testimonial,
  TimelineData,
  PublicationsData,
} from './about.types';

@Component({
  selector: 'portfolio-about',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    AboutHeroComponent,
    AboutBeliefComponent,
    AboutMeComponent,
    AboutTestimonialsComponent,
    AboutTimelineComponent,
    AboutPublicationsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="about-wrapper">
      <!-- Fixed Side Rail Navigation -->
      <nav class="floating-side-rail flex flex-col items-end" role="navigation" aria-label="Page sections">
        @for (sec of navSections(); track sec.id) {
          <button class="nav-pill flex items-center justify-center" 
                  [class.active]="activeSection() === sec.id" 
                  (click)="scrollToSection(sec.id)" 
                  [attr.aria-label]="'Scroll to ' + sec.label"
                  [attr.aria-current]="activeSection() === sec.id ? 'step' : null"
                  [style.--pill-color]="sec.color">
            <span class="pill-label">{{ sec.label }}</span>
          </button>
        }
      </nav>

      <!-- Fluid background line winding down the page behind text -->
      <div class="fluid-line-bg" aria-hidden="true">
        <svg viewBox="0 0 1200 3200" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="about-f-blur" x="-300" y="-300" width="1800" height="4200" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation="90"/>
            </filter>
            <linearGradient id="about-g-trace" x1="-150" y1="-50" x2="404" y2="3600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#8AE7DA" stop-opacity="0.8"/>
              <stop offset="30%" stop-color="#E2F6BC" stop-opacity="0.8"/>
              <stop offset="45%" stop-color="#E2F6BC" stop-opacity="1.0"/>
              <stop offset="100%" stop-color="#FCFBE9" stop-opacity="1.0"/>
            </linearGradient>
          </defs>
          <!-- soft outer glow layer 1 -->
          <path opacity="0.9" filter="url(#about-f-blur)" d="M -150,-50 C 100,50 997,300 997,800 C 997,1300 195,1400 195,1900 C 195,2400 1046,2500 1046,2900 C 1046,3100 602.5,3150 404,3600" stroke="url(#about-g-trace)" stroke-width="140"/>
          <!-- soft outer glow layer 2 (doubles the glow intensity) -->
          <path opacity="0.9" filter="url(#about-f-blur)" d="M -150,-50 C 100,50 997,300 997,800 C 997,1300 195,1400 195,1900 C 195,2400 1046,2500 1046,2900 C 1046,3100 602.5,3150 404,3600" stroke="url(#about-g-trace)" stroke-width="140"/>
          <!-- mid diffuse band -->
          <path opacity="0.55" d="M -150,-50 C 100,50 997,300 997,800 C 997,1300 195,1400 195,1900 C 195,2400 1046,2500 1046,2900 C 1046,3100 602.5,3150 404,3600" stroke="url(#about-g-trace)" stroke-width="120"/>
          <!-- sharp bright core -->
          <path d="M -150,-50 C 100,50 997,300 997,800 C 997,1300 195,1400 195,1900 C 195,2400 1046,2500 1046,2900 C 1046,3100 602.5,3150 404,3600" stroke="url(#about-g-trace)" stroke-width="50"/>
        </svg>
      </div>

      <div class="container relative-container">
        <portfolio-header />

        <main class="about-main">
          <portfolio-about-hero id="hero" [data]="heroData" [socials]="socialsData" />
          <portfolio-about-belief [content]="beliefContent()" />
          <portfolio-about-me [data]="aboutMeData()" />
          <portfolio-about-testimonials id="testimonials" [items]="testimonialItems" />
          <portfolio-about-timeline id="timeline" [data]="timelineData" />
          <portfolio-about-publications id="publications" [data]="publicationsData" />
        </main>

        <portfolio-footer />
      </div>
    </div>
  `,
  styles: `
    @keyframes aboutTraceFloat {
      0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
      50% { transform: translateY(-20px) scale(1.01) rotate(0.5deg); }
    }

    .about-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .fluid-line-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 6; /* Sits above WebGL mouse trail (z-index 5) but below content */
      pointer-events: none;
      opacity: 0.7;
    }

    .fluid-line-bg svg {
      width: 100%;
      height: 100%;
      /* Static placement allows browser to rasterize the blur filter once and cache on GPU */
      transform-origin: center;
      will-change: transform;
      overflow: visible;
    }

    .relative-container {
      position: relative;
      z-index: 10; /* Ensures readable content floats above the background line */
    }

    .about-main {
      padding-top: 8rem;
      padding-bottom: 4rem;
      padding-right: 5rem;
      box-sizing: border-box;
    }

    .about-main > * {
      display: block;
    }

    @media (max-width: 1024px) {
      .about-main {
        padding-right: 3.5rem;
      }
    }

    @media (max-width: 768px) {
      .about-main {
        padding-right: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .fluid-line-bg svg {
        animation: none !important;
        transform: none !important;
      }
    }
  `
})
export default class AboutComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.classList.add('no-scrollbar');
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.classList.remove('no-scrollbar');
    }
  }

  readonly activeSection = signal<string>('hero');

  readonly navSections = computed(() => {
    const pillColors = new Map<string, string>([
      ['hero', 'var(--section-pill-hero)'],
      ['origins', 'var(--section-pill-plant-me)'],
      ['at-work', 'var(--section-pill-bridge)'],
      ['mentorship', 'var(--section-pill-fetch-pay)'],
      ['testimonials', 'var(--section-pill-isles-at-bayshore)'],
      ['timeline', 'var(--section-pill-pay-with-app)'],
      ['publications', 'var(--section-pill-hero)'],
    ]);

    return [
      { id: 'hero', label: 'Top', color: pillColors.get('hero') ?? 'var(--section-pill-hero)' },
      { id: 'origins', label: 'Origins', color: pillColors.get('origins') ?? 'var(--section-pill-plant-me)' },
      { id: 'at-work', label: 'At Work', color: pillColors.get('at-work') ?? 'var(--section-pill-bridge)' },
      { id: 'mentorship', label: 'Mentorship', color: pillColors.get('mentorship') ?? 'var(--section-pill-fetch-pay)' },
      { id: 'testimonials', label: 'Testimonials', color: pillColors.get('testimonials') ?? 'var(--section-pill-isles-at-bayshore)' },
      { id: 'timeline', label: 'Timeline', color: pillColors.get('timeline') ?? 'var(--section-pill-pay-with-app)' },
      { id: 'publications', label: 'Publications', color: pillColors.get('publications') ?? 'var(--section-pill-hero)' },
    ];
  });

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId) && typeof globalThis.IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.activeSection.set(entry.target.id);
            }
          });
        }, {
          // Narrow scanner band in the upper-middle viewport for stable scroll tracking of dynamic sections
          rootMargin: '-25% 0px -70% 0px',
          threshold: 0
        });

        const targets = this.document.querySelectorAll('#hero, .section-row, #testimonials, #timeline, #publications');
        targets.forEach(target => {
          observer.observe(target);
        });



      }
    });

    const beliefSub = injectContent<Record<string, unknown>>({ customFilename: 'about/belief' }).subscribe(d => this.beliefFile.set(d));
    const originsSub = injectContent<AboutMeSection & Record<string, unknown>>({ customFilename: 'about/origins' }).subscribe(d => this.originsFile.set(d));
    const atWorkSub = injectContent<AboutMeSection & Record<string, unknown>>({ customFilename: 'about/at-work' }).subscribe(d => this.atWorkFile.set(d));
    const mentorshipSub = injectContent<AboutMeSection & Record<string, unknown>>({ customFilename: 'about/mentorship' }).subscribe(d => this.mentorshipFile.set(d));

    this.destroyRef.onDestroy(() => {
      beliefSub.unsubscribe();
      originsSub.unsubscribe();
      atWorkSub.unsubscribe();
      mentorshipSub.unsubscribe();
    });
  }

  scrollToSection(id: string) {
    this.activeSection.set(id);
    if (isPlatformBrowser(this.platformId)) {
      const element = this.document.getElementById(id);
      if (element && typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  /** Content loaded from src/content/about/*.md via Analog's content API */
  readonly heroData = injectContentFiles<HeroData & Record<string, unknown>>(file =>
    file.filename.includes('about/hero.md')
  )[0]?.attributes;

  readonly socialsData = injectContentFiles<SocialsData & Record<string, unknown>>(file =>
    file.filename.includes('shared/socials.md')
  )[0]?.attributes;


  /** Belief section — uses injectContent to load the body text (injectContentFiles only returns frontmatter) */
  private readonly beliefFile = signal<ContentFile<Record<string, unknown> | Record<string, never>> | null>(null);
  readonly beliefContent = computed(() => {
    const f = this.beliefFile();
    return f && typeof f.content === 'string' ? f.content : '';
  });

  /** About-me sections — load each file individually with injectContent to get body text */
  private readonly originsFile = signal<ContentFile<AboutMeSection & Record<string, unknown> | Record<string, never>> | null>(null);
  private readonly atWorkFile = signal<ContentFile<AboutMeSection & Record<string, unknown> | Record<string, never>> | null>(null);
  private readonly mentorshipFile = signal<ContentFile<AboutMeSection & Record<string, unknown> | Record<string, never>> | null>(null);

  readonly aboutMeData = computed<AboutMeSection[]>(() => {
    return [
      this.originsFile(),
      this.atWorkFile(),
      this.mentorshipFile(),
    ]
      .filter((f): f is NonNullable<typeof f> => f !== null)
      .map(file => ({
        badge: file.attributes['badge'] as string,
        title: file.attributes['title'] as string,
        description: typeof file.content === 'string' ? file.content : '',
        image: file.attributes['image'] as string | undefined,
        videoUrl: file.attributes['videoUrl'] as string | undefined,
        linkUrl: file.attributes['linkUrl'] as string | undefined,
        linkLabel: file.attributes['linkLabel'] as string | undefined,
        metrics: file.attributes['metrics'] as AboutMeSection['metrics'],
      })) as AboutMeSection[];
  });



  readonly timelineData = injectContentFiles<TimelineData & Record<string, unknown>>(file =>
    file.filename.includes('about/timeline.md')
  )[0]?.attributes;

  readonly publicationsData = injectContentFiles<PublicationsData & Record<string, unknown>>(file =>
    file.filename.includes('about/publications.md')
  )[0]?.attributes;

  /** Testimonials need unwrapping: md has { items: [...] }, component expects Testimonial[] */
  readonly testimonialItems = injectContentFiles<{ testimonials: Testimonial[] } & Record<string, unknown>>(file =>
    file.filename.includes('about/testimonials.md')
  )[0]?.attributes?.testimonials;
}

