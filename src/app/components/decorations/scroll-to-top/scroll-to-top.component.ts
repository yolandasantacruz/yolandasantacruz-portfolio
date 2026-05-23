import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'portfolio-scroll-to-top',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll-to-top">
      <button (click)="scrollToTop()">&uarr;</button>
    </div>
  `,
  styles: `
    .scroll-to-top { position: sticky; top: 50%; right: 2rem; display: flex; justify-content: flex-end; width: 100%; height: 0; z-index: 100; }
    .scroll-to-top button {
      background: rgba(85, 197, 199, 0.1); color: #55c5c7; border: none;
      width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transform: translateY(-50%); transition: background 0.2s;
    }
    .scroll-to-top button:hover { background: rgba(85, 197, 199, 0.2); }
    @media (max-width: 768px) {
      .scroll-to-top { display: none; }
    }
  `
})
export class ScrollToTopComponent {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
