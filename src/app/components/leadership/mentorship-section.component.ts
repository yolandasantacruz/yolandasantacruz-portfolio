import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'portfolio-mentorship-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="adplist-container">
      <div class="adplist-copy">
        <span class="quiet-badge">TOP 1% MENTOR ON ADPLIST</span>
        <h3 class="quiet-title">Guiding the next generation of product design leaders</h3>
        <p class="quiet-philosophy">
          I empower designers worldwide to navigate organizational ambiguity and align purposeful careers with complex business goals.
        </p>

        <div class="quiet-metrics">
          <div class="quiet-metric">
            <span class="metric-num">50+</span>
            <span class="metric-label">DESIGNERS MENTORED</span>
          </div>
          <div class="metric-divider"></div>
          <div class="quiet-metric">
            <span class="metric-num">120+</span>
            <span class="metric-label">SESSIONS HOSTED</span>
          </div>
          <div class="metric-divider"></div>
          <div class="quiet-metric">
            <span class="metric-num">5★</span>
            <span class="metric-label">RATING AVERAGE</span>
          </div>
        </div>

        <div class="quiet-cta">
          <a href="https://adplist.org" target="_blank" rel="noopener noreferrer" class="quiet-btn">
            Book a Session &rarr;
          </a>
        </div>
      </div>

      <div class="adplist-video">
        <div class="video-header">
          <span class="video-label">VIEW: A Sample Mentorship Session</span>
        </div>
        <div class="player-wrapper">
          <img src="https://placehold.co/1200x675/121212/ffffff?text=Sample+Mentorship+Session" alt="Sample Mentorship Session" class="video-thumbnail" />
          <div class="play-overlay">
            <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .adplist-container {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 5rem;
      align-items: center;
      width: 100%;
    }

    .adplist-copy {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .quiet-badge {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: #777;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .quiet-title {
      font-size: 2.5rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: #111;
      margin-bottom: 1.5rem;
      line-height: 1.25;
    }

    .quiet-philosophy {
      font-size: 1.2rem;
      font-weight: 300;
      color: #555;
      line-height: 1.8;
      margin-bottom: 3.5rem;
    }

    .quiet-metrics {
      display: flex;
      align-items: center;
      gap: 2.5rem;
      margin-bottom: 3.5rem;
      flex-wrap: wrap;
    }

    .quiet-metric {
      display: flex;
      align-items: baseline;
      gap: 0.6rem;
    }

    .metric-num {
      font-size: 1.5rem;
      font-weight: 400;
      color: #111;
    }

    .metric-label {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: #777;
      text-transform: uppercase;
    }

    .metric-divider {
      width: 1px;
      height: 20px;
      background-color: rgba(0, 0, 0, 0.12);
    }

    .quiet-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #111;
      color: #ffffff;
      padding: 1rem 2.25rem;
      border-radius: 100px;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-decoration: none;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .quiet-btn:hover {
      background-color: #333;
      transform: translateY(-2px);
    }

    /* Video Player Right Column */
    .adplist-video {
      width: 100%;
    }

    .video-header {
      margin-bottom: 1rem;
    }

    .video-label {
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: #666;
      text-transform: uppercase;
    }

    .player-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 14px;
      overflow: hidden;
      background: #121212;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      cursor: pointer;
    }

    .video-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s;
    }

    .player-wrapper:hover .video-thumbnail {
      transform: scale(1.03);
      opacity: 0.8;
    }

    .play-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 72px;
      height: 72px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
    }

    .player-wrapper:hover .play-overlay {
      transform: translate(-50%, -50%) scale(1.1);
      background: #ffffff;
    }

    .play-icon {
      width: 28px;
      height: 28px;
      color: #111;
      margin-left: 4px;
    }

    @media (max-width: 1024px) {
      .adplist-container { grid-template-columns: 1fr; gap: 4rem; }
    }

    @media (max-width: 768px) {
      .quiet-metrics { gap: 1.5rem; flex-direction: column; align-items: flex-start; }
      .metric-divider { display: none; }
    }
  `
})
export class MentorshipSectionComponent {}
