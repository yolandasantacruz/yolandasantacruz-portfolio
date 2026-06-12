# Yolanda Santa Cruz Portfolio

[![Meta-Framework: AnalogJS](https://img.shields.io/badge/AnalogJS-2.5-000?style=flat-square&logo=angular&logoColor=white)](https://analogjs.org) [![Framework: Angular](https://img.shields.io/badge/Angular-21-000?style=flat-square&logo=angular&logoColor=white)](https://angular.io) [![Vitest](https://img.shields.io/badge/Unit%20Tests-Vitest-729B1B?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev) [![Build Status](https://github.com/yolandasantacruz/yolandasantacruz-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/yolandasantacruz/yolandasantacruz-portfolio/actions/workflows/deploy.yml) [![Deployment Status](https://img.shields.io/badge/Deployed%20to-GitHub%20Pages-2d7a75?style=flat-square&logo=github&logoColor=white)](https://yolandasantacruz.github.io/yolandasantacruz-portfolio/)

Professional portfolio of Yolanda Santa Cruz, built using [Analog](https://analogjs.org), the full-stack meta-framework for Angular.

## 🚀 Tech Stack

- **Core**: [Angular 21](https://angular.io), [AnalogJS](https://analogjs.org) (SSR, File-based routing, Content Engine)
- **Styling & Assets**: Vanilla CSS with a strict [Design System](./DESIGN-SYSTEM.md), WebGL2 Mouse Trail
- **Tooling**: Vitest, ESLint, pnpm, Husky

## 🎨 Design System & Protocols

- **[Design System](./DESIGN-SYSTEM.md)**: Specifications for typography, colors, and interactive tokens.
- **[Agentic Protocols](./AGENTS.md)**: Engineering standards, SSR rules, and component architectures.

## 📦 Content Management

Manage all display content via Markdown in `src/content/`.

## 🛠️ Development

### Setup

```bash
pnpm install
```

### Local Dev

```bash
pnpm start
```

### Build & Test

```bash
pnpm run build   # Production build (SSR server + client bundle + automated image optimization)
pnpm run test    # Run unit tests with Vitest
pnpm run lint    # Run ESLint
```

## 🖼️ Image Optimization & Delivery

- **Pre-Scaling**: Runs automatically during `pnpm build` (or via `node scripts/optimize-images.js`). Exceeding 150KB files are resized to `400w`, `800w`, and `1200w` WebP formats.
- **Components**: Use `NgOptimizedImage` with `ngSrcset` mapped to pre-scaled assets.
- **Markdown**: Use HTML `<img>` tags with explicit `srcset` and `sizes` referencing WebP paths.

## ♿ Accessibility & Performance

- **A11y**: WCAG AA compliant with proper ARIA attributes, semantic structure, and focus management.
- **Performance**: SSR rendering, PWA static asset caching, Google Fonts preloading, and inlined critical styles/scripts.

---

Built with ❤️ by Yolanda Santa Cruz & Alejandro Cuba Ruiz
