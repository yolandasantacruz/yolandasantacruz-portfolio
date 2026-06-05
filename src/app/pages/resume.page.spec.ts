import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { By } from '@angular/platform-browser';
import { provideContent } from '@analogjs/content';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import ResumeComponent from './resume.page';

describe('ResumeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideContent(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it('should render the resume page title', () => {
    const fixture = TestBed.createComponent(ResumeComponent);
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.page-title'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent.trim()).toBe('Resume');
  });

  it('should render work experience section', () => {
    const fixture = TestBed.createComponent(ResumeComponent);
    fixture.detectChanges();

    const workExperience = fixture.debugElement.query(By.css('.work-experience'));
    expect(workExperience).toBeTruthy();

    const jobEntries = fixture.debugElement.queryAll(By.css('.job-entry'));
    expect(jobEntries.length).toBe(6); // 6 companies: Discover, Upside, Fetch, Zelenia, Home61, PSC
  });

  it('should render sidebar sections', () => {
    const fixture = TestBed.createComponent(ResumeComponent);
    fixture.detectChanges();

    const sidebarSections = fixture.debugElement.queryAll(By.css('.sidebar-section'));
    expect(sidebarSections.length).toBe(5); // Software, Skills, Languages, Additional, Education

    const educationSection = sidebarSections.find(sec =>
      sec.nativeElement.innerHTML.includes('Education')
    );
    expect(educationSection).toBeTruthy();
  });

  it('should render the download resume button', () => {
    const fixture = TestBed.createComponent(ResumeComponent);
    fixture.detectChanges();

    const downloadBtn = fixture.debugElement.query(By.css('.btn-link'));
    expect(downloadBtn).toBeTruthy();
    expect(downloadBtn.nativeElement.textContent.trim()).toBe('Download PDF');
  });
});
