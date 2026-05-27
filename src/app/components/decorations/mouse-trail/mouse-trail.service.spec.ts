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

  it('should snap all trail segments to the initial mouse position on the first move', () => {
    service['trail'] = Array.from({ length: 40 }, () => ({ x: 0, y: 0 }));
    service.setMousePosition(150, 250);
    expect(service['targetX']).toBe(150);
    expect(service['targetY']).toBe(250);
    expect(service['lastX']).toBe(150);
    expect(service['lastY']).toBe(250);
    for (let i = 0; i < 40; i++) {
      expect(service['trail'].at(i)).toEqual({ x: 150, y: 250 });
    }
  });

  it('should limit the maximum distance between consecutive trail points to prevent tearing', () => {
    service['trail'] = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 200, y: 0 }
    ];
    service['config'] = { ...service['config'], trailLength: 3 };
    service['updatePhysics']();
    const dx = service['trail'][1].x - service['trail'][0].x;
    const dy = service['trail'][1].y - service['trail'][0].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    expect(dist).toBeLessThanOrEqual(25.01);
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
