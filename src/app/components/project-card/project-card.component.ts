import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  reverse?: boolean;
  align?: 'left' | 'right';
}

@Component({
  selector: 'portfolio-project-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="project-card" [class.reverse]="project().reverse">
      <div class="project-image">
        <img [src]="project().imageUrl" [alt]="project().title + ' Mockups'" />
      </div>
      <div class="project-info" [class.left-align]="project().align === 'left'" [class.right-align]="project().align === 'right'">
        <h2 [innerHTML]="project().title"></h2>
        <p>{{ project().description }}</p>
        <a [routerLink]="project().link" class="view-project-link">VIEW PROJECT &rarr;</a>
      </div>
    </div>
  `,
  styles: `
    .project-card { display: flex; align-items: center; justify-content: space-between; gap: 4rem; }
    .project-card.reverse { flex-direction: row-reverse; }
    .project-image { flex: 1; display: flex; justify-content: center; }
    .project-image img { max-width: 100%; height: auto; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transition: transform 0.3s; }
    .project-image img:hover { transform: translateY(-10px); }
    .project-info { flex: 1; max-width: 400px; }
    .project-info h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.2; }
    .project-info p { font-size: 1.125rem; line-height: 1.6; margin-bottom: 2rem; opacity: 0.8; }
    .view-project-link {
      display: inline-block; text-decoration: none; color: #55c5c7;
      font-weight: 600; font-size: 0.875rem; letter-spacing: 1px;
      margin-bottom: 2rem; text-transform: uppercase; transition: transform 0.2s;
    }
    .view-project-link:hover { transform: translateX(5px); }

    @media (max-width: 768px) {
      .project-card, .project-card.reverse { flex-direction: column; text-align: center; }
    }
  `
})
export class ProjectCardComponent {
  project = input.required<Project>();
}
