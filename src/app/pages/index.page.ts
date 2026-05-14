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
    <div class="landing-container">
      <portfolio-header />
      <portfolio-hero />
      <portfolio-scroll-to-top />

      <section class="projects">
        @for (project of projects; track project.title) {
          <portfolio-project-card [project]="project" />
        } @empty {
          <p class="no-projects">No projects found. Check content directory.</p>
        }
      </section>

      <portfolio-footer />
    </div>
  `,
  styles: `
    .landing-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
      font-family: 'Inter', sans-serif;
    }
    @media (prefers-color-scheme: dark) {
      .landing-container { color: #f9f9f9; }
    }
    .projects { display: flex; flex-direction: column; gap: 8rem; margin-bottom: 6rem; }
  `
})
export default class PortfolioHomeComponent {
  readonly projects: Project[] = injectContentFiles<ProjectAttributes>(file => file.filename.includes('projects'))
    .map(project => ({
      title: project.attributes.title,
      description: project.attributes.description,
      imageUrl: project.attributes.imageUrl,
      link: `/projects/${project.attributes.slug}`,
      align: project.attributes.align,
      reverse: project.attributes.reverse
    }));
}

