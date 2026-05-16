import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideClientHydration } from '@angular/platform-browser';
import { AboutTestimonialsComponent } from '../components/about/about-testimonials.component';
import { By } from '@angular/platform-browser';
import { Testimonial } from './about.types';

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Haley Anikas',
    role: 'Senior Product Designer @ Enterprise SaaS',
    avatar: 'https://placehold.co/120/111/fff?text=HA',
    quote: 'Yolanda is an incredibly passionate and talented designer.',
  },
  {
    name: 'Ryan Huels-Morrissey',
    role: 'Senior iOS Developer @ Mobile Labs',
    avatar: 'https://placehold.co/120/111/fff?text=RH',
    quote: 'I\'ve always been impressed that Yolanda stays up-to-date.',
  },
];

describe('AboutTestimonialsComponent - Premium Testimonial & Blob Motion', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTestimonialsComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideClientHydration(),
      ],
    }).compileComponents();
  });

  it('should render testimonial section with initial blob background color', () => {
    const fixture = TestBed.createComponent(AboutTestimonialsComponent);
    fixture.componentRef.setInput('items', MOCK_TESTIMONIALS);
    fixture.detectChanges();

    const blobPath = fixture.debugElement.query(By.css('.wavy-card-path'));
    expect(blobPath).toBeTruthy();
    const fillValue = (blobPath.styles['fill'] || blobPath.nativeElement.style.fill || '').toUpperCase();
    expect(fillValue.includes('#EDFBF9') || fillValue.includes('237, 251, 249')).toBe(true);
  });

  it('should navigate to next testimonial and update blob background color', () => {
    const fixture = TestBed.createComponent(AboutTestimonialsComponent);
    fixture.componentRef.setInput('items', MOCK_TESTIMONIALS);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.currentIndex()).toBe(0);

    // Click next slide button
    const nextBtn = fixture.debugElement.queryAll(By.css('.quote-nav-btn'))[1];
    nextBtn.nativeElement.click();
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(1);

    const blobPath = fixture.debugElement.query(By.css('.wavy-card-path'));
    const fillValue = (blobPath.styles['fill'] || blobPath.nativeElement.style.fill || '').toUpperCase();
    expect(fillValue.includes('#FFFCEB') || fillValue.includes('255, 252, 235')).toBe(true);
  });

  it('should not navigate past the last testimonial', () => {
    const fixture = TestBed.createComponent(AboutTestimonialsComponent);
    fixture.componentRef.setInput('items', MOCK_TESTIMONIALS);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.nextSlide();
    component.nextSlide(); // attempt to go past end
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(MOCK_TESTIMONIALS.length - 1);
  });

  it('should not navigate before the first testimonial', () => {
    const fixture = TestBed.createComponent(AboutTestimonialsComponent);
    fixture.componentRef.setInput('items', MOCK_TESTIMONIALS);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.prevSlide(); // attempt to go before start
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(0);
  });
});
