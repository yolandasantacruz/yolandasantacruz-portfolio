import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'portfolio-wave-separator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wave-container" aria-hidden="true">
      <svg viewBox="0 0 1200 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="wave-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.1" />
            <stop offset="15%" stop-color="var(--color-accent)" />
            <stop offset="50%" stop-color="#69ffa7" />
            <stop offset="85%" stop-color="var(--color-accent)" />
            <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0.1" />
          </linearGradient>
          <filter id="waveGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path d="M0 20 C 150 40, 150 0, 300 20 C 450 40, 450 0, 600 20 C 750 40, 750 0, 900 20 C 1050 40, 1050 0, 1200 20" 
              stroke="url(#waveGradient)" 
              stroke-width="3" 
              stroke-linecap="round" 
              filter="url(#waveGlow)" />
      </svg>
    </div>
  `,
  styles: `
    .wave-container {
      width: 100%;
      height: 40px;
      margin: 4rem 0 6rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      opacity: 0.8;
      transition: opacity 0.4s ease;
    }

    .wave-container:hover {
      opacity: 1;
    }

    .wave-svg {
      width: 100%;
      max-width: 1200px;
      height: 40px;
    }

    @media (max-width: 768px) {
      .wave-container { margin: 3rem 0 4rem 0; height: 30px; }
      .wave-svg { height: 30px; }
    }
  `
})
export class WaveSeparatorComponent {}
