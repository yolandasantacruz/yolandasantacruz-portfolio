import { injectContentFiles } from '@analogjs/content';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectAttributes } from '../../project-attributes';

@Component({
  selector: 'portfolio-projects',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Project Archive</h1>

    @for (project of projects; track project.attributes.slug) {
    <a [routerLink]="['/projects/', project.attributes.slug]">
      <h2 class="project__title">{{ project.attributes.title }}</h2>
      <p class="project__desc">{{ project.attributes.description }}</p>
    </a>
    }
  `,
  styles: `
    a {
      text-align: left;
      display: block;
      margin-bottom: 2rem;
    }

    .project__title,
    .project__desc {
      margin: 0;
    }
  `,
})
export default class Projects {
  readonly projects = injectContentFiles<ProjectAttributes>(file => file.filename.includes('projects'));
}
