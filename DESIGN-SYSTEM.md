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

## 3. Typography
* Primary Font: (TODO)
* Base Size: 16px.
* Line Height: 1.6 for body copy, 1.2 for headings.

## 4. Color Palette
To match standard high-fidelity design portfolios, the palette must utilize semantic CSS variables.
(TODO: Define colors as per design requirements)
