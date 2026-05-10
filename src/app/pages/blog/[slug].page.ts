import { injectContent, MarkdownComponent } from '@analogjs/content';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import PostAttributes from '../../post-attributes';

@Component({
  selector: 'portfolio-blog-post',
  imports: [AsyncPipe, MarkdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (post$ | async; as post) {
    <article>
      <img class="post__image" [src]="post.attributes.coverImage" alt="{{ post.attributes.title }} cover" />
      <analog-markdown [content]="post.content" />
    </article>
    }
  `,
  styles: `
    .post__image {
      max-height: 40vh;
    }
  `,
})
export default class BlogPost {
  readonly post$ = injectContent<PostAttributes>('slug');
}
