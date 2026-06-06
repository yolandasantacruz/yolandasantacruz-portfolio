import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MouseTrailComponent } from './mouse-trail.component';
import { By } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MouseTrailService } from './mouse-trail.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MouseTrailComponent', () => {
  let component: MouseTrailComponent;
  let fixture: ComponentFixture<MouseTrailComponent>;
  let document: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouseTrailComponent],
    }).compileComponents();

    document = TestBed.inject(DOCUMENT);
    fixture = TestBed.createComponent(MouseTrailComponent);
    component = fixture.componentInstance;
    
    // Mock WebGL2 context
    const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
    canvas.getContext = (type: string) => {
      if (type === 'webgl2') {
        const noop = () => { /* no-op */ };
        return {
          createShader: () => ({}),
          shaderSource: noop,
          compileShader: noop,
          getShaderParameter: () => true,
          createProgram: () => ({}),
          attachShader: noop,
          linkProgram: noop,
          getProgramParameter: () => true,
          useProgram: noop,
          getAttribLocation: () => 0,
          createBuffer: () => ({}),
          bindBuffer: noop,
          bufferData: noop,
          enableVertexAttribArray: noop,
          vertexAttribPointer: noop,
          getUniformLocation: () => ({}),
          viewport: noop,
          clearColor: noop,
          clear: noop,
          uniform1f: noop,
          uniform2f: noop,
          uniform2fv: noop,
          uniform4f: noop,
          drawArrays: noop,
        };
      }
      return null;
    };

    fixture.detectChanges();
  });

  it('should create the mouse trail component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a canvas element for the shader', () => {
    const canvas = fixture.debugElement.query(By.css('canvas'));
    expect(canvas).toBeTruthy();
    expect(canvas.nativeElement.classList.contains('shader-canvas')).toBeTruthy();
  });

  it('should have the correct architectural z-index and positioning', () => {
    const hostElement = fixture.nativeElement;
    const win = document.defaultView;
    if (!win) throw new Error('Window is not available');
    
    const styles = win.getComputedStyle(hostElement);
    
    // In actual browser these would be '999999' and 'fixed'
    // In test environment we check the component's defined styles
    expect(styles.zIndex).toBe('999999');
    expect(styles.position).toBe('fixed');
    expect(styles.pointerEvents).toBe('none');
  });

  it('should have an aria-hidden container for accessibility', () => {
    const container = fixture.debugElement.query(By.css('.mouse-trail'));
    expect(container.nativeElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should not initialize engine on the server (SSR safety)', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [MouseTrailComponent],
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        {
          provide: MouseTrailService,
          useValue: { init: vi.fn(), destroy: vi.fn(), setMousePosition: vi.fn(), resize: vi.fn() }
        }
      ]
    }).compileComponents();

    const serverFixture = TestBed.createComponent(MouseTrailComponent);
    serverFixture.detectChanges();
    await serverFixture.whenStable();

    const service = TestBed.inject(MouseTrailService);
    expect(service.init).not.toHaveBeenCalled();
  });
});
