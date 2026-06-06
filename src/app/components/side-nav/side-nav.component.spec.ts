import { TestBed } from '@angular/core/testing';
import { SideNavComponent } from './side-nav.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  template: `
    <portfolio-side-nav 
      [sections]="[{ id: 'test-section', label: 'Test', color: '#000' }]" 
      intersectionSelector=".test-section"
    />
  `,
  imports: [SideNavComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class TestHostComponent { }

describe('SideNavComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
  });

  it('should render navigation pills', async () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    await fixture.whenStable();

    const pills = fixture.nativeElement.querySelectorAll('.nav-pill');
    expect(pills.length).toBe(1);
    expect(pills[0].textContent.trim()).toBe('Test');
  });
});
