import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeroData, SocialsData, SocialLink } from '../../pages/about.types';
import { SocialIconService } from '../../services/social-icon.service';

@Component({
  selector: 'portfolio-about-hero',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data(); as hero) {
      <section class="about-hero">
        <div class="hero-left">
          <h1 class="hero-greeting">@if (greetingParts().name) {<span class="cohesive-phrase">{{ greetingParts().welcome }}</span> <br class="hero-break" /> <span class="cohesive-phrase italic-text">{{ greetingParts().name }}</span>@if (greetingParts().smiley) {<span class="greeting-smiley"> {{ greetingParts().smiley }}</span>}} @else {{{ hero.greeting }}}</h1>
          <p class="hero-mission">{{ hero.mission }}</p>
          @if (socialLinks().length > 0) {
            <div class="social-links">
              @for (link of socialLinks(); track link.platform) {
                <a [href]="link.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="link.label" [class]="'social-btn flex items-center justify-center ' + link.platform">
                  @if (iconPath(link.platform); as path) {
                    <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon"><path [attr.d]="path"/></svg>
                  }
                </a>
              }
            </div>
          }
        </div>
        <div class="hero-right flex justify-center relative">
          <div class="portrait-wrapper">
            <img [ngSrc]="heroPortrait()" ngSrcset="400w, 800w" sizes="(max-width: 768px) 280px, 500px" width="795" height="963" priority alt="Yolanda Santa Cruz's image" class="hero-portrait w-full" />
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
      gap: 8rem;
      align-items: center;
      margin-bottom: 16rem;
    }

    .hero-greeting {
      font-family: var(--font-header);
      font-size: 3.5rem;
      font-weight: 400;
      letter-spacing: -0.02em;
      line-height: 1.15;
      color: #111;
      margin-bottom: 2.5rem;
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
      margin-bottom: 3.5rem;
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
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      color: #666;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      background: #ffffff;
      filter: drop-shadow(2px 2px 4px rgba(0, 162, 154, 0.12)) drop-shadow(-2px -2px 4px rgba(184, 156, 224, 0.12));
    }

    .social-btn:hover {
      filter: drop-shadow(3px 3px 6px rgba(0, 162, 154, 0.25)) drop-shadow(-3px -3px 6px rgba(184, 156, 224, 0.25));
    }

    .social-btn.linkedin:hover {
      background: #0077b5;
      color: #ffffff;
    }

    .social-btn.github:hover {
      background: #181717;
      color: #ffffff;
    }

    .social-btn.twitter:hover {
      background: #000000;
      color: #ffffff;
    }

    .social-btn.behance:hover {
      background: #1769ff;
      color: #ffffff;
    }

    .social-btn.dribbble:hover {
      background: #ea4c89;
      color: #ffffff;
    }

    .social-icon {
      width: 18px;
      height: 18px;
      display: block;
    }

    .hero-left {
      position: relative;
      z-index: 10;
    }

    .hero-right {
      position: relative;
      z-index: 1;
    }

    .portrait-wrapper {
      position: relative;
      width: 500px;
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
      height: 100%;
      object-fit: cover;
      filter: brightness(1);
      transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hero-portrait:hover {
      filter: brightness(1.05);
      transform: scale(1.01);
    }

    .portrait-glow {
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
    }

    .portrait-glow::before,
    .portrait-glow::after {
      content: '';
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.85;
    }

    .portrait-glow::before {
      background: radial-gradient(circle, rgba(0, 162, 154, 0.35) 0%, rgba(0, 162, 154, 0) 70%);
      bottom: -20px;
      right: -20px;
    }

    .portrait-glow::after {
      background: radial-gradient(circle, #D2FCA3 0%, rgba(210, 252, 163, 0) 70%);
      top: -20px;
      left: -20px;
    }

    @media (max-width: 768px) {
      .about-hero {
        grid-template-columns: 1fr;
        gap: 4rem;
        margin-bottom: 10rem;
      }
      .hero-greeting { font-size: 2.5rem; }
      .cohesive-phrase { white-space: normal; display: inline; }
      .portrait-wrapper { width: 280px; }
    }
  `
})
export class AboutHeroComponent {
  data = input<HeroData | undefined>();
  socials = input<SocialsData | undefined>();
  private socialIconService = inject(SocialIconService);
  readonly heroPortrait = computed(() => 'images/about/portrait-1.webp');
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

