import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutHeroComponent } from './about-hero.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';

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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not render when data input is undefined', () => {
    fixture.detectChanges();
    const section = fixture.debugElement.query(By.css('.about-hero'));
    expect(section).toBeNull();
  });

  it('should render hero greeting and mission when data is provided', () => {
    componentRef.setInput('data', {
      greeting: 'Hello there! ',
      mission: 'I\'m a UX/UI Designer with 8+ years of experience passionate about designing inclusive, accessible, and user-centric products. My work spans across product design, UX research, service design, and brand identity, with a focus on solving complex problems for diverse audiences. I\'ve had the privilege of working with clients across the globe, including those in the US, LATAM, and Europe.',
    });
    fixture.detectChanges();

    const greeting = fixture.debugElement.query(By.css('.hero-greeting'));
    const mission = fixture.debugElement.query(By.css('.hero-mission'));

    expect(greeting.nativeElement.textContent).toBe(component.data()?.greeting);
    expect(mission.nativeElement.textContent.trim()).toBe(component.data()?.mission);
  });

  it('should not render social links when socials input is undefined', () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    fixture.detectChanges();

    const socialLinks = fixture.debugElement.query(By.css('.social-links'));
    expect(socialLinks).toBeNull();
  });

  it('should not render social links when socials has an empty array', () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    componentRef.setInput('socials', { links: [] });
    fixture.detectChanges();

    const socialLinks = fixture.debugElement.query(By.css('.social-links'));
    expect(socialLinks).toBeNull();
  });

  it('should render social links when socials data is provided', () => {
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
    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.css('.social-btn'));
    expect(links.length).toBe(2);
  });

  it('should set correct href and aria-label on social links', () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    componentRef.setInput('socials', {
      links: [
        { platform: 'dribbble', url: 'https://dribbble.com/yolanda', label: 'Dribbble' },
      ],
    });
    fixture.detectChanges();

    const anchor = fixture.debugElement.query(By.css('.social-btn'));
    expect(anchor.nativeElement.getAttribute('href')).toBe('https://dribbble.com/yolanda');
    expect(anchor.nativeElement.getAttribute('aria-label')).toBe('Dribbble');
    expect(anchor.nativeElement.getAttribute('target')).toBe('_blank');
    expect(anchor.nativeElement.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render SVG icon for known platforms', () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    componentRef.setInput('socials', {
      links: [
        { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
      ],
    });
    fixture.detectChanges();

    const svg = fixture.debugElement.query(By.css('.social-icon'));
    expect(svg).toBeTruthy();
    const path = svg.nativeElement.querySelector('path');
    expect(path).toBeTruthy();
    expect(path.getAttribute('d')).toBeTruthy();
  });

  it('should not render SVG icon for unknown platforms', () => {
    componentRef.setInput('data', {
      greeting: 'Hello',
      mission: 'Mission',
    });
    componentRef.setInput('socials', {
      links: [
        { platform: 'unknown-platform', url: 'https://example.com', label: 'Unknown' },
      ],
    });
    fixture.detectChanges();

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

  it('should derive socialLinks from socials input via computed signal', () => {
    const mockLinks = [
      { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
    ];
    componentRef.setInput('socials', { links: mockLinks });
    fixture.detectChanges();

    expect(component.socialLinks()).toEqual(mockLinks);
  });

  it('should return empty array for socialLinks when socials is undefined', () => {
    expect(component.socialLinks()).toEqual([]);
  });
});
