import { ChangeDetectionStrategy, Component, DestroyRef, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  constructor() {
    const router = inject(Router);

    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        // Measure scrollbar width and set CSS custom property
        const win = this.document.defaultView;
        if (win) {
          const div = this.document.createElement('div');
          div.style.width = '100px';
          div.style.height = '100px';
          div.style.overflow = 'scroll';
          div.style.position = 'absolute';
          div.style.top = '-9999px';
          div.style.scrollbarWidth = 'thin'; // Match Firefox thin scrollbar styling
          this.document.body.appendChild(div);
          const scrollbarWidth = div.offsetWidth - div.clientWidth;
          this.document.body.removeChild(div);
          this.document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
        }

        router.events
          .pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(() => {
            this.document.defaultView?.scrollTo({ top: 0, left: 0, behavior: 'instant' });

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
    });
  }
}
