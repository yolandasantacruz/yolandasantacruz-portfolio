import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideContent, withMarkdownRenderer } from '@analogjs/content';
import { withPrismHighlighter } from '@analogjs/content/prism-highlighter';
import { APP_BASE_HREF, IMAGE_LOADER, DOCUMENT } from '@angular/common';
import { optimizedImagesLoader } from './utils/optimized-images-loader';
import { CacheErrorHandler } from './utils/cache-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_BASE_HREF, useValue: import.meta.env.BASE_URL },
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideFileRouter(
      withViewTransitions({
        onViewTransitionCreated: ({ transition }) => {
          const doc = inject(DOCUMENT);
          if (doc && doc.visibilityState === 'hidden') {
            transition.skipTransition();
          }
          // Log expected aborted transitions as warnings instead of letting them bubble up as uncaught errors
          transition.ready.catch((err) => {
            console.warn('View transition ready aborted:', err);
          });
          transition.finished.catch((err) => {
            console.warn('View transition finished aborted:', err);
          });
        }
      }),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
    {
      provide: IMAGE_LOADER,
      useValue: optimizedImagesLoader
    },
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideContent(withMarkdownRenderer(), withPrismHighlighter()),
    { provide: ErrorHandler, useClass: CacheErrorHandler },
  ],
};
