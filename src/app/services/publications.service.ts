import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { PublishedWork } from '../pages/about.types';

/** Internal shape of each item returned by the Analog API route */
interface ApiMediaItem {
  title: string;
  category: string;
  readTime?: string;
  imageUrl: string;
  url: string;
  description: string;
}

interface PublicationsApiResponse {
  success: boolean;
  items?: ApiMediaItem[];
}

/**
 * Fetches published works from the Medium RSS proxy API and maps the
 * response to the canonical `PublishedWork` shape used by the UI.
 *
 * Design-system analogy: this is the "data source" component — it owns
 * the network connection so the card grid component only needs to worry
 * about rendering, not fetching.
 */
@Injectable({ providedIn: 'root' })
export class PublicationsService {
  private http = inject(HttpClient);

  /**
   * Loads up to 3 published works from the API.
   * Emits an empty array on error so callers can fall back to their
   * markdown-defined initial data via `linkedSignal`.
   */
  load(): Observable<PublishedWork[]> {
    return this.http
      .get<PublicationsApiResponse>('/api/v1/publications')
      .pipe(
        map((res) => {
          if (!res.success || !res.items?.length) {
            return [];
          }
          return res.items.slice(0, 3).map(
            (item): PublishedWork => ({
              tag: item.category || 'ARTICLE',
              title: item.title,
              description: item.description,
              imageUrl: item.imageUrl,
              url: item.url,
            }),
          );
        }),
        catchError(() => of([])),
      );
  }
}
