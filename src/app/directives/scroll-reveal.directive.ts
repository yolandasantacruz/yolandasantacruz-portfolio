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
            this.el.nativeElement.classList.remove('scroll-reveal-hidden');
            this.el.nativeElement.classList.add('revealed');
          } else {
            this.el.nativeElement.classList.remove('revealed');
            this.el.nativeElement.classList.add('scroll-reveal-hidden');
          }
        }, { rootMargin: '0px 0px -100px 0px', threshold: 0 });

        if (this.el.nativeElement) {
          const el = this.el.nativeElement;
          
          // Disable transitions initially so it snaps to hidden state instantly
          const originalTransition = el.style.transition;
          el.style.transition = 'none';
          
          el.classList.add('scroll-reveal-hidden');
          
          // Force reflow to ensure the hidden state is computed without transition
          void el.offsetHeight;
          
          // Restore original transition
          el.style.transition = originalTransition;
          
          observer.observe(el);
        }
      } else if (this.el.nativeElement) {
        this.el.nativeElement.classList.add('revealed');
      }
    });
  }
}
