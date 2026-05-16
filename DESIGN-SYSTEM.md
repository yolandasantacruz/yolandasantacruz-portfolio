# Design System Specification

> [!IMPORTANT]
> This document is the **single source of truth** for all visual styling, component patterns, and design decisions across the portfolio UI. It must be consulted before any UI change, new feature, or visual cleanup. **Strict adherence is mandatory.** Future refactoring and UI improvements must validate against these guidelines to prevent regression.

## 1. Visual Direction and Core Philosophy
The objective is to establish a scalable, highly performant architecture for a Product Design portfolio. The visual direction must prioritize content delivery, typography, and case study readability over superficial graphical effects.

## 2. Animation Engine Guardrails
Animations are restricted to the following parameters to ensure high performance and professional objectivity: 

* Use strictly CSS-first, hardware-accelerated properties: "transform" and "opacity".
* Avoid layout-triggering animations (e.g., animating "width", "height", "margin").
* Implement standard easing curves (e.g., "cubic-bezier(0.4, 0.0, 0.2, 1)").
* Maximum transition duration: 300ms.
* Respect the "prefers-reduced-motion" media query.

## 3. Scroll Snapping Guardrails
To ensure a premium and fluid navigation experience, we utilize a tiered snapping approach:

* **Landing/Hero Experience**: Use `y mandatory` with `scroll-snap-stop: always`. This creates a focused, full-screen story-telling experience. Combine with long background transitions (e.g., `0.8s`) to ensure the visual shift feels "smooth" and intentional.
* **Content/Reading Experience**: Use `y proximity`. This ensures the scroll only "locks" when the user stops near a section boundary, preventing interference with natural reading rhythms.
* **Alignment**: Use `scroll-snap-align: start`.
* **Breathing Room**: Implement `scroll-margin-top` (typically `4rem` to `6rem`) on snap targets.
* **Easing**: Visual transitions accompanying snaps should use standard premium easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

## 4. Typography
* **Main Body Font**: 'Nunito', sans-serif (Weights: 400, 600, 700, 800).
* **Header Font**: 'Futura PT', 'Futura', 'Jost', system-ui, sans-serif.
* **Base Size**: 16px.
* **Line Height**: 1.6 for body copy, 1.2 for headings.
* **Heading Weight**: 800 (Extra Bold).

## 4. Color Palette
The design system uses a curated, light-first palette focused on clarity and premium feel.

* **Background**: `--color-bg: #ffffff`
* **Text (Primary)**: `--color-text: #1a1a1a`
* **Text (Muted)**: `--color-text-muted: #666666`
* **Accents (Teal/Mint/Yellow)**:
    * Primary Accent: `#5ed6cc` (Teal)
    * Secondary Accent: `#8edeae` (Mint)
    * Highlight: `#f5ea8c` (Light Yellow)
    * Contrast Accent: `#3b9f98` (Dark Teal)

## 5. Mouse Trail Background
The `MouseTrailComponent` provides a high-performance WebGL2 shader background.
* **Purpose**: Adds dynamic, premium interactivity without distracting from content.
* **Implementation**: Isolated in `MouseTrailComponent`, uses `portfolio-mouse-trail` selector.
* **Performance**: Must remain outside Angular's change detection zone.
* **Styling**: Operates at `z-index: 5`. Overlapping containers must have `z-index >= 10`.

## 6. Navigation System & Side Rail (Nav Dots)
The floating side rail navigation uses interactive pill/dot components to indicate scroll progress and provide quick jumping between snap sections.
* **Hover State Border**: When pills expand on hover, the border opacity is set to 70% (`color-mix(in srgb, var(--pill-color) 70%, transparent)`).
* **Drop Shadow**: Maintained as a premium white glow across all states (`rgba(255, 255, 255, 0.5)` to `0.8`) to contrast elegantly against the WebGL shader canvas and colorful project backgrounds.
* **Active State**: The active section indicator removes its border (`border-width: 0`), transforming into a solid accent dot for strong visual distinction.

## 7. Testimonial Background Blob (Motion & Color Shifting)
The testimonial section is framed within a sophisticated, organic SVG blob background that reacts dynamically to user interaction while maintaining continuous ambient life.
* **Ambient State**: Vertices and control points drift continuously in a rhythmic sine/cosine wave pattern (speed 0.0015, amplitude 14-18px), resembling calm lagoon water ripples without inducing motion sickness.
* **Morphing Interaction**: Navigating between testimonials triggers a satisfying quartic transformation (800ms duration) where the anchor points dramatically realign to form completely distinct organic cloud/lagoon shapes.
* **Color-Shifting Palette**: Synchronized with the shape transformation, the blob fill smoothly transitions between curated soft pastel backgrounds (`#EDFBF9` mint, `#FFFCEB` yellow, `#F4F0FC` lavender).
