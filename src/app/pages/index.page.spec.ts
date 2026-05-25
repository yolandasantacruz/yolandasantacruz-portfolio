import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { provideContent } from '@analogjs/content';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import PortfolioHomeComponent from './index.page';
import { HeroComponent } from '../components/home/hero/hero.component';
import { By } from '@angular/platform-browser';
import { HomeHeroData } from './home.types';

/** Lightweight stub that satisfies the `data` input without needing full HeroComponent rendering */
@Component({
  selector: 'portfolio-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
class HeroStubComponent {
  readonly data = input.required<HomeHeroData>();
}

describe('PortfolioHomeComponent - Navigation Dots (Side Rail)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioHomeComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideContent(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    })
      .overrideComponent(PortfolioHomeComponent, {
        remove: { imports: [HeroComponent] },
        add: { imports: [HeroStubComponent] },
      })
      .compileComponents();
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

    expect(component.activeSection()).toBe('project-0');
  });


});
