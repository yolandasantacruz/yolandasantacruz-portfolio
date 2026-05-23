import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LeadershipComponent } from './leadership.component';

describe('LeadershipComponent', () => {
  let component: LeadershipComponent;
  let fixture: ComponentFixture<LeadershipComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadershipComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadershipComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and set fallback items initially', () => {
    // Before HTTP request returns, it should set fallback items
    fixture.detectChanges(); // Trigger ngOnInit

    const request = httpMock.expectOne('/api/v1/publications');
    expect(request.request.method).toBe('GET');

    // Default items should be populated
    expect(component.mediaItems().length).toBe(3);
    expect(component.mediaItems()[0].title).toBe('Mastering Complex SaaS Workflows & Payment Systems');
    
    request.flush({ success: true, items: [] }); // Clean up the pending request
  });

  it('should update mediaItems when API successfully returns articles', () => {
    fixture.detectChanges(); // Trigger ngOnInit

    const mockArticles = [
      {
        title: 'Real Article 1',
        category: 'Article',
        readTime: '5 min read',
        imageUrl: 'http://img1.png',
        url: 'http://link1',
        description: 'First dynamic article'
      },
      {
        title: 'Real Article 2',
        category: 'Guide',
        readTime: '10 min read',
        imageUrl: 'http://img2.png',
        url: 'http://link2',
        description: 'Second dynamic article'
      }
    ];

    const request = httpMock.expectOne('/api/v1/publications');
    request.flush({ success: true, items: mockArticles });

    expect(component.mediaItems().length).toBe(2);
    expect(component.mediaItems()[0].title).toBe('Real Article 1');
    expect(component.mediaItems()[1].title).toBe('Real Article 2');
  });

  it('should keep fallback items when API returns success=false', () => {
    fixture.detectChanges(); // Trigger ngOnInit

    const request = httpMock.expectOne('/api/v1/publications');
    request.flush({ success: false, error: 'Internal Server Error' });

    expect(component.mediaItems().length).toBe(3);
    expect(component.mediaItems()[0].title).toBe('Mastering Complex SaaS Workflows & Payment Systems');
  });

  it('should keep fallback items when HTTP request fails', () => {
    fixture.detectChanges(); // Trigger ngOnInit

    const request = httpMock.expectOne('/api/v1/publications');
    request.error(new ProgressEvent('error'));

    expect(component.mediaItems().length).toBe(3);
    expect(component.mediaItems()[0].title).toBe('Mastering Complex SaaS Workflows & Payment Systems');
  });
});
