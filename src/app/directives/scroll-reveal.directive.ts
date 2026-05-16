import { Directive, ElementRef, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[portfolioScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId) && typeof globalThis.IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add('revealed');
            observer.disconnect();
          }
        }, { threshold: 0.12 });

        if (this.el.nativeElement) {
          this.el.nativeElement.classList.add('scroll-reveal-hidden');
          observer.observe(this.el.nativeElement);
        }
      } else if (this.el.nativeElement) {
        this.el.nativeElement.classList.add('revealed');
      }
    });
  }
}

