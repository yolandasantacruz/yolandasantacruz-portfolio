import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { HeaderComponent } from '../components/header/header.component';
import { HeroComponent } from '../components/hero/hero.component';
import { ProjectCardComponent, Project } from '../components/project-card/project-card.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { ProjectAttributes } from '../project-attributes';

@Component({
  selector: 'portfolio-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    ProjectCardComponent,
    FooterComponent,
    ScrollToTopComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <portfolio-header />
      <portfolio-hero />
      <portfolio-scroll-to-top />

      <section class="projects-section">
        <div class="section-header">
          <div class="subtitle">
            <span class="dash"></span>
            SELECTED WORK
          </div>
          <h1 class="main-title">Projects that define my craft</h1>
        </div>

        <div class="projects-list">
          @for (project of projects; track project.title; let i = $index) {
            <portfolio-project-card [project]="{ ...project, reverse: i % 2 !== 0 }" />
          } @empty {
            <p class="no-projects">No projects found. Check content directory.</p>
          }
        </div>
      </section>

      <portfolio-footer />
    </div>
  `,
  styles: `
    .projects-section {
      margin-top: 8rem;
    }

    .section-header {
      margin-bottom: 6rem;
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

    .projects-list {
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 768px) {
      .landing-container { padding: 0 1.5rem; }
      .main-title { font-size: 2.25rem; }
      .projects-section { margin-top: 4rem; }
    }

    @media (prefers-color-scheme: dark) {
      .landing-container { color: #f9f9f9; }
      .main-title { color: #fff; }
      .subtitle { color: #aaa; }
    }
  `
})
export default class PortfolioHomeComponent {
  readonly projects: Project[] = injectContentFiles<ProjectAttributes>(file => file.filename.includes('projects'))
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
    }));
}

