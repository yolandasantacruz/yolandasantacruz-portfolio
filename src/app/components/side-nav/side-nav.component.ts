import { ChangeDetectionStrategy, Component, input, OnInit, inject, afterNextRender, signal, DestroyRef, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { SideNavTrackerService } from './side-nav-tracker.service';

export interface NavSection {
  id: string;
  label: string;
  color: string;
}

@Component({
  selector: 'portfolio-side-nav',
  standalone: true,
  providers: [SideNavTrackerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!isSmallScreen()) {
      <nav class="floating-side-rail flex flex-col items-end" role="navigation" aria-label="Page sections">
        @for (sec of sections(); track sec.id) {
          <button class="nav-pill flex items-center justify-center" 
                  [class.active]="tracker.activeSection() === sec.id" 
                  (click)="tracker.scrollToSection(sec.id)" 
                  [attr.aria-label]="'Scroll to ' + sec.label"
                  [attr.aria-current]="tracker.activeSection() === sec.id ? 'step' : null"
                  [style.--pill-color]="sec.color">
            <span class="pill-label">{{ sec.label }}</span>
          </button>
        }
      </nav>
    }
  `
})
export class SideNavComponent implements OnInit {
  sections = input.required<NavSection[]>();
  intersectionSelector = input.required<string>();
  intersectionOptions = input<IntersectionObserverInit>({});
  mutationTargetSelector = input<string | null>(null);
  initialActiveId = input<string>('hero');

  tracker = inject(SideNavTrackerService);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  isSmallScreen = signal(false);

  ngOnInit() {
    this.tracker.activeSection.set(this.initialActiveId());
  }

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        const win = this.document.defaultView;
        if (win && typeof win.matchMedia === 'function') {
          const computedStyle = win.getComputedStyle(this.document.documentElement);
          const breakpointMd = computedStyle.getPropertyValue('--breakpoint-md').trim() || '900px';
          const mediaQuery = win.matchMedia(`(max-width: ${breakpointMd})`);
          this.isSmallScreen.set(mediaQuery.matches);

          const listener = (e: MediaQueryListEvent) => {
            this.isSmallScreen.set(e.matches);
          };
          mediaQuery.addEventListener('change', listener);
          this.destroyRef.onDestroy(() => {
            mediaQuery.removeEventListener('change', listener);
          });
        }
      }

      this.tracker.initialize({
        intersectionSelector: this.intersectionSelector(),
        intersectionOptions: this.intersectionOptions(),
        mutationTargetSelector: this.mutationTargetSelector()
      });
    });
  }
}

