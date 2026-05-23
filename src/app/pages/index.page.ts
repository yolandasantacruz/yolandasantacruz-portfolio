import { ChangeDetectionStrategy, Component, computed, signal, afterNextRender, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
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

      <!-- About Me Bridge Section (Snap 5) -->
      <section id="bridge" class="snap-section bridge-section">
        <div class="section-content bridge-content">
          @if (bridgeData) {
            <div class="bridge-card">
              <span class="bridge-tag">{{ bridgeData.tag }}</span>
              <h2 class="bridge-heading">{{ bridgeData.heading }}</h2>
              <p class="bridge-copy">
                {{ bridgeData.description }}
              </p>
              <a routerLink="/about" class="bridge-cta">
                Explore My Story <span class="arrow">&rarr;</span>
              </a>
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

    #project-0 {
      background: #e6fff1;
      background: linear-gradient(180deg, rgba(230, 255, 241, 0) 0%, rgba(204, 242, 237, 0.64) 16%, rgba(204, 242, 236, 0.76) 83%, rgba(255, 244, 207, 0.8) 100%);
      transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #project-1 {
      background: #e3f4ff;
      background: linear-gradient(0deg, rgba(227, 244, 255, 1) 1%, rgba(255, 247, 214, 0.76) 33%, rgba(255, 244, 207, 0.8) 100%);
      transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #project-2 {
      background: #e3f4ff;
      background: linear-gradient(180deg, rgba(227, 244, 255, 1) 1%, rgba(171, 233, 255, 0.69) 86%, rgba(207, 255, 237, 0.8) 100%);
      transition: background 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #project-3 {
      background: #EDFBF9;
      background: linear-gradient(0deg, rgba(237, 251, 249, 1) 0%, rgba(174, 245, 176, 0.48) 28%, rgba(207, 255, 237, 1) 100%);
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
      color: #111;
      font-family: var(--font-header);
      font-size: 0.95rem;
      font-weight: 300;
      letter-spacing: -0.03em;
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
      border-color: color-mix(in srgb, var(--pill-color) 70%, transparent);
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

    /* About Me Bridge Section */
    .bridge-section {
      background: #f0fbf9;
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
      font-weight: 300;
      letter-spacing: -0.02em;
      line-height: 1.2;
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

    .bridge-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: #111a19;
      color: #ffffff;
      padding: 1.1rem 2.5rem;
      border-radius: 100px;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      margin-top: 1rem;
    }

    .bridge-cta:hover {
      background: #5ed6cc;
      color: #111;
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(94, 214, 204, 0.3);
    }

    .bridge-cta .arrow {
      transition: transform 0.3s ease;
      font-size: 1.2rem;
    }

    .bridge-cta:hover .arrow {
      transform: translateX(4px);
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

  readonly activeSection = signal<string>('hero');

  readonly navSections = computed(() => {
    const colors = [
      '#3ED4A2', // Top (Figma signature emerald)
      '#43D3E0', // Project 0
      '#ECC43B', // Project 1
      '#4A82F7', // Project 2
      '#3ED4A2', // Project 3
      '#3B9F98'  // Bridge / Philosophy (matches bridge mint theme)
    ];
    return [
      { id: 'hero', label: 'Top', color: colors[0] },
      ...this.projects().map((p, i) => ({ id: `project-${i}`, label: p.title, color: colors[(i + 1) % colors.length] })),
      { id: 'bridge', label: 'Philosophy', color: colors[(this.projects().length + 1) % colors.length] }
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

