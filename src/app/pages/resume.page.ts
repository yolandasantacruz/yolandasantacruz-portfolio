import { ChangeDetectionStrategy, Component } from '@angular/core';
import { injectContentFiles } from '@analogjs/content';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { RouteMeta } from '@analogjs/router';
import { ResumeData } from './resume.types';

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
  imports: [HeaderComponent, FooterComponent],
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
                <h3 class="section-heading">Work Experience</h3>
                
                @for (job of resumeData.workExperience; track job.title + job.meta) {
                  <div class="job-entry">
                    <div class="job-header">
                      <span class="job-title">{{ job.title }}</span>
                      <span class="job-meta">{{ job.meta }}</span>
                    </div>
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
                  <h3 class="section-heading">Software</h3>
                  <p>{{ resumeData.software }}</p>
                </div>
              }

              @if (resumeData.skills) {
                <div class="sidebar-section">
                  <h3 class="section-heading">Skills</h3>
                  <p>{{ resumeData.skills }}</p>
                </div>
              }

              @if (resumeData.languages) {
                <div class="sidebar-section">
                  <h3 class="section-heading">Languages</h3>
                  <p>{{ resumeData.languages }}</p>
                </div>
              }

              @if (resumeData.additional && resumeData.additional.length > 0) {
                <div class="sidebar-section flex flex-col">
                  <h3 class="section-heading">Additional</h3>
                  <ul class="sidebar-list no-bullets">
                    @for (item of resumeData.additional; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
              }

              @if (resumeData.education && resumeData.education.length > 0) {
                <div class="sidebar-section flex flex-col">
                  <h3 class="section-heading">Education</h3>
                  @for (edu of resumeData.education; track edu.degree + edu.school) {
                    <div class="education-entry flex flex-col">
                      <span class="degree font-bold text-base">{{ edu.degree }}</span>
                      <span class="school text-base color-text-muted">{{ edu.school }}</span>
                    </div>
                  }
                </div>
              }
            </aside>
          </div>

          @if (resumeData.downloadUrl) {
            <div class="download-section flex justify-center">
              <a [href]="resumeData.downloadUrl" download class="btn-link" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
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
    @keyframes pageFadeIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .resume-content {
      padding-top: 4rem;
    }

    .page-title {
      font-size: 4rem;
      text-align: left;
      margin-bottom: 6rem;
      font-weight: 400;
      opacity: 0;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
    }

    .resume-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 6rem;
    }

    .section-heading {
      font-family: var(--font-main);
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-primary);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      padding-bottom: 1rem;
      margin-bottom: 3rem;
    }

    .job-entry {
      position: relative;
      padding-left: 2rem;
      margin-bottom: 3.5rem;
    }

    .job-entry::before {
      content: "";
      position: absolute;
      left: 5px;
      top: 0;
      bottom: -3.5rem;
      width: 1px;
      background: #EBEBEB;
      z-index: 1;
    }

    .job-entry:first-child::before {
      top: 14px;
    }

    .job-entry:last-child::before {
      bottom: auto;
      height: 14px;
    }

    .job-entry::after {
      content: "";
      position: absolute;
      left: 0;
      top: 9px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: var(--color-primary);
      z-index: 2;
    }

    .job-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .job-title {
      font-family: var(--font-header);
      font-size: 1.5rem;
      font-weight: 500;
      color: #111;
      line-height: 1.2;
    }

    .job-meta {
      font-size: 1.1rem;
      color: var(--color-text-muted);
      line-height: 1.4;
    }

    .job-bullets {
      list-style-type: none;
      padding-left: 0;
      margin: 0;
    }

    .job-bullets li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 1.2rem;
      line-height: 1.7;
      color: #4a4a4a;
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
      font-size: 0.9rem;
      color: #555;
      line-height: 1.6;
      opacity: 0;
      animation: pageFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
    }

    .sidebar-section .section-heading {
      margin-bottom: 1.5rem;
    }

    .sidebar-section p {
      font-size: 1.2rem;
      line-height: 1.8;
      color: #555;
      margin: 0;
    }

    .sidebar-list {
      list-style-type: none;
      padding-left: 1rem;
      margin: 0;
    }

    .sidebar-list li {
      font-size: 1.2rem;
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

