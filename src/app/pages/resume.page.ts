import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';
import { RouteMeta } from '@analogjs/router';
import { ResumeData } from '../models/resume.types';

export const routeMeta: RouteMeta = {
  title: 'Resume | Yolanda Santa Cruz',
  meta: [
    {
      name: 'description',
      content: 'View Yolanda Santa Cruz\'s professional work history, skills, software tools, BFA education, and language proficiencies.'
    },
    { property: 'og:title', content: 'Resume | Yolanda Santa Cruz' },
    { property: 'og:description', content: 'View Yolanda Santa Cruz\'s professional work history, skills, software tools, BFA education, and language proficiencies.' },
    { property: 'og:image', content: '/images/og-card.webp' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
};

@Component({
  selector: 'portfolio-resume',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <portfolio-header />

      <main class="resume-content">
        <h1 class="page-title">Resume</h1>

        @if (resumeData) {
          <div class="resume-grid">
            <div class="main-column">

              <section class="work-experience flex flex-col">
                <h3 class="text-eyebrow" portfolioScrollReveal style="transition-delay: 0.6s">Work Experience</h3>
                
                @for (job of resumeData.workExperience; track job.title + job.meta; let i = $index) {
                  <div class="timeline-item" portfolioScrollReveal [style.transition-delay]="(i < 3) ? (i * 0.15 + 1.0) + 's' : '0s'">
                    <header class="job-header">
                      <h1 class="job-title">{{ job.title }}</h1>
                      <p class="job-meta">{{ job.meta }}</p>
                    </header>
                    <ul class="job-bullets">
                      @for (bullet of job.bullets; track bullet) {
                        <li>{{ bullet }}</li>
                      }
                    </ul>
                  </div>
                }
              </section>
            </div>

            <aside class="sidebar flex flex-col gap-16">
              @if (resumeData.software) {
                <div class="sidebar-section flex flex-col">
                  <h3 class="text-eyebrow" portfolioScrollReveal style="transition-delay: 0.75s">Software</h3>
                  <p portfolioScrollReveal style="transition-delay: 1.15s">{{ resumeData.software }}</p>
                </div>
              }

              @if (resumeData.skills) {
                <div class="sidebar-section">
                  <h3 class="text-eyebrow" portfolioScrollReveal style="transition-delay: 0.9s">Skills</h3>
                  <p portfolioScrollReveal style="transition-delay: 1.3s">{{ resumeData.skills }}</p>
                </div>
              }

              @if (resumeData.languages) {
                <div class="sidebar-section">
                  <h3 class="text-eyebrow" portfolioScrollReveal style="transition-delay: 1.05s">Languages</h3>
                  <p portfolioScrollReveal style="transition-delay: 1.45s">{{ resumeData.languages }}</p>
                </div>
              }

              @if (resumeData.additional && resumeData.additional.length > 0) {
                <div class="sidebar-section flex flex-col">
                  <h3 class="text-eyebrow" portfolioScrollReveal style="transition-delay: 1.2s">Additional</h3>
                  <ul class="sidebar-list no-bullets" portfolioScrollReveal style="transition-delay: 1.6s">
                    @for (item of resumeData.additional; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
              }

              @if (resumeData.education && resumeData.education.length > 0) {
                <div class="sidebar-section flex flex-col">
                  <h3 class="text-eyebrow" portfolioScrollReveal style="transition-delay: 1.35s">Education</h3>
                  <div portfolioScrollReveal style="transition-delay: 1.75s" class="flex flex-col gap-4">
                    @for (edu of resumeData.education; track edu.degree + edu.school) {
                      <div class="education-entry flex flex-col">
                        <span class="degree font-bold text-base">{{ edu.degree }}</span>
                        <span class="school text-base color-text-muted">{{ edu.school }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </aside>
          </div>

          @if (resumeData.downloadUrl) {
            <div class="download-section">
              <a [href]="resumeData.downloadUrl" download class="btn-link">
                Download PDF
              </a>
            </div>
          }
        }
      </main>

      <portfolio-footer />
    </div>
  `,
  styles: `


    .resume-content {
      padding-top: 4rem;
    }

    .page-title {
      font-size: var(--text-6xl);
      text-align: left;
      margin-bottom: 6rem;
      font-weight: 400;
      opacity: 0;
      animation: pageFadeIn 2.0s cubic-bezier(0.16, 1, 0.3, 1) 0s both;
    }

    .resume-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 6rem;
    }

    .job-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .job-title {
      font-family: var(--font-header);
      font-size: var(--text-lg);
      font-weight: 500;
      color: var(--color-text);
      line-height: 1.8;
      margin-bottom: 0;
    }

    .job-meta {
      font-size: 1.1rem;
      line-height: 1.4;
      margin-bottom: 0;
    }

    .job-bullets {
      list-style-type: none;
      padding-left: 0;
      margin: 0;
    }

    .job-bullets li {
      position: relative;
      padding-left: 1.5rem;
      font-size: var(--text-base);
      line-height: 1.7;
      color: var(--color-text-muted);
      margin-bottom: 0.75rem;
    }

    .job-bullets li::before {
      content: "•";
      color: var(--color-primary);
      position: absolute;
      left: 0.25rem;
      top: 0;
    }

    .contact-info {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      line-height: 1.6;
      opacity: 0;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
    }

    .sidebar-section .text-eyebrow {
      margin-bottom: 1.5rem;
    }

    .sidebar-section p {
      font-size: var(--text-base);
      line-height: 1.8;
      color: var(--color-text-muted);
      margin: 0;
    }

    .sidebar-list {
      list-style-type: none;
      padding-left: 1rem;
      margin: 0;
    }

    .sidebar-list li {
      font-size: var(--text-base);
      margin-bottom: 0.5rem;
      line-height: 1.4;
      position: relative;
    }

    .sidebar-list li::before {
      content: "•";
      color: var(--color-primary);
      position: absolute;
      left: -1rem;
    }

    .sidebar-list.no-bullets {
      padding-left: 0;
    }

    .sidebar-list.no-bullets li::before {
      content: none;
    }

    .education-entry {
      gap: 0.25rem;
    }

    .download-section {
      margin: 3rem 0;
    }

    @media (max-width: 900px) {
      .resume-grid {
        grid-template-columns: 1fr;
      }
      .sidebar {
        order: -1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .page-title, .contact-info {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `,
})
export default class ResumeComponent {
  readonly resumeData = injectContentFiles<ResumeData & Record<string, unknown>>(file =>
    file.filename.includes('resume.md')
  )[0]?.attributes;
}

