import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaveSeparatorComponent } from './wave-separator.component';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';

describe('WaveSeparatorComponent', () => {
  let component: WaveSeparatorComponent;
  let fixture: ComponentFixture<WaveSeparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveSeparatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WaveSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an SVG with aria-hidden true for accessibility', () => {
    const container = fixture.debugElement.query(By.css('.wave-container')).nativeElement;
    expect(container.getAttribute('aria-hidden')).toBe('true');

    const svg = fixture.debugElement.query(By.css('.wave-svg'));
    expect(svg).toBeTruthy();
  });
});
