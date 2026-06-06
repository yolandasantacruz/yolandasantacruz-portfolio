import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { SideNavTrackerService } from './side-nav-tracker.service';

describe('SideNavTrackerService', () => {
  let service: SideNavTrackerService;
  let documentMock: Document;
  let intersectionCallback: IntersectionObserverCallback;
  let mutationCallback: MutationCallback;
  let observedElements: Element[] = [];

  beforeEach(() => {

    const mockIo = class {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      observe(el: Element) {
        if (!observedElements.includes(el)) {
          observedElements.push(el);
        }
      }
      unobserve() {
        // no-op
      }
      disconnect() {
        observedElements = [];
      }
    };
    vi.stubGlobal('IntersectionObserver', mockIo);

    const mockMo = class {
      constructor(callback: MutationCallback) {
        mutationCallback = callback;
      }
      observe() {
        // no-op
      }
      disconnect() {
        // no-op
      }
    };
    vi.stubGlobal('MutationObserver', mockMo);

    TestBed.configureTestingModule({
      providers: [SideNavTrackerService]
    });
    
    documentMock = TestBed.inject(DOCUMENT);
    service = TestBed.inject(SideNavTrackerService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    observedElements = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize active section and update on intersection', () => {
    // Setup some mock elements
    documentMock.body.innerHTML = `
      <div id="section1" class="track-me"></div>
      <div id="section2" class="track-me"></div>
    `;

    service.initialize({
      intersectionSelector: '.track-me'
    });

    expect(service.activeSection()).toBe('');
    expect(observedElements.length).toBe(2);

    const mockEntry = {
      isIntersecting: true,
      target: { id: 'section2' } as unknown as Element
    } as IntersectionObserverEntry;

    if (intersectionCallback) {
      intersectionCallback([mockEntry], {} as unknown as IntersectionObserver);
    }

    expect(service.activeSection()).toBe('section2');
  });

  it('should re-observe targets on mutation', () => {
    documentMock.body.innerHTML = `
      <div id="main">
        <div id="s1" class="track-me"></div>
      </div>
    `;

    service.initialize({
      intersectionSelector: '.track-me',
      mutationTargetSelector: '#main'
    });

    expect(observedElements.length).toBe(1);

    // Reset observed elements to check if they are re-observed on mutation
    observedElements = [];

    // Add a new element to trigger mutation (in real life the mutation observer handles this, here we manually call the callback)
    const mainEl = documentMock.getElementById('main');
    if (mainEl) {
      mainEl.innerHTML += '<div id="s2" class="track-me"></div>';
    }

    if (mutationCallback) {
      mutationCallback([], {} as unknown as MutationObserver);
    }

    // Now there are 2 elements matching '.track-me'
    expect(observedElements.length).toBe(2);
  });
});
