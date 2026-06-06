import { TestBed } from '@angular/core/testing';
import { HomeDataService } from './home-data.service';
import { provideContent } from '@analogjs/content';
import { describe, it, expect, beforeEach } from 'vitest';

describe('HomeDataService', () => {
  let service: HomeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeDataService, provideContent()]
    });
    service = TestBed.inject(HomeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize and load markdown content', () => {
    expect(service.projects()).toBeDefined();
    expect(Array.isArray(service.projects())).toBe(true);
    expect(service.navSections()).toBeDefined();
  });
});
