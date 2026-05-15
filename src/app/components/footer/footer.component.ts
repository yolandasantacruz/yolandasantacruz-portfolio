import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'portfolio-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer-social">
        <a href="https://behance.net" target="_blank" rel="noopener noreferrer">Be</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">In</a>
      </div>
      <p class="copyright">
        Made with <span class="heart">&hearts;</span> in Colorado Springs, USA. All rights reserved.
      </p>
    </footer>
  `,
  styles: `
    .footer { text-align: left; padding: 4rem 0; border-top: 1px solid rgba(0,0,0,0.1); }
    @media (prefers-color-scheme: dark) { .footer { border-top: 1px solid rgba(255,255,255,0.1); } }
    .footer-social { display: flex; justify-content: flex-start; gap: 2rem; margin-bottom: 2rem; }
    .footer-social a { text-decoration: none; color: inherit; font-weight: 500; opacity: 0.7; }
    .footer-social a:hover { opacity: 1; }
    .copyright { font-size: 0.875rem; opacity: 0.6; }
    .heart { color: #55c5c7; }
  `
})
export class FooterComponent {}
