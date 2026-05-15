import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'portfolio-hero',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1>Hi, I'm Yolanda</h1>
        <p class="subtitle">
          A Product Designer focused on B2C and SaaS, with
          experience navigating highly regulated environments and
          driving growth. I love turning complex systems into simple,
          intuitive experiences that build trust and empowerment.
        </p>
        <a routerLink="/about" class="about-link">ABOUT ME &rarr;</a>
        
        <div class="social-links">
          <a href="https://behance.net" target="_blank" rel="noopener noreferrer">Be</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">in</a>
        </div>
      </div>
      
      <div class="hero-image-container">
        <div class="wave-graphic"></div>
        <img src="https://placehold.co/400x500/2a2a2a/55c5c7?text=Yolanda" alt="Yolanda" class="profile-image" />
      </div>
    </section>
  `,
  styles: `
    .hero {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 6rem; min-height: 70vh;
    }
    .hero-content { flex: 1; max-width: 500px; text-align: left; }
    .hero h1 { font-size: 4rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.1; }
    .subtitle { font-size: 1.25rem; line-height: 1.6; margin-bottom: 2.5rem; opacity: 0.8; }
    .about-link {
      display: inline-block; text-decoration: none; color: #55c5c7;
      font-weight: 600; font-size: 0.875rem; letter-spacing: 1px;
      margin-bottom: 2rem; text-transform: uppercase; transition: transform 0.2s;
    }
    .about-link:hover { transform: translateX(5px); }
    .social-links { display: flex; gap: 1rem; }
    .social-links a { text-decoration: none; color: inherit; font-weight: 500; opacity: 0.7; }
    .social-links a:hover { opacity: 1; }
    .hero-image-container { flex: 1; position: relative; display: flex; justify-content: flex-end; }
    .profile-image { max-width: 400px; border-radius: 20px; position: relative; z-index: 2; }
    .wave-graphic {
      position: absolute; bottom: -40px; left: -100px; width: 300px; height: 100px;
      background-image: repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(85, 197, 199, 0.2) 10px, rgba(85, 197, 199, 0.2) 20px);
      z-index: 1; border-radius: 20px;
    }
    @media (max-width: 768px) {
      .hero { flex-direction: column; align-items: flex-start; text-align: left; gap: 4rem; padding: 2rem 0; }
      .hero-content { text-align: left; }
      .social-links { justify-content: flex-start; }
      .hero-image-container { justify-content: flex-start; width: 100%; }
      .profile-image { max-width: 100%; }
    }
  `
})
export class HeroComponent {}
