import { injectContent, MarkdownComponent, ContentFile } from '@analogjs/content';
import { ChangeDetectionStrategy, Component, inject, effect, signal, DestroyRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProjectAttributes } from './project-attributes';

@Component({
  selector: 'portfolio-project-details',
  standalone: true,
  imports: [MarkdownComponent, HeaderComponent, FooterComponent],
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
              
              <div class="project-meta">
                <div class="meta-item flex flex-col">
                  <span class="label">Role</span>
                  <span class="value text-base font-normal">{{ project.attributes.role }}</span>
                </div>
                <div class="meta-item flex flex-col">
                  <span class="label">Timeline</span>
                  <span class="value text-base font-normal">{{ project.attributes.timeline }}</span>
                </div>
                <div class="meta-item flex flex-col">
                  <span class="label">Tech Stack</span>
                  <div class="tech-tags flex flex-wrap">
                    @for (tech of project.attributes.techStack; track tech) {
                      <span class="tech-tag text-base">{{ tech }}</span>
                    }
                  </div>
                </div>
              </div>
            </header>

            <div class="project-content">
              <analog-markdown [content]="project.content" />
            </div>
          </article>
        }
      </main>

      <portfolio-footer />
    </div>
  `,
  styles: `
    .project-article {
      margin-top: 4rem;
      margin-bottom: 8rem;
    }

    .project-header {
      margin-bottom: 6rem;
    }

    .project-title {
      font-size: 4rem;
      margin-bottom: 0.5rem;
      font-weight: 800;
    }

    .project-subtitle {
      font-size: 1.5rem;
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
    }

    .meta-item {
      gap: 0.5rem;
    }

    .label {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
    }

    .tech-tags {
      gap: 0.5rem;
    }

    .tech-tag {
      background: rgba(0,0,0,0.05);
      padding: 2px 10px;
      border-radius: 4px;
    }

    .project-content {
      max-width: 100%;
    }

    @media (max-width: 768px) {
      .project-title { font-size: 2.5rem; }
      .project-subtitle { font-size: 1.25rem; }
      .project-header { margin-bottom: 4rem; }
    }
  `,
})
export default class ProjectDetails {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  readonly project = signal<ContentFile<ProjectAttributes | Record<string, never>> | null>(null);

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

