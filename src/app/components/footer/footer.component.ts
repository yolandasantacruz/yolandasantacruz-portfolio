import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { FooterData, SocialsData } from '../../pages/shared.types';

@Component({
  selector: 'portfolio-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer-social">
        @if (socials) {
          @for (social of socials.links; track social.platform) {
            @if (social.platform === 'linkedin' || social.platform === 'behance') {
              <a [href]="social.url" target="_blank" rel="noopener noreferrer">
                {{ social.shortLabel }}
              </a>
            }
          }
        }
      </div>
      @if (footer) {
        <p class="copyright" [innerHTML]="footer.copyright"></p>
      }
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
    .footer-social a { text-decoration: none; color: inherit; font-weight: 400; opacity: 0.7; }
    .footer-social a:hover { opacity: 1; }
    .copyright { font-size: 0.875rem; opacity: 0.6; text-align: center; }
    .heart { color: #55c5c7; }
  `
})
export class FooterComponent {
  readonly footer = injectContentFiles<FooterData>(file =>
    file.filename.includes('/shared/footer')
  )[0]?.attributes;

  readonly socials = injectContentFiles<SocialsData>(file =>
    file.filename.includes('/shared/socials')
  )[0]?.attributes;
}
