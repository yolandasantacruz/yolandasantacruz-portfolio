import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Project {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  role: string;
  timeline: string;
  techStack: string[];
  reverse?: boolean;
}


@Component({
  selector: 'portfolio-project-card',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="project-card flex items-center gap-16 w-full" [class.reverse]="project().reverse">
      <a [routerLink]="project().link" 
         class="project-image-container relative h-auto block"
         [attr.aria-label]="'View project: ' + project().title">
        <img [ngSrc]="project().imageUrl" ngSrcset="400w, 800w, 1200w" sizes="(max-width: 768px) 100vw, 580px" width="580" height="580" [alt]="project().title" class="project-image block w-full h-auto" [priority]="priority()" />
      </a>
      
      <div class="project-details flex flex-col items-start text-left gap-6">
        <h2 class="project-title m-0 w-full text-left font-bold color-text text-4xl">{{ project().title }}</h2>
        
        <p class="project-description m-0 text-left color-text-muted text-base">{{ project().description }}</p>
        
        <a [routerLink]="project().link" 
           class="btn-link view-project"
           [attr.aria-label]="'View project: ' + project().title">
          View Project
        </a>
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: 13.5rem;
    }

    .project-card.reverse {
      flex-direction: row-reverse;
    }

    .project-image-container {
      flex: 1.2;
      border-radius: 12px;
    }

    .project-image {
      border-radius: 12px;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .project-image-container:hover .project-image {
      transform: scale(1.05);
    }

    .project-details {
      flex: 1;
    }

    .project-title {
      line-height: 1.2;
    }

    .project-description {
      line-height: 1.6;
      max-width: 90%;
    }

    .view-project {
      margin-top: 2rem;
    }

    @media (max-width: 1024px) {
      .project-card {
        gap: 2rem;
      }
      .project-title {
        font-size: 1.75rem;
      }
    }

    @media (max-width: 768px) {
      :host {
        margin-bottom: 7.5rem;
      }
      .project-card, .project-card.reverse {
        flex-direction: column;
        gap: 2rem;
      }
      .project-image-container {
        width: 100%;
      }
      .project-details {
        width: 100%;
      }
      .project-description {
        max-width: 100%;
      }
    }
  `
})
export class ProjectCardComponent {
  project = input.required<Project>();
  priority = input<boolean>(false);
}


