import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { FooterData, SocialsData } from '../../pages/shared.types';

@Component({
  selector: 'portfolio-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
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
    .copyright { font-size: 1.2rem; opacity: 0.6; text-align: center; }
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
