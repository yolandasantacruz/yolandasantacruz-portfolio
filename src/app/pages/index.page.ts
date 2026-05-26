import { ChangeDetectionStrategy, Component, computed, signal, afterNextRender, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ImageUrlService } from '../services/image-url.service';
import { RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { HeaderComponent } from '../components/header/header.component';
import { HeroComponent } from '../components/home/hero/hero.component';
import { ProjectCardComponent, Project } from '../components/home/project-card/project-card.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProjectAttributes } from '../project-attributes';
import { HomeHeroData, HomeBridgeData } from './home.types';

@Component({
  selector: 'portfolio-home',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,
    HeroComponent,
    ProjectCardComponent,
    FooterComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="snap-container">
      <!-- Fixed Side Rail Navigation -->
      <div class="floating-side-rail" role="navigation" aria-label="Page sections">
        @for (sec of navSections(); track sec.id) {
          <button class="nav-pill" 
                  [class.active]="activeSection() === sec.id" 
                  (click)="scrollToSection(sec.id)" 
                  [attr.aria-label]="'Scroll to ' + sec.label"
                  [attr.aria-current]="activeSection() === sec.id ? 'step' : null"
                  [style.--pill-color]="sec.color">
            <span class="pill-label">{{ sec.label }}</span>
          </button>
        }
      </div>

      <!-- Hero Section (Snap 0) -->
      <section id="hero" class="snap-section hero-section">
        <div class="section-content hero-content-wrapper">
          <portfolio-header />
          <portfolio-hero [data]="heroData" />
        </div>
      </section>

      <!-- Project Sections (Snaps 1 to 4) -->
      @for (project of projects(); track project.title; let i = $index) {
        <section [id]="'project-' + i" class="snap-section project-section">
          <div class="section-content">
            <portfolio-project-card [project]="{ ...project, reverse: i % 2 !== 0 }" />
          </div>
        </section>
      }



      <!-- About Me Bridge Section (Snap 7) -->
      <section id="bridge" class="snap-section bridge-section">
        <div class="section-content bridge-content">
          @if (bridgeData) {
            <div class="bridge-card">
              <span class="bridge-tag">{{ bridgeData.tag }}</span>
              <h2 class="bridge-heading">{{ bridgeData.heading }}</h2>
              <p class="bridge-copy">
                {{ bridgeData.description }}
              </p>
              <a routerLink="/about" class="bridge-cta">TRACE MY PATH</a>
            </div>
          }
          <portfolio-footer />
        </div>
      </section>
    </div>
  `,
  styles: `
    .snap-container {
      height: 100vh;
      overflow-y: scroll;
      scroll-snap-type: y mandatory;
      scroll-behavior: smooth;
      width: 100%;
      position: relative;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .snap-container::-webkit-scrollbar {
      display: none;
    }

    .snap-section {
      scroll-snap-align: start;
      scroll-snap-stop: always;
      min-height: 100vh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 3rem 0;
    }

    .section-content {
      width: 100%;
      max-width: var(--max-width);
      margin: 0 auto;
      padding: var(--container-padding);
      padding-right: 5rem; /* Clear floating side-rail + 16px safety gap (40px right + 24px dot + 16px gap) */
      box-sizing: border-box;
    }

    .hero-section {
      align-items: flex-start;
      padding-top: 0;
      position: relative;
      overflow: hidden;
      /* Bottom edge bleeds into project-0's periwinkle so the first snap section
         feels like a continuation rather than an abrupt cut. The gradient occupies
         only the last 15% of the section height — invisible while reading. */
      background: linear-gradient(
        to bottom,
        transparent                      0%,
        transparent                      85%,
        var(--section-bg-pay-with-app)   100%
      );
    }

    .hero-content-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      justify-content: flex-start;
    }

    .hero-content-wrapper portfolio-hero {
      flex: 1;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .project-section portfolio-project-card {
      margin-bottom: 0 !important;
      width: 100%;
    }

    /* -------------------------------------------------------------------------
     * SECTION GRADIENT SYSTEM
     * Strategy: each section holds its pure pastel for the top 78% of its height,
     * then fades into the next section's color in the bottom 22% only.
     * This keeps sections visually distinct while the bottom "hem" provides the
     * seamless bleed — nothing bleeds into the section's readable content area.
     *
     * To retheme: change a single --section-bg-* in styles.css — the token
     * updates in BOTH the owning section AND its neighbor automatically.
     * -------------------------------------------------------------------------
     */

    #project-0 {
      /* Holds periwinkle, bleeds to Fetch Pay purple */
      background: linear-gradient(
        to bottom,
        var(--section-bg-pay-with-app)   0%,
        var(--section-bg-pay-with-app)   78%,
        var(--section-bg-fetch-pay)      100%
      );
      transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #project-1 {
      /* Fetch Pay purple — holds, bleeds to Isles indigo */
      background: linear-gradient(
        to bottom,
        var(--section-bg-fetch-pay)         0%,
        var(--section-bg-fetch-pay)         78%,
        var(--section-bg-isles-at-bayshore) 100%
      );
      transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #project-2 {
      /* Isles indigo — holds, bleeds to PlantMe sage */
      background: linear-gradient(
        to bottom,
        var(--section-bg-isles-at-bayshore) 0%,
        var(--section-bg-isles-at-bayshore) 78%,
        var(--section-bg-plant-me)          100%
      );
      transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #project-3 {
      /* PlantMe sage — holds, bleeds to bridge teal anchor */
      background: linear-gradient(
        to bottom,
        var(--section-bg-plant-me)          0%,
        var(--section-bg-plant-me)          78%,
        var(--section-bg-bridge)            100%
      );
      transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Floating Side Rail Navigation */
    .floating-side-rail {
      position: fixed;
      right: 2.5rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 50;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      align-items: flex-end;
    }

    .nav-pill {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--pill-color);
      border: 4px solid color-mix(in srgb, var(--pill-color) 20%, white);
      background-clip: padding-box;
      height: 24px;
      min-width: 24px;
      max-width: 24px;
      padding: 0 6px;
      border-radius: 100px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.5);
      transition: max-width 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, padding 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, border-width 0.3s ease, border-color 0.3s ease;
      box-sizing: border-box;
      outline: none;
      opacity: 0.65;
    }

    .pill-label {
      opacity: 0;
      color: #3b9f98;
      font-family: var(--font-main);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      max-width: 0;
      transform: scale(0.95);
      transition: opacity 0.3s ease, transform 0.4s ease, max-width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .nav-pill:hover {
      max-width: 320px;
      padding: 0 14px;
      background: #ffffff;
      border: 4px solid #ffffff;
      box-shadow: 0 8px 24px rgba(255, 255, 255, 0.6);
      opacity: 1;
    }

    .nav-pill:hover .pill-label {
      opacity: 1;
      max-width: 280px;
      transform: scale(1);
    }

    .nav-pill.active {
      border-width: 0;
      box-shadow: 0 6px 20px rgba(255, 255, 255, 0.7);
      opacity: 1;
    }

    .nav-pill.active:hover {
      box-shadow: 0 8px 24px rgba(255, 255, 255, 0.8);
    }

    .nav-pill:focus-visible {
      outline: 3px solid #111;
      outline-offset: 2px;
    }

    /* About Me Bridge Section — ANCHOR: hsl(169,58%,96%) must remain immutable */
    /* PlantMe's sage fades in at top for 6% only — bridge teal dominates 94%   */
    .bridge-section {
      background: linear-gradient(
        to bottom,
        var(--section-bg-plant-me)  0%,
        var(--section-bg-bridge)    6%,
        var(--section-bg-bridge)    100%
      );
    }

    .bridge-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 100vh;
      padding-top: 6rem;
      padding-bottom: 2rem;
    }

    .bridge-card {
      max-width: 800px;
      margin: auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }

    .bridge-tag {
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #3b9f98;
      text-transform: uppercase;
    }

    .bridge-heading {
      font-size: 3.25rem;
      font-weight: 400;
      letter-spacing: -0.02em;
      line-height: 1.15;
      color: #111;
      margin: 0;
    }

    .bridge-copy {
      font-size: 1.25rem;
      line-height: 1.8;
      color: #555;
      margin: 0;
      font-weight: 300;
    }

    @keyframes blob-morph {
      0%, 100% {
        border-radius: 55% 45% 70% 30% / 45% 55% 45% 55%;
      }
      33% {
        border-radius: 65% 35% 50% 50% / 55% 35% 65% 45%;
      }
      66% {
        border-radius: 45% 55% 35% 65% / 40% 65% 35% 60%;
      }
    }

    .bridge-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 200, 201, 0.1);
      color: #3b9f98;
      width: 180px;
      height: 76px;
      font-family: var(--font-main);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-decoration: none;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid transparent;
      animation: blob-morph 6s ease-in-out infinite alternate;
      margin-top: 1rem;
    }

    .bridge-cta:hover {
      background: rgba(0, 200, 201, 0.2);
      color: #3b9f98;
      transform: scale(1.05);
    }

    @media (max-width: 1024px) {
      .floating-side-rail { right: 1rem; }
      .section-content {
        padding-right: 3.5rem; /* Clear tablet floating side-rail + 16px safety gap (16px right + 24px dot + 16px gap) */
      }
      .bridge-heading { font-size: 2.75rem; }
    }

    @media (max-width: 768px) {
      .snap-container { scroll-snap-type: none; overflow-y: visible; height: auto; }
      .snap-section { min-height: auto; padding: 4rem 0; scroll-snap-align: none; }
      .floating-side-rail { display: none; }
      .section-content { padding-right: 1.5rem; } /* Restore default mobile padding since nav is hidden */
      .hero-content-wrapper { min-height: auto; }
      .bridge-content { min-height: auto; padding-top: 4rem; }
      .bridge-heading { font-size: 2.25rem; }
      .bridge-copy { font-size: 1.1rem; }
    }
  `
})
export default class PortfolioHomeComponent {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private imageUrlService = inject(ImageUrlService);

  readonly projects = signal<Project[]>(
    injectContentFiles<ProjectAttributes>(file => file.filename.includes('projects'))
      .sort((a, b) => a.attributes.order - b.attributes.order)
      .map(project => ({
        title: project.attributes.title,
        description: project.attributes.description,
        imageUrl: this.imageUrlService.resolve(project.attributes.imageUrl),
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

  readonly activeSection = signal<string>('hero');

  readonly navSections = computed(() => {
    // Maps each section ID to its CSS custom property reference.
    // ALL color values live exclusively in styles.css :root — this file holds no hex codes.
    // Rule 16: Map used instead of bracket notation to avoid dynamic property access.
    const pillColors = new Map<string, string>([
      ['hero',              'var(--section-pill-hero)'],
      ['project-0',         'var(--section-pill-pay-with-app)'],
      ['project-1',         'var(--section-pill-fetch-pay)'],
      ['project-2',         'var(--section-pill-isles-at-bayshore)'],
      ['project-3',         'var(--section-pill-plant-me)'],
      ['bridge',            'var(--section-pill-bridge)'],
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
      label: 'Philosophy',
      color: pillColors.get('bridge') ?? 'var(--section-pill-bridge)'
    });

    return sections;
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
        }, { threshold: 0.5 });

        this.document.querySelectorAll('.snap-section').forEach(section => {
          observer.observe(section);
        });
      }
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
}

