import { ChangeDetectionStrategy, Component, DestroyRef, inject, afterNextRender } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { MouseTrailComponent } from './components/decorations/mouse-trail/mouse-trail.component';

@Component({
  selector: 'portfolio-root',
  standalone: true,
  imports: [RouterOutlet, MouseTrailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- High-Performance WebGL2 Shader Canvas (Isolated Design System Token) -->
    <portfolio-mouse-trail />

    <div class="content-wrapper">
      <router-outlet />
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
      background-color: #ffffff !important;
    }

    .content-wrapper {
      position: relative;
      z-index: 20;
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

      // Unregister service workers in development mode to prevent stale production caches
      this.cleanupDevServiceWorker(win);

      // Handle scroll restoration and focus management on navigation
      this.setupNavigationHandling(win);
    });
  }



  /** Cleans up any registered service workers when running in local development mode */
  private cleanupDevServiceWorker(win: Window) {
    if (import.meta.env.DEV && 'serviceWorker' in win.navigator) {
      win.navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          console.log('Successfully unregistered service worker in development mode:', registration);
        }
      });
    }
  }

  /** Sets up scroll restoration and focus management to improve navigation a11y */
  private setupNavigationHandling(win: Window) {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (typeof win.scrollTo === 'function') {
          win.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }

        const mainEl = this.document.querySelector('main');
        if (mainEl) {
          mainEl.setAttribute('tabindex', '-1');
          mainEl.focus({ preventScroll: true });
        } else {
          const body = this.document.body;
          body.setAttribute('tabindex', '-1');
          body.focus({ preventScroll: true });
        }
      });
  }
}

