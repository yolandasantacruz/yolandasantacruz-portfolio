import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { HeroComponent } from '../components/hero/hero.component';
import { ProjectCardComponent, Project } from '../components/project-card/project-card.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';

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
  projects: Project[] = [
    {
      title: 'Pay with App',
      description: 'Redesigned the transaction flow leading to a 50% drop in dispute rates and a 92% reduction in dispute-related costs.',
      imageUrl: 'https://placehold.co/500x400/2a2a2a/55c5c7?text=Pay+with+App',
      link: '/projects/pay-with-app',
      align: 'right'
    },
    {
      title: 'Fetch Pay',
      description: 'Increasing user sign-ups by 20%, reducing activation costs by 32%, and boosting card activations by 35%.',
      imageUrl: 'https://placehold.co/500x400/2a2a2a/55c5c7?text=Fetch+Pay',
      link: '/projects/fetch-pay',
      reverse: true,
      align: 'left'
    },
    {
      title: 'Isles at<br/>Bayshore',
      description: 'Boosting lead generation by 125% through UX/UI enhancements.',
      imageUrl: 'https://placehold.co/500x400/2a2a2a/55c5c7?text=Isles+at+Bayshore',
      link: '/projects/isles-at-bayshore',
      align: 'right'
    },
    {
      title: 'Plant Me',
      description: 'Designed a BtoC experience for a D2C app.',
      imageUrl: 'https://placehold.co/500x400/2a2a2a/55c5c7?text=Plant+Me',
      link: '/projects/plant-me',
      reverse: true,
      align: 'left'
    }
  ];
}

