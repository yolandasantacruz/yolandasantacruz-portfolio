import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PublicationsService } from './publications.service';
import { PublishedWork } from '../pages/about.types';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const MOCK_API_ITEMS = [
  {
    title: 'Designing for Accessibility',
    category: 'UX Design',
    readTime: '5 min read',
    imageUrl: 'https://example.com/img1.jpg',
    url: 'https://medium.com/@yolanda/article-1',
    description: 'A deep dive into accessible design patterns.',
  },
  {
    title: 'Fintech UX Patterns',
    category: 'Product Design',
    readTime: '7 min read',
    imageUrl: 'https://example.com/img2.jpg',
    url: 'https://medium.com/@yolanda/article-2',
    description: 'How fintech products can improve their UX.',
  },
  {
    title: 'Design Systems at Scale',
    category: 'Design Systems',
    readTime: '10 min read',
    imageUrl: 'https://example.com/img3.jpg',
    url: 'https://medium.com/@yolanda/article-3',
    description: 'Managing a design system across multiple teams.',
  },
  // A 4th item to verify the slice(0, 3) cap
  {
    title: 'Extra Article',
    category: 'Bonus',
    readTime: '3 min read',
    imageUrl: 'https://example.com/img4.jpg',
    url: 'https://medium.com/@yolanda/article-4',
    description: 'Should not appear.',
  },
];

describe('PublicationsService', () => {
  let service: PublicationsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PublicationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('maps a successful API response to PublishedWork[] and caps at 3 items', () => {
    let result: PublishedWork[] | undefined;

    service.load().subscribe((items) => (result = items));

    const req = httpMock.expectOne('/api/v1/publications');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, items: MOCK_API_ITEMS });

    expect(result).toHaveLength(3);
    const first = result?.at(0);
    expect(first?.title).toBe('Designing for Accessibility');
    expect(first?.tag).toBe('UX Design');
    expect(first?.url).toBe('https://medium.com/@yolanda/article-1');
  });

  it('uses "ARTICLE" as fallback tag when category is empty', () => {
    let result: PublishedWork[] | undefined;

    service.load().subscribe((items) => (result = items));

    const req = httpMock.expectOne('/api/v1/publications');
    req.flush({
      success: true,
      items: [{ ...MOCK_API_ITEMS[0], category: '' }],
    });

    expect(result?.at(0)?.tag).toBe('ARTICLE');
  });

  it('emits an empty array when success is false', () => {
    let result: PublishedWork[] | undefined;

    service.load().subscribe((items) => (result = items));

    const req = httpMock.expectOne('/api/v1/publications');
    req.flush({ success: false });

    expect(result).toEqual([]);
  });

  it('emits an empty array when items array is empty', () => {
    let result: PublishedWork[] | undefined;

    service.load().subscribe((items) => (result = items));

    const req = httpMock.expectOne('/api/v1/publications');
    req.flush({ success: true, items: [] });

    expect(result).toEqual([]);
  });

  it('emits an empty array on network error', () => {
    let result: PublishedWork[] | undefined;

    service.load().subscribe((items) => (result = items));

    const req = httpMock.expectOne('/api/v1/publications');
    req.error(new ProgressEvent('NetworkError'));

    expect(result).toEqual([]);
  });
});
