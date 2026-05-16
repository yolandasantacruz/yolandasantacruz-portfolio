import { ChangeDetectionStrategy, Component, signal, computed, afterNextRender, inject, PLATFORM_ID, NgZone, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';
import { NgClass } from '@angular/common';

interface TimelineItem {
  company: string;
  logo: string;
  period: string;
  role: string;
  location: string;
}

interface PublishedWork {
  tag: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

interface BlobShape {
  start: [number, number];
  curves: [number, number, number, number, number, number][];
}

const BLOB_SHAPES: BlobShape[] = [
  // Slide 0: Current soft mint green shape
  {
    start: [100, 80],
    curves: [
      [150, 20, 250, 10, 350, 25],
      [450, 40, 550, 60, 650, 55],
      [750, 50, 900, 10, 1000, 20],
      [1100, 30, 1160, 80, 1180, 180],
      [1200, 280, 1190, 400, 1150, 480],
      [1110, 560, 1000, 590, 850, 585],
      [700, 580, 600, 520, 500, 520],
      [400, 520, 250, 570, 150, 550],
      [50, 530, 10, 400, 20, 280],
      [30, 160, 50, 140, 100, 80]
    ]
  },
  // Slide 1: Soft pale yellow shape (dramatically realigned organic lagoon shape)
  {
    start: [140, 120],
    curves: [
      [240, 30, 320, 90, 420, 70],
      [520, 50, 620, 20, 720, 80],
      [820, 140, 920, 40, 1020, 60],
      [1120, 80, 1140, 140, 1150, 250],
      [1160, 360, 1110, 440, 1040, 500],
      [970, 560, 880, 530, 780, 560],
      [680, 590, 580, 550, 480, 560],
      [380, 570, 260, 590, 160, 530],
      [60, 470, 30, 370, 40, 270],
      [50, 170, 80, 140, 140, 120]
    ]
  },
  // Slide 2: Soft pale lavender shape (in case 3rd testimonial is ever added)
  {
    start: [80, 100],
    curves: [
      [180, 60, 280, 40, 380, 60],
      [480, 80, 580, 40, 680, 50],
      [780, 60, 880, 20, 980, 80],
      [1080, 140, 1160, 100, 1170, 200],
      [1180, 300, 1150, 420, 1100, 490],
      [1050, 560, 950, 580, 850, 550],
      [750, 520, 650, 580, 550, 540],
      [450, 500, 320, 560, 200, 540],
      [80, 520, 20, 400, 30, 280],
      [40, 160, 50, 120, 80, 100]
    ]
  }
];

const BLOB_COLORS = [
  '#EDFBF9', // Soft mint green
  '#FFFCEB', // Soft pale yellow
  '#F4F0FC'  // Soft pale lavender
];

@Component({
  selector: 'portfolio-about',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgClass, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <portfolio-header />

      <main class="about-main">
        <!-- Section 1: Hero Intro (Asymmetric Layout) -->
        <section class="about-hero" portfolioScrollReveal>
          <div class="hero-left">
            <h1 class="hero-greeting">Hola there, I'm Yolanda Santa Cruz</h1>
            <p class="hero-mission">
              Lead product designer crafting intuitive, human-centered, and engaging digital experiences. Specializing in fintech, complex SaaS systems, and design consulting.
            </p>
            <div class="social-links">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.91h2.79v8.37H6.46v-8.37M7.86 6.32a1.62 1.62 0 0 0-1.63 1.62 1.62 1.62 0 0 0 1.63 1.63 1.62 1.62 0 0 0 1.62-1.63 1.62 1.62 0 0 0-1.62-1.62z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" class="social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" aria-label="Dribbble" class="social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm8.17 7.7a8.55 8.55 0 0 1 .33 2.3 8.35 8.35 0 0 1-.72 3.44c-.3-.14-3.52-1.57-6.22-1.16v-.06a26.24 26.24 0 0 0 1.54-6.42 16.7 16.7 0 0 1 5.07 1.9zm-8.17-6.2a8.5 8.5 0 0 1 5.62 2.1c-1.32.96-3.78 1.66-5.48 1.83a28.44 28.44 0 0 0-3.32-5.75A8.34 8.34 0 0 1 12 3.5zm-5 2.53a8.4 8.4 0 0 1 3.5-1.58c1.1 1.76 2.17 3.84 2.8 5.34-3.38.8-6.8 1-7.85 1a8.45 8.45 0 0 1 1.55-4.76zm-1.5 6c1.1-.03 4.8-.23 8.4-1.14a28.2 28.2 0 0 1-1.36 5.66 18.15 18.15 0 0 1-5.7 1.7 8.5 8.5 0 0 1-1.34-6.22zm6.85 7.17a15.7 15.7 0 0 0 5-1.5 15.4 15.4 0 0 0 2.45 2.1 8.5 8.5 0 0 1-7.45-.6z"/></svg>
              </a>
            </div>
          </div>
          <div class="hero-right">
            <div class="portrait-wrapper">
              <img src="/about_portrait_1778866767765.png" alt="Yolanda Santa Cruz" class="hero-portrait" />
              <div class="portrait-glow"></div>
            </div>
          </div>
        </section>

        <!-- Centered Core Belief Pull-Quote -->
        <section class="belief-section" portfolioScrollReveal>
          <h2 class="belief-statement">
            "I believe in crafting simple, human-centered designs that solve problems and forge deep emotional connections."
          </h2>
          <div class="belief-dash"></div>
        </section>

        <!-- Section 2: Dual Pillars ('At Work' vs 'Leadership & Community') -->
        <section class="dual-pillars-section">
          <!-- Pillar 1: At Work -->
          <div class="pillar-row pillar-work" portfolioScrollReveal>
            <div class="pillar-text">
              <span class="pillar-badge">01 // EXECUTION & STRATEGY</span>
              <h3 class="pillar-title">At Work</h3>
              <p class="pillar-desc">
                I thrive in environments where cross-functional alignment and rigorous user research drive innovation. By bridging the gap between engineering complexity and user intuition, I design scalable design systems and robust product architectures that deliver measurable business impact.
              </p>
              <div class="competencies">
                <div class="competency-item">
                  <span class="comp-label">Design Systems Architecture</span>
                  <span class="comp-val">Expert</span>
                </div>
                <div class="competency-item">
                  <span class="comp-label">Fintech & High-Regulation UX</span>
                  <span class="comp-val">Expert</span>
                </div>
                <div class="competency-item">
                  <span class="comp-label">Cross-Functional Strategy</span>
                  <span class="comp-val">Advanced</span>
                </div>
              </div>
            </div>
            <div class="pillar-visual">
              <div class="masked-image arch-mask">
                <img src="https://placehold.co/800x1000/1e293b/5ed6cc?text=Systems+Thinking" alt="Design Execution" />
              </div>
            </div>
          </div>

          <!-- Pillar 2: Philosophy & Mentorship -->
          <div class="pillar-row pillar-philosophy" portfolioScrollReveal>
            <div class="pillar-visual">
              <div class="masked-image pill-mask">
                <img src="https://placehold.co/800x1000/111a19/f5ea8c?text=Mentorship+%26+Culture" alt="Mentorship Philosophy" />
              </div>
            </div>
            <div class="pillar-text">
              <span class="pillar-badge">02 // PHILOSOPHY & COMMUNITY</span>
              <h3 class="pillar-title">Philosophy</h3>
              <p class="pillar-desc">
                Growing up with a drive to create, I realized early on that technology shapes our shared reality. My philosophy centers on empowering the next generation of designers through empathetic mentorship, opening doors for underrepresented talent, and building inclusive design cultures.
              </p>
              <div class="quiet-metrics-box">
                <div class="quiet-metric">
                  <span class="metric-num">50+</span>
                  <span class="metric-label">Designers Mentored</span>
                </div>
                <div class="quiet-metric">
                  <span class="metric-num">120+</span>
                  <span class="metric-label">Sessions Hosted</span>
                </div>
                <div class="quiet-metric">
                  <span class="metric-num">Top 1%</span>
                  <span class="metric-label">ADPList Mentor Badge</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Media & Mentorship Carousel -->
        <section class="action-carousel-section" portfolioScrollReveal>
          <div class="section-header">
            <span class="section-tag">IN ACTION</span>
            <h2 class="carousel-heading">Mentorship, Keynotes & Community</h2>
          </div>

          <div class="action-grid">
            <!-- Main Video Slot -->
            <div class="action-card video-card">
              <div class="video-player-box">
                <img src="https://placehold.co/1200x675/121212/ffffff?text=Mentorship+Session+Preview" alt="Mentorship Preview" class="video-thumb" />
                <div class="play-indicator">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="play-svg"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div class="card-caption">
                <span class="caption-tag">VIDEO FEATURE</span>
                <h4 class="caption-title">Live 1:1 Mentorship Session — Navigating SaaS Complexity</h4>
              </div>
            </div>

            <!-- Supporting Cards -->
            <div class="action-card">
              <div class="media-box">
                <img src="https://placehold.co/800x600/1a1a1a/5ed6cc?text=UX+Keynote" alt="Conference Keynote" class="media-img" />
              </div>
              <div class="card-caption">
                <span class="caption-tag">KEYNOTE</span>
                <h4 class="caption-title">Keynote at Global Design Conference 2025</h4>
              </div>
            </div>

            <div class="action-card">
              <div class="media-box">
                <img src="https://placehold.co/800x600/1a1a1a/f5ea8c?text=Design+Workshop" alt="Workshop Session" class="media-img" />
              </div>
              <div class="card-caption">
                <span class="caption-tag">WORKSHOP</span>
                <h4 class="caption-title">Design Systems Engineering Masterclass</h4>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 4: Premium Testimonial Section (Inside Wavy SVG Container) -->
        <section class="premium-testimonial-section" portfolioScrollReveal>
          <div class="testimonial-card-wrapper">
            <svg viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="testimonial-wavy-bg">
              <path #wavyBlobPath class="wavy-card-path" [attr.d]="initialBlobPath" [style.fill]="currentBlobColor()" />
            </svg>
            <div class="testimonial-container">
              <div class="testimonial-header">
                <!-- Author Info First (Active Slide) -->
                <div class="active-author-info">
                  <img [src]="testimonials[currentIndex()].avatar" [alt]="testimonials[currentIndex()].name" class="author-avatar" />
                  <div class="author-details">
                    <span class="author-name">{{ testimonials[currentIndex()].name }}</span>
                    <span class="author-role">{{ testimonials[currentIndex()].role }}</span>
                  </div>
                </div>

                <!-- Navigation & Counter -->
                <div class="testimonial-nav">
                  <button class="quote-nav-btn" (click)="prevSlide()" [disabled]="currentIndex() === 0" aria-label="Previous testimonial">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="testimonial-counter">{{ currentIndex() + 1 }} / {{ testimonials.length }}</span>
                  <button class="quote-nav-btn" (click)="nextSlide()" [disabled]="currentIndex() === testimonials.length - 1" aria-label="Next testimonial">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
              
              <div class="testimonial-viewport">
                <div class="testimonial-track" [style.transform]="'translateX(-' + (currentIndex() * 100) + '%)'">
                  @for (item of testimonials; track item.name) {
                    <div class="testimonial-slide">
                      <p class="testimonial-quote">"{{ item.quote }}"</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 5: Career Timeline Grid -->
        <section class="timeline-section" portfolioScrollReveal>
          <!-- Top Header + Subheader Next To It -->
          <div class="timeline-header-grid">
            <div class="header-left">
              <span class="section-tag">TRACK RECORD</span>
              <h2 class="timeline-heading">14+ years of experience in crafting exceptional digital experiences</h2>
            </div>
            <div class="header-right">
              <p class="timeline-subhead">
                I've honed my skills across diverse projects and industries, transforming this passion into a fulfilling career. Each experience has shaped my perspective and fueled my growth, allowing me to approach design with a unique blend of expertise and enthusiasm.
              </p>
            </div>
          </div>

          <!-- Two Columns for Positions (with center divider) -->
          <div class="timeline-positions-container">
            <div class="positions-col left-col">
              @for (item of leftTimelineItems; track item.company) {
                <div class="position-item">
                  <div class="position-logo-box">
                    <span class="logo-text">{{ item.logo }}</span>
                  </div>
                  <div class="position-copy">
                    <span class="position-period">{{ item.period }}</span>
                    <h3 class="position-role">{{ item.role }}</h3>
                    <span class="position-loc">{{ item.location }}</span>
                  </div>
                </div>
              }
            </div>

            <div class="positions-divider" aria-hidden="true"></div>

            <div class="positions-col right-col">
              @for (item of rightTimelineItems; track item.company) {
                <div class="position-item">
                  <div class="position-logo-box">
                    <span class="logo-text">{{ item.logo }}</span>
                  </div>
                  <div class="position-copy">
                    <span class="position-period">{{ item.period }}</span>
                    <h3 class="position-role">{{ item.role }}</h3>
                    <span class="position-loc">{{ item.location }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- Section 6: Published Works & Media Grid (Footer Bridge) -->
        <section class="published-section" portfolioScrollReveal>
          <div class="published-header">
            <span class="section-tag">PUBLICATIONS</span>
            <h2 class="published-heading">Articles, interviews & thought leadership</h2>
          </div>

          <div class="works-grid">
            @for (work of publishedWorks; track work.title) {
              <a [href]="work.url" target="_blank" rel="noopener noreferrer" class="work-card">
                <div class="work-thumb-box">
                  <img [src]="work.imageUrl" [alt]="work.title" class="work-thumb" />
                  <span class="work-badge">{{ work.tag }}</span>
                </div>
                <div class="work-info">
                  <h3 class="work-title">{{ work.title }}</h3>
                  <p class="work-desc">{{ work.description }}</p>
                  <span class="work-arrow">Explore &rarr;</span>
                </div>
              </a>
            }
          </div>
        </section>
      </main>

      <portfolio-footer />
    </div>
  `,
  styles: `
    .about-main {
      padding-top: 6rem;
      padding-bottom: 8rem;
    }

    /* Common Section Tags & Headers */
    .section-tag, .pillar-badge {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #3b9f98;
      margin-bottom: 1rem;
      display: inline-block;
    }

    /* Section 1: Hero Intro */
    .about-hero {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 6rem;
      align-items: center;
      margin-bottom: 10rem;
    }

    .hero-greeting {
      font-size: 3.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: #111;
      margin-bottom: 2rem;
    }

    .hero-mission {
      font-size: 1.3rem;
      font-weight: 300;
      line-height: 1.7;
      color: #555;
      margin-bottom: 3rem;
    }

    .social-links {
      display: flex;
      gap: 1.25rem;
    }

    .social-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      transition: all 0.25s ease;
      background: transparent;
    }

    .social-btn:hover {
      border-color: #5ed6cc;
      background: #5ed6cc;
      color: #111;
      transform: translateY(-2px);
    }

    .social-icon {
      width: 20px;
      height: 20px;
    }

    .hero-right {
      display: flex;
      justify-content: center;
      position: relative;
    }

    .portrait-wrapper {
      position: relative;
      width: 380px;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
      border: 2px solid rgba(94, 214, 204, 0.3);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .portrait-wrapper:hover {
      transform: scale(1.02);
      border-color: #5ed6cc;
    }

    .hero-portrait {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Core Belief Pull-Quote */
    .belief-section {
      text-align: center;
      max-width: 900px;
      margin: 0 auto 12rem auto;
      padding: 4rem 2rem;
    }

    .belief-statement {
      font-size: 2.75rem;
      font-weight: 300;
      line-height: 1.35;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 3rem;
    }

    .belief-dash {
      width: 60px;
      height: 2px;
      background: #5ed6cc;
      margin: 0 auto;
    }

    /* Section 2: Dual Pillars */
    .dual-pillars-section {
      display: flex;
      flex-direction: column;
      gap: 12rem;
      margin-bottom: 12rem;
    }

    .pillar-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      align-items: center;
    }

    .pillar-title {
      font-size: 2.5rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 1.5rem;
    }

    .pillar-desc {
      font-size: 1.15rem;
      line-height: 1.8;
      color: #555;
      margin-bottom: 2.5rem;
      font-weight: 300;
    }

    .competencies {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      border-top: 1px solid rgba(0,0,0,0.08);
      padding-top: 2rem;
    }

    .competency-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
    }

    .comp-label {
      font-weight: 600;
      color: #222;
    }

    .comp-val {
      color: #3b9f98;
      font-weight: 500;
      background: rgba(59, 159, 152, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      font-size: 0.8rem;
    }

    .masked-image {
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      background: #f0f0f0;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .masked-image:hover {
      transform: translateY(-8px);
    }

    .arch-mask {
      aspect-ratio: 4 / 5;
      border-radius: 200px 200px 16px 16px;
    }

    .pill-mask {
      aspect-ratio: 4 / 5;
      border-radius: 16px 200px 200px 16px;
    }

    .masked-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s ease;
    }

    .masked-image:hover img {
      transform: scale(1.05);
    }

    /* Quiet Metrics Box */
    .quiet-metrics-box {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      border-top: 1px solid rgba(0,0,0,0.08);
      padding-top: 2.5rem;
    }

    .quiet-metric {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .metric-num {
      font-size: 2rem;
      font-weight: 300;
      color: #111;
      letter-spacing: -0.03em;
    }

    .metric-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #777;
    }

    /* Section 3: Action Carousel Section */
    .action-carousel-section {
      margin-bottom: 12rem;
    }

    .carousel-heading {
      font-size: 2.75rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 4rem;
    }

    .action-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 2rem;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: transparent;
      transition: transform 0.3s ease;
    }

    .action-card:hover {
      transform: translateY(-4px);
    }

    .video-card {
      grid-column: span 1;
    }

    .video-player-box {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 14px;
      overflow: hidden;
      background: #111;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      cursor: pointer;
    }

    .video-thumb, .media-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s ease;
    }

    .video-player-box:hover .video-thumb {
      transform: scale(1.03);
    }

    .play-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease;
    }

    .video-player-box:hover .play-indicator {
      transform: translate(-50%, -50%) scale(1.1);
      background: #fff;
    }

    .play-svg {
      width: 24px;
      height: 24px;
      color: #111;
      margin-left: 3px;
    }

    .media-box {
      aspect-ratio: 4 / 3;
      border-radius: 12px;
      overflow: hidden;
      background: #eee;
    }

    .action-card:hover .media-img {
      transform: scale(1.05);
    }

    .caption-tag {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #3b9f98;
      text-transform: uppercase;
      margin-bottom: 0.4rem;
      display: block;
    }

    .caption-title {
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 1.4;
      color: #111;
      margin: 0;
    }

    /* Section 4: Premium Testimonial Section */
    .premium-testimonial-section {
      margin-bottom: 12rem;
      max-width: 1000px;
      margin-left: auto;
      margin-right: auto;
    }

    .testimonial-card-wrapper {
      position: relative;
      padding: 160px;
      margin: 0 auto;
    }

    .testimonial-wavy-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }

    .wavy-card-path {
      transition: fill 0.8s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .testimonial-container {
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }

    .testimonial-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      padding-bottom: 2.5rem;
    }

    .active-author-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .author-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #5ed6cc;
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    }

    .author-details {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .author-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111;
      letter-spacing: -0.01em;
    }

    .author-role {
      font-size: 0.9rem;
      color: #666;
    }

    .testimonial-nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .testimonial-counter {
      font-size: 1.1rem;
      font-weight: 600;
      color: #111;
      letter-spacing: 0.08em;
      min-width: 3rem;
      text-align: center;
    }

    .quote-nav-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.12);
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #333;
      transition: all 0.25s ease;
    }

    .quote-nav-btn:hover:not(:disabled) {
      border-color: #5ed6cc;
      background: #5ed6cc;
      color: #111;
      transform: scale(1.05);
    }

    .quote-nav-btn:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }

    .testimonial-viewport {
      overflow: hidden;
      width: 100%;
    }

    .testimonial-track {
      display: flex;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .testimonial-slide {
      min-width: 100%;
      box-sizing: border-box;
    }

    .testimonial-quote {
      font-size: 1.15rem;
      font-weight: 300;
      font-style: italic;
      line-height: 1.8;
      color: #111;
      margin: 0;
      letter-spacing: -0.01em;
    }

    /* Section 5: Timeline Track Record */
    .timeline-section {
      margin-bottom: 12rem;
    }

    .timeline-header-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 4rem;
      align-items: start;
      margin-bottom: 6rem;
    }

    .timeline-heading {
      font-size: 2.75rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin: 0;
      line-height: 1.25;
    }

    .timeline-subhead {
      font-size: 1.15rem;
      line-height: 1.8;
      color: #555;
      margin: 0;
      font-weight: 300;
    }

    .timeline-positions-container {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 5rem;
      align-items: start;
    }

    .positions-divider {
      width: 1px;
      align-self: stretch;
      background: rgba(0,0,0,0.08);
    }

    .positions-col {
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }

    .position-item {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .position-logo-box {
      flex: 0 0 130px;
      height: 130px;
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.06);
      border: 1px solid rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      text-align: center;
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .position-item:hover .position-logo-box {
      transform: translateY(-5px);
      border-color: #5ed6cc;
      box-shadow: 0 20px 45px rgba(0,0,0,0.1);
    }

    .logo-text {
      font-size: 1.15rem;
      font-weight: 700;
      color: #111;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }

    .position-copy {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .position-period {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #3b9f98;
      text-transform: uppercase;
    }

    .position-role {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .position-loc {
      font-size: 0.85rem;
      color: #888;
    }

    /* Section 6: Published Works & Media Grid */
    .published-section {
      margin-bottom: 6rem;
    }

    .published-heading {
      font-size: 2.75rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 4rem;
    }

    .works-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
    }

    .work-card {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      text-decoration: none;
      background: transparent;
      transition: transform 0.3s ease;
    }

    .work-card:hover {
      transform: translateY(-6px);
    }

    .work-thumb-box {
      position: relative;
      aspect-ratio: 16 / 10;
      border-radius: 14px;
      overflow: hidden;
      background: #eee;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    }

    .work-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s ease;
    }

    .work-card:hover .work-thumb {
      transform: scale(1.05);
    }

    .work-badge {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      background: rgba(17, 26, 25, 0.85);
      backdrop-filter: blur(8px);
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      padding: 0.4rem 0.8rem;
      border-radius: 100px;
      text-transform: uppercase;
    }

    .work-info {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .work-title {
      font-size: 1.4rem;
      font-weight: 600;
      color: #111;
      margin: 0;
      line-height: 1.35;
    }

    .work-desc {
      font-size: 0.95rem;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .work-arrow {
      font-size: 0.9rem;
      font-weight: 600;
      color: #3b9f98;
      margin-top: 0.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: transform 0.2s ease;
    }

    .work-card:hover .work-arrow {
      transform: translateX(4px);
    }

    /* Responsive Queries */
    @media (max-width: 1024px) {
      .about-hero, .pillar-row { grid-template-columns: 1fr; gap: 4rem; }
      .action-grid { grid-template-columns: 1fr; }
      .works-grid { grid-template-columns: 1fr; }
      .dual-pillars-section { gap: 8rem; margin-bottom: 8rem; }
      .hero-right { order: -1; }
    }

    @media (max-width: 992px) {
      .timeline-header-grid { grid-template-columns: 1fr; gap: 2rem; }
      .timeline-positions-container { grid-template-columns: 1fr; gap: 3.5rem; }
      .positions-divider { display: none; }
    }

    @media (max-width: 768px) {
      .hero-greeting { font-size: 2.5rem; }
      .belief-statement, .pillar-title, .carousel-heading, .timeline-heading, .published-heading { font-size: 2rem; }
      .testimonial-quote { font-size: 1.05rem; }
      .testimonial-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
      .quiet-metrics-box { grid-template-columns: 1fr; gap: 1.5rem; }
      .portrait-wrapper { width: 100%; max-width: 320px; }
      .position-item { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .position-logo-box { width: 100%; height: 80px; }
      .testimonial-card-wrapper { padding: 60px 40px; }
    }
  `
})
export default class AboutComponent implements OnDestroy {
  @ViewChild('wavyBlobPath', { static: false }) blobPathElement?: ElementRef<SVGPathElement>;
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private animFrameId?: number;

  readonly initialBlobPath = "M 100 80 C 150 20, 250 10, 350 25 C 450 40, 550 60, 650 55 C 750 50, 900 10, 1000 20 C 1100 30, 1160 80, 1180 180 C 1200 280, 1190 400, 1150 480 C 1110 560, 1000 590, 850 585 C 700 580, 600 520, 500 520 C 400 520, 250 570, 150 550 C 50 530, 10 400, 20 280 C 30 160, 50 140, 100 80 Z";

  readonly currentIndex = signal(0);
  readonly currentBlobColor = computed(() => BLOB_COLORS[this.currentIndex() % BLOB_COLORS.length]);

  private currentShapeIndex = 0;
  private targetShapeIndex = 0;
  private morphStartTime = 0;
  private isMorphing = false;
  private morphDuration = 800; // 800ms for a satisfying organic transformation

  readonly testimonials = [
    {
      name: 'Haley Anikas',
      role: 'Senior Product Designer @ Enterprise SaaS',
      avatar: 'https://placehold.co/120/111/fff?text=HA',
      quote: 'Yolanda is an incredibly passionate and talented designer who cares deeply about her craft. She’s an artist through and through who also uses data and research to back up her design decisions, knowing that the business’s needs matter too. The best of both worlds.'
    },
    {
      name: 'Ryan Huels-Morrissey',
      role: 'Senior iOS Developer @ Mobile Labs',
      avatar: 'https://placehold.co/120/111/fff?text=RH',
      quote: 'I’ve always been impressed that Yolanda stays up-to-date with what is going on in the design world. She doesn’t shy away from learning new technologies and tools. It is clear that this line of work is her passion and she demonstrates that every day.'
    }
  ];

  readonly leftTimelineItems: TimelineItem[] = [
    {
      company: 'Google',
      logo: 'Google',
      period: '2021 — PRESENT',
      role: 'Lead Product Designer',
      location: 'Remote'
    },
    {
      company: 'ANGUSTIA',
      logo: 'ANGUSTIA',
      period: '2019 — PRESENT',
      role: 'Product Designer',
      location: 'Remote'
    },
    {
      company: 'Comcast',
      logo: 'Comcast',
      period: '2018 — 2021',
      role: 'Senior Product Designer',
      location: 'Philadelphia, PA'
    }
  ];

  readonly rightTimelineItems: TimelineItem[] = [
    {
      company: 'DLA',
      logo: 'DLA',
      period: '2016 — 2018',
      role: 'Product & UI Designer',
      location: 'Miami, FL'
    },
    {
      company: 'AXIS',
      logo: 'AXIS',
      period: '2014 — 2016',
      role: 'Sr. Digital Designer',
      location: 'Miami, FL'
    },
    {
      company: 'Nobox',
      logo: 'Nobox',
      period: '2011 — 2014',
      role: 'Art Director Jr.',
      location: 'Miami, FL'
    }
  ];

  readonly publishedWorks: PublishedWork[] = [
    {
      tag: 'ARTICLE',
      title: 'Architecting Design Tokens for Multi-Brand SaaS',
      description: 'A deep dive into standardizing design variables across Figma and React to ensure flawless visual parity.',
      imageUrl: 'https://placehold.co/800x500/1a1a1a/5ed6cc?text=Design+Tokens',
      url: 'https://medium.com'
    },
    {
      tag: 'VIDEO',
      title: 'Breaking Down Fintech UX Patterns',
      description: 'An interactive session on building user trust through micro-copy, clear data visualization, and transparent permissions.',
      imageUrl: 'https://placehold.co/800x500/1a1a1a/f5ea8c?text=Fintech+UX',
      url: 'https://youtube.com'
    },
    {
      tag: 'THOUGHT LEADERSHIP',
      title: 'Mentorship as a Catalyst for Engineering Alignment',
      description: 'How designing collaborative feedback loops within product teams leads to faster shipping and higher code quality.',
      imageUrl: 'https://placehold.co/800x500/1a1a1a/3da49c?text=Engineering+Alignment',
      url: 'https://medium.com'
    }
  ];

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.ngZone.runOutsideAngular(() => {
          this.startAnimationLoop();
        });
      }
    });
  }

  private startAnimationLoop() {
    const loop = () => {
      if (this.blobPathElement?.nativeElement) {
        const now = performance.now();
        const time = now * 0.0015;
        let baseShape: BlobShape;

        if (this.isMorphing) {
          const elapsed = now - this.morphStartTime;
          const progress = Math.min(elapsed / this.morphDuration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 4); // Quartic ease out

          const startShape = BLOB_SHAPES[this.currentShapeIndex];
          const endShape = BLOB_SHAPES[this.targetShapeIndex];

          baseShape = {
            start: [
              startShape.start[0] + (endShape.start[0] - startShape.start[0]) * easeProgress,
              startShape.start[1] + (endShape.start[1] - startShape.start[1]) * easeProgress
            ],
            curves: startShape.curves.map((c, i) => {
              const targetC = endShape.curves[i];
              return [
                c[0] + (targetC[0] - c[0]) * easeProgress,
                c[1] + (targetC[1] - c[1]) * easeProgress,
                c[2] + (targetC[2] - c[2]) * easeProgress,
                c[3] + (targetC[3] - c[3]) * easeProgress,
                c[4] + (targetC[4] - c[4]) * easeProgress,
                c[5] + (targetC[5] - c[5]) * easeProgress,
              ] as [number, number, number, number, number, number];
            })
          };

          if (progress === 1) {
            this.isMorphing = false;
            this.currentShapeIndex = this.targetShapeIndex;
          }
        } else {
          baseShape = BLOB_SHAPES[this.targetShapeIndex];
        }

        const startX = baseShape.start[0] + Math.sin(time + 9 * 0.8) * 18;
        const startY = baseShape.start[1] + Math.cos(time + 9 * 0.9) * 18;
        let d = `M ${startX.toFixed(1)} ${startY.toFixed(1)}`;

        for (let i = 0; i < baseShape.curves.length; i++) {
          const curve = baseShape.curves[i];
          const c1x = curve[0] + Math.sin(time + i * 0.8 + 0.3) * 14;
          const c1y = curve[1] + Math.cos(time + i * 0.9 + 0.3) * 14;
          const c2x = curve[2] + Math.sin(time + i * 0.8 + 0.6) * 14;
          const c2y = curve[3] + Math.cos(time + i * 0.9 + 0.6) * 14;

          const ex = curve[4] + Math.sin(time + i * 0.8) * 18;
          const ey = curve[5] + Math.cos(time + i * 0.9) * 18;

          d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
        }
        d += ' Z';

        this.blobPathElement.nativeElement.setAttribute('d', d);
      }
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  nextSlide() {
    if (this.currentIndex() < this.testimonials.length - 1) {
      this.currentIndex.update(i => i + 1);
      this.triggerMorph(this.currentIndex());
    }
  }

  prevSlide() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      this.triggerMorph(this.currentIndex());
    }
  }

  goToSlide(index: number) {
    this.currentIndex.set(index);
    this.triggerMorph(index);
  }

  private triggerMorph(newIndex: number) {
    const nextShapeIndex = newIndex % BLOB_SHAPES.length;
    if (this.targetShapeIndex !== nextShapeIndex) {
      this.currentShapeIndex = this.targetShapeIndex;
      this.targetShapeIndex = nextShapeIndex;
      this.morphStartTime = performance.now();
      this.isMorphing = true;
    }
  }

  ngOnDestroy() {
    if (this.animFrameId !== undefined) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
