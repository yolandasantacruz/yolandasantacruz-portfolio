import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'portfolio-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <div class="logo">
        <a routerLink="/" class="logo-link" (click)="scrollToTop($event)">
          <img [ngSrc]="logoSrc" width="40" height="40" priority alt="Yolanda Santa Cruz" class="logo-img" />
        </a>
      </div>
      <nav class="nav-links">
        <a routerLink="/" 
           routerLinkActive="active" 
           [routerLinkActiveOptions]="{exact: true}"
           (click)="scrollToTop($event)">Work</a>
        <a routerLink="/about" routerLinkActive="active">About</a>
        <a routerLink="/resume" routerLinkActive="active">Resume</a>
      </nav>
    </header>
  `,
  styles: `
    :host { display: block; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      margin-bottom: 4rem;
      position: relative;
      z-index: 20;
    }
    .nav-links { display: flex; gap: 2rem; }
    .nav-links a {
      text-decoration: none;
      color: inherit;
      font-weight: 400;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { opacity: 1; }
    .logo-link { display: flex; align-items: center; text-decoration: none; }
    .logo-img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      display: block;
      filter: drop-shadow(2px 2px 4px rgba(0, 162, 154, 0.12)) drop-shadow(-2px -2px 4px rgba(184, 156, 224, 0.12));
      transition: filter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .logo-img:hover {
      filter: drop-shadow(3px 3px 6px rgba(0, 162, 154, 0.25)) drop-shadow(-3px -3px 6px rgba(184, 156, 224, 0.25));
    }
  `
})
export class HeaderComponent {
  private router = inject(Router);
  private document = inject(DOCUMENT);

  readonly logoSrc = 'images/logo.png';

  scrollToTop(event: Event) {
    if (this.router.url === '/' || this.router.url === '/#hero') {
      const snapContainer = this.document.querySelector('.snap-container');
      if (snapContainer) {
        event.preventDefault();
        snapContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}
