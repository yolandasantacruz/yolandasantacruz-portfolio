import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';

@Component({
  selector: 'portfolio-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <div class="logo">
        <a routerLink="/" class="logo-link btn-circle" (click)="scrollToTop($event)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="logo-img" aria-label="Logo" role="img">
            <circle cx="24" cy="24" r="24" fill="#fff"/>
            <path fill="#00a29a" d="m15.6 15.125-.095.112c-1.78 2.157-.144 4.928 2.324 6.243.337.18.695.387 1.08.645 2 1.343 2.929.07 3.499-.5.5-.5.592-1.5.5-2-.09-.492-.868-3-2.175-4.5s-3.825-1.5-5.133 0"/>
            <path fill="#00a29a" d="M34.236 15.125c-1.2-1.2-3.449-1.107-4.5-.5-1.05.607-1.87 1.676-3 4.5-3 7.5-5.236 8-7.5 9-1.649.728-3.5.5-4.5 1.5-.79.79-1.5 3 1 4.5 4.223 2.533 11-6 15-10 3.5-3.5 3-2.5 4-4s1-3.5-.5-5"/>
          </svg>
        </a>
      </div>
      <nav class="nav-links">
        <a routerLink="/" 
           [class.active]="activeIndex() === 0"
           (click)="scrollToTop($event)">
          <span class="nav-text">Work</span>
          <div class="nav-indicator" [class.visible]="activeIndex() === 0">
            <svg viewBox="0 0 100 25" preserveAspectRatio="none" class="nav-indicator-svg">
              <path d="M 14,20 C 3,20 3,6 14,6 C 35,2 65,2 86,6 C 97,6 97,20 86,20 C 65,22 35,22 14,20 Z" class="nav-indicator-path" />
            </svg>
          </div>
        </a>
        <a routerLink="/about" 
           [class.active]="activeIndex() === 1">
          <span class="nav-text">About</span>
          <div class="nav-indicator" [class.visible]="activeIndex() === 1">
            <svg viewBox="0 0 100 25" preserveAspectRatio="none" class="nav-indicator-svg">
              <path d="M 14,20 C 3,20 3,6 14,6 C 30,1 50,11 86,5 C 97,5 97,20 86,20 C 65,23 45,15 14,20 Z" class="nav-indicator-path" />
            </svg>
          </div>
        </a>
        <a routerLink="/resume" 
           [class.active]="activeIndex() === 2">
          <span class="nav-text">Resume</span>
          <div class="nav-indicator" [class.visible]="activeIndex() === 2">
            <svg viewBox="0 0 100 25" preserveAspectRatio="none" class="nav-indicator-svg">
              <path d="M 14,23 C 3,23 3,9 14,9 C 35,7 65,3 86,4 C 97,4 97,18 86,18 C 65,19 35,22 14,23 Z" class="nav-indicator-path" />
            </svg>
          </div>
        </a>
      </nav>
    </header>
  `,
  styles: `
    :host { display: block; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      margin-bottom: 4rem;
      position: relative;
      z-index: 20;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
      position: relative;
      z-index: 1;
      view-transition-name: nav-links-container;
    }
    .nav-links a {
      text-decoration: none;
      color: inherit;
      font-weight: 400;
      opacity: 0.7;
      transition: opacity 0.2s;
      position: relative;
      display: inline-block;
      padding: 0.25rem 0;
      z-index: 1; /* Create local stacking context for each navigation link */
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    .nav-links a.active { opacity: 1; }
    @media (hover: hover) {
      .nav-links a:hover { opacity: 1; }
    }
    .nav-text {
      position: relative;
      z-index: 2; /* Force text in front of indicator */
    }
    .logo-link {
      background: transparent;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
    }
    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      border-radius: 50%;
      transition: filter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .nav-indicator {
      position: absolute;
      bottom: 2px;
      left: -6px;
      right: -6px;
      height: 23px;
      pointer-events: none;
      z-index: -1; /* Render behind text flow of the link */
      opacity: 0;
      transform: scaleX(0.9);
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
      mix-blend-mode: multiply; /* Blends light indicator behind the dark text */
    }
    .nav-indicator.visible {
      opacity: 1;
      transform: scaleX(1);
      view-transition-name: active-nav-indicator;
    }
    ::view-transition-group(nav-links-container) {
      z-index: 2;
      animation-duration: 0.38s;
      animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
    }
    ::view-transition-group(active-nav-indicator) {
      z-index: 1;
      animation-duration: 0.38s;
      animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
      mix-blend-mode: multiply; /* Ensures text shows through during view transition */
    }
    .nav-indicator-svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .nav-indicator-path {
      fill: var(--color-nav-indicator);
    }
  `
})
export class HeaderComponent {
  private router = inject(Router);
  private location = inject(Location);
  private document = inject(DOCUMENT);

  readonly activeIndex = signal(0);

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Set initial active index based on current URL path (SSR & bootstrap safe)
    this.activeIndex.set(this.getActiveIndex(this.location.path()));

    // Listen to route changes
    const routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.activeIndex.set(this.getActiveIndex(url));
      }
    });
    destroyRef.onDestroy(() => routerSub.unsubscribe());
  }

  private getActiveIndex(url: string): number {
    if (url.startsWith('/about')) {
      return 1;
    }
    if (url.startsWith('/resume')) {
      return 2;
    }
    return 0; // default to Work
  }

  scrollToTop(event: Event) {
    if (this.router.url === '/' || this.router.url === '/#hero') {
      const win = this.document.defaultView;
      if (win) {
        event.preventDefault();
        win.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}
