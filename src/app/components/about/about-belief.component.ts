import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BeliefData } from '../../pages/about.types';

@Component({
  selector: 'portfolio-about-belief',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as belief) {
      <section class="belief-section">
        <h2 class="belief-statement">
          "{{ belief.statement }}"
        </h2>
        <div class="belief-dash"></div>
      </section>
    }
  `,
  styles: `
    .belief-section {
      text-align: center;
      max-width: 900px;
      margin: 0 auto 12rem auto;
      padding: 4rem 2rem;
    }

    .belief-statement {
      font-size: 2.75rem;
      font-weight: 300;
      line-height: 1.35;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 3rem;
    }

    .belief-dash {
      width: 60px;
      height: 2px;
      background: #5ed6cc;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .belief-section { margin-bottom: 8rem; }
      .belief-statement { font-size: 2rem; }
    }
  `
})
export class AboutBeliefComponent {
  data = input<BeliefData | undefined>();
}
