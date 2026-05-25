import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HeroData, SocialsData, SocialLink } from '../../pages/about.types';
import { SocialIconService } from '../../services/social-icon.service';



@Component({
  selector: 'portfolio-about-hero',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as hero) {
      <section class="about-hero">
        <div class="hero-left">
          <h1 class="hero-greeting">{{ hero.greeting }}</h1>
          <p class="hero-mission">{{ hero.mission }}</p>
          @if (socialLinks().length > 0) {
            <div class="social-links">
              @for (link of socialLinks(); track link.platform) {
                <a [href]="link.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="link.label" class="social-btn">
                  @if (iconPath(link.platform); as path) {
                    <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon"><path [attr.d]="path"/></svg>
                  }
                </a>
              }
            </div>
          }
        </div>
        <div class="hero-right">
          <div class="portrait-wrapper">
            <img src="/images/AboutMe-Image.png" alt="Yolanda Santa Cruz's image" class="hero-portrait" />
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
  socials = input<SocialsData | undefined>();
  private socialIconService = inject(SocialIconService);

  /** Resolved list of social links from the socials input */
  socialLinks = computed<SocialLink[]>(() => this.socials()?.links ?? []);

  /** Retrieves the SVG path for a given platform name from the shared icon registry */
  iconPath(platform: string): string | undefined {
    return this.socialIconService.getPath(platform);
  }
}

