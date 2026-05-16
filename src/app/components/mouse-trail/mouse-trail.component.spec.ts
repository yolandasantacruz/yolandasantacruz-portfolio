import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MouseTrailComponent } from './mouse-trail.component';
import { By } from '@angular/platform-browser';

describe('MouseTrailComponent', () => {
  let component: MouseTrailComponent;
  let fixture: ComponentFixture<MouseTrailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouseTrailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MouseTrailComponent);
    component = fixture.componentInstance;
    
    // Mock WebGL2 context
    const canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
    canvas.getContext = (type: string) => {
      if (type === 'webgl2') {
        /* eslint-disable @typescript-eslint/no-empty-function */
        return {
          createShader: () => ({}),
          shaderSource: () => {},
          compileShader: () => {},
          getShaderParameter: () => true,
          createProgram: () => ({}),
          attachShader: () => {},
          linkProgram: () => {},
          getProgramParameter: () => true,
          useProgram: () => {},
          getAttribLocation: () => 0,
          createBuffer: () => ({}),
          bindBuffer: () => {},
          bufferData: () => {},
          enableVertexAttribArray: () => {},
          vertexAttribPointer: () => {},
          getUniformLocation: () => ({}),
          viewport: () => {},
          clearColor: () => {},
          clear: () => {},
          uniform1f: () => {},
          uniform2f: () => {},
          uniform2fv: () => {},
          drawArrays: () => {},
        };
        /* eslint-enable @typescript-eslint/no-empty-function */
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
    // eslint-disable-next-line no-restricted-globals
    const styles = window.getComputedStyle(hostElement);
    
    // In actual browser these would be '5' and 'absolute'
    // In test environment we check the component's defined styles
    expect(styles.zIndex).toBe('5');
    expect(styles.position).toBe('absolute');
    expect(styles.pointerEvents).toBe('none');
  });

  it('should have an aria-hidden container for accessibility', () => {
    const container = fixture.debugElement.query(By.css('.mouse-trail'));
    expect(container.nativeElement.getAttribute('aria-hidden')).toBe('true');
  });
});
