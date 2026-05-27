import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeroData, SocialsData, SocialLink } from '../../pages/about.types';
import { SocialIconService } from '../../services/social-icon.service';
import { ImageUrlService } from '../../services/image-url.service';

@Component({
  selector: 'portfolio-about-hero',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as hero) {
      <section class="about-hero">
        <div class="hero-left">
          <h1 class="hero-greeting">@if (greetingParts().name) {<span class="cohesive-phrase">{{ greetingParts().welcome }}</span><br class="hero-break" /><span class="cohesive-phrase italic-text">{{ greetingParts().name }}</span>@if (greetingParts().smiley) {<span class="greeting-smiley"> {{ greetingParts().smiley }}</span>}} @else {{{ hero.greeting }}}</h1>
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
            <img [ngSrc]="heroPortrait()" width="380" height="380" priority alt="Yolanda Santa Cruz's image" class="hero-portrait" />
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
      font-family: var(--font-header);
      font-size: 3.5rem;
      font-weight: 400;
      letter-spacing: -0.02em;
      line-height: 1.15;
      color: #111;
      margin-bottom: 2rem;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
    }

    .cohesive-phrase {
      display: inline-block;
      white-space: nowrap;
    }

    .italic-text {
      font-style: italic;
    }

    .greeting-smiley {
      margin-left: 0.75rem;
      font-style: normal;
      display: inline-block;
    }

    .hero-mission {
      font-size: 1.3rem;
      font-weight: 300;
      line-height: 1.7;
      color: #555;
      margin-bottom: 3rem;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    .social-links {
      display: flex;
      gap: 1.25rem;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
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
      border: 2px solid rgba(94, 214, 204, 0.3);
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
    }

    @keyframes heroFadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-greeting,
      .hero-mission,
      .social-links,
      .portrait-wrapper {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
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
      .hero-break { display: none; }
      .cohesive-phrase { white-space: normal; display: inline; }
      .portrait-wrapper { width: 280px; }
    }
  `
})
export class AboutHeroComponent {
  data = input<HeroData | undefined>();
  socials = input<SocialsData | undefined>();
  private socialIconService = inject(SocialIconService);
  private imageUrlService = inject(ImageUrlService);

  readonly heroPortrait = computed(() => this.imageUrlService.resolve('/images/AboutMe-Image.webp'));

  /** Resolved list of social links from the socials input */
  socialLinks = computed<SocialLink[]>(() => this.socials()?.links ?? []);


  /** Parse greeting text to split greeting and name with optional smiley */
  readonly greetingParts = computed(() => {
    const greeting = this.data()?.greeting ?? '';
    const commaIndex = greeting.indexOf(',');
    if (commaIndex !== -1) {
      const welcome = greeting.slice(0, commaIndex + 1).trim();
      const rest = greeting.slice(commaIndex + 1).trim();

      const smileyIndex = rest.indexOf(':)');
      if (smileyIndex !== -1) {
        return {
          welcome,
          name: rest.slice(0, smileyIndex).trim(),
          smiley: rest.slice(smileyIndex).trim()
        };
      }

      return {
        welcome,
        name: rest,
        smiley: ''
      };
    }
    return { welcome: greeting, name: '', smiley: '' };
  });

  /** Retrieves the SVG path for a given platform name from the shared icon registry */
  iconPath(platform: string): string | undefined {
    return this.socialIconService.getPath(platform);
  }
}

