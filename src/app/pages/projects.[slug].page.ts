import { injectContent, injectContentFiles, MarkdownComponent, ContentFile } from '@analogjs/content';
import { ChangeDetectionStrategy, Component, inject, effect, signal, DestroyRef, computed } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';
import { ProjectAttributes } from '../models/project-attributes';

@Component({
  selector: 'portfolio-project-details',
  standalone: true,
  imports: [MarkdownComponent, HeaderComponent, FooterComponent, ScrollRevealDirective, RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <portfolio-header />

      <main class="project-main">
        @if (project(); as project) {
          <article class="project-article">
            <header class="project-header fade-in-on-load">
              <h1 class="project-title">{{ project.attributes.title }}</h1>
              <p class="project-subtitle">{{ project.attributes.description }}</p>
              
              <dl class="project-meta">
                <div class="meta-item flex flex-col">
                  <dt class="label">Role</dt>
                  <dd class="value text-base font-normal">{{ project.attributes.role }}</dd>
                </div>
                <div class="meta-item flex flex-col">
                  <dt class="label">Timeline</dt>
                  <dd class="value text-base font-normal">{{ project.attributes.timeline }}</dd>
                </div>
                <div class="meta-item flex flex-col">
                  <dt class="label">Team</dt>
                  <dd class="value text-base font-normal">
                    <ul class="team-members flex flex-wrap">
                      @for (member of project.attributes.team; track member) {
                        <li class="team-member text-base">{{ member }}</li>
                      }
                    </ul>
                  </dd>
                </div>
              </dl>
            </header>

            <div class="project-content" portfolioScrollReveal>
              <analog-markdown [content]="project.content" />
            </div>
          </article>
        }

        @if (otherProjects().length > 0) {
          <section class="other-projects-section" portfolioScrollReveal>
            <hr class="section-divider" />
            <header class="other-projects-header">
              <span class="section-tag text-base font-bold">More Case studies</span>
              <h2 class="other-projects-heading text-4xl">Check out my other projects</h2>
            </header>

            <div class="works-grid">
              @for (other of otherProjects(); track other.attributes.slug) {
                <a [routerLink]="['/projects', other.attributes.slug]" class="work-card flex flex-col gap-6">
                  <div class="work-thumb-box">
                    <img [ngSrc]="other.attributes.imageUrl" fill [alt]="other.attributes.title" class="work-thumb" ngSrcset="400w, 800w, 1200w" sizes="(max-width: 768px) 100vw, 400px" />
                  </div>
                  <div class="work-info flex flex-col">
                    <h3 class="work-title text-lg m-0">{{ other.attributes.title }}</h3>
                    <p class="work-desc text-base color-text-muted m-0">{{ other.attributes.description }}</p>
                  </div>
                </a>
              }
            </div>
          </section>
        }
      </main>

      <portfolio-footer />
    </div>
  `,
  styles: `
    .project-main {
      max-width: var(--project-max-width);
      margin: 0 auto;
    }

    .project-article {
      margin-top: 4rem;
      margin-bottom: 8rem;
    }

    .project-header {
      margin-bottom: 6rem;
    }

    .project-title {
      font-size: var(--text-6xl);
      margin-bottom: 0.5rem;
      font-weight: 400;
    }

    .project-subtitle {
      font-size: var(--text-lg);
      color: var(--color-text-muted);
      max-width: 900px;
      margin-bottom: 3.5rem;
      line-height: 1.4;
      font-weight: 400;
    }

    .project-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      padding-top: 3rem;
      border-top: 1px solid rgba(0,0,0,0.1);
      margin: 0;
    }

    .meta-item {
      gap: 0.5rem;
    }

    .meta-item dd {
      margin: 0;
    }

    .label {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
    }

    .team-members {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 0.5rem;
    }

    .team-member {
      color: var(--color-text);
    }

    .project-content {
      max-width: 100%;
    }

    .other-projects-section {
      margin-top: 6rem;
      margin-bottom: 4rem;
    }

    .section-divider {
      border: 0;
      height: 1px;
      background: rgba(0, 0, 0, 0.1);
      margin-bottom: 6rem;
    }

    .section-tag {
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--color-primary);
      margin-bottom: 1rem;
      display: inline-block;
    }

    .other-projects-heading {
      font-weight: 400;
      letter-spacing: -0.02em;
      color: var(--color-text);
      margin-bottom: 4rem;
    }

    .works-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }

    .work-card {
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .work-thumb-box {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      border-radius: 12px;
      overflow: hidden;
      background: color-mix(in srgb, var(--color-text) 5%, transparent);
    }

    .work-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(1);
      transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .work-card:hover .work-thumb {
      filter: brightness(1.05);
      transform: scale(1.05);
    }

    .work-info {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .work-title {
      color: var(--color-text);
      font-size: var(--text-lg);
      line-height: 1.3;
      transition: color 0.2s ease;
      margin: 0;
    }

    .work-card:hover .work-title {
      color: var(--color-primary);
    }

    .work-desc {
      font-size: var(--text-base);
      color: var(--color-text-muted);
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 1024px) {
      .works-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .project-title { font-size: var(--text-3xl); }
      .project-subtitle { font-size: var(--text-md); }
      .project-header { margin-bottom: 4rem; }
      .works-grid {
        grid-template-columns: 1fr;
      }
      .other-projects-section {
        margin-top: 4rem;
      }
      .section-divider {
        margin-bottom: 4rem;
      }
      .other-projects-heading {
        font-size: var(--text-2xl);
        margin-bottom: 3rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .work-thumb {
        transition: none !important;
        transform: none !important;
      }
    }
  `,
})
export default class ProjectDetails {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  readonly project = signal<ContentFile<ProjectAttributes | Record<string, never>> | null>(null);

  readonly allProjects = signal<ContentFile<ProjectAttributes>[]>(
    injectContentFiles<ProjectAttributes>(file => file.filename.includes('projects'))
  );

  readonly otherProjects = computed(() => {
    const currentSlug = this.project()?.attributes.slug;
    if (!currentSlug) return [];
    return this.allProjects()
      .filter(p => p.attributes.slug !== currentSlug)
      .sort((a, b) => a.attributes.order - b.attributes.order);
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    const projectSub = injectContent<ProjectAttributes>({ param: 'slug', subdirectory: 'projects' }).subscribe(p => {
      this.project.set(p);
    });
    destroyRef.onDestroy(() => projectSub.unsubscribe());

    effect(() => {
      const p = this.project();
      if (p) {
        this.titleService.setTitle(`${p.attributes.title} | Yolanda Santa Cruz`);
        this.metaService.updateTag({
          name: 'description',
          content: p.attributes.description || `Case study on ${p.attributes.title} by Yolanda Santa Cruz.`
        });
      }
    });
  }
}

