# Project Backlog

## Todo

### User Experience & Theming
- [ ] Create automated tests for critical user journeys: navigation to case studies, responsive layout assertions, mouse trail assertions, etc
- [ ] Determine the optimal level of compression/quality for "about me" images to find a balance between visual quality and page load performance.
- [ ] Optimize videos using a widely available video format to find a balance between file size and visual quality.

## Done
- [x] Bug: when the user moves the mouse for the first time, the mouse trail effect appears in the top-left corner of the screen. It should appear where the mouse is.
- [x] Add view transitions for page navigation.
- [x] Optimize mouse trail for performance and extract into standalone `MouseTrailComponent` design token.
- [x] Implement ESLint with Angular strict mode rules.
- [x] Install Husky.
- [x] Bring the mouse trail over images, to have the maximum z-index to overlap any content.
- [x] Replace hero-bg-trace with the SVG I will provide as an attachment