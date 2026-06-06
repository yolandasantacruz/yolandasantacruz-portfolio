import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { provideRouter, Router } from '@angular/router';
import { PLATFORM_ID, Component, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class DummyComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'about', component: DummyComponent },
          { path: 'resume', component: DummyComponent }
        ]),
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set activeIndex based on current route', async () => {
    expect(component.activeIndex()).toBe(0); // Default to Work

    await router.navigate(['/about']);
    fixture.detectChanges();
    expect(component.activeIndex()).toBe(1);

    await router.navigate(['/resume']);
    fixture.detectChanges();
    expect(component.activeIndex()).toBe(2);
  });

  it('should recalculate indicator position on window resize', async () => {
    const updateSpy = vi.spyOn(component, 'updateIndicatorPosition');
    
    const doc = TestBed.inject(DOCUMENT);
    doc.defaultView?.dispatchEvent(new Event('resize'));
    await fixture.whenStable();

    expect(updateSpy).toHaveBeenCalledWith(component.activeIndex());
  });

  it('should bypass indicator calculation if not in browser (SSR)', () => {
    // Re-configure for server
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    const serverFixture = TestBed.createComponent(HeaderComponent);
    const serverComponent = serverFixture.componentInstance;
    
    // We can't spy easily after creation without complex setup, but we know indicatorOpacity stays 0 on server
    serverComponent.updateIndicatorPosition(1);
    expect(serverComponent.indicatorOpacity()).toBe(0);
  });
});
