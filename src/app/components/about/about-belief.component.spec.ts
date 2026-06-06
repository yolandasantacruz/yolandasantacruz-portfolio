import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutBeliefComponent } from './about-belief.component';
import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentRef } from '@angular/core';

describe('AboutBeliefComponent', () => {
  let component: AboutBeliefComponent;
  let componentRef: ComponentRef<AboutBeliefComponent>;
  let fixture: ComponentFixture<AboutBeliefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutBeliefComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutBeliefComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract plain text from HTML content', () => {
    componentRef.setInput('content', '<blockquote><p>Design is thinking made visual.</p></blockquote>');
    fixture.detectChanges();
    expect(component.quoteText()).toBe('Design is thinking made visual.');
  });
});
