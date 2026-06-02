import { ImageLoaderConfig } from '@angular/common';
import { OPTIMIZED_IMAGES } from './optimized-images';

export function optimizedImagesLoader(config: ImageLoaderConfig): string {
  const src = config.src;
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  if (src.endsWith('.webp') && config.width) {
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    const availableWidths = OPTIMIZED_IMAGES[cleanSrc];
    
    if (availableWidths && availableWidths.length > 0) {
      const lastDot = src.lastIndexOf('.');
      const base = src.substring(0, lastDot);
      const ext = src.substring(lastDot);
      
      // Map to the closest larger available width, or fallback to the largest available
      let targetWidth = availableWidths[availableWidths.length - 1];
      for (const w of availableWidths) {
        if (w >= config.width) {
          targetWidth = w;
          break;
        }
      }
      return `${base}-${targetWidth}w${ext}`;
    }
  }
  return src;
}
