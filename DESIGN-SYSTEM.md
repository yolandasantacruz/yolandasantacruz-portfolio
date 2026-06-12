# Design System Specification

> [!IMPORTANT]
> This document extends [Core Design Specification (DESIGN-SYSTEM.core.md)](DESIGN-SYSTEM.core.md).
> All contributors and AI agents must adhere to the core design rules plus the project-specific rules defined below.

## 1. Scroll Snapping
- **Hero**: `y mandatory`, `scroll-snap-stop: always`.
- **Content**: `y proximity`, `scroll-snap-align: start`, `scroll-margin-top: 4-6rem`.
- **Transitions**: `cubic-bezier(0.16, 1, 0.3, 1)`.

## 2. Typography
- **Body**: 'Nunito' (400, 700), LH: 1.8.
- **Header**: 'Libre Baskerville' (400, 400i), LH: 1.15, Tracking: -0.02em.

## 3. Colors (Strict `variables.css` usage)
- **Base**: `var(--color-bg)`, `var(--color-text)`, `var(--color-text-muted)`.
- **Accents**: Primary `var(--color-accent)` (Teal), Contrast `var(--color-primary)` (Dark Teal).
- NEVER hardcode hex or rem values in components.

## 4. Core Components
- **Mouse Trail**: `MouseTrailComponent` (`z-index: 5`). Sibling containers `z-index >= 10`. Keep out of Angular change detection.
- **Nav Dots**: 24px dots. Safepadding: `16px` right. Active: solid dot (`border-width: 0`). Hover: 70% opacity border.
- **`.btn-blob`**: Global CTA button. Uses `var(--color-primary)` text and a morphing background animation. Use the class, do not rebuild.
- **`.btn-link`**: Minimalist text link. Uses `var(--color-primary)` text and features an inline `→` via `::after` that slides horizontally on hover. Use the class, do not rebuild.
- **Testimonial Blob**: Ambient sine/cosine wave. Dynamic tangents (Catmull-Rom `k=0.22`). 800ms morphing with pastel color shifts.

## 5. Homepage Pastel System
- **Anchor**: `.bridge-section` (`hsl(169, 58%, 96%)`).
- **Rule**: Saturation (`58%`) and Lightness (`96%`) are IMMUTABLE.
- **Usage**: Backgrounds dynamically built via `hsl(var(--section-hue-*), var(--section-pastel-s), var(--section-pastel-l))`.
- **Gradients**: `linear-gradient(to bottom, var(--own-color), var(--next-color))` blends sections.
- **Extension**: Extract foreground Hue (H), add `--section-hue-<name>`. Keep ≤45° delta between adjacent sections.
