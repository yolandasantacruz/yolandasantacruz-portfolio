import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MouseTrailComponent } from './mouse-trail.component';
import { By } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { MouseTrailService } from './mouse-trail.service';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

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

  describe('device capability gating', () => {
    let originalMatchMedia: typeof globalThis.matchMedia;
    let originalUserAgent: string;
    let mockService: {
      init: ReturnType<typeof vi.fn>;
      destroy: ReturnType<typeof vi.fn>;
      setMousePosition: ReturnType<typeof vi.fn>;
      resize: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      const win = document.defaultView;
      if (!win) throw new Error('Window is not available');
      originalMatchMedia = win.matchMedia;
      originalUserAgent = win.navigator.userAgent;
      
      mockService = {
        init: vi.fn(),
        destroy: vi.fn(),
        setMousePosition: vi.fn(),
        resize: vi.fn(),
      };
    });

    afterEach(() => {
      const win = document.defaultView;
      if (!win) throw new Error('Window is not available');
      win.matchMedia = originalMatchMedia;
      Object.defineProperty(win.navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true
      });
    });

    const setupTest = async (userAgent: string, matchMediaMock: (query: string) => boolean) => {
      const win = document.defaultView;
      if (!win) throw new Error('Window is not available');
      win.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: matchMediaMock(query),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })) as unknown as typeof globalThis.matchMedia;

      Object.defineProperty(win.navigator, 'userAgent', {
        value: userAgent,
        configurable: true
      });

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [MouseTrailComponent],
        providers: [
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: MouseTrailService, useValue: mockService as unknown as MouseTrailService }
        ]
      }).compileComponents();

      const fixture = TestBed.createComponent(MouseTrailComponent);
      // Mock WebGL2 context
      const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
      const noop = () => { /* no-op */ };
      canvas.getContext = () => ({
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
      });

      fixture.detectChanges();
      await fixture.whenStable();
    };

    it('should initialize engine on desktop environments (has hover, fine pointer, large screen, non-mobile UA)', async () => {
      await setupTest(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        (query) => {
          if (query === '(pointer: fine)') return true;
          if (query === '(any-hover: hover)') return true;
          return false;
        }
      );
      expect(mockService.init).toHaveBeenCalled();
    });

    it('should not initialize engine on mobile devices (pointer: coarse)', async () => {
      await setupTest(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        (query) => {
          if (query === '(pointer: coarse)') return true;
          return false;
        }
      );
      expect(mockService.init).not.toHaveBeenCalled();
    });

    it('should not initialize engine when screen width is small (<= 1024px)', async () => {
      await setupTest(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        (query) => {
          if (query === '(pointer: fine)') return true;
          if (query === '(any-hover: hover)') return true;
          if (query === '(max-width: 1024px)') return true;
          return false;
        }
      );
      expect(mockService.init).not.toHaveBeenCalled();
    });

    it('should not initialize engine if hover is not supported', async () => {
      await setupTest(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        (query) => {
          if (query === '(pointer: fine)') return true;
          if (query === '(any-hover: hover)') return false;
          return false;
        }
      );
      expect(mockService.init).not.toHaveBeenCalled();
    });
  });
});
