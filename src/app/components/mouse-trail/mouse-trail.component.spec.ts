import { TestBed } from '@angular/core/testing';
import { MouseTrailComponent } from './mouse-trail.component';

describe('MouseTrailComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouseTrailComponent],
    }).compileComponents();
  });

  it('should create the mouse trail component', () => {
    const fixture = TestBed.createComponent(MouseTrailComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
