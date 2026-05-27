import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent, Project } from './project-card.component';
import { By } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let componentRef: ComponentRef<ProjectCardComponent>;
  let fixture: ComponentFixture<ProjectCardComponent>;

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
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
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

    expect(title).toBe('Test Project');
    expect(description).toBe('A test project description.');
    expect(image.getAttribute('src')).toBe('test-image.png');
    expect(image.getAttribute('alt')).toBe('Test Project');
    expect(link.getAttribute('href')).toBe('/projects/test-project');
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
});
