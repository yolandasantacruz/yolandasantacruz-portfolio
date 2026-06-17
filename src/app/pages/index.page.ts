import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeDataService } from './home-data.service';
import { HeroComponent } from '../components/home/hero/hero.component';
import { ProjectCardComponent } from '../components/home/project-card/project-card.component';
import { FooterComponent } from '../components/footer/footer.component';
import { SideNavComponent } from '../components/side-nav/side-nav.component';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Yolanda Santa Cruz - Product Design Portfolio',
  meta: [
    {
      name: 'description',
      content: 'Professional portfolio of Yolanda Santa Cruz, Product Designer. Discover user-centric interfaces, design systems, and responsive prototypes.'
    },
    { property: 'og:title', content: 'Yolanda Santa Cruz - Product Design Portfolio' },
    { property: 'og:description', content: 'Professional portfolio of Yolanda Santa Cruz, Product Designer. Discover user-centric interfaces, design systems, and responsive prototypes.' },
    { property: 'og:image', content: '/images/og-card.webp' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
};


@Component({
  selector: 'portfolio-home',
  standalone: true,
  imports: [
    RouterLink,
    HeroComponent,
    ProjectCardComponent,
    FooterComponent,
    SideNavComponent,
    ScrollRevealDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="snap-container">
      <!-- Fixed Side Rail Navigation -->
      <portfolio-side-nav 
        [sections]="navSections()" 
        intersectionSelector=".snap-section" 
        [intersectionOptions]="{ threshold: 0.5 }" 
      />

      <!-- Hero Section (Snap 0) -->
      <section id="hero" class="snap-section hero-section flex items-center justify-center">
        <div class="section-content hero-content-wrapper flex flex-col">
          <portfolio-hero [data]="heroData" />
        </div>
      </section>

      <!-- Project Sections (Snaps 1 to 4) -->
      @for (project of projects(); track project.title; let i = $index) {
        <section [id]="'project-' + i" class="snap-section project-section flex items-center justify-center">
          <div class="section-content" portfolioScrollReveal>
            <portfolio-project-card [project]="{ ...project, reverse: i % 2 !== 0 }" [priority]="i === 0" />
          </div>
        </section>
      }

      <!-- About Me Bridge Section (Snap 7) -->
      <section id="bridge" class="snap-section bridge-section flex items-center justify-center">
        <div class="section-content bridge-content flex flex-col" portfolioScrollReveal>
          @if (bridgeData) {
            <div class="bridge-card flex flex-col items-center gap-8">
              <span class="bridge-tag text-base font-bold">{{ bridgeData.tag }}</span>
              <h2 class="bridge-heading text-4xl m-0">{{ bridgeData.heading }}</h2>
              <p class="bridge-copy m-0">
                {{ bridgeData.description }}
              </p>
              <a routerLink="/about" class="btn-blob">TRACE MY PATH</a>
            </div>
          }
          <portfolio-footer />
        </div>
      </section>
    </main>
  `,
  styles: `
    .snap-container {
      width: 100%;
      position: relative;
    }

    .snap-section {
      scroll-snap-align: start;
      scroll-snap-stop: always;
      min-height: 100vh;
      width: 100%;
      box-sizing: border-box;
      padding: 3rem 0;
      content-visibility: auto;
      contain-intrinsic-size: auto 100vh;
    }

    .section-content {
      width: 100%;
      max-width: var(--max-width);
      margin: 0 auto;
      padding: var(--container-padding);
      box-sizing: border-box;
    }

    .hero-section {
      align-items: flex-start;
      padding-top: 0;
      position: relative;
      overflow: hidden;
      background: linear-gradient(
        to bottom,
        transparent                      0%,
        transparent                      85%,
        var(--section-bg-pay-with-app)   100%
      );
    }

    .hero-content-wrapper {
      min-height: 100vh;
      justify-content: flex-start;
      padding-top: calc(80px + 4rem);
    }

    .hero-content-wrapper portfolio-hero {
      flex: 1;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .project-section .section-content,
    .bridge-section .section-content {
      padding-right: 5rem;
    }

    portfolio-hero {
      padding-right: 5rem;
      box-sizing: border-box;
      display: block;
      width: 100%;
    }

    @media (max-width: 1024px) {
      .project-section .section-content,
      .bridge-section .section-content {
        padding-right: 3.5rem;
      }
      portfolio-hero {
        padding-right: 3.5rem;
      }
    }

    @media (max-width: 768px) {
      .project-section .section-content,
      .bridge-section .section-content {
        padding-right: 1.5rem;
      }
      portfolio-hero {
        padding-right: 0;
      }
    }

    .project-section portfolio-project-card {
      margin-bottom: 0 !important;
      width: 100%;
    }

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

    .bridge-section {
      background: linear-gradient(
        to bottom,
        var(--section-bg-plant-me)  0%,
        var(--section-bg-bridge)    6%,
        var(--section-bg-bridge)    100%
      );
      padding-bottom: 0 !important;
    }

    .bridge-content {
      justify-content: space-between;
      min-height: 100vh;
      padding-top: 6rem;
      padding-bottom: 0;
    }

    .bridge-card {
      max-width: 800px;
      margin: auto;
      text-align: center;
    }

    .bridge-tag {
      letter-spacing: 0.2em;
      color: var(--color-primary);
      text-transform: uppercase;
    }

    .bridge-heading {
      font-weight: 400;
      letter-spacing: -0.02em;
      color: var(--color-text);
    }

    .bridge-copy {
      font-size: var(--text-md);
      color: var(--color-text-muted);
      font-weight: 300;
      text-align: center;
      max-width: 620px;
      padding: 60px 0;
    }

    @media (max-width: 768px) {
      .snap-section { min-height: auto; padding: 4rem 0; scroll-snap-align: none; }
      .hero-section { padding-top: 0; }
      .hero-content-wrapper { min-height: auto; }
      .bridge-content { min-height: auto; padding-top: 4rem; }
      .bridge-heading { font-size: var(--text-2xl); }
      .bridge-copy { font-size: var(--text-base); }
    }
  `
})
export default class PortfolioHomeComponent {
  private homeDataService = inject(HomeDataService);

  readonly projects = this.homeDataService.projects;
  readonly heroData = this.homeDataService.heroData;
  readonly bridgeData = this.homeDataService.bridgeData;
  readonly navSections = this.homeDataService.navSections;
}


