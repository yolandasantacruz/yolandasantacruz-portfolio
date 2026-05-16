import { ChangeDetectionStrategy, Component, computed, signal, afterNextRender, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectContentFiles } from '@analogjs/content';
import { HeaderComponent } from '../components/header/header.component';
import { HeroComponent } from '../components/hero/hero.component';
import { ProjectCardComponent, Project } from '../components/project-card/project-card.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProjectAttributes } from '../project-attributes';

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
          <button class="nav-pill" [class.active]="activeSection() === sec.id" (click)="scrollToSection(sec.id)" [attr.aria-label]="'Scroll to ' + sec.label">
            <span class="pill-dot"></span>
            <span class="pill-label">{{ sec.label }}</span>
          </button>
        }
      </div>

      <!-- Hero Section (Snap 0) -->
      <section id="hero" class="snap-section hero-section">
        <div class="section-content hero-content-wrapper">
          <portfolio-header />
          <portfolio-hero />
        </div>
      </section>

      <!-- Project Sections (Snaps 1 to 4) -->
      @for (project of projects(); track project.title; let i = $index) {
        <section [id]="'project-' + i" class="snap-section project-section">
          <div class="section-content">
            @if (i === 0) {
              <div class="section-header">
                <div class="subtitle">
                  <span class="dash"></span>
                  SELECTED WORK
                </div>
                <h2 class="main-title">Projects that define my craft</h2>
              </div>
            }
            <portfolio-project-card [project]="{ ...project, reverse: i % 2 !== 0 }" />
          </div>
        </section>
      }

      <!-- About Me Bridge Section (Snap 5) -->
      <section id="bridge" class="snap-section bridge-section">
        <div class="section-content bridge-content">
          <div class="bridge-card">
            <span class="bridge-tag">PHILOSOPHY & LEADERSHIP</span>
            <h2 class="bridge-heading">My design philosophy extends far beyond the final execution.</h2>
            <p class="bridge-copy">
              If you would like to explore my approach to leading teams, read my industry articles, view my recorded mentorship sessions, or see what colleagues say about working with me, visit my story.
            </p>
            <a routerLink="/about" class="bridge-cta">
              Explore My Story <span class="arrow">&rarr;</span>
            </a>
          </div>
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
    }

    .snap-section {
      scroll-snap-align: start;
      scroll-snap-stop: normal;
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      box-sizing: border-box;
    }

    .hero-section {
      align-items: flex-start;
      padding-top: 0;
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

    .section-header {
      margin-bottom: 3.5rem;
      text-align: left;
    }

    .subtitle {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }

    .dash {
      width: 40px;
      height: 1px;
      background: #ccc;
    }

    .main-title {
      font-size: 3rem;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0;
      letter-spacing: -0.02em;
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
      gap: 1rem;
      align-items: flex-end;
    }

    .nav-pill {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(0,0,0,0.04);
      border: 1px solid rgba(0,0,0,0.08);
      height: 36px;
      padding: 0 14px;
      border-radius: 100px;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      color: #666;
      font-size: 0.85rem;
      font-weight: 600;
      max-width: 36px;
      overflow: hidden;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }

    .pill-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }

    .pill-label {
      opacity: 0;
      transition: opacity 0.3s ease;
      padding-right: 4px;
    }

    .nav-pill:hover {
      max-width: 280px;
      background: #ffffff;
      border-color: #5ed6cc;
      color: #111;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }

    .nav-pill:hover .pill-dot {
      transform: scale(1.25);
      color: #3b9f98;
    }

    .nav-pill:hover .pill-label {
      opacity: 1;
    }

    .nav-pill.active {
      max-width: 280px;
      background: #111a19;
      border-color: #5ed6cc;
      color: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .nav-pill.active .pill-dot {
      color: #5ed6cc;
      transform: scale(1.25);
    }

    .nav-pill.active .pill-label {
      opacity: 1;
    }

    /* About Me Bridge Section */
    .bridge-section {
      background: #f0fbf9;
      border-top: 1px solid rgba(94, 214, 204, 0.3);
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
      .main-title { font-size: 2.5rem; }
      .bridge-heading { font-size: 2.75rem; }
    }

    @media (max-width: 768px) {
      .snap-container { scroll-snap-type: none; overflow-y: visible; height: auto; }
      .snap-section { min-height: auto; padding: 4rem 0; scroll-snap-align: none; }
      .floating-side-rail { display: none; }
      .hero-content-wrapper { min-height: auto; }
      .bridge-content { min-height: auto; padding-top: 4rem; }
      .bridge-heading { font-size: 2.25rem; }
      .bridge-copy { font-size: 1.1rem; }
    }

    @media (prefers-color-scheme: dark) {
      .main-title, .bridge-heading { color: #f9f9f9; }
      .subtitle, .bridge-copy { color: #bbb; }
      .nav-pill { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #aaa; }
      .nav-pill:hover { background: #111a19; border-color: #5ed6cc; color: #fff; }
      .nav-pill.active { background: #5ed6cc; color: #111; }
      .bridge-section { background: #111a19; border-color: rgba(255,255,255,0.08); }
      .bridge-cta { background: #ffffff; color: #111; }
      .bridge-cta:hover { background: #5ed6cc; color: #111; }
    }
  `
})
export default class PortfolioHomeComponent {
  private platformId = inject(PLATFORM_ID);

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

  readonly activeSection = signal<string>('hero');

  readonly navSections = computed(() => {
    return [
      { id: 'hero', label: 'Top' },
      ...this.projects().map((p, i) => ({ id: `project-${i}`, label: p.title })),
      { id: 'bridge', label: 'Philosophy' }
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

        document.querySelectorAll('.snap-section').forEach(section => {
          observer.observe(section);
        });
      }
    });
  }

  scrollToSection(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

