import { Injectable, signal, inject, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export interface SideNavConfig {
  intersectionSelector: string;
  intersectionOptions?: IntersectionObserverInit;
  mutationTargetSelector?: string | null;
}

@Injectable()
export class SideNavTrackerService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  readonly activeSection = signal<string>('');

  private observer: IntersectionObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  initialize(config: SideNavConfig) {
    if (!isPlatformBrowser(this.platformId) || typeof globalThis.IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection.set(entry.target.id);
        }
      });
    }, config.intersectionOptions);

    const observeTargets = () => {
      const targets = this.document.querySelectorAll(config.intersectionSelector);
      targets.forEach(target => {
        this.observer?.observe(target);
      });
    };

    observeTargets();

    if (config.mutationTargetSelector && typeof globalThis.MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => {
        observeTargets();
      });

      const mainEl = this.document.querySelector(config.mutationTargetSelector);
      if (mainEl) {
        this.mutationObserver.observe(mainEl, { childList: true, subtree: true });
      }
    }

    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      this.mutationObserver?.disconnect();
    });
  }

  scrollToSection(id: string) {
    this.activeSection.set(id);
    if (isPlatformBrowser(this.platformId)) {
      const element = this.document.getElementById(id);
      if (element && typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
