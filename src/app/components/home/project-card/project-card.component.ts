import { ChangeDetectionStrategy, Component, ElementRef, inject, input, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="project-card" [class.reverse]="project().reverse">
      <div class="project-image-container">
        <div class="category-tag">{{ project().category }}</div>
        <img [src]="project().imageUrl" [alt]="project().title" class="project-image" />
      </div>
      
      <div class="project-details">
        <div class="project-meta">
          <span class="role">{{ project().role }}</span>
          <span class="separator">•</span>
          <span class="timeline">{{ project().timeline }}</span>
        </div>
        
        <h2 class="project-title">{{ project().title }}</h2>
        
        <p class="project-description">{{ project().description }}</p>
        
        <div class="tech-stack">
          @for (tech of project().techStack; track tech) {
            <span class="tech-tag">{{ tech }}</span>
          }
        </div>
        
        <a [routerLink]="project().link" class="view-project">
          View Project <span class="arrow">↗</span>
        </a>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: 13.5rem;
      opacity: 0;
      transform: translateY(60px);
      transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    :host(.in-view) {
      opacity: 1;
      transform: translateY(0);
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
    }


    .project-card {
      display: flex;
      align-items: center;
      gap: 4rem;
      width: 100%;
    }

    .project-card.reverse {
      flex-direction: row-reverse;
    }

    .project-image-container {
      flex: 1.2;
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 16 / 10;
      background: #f4f4f4;
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
    }

    .category-tag {
      position: absolute;
      top: 24px;
      left: 24px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #1a1a1a;
      z-index: 2;
    }

    .project-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .project-image-container:hover .project-image {
      transform: scale(1.05);
    }

    .project-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      gap: 1.5rem;
    }

    .project-meta {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
      text-align: left;
      width: 100%;
    }

    .separator {
      margin: 0 8px;
      color: #ccc;
    }

    .project-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0;
      line-height: 1.2;
      text-align: left;
      width: 100%;
    }

    .project-description {
      font-size: 1rem;
      line-height: 1.6;
      color: #4a4a4a;
      margin: 0;
      max-width: 90%;
      text-align: left;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0.5rem;
      justify-content: flex-start;
      width: 100%;
    }

    .tech-tag {
      background: #f0f0f0;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 0.8125rem;
      font-weight: 500;
      color: #555;
    }

    .view-project {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #1a1a1a;
      text-decoration: none;
      margin-top: 1rem;
      font-size: 1rem;
      transition: color 0.2s ease;
    }

    .view-project:hover {
      color: #000;
    }

    .view-project:hover .arrow {
      transform: translate(2px, -2px);
    }

    .arrow {
      transition: transform 0.2s ease;
      font-size: 1.1rem;
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
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId) && typeof globalThis.IntersectionObserver !== 'undefined') {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const isInViewport = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;

        if (isInViewport) {
          this.el.nativeElement.classList.add('in-view');
          return;
        }

        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add('in-view');
            observer.disconnect();
          }
        }, { threshold: 0.15 });

        if (this.el.nativeElement) {
          observer.observe(this.el.nativeElement);
        }
      } else if (this.el.nativeElement) {
        this.el.nativeElement.classList.add('in-view');
      }
    });
  }
}

