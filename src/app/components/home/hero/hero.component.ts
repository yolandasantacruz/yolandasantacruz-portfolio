import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeHeroData } from '../../../models/home.types';

@Component({
  selector: 'portfolio-hero',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <!-- Background glowing cursor trace ribbon -->
      <div class="hero-bg-trace">
        <svg width="1244" height="779" viewBox="0 0 1244 779" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="f-blur" x="-250" y="-600" width="1800" height="1400" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation="70"/>
            </filter>
            <linearGradient id="g-trace" x1="1400" y1="-505" x2="-150" y2="667" gradientUnits="userSpaceOnUse">
              <stop stop-color="#8AE7DA"/>
              <stop offset="0.5" stop-color="#E2F6BC"/>
              <stop offset="1" stop-color="#FCFBE9"/>
            </linearGradient>
          </defs>
          <!-- soft outer glow layer 1 -->
          <path opacity="0.9" filter="url(#f-blur)" d="M -150,667 L 0,651.5 C 257.667 624.667 898 432 1159 -55 L 1400,-505" stroke="url(#g-trace)" stroke-width="140"/>
          <!-- soft outer glow layer 2 (doubles the glow intensity) -->
          <path opacity="0.9" filter="url(#f-blur)" d="M -150,667 L 0,651.5 C 257.667 624.667 898 432 1159 -55 L 1400,-505" stroke="url(#g-trace)" stroke-width="140"/>
          <!-- mid diffuse band -->
          <path opacity="0.55" d="M -150,667 L 0,651.5 C 257.667 624.667 898 432 1159 -55 L 1400,-505" stroke="url(#g-trace)" stroke-width="140"/>
          <!-- sharp bright core -->
          <path d="M -150,667 L 0,651.5 C 257.667 624.667 898 432 1159 -55 L 1400,-505" stroke="url(#g-trace)" stroke-width="80"/>
        </svg>
      </div>


      <div class="hero-content">
        <span class="hero-tag text-eyebrow">{{ data().tag }}</span>
        <h1 class="hero-hook">@if (hookParts().highlight) {<span class="cohesive-phrase">{{ hookParts().main }}</span><br class="hero-break" /><span class="cohesive-phrase italic-text">{{ hookParts().highlight }}</span>} @else {{{ data().hook }}}</h1>
        <p class="hero-subcopy">{{ data().subcopy }}</p>
        <div class="about-button-wrapper">
          <a routerLink="/about" class="btn-blob about-button">ABOUT ME</a>
        </div>
      </div>
    </section>
  `,
  styles: `

    @keyframes traceFloat {
      0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
      50% { transform: translateY(-15px) scale(1.03) rotate(1deg); }
    }

    .hero {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      position: static;
    }

    .hero-bg-trace {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-bg-trace svg {
      width: 100%;
      height: 100%;
      min-width: 1000px;
      animation: traceFloat 8s ease-in-out infinite;
      transform-origin: center;
      will-change: transform;
      overflow: visible;
    }

    .hero-content {
      width: 100%;
      max-width: 960px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      position: relative;
      z-index: 10;
    }
    .hero-tag {
      margin-bottom: 2rem;
      display: inline-block;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
    }

    .hero-hook {
      font-family: var(--font-header);
      font-size: 4.5rem;
      font-weight: 400;
      letter-spacing: -0.02em;
      line-height: 1.15;
      color: #111;
      margin: 0 0 2.5rem 0;
      opacity: 0;
      text-wrap: balance;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    .cohesive-phrase {
      display: inline-block;
      white-space: nowrap;
    }

    .italic-text {
      font-style: italic;
    }

    .hero-subcopy {
      font-size: 1.25rem;
      line-height: 1.8;
      color: #555;
      margin: 0 0 3.5rem 0;
      font-weight: 300;
      max-width: 800px;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
    }

    .about-button-wrapper {
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
    }

    /* Width override for the hero CTA — global .btn-blob defaults to 200px */
    .about-button {
      --btn-blob-width: 180px;
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-tag, .hero-hook, .hero-subcopy, .about-button-wrapper, .hero-bg-trace svg {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }

    @media (max-width: 1024px) {
      .hero-hook { font-size: 3.5rem; }
    }

    @media (max-width: 768px) {
      .hero-hook { font-size: 2.75rem; }
      .hero-subcopy { font-size: 1.2rem; }
      .hero-break { display: none; }
      .cohesive-phrase { white-space: normal; display: inline; }
    }
  `
})
export class HeroComponent {
  readonly data = input.required<HomeHeroData>();

  readonly hookParts = computed(() => {
    const hook = this.data()?.hook ?? '';
    const commaIndex = hook.indexOf(',');
    if (commaIndex !== -1) {
      return {
        main: hook.slice(0, commaIndex + 1).trim(),
        highlight: hook.slice(commaIndex + 1).trim()
      };
    }
    return { main: hook, highlight: '' };
  });
}
