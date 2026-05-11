import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'portfolio-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <nav class="nav-links">
        <a routerLink="/" class="active">Work</a>
        <a routerLink="/about">About</a>
        <a routerLink="/resume">Resume</a>
      </nav>
      <div class="logo">
        <div class="logo-circle">YC</div>
      </div>
    </header>
  `,
  styles: `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4rem;
    }
    .nav-links { display: flex; gap: 2rem; }
    .nav-links a {
      text-decoration: none;
      color: inherit;
      font-weight: 500;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .nav-links a:hover, .nav-links a.active { opacity: 1; }
    .logo-circle {
      width: 40px; height: 40px;
      border-radius: 50%;
      border: 2px solid #55c5c7;
      display: flex; align-items: center; justify-content: center;
      color: #55c5c7; font-weight: bold;
    }
  `
})
export class HeaderComponent {}
