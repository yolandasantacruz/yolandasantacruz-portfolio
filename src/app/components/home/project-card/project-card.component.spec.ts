import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent, Project } from './project-card.component';
import { By } from '@angular/platform-browser';
import { ComponentRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { Location, IMAGE_LOADER } from '@angular/common';
import { optimizedImagesLoader } from '../../../utils/optimized-images-loader';
import { describe, it, expect, beforeEach } from 'vitest';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class DummyComponent {}

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let componentRef: ComponentRef<ProjectCardComponent>;
  let fixture: ComponentFixture<ProjectCardComponent>;
  let location: Location;
  let router: Router;

  const mockProject: Project = {
    title: 'Test Project',
    description: 'A test project description.',
    imageUrl: 'test-image.png',
    link: '/projects/test-project',
    category: 'Design',
    role: 'Lead Designer',
    timeline: '3 months',
    techStack: ['Angular', 'TypeScript', 'CSS'],
    reverse: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
      providers: [
        provideRouter([
          { path: 'projects/test-project', component: DummyComponent }
        ]),
        { provide: IMAGE_LOADER, useValue: optimizedImagesLoader }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    componentRef.setInput('project', mockProject);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render project details correctly', () => {
    componentRef.setInput('project', mockProject);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.project-title')).nativeElement.textContent.trim();
    const description = fixture.debugElement.query(By.css('.project-description')).nativeElement.textContent.trim();
    const image = fixture.debugElement.query(By.css('.project-image')).nativeElement;
    const link = fixture.debugElement.query(By.css('.view-project')).nativeElement;
    const imageLink = fixture.debugElement.query(By.css('.project-image-container')).nativeElement;

    expect(title).toBe('Test Project');
    expect(description).toBe('A test project description.');
    expect(image.getAttribute('src')).toBe('test-image.png');
    expect(image.getAttribute('alt')).toBe('Test Project');
    expect(link.getAttribute('href')).toBe('/projects/test-project');
    expect(imageLink.getAttribute('href')).toBe('/projects/test-project');
  });

  it('should apply reverse class when reverse input is true', () => {
    componentRef.setInput('project', { ...mockProject, reverse: true });
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('.project-card'));
    expect(card.nativeElement.classList.contains('reverse')).toBe(true);
  });

  it('should not apply reverse class when reverse input is false or omitted', () => {
    componentRef.setInput('project', mockProject);
    fixture.detectChanges();

    const card = fixture.debugElement.query(By.css('.project-card'));
    expect(card.nativeElement.classList.contains('reverse')).toBe(false);
  });

  it('should navigate to case study when clicking the project image', async () => {
    componentRef.setInput('project', mockProject);
    fixture.detectChanges();

    const imageLink = fixture.debugElement.query(By.css('.project-image-container')).nativeElement;
    imageLink.click();
    
    await fixture.whenStable();
    expect(location.path()).toBe('/projects/test-project');
  });

  it('should navigate to case study when clicking the View Project link', async () => {
    componentRef.setInput('project', mockProject);
    // Reset location
    router.navigateByUrl('/');
    await fixture.whenStable();

    fixture.detectChanges();

    const viewProjectLink = fixture.debugElement.query(By.css('.view-project')).nativeElement;
    viewProjectLink.click();
    
    await fixture.whenStable();
    expect(location.path()).toBe('/projects/test-project');
  });

  it('should set fetchpriority to high when priority input is true', () => {
    componentRef.setInput('project', mockProject);
    componentRef.setInput('priority', true);
    fixture.detectChanges();

    const image = fixture.debugElement.query(By.css('.project-image')).nativeElement;
    expect(image.getAttribute('fetchpriority')).toBe('high');
  });

  it('should not set fetchpriority to high when priority input is false', () => {
    componentRef.setInput('project', mockProject);
    componentRef.setInput('priority', false);
    fixture.detectChanges();

    const image = fixture.debugElement.query(By.css('.project-image')).nativeElement;
    expect(image.getAttribute('fetchpriority')).not.toBe('high');
  });
});
