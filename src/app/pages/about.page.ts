import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { AboutHeroComponent } from '../components/about/about-hero.component';
import { AboutBeliefComponent } from '../components/about/about-belief.component';
import { AboutPillarsComponent } from '../components/about/about-pillars.component';
import { AboutActionCarouselComponent } from '../components/about/about-action-carousel.component';
import { AboutTestimonialsComponent } from '../components/about/about-testimonials.component';
import { AboutTimelineComponent } from '../components/about/about-timeline.component';
import { AboutPublishedWorksComponent } from '../components/about/about-published-works.component';
import {
  HeroData,
  SocialsData,
  BeliefData,
  PillarsData,
  ActionData,
  Testimonial,
  TimelineData,
  PublicationsData,
} from './about.types';

/** Loads the attributes from the first matching content file for a given about/ slug */
function aboutFiles<T extends Record<string, unknown>>(slug: string) {
  return injectContentFiles<T>(file => file.filename.includes(`/about/${slug}`))[0]?.attributes;
}

@Component({
  selector: 'portfolio-about',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    AboutHeroComponent,
    AboutBeliefComponent,
    AboutPillarsComponent,
    AboutActionCarouselComponent,
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
        <portfolio-about-action-carousel [data]="actionData" />
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
      scroll-snap-align: start;
      scroll-snap-stop: normal;
      scroll-margin-top: 6rem;
    }
  `
})
export default class AboutComponent {
  /** Content loaded from src/content/about/*.md via Analog's content API */
  readonly heroData = aboutFiles<HeroData & Record<string, unknown>>('hero');
  readonly socialsData = injectContentFiles<SocialsData & Record<string, unknown>>(file => 
    file.filename.includes('/shared/socials')
  )[0]?.attributes;
  readonly beliefData = aboutFiles<BeliefData & Record<string, unknown>>('belief');
  readonly pillarsData = aboutFiles<PillarsData & Record<string, unknown>>('pillars');
  readonly actionData = aboutFiles<ActionData & Record<string, unknown>>('action');
  readonly timelineData = aboutFiles<TimelineData & Record<string, unknown>>('timeline');
  readonly publicationsData = aboutFiles<PublicationsData & Record<string, unknown>>('publications');

  /** Testimonials need unwrapping: md has { items: [...] }, component expects Testimonial[] */
  readonly testimonialItems = aboutFiles<{ items: Testimonial[] } & Record<string, unknown>>('testimonials')?.items;
}

