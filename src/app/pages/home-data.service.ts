import { Injectable, signal, computed } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { ProjectAttributes } from '../models/project-attributes';
import { HomeHeroData, HomeBridgeData } from '../models/home.types';
import { Project } from '../components/home/project-card/project-card.component';

@Injectable({
  providedIn: 'root'
})
export class HomeDataService {
  readonly projects = signal<Project[]>(
    injectContentFiles<ProjectAttributes>(file => file.filename.includes('projects'))
      .sort((a, b) => a.attributes.order - b.attributes.order)
      .map(project => ({
        title: project.attributes.title,
        description: project.attributes.description,
        imageUrl: project.attributes.imageUrl,
        link: `/projects/${project.attributes.slug}`,
        category: project.attributes.category,
        role: project.attributes.role,
        timeline: project.attributes.timeline,
        techStack: project.attributes.techStack
      }))
  );

  readonly heroData = injectContentFiles<HomeHeroData & Record<string, unknown>>(file =>
    file.filename.includes('home/hero.md')
  )[0]?.attributes;
  
  readonly bridgeData = injectContentFiles<HomeBridgeData & Record<string, unknown>>(file =>
    file.filename.includes('home/bridge.md')
  )[0]?.attributes;

  readonly navSections = computed(() => {
    // Maps each section ID to its CSS custom property reference.
    // ALL color values live exclusively in src/styles/variables.css :root — this file holds no hex codes.
    // Rule 16: Map used instead of bracket notation to avoid dynamic property access.
    const pillColors = new Map<string, string>([
      ['hero', 'var(--section-pill-hero)'],
      ['project-0', 'var(--section-pill-pay-with-app)'],
      ['project-1', 'var(--section-pill-fetch-pay)'],
      ['project-2', 'var(--section-pill-isles-at-bayshore)'],
      ['project-3', 'var(--section-pill-plant-me)'],
      ['bridge', 'var(--section-pill-bridge)'],
    ]);

    const sections = [
      { id: 'hero', label: 'Top', color: pillColors.get('hero') ?? 'var(--section-pill-hero)' }
    ];

    this.projects().forEach((p, i) => {
      const sectionId = `project-${i}`;
      sections.push({
        id: sectionId,
        label: p.title,
        color: pillColors.get(sectionId) ?? 'var(--section-pill-hero)'
      });
    });

    sections.push({
      id: 'bridge',
      label: this.bridgeData?.heading ?? 'About me',
      color: pillColors.get('bridge') ?? 'var(--section-pill-bridge)'
    });

    return sections;
  });
}
