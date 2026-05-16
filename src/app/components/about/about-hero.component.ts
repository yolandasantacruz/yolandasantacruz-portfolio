import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { HeroData } from '../../pages/about.types';

@Component({
  selector: 'portfolio-about-hero',
  standalone: true,
  imports: [ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as hero) {
      <section class="about-hero" portfolioScrollReveal>
        <div class="hero-left">
          <h1 class="hero-greeting">{{ hero.greeting }}</h1>
          <p class="hero-mission">{{ hero.mission }}</p>
          <div class="social-links">
            @if (hero.socials.linkedin) {
              <a [href]="hero.socials.linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.91h2.79v8.37H6.46v-8.37M7.86 6.32a1.62 1.62 0 0 0-1.63 1.62 1.62 1.62 0 0 0 1.63 1.63 1.62 1.62 0 0 0 1.62-1.63 1.62 1.62 0 0 0-1.62-1.62z"/></svg>
              </a>
            }
            @if (hero.socials.twitter) {
              <a [href]="hero.socials.twitter" target="_blank" rel="noopener noreferrer" aria-label="Twitter" class="social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            }
            @if (hero.socials.dribbble) {
              <a [href]="hero.socials.dribbble" target="_blank" rel="noopener noreferrer" aria-label="Dribbble" class="social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm8.17 7.7a8.55 8.55 0 0 1 .33 2.3 8.35 8.35 0 0 1-.72 3.44c-.3-.14-3.52-1.57-6.22-1.16v-.06a26.24 26.24 0 0 0 1.54-6.42 16.7 16.7 0 0 1 5.07 1.9zm-8.17-6.2a8.5 8.5 0 0 1 5.62 2.1c-1.32.96-3.78 1.66-5.48 1.83a28.44 28.44 0 0 0-3.32-5.75A8.34 8.34 0 0 1 12 3.5zm-5 2.53a8.4 8.4 0 0 1 3.5-1.58c1.1 1.76 2.17 3.84 2.8 5.34-3.38.8-6.8 1-7.85 1a8.45 8.45 0 0 1 1.55-4.76zm-1.5 6c1.1-.03 4.8-.23 8.4-1.14a28.2 28.2 0 0 1-1.36 5.66 18.15 18.15 0 0 1-5.7 1.7 8.5 8.5 0 0 1-1.34-6.22zm6.85 7.17a15.7 15.7 0 0 0 5-1.5 15.4 15.4 0 0 0 2.45 2.1 8.5 8.5 0 0 1-7.45-.6z"/></svg>
              </a>
            }
          </div>
        </div>
        <div class="hero-right">
          <div class="portrait-wrapper">
            <img src="/images/yolanda_portrait.png" alt="Yolanda Santa Cruz" class="hero-portrait" />
            <div class="portrait-glow"></div>
          </div>
        </div>
      </section>
    }
  `,
  styles: `
    .about-hero {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 6rem;
      align-items: center;
      margin-bottom: 10rem;
    }

    .hero-greeting {
      font-size: 3.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: #111;
      margin-bottom: 2rem;
    }

    .hero-mission {
      font-size: 1.3rem;
      font-weight: 300;
      line-height: 1.7;
      color: #555;
      margin-bottom: 3rem;
    }

    .social-links {
      display: flex;
      gap: 1.25rem;
    }

    .social-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      transition: all 0.25s ease;
      background: transparent;
    }

    .social-btn:hover {
      border-color: #5ed6cc;
      background: #5ed6cc;
      color: #111;
      transform: translateY(-2px);
    }

    .social-icon {
      width: 20px;
      height: 20px;
    }

    .hero-right {
      display: flex;
      justify-content: center;
      position: relative;
    }

    .portrait-wrapper {
      position: relative;
      width: 380px;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
      border: 2px solid rgba(94, 214, 204, 0.3);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .portrait-wrapper:hover {
      transform: scale(1.02);
      border-color: #5ed6cc;
    }

    .hero-portrait {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      .about-hero {
        grid-template-columns: 1fr;
        gap: 3rem;
        margin-bottom: 6rem;
      }
      .hero-greeting { font-size: 2.5rem; }
      .portrait-wrapper { width: 280px; }
    }
  `
})
export class AboutHeroComponent {
  data = input<HeroData | undefined>();
}
