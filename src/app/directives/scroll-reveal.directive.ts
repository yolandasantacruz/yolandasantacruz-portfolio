import { Directive, ElementRef, inject, afterNextRender, PLATFORM_ID, signal, OnDestroy } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Directive({
  selector: '[portfolioScrollReveal]',
  standalone: true,
  host: {
    '[class.scroll-reveal-hidden]': '!revealed()',
    '[class.revealed]': 'revealed()'
  }
})
export class ScrollRevealDirective implements OnDestroy {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  // Start visible for SSR; client overrides immediately in afterNextRender
  protected readonly revealed = signal(true);
  private observer?: IntersectionObserver;
  private hasCheckedInitial = false;
  private timeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId) && typeof globalThis.IntersectionObserver !== 'undefined') {
        const win = this.document.defaultView;
        const viewportHeight = win ? win.innerHeight : 0;

        // Hide immediately on the client so transitions can play
        this.revealed.set(false);

        // Wait a small delay to ensure the browser has painted the hidden state
        this.timeoutId = setTimeout(() => {
          this.observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
              this.revealed.set(true);
              this.observer?.disconnect();
            } else {
              if (!this.hasCheckedInitial) {
                const rect = entry.boundingClientRect;
                const isAboveFold = rect.top < viewportHeight;
                if (isAboveFold) {
                  this.revealed.set(true);
                  this.observer?.disconnect();
                } else {
                  this.revealed.set(false);
                }
              }
            }
            this.hasCheckedInitial = true;
          }, { rootMargin: '0px 0px 200px 0px', threshold: 0 });

          if (this.el.nativeElement) {
            this.observer.observe(this.el.nativeElement);
          }
        }, 50);
      } else {
        this.revealed.set(true);
      }
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
    }
  }
}


