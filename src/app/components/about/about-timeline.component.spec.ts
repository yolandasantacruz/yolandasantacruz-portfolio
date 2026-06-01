import { TestBed } from '@angular/core/testing';
import { AboutTimelineComponent } from './about-timeline.component';
import { TimelineData } from '../../pages/about.types';
import { By } from '@angular/platform-browser';

const MOCK_TIMELINE_DATA: TimelineData = {
  heading: '10+ years of experience in crafting digital experiences',
  items: [
    {
      company: 'Discover',
      logo: 'images/logos/discover.webp',
      period: 'Jan 2025 — Present',
      role: 'Lead Product Designer',
    },
    {
      company: 'Zelenia',
      logo: 'ZE',
      period: 'Dec 2019 — Feb 2021',
      role: 'Product Designer',
    },
  ],
};

describe('AboutTimelineComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTimelineComponent],
    }).compileComponents();
  });

  it('should render section and heading when data is provided', () => {
    const fixture = TestBed.createComponent(AboutTimelineComponent);
    fixture.componentRef.setInput('data', MOCK_TIMELINE_DATA);
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.timeline-heading'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toBe('10+ years of experience in crafting digital experiences');
  });

  it('should partition timeline items into left and right columns', () => {
    const fixture = TestBed.createComponent(AboutTimelineComponent);
    fixture.componentRef.setInput('data', MOCK_TIMELINE_DATA);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.leftTimelineItems().length).toBe(1);
    expect(component.rightTimelineItems().length).toBe(1);

    expect(component.leftTimelineItems()[0].company).toBe('Discover');
    expect(component.rightTimelineItems()[0].company).toBe('Zelenia');
  });

  it('should render an image logo when the logo string is a file path', () => {
    const fixture = TestBed.createComponent(AboutTimelineComponent);
    fixture.componentRef.setInput('data', MOCK_TIMELINE_DATA);
    fixture.detectChanges();

    const logoBoxes = fixture.debugElement.queryAll(By.css('.position-logo-box'));

    // Discover (the first item) uses an image path
    const discoverBox = logoBoxes[0];
    expect(discoverBox.classes['has-text-logo']).toBeFalsy();

    const img = discoverBox.query(By.css('img.logo-image'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.getAttribute('src')).toBe('images/logos/discover.webp');
    expect(img.nativeElement.getAttribute('alt')).toBe('Discover logo');
  });

  it('should fallback to styled text initials when the logo is not a file path', () => {
    const fixture = TestBed.createComponent(AboutTimelineComponent);
    fixture.componentRef.setInput('data', MOCK_TIMELINE_DATA);
    fixture.detectChanges();

    const logoBoxes = fixture.debugElement.queryAll(By.css('.position-logo-box'));

    // Zelenia (the second item) uses short letters "ZE"
    const zeleniaBox = logoBoxes[1];
    expect(zeleniaBox.classes['has-text-logo']).toBe(true);

    const span = zeleniaBox.query(By.css('.logo-text'));
    expect(span).toBeTruthy();
    expect(span.nativeElement.textContent).toBe('ZE');

    const img = zeleniaBox.query(By.css('img.logo-image'));
    expect(img).toBeNull();
  });

  it('should render the View My Resume link with the global btn-blob class', () => {
    const fixture = TestBed.createComponent(AboutTimelineComponent);
    fixture.componentRef.setInput('data', MOCK_TIMELINE_DATA);
    fixture.detectChanges();

    const resumeLink = fixture.debugElement.query(By.css('.download-btn'));
    expect(resumeLink).toBeTruthy();
    expect(resumeLink.nativeElement.getAttribute('href')).toBe('/resume');
    expect(resumeLink.nativeElement.classList.contains('btn-blob')).toBe(true);
  });

  it('should render company name without location', () => {
    const fixture = TestBed.createComponent(AboutTimelineComponent);
    fixture.componentRef.setInput('data', MOCK_TIMELINE_DATA);
    fixture.detectChanges();

    const companyNames = fixture.debugElement.queryAll(By.css('.position-company'));
    expect(companyNames.length).toBe(2);
    expect(companyNames[0].nativeElement.textContent).toBe('Discover');
    expect(companyNames[1].nativeElement.textContent).toBe('Zelenia');
  });
});
