import { injectContent, MarkdownComponent } from '@analogjs/content';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProjectAttributes } from '../../project-attributes';

@Component({
  selector: 'portfolio-project-details',
  imports: [AsyncPipe, MarkdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (project$ | async; as project) {
    <article>
      <img class="project__image" [src]="project.attributes.imageUrl" alt="{{ project.attributes.title }} cover" />
      <analog-markdown [content]="project.content" />
    </article>
    }
  `,
  styles: `
    .project__image {
      max-height: 40vh;
    }
  `,
})
export default class ProjectDetails {
  readonly project$ = injectContent<ProjectAttributes>({ param: 'slug', subdirectory: 'projects' });
}
