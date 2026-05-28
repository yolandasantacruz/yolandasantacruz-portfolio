import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { AboutHeroComponent } from '../components/about/about-hero.component';
import { AboutBeliefComponent } from '../components/about/about-belief.component';
import { AboutPillarsComponent } from '../components/about/about-pillars.component';
import { AboutTestimonialsComponent } from '../components/about/about-testimonials.component';
import { AboutTimelineComponent } from '../components/about/about-timeline.component';
import { AboutPublishedWorksComponent } from '../components/about/about-published-works.component';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'About | Yolanda Santa Cruz',
  meta: [
    {
      name: 'description',
      content: 'Learn more about Yolanda Santa Cruz\'s design philosophy, work competencies, and community mentorship as a Product Designer.'
    }
  ]
};

import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';


import {
  HeroData,
  SocialsData,
  BeliefData,
  PillarsData,
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
    AboutPillarsComponent,
    AboutTestimonialsComponent,
    AboutTimelineComponent,
    AboutPublishedWorksComponent,
    ScrollRevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="about-wrapper">
      <!-- Fluid background line winding down the page behind text -->
      <div class="fluid-line-bg" aria-hidden="true">
        <svg viewBox="0 0 1200 3200" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="about-f-blur" x="-300" y="-300" width="1800" height="4200" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation="90"/>
            </filter>
            <linearGradient id="about-g-trace" x1="-150" y1="-50" x2="404" y2="3600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#8AE7DA" stop-opacity="0.3"/>
              <stop offset="30%" stop-color="#E2F6BC" stop-opacity="0.3"/>
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
          <portfolio-about-hero [data]="heroData" [socials]="socialsData" />
          <portfolio-about-belief [data]="beliefData" portfolioScrollReveal />
          <portfolio-about-pillars [data]="pillarsData" portfolioScrollReveal />
          <portfolio-about-testimonials [items]="testimonialItems" portfolioScrollReveal />
          <portfolio-about-timeline [data]="timelineData" portfolioScrollReveal />
          <portfolio-about-published-works [data]="publicationsData" portfolioScrollReveal />
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
      animation: aboutTraceFloat 12s ease-in-out infinite;
      transform-origin: center;
      will-change: transform;
      overflow: visible;
    }

    .relative-container {
      position: relative;
      z-index: 10; /* Ensures readable content floats above the background line */
    }

    .about-main {
      padding-top: 6rem;
      padding-bottom: 8rem;
    }

    .about-main > * {
      display: block;
    }

    .about-main > *:not(:first-child) {
      scroll-snap-align: start;
      scroll-snap-stop: normal;
      scroll-margin-top: 6rem;
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
  /** Content loaded from src/content/about/*.md via Analog's content API */
  readonly heroData = injectContentFiles<HeroData & Record<string, unknown>>(file =>
    file.filename.includes('about/hero.md')
  )[0]?.attributes;

  readonly socialsData = injectContentFiles<SocialsData & Record<string, unknown>>(file =>
    file.filename.includes('shared/socials.md')
  )[0]?.attributes;

  readonly beliefData = injectContentFiles<BeliefData & Record<string, unknown>>(file =>
    file.filename.includes('about/belief.md')
  )[0]?.attributes;

  readonly pillarsData = injectContentFiles<PillarsData & Record<string, unknown>>(file =>
    file.filename.includes('about/pillars.md')
  )[0]?.attributes;



  readonly timelineData = injectContentFiles<TimelineData & Record<string, unknown>>(file =>
    file.filename.includes('about/timeline.md')
  )[0]?.attributes;

  readonly publicationsData = injectContentFiles<PublicationsData & Record<string, unknown>>(file =>
    file.filename.includes('about/publications.md')
  )[0]?.attributes;

  /** Testimonials need unwrapping: md has { items: [...] }, component expects Testimonial[] */
  readonly testimonialItems = injectContentFiles<{ items: Testimonial[] } & Record<string, unknown>>(file =>
    file.filename.includes('about/testimonials.md')
  )[0]?.attributes?.items;
}

