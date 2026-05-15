import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'portfolio-about',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <portfolio-header />

      <main class="about-content">
        <!-- Hero Section remains the same -->
        <section class="hero-section">
          <div class="text-side">
            <h1 class="page-title">About</h1>
            <p>I’m a philomath (aka very curious person). I love thinking about how things work and analyzing why they influence the way we feel. Product design has given me a space to do this.</p>
            <p>I’ve built products at different stages, from end-to-end launches to scaled growth, and I get especially excited by complex challenges and thoughtful collaboration.</p>
            <p>Outside of design, I like to spend time painting, writing, chilling with friends, and occasionally tracking down the best dark chocolate bar (Hu Salty still holds the crown). 👑</p>
            <p>I believe great experiences should anticipate what someone needs before they even realize it, and do so in a way that feels almost a little magical. If you feel the same, I’d love to connect.</p>
          </div>
          <div class="image-side">
            <div class="portrait-container">
              <img src="/about_portrait_1778866767765.png" alt="Yolanda Santa Cruz" class="portrait">
            </div>
          </div>
        </section>

        <div class="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C150,110 350,10 500,60 C650,110 850,10 1000,60 C1150,110 1200,60 1200,60 L1200,120 L0,120 Z" class="wave-path"></path>
          </svg>
        </div>

        <section class="testimonials-section">
          <h2 class="section-title">What Colleagues Say About Me</h2>
          
          <div class="carousel-container">
            <div class="carousel-track" [style.transform]="'translateX(-' + (currentIndex() * 100) + '%)'">
              @for (testimonial of testimonials; track $index) {
                <div class="testimonial-slide">
                  <div class="testimonial-content">
                    <p class="quote">"{{ testimonial.quote }}"</p>
                    <div class="author">
                      <span class="name">- {{ testimonial.name }}</span>
                      <span class="role">{{ testimonial.role }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="carousel-controls">
              <button class="nav-btn prev" (click)="prevSlide()" [disabled]="currentIndex() === 0" aria-label="Previous slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                <span class="sr-only">Previous slide</span>
              </button>
              
              <div class="carousel-dots">
                @for (dot of testimonials; track $index) {
                  <button class="dot" [class.active]="currentIndex() === $index" (click)="goToSlide($index)" [attr.aria-label]="'Go to slide ' + ($index + 1)">
                    <span class="sr-only">Slide {{ $index + 1 }}</span>
                  </button>
                }
              </div>

              <button class="nav-btn next" (click)="nextSlide()" [disabled]="currentIndex() === testimonials.length - 1" aria-label="Next slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                <span class="sr-only">Next slide</span>
              </button>
            </div>
          </div>
        </section>

        <div class="wave-divider flipped">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C150,110 350,10 500,60 C650,110 850,10 1000,60 C1150,110 1200,60 1200,60 L1200,120 L0,120 Z" class="wave-path"></path>
          </svg>
        </div>

        <section class="connect-section">
          <h2 class="section-title">Let's Connect</h2>
          <form class="connect-form">
            <div class="form-group">
              <label for="name">Name *</label>
              <input type="text" id="name" placeholder="What should I call you?" required>
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" placeholder="Where can I drop a reply?" required>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" placeholder="What brings you here?" rows="4"></textarea>
            </div>
            <button type="submit" class="submit-btn">Send</button>
          </form>
        </section>
      </main>

      <portfolio-footer />
    </div>
  `,
  styles: `
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    .about-content { padding-top: 4rem; padding-bottom: 8rem; }
    .hero-section { display: flex; gap: 6rem; align-items: center; margin-bottom: 8rem; }
    .text-side { flex: 1; }
    .text-side p { font-size: 1.125rem; line-height: 1.6; margin-bottom: 1.5rem; color: var(--color-text); }
    .page-title { font-size: 4rem; margin-bottom: 3rem; text-align: center; }
    .image-side { flex: 0 0 400px; display: flex; justify-content: center; }
    .portrait-container { width: 350px; height: 350px; border-radius: 50%; overflow: hidden; border: 8px solid #55c5c7; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    .portrait { width: 100%; height: 100%; object-fit: cover; }
    .wave-divider { margin: 6rem 0; height: 100px; width: 100%; opacity: 0.2; }
    .wave-divider.flipped { transform: scaleX(-1); }
    .wave-path { fill: none; stroke: #55c5c7; stroke-width: 2; }
    .section-title { font-size: 2.5rem; text-align: center; margin-bottom: 4rem; }
    
    .carousel-container {
      max-width: 800px;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
    }

    .carousel-track {
      display: flex;
      transition: transform 0.5s ease-in-out;
    }

    .testimonial-slide {
      min-width: 100%;
      box-sizing: border-box;
      padding: 0 1rem;
    }

    .testimonial-content {
      text-align: center;
    }

    .quote {
      font-size: 1.5rem;
      font-style: italic;
      line-height: 1.6;
      margin-bottom: 2.5rem;
      color: var(--color-text);
      font-family: var(--font-header);
    }

    .author {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .author .name { font-weight: 700; font-size: 1.125rem; }
    .author .role { font-size: 0.875rem; color: var(--color-text-muted); }

    .carousel-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-top: 3rem;
    }

    .nav-btn {
      background: none;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-text);
      transition: all 0.2s;
    }

    .nav-btn:hover:not(:disabled) {
      border-color: #55c5c7;
      color: #55c5c7;
      background: rgba(85, 197, 199, 0.05);
    }

    .nav-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .nav-btn svg { width: 24px; height: 24px; }

    .carousel-dots { display: flex; gap: 0.75rem; }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(0,0,0,0.1);
      border: none;
      padding: 0;
      cursor: pointer;
      transition: all 0.2s;
    }

    .dot.active { background: #55c5c7; transform: scale(1.2); }

    @media (prefers-color-scheme: dark) {
      .nav-btn { border-color: rgba(255,255,255,0.1); }
      .dot { background: rgba(255,255,255,0.1); }
    }

    .connect-section { max-width: 600px; margin: 0 auto; }
    .connect-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.875rem; font-weight: 600; }
    .form-group input, .form-group textarea { padding: 0.75rem; border: 1px solid rgba(0,0,0,0.1); border-radius: 4px; font-family: inherit; font-size: 1rem; }
    @media (prefers-color-scheme: dark) { .form-group input, .form-group textarea { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: white; } }
    .submit-btn { align-self: center; padding: 0.75rem 3rem; background-color: #55c5c7; color: white; border: none; border-radius: 20px; font-weight: 600; cursor: pointer; transition: transform 0.2s, background-color 0.2s; }
    .submit-btn:hover { background-color: #44b4b6; transform: translateY(-2px); }

    @media (max-width: 1024px) {
      .hero-section { flex-direction: column; gap: 3rem; }
      .quote { font-size: 1.25rem; }
    }
  `,
})
export default class AboutComponent {
  readonly currentIndex = signal(0);
  
  readonly testimonials = [
    {
      name: 'Haley Anikas',
      role: 'Senior Product Designer',
      quote: 'Yolanda is an incredibly passionate and talented designer who cares deeply about her craft. She’s an artist through and through who also uses data and research to back up her design decisions, knowing that the business’s needs matter too. The best of both worlds.'
    },
    {
      name: 'Ryan Huels-Morrissey',
      role: 'Senior iOS Developer',
      quote: 'I’ve always been impressed that Yolanda stays up-to-date with what is going on in the design world. She doesn’t shy away from learning new technologies and tools. It is clear that this use of work is her passion and she demonstrates that every day.'
    }
  ];

  nextSlide() {
    if (this.currentIndex() < this.testimonials.length - 1) {
      this.currentIndex.update(i => i + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
    }
  }

  goToSlide(index: number) {
    this.currentIndex.set(index);
  }
}
