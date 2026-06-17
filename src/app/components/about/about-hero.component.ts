import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeroData, SocialsData, SocialLink } from '../../models/about.types';
import { AboutSocialIconService } from '../../pages/about-social-icon.service';

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
                <a [href]="link.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="link.label" [class]="'social-btn btn-circle flex items-center justify-center ' + link.platform">
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
      font-size: var(--text-hero);
      font-weight: 400;
      letter-spacing: -0.02em;
      line-height: 1.15;
      color: var(--color-text);
      margin-bottom: 2.5rem;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
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
      font-size: var(--text-md);
      font-weight: 300;
      line-height: 1.7;
      color: var(--color-text-muted);
      margin-bottom: 3.5rem;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
    }

    .social-links {
      display: flex;
      gap: 1.25rem;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
    }



    .social-btn.linkedin:hover {
      background: var(--color-brand-linkedin);
      color: var(--section-bg-hero);
    }

    .social-btn.github:hover {
      background: var(--color-brand-github);
      color: var(--section-bg-hero);
    }

    .social-btn.twitter:hover {
      background: var(--color-brand-x);
      color: var(--color-bg-contrast);
    }

    .social-btn.behance:hover {
      background: var(--color-brand-behance);
      color: var(--color-bg-contrast);
    }

    .social-btn.dribbble:hover {
      background: var(--color-brand-dribbble);
      color: var(--color-bg-contrast);
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
      width: 400px;
      opacity: 0;
      transform: translateY(30px);
      will-change: transform, opacity;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
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
      width: 80px;
      height: 80px;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(12.5px);
      will-change: transform;
      transform: scale(4) translateZ(0); /* Force GPU compositing and scale up from 25% */
      opacity: 0.85;
    }

    .portrait-glow::before {
      background: rgba(0, 162, 154, 0.35);
      bottom: -20px;
      right: -20px;
      transform-origin: bottom right;
    }

    .portrait-glow::after {
      background: var(--color-bg-resume);
      top: -20px;
      left: -20px;
      transform-origin: top left;
    }

    @media (max-width: 768px) {
      .about-hero {
        grid-template-columns: 1fr;
        gap: 4rem;
        margin-bottom: 10rem;
      }
      .cohesive-phrase { white-space: normal; display: inline; }
      .portrait-wrapper { width: 280px; }
      .portrait-glow {
        display: none !important; /* Hide image glows on mobile devices to prevent performance degradation */
      }
    }
  `
})
export class AboutHeroComponent {
  data = input<HeroData | undefined>();
  socials = input<SocialsData | undefined>();
  private socialIconService = inject(AboutSocialIconService);
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

