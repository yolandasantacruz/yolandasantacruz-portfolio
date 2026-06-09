import { Injectable, computed } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import {
  HeroData,
  SocialsData,
  AboutMeSection,
  Testimonial,
  TimelineData,
  PublicationsData,
} from '../models/about.types';

@Injectable({
  providedIn: 'root'
})
export class AboutDataService {
  readonly heroData = injectContentFiles<HeroData & Record<string, unknown>>(file =>
    file.filename.includes('about/hero.md')
  )[0]?.attributes;

  readonly socialsData = injectContentFiles<SocialsData & Record<string, unknown>>(file =>
    file.filename.includes('shared/socials.md')
  )[0]?.attributes;

  readonly timelineData = injectContentFiles<TimelineData & Record<string, unknown>>(file =>
    file.filename.includes('about/timeline.md')
  )[0]?.attributes;

  readonly publicationsData = injectContentFiles<PublicationsData & Record<string, unknown>>(file =>
    file.filename.includes('about/publications.md')
  )[0]?.attributes;

  readonly testimonialItems = injectContentFiles<{ testimonials: Testimonial[] } & Record<string, unknown>>(file =>
    file.filename.includes('about/testimonials.md')
  )[0]?.attributes?.testimonials;

  private readonly beliefFiles = injectContentFiles<Record<string, unknown>>(file => file.filename.includes('about/belief.md'));
  private readonly originsFiles = injectContentFiles<AboutMeSection & Record<string, unknown>>(file => file.filename.includes('about/origins.md'));
  private readonly atWorkFiles = injectContentFiles<AboutMeSection & Record<string, unknown>>(file => file.filename.includes('about/at-work.md'));
  private readonly mentorshipFiles = injectContentFiles<AboutMeSection & Record<string, unknown>>(file => file.filename.includes('about/mentorship.md'));

  readonly beliefContent = computed(() => {
    const f = this.beliefFiles[0];
    return (f?.attributes['statement'] as string) ?? '';
  });

  readonly aboutMeData = computed<AboutMeSection[]>(() => {
    const originsFile = this.originsFiles[0];
    const atWorkFile = this.atWorkFiles[0];
    const mentorshipFile = this.mentorshipFiles[0];

    return [originsFile, atWorkFile, mentorshipFile]
      .filter((f): f is NonNullable<typeof f> => f !== undefined && f !== null)
      .map(file => ({
        badge: file.attributes['badge'] as string,
        title: file.attributes['title'] as string,
        description: (file.attributes['description'] as string) ?? '',
        image: file.attributes['image'] as string | undefined,
        videoUrl: file.attributes['videoUrl'] as string | undefined,
        linkUrl: file.attributes['linkUrl'] as string | undefined,
        linkLabel: file.attributes['linkLabel'] as string | undefined,
        metrics: file.attributes['metrics'] as AboutMeSection['metrics'],
      })) as AboutMeSection[];
  });

  readonly navSections = computed(() => {
    const pillColors = new Map<string, string>([
      ['top', 'var(--section-pill-hero)'],
      ['origins', 'var(--section-pill-plant-me)'],
      ['at-work', 'var(--section-pill-bridge)'],
      ['mentorship', 'var(--section-pill-fetch-pay)'],
      ['testimonials', 'var(--section-pill-isles-at-bayshore)'],
      ['timeline', 'var(--section-pill-pay-with-app)'],
      ['publications', 'var(--section-pill-hero)'],
    ]);

    return [
      { id: 'top', label: 'Top', color: pillColors.get('top') ?? 'var(--section-pill-hero)' },
      { id: 'origins', label: 'Origins', color: pillColors.get('origins') ?? 'var(--section-pill-plant-me)' },
      { id: 'at-work', label: 'At Work', color: pillColors.get('at-work') ?? 'var(--section-pill-bridge)' },
      { id: 'mentorship', label: 'Mentorship', color: pillColors.get('mentorship') ?? 'var(--section-pill-fetch-pay)' },
      { id: 'testimonials', label: 'Testimonials', color: pillColors.get('testimonials') ?? 'var(--section-pill-isles-at-bayshore)' },
      { id: 'timeline', label: 'Timeline', color: pillColors.get('timeline') ?? 'var(--section-pill-pay-with-app)' },
      { id: 'publications', label: 'Publications', color: pillColors.get('publications') ?? 'var(--section-pill-hero)' },
    ];
  });
}
