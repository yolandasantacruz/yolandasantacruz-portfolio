import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let componentRef: ComponentRef<HeroComponent>;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create the component', () => {
    componentRef.setInput('data', {
      tag: 'TEST TAG',
      hook: 'Test Hook Line',
      subcopy: 'This is a test subcopy description.'
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render tag, hook, and subcopy when data is provided', () => {
    componentRef.setInput('data', {
      tag: 'TEST TAG',
      hook: 'Test Hook Line',
      subcopy: 'This is a test subcopy description.'
    });
    fixture.detectChanges();

    const tag = fixture.debugElement.query(By.css('.hero-tag'));
    const hook = fixture.debugElement.query(By.css('.hero-hook'));
    const subcopy = fixture.debugElement.query(By.css('.hero-subcopy'));

    expect(tag.nativeElement.textContent).toBe('TEST TAG');
    expect(hook.nativeElement.textContent).toBe('Test Hook Line');
    expect(subcopy.nativeElement.textContent.trim()).toBe('This is a test subcopy description.');
  });

  it('should render the About Me button pointing to /about', () => {
    componentRef.setInput('data', {
      tag: 'TEST TAG',
      hook: 'Test Hook Line',
      subcopy: 'This is a test subcopy description.'
    });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.about-button'));
    expect(button).toBeTruthy();
    expect(button.nativeElement.getAttribute('href')).toBe('/about');
  });

  it('should parse hook and render cohesive-phrase spans and layout break when hook contains a comma', () => {
    componentRef.setInput('data', {
      tag: 'TEST TAG',
      hook: 'Designing for impact, scale, and ease',
      subcopy: 'This is a test subcopy description.'
    });
    fixture.detectChanges();

    const hook = fixture.debugElement.query(By.css('.hero-hook'));
    const phrases = hook.queryAll(By.css('.cohesive-phrase'));
    const breakEl = hook.query(By.css('.hero-break'));

    expect(phrases.length).toBe(2);
    expect(phrases[0].nativeElement.textContent).toBe('Designing for impact,');
    expect(phrases[1].nativeElement.textContent).toBe('scale, and ease');
    expect(phrases[1].nativeElement.classList.contains('italic-text')).toBe(true);
    expect(breakEl).toBeTruthy();
  });
});
