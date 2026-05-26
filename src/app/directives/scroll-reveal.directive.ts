import { Directive, ElementRef, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Directive({
  selector: '[portfolioScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId) && typeof globalThis.IntersectionObserver !== 'undefined') {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const win = this.document.defaultView;
        const height = win ? win.innerHeight : 0;
        const clientHeight = this.document.documentElement?.clientHeight || 0;
        const isInViewport = rect.top < (height || clientHeight) && rect.bottom > 0;

        if (isInViewport) {
          this.el.nativeElement.classList.add('in-view');
          return;
        }

        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add('in-view');
            observer.disconnect();
          }
        }, { threshold: 0.15 });

        if (this.el.nativeElement) {
          observer.observe(this.el.nativeElement);
        }
      } else if (this.el.nativeElement) {
        this.el.nativeElement.classList.add('in-view');
      }
    });
  }
}
