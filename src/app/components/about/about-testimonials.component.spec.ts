import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutTestimonialsComponent } from './about-testimonials.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('AboutTestimonialsComponent', () => {
  let component: AboutTestimonialsComponent;
  let componentRef: ComponentRef<AboutTestimonialsComponent>;
  let fixture: ComponentFixture<AboutTestimonialsComponent>;
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cafSpy: ReturnType<typeof vi.spyOn>;

  const mockTestimonials = [
    { name: 'John Doe', role: 'CEO', avatar: 'avatar1.png', quote: 'Great work!', profileUrl: 'https://linkedin.com/in/johndoe' },
    { name: 'Jane Smith', role: 'CTO', avatar: 'avatar2.png', quote: 'Stunning designs.' },
    { name: 'Bob Johnson', role: 'Product Manager', avatar: 'avatar3.png', quote: 'Highly professional.' },
  ];

  beforeEach(async () => {
    // Prevent real RAF scheduling in jsdom — TestimonialBackgroundAnimationService uses it
    rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(99);
    cafSpy = vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => undefined);

    await TestBed.configureTestingModule({
      imports: [AboutTestimonialsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutTestimonialsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  afterEach(() => {
    rafSpy.mockRestore();
    cafSpy.mockRestore();
  });

  it('should create the component', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should not render section when items is undefined', async () => {
    await fixture.whenStable();
    const section = fixture.debugElement.query(By.css('.premium-testimonial-section'));
    expect(section).toBeNull();
  });

  it('should render section and current testimonial details when items are provided', async () => {
    componentRef.setInput('items', mockTestimonials);
    await fixture.whenStable();

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

  it('should navigate to next slide and update index when next button is clicked', async () => {
    componentRef.setInput('items', mockTestimonials);
    await fixture.whenStable();

    expect(component.currentIndex()).toBe(0);

    const buttons = fixture.debugElement.queryAll(By.css('.quote-nav-btn'));
    buttons.at(1)?.nativeElement.click();
    await fixture.whenStable();

    expect(component.currentIndex()).toBe(1);

    const name = fixture.debugElement.query(By.css('.author-name')).nativeElement.textContent;
    expect(name).toBe('Jane Smith');

    const counter = fixture.debugElement.query(By.css('.testimonial-counter')).nativeElement.textContent;
    expect(counter).toContain('2 / 3');
  });

  it('should disable previous button on first slide and next button on last slide', async () => {
    componentRef.setInput('items', mockTestimonials);
    await fixture.whenStable();

    const buttons = fixture.debugElement.queryAll(By.css('.quote-nav-btn'));
    const prevButton = buttons.at(0)?.nativeElement;
    const nextButton = buttons.at(1)?.nativeElement;

    expect(prevButton?.disabled).toBe(true);
    expect(nextButton?.disabled).toBe(false);

    nextButton?.click();
    await fixture.whenStable();
    expect(prevButton?.disabled).toBe(false);
    expect(nextButton?.disabled).toBe(false);

    nextButton?.click();
    await fixture.whenStable();
    expect(prevButton?.disabled).toBe(false);
    expect(nextButton?.disabled).toBe(true);
  });

  it('should render LinkedIn link and icon when profileUrl is provided', async () => {
    componentRef.setInput('items', mockTestimonials);
    await fixture.whenStable();

    const link = fixture.debugElement.query(By.css('.author-link'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.getAttribute('href')).toBe('https://linkedin.com/in/johndoe');
    expect(link.nativeElement.getAttribute('aria-label')).toBe('Visit John Doe on LinkedIn');

    const icon = fixture.debugElement.query(By.css('.lnk-icon'));
    expect(icon).toBeTruthy();
  });

  it('should not render LinkedIn link and icon when profileUrl is absent', async () => {
    componentRef.setInput('items', mockTestimonials);
    await fixture.whenStable();

    const buttons = fixture.debugElement.queryAll(By.css('.quote-nav-btn'));
    buttons.at(1)?.nativeElement.click();
    await fixture.whenStable();

    const link = fixture.debugElement.query(By.css('.author-link'));
    expect(link).toBeNull();

    const icon = fixture.debugElement.query(By.css('.lnk-icon'));
    expect(icon).toBeNull();
  });

  it('should inject TestimonialBackgroundAnimationService via component providers', () => {
    // TestimonialBackgroundAnimationService is component-scoped — not available from the root injector.
    // Verify injection via the component's public accessor instead.
    expect(component.testimonialBackgroundAnimationService).toBeTruthy();
  });

  it('should derive currentBlobColor from TestimonialBackgroundAnimationService for the active index', async () => {
    componentRef.setInput('items', mockTestimonials);
    await fixture.whenStable();

    const colorAtIndex0 = component.testimonialBackgroundAnimationService.getShapeColor(0);
    expect(component.currentBlobColor()).toBe(colorAtIndex0);
  });

  it('should render initials fallback when image fails to load', async () => {
    componentRef.setInput('items', mockTestimonials);
    await fixture.whenStable();

    // Verify avatar image is rendered initially
    const avatarImg = fixture.debugElement.query(By.css('.author-avatar'));
    expect(avatarImg).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.author-avatar-fallback'))).toBeNull();

    // Trigger image loading error
    avatarImg.nativeElement.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    await fixture.whenStable();

    // Verify avatar image is removed and fallback is rendered with initials
    expect(fixture.debugElement.query(By.css('.author-avatar'))).toBeNull();
    const fallback = fixture.debugElement.query(By.css('.author-avatar-fallback'));
    expect(fallback).toBeTruthy();
    expect(fallback.nativeElement.textContent.trim()).toBe('JD'); // John Doe -> JD
  });

  it('should generate correct initials for different name structures', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('  John    Doe  ')).toBe('JD');
    expect(component.getInitials('SingleName')).toBe('S');
    expect(component.getInitials('John Middle Doe')).toBe('JD');
    expect(component.getInitials('')).toBe('');
  });
});
