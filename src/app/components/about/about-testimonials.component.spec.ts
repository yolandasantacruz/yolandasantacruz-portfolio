import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutTestimonialsComponent } from './about-testimonials.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { CatmullRomService } from './catmull-rom.service';

describe('AboutTestimonialsComponent', () => {
  let component: AboutTestimonialsComponent;
  let componentRef: ComponentRef<AboutTestimonialsComponent>;
  let fixture: ComponentFixture<AboutTestimonialsComponent>;
  let catmullRomService: CatmullRomService;

  const mockTestimonials = [
    { name: 'John Doe', role: 'CEO', avatar: 'avatar1.png', quote: 'Great work!' },
    { name: 'Jane Smith', role: 'CTO', avatar: 'avatar2.png', quote: 'Stunning designs.' },
    { name: 'Bob Johnson', role: 'Product Manager', avatar: 'avatar3.png', quote: 'Highly professional.' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTestimonialsComponent],
      providers: [CatmullRomService],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutTestimonialsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    catmullRomService = TestBed.inject(CatmullRomService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not render section when items is undefined', () => {
    fixture.detectChanges();
    const section = fixture.debugElement.query(By.css('.premium-testimonial-section'));
    expect(section).toBeNull();
  });

  it('should render section and current testimonial details when items are provided', () => {
    componentRef.setInput('items', mockTestimonials);
    fixture.detectChanges();

    const section = fixture.debugElement.query(By.css('.premium-testimonial-section'));
    expect(section).toBeTruthy();

    const name = fixture.debugElement.query(By.css('.author-name')).nativeElement.textContent;
    const role = fixture.debugElement.query(By.css('.author-role')).nativeElement.textContent;
    const avatar = fixture.debugElement.query(By.css('.author-avatar')).nativeElement.getAttribute('src');

    expect(name).toBe('John Doe');
    expect(role).toBe('CEO');
    expect(avatar).toBe('avatar1.png');

    const counter = fixture.debugElement.query(By.css('.testimonial-counter')).nativeElement.textContent;
    expect(counter).toContain('1 / 3');
  });

  it('should navigate to next slide and update index when next button is clicked', () => {
    componentRef.setInput('items', mockTestimonials);
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(0);

    const buttons = fixture.debugElement.queryAll(By.css('.quote-nav-btn'));
    // Next button is the second button
    const nextButton = buttons[1].nativeElement;
    nextButton.click();
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(1);

    const name = fixture.debugElement.query(By.css('.author-name')).nativeElement.textContent;
    expect(name).toBe('Jane Smith');

    const counter = fixture.debugElement.query(By.css('.testimonial-counter')).nativeElement.textContent;
    expect(counter).toContain('2 / 3');
  });

  it('should disable previous button on first slide and next button on last slide', () => {
    componentRef.setInput('items', mockTestimonials);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.quote-nav-btn'));
    const prevButton = buttons[0].nativeElement;
    const nextButton = buttons[1].nativeElement;

    expect(prevButton.disabled).toBe(true);
    expect(nextButton.disabled).toBe(false);

    // Go to slide 2
    nextButton.click();
    fixture.detectChanges();
    expect(prevButton.disabled).toBe(false);
    expect(nextButton.disabled).toBe(false);

    // Go to slide 3
    nextButton.click();
    fixture.detectChanges();
    expect(prevButton.disabled).toBe(false);
    expect(nextButton.disabled).toBe(true);
  });

  it('should inject CatmullRomService', () => {
    expect(component['catmullRom']).toBe(catmullRomService);
  });
});
