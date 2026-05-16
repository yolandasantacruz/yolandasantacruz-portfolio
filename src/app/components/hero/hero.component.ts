import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'portfolio-hero',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <!-- Background glowing cursor trace ribbon -->
      <div class="hero-bg-trace">
        <svg viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="traceGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#f7f1cb" stop-opacity="0.15" />
              <stop offset="30%" stop-color="#f5ea8c" stop-opacity="0.5" />
              <stop offset="65%" stop-color="#8edeae" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#5ed6cc" stop-opacity="0.95" />
            </linearGradient>
            <filter id="velvetGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="35" result="blur1" />
              <feGaussianBlur stdDeviation="15" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M -50,580 C 350,520 550,420 800,180 C 900,80 920,20 950,-50" 
                stroke="url(#traceGrad)" stroke-width="90" stroke-linecap="round" filter="url(#velvetGlow)" opacity="0.55" />
          <path d="M -50,580 C 350,520 550,420 800,180 C 900,80 920,20 950,-50" 
                stroke="url(#traceGrad)" stroke-width="45" stroke-linecap="round" filter="url(#velvetGlow)" opacity="0.4" />
        </svg>
      </div>

      <div class="hero-content">
        <span class="hero-tag">YOLANDA SANTA CRUZ | LEAD PRODUCT DESIGNER</span>
        <h1 class="hero-hook">Crafting high-impact digital products & scalable design systems</h1>
        <p class="hero-subcopy">
          With over 14 years of experience in product design and systems architecture, I balance rigorous individual execution with strategic team leadership. I specialize in transforming complex business goals into intuitive, human-centered digital experiences.
        </p>
        <a routerLink="/about" class="about-button">
          About Me <span class="arrow">&rarr;</span>
        </a>
      </div>
      
      <div class="hero-image-container">
        <div class="hero-image-mask">
          <img src="https://placehold.co/500x650/111a19/5ed6cc?text=YSC" alt="Yolanda Santa Cruz" class="profile-image" />
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

    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6rem;
      width: 100%;
      position: relative;
    }

    .hero-bg-trace {
      position: absolute;
      inset: -100px -50px;
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
    }

    .hero-content {
      flex: 1.2;
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
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .hero-hook {
      font-size: 4.25rem;
      font-weight: 300;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: #111;
      margin: 0 0 2.5rem 0;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
    }

    .hero-subcopy {
      font-size: 1.2rem;
      line-height: 1.8;
      color: #555;
      margin: 0 0 3.5rem 0;
      font-weight: 300;
      max-width: 90%;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
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
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
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

    .hero-image-container {
      flex: 0.8;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: relative;
      z-index: 10;
      animation: heroFadeIn 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
    }

    .hero-image-mask {
      width: 100%;
      max-width: 440px;
      aspect-ratio: 4 / 5;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.06);
      position: relative;
    }

    .profile-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hero-image-mask:hover .profile-image {
      transform: scale(1.05);
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-tag, .hero-hook, .hero-subcopy, .about-button, .hero-image-container, .hero-bg-trace svg {
        animation: none !important;
      }
    }

    @media (max-width: 1024px) {
      .hero-hook { font-size: 3.25rem; }
      .hero { gap: 4rem; }
    }

    @media (max-width: 768px) {
      .hero { flex-direction: column; gap: 3rem; }
      .hero-content { width: 100%; flex: none; }
      .hero-subcopy { max-width: 100%; }
      .hero-image-container { width: 100%; justify-content: flex-start; }
      .hero-image-mask { max-width: 100%; aspect-ratio: 16 / 10; }
    }

    @media (prefers-color-scheme: dark) {
      .hero-hook { color: #f9f9f9; }
      .hero-subcopy { color: #bbb; }
      .about-button { background: #ffffff; color: #111; }
      .about-button:hover { background: #5ed6cc; color: #111; }
      .hero-image-mask { border-color: rgba(255,255,255,0.08); box-shadow: 0 25px 60px rgba(0,0,0,0.3); }
      .hero-bg-trace { opacity: 0.65; }
    }
  `
})
export class HeroComponent {}
