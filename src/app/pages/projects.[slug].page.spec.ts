import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { By } from '@angular/platform-browser';
import ProjectDetails from './projects.[slug].page';
import { Title, Meta } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ProjectDetails Page', () => {
  let component: ProjectDetails;
  let fixture: ComponentFixture<ProjectDetails>;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetails],
      providers: [
        provideRouter([
          { path: 'projects/:slug', component: ProjectDetails }
        ]),
        provideContent(withMarkdownRenderer()),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    
    vi.spyOn(titleService, 'setTitle');
    vi.spyOn(metaService, 'updateTag');
  });

  it('should create the component', async () => {
    fixture = TestBed.createComponent(ProjectDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update metadata and render details when project loads', async () => {
    fixture = TestBed.createComponent(ProjectDetails);
    component = fixture.componentInstance;
    
    component.project.set({
      attributes: {
        title: 'Pay With App',
        description: 'A test description',
        slug: 'pay-with-app',
        order: 1,
        imageUrl: '',
        category: '',
        role: 'Designer',
        timeline: '2023',
        techStack: ['Figma']
      },
      content: 'Some test content',
      filename: 'pay-with-app.md',
      slug: 'pay-with-app'
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const project = component.project();
    expect(project).toBeTruthy();
    expect(project?.attributes?.title).toBeTruthy();

    expect(titleService.setTitle).toHaveBeenCalledWith(`${project?.attributes?.title} | Yolanda Santa Cruz`);
    expect(metaService.updateTag).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'description' })
    );

    const titleEl = fixture.debugElement.query(By.css('.project-title'));
    expect(titleEl.nativeElement.textContent).toBe(project?.attributes?.title);
  });
});
