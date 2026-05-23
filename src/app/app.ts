import { ChangeDetectionStrategy, Component, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterLink, RouterOutlet, Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs';
import { MouseTrailComponent } from './components/decorations/mouse-trail/mouse-trail.component';

@Component({
  selector: 'portfolio-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MouseTrailComponent],
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

  constructor() {
    const router = inject(Router);

    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        router.events
          .pipe(filter((e): e is NavigationStart => e instanceof NavigationStart))
          .subscribe(() => {
            this.document.defaultView?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          });
      }
    });
  }
}
