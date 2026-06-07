import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { SocialsData } from '../../models/shared.types';

@Component({
  selector: 'portfolio-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <p class="copyright">
        Designed with 
        <svg class="heart-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        by Yolanda Santa Cruz © 2026
      </p>
    </footer>
  `,
  styles: `
    .footer { 
      text-align: center; 
      padding: 6rem 0 1rem; 
      font-size: var(--text-regular);
    }
    .copyright {
      color: var(--color-text-muted);
      text-align: center;
      border-top: none;
      margin-bottom: 0;
    }
    .heart-icon {
      width: 1.1em;
      height: 1.1em;
      vertical-align: middle;
      display: inline-block;
      position: relative;
      top: -1px;
      color: var(--color-primary);
    }
  `
})
export class FooterComponent {
  readonly socials = injectContentFiles<SocialsData>(file =>
    file.filename.includes('/shared/socials')
  )[0]?.attributes;
}
