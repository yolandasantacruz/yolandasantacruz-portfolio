import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrollRevealDirective } from './scroll-reveal.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div portfolioScrollReveal id="test-div">Test Component Content</div>
  `,
  imports: [ScrollRevealDirective],
  standalone: true
})
class TestHostComponent {}

describe('ScrollRevealDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should compile and create the test host component', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    expect(fixture).toBeTruthy();
  });

  it('should add in-view class to elements', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.debugElement.query(By.directive(ScrollRevealDirective));
    expect(element).toBeTruthy();
    expect(element.nativeElement.classList.contains('in-view')).toBe(true);
  });
});
