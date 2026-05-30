# Design System Specification

> [!IMPORTANT]
> This document inherits and extends the global design and accessibility standards defined in the central [Core Design Specification (DESIGN-SYSTEM.core.md)](DESIGN-SYSTEM.core.md).
> It serves as the **single source of truth** for all visual tokens, custom components, and animation settings specific to this portfolio UI. It must be consulted before any UI change, new feature, or visual cleanup. **Strict adherence is mandatory.** Future refactoring and UI improvements must validate against these guidelines to prevent regression.

## 1. Visual Direction and Core Philosophy
The objective is to establish a scalable, highly performant architecture for a Product Design portfolio. The visual direction must prioritize content delivery, typography, and case study readability over superficial graphical effects.

## 2. Scroll Snapping Guardrails
To ensure a premium and fluid navigation experience, we utilize a tiered snapping approach:

* **Landing/Hero Experience**: Use `y mandatory` with `scroll-snap-stop: always`. This creates a focused, full-screen story-telling experience. Combine with long background transitions (e.g., `0.8s`) to ensure the visual shift feels "smooth" and intentional.
* **Content/Reading Experience**: Use `y proximity`. This ensures the scroll only "locks" when the user stops near a section boundary, preventing interference with natural reading rhythms.
* **Alignment**: Use `scroll-snap-align: start`.
* **Breathing Room**: Implement `scroll-margin-top` (typically `4rem` to `6rem`) on snap targets.
* **Easing**: Visual transitions accompanying snaps should use standard premium easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

## 3. Typography
* **Main Body Font**: 'Nunito', sans-serif (Weights: 400, 600, 700, 800).
* **Header Font**: 'Libre Baskerville', system-ui, sans-serif (Weights: 400 Regular, 400 Italic, 700 Bold).
* **Base Size**: 16px.
* **Line Height**: 1.8 for body copy, 1.15 for headings.
* **Heading Weight**: 400 (Regular).
* **Letter Spacing**: -0.02em for headings.

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
* **Section Pastel System**: See [Section 9](#9-homepage-section-pastel-color-system) for the mathematically normalized per-section backgrounds.

## 5. Mouse Trail Background
The `MouseTrailComponent` provides a high-performance WebGL2 shader background.
* **Purpose**: Adds dynamic, premium interactivity without distracting from content.
* **Implementation**: Isolated in `MouseTrailComponent`, uses `portfolio-mouse-trail` selector.
* **Performance**: Must remain outside Angular's change detection zone.
* **Styling**: Operates at `z-index: 5`. Overlapping containers must have `z-index >= 10`.

## 6. Navigation System & Side Rail (Nav Dots)
The floating side rail navigation uses interactive pill/dot components to indicate scroll progress and provide quick jumping between snap sections.
* **Dot Dimensions**: The dots have a standard size of `24px` width/height (with a `4px` default border). This keeps them visually light and ensures they don't dominate the viewport.
* **Layout Clearance (Safe Padding)**: To prevent any visual overlapping between page content and the side-rail navigation, a minimum clearance gap of `16px` is enforced. This translates to an extra right padding on the section content container:
    * Desktop viewports: `padding-right: 5rem` (80px, accounts for 40px right offset + 24px dot width + 16px safety gap).
    * Tablet viewports: `padding-right: 3.5rem` (56px, accounts for 16px right offset + 24px dot width + 16px safety gap).
    * Mobile viewports: Resets to default `1.5rem` (24px) since the side rail is hidden.
* **Hover State Border**: When pills expand on hover, the border opacity is set to 70% (`color-mix(in srgb, var(--pill-color) 70%, transparent)`).
* **Drop Shadow**: Maintained as a premium white glow across all states (`rgba(255, 255, 255, 0.5)` to `0.8`) to contrast elegantly against the WebGL shader canvas and colorful project backgrounds.
* **Active State**: The active section indicator removes its border (`border-width: 0`), transforming into a solid accent dot for strong visual distinction.

## 7. Interactive Text Button Token (`.btn-blob`)

The `.btn-blob` global utility class is the **single source of truth** for the minimalist text-based teal CTA button with an interactive arrow. It is used across:

| Usage | Location |
|---|---|
| "ABOUT ME" hero CTA | `HeroComponent` → `.about-button` |
| "View My Resume" timeline link | `AboutTimelineComponent` → `.download-btn` |
| "DOWNLOAD RESUME" resume page | `ResumeComponent` → `.download-btn` |

### Design Tokens

* **Background**: `transparent` (no background fills)
* **Border/Shadow**: `none`
* **Color**: `#3b9f98` (Dark Teal Contrast Accent) -> `#246560` (Deep Teal) on hover
* **Typography**: Nunito, `1.2rem`, bold (`700`), uppercase, letter-spacing `0.15em`
* **Decoration**: Inline arrow `→` appended via CSS `::after` with a `0.5rem` left margin
* **Hover Interaction**: Smooth translation of the arrow (`transform: translateX(6px)`) using a standard curve `cubic-bezier(0.16, 1, 0.3, 1)` to keep the visual response alive and premium
* **Reduced Motion**: Translation disabled on hover

### Extension Protocol

To add a new action button anywhere in the codebase:
1. Add `class="btn-blob"` to the element.
2. **Do not** copy-paste the visual rules or manually append the arrow `→` in templates — always reference the global class and let the CSS append the arrow decoration automatically.

---

## 8. Testimonial Background Blob (Motion & Color Shifting)
The testimonial section is framed within a sophisticated, organic SVG blob background that reacts dynamically to user interaction while maintaining continuous ambient life.
* **Ambient State**: Vertices drift continuously in a rhythmic sine/cosine wave pattern (speed 0.0015, amplitude 12px), resembling calm lagoon water ripples without inducing motion sickness.
* **Dynamic Tangents**: To prevent kinks or vector path creases when moving or morphing, tangent handles are computed dynamically at runtime based on the positions of adjacent anchor points using Catmull-Rom spline logic with a tension factor of `k = 0.22` (relative to neighbor chord lengths). This ensures the curves remain perfectly smooth ($C^1$ continuity) and eliminates flat angles or sharp creases. Vector handles must never be animated independently from their endpoints.
* **Morphing Interaction**: Navigating between testimonials triggers a satisfying quartic transformation (800ms duration) where the anchor points dramatically realign to form completely distinct organic cloud/lagoon shapes.
* **Color-Shifting Palette**: Synchronized with the shape transformation, the blob fill smoothly transitions between curated soft pastel backgrounds (`#EDFBF9` mint, `#FFFCEB` yellow, `#F4F0FC` lavender).

---

## 9. Homepage Section Pastel Color System

> [!IMPORTANT]
> The `bridge-section` background color `hsl(169, 58%, 96%)` — hex `#f0fbf9` — is the **immutable anchor** of this system. Its hue (169°), saturation (58%), and lightness (96%) **must never be altered**. All other section pastels are derived by locking S and L to these exact values.

### Methodology: Mathematical HSL Normalization

This system uses a disciplined 3-step process — think of it as using **Figma's "Hue" blending mode on a single master style**:

1. **Hue Extraction**: For each homepage section, the primary brand color is sampled from the foreground case study image (dominant CTA, header, or hero color).
2. **HSL Normalization**: The extracted color's **H** (hue) is kept; its **S** (saturation) and **L** (lightness) are completely discarded and replaced with the anchor's values (`S=58%`, `L=96%`). This locks every section to an identical perceived luminance and tonal weight — like a color-corrected Figma frame.
3. **Sequential Ordering**: Sections are arranged so adjacent hues transition smoothly into the `#f0fbf9` anchor, avoiding jarring chromatic leaps.

### Source Colors & Normalization Table

| Section | Case Study | Extracted Brand Color | Source Hex | Hue (H) | Normalized Pastel | Hex Result |
|---|---|---|---|---|---|---|
| Hero | — | Transparent (white bg) | — | — | `--color-bg: #ffffff` | `#ffffff` |
| `#project-0` | Pay with App | Electric Blue CTA button | `#2563EB` | 221° | `hsl(221, 58%, 96%)` | `#f0f3fb` |
| `#project-1` | Fetch Pay | Deep Purple brand header | `#5B21B6` | 263° | `hsl(263, 58%, 96%)` | `#f4f0fb` |
| `#project-2` | Isles at Bayshore | Royal Indigo hero overlay | `#3B4FD6` | 232° | `hsl(232, 58%, 96%)` | `#f0f1fb` |
| `#project-3` | PlantMe | Sage Leaf Green (garden) | `#3DAE8E` | **132°** | `hsl(132, 58%, 96%)` | `#effbf1` |
| `.bridge-section` | — | **ANCHOR (immutable)** | `#f0fbf9` | **169°** | `hsl(169, 58%, 96%)` | **`#effbf9`** |

### Sequential Hue Journey

The hue progression across the page scroll forms a deliberate chromatic arc:

```
Hero (white) → 221° (blue) → 263° (purple) → 232° (indigo) → 132° (sage) → 169° (teal/ANCHOR)
                  ↑+42°        ↑-31°           ↑-100°          ↑+37°
```

The **+37° delta** between PlantMe (132°) and the Bridge anchor (169°) is large enough to read as a distinct tonal shift — sage green hand-off to teal — while the gradient within `#project-3` dissolves the boundary so it never feels abrupt.

### CSS Variable Reference

All tokens live in `:root` inside `src/styles.css`. No section may define a raw color value without referencing a token.

```css
/* Normalization parameters (locked to anchor) */
--section-pastel-s: 58%;
--section-pastel-l: 96%;

/* Per-section hue tokens */
--section-hue-pay-with-app:      221;   /* Electric Blue  (#2563EB)    */
--section-hue-fetch-pay:         263;   /* Deep Purple    (#5B21B6)    */
--section-hue-isles-at-bayshore: 232;   /* Royal Indigo   (#3B4FD6)    */
--section-hue-plant-me:          132;   /* Sage Leaf Green (garden)    */
--section-hue-bridge:            169;   /* Teal ANCHOR    (#f0fbf9)    */

/* Computed pastel backgrounds */
--section-bg-hero:              #ffffff;               /* Hero white base           */
--section-bg-pay-with-app:      hsl(221, 58%, 96%);   /* #f0f3fb — soft periwinkle */
--section-bg-fetch-pay:         hsl(263, 58%, 96%);   /* #f4f0fb — soft lavender   */
--section-bg-isles-at-bayshore: hsl(232, 58%, 96%);   /* #f0f1fb — soft indigo     */
--section-bg-plant-me:          hsl(132, 58%, 96%);   /* #effbf1 — soft sage-leaf  */
--section-bg-bridge:            hsl(169, 58%, 96%);   /* #effbf9 — ANCHOR (teal)   */
```

### Gradient Architecture

Each section renders as a `linear-gradient(to bottom, var(--own-color), var(--next-color))`. This means:

- **One variable, two effects**: changing `--section-bg-plant-me` updates both the bottom half of `#project-3` _and_ the top fade of `.bridge-section`.
- **No raw hex values** exist in any section background rule — all colors are consumed via CSS custom property references.
- **The bridge anchor is preserved**: `.bridge-section` uses PlantMe's color only for the first 12% of its height, then locks to `--section-bg-bridge` for the remaining 88% — so the page closes with a full, unambiguous teal field.

```
Section backgrounds (scroll direction: top → bottom)

#project-0:  [pay-with-app] ░░░░░▓▓▓▓▓ [fetch-pay]
#project-1:  [fetch-pay]    ░░░░░▓▓▓▓▓ [isles-at-bayshore]
#project-2:  [isles]        ░░░░░▓▓▓▓▓ [plant-me]
#project-3:  [plant-me]     ░░░░░▓▓▓▓▓ [bridge]
.bridge:     [plant-me 0–12%] └─────────[bridge 12–100%]
```

### Extension Protocol

When adding a new section in the future:
1. Sample the dominant brand/accent color from the new section's foreground imagery.
2. Convert it to HSL and extract only the **H** value.
3. Add a new `--section-hue-<name>` token with that H value.
4. Derive `--section-bg-<name>: hsl(var(--section-hue-<name>), var(--section-pastel-s), var(--section-pastel-l));`
5. Update this table and the sequential hue diagram above.
6. Verify that the new hue creates no jarring jump with its neighbors (≤45° delta is recommended).
