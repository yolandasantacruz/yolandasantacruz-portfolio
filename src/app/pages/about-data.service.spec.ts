import { TestBed } from '@angular/core/testing';
import { AboutDataService } from './about-data.service';
import { provideContent } from '@analogjs/content';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AboutDataService', () => {
  let service: AboutDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AboutDataService, provideContent()]
    });
    service = TestBed.inject(AboutDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize and load markdown content', () => {
    expect(service.aboutMeData()).toBeDefined();
    expect(Array.isArray(service.aboutMeData())).toBe(true);
    expect(service.navSections()).toBeDefined();
  });
});
