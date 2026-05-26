import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutHeroComponent } from './about-hero.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AboutHeroComponent', () => {
  let component: AboutHeroComponent;
  let componentRef: ComponentRef<AboutHeroComponent>;
  let fixture: ComponentFixture<AboutHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutHeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutHeroComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create the component', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should not render when data input is undefined', async () => {
    await fixture.whenStable();
    const section = fixture.debugElement.query(By.css('.about-hero'));
    expect(section).toBeNull();
  });

  it('should render hero greeting and mission when data is provided', async () => {
    componentRef.setInput('data', {
      greeting: 'Hello there! ',
      mission: 'I\'m a UX/UI Designer with 8+ years of experience passionate about designing inclusive, accessible, and user-centric products. My work spans across product design, UX research, service design, and brand identity, with a focus on solving complex problems for diverse audiences. I\'ve had the privilege of working with clients across the globe, including those in the US, LATAM, and Europe.',
    });
    await fixture.whenStable();

    const greeting = fixture.debugElement.query(By.css('.hero-greeting'));
    const mission = fixture.debugElement.query(By.css('.hero-mission'));

    expect(greeting.nativeElement.textContent).toBe(component.data()?.greeting);
    expect(mission.nativeElement.textContent.trim()).toBe(component.data()?.mission);
  });

  it('should not render social links when socials input is undefined', async () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    await fixture.whenStable();

    const socialLinks = fixture.debugElement.query(By.css('.social-links'));
    expect(socialLinks).toBeNull();
  });

  it('should not render social links when socials has an empty array', async () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    componentRef.setInput('socials', { links: [] });
    await fixture.whenStable();

    const socialLinks = fixture.debugElement.query(By.css('.social-links'));
    expect(socialLinks).toBeNull();
  });

  it('should render social links when socials data is provided', async () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    componentRef.setInput('socials', {
      links: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/test', label: 'LinkedIn' },
        { platform: 'twitter', url: 'https://twitter.com/test', label: 'Twitter' },
      ],
    });
    await fixture.whenStable();

    const links = fixture.debugElement.queryAll(By.css('.social-btn'));
    expect(links.length).toBe(2);
  });

  it('should set correct href and aria-label on social links', async () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    componentRef.setInput('socials', {
      links: [
        { platform: 'dribbble', url: 'https://dribbble.com/yolanda', label: 'Dribbble' },
      ],
    });
    await fixture.whenStable();

    const anchor = fixture.debugElement.query(By.css('.social-btn'));
    expect(anchor.nativeElement.getAttribute('href')).toBe('https://dribbble.com/yolanda');
    expect(anchor.nativeElement.getAttribute('aria-label')).toBe('Dribbble');
    expect(anchor.nativeElement.getAttribute('target')).toBe('_blank');
    expect(anchor.nativeElement.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render SVG icon for known platforms', async () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    componentRef.setInput('socials', {
      links: [
        { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
      ],
    });
    await fixture.whenStable();

    const svg = fixture.debugElement.query(By.css('.social-icon'));
    expect(svg).toBeTruthy();
    const path = svg.nativeElement.querySelector('path');
    expect(path).toBeTruthy();
    expect(path.getAttribute('d')).toBeTruthy();
  });

  it('should not render SVG icon for unknown platforms', async () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    componentRef.setInput('socials', {
      links: [
        { platform: 'unknown-platform', url: 'https://example.com', label: 'Unknown' },
      ],
    });
    await fixture.whenStable();

    const svg = fixture.debugElement.query(By.css('.social-icon'));
    expect(svg).toBeNull();
  });

  it('should return correct icon path for known platforms', () => {
    expect(component.iconPath('linkedin')).toBeDefined();
    expect(component.iconPath('twitter')).toBeDefined();
    expect(component.iconPath('dribbble')).toBeDefined();
  });

  it('should return undefined for unknown platform', () => {
    expect(component.iconPath('tiktok')).toBeUndefined();
  });

  it('should derive socialLinks from socials input via computed signal', async () => {
    const mockLinks = [
      { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
    ];
    componentRef.setInput('socials', { links: mockLinks });
    await fixture.whenStable();

    expect(component.socialLinks()).toEqual(mockLinks);
  });

  it('should return empty array for socialLinks when socials is undefined', () => {
    expect(component.socialLinks()).toEqual([]);
  });

  it('should parse greeting and render cohesive-phrase spans, layout break and normal smiley when greeting contains a comma and smiley', async () => {
    componentRef.setInput('data', {
      greeting: "Welcome, I'm Yolanda :)",
      mission: "Mission copy text"
    });
    await fixture.whenStable();
    fixture.detectChanges();

    const greeting = fixture.debugElement.query(By.css('.hero-greeting'));
    const phrases = greeting.queryAll(By.css('.cohesive-phrase'));
    const breakEl = greeting.query(By.css('.hero-break'));
    const smileyEl = greeting.query(By.css('.greeting-smiley'));

    expect(phrases.length).toBe(2);
    expect(phrases[0].nativeElement.textContent).toBe('Welcome,');
    expect(phrases[1].nativeElement.textContent).toBe("I'm Yolanda");
    expect(phrases[1].nativeElement.classList.contains('italic-text')).toBe(true);
    expect(smileyEl).toBeTruthy();
    expect(smileyEl.nativeElement.textContent.trim()).toBe(':)');
    expect(smileyEl.nativeElement.classList.contains('italic-text')).toBe(false);
    expect(breakEl).toBeTruthy();
  });
});
