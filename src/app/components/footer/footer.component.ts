import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'portfolio-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer-social">
        <a href="https://behance.net" target="_blank" rel="noopener noreferrer">Be</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">in</a>
      </div>
      <p class="copyright">
        Made with <span class="heart">❤️</span> by Yolanda Santa Cruz © 2026. All rights reserved.
      </p>
    </footer>
  `,
  styles: `
    .footer { 
      text-align: center; 
      padding: 6rem 0 4rem; 
      border-top: none;
    }
    .footer-social { 
      display: flex; 
      justify-content: center; 
      gap: 2rem; 
      margin-bottom: 2rem; 
    }
    .footer-social a { text-decoration: none; color: inherit; font-weight: 500; opacity: 0.7; }
    .footer-social a:hover { opacity: 1; }
    .copyright { font-size: 0.875rem; opacity: 0.6; }
    .heart { color: #55c5c7; }
  `
})
export class FooterComponent { }
