import { TestBed } from '@angular/core/testing';
import { SideNavComponent } from './side-nav.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { vi } from 'vitest';

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

  it('should not render navigation pills on small viewports', async () => {
    const doc = TestBed.inject(DOCUMENT);
    const win = doc.defaultView;
    if (!win) {
      throw new Error('Window is not available');
    }
    const originalMatchMedia = win.matchMedia;
    win.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof globalThis.matchMedia;

    try {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const pills = fixture.nativeElement.querySelectorAll('.nav-pill');
      expect(pills.length).toBe(0);
    } finally {
      win.matchMedia = originalMatchMedia;
    }
  });
});

