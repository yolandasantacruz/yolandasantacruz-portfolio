# yolandasantacruz-portfolio

This project was generated with [Analog](https://analogjs.org), the fullstack meta-framework for Angular.

## Content Management

This portfolio leverages **Analog's Content Engine**, allowing for a "CMS-like" workflow where design and content are decoupled.

### About Page (Atomic Content)
The About page content is organized into isolated sections within `src/content/about/`. This allows you to update specific parts of your story without touching the layout code:

- **hero.md**: Manages your greeting, mission, and social links.
- **belief.md**: Your core philosophical statement (pull-quote).
- **pillars.md**: Handles strategic data, including metrics and competencies.
- **testimonials.md**: A dedicated space for managing social proof and client quotes.
- **timeline.md**: Your professional career history and track record.

## Setup

Run `pnpm install` to install the application dependencies.

## Development

Run `pnpm start` for a dev server. Navigate to `http://localhost:5173/`. The application automatically reloads if you change any of the source files.

## Build

Run `pnpm run build` to build the client/server project. The client build artifacts are located in the `dist/analog/public` directory. The server for the API build artifacts are located in the `dist/analog/server` directory.

## Test

Run `pnpm run test` to run unit tests with [Vitest](https://vitest.dev).

## Community

- Visit and Star the [GitHub Repo](https://github.com/analogjs/analog)
- Join the [Discord](https://chat.analogjs.org)
- Follow us on [Twitter](https://twitter.com/analogjs)
- Become a [Sponsor](https://github.com/sponsors/brandonroberts)
