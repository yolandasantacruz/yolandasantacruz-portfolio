import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { PillarsData } from '../../pages/about.types';

@Component({
  selector: 'portfolio-about-pillars',
  standalone: true,
  imports: [ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as pillars) {
      <section class="dual-pillars-section">
        <!-- Pillar 1: At Work -->
        <div class="pillar-row pillar-work" portfolioScrollReveal>
          <div class="pillar-text">
            <span class="pillar-badge">{{ pillars.work.badge }}</span>
            <h3 class="pillar-title">{{ pillars.work.title }}</h3>
            <p class="pillar-desc">{{ pillars.work.description }}</p>
            
            @if (pillars.work.competencies) {
              <div class="competencies">
                @for (comp of pillars.work.competencies; track comp.label) {
                  <div class="competency-item">
                    <span class="comp-label">{{ comp.label }}</span>
                    <span class="comp-val">{{ comp.value }}</span>
                  </div>
                }
              </div>
            }
          </div>
          <div class="pillar-visual">
            <div class="masked-image arch-mask">
              <img src="https://placehold.co/800x1000/1e293b/5ed6cc?text=Systems+Thinking" alt="Design Execution" />
            </div>
          </div>
        </div>

        <!-- Pillar 2: Philosophy & Mentorship -->
        <div class="pillar-row pillar-philosophy" portfolioScrollReveal>
          <div class="pillar-visual">
            <div class="masked-image pill-mask">
              <img src="https://placehold.co/800x1000/111a19/f5ea8c?text=Mentorship+%26+Culture" alt="Mentorship Philosophy" />
            </div>
          </div>
          <div class="pillar-text">
            <span class="pillar-badge">{{ pillars.philosophy.badge }}</span>
            <h3 class="pillar-title">{{ pillars.philosophy.title }}</h3>
            <p class="pillar-desc">{{ pillars.philosophy.description }}</p>
            
            @if (pillars.philosophy.metrics) {
              <div class="quiet-metrics-box">
                @for (metric of pillars.philosophy.metrics; track metric.label) {
                  <div class="quiet-metric">
                    <span class="metric-num">{{ metric.num }}</span>
                    <span class="metric-label">{{ metric.label }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .dual-pillars-section {
      display: flex;
      flex-direction: column;
      gap: 12rem;
      margin-bottom: 12rem;
    }

    .pillar-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      align-items: center;
    }

    .pillar-badge {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3b9f98;
      margin-bottom: 1rem;
      display: inline-block;
    }

    .pillar-title {
      font-size: 2.5rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 1.5rem;
    }

    .pillar-desc {
      font-size: 1.15rem;
      line-height: 1.8;
      color: #555;
      margin-bottom: 2.5rem;
      font-weight: 300;
    }

    .competencies {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      border-top: 1px solid rgba(0,0,0,0.08);
      padding-top: 2rem;
    }

    .competency-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
    }

    .comp-label {
      font-weight: 600;
      color: #222;
    }

    .comp-val {
      color: #3b9f98;
      font-weight: 500;
      background: rgba(59, 159, 152, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      font-size: 0.8rem;
    }

    .masked-image {
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      background: #f0f0f0;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .masked-image:hover {
      transform: translateY(-8px);
    }

    .arch-mask {
      aspect-ratio: 4 / 5;
      border-radius: 200px 200px 16px 16px;
    }

    .pill-mask {
      aspect-ratio: 4 / 5;
      border-radius: 16px 200px 200px 16px;
    }

    .masked-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s ease;
    }

    .masked-image:hover img {
      transform: scale(1.05);
    }

    .quiet-metrics-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      border-top: 1px solid rgba(0,0,0,0.08);
      padding-top: 2.5rem;
    }

    .quiet-metric {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .metric-num {
      font-size: 2rem;
      font-weight: 300;
      color: #111;
      letter-spacing: -0.03em;
    }

    .metric-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #777;
    }

    @media (max-width: 1024px) {
      .pillar-row { gap: 3rem; }
    }

    @media (max-width: 768px) {
      .dual-pillars-section { gap: 6rem; }
      .pillar-row { grid-template-columns: 1fr; }
      .pillar-work .pillar-visual { order: -1; }
      .quiet-metrics-box { grid-template-columns: 1fr; }
    }
  `
})
export class AboutPillarsComponent {
  data = input<PillarsData | undefined>();
}
