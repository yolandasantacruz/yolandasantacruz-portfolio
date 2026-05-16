import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideClientHydration } from '@angular/platform-browser';
import { provideContent } from '@analogjs/content';
import PortfolioHomeComponent from './index.page';
import { By } from '@angular/platform-browser';

describe('PortfolioHomeComponent - Navigation Dots (Side Rail)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioHomeComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideClientHydration(),
        provideContent()
      ],
    }).compileComponents();
  });

  it('should render navigation pills in floating side rail', () => {
    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    fixture.detectChanges();

    const navPills = fixture.debugElement.queryAll(By.css('.nav-pill'));
    expect(navPills.length).toBeGreaterThan(0);
  });

  it('should apply active class and aria attributes to active section nav pill', () => {
    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    fixture.detectChanges();

    const activePills = fixture.debugElement.queryAll(By.css('.nav-pill.active'));
    expect(activePills.length).toBe(1);
    expect(activePills[0].nativeElement.getAttribute('aria-current')).toBe('step');
  });

  it('should update active section and scroll when clicked', () => {
    const fixture = TestBed.createComponent(PortfolioHomeComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const navPills = fixture.debugElement.queryAll(By.css('.nav-pill'));
    
    // Simulate clicking the second pill (project-0)
    navPills[1].nativeElement.click();
    fixture.detectChanges();

    expect(component.activeSection()).toBe('hero');
  });
});
