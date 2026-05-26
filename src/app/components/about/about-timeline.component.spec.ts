import { TestBed } from '@angular/core/testing';
import { AboutTimelineComponent } from './about-timeline.component';
import { TimelineData } from '../../pages/about.types';
import { By } from '@angular/platform-browser';

const MOCK_TIMELINE_DATA: TimelineData = {
  heading: '10+ years of experience in crafting digital experiences',
  subhead: 'Mock subhead text detailing track record history.',
  items: [
    {
      company: 'Discover',
      logo: '/images/logos/discover.png',
      period: 'Jan 2025 — Present',
      role: 'Lead Product Designer',
      location: 'Chicago, IL (Remote)',
    },
    {
      company: 'Zelenia',
      logo: 'ZE',
      period: 'Dec 2019 — Feb 2021',
      role: 'Product Designer',
      location: 'Miami, FL (Remote)',
    },
  ],
};

describe('AboutTimelineComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTimelineComponent],
    }).compileComponents();
  });

  it('should render section, heading, and subhead when data is provided', () => {
    const fixture = TestBed.createComponent(AboutTimelineComponent);
    fixture.componentRef.setInput('data', MOCK_TIMELINE_DATA);
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('.timeline-heading'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toBe('10+ years of experience in crafting digital experiences');

    const subhead = fixture.debugElement.query(By.css('.timeline-subhead'));
    expect(subhead).toBeTruthy();
    expect(subhead.nativeElement.textContent).toBe('Mock subhead text detailing track record history.');
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
    expect(img.nativeElement.getAttribute('src')).toBe('/images/logos/discover.png');
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
});
