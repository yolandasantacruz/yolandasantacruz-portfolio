import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
        <h1 class="hero-hook">{{ data().hook }}</h1>
        <p class="hero-subcopy">{{ data().subcopy }}</p>
        <a routerLink="/about" class="about-button">About Me <span class="arrow">&rarr;</span></a>
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
      font-size: 4.5rem;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: #111;
      margin: 0 0 2.5rem 0;
      opacity: 0;
      text-wrap: balance;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
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

    .about-button {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: #111a19;
      color: #ffffff;
      padding: 1rem 2.25rem;
      border-radius: 100px;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid transparent;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
    }
    .about-button:hover {
      background: #5ed6cc;
      color: #111;
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(94, 214, 204, 0.3);
    }

    .about-button .arrow {
      transition: transform 0.3s ease;
      font-size: 1.2rem;
    }

    .about-button:hover .arrow {
      transform: translateX(4px);
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-tag, .hero-hook, .hero-subcopy, .about-button, .hero-bg-trace svg {
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
    }
  `
})
export class HeroComponent {
  readonly data = input.required<HomeHeroData>();
}
