import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NitroBackgroundComponent } from './components/nitro-background/nitro-background.component';

@Component({
  selector: 'portfolio-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NitroBackgroundComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- High-Performance WebGL2 Shader Canvas (Isolated Design System Token) -->
    <portfolio-nitro-background />

    <div class="content-wrapper">
      <router-outlet />
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
      background-color: #ffffff !important;
    }

    .content-wrapper {
      position: relative;
      z-index: 20;
    }
  `,
})
export class App {}
