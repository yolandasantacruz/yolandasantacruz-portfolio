import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Output, inject, input, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'portfolio-image-lightbox',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen() && imageSrc()) {
      <button 
        type="button" 
        class="lightbox-close-btn" 
        (click)="closeLightbox($event)"
        aria-label="Close image preview"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div 
        class="lightbox-backdrop" 
        [class.is-zoomed-backdrop]="isZoomed()"
        [class.is-dragging-active]="isDraggingState()"
        (scroll)="onScroll($event)"
        (click)="onBackdropClick($event)"
        (keyup.enter)="onBackdropClick($event)"
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="imageAlt() || 'Expanded image view'"
      >
        <div 
          class="lightbox-scroll-wrapper" 
          [class.is-zoomed-scroll]="isZoomed()"
        >
          <div class="lightbox-content">
            <img 
              [src]="imageSrc()" 
              [alt]="imageAlt()" 
              class="lightbox-image"
              [class.is-zoomed]="isZoomed()"
              [class.is-extra-zoomed]="extraZoom()"
              [class.is-dragging-active]="isDraggingState()"
              (click)="toggleZoom($event)"
              (keyup.enter)="toggleZoom($event)"
              (mousedown)="onMouseDown($event)"
              (mousemove)="onMouseMove($event)"
              (mouseup)="onMouseUp()"
              role="button"
              tabindex="0"
              title="Click to toggle zoom, or drag to move around"
            />
            
            @if (!isZoomed() && (caption() || imageAlt())) {
              <p class="lightbox-caption">{{ caption() || imageAlt() }}</p>
            }
          </div>
        </div>
      </div>

      @if (isZoomed() && (caption() || imageAlt())) {
        <p class="lightbox-caption-fixed">{{ caption() || imageAlt() }}</p>
      }

      @if (isZoomed()) {
        <div class="minimap-container">
          <div 
            class="minimap-preview" 
            (click)="onMinimapClick($event)"
            (keyup.enter)="onMinimapClick($event)"
            (mousedown)="onMinimapMouseDown($event)"
            (mousemove)="onMinimapMouseMove($event)"
            (mouseup)="onMinimapMouseUp()"
            role="button"
            tabindex="0"
            aria-label="Minimap preview navigation"
            title="Click or drag to navigate"
          >
            <img [src]="imageSrc()" [alt]="imageAlt()" class="minimap-thumb" />
            <div 
              class="minimap-viewport-rect"
              [style.left.%]="rectLeft()"
              [style.top.%]="rectTop()"
              [style.width.%]="rectWidth()"
              [style.height.%]="rectHeight()"
            ></div>
          </div>
          
          <div class="minimap-controls">
            <button type="button" class="minimap-btn" (click)="zoomOut($event)" title="Zoom out">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span class="minimap-zoom-label">{{ extraZoom() ? '175%' : '122%' }}</span>
            <button type="button" class="minimap-btn" (click)="toggleExtraZoom($event)" title="Increase zoom level">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      }
    }
  `,
  styles: `
    .lightbox-close-btn {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #ffffff;
      border: 1px solid var(--color-border-subtle);
      color: var(--color-text);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.16);
      transition: background-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
      z-index: 10005;
      padding: 0;
    }

    .lightbox-close-btn:hover {
      background: #f5f5f5;
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.22);
    }

    .lightbox-close-btn:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .lightbox-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2.5rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      animation: lightbox-fade-in 0.6s cubic-bezier(0.2, 1, 0.2, 1);
      cursor: zoom-out;
      overflow: hidden;
      transition: background-color 0.5s ease;
    }

    .lightbox-backdrop.is-zoomed-backdrop {
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding: 0;
      cursor: zoom-out;
    }

    .lightbox-backdrop.is-zoomed-backdrop:active,
    .lightbox-backdrop.is-zoomed-backdrop.is-dragging-active {
      cursor: grabbing;
    }

    .lightbox-scroll-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: padding 0.7s cubic-bezier(0.2, 1, 0.2, 1);
    }

    .lightbox-scroll-wrapper.is-zoomed-scroll {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: max-content;
      min-height: 100vh;
      width: fit-content;
      margin: auto;
      padding: 4rem 3rem;
    }

    .lightbox-content {
      position: relative;
      max-width: 92vw;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: default;
      animation: lightbox-scale-up 0.6s cubic-bezier(0.2, 1, 0.2, 1);
    }

    .lightbox-scroll-wrapper.is-zoomed-scroll .lightbox-content {
      max-width: none;
      max-height: none;
      animation: none;
    }

    .lightbox-image {
      max-width: 90vw;
      max-height: 76vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.16);
      user-select: none;
      -webkit-user-drag: none;
      cursor: zoom-in;
      will-change: transform, box-shadow;
      transition: transform 0.7s cubic-bezier(0.2, 1, 0.2, 1), box-shadow 0.7s ease;
      transform-origin: center center;
    }

    .lightbox-image.is-zoomed {
      cursor: zoom-out;
      transform: scale(1.22);
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.22);
    }

    .lightbox-image.is-zoomed:active,
    .lightbox-image.is-zoomed.is-dragging-active {
      cursor: grabbing;
    }

    .lightbox-image.is-zoomed.is-extra-zoomed {
      transform: scale(1.75);
    }

    .lightbox-caption {
      margin-top: 1.25rem;
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      text-align: center;
      max-width: 700px;
      line-height: 1.5;
      font-weight: 500;
      margin-bottom: 0;
      text-shadow: 0 0 8px #ffffff, 0 1px 3px rgba(255, 255, 255, 0.9);
      transition: opacity 0.4s ease;
      display: inline-block;
    }

    .lightbox-caption-fixed {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      background: #ffffff;
      border: 1px solid var(--color-border-subtle);
      border-radius: 9999px;
      padding: 0.5rem 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      color: var(--color-text);
      font-size: var(--text-sm);
      font-weight: 600;
      z-index: 10004;
      pointer-events: none;
      max-width: calc(100vw - 180px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      animation: caption-fade-in 0.4s cubic-bezier(0.2, 1, 0.2, 1);
    }

    /* Google Photos Style White Minimap & Viewport Controller */
    .minimap-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 10005;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid var(--color-border-subtle);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      padding: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      animation: minimap-pop 0.4s cubic-bezier(0.2, 1, 0.2, 1);
      user-select: none;
    }

    .minimap-preview {
      position: relative;
      width: 135px;
      max-height: 120px;
      border-radius: 8px;
      overflow: hidden;
      background: #f4f4f4;
      border: 1px solid rgba(0, 0, 0, 0.06);
      cursor: crosshair;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .minimap-thumb {
      width: 100%;
      height: auto;
      max-height: 120px;
      object-fit: contain;
      opacity: 0.92;
      pointer-events: none;
      -webkit-user-drag: none;
    }

    .minimap-viewport-rect {
      position: absolute;
      border: 2px solid var(--color-primary);
      background: rgba(59, 159, 152, 0.2);
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
      border-radius: 4px;
      pointer-events: none;
      transition: left 0.1s ease-out, top 0.1s ease-out, width 0.15s ease-out, height 0.15s ease-out;
    }

    .minimap-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 2px 4px;
      color: var(--color-text);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .minimap-zoom-label {
      font-size: 0.7rem;
      color: var(--color-text-muted);
    }

    .minimap-btn {
      background: rgba(0, 0, 0, 0.06);
      border: none;
      color: var(--color-text);
      border-radius: 4px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .minimap-btn:hover {
      background: rgba(0, 0, 0, 0.12);
    }

    @keyframes caption-fade-in {
      from {
        opacity: 0;
        transform: translate(-50%, 8px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    @keyframes minimap-pop {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes lightbox-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes lightbox-scale-up {
      from {
        opacity: 0;
        transform: scale(0.92);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .lightbox-backdrop {
        padding: 1.5rem 1rem;
      }
      .lightbox-close-btn {
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
      }
      .lightbox-image {
        max-width: 96vw;
        max-height: 74vh;
      }
      .lightbox-image.is-zoomed {
        transform: scale(1.35);
      }
      .lightbox-caption-fixed {
        bottom: 1rem;
        max-width: calc(100vw - 120px);
      }
      .minimap-container {
        bottom: 1rem;
        right: 1rem;
      }
      .minimap-preview {
        width: 100px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .lightbox-backdrop,
      .lightbox-content,
      .lightbox-image,
      .minimap-container,
      .lightbox-caption-fixed {
        animation: none !important;
        transition: none !important;
      }
    }
  `
})
export class ImageLightboxComponent {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  readonly imageSrc = input<string | null>(null);
  readonly imageAlt = input<string>('');
  readonly caption = input<string | null>(null);
  readonly isOpen = input<boolean>(false);

  readonly isZoomed = signal<boolean>(false);
  readonly extraZoom = signal<boolean>(false);
  readonly isDraggingState = signal<boolean>(false);

  readonly rectLeft = signal<number>(0);
  readonly rectTop = signal<number>(0);
  readonly rectWidth = signal<number>(100);
  readonly rectHeight = signal<number>(100);

  @Output() closed = new EventEmitter<void>();

  private isDragging = false;
  private hasDragged = false;
  private startX = 0;
  private startY = 0;
  private scrollLeft = 0;
  private scrollTop = 0;

  private isMinimapDragging = false;

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this.isOpen() && isPlatformBrowser(this.platformId)) {
      event.preventDefault();
      this.resetZoom();
      this.closed.emit();
    }
  }

  toggleZoom(event: Event): void {
    event.stopPropagation();
    if (this.hasDragged) {
      this.hasDragged = false;
      return;
    }
    const nextState = !this.isZoomed();
    this.isZoomed.set(nextState);
    if (!nextState) {
      this.extraZoom.set(false);
    } else {
      setTimeout(() => this.updateMinimapFromBackdrop(), 50);
    }
  }

  toggleExtraZoom(event: Event): void {
    event.stopPropagation();
    this.extraZoom.update(ez => !ez);
    setTimeout(() => this.updateMinimapFromBackdrop(), 50);
  }

  zoomOut(event: Event): void {
    event.stopPropagation();
    this.resetZoom();
  }

  private resetZoom(): void {
    this.isZoomed.set(false);
    this.extraZoom.set(false);
    this.isDraggingState.set(false);
  }

  onScroll(event: Event): void {
    if (!this.isZoomed()) return;
    const backdrop = event.target as HTMLElement;
    if (backdrop) {
      this.updateMinimapRect(backdrop);
    }
  }

  private updateMinimapFromBackdrop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const backdrop = this.document.querySelector('.lightbox-backdrop.is-zoomed-backdrop') as HTMLElement;
    if (backdrop) {
      this.updateMinimapRect(backdrop);
    }
  }

  private updateMinimapRect(backdrop: HTMLElement): void {
    const scrollLeft = backdrop.scrollLeft;
    const scrollTop = backdrop.scrollTop;
    const scrollWidth = backdrop.scrollWidth;
    const scrollHeight = backdrop.scrollHeight;
    const clientWidth = backdrop.clientWidth;
    const clientHeight = backdrop.clientHeight;

    if (!scrollWidth || !scrollHeight) return;

    const wPct = Math.min(100, Math.max(10, (clientWidth / scrollWidth) * 100));
    const hPct = Math.min(100, Math.max(10, (clientHeight / scrollHeight) * 100));

    const maxScrollX = scrollWidth - clientWidth;
    const maxScrollY = scrollHeight - clientHeight;

    const lPct = maxScrollX > 0 ? (scrollLeft / maxScrollX) * (100 - wPct) : 0;
    const tPct = maxScrollY > 0 ? (scrollTop / maxScrollY) * (100 - hPct) : 0;

    this.rectWidth.set(wPct);
    this.rectHeight.set(hPct);
    this.rectLeft.set(lPct);
    this.rectTop.set(tPct);
  }

  /* Main Viewport & Image Mouse Drag Panning */
  onMouseDown(event: MouseEvent): void {
    if (!this.isZoomed() || !isPlatformBrowser(this.platformId)) return;

    const backdrop = this.document.querySelector('.lightbox-backdrop.is-zoomed-backdrop') as HTMLElement;
    if (!backdrop) return;

    this.isDragging = true;
    this.hasDragged = false;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.scrollLeft = backdrop.scrollLeft;
    this.scrollTop = backdrop.scrollTop;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.isZoomed() || !isPlatformBrowser(this.platformId)) return;
    const backdrop = this.document.querySelector('.lightbox-backdrop.is-zoomed-backdrop') as HTMLElement;
    if (!backdrop) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      this.hasDragged = true;
      this.isDraggingState.set(true);
    }

    backdrop.scrollLeft = this.scrollLeft - dx;
    backdrop.scrollTop = this.scrollTop - dy;
    this.updateMinimapRect(backdrop);
  }

  onMouseUp(): void {
    this.isDragging = false;
    this.isDraggingState.set(false);
  }

  /* Google Photos Minimap Click & Drag Navigation */
  onMinimapClick(event: MouseEvent): void {
    event.stopPropagation();
    this.navigateFromMinimap(event);
  }

  onMinimapMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.isMinimapDragging = true;
    this.navigateFromMinimap(event);
  }

  onMinimapMouseMove(event: MouseEvent): void {
    if (this.isMinimapDragging) {
      event.stopPropagation();
      this.navigateFromMinimap(event);
    }
  }

  onMinimapMouseUp(): void {
    this.isMinimapDragging = false;
  }

  private navigateFromMinimap(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const backdrop = this.document.querySelector('.lightbox-backdrop.is-zoomed-backdrop') as HTMLElement;
    if (!backdrop) return;

    const minimap = event.currentTarget as HTMLElement;
    if (!minimap) return;

    const rect = minimap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const ratioX = Math.max(0, Math.min(1, clickX / rect.width));
    const ratioY = Math.max(0, Math.min(1, clickY / rect.height));

    const maxScrollX = backdrop.scrollWidth - backdrop.clientWidth;
    const maxScrollY = backdrop.scrollHeight - backdrop.clientHeight;

    backdrop.scrollLeft = ratioX * maxScrollX;
    backdrop.scrollTop = ratioY * maxScrollY;

    this.updateMinimapRect(backdrop);
  }

  onBackdropClick(event: Event): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (this.hasDragged) {
      this.hasDragged = false;
      return;
    }
    this.resetZoom();
    this.closed.emit();
  }

  closeLightbox(event: Event): void {
    event.stopPropagation();
    this.resetZoom();
    this.closed.emit();
  }
}
