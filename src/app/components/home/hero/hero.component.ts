import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeHeroData } from '../../../pages/home.types';

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
            <filter id="f-blur" x="-107.25" y="-188.066" width="1427.95" height="1009.19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation="70"/>
            </filter>
            <linearGradient id="g-trace" x1="1159" y1="-68.5" x2="0" y2="651.5" gradientUnits="userSpaceOnUse">
              <stop stop-color="#8AE7DA"/>
              <stop offset="0.5" stop-color="#E2F6BC"/>
              <stop offset="1" stop-color="#FCFBE9"/>
            </linearGradient>
          </defs>
          <!-- soft outer glow layer 1 -->
          <path opacity="0.9" filter="url(#f-blur)" d="M0 651.5C257.667 624.667 898 432 1159 -55" stroke="url(#g-trace)" stroke-width="140"/>
          <!-- soft outer glow layer 2 (doubles the glow intensity) -->
          <path opacity="0.9" filter="url(#f-blur)" d="M0 651.5C257.667 624.667 898 432 1159 -55" stroke="url(#g-trace)" stroke-width="140"/>
          <!-- mid diffuse band -->
          <path opacity="0.55" d="M0 651.5C257.667 624.667 898 432 1159 -55" stroke="url(#g-trace)" stroke-width="140"/>
          <!-- sharp bright core -->
          <path d="M0 651.5C257.667 624.667 898 432 1159 -55" stroke="url(#g-trace)" stroke-width="80"/>
        </svg>

      </div>

      <div class="hero-content">
        <span class="hero-tag">{{ data().tag }}</span>
        <h1 class="hero-hook">@if (hookParts().highlight) {<span class="cohesive-phrase">{{ hookParts().main }}</span><br class="hero-break" /><span class="cohesive-phrase italic-text">{{ hookParts().highlight }}</span>} @else {{{ data().hook }}}</h1>
        <p class="hero-subcopy">{{ data().subcopy }}</p>
        <div class="about-button-wrapper">
          <a routerLink="/about" class="about-button">ABOUT ME</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    @keyframes heroFadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes traceFloat {
      0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
      50% { transform: translateY(-15px) scale(1.03) rotate(1deg); }
    }

    @keyframes blob-morph {
      0%, 100% {
        border-radius: 55% 45% 70% 30% / 45% 55% 45% 55%;
      }
      33% {
        border-radius: 65% 35% 50% 50% / 55% 35% 65% 45%;
      }
      66% {
        border-radius: 45% 55% 35% 65% / 40% 65% 35% 60%;
      }
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
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #3b9f98;
      text-transform: uppercase;
      margin-bottom: 2rem;
      display: inline-block;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
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
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
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
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
    }

    .about-button-wrapper {
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
    }

    .about-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 200, 201, 0.1);
      color: #3b9f98;
      width: 180px;
      height: 76px;
      font-family: var(--font-main);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-decoration: none;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid transparent;
      animation: blob-morph 6s ease-in-out infinite alternate;
    }

    .about-button:hover {
      background: rgba(0, 200, 201, 0.2);
      color: #3b9f98;
      transform: scale(1.05);
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-tag, .hero-hook, .hero-subcopy, .about-button-wrapper, .about-button, .hero-bg-trace svg {
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
      .hero-subcopy { font-size: 1.1rem; }
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
