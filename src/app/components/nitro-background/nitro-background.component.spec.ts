import { TestBed } from '@angular/core/testing';
import { NitroBackgroundComponent } from './nitro-background.component';

describe('NitroBackgroundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NitroBackgroundComponent],
    }).compileComponents();
  });

  it('should create the nitro background component', () => {
    const fixture = TestBed.createComponent(NitroBackgroundComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
