import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AboutDataService } from './about-data.service';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { AboutHeroComponent } from '../components/about/about-hero.component';
import { AboutBeliefComponent } from '../components/about/about-belief.component';
import { AboutMeComponent } from '../components/about/about-me.component';
import { AboutTestimonialsComponent } from '../components/about/about-testimonials.component';
import { AboutTimelineComponent } from '../components/about/about-timeline.component';
import { AboutPublicationsComponent } from '../components/about/about-publications.component';
import { SideNavComponent } from '../components/side-nav/side-nav.component';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';
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
    SideNavComponent,
    ScrollRevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="about-wrapper">
      <!-- Fixed Side Rail Navigation -->
      <portfolio-side-nav 
        [sections]="navSections()" 
        intersectionSelector="#top, .section-row, #testimonials, #timeline, #publications" 
        [intersectionOptions]="{ rootMargin: '-25% 0px -70% 0px', threshold: 0 }" 
        mutationTargetSelector=".about-main" 
      />

      <!-- Fluid background line winding down the page behind text -->
      <div class="fluid-line-bg" aria-hidden="true">
        <svg viewBox="0 0 1200 3200" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="about-f-blur" x="-300" y="-300" width="1800" height="4200" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation="50"/>
            </filter>
            <linearGradient id="about-g-trace" x1="-150" y1="-50" x2="404" y2="3600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="var(--color-gradient-stop-1)" stop-opacity="0.8"/>
              <stop offset="30%" stop-color="var(--color-gradient-stop-2)" stop-opacity="0.8"/>
              <stop offset="45%" stop-color="var(--color-gradient-stop-2)" stop-opacity="1.0"/>
              <stop offset="100%" stop-color="var(--color-gradient-stop-3)" stop-opacity="1.0"/>
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

      <div id="top" class="container relative-container">
        <portfolio-header />

        <main class="about-main">
          <portfolio-about-hero [data]="heroData" [socials]="socialsData" />
          <portfolio-about-belief portfolioScrollReveal [content]="beliefContent()" />
          <portfolio-about-me [data]="aboutMeData()" />
          <portfolio-about-testimonials portfolioScrollReveal id="testimonials" [items]="testimonialItems" />
          <portfolio-about-timeline portfolioScrollReveal id="timeline" [data]="timelineData" />
          <portfolio-about-publications portfolioScrollReveal id="publications" [data]="publicationsData" />
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
export default class AboutComponent {
  private aboutDataService = inject(AboutDataService);

  readonly navSections = this.aboutDataService.navSections;
  readonly heroData = this.aboutDataService.heroData;
  readonly socialsData = this.aboutDataService.socialsData;
  readonly beliefContent = this.aboutDataService.beliefContent;
  readonly aboutMeData = this.aboutDataService.aboutMeData;
  readonly timelineData = this.aboutDataService.timelineData;
  readonly publicationsData = this.aboutDataService.publicationsData;
  readonly testimonialItems = this.aboutDataService.testimonialItems;
}