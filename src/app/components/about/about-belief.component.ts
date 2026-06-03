import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'portfolio-about-belief',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (quoteText()) {
      <section class="belief-section text-center">
        <blockquote class="belief-statement text-4xl">"{{ quoteText() }}"</blockquote>
        <div class="belief-dash"></div>
      </section>
    }
  `,
  styles: `
    .belief-section {
      max-width: 900px;
      margin: 0 auto 16rem auto;
      padding: 6rem 2rem;
    }

    .belief-statement {
      font-weight: 300;
      line-height: 1.35;
      letter-spacing: -0.02em;
      color: #111;
      margin: 0 0 3rem 0;
      padding: 0;
      border: none;
    }

    .belief-dash {
      width: 60px;
      height: 2px;
      background: #5ed6cc;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .belief-section { margin-bottom: 12rem; }
      .belief-statement { font-size: 2rem; }
    }
  `
})
export class AboutBeliefComponent {
  /** Raw markdown body from injectContent — starts with "> " blockquote marker */
  content = input<string>('');

  /** Extracts plain text from the pre-rendered HTML that injectContent returns */
  readonly quoteText = computed(() =>
    this.content().trim().replace(/<[^>]+>/g, '').trim()
  );
}
