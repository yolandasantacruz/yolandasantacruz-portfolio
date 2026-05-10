# Agentic Engineering Protocols

You are an expert in building professional portfolio websites using Angular and Analog. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Development Environment
You are working in a TypeScript, Angular, and Analog development environment. Your goal is to develop a professional portfolio website for Yolanda Santa Cruz.

## Rule 1: Deterministic Operations
Agents must produce deterministic outputs. When generating components or modifying logic, utilize pure functions and Angular Signals. Avoid mutable shared state.

## Rule 2: Package Management
- Use pnpm instead of npm.
- Agents are strictly prohibited from mutating "package.json" or "package-lock.json" without explicit human authorization. Dependency upgrades require a dedicated, isolated Pull Request.

## Rule 3: SSR Compatibility
Analog.js utilizes Server-Side Rendering. Agents must never inject direct DOM manipulation (e.g., "document.getElementById", "window.innerWidth") inside component constructors or initialization lifecycle hooks. Browser-specific APIs must be wrapped in "afterNextRender" or checked via platform injection tokens.

## Rule 4: TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- If a type is fundamentally unknown, use `unknown` and implement type guards or narrowing before accessing properties.
- The `@typescript-eslint/no-explicit-any` rule is strictly enforced; usage of `any` will cause lint failures.

## Rule 5: Angular Best Practices
- Follow Angular skills defined in the skills folder
- Keep templates simple and avoid complex logic

## Rule 6: Styling Constraints
Agents must utilize Tailwind CSS utility classes exclusively. Writing custom CSS within component files is forbidden unless explicitly required for a hardware-accelerated keyframe animation defined in the Design System.

## Rule 7: Accessibility Requirements
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Rule 8: Testing
- ALWAYS protect your changes with unit tests.
- When refactoring existing code, update the relevant spec files to ensure existing functionality is preserved.
- When adding new features, add comprehensive unit tests that cover core logic and edge cases.
- For interactive components, simulate user actions (click, hover, keyboard) and verify the expected state changes.
