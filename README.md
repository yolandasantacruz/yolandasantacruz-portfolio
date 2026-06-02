# Yolanda Santa Cruz Portfolio

[![Meta-Framework: AnalogJS](https://img.shields.io/badge/AnalogJS-2.5-000?style=flat-square&logo=angular&logoColor=white)](https://analogjs.org) [![Framework: Angular](https://img.shields.io/badge/Angular-21-000?style=flat-square&logo=angular&logoColor=white)](https://angular.io) [![Vitest](https://img.shields.io/badge/Unit%20Tests-Vitest-729B1B?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev) [![Build Status](https://github.com/yolandasantacruz/yolandasantacruz-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/yolandasantacruz/yolandasantacruz-portfolio/actions/workflows/deploy.yml) [![Deployment Status](https://img.shields.io/badge/Deployed%20to-GitHub%20Pages-3b9f98?style=flat-square&logo=github&logoColor=white)](https://yolandasantacruz.github.io/yolandasantacruz-portfolio/) 

This is the professional portfolio of Yolanda Santa Cruz, built using [Analog](https://analogjs.org), the full-stack meta-framework for Angular.

## 🚀 Tech Stack

- **Core**: [Angular 21](https://angular.io)
- **Meta-Framework**: [AnalogJS](https://analogjs.org) (SSR, File-based routing, Content Engine)
- **Styling**: Vanilla CSS with a strict [Design System](file:///Users/zorphdark/dev/yolandasantacruz-portfolio/DESIGN-SYSTEM.md)
- **Interactive**: WebGL2 Mouse Trail Shader
- **Tooling**: Vite, Vitest, ESLint, pnpm
- **Content**: Markdown-driven via Analog Content Engine

## 🎨 Design System & Protocols

This project follows strict architectural and design guardrails to ensure high performance and maintainability.

- **[Design System](./DESIGN-SYSTEM.md)**: Defines the single source of truth for typography, colors, and animations.
- **[Agentic Protocols](./AGENTS.md)**: Outlines the engineering standards, including SRP, DRY, and SSR compatibility rules.

## 📦 Content Management

The portfolio uses **Analog's Content Engine**, decoupling design from content. You can update the site by modifying Markdown files in `src/content/`.

### About Page (Atomic Content)
Located in `src/content/about/`, each section is isolated:

- **hero.md**: Greeting, mission statement, and social links.
- **belief.md**: Core philosophical statement (pull-quote).
- **pillars.md**: Strategic data, metrics, and core competencies.
- **testimonials.md**: Social proof and client quotes.
- **timeline.md**: Professional career history and track record.
- **publications.md**: Articles, interviews, and thought leadership.
- **action.md**: Mentorship, keynotes, and community activities.

### Project Case Studies
Located in `src/content/projects/`, these files define the portfolio items:

- Each `.md` file represents a project
- Front-matter defines metadata: `title`, `slug`, `description`, `imageUrl`, `category`, `role`, `timeline`, and `techStack`.

## 🛠️ Development

### Setup
```bash
pnpm install
```

### Local Development
```bash
pnpm start
# Navigate to http://localhost:5173/
```

### Build & Production
```bash
pnpm run build
# Client: dist/analog/public
# Server: dist/analog/server
```

### Testing & Quality
```bash
pnpm run test    # Run unit tests with Vitest
pnpm run lint    # Run ESLint
```

## 🖼️ Image Optimization & Responsive Delivery

To maintain fast page speeds and minimize payload delivery on mobile devices, this project uses a build-time pre-scaling workflow:

1. **Compress & Resize Assets**:
   When you add new images to `public/images/`, include their paths in the `IMAGES` array in `scripts/optimize-images.js` and run:
   ```bash
   node scripts/optimize-images.js
   ```
   This script generates `400w`, `800w`, and `1200w` variants of the raw WebP files at `quality: 95`, while backing up the originals.

2. **Usage in Angular Components**:
   Always use the `NgOptimizedImage` directive from `@angular/common` in component templates. Specify `ngSrcset` and `sizes`:
   ```html
   <img [ngSrc]="myImageUrl" 
        ngSrcset="400w, 800w, 1200w" 
        sizes="(max-width: 768px) 100vw, 480px" 
        width="480" height="595" 
        alt="Visual description" />
   ```
   *Note: A global `IMAGE_LOADER` configured in `src/app/app.config.ts` automatically maps these widths to our local pre-scaled WebP files (e.g., `/images/myImage-400w.webp`).*

3. **Usage in Static Markdown Files**:
   Since static markdown is parsed into raw HTML, use standard HTML `<img>` elements with `srcset` and `sizes` attributes pointing to the local generated WebP paths:
   ```html
   <img src="images/projects/my-project/main.webp" 
        srcset="images/projects/my-project/main-400w.webp 400w, 
                images/projects/my-project/main-800w.webp 800w, 
                images/projects/my-project/main-1200w.webp 1200w" 
        sizes="(max-width: 768px) 100vw, 1200px" 
        alt="Visual description" 
        loading="lazy" decoding="async" />
   ```

## ♿ Accessibility & Performance

- **A11y**: Committed to WCAG AA compliance, focus management, and semantic HTML.
- **Performance**: High-performance animations (CSS-first), optimized asset loading, and 60fps interactive backgrounds.
  - **PWA Caching**: Caching of hashed static assets using `vite-plugin-pwa` for sub-second repeat page load times.
  - **Critical Rendering Path**: Elimination of render-blocking requests by asynchronously preloading Google Fonts stylesheets, inlining PWA registration script directly in the HTML, and inlining compiled client CSS inside `index.html` at build time.
- **SSR**: Fully server-side rendered for SEO and fast initial paint. Prerendered HTML files inherit the inlined critical styles and scripts out of the box.

---
Built with ❤️ by Yolanda Santa Cruz & Alejandro Cuba Ruiz

