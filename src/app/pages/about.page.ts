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
    <div class="container">
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
  `,
  styles: `
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

