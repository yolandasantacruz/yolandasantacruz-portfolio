import {
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
  HostListener,
  signal,
  computed,
  effect,
  untracked,
  DestroyRef,
  NgZone,
  afterNextRender,
} from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

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
        <a #workLink 
           routerLink="/" 
           [class.active]="activeIndex() === 0"
           (click)="scrollToTop($event)">Work</a>
        <a #aboutLink 
           routerLink="/about" 
           [class.active]="activeIndex() === 1">About</a>
        <a #resumeLink 
           routerLink="/resume" 
           [class.active]="activeIndex() === 2">Resume</a>
        
        <div class="nav-indicator" 
             [class.visible]="indicatorOpacity() > 0"
             [class.no-transition]="!isTransitioning()"
             [style.left.px]="indicatorLeft()" 
             [style.width.px]="indicatorWidth()">
          <svg viewBox="0 0 100 25" preserveAspectRatio="none" class="nav-indicator-svg">
            <path [attr.d]="currentPath()" [style.fill]="currentColor()" class="nav-indicator-path" />
          </svg>
        </div>
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
    }
    .nav-links a {
      text-decoration: none;
      color: inherit;
      font-weight: 400;
      opacity: 0.7;
      transition: opacity 0.2s;
      position: relative;
      z-index: 2;
      padding: 0.25rem 0;
    }
    .nav-links a:hover, .nav-links a.active { opacity: 1; }
    .logo-link {
      background: transparent;
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
      height: 23px;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: left 0.38s cubic-bezier(0.25, 1, 0.5, 1),
                  width 0.38s cubic-bezier(0.25, 1, 0.5, 1),
                  opacity 0.25s ease;
    }
    .nav-indicator.visible {
      opacity: 1;
    }
    .nav-indicator.no-transition {
      transition: none !important;
    }
    .nav-indicator-svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .nav-indicator-path {
      transition: d 0.38s cubic-bezier(0.25, 1, 0.5, 1),
                  fill 0.38s cubic-bezier(0.25, 1, 0.5, 1);
    }
  `
})
export class HeaderComponent {
  private router = inject(Router);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  readonly activeIndex = signal(0);
  readonly indicatorLeft = signal(0);
  readonly indicatorWidth = signal(0);
  readonly indicatorOpacity = signal(0);
  readonly isTransitioning = signal(false);

  @ViewChild('workLink', { read: ElementRef }) workLink!: ElementRef<HTMLAnchorElement>;
  @ViewChild('aboutLink', { read: ElementRef }) aboutLink!: ElementRef<HTMLAnchorElement>;
  @ViewChild('resumeLink', { read: ElementRef }) resumeLink!: ElementRef<HTMLAnchorElement>;

  readonly currentPath = computed(() => {
    const idx = this.activeIndex();
    if (idx === 1) return 'M 14,20 C 3,20 3,6 14,6 C 30,1 50,11 86,5 C 97,5 97,20 86,20 C 65,23 45,15 14,20 Z';
    if (idx === 2) return 'M 14,23 C 3,23 3,9 14,9 C 35,7 65,3 86,4 C 97,4 97,18 86,18 C 65,19 35,22 14,23 Z';
    return 'M 14,20 C 3,20 3,6 14,6 C 35,2 65,2 86,6 C 97,6 97,20 86,20 C 65,22 35,22 14,20 Z';
  });

  readonly currentColor = computed(() => '#D4F2EE');

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Set initial active index based on current URL
    this.activeIndex.set(this.getActiveIndex(this.router.url));

    // Listen to route changes
    const routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.activeIndex.set(this.getActiveIndex(url));
      }
    });
    destroyRef.onDestroy(() => routerSub.unsubscribe());

    // Update indicator when activeIndex changes
    effect(() => {
      const index = this.activeIndex();
      untracked(() => {
        this.updateIndicatorPosition(index);
      });
    });

    // Run initial position calculation on client once view is ready
    afterNextRender(() => {
      this.updateIndicatorPosition(this.activeIndex());
      // Enable transitions after a short delay to avoid sliding from (0,0) on page load
      setTimeout(() => {
        this.isTransitioning.set(true);
      }, 150);
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.updateIndicatorPosition(this.activeIndex());
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

  updateIndicatorPosition(index: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        let targetEl: HTMLAnchorElement | null = null;
        if (index === 0) {
          targetEl = this.workLink?.nativeElement;
        } else if (index === 1) {
          targetEl = this.aboutLink?.nativeElement;
        } else if (index === 2) {
          targetEl = this.resumeLink?.nativeElement;
        }

        if (targetEl) {
          // Add horizontal offset so the highlight extends slightly beyond the text boundaries
          const offset = 6;
          const left = targetEl.offsetLeft - offset;
          const width = targetEl.offsetWidth + (offset * 2);

          this.ngZone.run(() => {
            this.indicatorLeft.set(left);
            this.indicatorWidth.set(width);
            this.indicatorOpacity.set(1);
          });
        } else {
          this.ngZone.run(() => {
            this.indicatorOpacity.set(0);
          });
        }
      });
    });
  }

  scrollToTop(event: Event) {
    if (this.router.url === '/' || this.router.url === '/#hero') {
      const snapContainer = this.document.querySelector('.snap-container');
      if (snapContainer) {
        event.preventDefault();
        snapContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}

