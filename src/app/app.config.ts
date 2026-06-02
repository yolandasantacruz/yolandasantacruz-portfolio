import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { withViewTransitions } from '@angular/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { withPrismHighlighter } from '@analogjs/content/prism-highlighter';
import { APP_BASE_HREF, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_BASE_HREF, useValue: import.meta.env.BASE_URL },
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideFileRouter(
      withViewTransitions()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        const src = config.src;
        if (src.startsWith('http://') || src.startsWith('https://')) {
          return src;
        }
        if (src.endsWith('.webp') && config.width) {
          const lastDot = src.lastIndexOf('.');
          const base = src.substring(0, lastDot);
          const ext = src.substring(lastDot);
          if (config.width === 1200) {
            if (src.includes('portrait-1.webp') || src.includes('industry-standards') || src.includes('plant-me/screen-')) {
              return src;
            }
          }
          return `${base}-${config.width}w${ext}`;
        }
        return src;
      }
    },
    provideClientHydration(withEventReplay()),
    provideContent(withMarkdownRenderer(), withPrismHighlighter()),
  ],
};
