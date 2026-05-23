import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';
import { MentorshipSectionComponent } from './mentorship-section.component';

@Component({
  selector: 'portfolio-home-mentorship',
  standalone: true,
  imports: [ScrollRevealDirective, MentorshipSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="full-width-mentorship-section" portfolioScrollReveal>
      <!-- Top Wave Border -->
      <div class="wave-container top-wave" aria-hidden="true">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" class="wave-svg">
          <path d="M 0 30 C 150 50, 150 50, 300 30 C 450 10, 450 10, 600 30 C 750 50, 750 50, 900 30 C 1050 10, 1050 10, 1200 30 L 1200 60 L 0 60 Z" class="wave-fill" stroke="none" />
        </svg>
      </div>

      <div class="mentorship-content-container">
        <!-- Section Header -->
        <div class="section-header">
          <div class="subtitle">
            <span class="dash"></span>
            LEADERSHIP & COMMUNITY
          </div>
          <h2 class="main-title">Mentorship</h2>
        </div>

        <portfolio-mentorship-section />
      </div>
    </section>
  `,
  styles: `
    .full-width-mentorship-section {
      position: relative;
      width: 100vw;
      left: 50%;
      right: 50%;
      margin-left: -50vw;
      margin-right: -50vw;
      background: linear-gradient(180deg, rgba(240, 251, 249, 1) 0%, rgba(240, 251, 249, 0.4) 100%);
      margin-top: 0;
      margin-bottom: 0;
      padding: 4rem 0;
    }

    .wave-container {
      position: absolute;
      left: 0;
      width: 100%;
      height: 48px;
      overflow: hidden;
      line-height: 0;
      z-index: 1;
    }

    .top-wave {
      top: -47px;
    }

    .wave-svg {
      width: 100%;
      height: 48px;
      display: block;
    }

    .wave-fill {
      fill: #f0fbf9;
    }

    .mentorship-content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 5rem 0 2rem;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    /* Section Header */
    .section-header {
      margin-bottom: 3rem;
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
      margin-bottom: 1.25rem;
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

    @media (max-width: 1024px) {
      .mentorship-content-container {
        padding: 0 3.5rem 0 2rem;
      }
    }

    @media (max-width: 768px) {
      .full-width-mentorship-section {
        padding: 4rem 0;
        margin-top: 8rem;
        margin-bottom: 0;
      }
      .mentorship-content-container {
        padding: 0 1.5rem;
      }
    }
  `
})
export class MentorshipComponent {}
