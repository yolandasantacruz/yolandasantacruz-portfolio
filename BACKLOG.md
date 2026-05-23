# Project Backlog

## Todo

### User Experience & Theming
- [ ] Bring the mouse trail over images, to have the maximum z-index to overlap any content.
- [ ] Implement dark/light theme support based on browser preference with a toggle icon in the top navigation bar.
- [ ] Replace hero-bg-trace with the SVG I will provide as an attachment


### Web Quality and Linting
- [ ] Integrate Prettier for deterministic code formatting.

### Git Hooks
- [ ] Configure "pre-commit" hook to execute Prettier and ESLint.

### Unit Testing
- [ ] Establish a minimum code coverage threshold of 80 percent.

### End-to-End Testing
- [ ] Install and configure Playwright.
- [ ] Create automated tests for critical user journeys: navigation to case studies, responsive layout assertions, mouse trail assertions, etc

### Backend & API Integrations
- [ ] Implement a server route to dynamically generate a PDF resume on demand when clicking the "Download Resume" button.

## In Progress

## Done
- [x] Add view transitions for page navigation.
- [x] Optimize mouse trail for performance and extract into standalone `MouseTrailComponent` design token.
- [x] Implement ESLint with Angular strict mode rules.
- [x] Install Husky.