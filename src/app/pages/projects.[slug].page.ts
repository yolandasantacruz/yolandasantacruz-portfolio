import { injectContent, MarkdownComponent } from '@analogjs/content';
import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ProjectAttributes } from '../project-attributes';

@Component({
  selector: 'portfolio-project-details',
  standalone: true,
  imports: [AsyncPipe, MarkdownComponent, HeaderComponent, FooterComponent, NgForOf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <portfolio-header />

      @if (project$ | async; as project) {
        <article class="project-article">
          <header class="project-header fade-in-on-load">
            <h1 class="project-title">{{ project.attributes.title }}</h1>
            <p class="project-subtitle">{{ project.attributes.description }}</p>
            
            <div class="project-meta">
              <div class="meta-item">
                <span class="label">Role</span>
                <span class="value">{{ project.attributes.role }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Timeline</span>
                <span class="value">{{ project.attributes.timeline }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Tech Stack</span>
                <div class="tech-tags">
                  @for (tech of project.attributes.techStack; track tech) {
                    <span class="tech-tag">{{ tech }}</span>
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
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
    }

    .value {
      font-size: 1rem;
      font-weight: 400;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tech-tag {
      font-size: 0.875rem;
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
  readonly project$ = injectContent<ProjectAttributes>({ param: 'slug', subdirectory: 'projects' });
}
