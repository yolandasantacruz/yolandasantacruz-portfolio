import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutPublicationsComponent } from './about-publications.component';
import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentRef } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AboutPublicationsComponent', () => {
  let component: AboutPublicationsComponent;
  let componentRef: ComponentRef<AboutPublicationsComponent>;
  let fixture: ComponentFixture<AboutPublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPublicationsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPublicationsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render publications list when data is provided', () => {
    componentRef.setInput('data', {
      heading: 'My Articles',
      items: [
        { title: 'Article 1', description: 'Desc 1', imageUrl: 'img1.png', url: 'http://link1.com' },
        { title: 'Article 2', description: 'Desc 2', imageUrl: 'img2.png', url: 'http://link2.com' }
      ],
      moreArticlesLabel: 'Read More',
      moreArticlesUrl: 'http://more.com'
    });
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.work-card'));
    expect(cards.length).toBe(2);
    
    const firstTitle = cards[0].query(By.css('.work-title')).nativeElement;
    expect(firstTitle.textContent).toBe('Article 1');

    const moreLink = fixture.debugElement.query(By.css('.explore-more-container a')).nativeElement;
    expect(moreLink.getAttribute('href')).toBe('http://more.com');
    expect(moreLink.textContent.trim()).toBe('Read More');
  });
});
