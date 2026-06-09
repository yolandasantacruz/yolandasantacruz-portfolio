# Project Backlog

## MVP
- [ ] (Yolanda) Review copy and narrative arc with AI
- [ ] (Yolanda) Review information in the case studies
- [ ] Fix font sizes globally in desktop and mobile
- [ ] Fix spacing of copy in the career overview section so it aligns with the image height
- [ ] Fix mentorship section with ADPList badge and YouTube video rendering
- [ ] Comprehensive review of mobile viewport

## Todo
- [ ] Generate a custom, professionally designed `og-card.webp` image (1200×630) for social sharing previews. The current image is a temporary homepage screenshot.
- [ ] Add Discover's use case
- [ ] Normalize the circular icon effects for logo and social links to have a more similar look and feel
- [ ] Create manual double drop-shadow for hero image and testimonials blob in About Me page
- [ ] Update new logo's color
- [ ] Determine the optimal level of compression/quality for "about me" images to find a balance between visual quality and page load performance.
- [ ] Optimize videos using a widely available video format to find a balance between file size and visual quality.

## Done
- [x] Add Google Analytics
- [x] Deploy to yolandasantacruz.com
- [x] Restore and improve animations of sections across pages
- [x] Create automated tests for critical user journeys: navigation to case studies, responsive layout assertions, mouse trail assertions, etc. Bring only unit tests for now, keeping the protection against regressions of important features
- [x] Fix "jumpy" carousel of the testimonials section in the about page when navigating using the carousel arrows
- [x] Allow users to enter the case studies by tapping on the images
- [x] Fix btn-blob size so the background grows with the button text
- [x] In the About Me page, add more glow to the upper part of the bg line so it blends more with the line line it does towards the bottom
- [x] Create suble animation that shows when an image is hovered by increasing the saturation of the image
- [x] Increase "About Me" hero image dimensions and enhance visual quality
- [x] Bring the logo to SVG format
- [x] Remove usage of RxJS and use modern Angular APIs
- [x] Update fav icon with new logo
- [x] Navigation Pills: Refine the active dot color when in the Hero section (top snap) to a more sophisticated, premium tone (such as a refined charcoal or deep warm gray) to replace the current dark teal.
- [x] Navigation Pills: Scale down the font size of the hover labels (case study titles) and explore a cleaner, more sophisticated typeface (e.g., a geometric sans-serif or system-ui with wider tracking/letter-spacing) to improve elegance and readability.
- [x] Remove social links that renders above the footer
- [x] Link Medium articles properly and automatically
- [x] Add line to Resume page
- [x] In the About me page, remove social links except for LinkedIn and GitHub
- [x] Change "Philosophy" pill to About me
- [x] Standarize global nav bar positioning
- [x] Optimize the CSS used in the project so classes and style declarations are reused instead of being declared multiple times. Don't cause any visual regressions. Update the design system accordingly.
- [x] Bug: when the user moves the mouse for the first time, the mouse trail effect appears in the top-left corner of the screen. It should appear where the mouse is.
- [x] Add view transitions for page navigation.
- [x] Optimize mouse trail for performance and extract into standalone `MouseTrailComponent` design token.
- [x] Implement ESLint with Angular strict mode rules.
- [x] Install Husky.
- [x] Bring the mouse trail over images, to have the maximum z-index to overlap any content.
- [x] Replace hero-bg-trace with the SVG I will provide as an attachment
- [x] Refactor CSS filter to use more performant properties (radial gradients instead of CSS blur filters; SVG filters preserved)
- [x] Fix ADPList stats and add visual badge (automatically)