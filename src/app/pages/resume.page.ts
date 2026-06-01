import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Resume | Yolanda Santa Cruz',
  meta: [
    {
      name: 'description',
      content: 'View Yolanda Santa Cruz\'s professional work history, skills, software tools, BFA education, and language proficiencies.'
    }
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

        <div class="resume-grid">
          <div class="main-column">

            <section class="work-experience flex flex-col">
              <h3 class="section-heading scroll-reveal">Work Experience</h3>
              
              <div class="job-entry scroll-reveal">
                <div class="job-header">
                  <span class="job-title">Lead Product Designer</span>
                  <span class="job-meta">Discover Financial Services, Chicago, IL (Remote) · January 2025 - Present</span>
                </div>
                <ul class="job-bullets">
                  <li>Led end-to-end design for a $200M initiative, focused on increasing user engagement and visibility of card-related benefits.</li>
                  <li>Drove cross-functional collaboration across legal, development, data, and program management teams. Presented in large meetings and design reviews to align stakeholders.</li>
                  <li>Created accessible legal documentation and screen reader friendly annotations to support compliance and inclusive design.</li>
                </ul>
              </div>

              <div class="job-entry scroll-reveal">
                <div class="job-header">
                  <span class="job-title">Senior Product Designer</span>
                  <span class="job-meta">Upside, Washington, DC (Remote) · November 2022 - July 2024</span>
                </div>
                <ul class="job-bullets">
                  <li>Drove a 251% increase in transaction volume by leading a full vertical rollout.</li>
                  <li>Cut dispute rates by 50% and reduced monthly dispute costs by 92% by optimizing transaction workflows, leveraging data and research to inform design decisions.</li>
                  <li>Unified in-app payment experience for 1 party and 3 party models.</li>
                  <li>Partnered with engineering and product to execute a full app rewrite.</li>
                </ul>
              </div>

              <div class="job-entry scroll-reveal">
                <div class="job-header">
                  <span class="job-title">Senior Product Designer</span>
                  <span class="job-meta">Fetch Rewards, Chicago, IL (Remote) · February 2021 - October 2022</span>
                </div>
                <ul class="job-bullets">
                  <li>Increased card activation rate by 25% and reduced customer acquisition costs by 70% by defining and implementing strategies with product.</li>
                  <li>Ensured consistency across platforms by collaborating with the design systems designer and improving hand-offs between design and engineering.</li>
                  <li>Conducted user interviews and iterated based on feedback.</li>
                </ul>
              </div>

              <div class="job-entry scroll-reveal">
                <div class="job-header">
                  <span class="job-title">Product Designer</span>
                  <span class="job-meta">Zelenia, Miami, FL (Remote) · December 2019 - February 2021</span>
                </div>
                <ul class="job-bullets">
                  <li>Led product discussions and captured requirements across various industries.</li>
                  <li>Developed UX/UI strategies and design systems.</li>
                  <li>Created and maintained master assemblies, user flows, wireframes, and prototypes.</li>
                  <li>Adapted to different product stages and methodologies by collaborating with multiple development teams.</li>
                </ul>
              </div>

              <div class="job-entry scroll-reveal">
                <div class="job-header">
                  <span class="job-title">UX/UI Designer</span>
                  <span class="job-meta">Home61, Miami, FL · September 2018 - December 2019</span>
                </div>
                <ul class="job-bullets">
                  <li>Reduced lead acquisition costs by 83%, saving $50,000 annually through a targeted web interface redesign.</li>
                  <li>Collaborated with the CEO on investor pitch decks for clarity and impact.</li>
                  <li>Responsible for the visual language and overall brand consistency of the company.</li>
                </ul>
              </div>

              <div class="job-entry scroll-reveal">
                <div class="job-header flex flex-col">
                  <span class="job-title">{{ 'Graphic Designer' }}</span>
                  <span class="job-meta text-base color-text-muted">Pacific Service Center, Portland, OR · October 2016 - August 2018</span>
                </div>
                <ul class="job-bullets">
                  <li>Generated 110% of the week's target revenue in 24 hours by completing an emergency project for a top client, securing additional business.</li>
                  <li>Led multiple projects simultaneously in a fast-paced environment.</li>
                  <li>Managed over 30 clients via on-site meetings, phone calls, and emails through cross-team collaboration with sales, production, and install teams.</li>
                </ul>
              </div>
            </section>
          </div>

          <aside class="sidebar flex flex-col gap-16">
            <div class="sidebar-section flex flex-col scroll-reveal" >
              <h3 class="section-heading">Software</h3>
              <p>Figma · Illustrator · Photoshop · InDesign · Framer · Midjourney · Spline · AI Notion · Miro · Slack · Dovetail · UserTesting · Mixpanel · LogRocket · Tableau · Hotjar · JIRA</p>
            </div>

            <div class="sidebar-section scroll-reveal">
              <h3 class="section-heading">Skills</h3>
              <p>Cross-functional Collaboration · UX Strategy · Stakeholder Engagement · Mentorship & Team Leadership · User Research · Journey Mapping · Data Literacy · A/B Testing · Information Architecture · Wireframing · Rapid Prototyping · Interaction Design · Visual Design · Generative Design · Accessibility Design · Agile Methodologies · Product Engineering · Critical Thinking · Creative Problem Solving · Effective Communication · Presentation Skills</p>
            </div>

            <div class="sidebar-section scroll-reveal">
              <h3 class="section-heading">Languages</h3>
              <p>English · Spanish</p>
            </div>

            <div class="sidebar-section flex flex-col scroll-reveal">
              <h3 class="section-heading">Additional</h3>
              <ul class="sidebar-list no-bullets">
                <li>ADP Mentor</li>
                <li>Community involvement with non-profits</li>
                <li>Volunteering and teaching experience in thesis consulting, drawing, photography, and clay modeling.</li>
                <li>Published author of short stories and poems.</li>
              </ul>
            </div>

            <div class="sidebar-section flex flex-col scroll-reveal">
              <h3 class="section-heading">Education</h3>
              <div class="education-entry flex flex-col">
                <span class="degree font-bold text-base">Bachelor of Fine Arts, BFA</span>
                <span class="school text-base color-text-muted">San Alejandro Fine Arts Academy, Havana, Cuba</span>
              </div>
            </div>
          </aside>
        </div>

        <div class="download-section flex justify-center scroll-reveal">
          <button class="btn-blob download-btn">DOWNLOAD RESUME</button>
        </div>
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
      padding-bottom: 8rem;
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
      margin-bottom: 6rem;
    }

    .section-heading {
      font-family: var(--font-main);
      font-size: 1.2rem;
      font-weight: 700;
      color: #3b9f98;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      padding-bottom: 1rem;
      margin-bottom: 3rem;
    }

    .job-entry {
      margin-bottom: 3.5rem;
    }

    .job-header {
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
      color: #3b9f98;
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
      color: #3b9f98;
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
      margin-top: 4rem;
    }

    /* Width override for the resume CTA — global .btn-blob defaults to 200px */
    .download-btn {
      --btn-blob-width: 220px;
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
export default class ResumeComponent { }
