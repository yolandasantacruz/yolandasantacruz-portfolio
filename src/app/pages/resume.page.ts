import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';

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
            <section class="intro">
              <h2 class="name">Yolanda Santa Cruz</h2>
              <p class="summary">Product Designer with experience in product strategy, data-driven solutions, and cross-functional teamwork. Background in payment flow optimization, growth initiatives, mobile UX enhancements, and consistent cross-platform design.</p>
            </section>

            <section class="work-experience">
              <h3 class="section-heading">Work Experience</h3>
              
              <div class="job-entry">
                <div class="job-header">
                  <span class="job-title">Lead Product Designer</span>
                  <span class="job-meta">Discover Financial Services, Chicago, IL (Remote) · January 2023 - Present</span>
                </div>
                <ul class="job-bullets">
                  <li>Led end-to-end design for a $200M initiative, focused on increasing user engagement and visibility of card-related benefits.</li>
                  <li>Drove cross-functional collaboration across legal, development, data, and program management teams. Presented in large meetings and design reviews to align stakeholders.</li>
                  <li>Created accessible legal documentation and screen reader friendly annotations to support compliance and inclusive design.</li>
                </ul>
              </div>

              <div class="job-entry">
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

              <div class="job-entry">
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

              <div class="job-entry">
                <div class="job-header">
                  <span class="job-title">Product Designer</span>
                  <span class="job-meta">Zalando, Miami, FL (Remote) · December 2019 - February 2021</span>
                </div>
                <ul class="job-bullets">
                  <li>Led product discussions and captured requirements across various industries.</li>
                  <li>Developed UX/UI strategies and design systems.</li>
                  <li>Created and maintained master assemblies, user flows, wireframes, and prototypes.</li>
                  <li>Adapted to different product stages and methodologies by collaborating with multiple development teams.</li>
                </ul>
              </div>

              <div class="job-entry">
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

              <div class="job-entry">
                <div class="job-header">
                  <span class="job-title">Graphic Designer</span>
                  <span class="job-meta">Pacific Service Center, Portland, OR · October 2016 - August 2018</span>
                </div>
                <ul class="job-bullets">
                  <li>Generated 110% of the week's target revenue in 24 hours by completing an emergency project for a top client, securing additional business.</li>
                  <li>Led multiple projects simultaneously in a fast-paced environment.</li>
                  <li>Managed over 30 clients via on-site meetings, phone calls, and emails through cross-team collaboration with sales, production, and install teams.</li>
                </ul>
              </div>
            </section>
          </div>

          <aside class="sidebar">
            <div class="contact-info">
              <p>Miami, FL</p>
              <p>yolandasantacruz.com</p>
              <p>linkedin.com/in/yolandasantacruz</p>
            </div>

            <div class="sidebar-section">
              <h3 class="section-heading">Software</h3>
              <p>Figma · Illustrator · Photoshop · InDesign · Framer · Midjourney · Spline · AI Notion · Miro · Slack · Dovetail · UserTesting · Mixpanel · LogRocket · Tableau · Hotjar · JIRA</p>
            </div>

            <div class="sidebar-section">
              <h3 class="section-heading">Skills</h3>
              <p>Cross-functional Collaboration · UX Strategy · Stakeholder Engagement · Mentorship & Team Leadership · User Research · Journey Mapping · Data Literacy · A/B Testing · Information Architecture · Wireframing · Rapid Prototyping · Interaction Design · Visual Design · Generative Design · Accessibility Design · Agile Methodologies · Product Engineering · Critical Thinking · Creative Problem Solving · Effective Communication · Presentation Skills</p>
            </div>

            <div class="sidebar-section">
              <h3 class="section-heading">Languages</h3>
              <p>English · Spanish</p>
            </div>

            <div class="sidebar-section">
              <h3 class="section-heading">Additional</h3>
              <ul class="sidebar-list">
                <li>ADP Mentor</li>
                <li>Community involvement with non-profits</li>
                <li>Volunteering and teaching experience in thesis consulting, drawing, photography, and clay modeling.</li>
                <li>Published author of short stories and poems.</li>
              </ul>
            </div>

            <div class="sidebar-section">
              <h3 class="section-heading">Education</h3>
              <div class="education-entry">
                <span class="degree">Bachelor of Fine Arts, BFA</span>
                <span class="school">San Alejandro Fine Arts Academy, Havana, Cuba</span>
              </div>
            </div>

            <div class="sidebar-wave">
              <svg viewBox="0 0 200 100" preserveAspectRatio="none">
                <path d="M0,50 C50,100 150,0 200,50 C200,50 200,100 200,100 L0,100 Z" fill="none" stroke="#55c5c7" stroke-width="2" opacity="0.3"></path>
                <path d="M0,60 C50,110 150,10 200,60" fill="none" stroke="#55c5c7" stroke-width="2" opacity="0.2"></path>
                <path d="M0,70 C50,120 150,20 200,70" fill="none" stroke="#55c5c7" stroke-width="2" opacity="0.1"></path>
              </svg>
            </div>
          </aside>
        </div>

        <div class="download-section">
          <button class="download-btn">Download Resume</button>
        </div>
      </main>

      <portfolio-footer />
    </div>
  `,
  styles: `
    .resume-content {
      padding-top: 4rem;
      padding-bottom: 8rem;
    }

    .page-title {
      font-size: 4rem;
      text-align: center;
      margin-bottom: 6rem;
      font-weight: 800;
    }

    .resume-grid {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 6rem;
      margin-bottom: 6rem;
    }

    .name {
      font-size: 2.5rem;
      color: #55c5c7;
      margin-bottom: 1.5rem;
      font-weight: 700;
    }

    .summary {
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 4rem;
      max-width: 800px;
    }

    .section-heading {
      color: #55c5c7;
      text-transform: uppercase;
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(85, 197, 199, 0.2);
      padding-bottom: 0.5rem;
    }

    .job-entry {
      margin-bottom: 3rem;
    }

    .job-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .job-title {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .job-meta {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .job-bullets {
      padding-left: 1.5rem;
      margin: 0;
    }

    .job-bullets li {
      margin-bottom: 0.75rem;
      line-height: 1.5;
      font-size: 1rem;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .contact-info p {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .sidebar-section p {
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0;
    }

    .sidebar-list {
      padding-left: 1rem;
      margin: 0;
      list-style-type: none;
    }

    .sidebar-list li {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      line-height: 1.4;
      position: relative;
    }

    .sidebar-list li::before {
      content: "•";
      color: #55c5c7;
      position: absolute;
      left: -1rem;
    }

    .education-entry {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .degree {
      font-weight: 700;
      font-size: 0.875rem;
    }

    .school {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .sidebar-wave {
      margin-top: 2rem;
      height: 80px;
      opacity: 0.5;
    }

    .download-section {
      display: flex;
      justify-content: center;
      margin-top: 4rem;
    }

    .download-btn {
      padding: 1rem 3rem;
      background-color: #55c5c7;
      color: white;
      border: none;
      border-radius: 30px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .download-btn:hover {
      background-color: #44b4b6;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(85, 197, 199, 0.2);
    }

    @media (max-width: 900px) {
      .resume-grid {
        grid-template-columns: 1fr;
      }
      .sidebar {
        order: -1;
      }
    }
  `,
})
export default class ResumeComponent {}
