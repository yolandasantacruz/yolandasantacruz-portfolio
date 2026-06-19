import { Injectable, inject, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly renderer = this.rendererFactory.createRenderer(null, null);
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);

  private jsonLdScript?: HTMLScriptElement;
  private canonicalLink?: HTMLLinkElement;

  constructor() {
    // Automatically clear structured data on navigation start,
    // and dynamically update canonical/og:url on navigation end.
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.removeJsonLd();
      } else if (event instanceof NavigationEnd) {
        this.updateCanonicalAndOgUrl();
      }
    });
  }

  setJsonLd(data: Record<string, unknown>) {
    this.removeJsonLd();

    this.jsonLdScript = this.renderer.createElement('script');
    this.renderer.setAttribute(this.jsonLdScript, 'type', 'application/ld+json');
    
    // Escape '<' to prevent script termination injection (e.g., if content includes '</script>')
    const safeJson = JSON.stringify(data).replace(/</g, '\\u003c');
    this.renderer.setProperty(this.jsonLdScript, 'textContent', safeJson);
    this.renderer.appendChild(this.document.head, this.jsonLdScript);
  }

  removeJsonLd() {
    if (this.jsonLdScript) {
      this.renderer.removeChild(this.document.head, this.jsonLdScript);
      this.jsonLdScript = undefined;
    }
  }

  private updateCanonicalAndOgUrl() {
    // Build canonical URL
    const rawPath = this.router.url.split('?')[0].split('#')[0];
    const path = rawPath === '/' ? '' : rawPath;
    const canonicalUrl = `https://yolandasantacruz.com${path}`;

    // 1. Update Canonical Link tag
    if (!this.canonicalLink) {
      // Try to find existing link[rel=canonical] first
      this.canonicalLink = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    }

    if (!this.canonicalLink) {
      this.canonicalLink = this.renderer.createElement('link');
      this.renderer.setAttribute(this.canonicalLink!, 'rel', 'canonical');
      this.renderer.appendChild(this.document.head, this.canonicalLink!);
    }

    this.renderer.setAttribute(this.canonicalLink!, 'href', canonicalUrl);

    // 2. Update og:url meta tag
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
  }
}
