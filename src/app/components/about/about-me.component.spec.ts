import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { AboutMeSection } from '../../models/about.types';
import { AboutMeComponent } from './about-me.component';

const MOCK_ABOUT_DATA: AboutMeSection[] = [
  {
    badge: '01 // LIFE PHILOSOPHY',
    title: 'At Work',
    image: 'images/about/at-work.webp',
    description: 'I believe in trust and empathetic leadership.'
  },
  {
    badge: 'Giving Back',
    title: 'Mentorship',
    description: 'Mentorship on ADPList is a priority for me.',
    videoUrl: 'https://www.youtube.com/embed/yL_yRyzp7oo?autoplay=1',
    linkUrl: 'https://adplist.org/mentors/yolanda-santa-cruz',
    linkLabel: 'Mentorship on ADPList',
    metrics: [
      { num: '200+', label: 'Sessions Hosted' }
    ]
  }
];

describe('AboutMeComponent', () => {
  let component: AboutMeComponent;
  let componentRef: ComponentRef<AboutMeComponent>;
  let fixture: ComponentFixture<AboutMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutMeComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideContent(withMarkdownRenderer()),
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutMeComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create the component', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should not render anything when data input is undefined', async () => {
    await fixture.whenStable();
    const section = fixture.debugElement.query(By.css('.about-me-section'));
    expect(section).toBeNull();
  });

  it('should render section badges and titles when data is provided', async () => {
    componentRef.setInput('data', MOCK_ABOUT_DATA);
    await fixture.whenStable();
    fixture.detectChanges();

    const badges = fixture.debugElement.queryAll(By.css('.section-badge'));
    const titles = fixture.debugElement.queryAll(By.css('.section-title'));

    expect(badges.length).toBe(2);
    expect(titles.length).toBe(2);
    expect(badges[0].nativeElement.textContent).toBe('01 // LIFE PHILOSOPHY');
    expect(titles[0].nativeElement.textContent).toBe('At Work');
  });

  it('should alternate layouts dynamically based on row index', async () => {
    componentRef.setInput('data', MOCK_ABOUT_DATA);
    await fixture.whenStable();
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('.section-row'));
    expect(rows.length).toBe(2);

    // Row 0 has text first, visual second
    const row0Children = rows[0].nativeElement.children;
    expect(row0Children[0].classList.contains('section-text')).toBe(true);
    expect(row0Children[1].classList.contains('section-visual')).toBe(true);

    // Row 1 has visual first, text second
    const row1Children = rows[1].nativeElement.children;
    expect(row1Children[0].classList.contains('section-visual')).toBe(true);
    expect(row1Children[1].classList.contains('section-text')).toBe(true);
  });

  it('should extract correct YouTube thumbnail URL', () => {
    const thumb = component.getYoutubeThumbnail('https://www.youtube.com/embed/yL_yRyzp7oo?autoplay=1');
    expect(thumb).toBe('https://img.youtube.com/vi/yL_yRyzp7oo/maxresdefault.jpg');
  });

  it('should start playing video and render iframe when play trigger is clicked', async () => {
    componentRef.setInput('data', MOCK_ABOUT_DATA);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.activePlayingSection()).toBeNull();
    const playButton = fixture.debugElement.query(By.css('.play-trigger'));
    expect(playButton).toBeTruthy();

    playButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.activePlayingSection()).toBe('Mentorship');
    const iframe = fixture.debugElement.query(By.css('.video-iframe'));
    expect(iframe).toBeTruthy();
    expect(iframe.nativeElement.getAttribute('src')).toBeTruthy();
  });

  it('should render ADPList Super Mentor badge image', async () => {
    const dataWithBadge: AboutMeSection[] = [
      {
        badge: 'Giving Back',
        title: 'Mentorship',
        description: 'Mentorship on ADPList is a priority for me.'
      }
    ];
    componentRef.setInput('data', dataWithBadge);
    await fixture.whenStable();
    fixture.detectChanges();

    const badgeImg = fixture.debugElement.query(By.css('.adplist-badge-container img'));
    expect(badgeImg).toBeTruthy();
    expect(badgeImg.nativeElement.getAttribute('src')).toContain('images/about/top_10.svg');
  });
});
