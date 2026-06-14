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
  private rafId?: number;

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId) && typeof globalThis.IntersectionObserver !== 'undefined') {
        const win = this.document.defaultView;
        const viewportHeight = win ? win.innerHeight : 0;

        // Hide immediately on the client so transitions can play
        this.revealed.set(false);

        this.observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            this.revealed.set(true);
            this.observer?.disconnect();
          } else {
            if (!this.hasCheckedInitial) {
              const rect = entry.boundingClientRect;
              const isAboveFold = rect.top < viewportHeight;
              if (isAboveFold) {
                // Let the browser paint the hidden state first, then reveal
                // so the CSS transition (and its transition-delay) actually fires
                this.rafId = win?.requestAnimationFrame(() => {
                  this.revealed.set(true);
                  this.observer?.disconnect();
                });
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
      } else {
        this.revealed.set(true);
      }
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    const win = this.document.defaultView;
    if (this.rafId !== undefined) {
      win?.cancelAnimationFrame(this.rafId);
    }
  }
}


