import { ErrorHandler, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Injectable()
export class CacheErrorHandler implements ErrorHandler {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  handleError(error: unknown): void {
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    // Check if we are running in the browser and if it's a chunk load/dynamic import failure
    if (
      isPlatformBrowser(this.platformId) &&
      (
        errorMsg.includes('Loading chunk') ||
        errorMsg.includes('ChunkLoadError') ||
        errorMsg.includes('Failed to fetch dynamically imported module') ||
        errorMsg.includes('import()')
      )
    ) {
      const win = this.document.defaultView;
      if (win) {
        console.warn('Chunk load error detected, triggering reload to update application...', error);
        
        try {
          const reloadKey = 'portfolio_chunk_load_reload_attempted';
          if (!win.sessionStorage.getItem(reloadKey)) {
            win.sessionStorage.setItem(reloadKey, 'true');
            win.location.reload();
            return;
          }
        } catch {
          // Fallback if sessionStorage is disabled or throws
          win.location.reload();
          return;
        }
      }
    }
    
    // Log other errors to the console (or server logs during SSR)
    console.error(error);
  }
}
