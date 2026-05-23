import { TestBed } from '@angular/core/testing';
import { MouseTrailService } from './mouse-trail.service';

describe('MouseTrailService', () => {
  let service: MouseTrailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MouseTrailService],
    });
    service = TestBed.inject(MouseTrailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow setting mouse position', () => {
    service.setMousePosition(100, 200);
    expect(service['targetX']).toBe(100);
    expect(service['targetY']).toBe(200);
  });

  it('should allow destroying service and canceling animation frame', () => {
    service['rafId'] = 123;
    const cancelSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
    service.destroy();
    expect(cancelSpy).toHaveBeenCalledWith(123);
    expect(service['gl']).toBeNull();
    expect(service['canvas']).toBeNull();
    expect(service['program']).toBeNull();
  });
});
