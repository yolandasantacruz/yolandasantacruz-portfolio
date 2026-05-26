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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="about-wrapper">
      <!-- Fluid background line winding down the page behind text -->
      <div class="fluid-line-bg" aria-hidden="true">
        <svg viewBox="0 0 1200 3200" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 200,-100 C 250,200 1000,300 1000,800 C 1000,1300 150,1400 150,1900 C 150,2400 1050,2500 1050,2900 C 1050,3100 600,3150 400,3250 L 408,3250 C 605,3150 1042,3100 1042,2900 C 1042,2400 240,2400 240,1900 C 240,1400 994,1300 994,800 C 994,300 300,200 205,-100 Z" fill="#00C8C9" opacity="0.05" />
        </svg>
      </div>

      <div class="container relative-container">
        <portfolio-header />

        <main class="about-main">
          <portfolio-about-hero [data]="heroData" [socials]="socialsData" />
          <portfolio-about-belief [data]="beliefData" />
          <portfolio-about-pillars [data]="pillarsData" />
          <portfolio-about-testimonials [items]="testimonialItems" />
          <portfolio-about-timeline [data]="timelineData" />
          <portfolio-about-published-works [data]="publicationsData" />
        </main>

        <portfolio-footer />
      </div>
    </div>
  `,
  styles: `
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
    }

    .fluid-line-bg svg {
      width: 100%;
      height: 100%;
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

