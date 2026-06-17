import { ChangeDetectionStrategy, Component, DestroyRef, inject, afterNextRender } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MouseTrailComponent } from './components/decorations/mouse-trail/mouse-trail.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'portfolio-root',
  standalone: true,
  imports: [RouterOutlet, MouseTrailComponent, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- High-Performance WebGL2 Shader Canvas (Isolated Design System Token) -->
    <portfolio-mouse-trail />

    <div class="content-wrapper">
      <div class="header-container container">
        <portfolio-header />
      </div>
      <router-outlet />
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
      background-color: var(--color-bg) !important;
    }

    .content-wrapper {
      position: relative;
      z-index: 20;
    }

    .header-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 30;
      pointer-events: none;
      right: calc(var(--system-scrollbar-width, 0px) - (100vw - 100%));
    }

    portfolio-header {
      pointer-events: auto;
    }
  `,
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  constructor() {
    afterNextRender(() => {
      const win = this.document.defaultView;
      if (!win) return;

      // Initialize Google Analytics 4 (gtag.js) tracking
      this.initGoogleAnalytics(win);

      // Force cleanup and unregistration of any legacy service workers
      this.cleanupServiceWorkers(win);

      // Handle scroll restoration and focus management on navigation
      this.setupNavigationHandling(win);
    });
  }

  /** Initializes Google Analytics 4 tracking dynamically after visual layout is rendered */
  private initGoogleAnalytics(win: Window) {
    const windowRef = win as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };

    const dataLayer = (windowRef.dataLayer = windowRef.dataLayer || []);

    // eslint-disable-next-line prefer-rest-params
    const gtag = windowRef.gtag || function () { dataLayer.push(arguments); };
    windowRef.gtag = gtag;

    gtag('js', new Date());
    gtag('config', 'G-6DL5FQ7S1Y');

    const script = this.document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-6DL5FQ7S1Y';
    script.async = true;
    script.setAttribute('fetchpriority', 'low');
    this.document.head.appendChild(script);
  }

  /** Cleans up and unregisters any registered service workers to prevent aggressive caching issues */
  private cleanupServiceWorkers(win: Window) {
    if ('serviceWorker' in win.navigator) {
      win.navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log('Successfully cleaned up legacy service worker:', registration.scope);
            }
          });
        }
      }).catch((err) => {
        console.error('Error unregistering legacy service workers:', err);
      });
    }
  }

  /** Sets up scroll restoration and focus management to improve navigation a11y */
  private setupNavigationHandling(win: Window) {
    let isFirstNavigation = true;
    const routerSub = this.router.events
      .subscribe((e) => {
        if (e instanceof NavigationEnd) {
          if (isFirstNavigation) {
            isFirstNavigation = false;
            return; // Skip scroll-reset and focus shifting on the initial page load
          }

          if (typeof win.scrollTo === 'function') {
            win.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }

          const mainEl = this.document.querySelector('main');
          if (mainEl) {
            mainEl.scrollTop = 0; // Reset scroll position of custom scroll container (e.g. .snap-container)
            mainEl.setAttribute('tabindex', '-1');
            mainEl.focus({ preventScroll: true });
          } else {
            const body = this.document.body;
            body.setAttribute('tabindex', '-1');
            body.focus({ preventScroll: true });
          }
        }
      });
    this.destroyRef.onDestroy(() => routerSub.unsubscribe());
  }

}

