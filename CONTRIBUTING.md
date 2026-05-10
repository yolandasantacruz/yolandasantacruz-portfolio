# Contributing to Marble Finances

First off, thank you for considering contributing to Marble Finances! Your help is what makes this project possible.

## 1. Where do I go from here?

If you've noticed a bug or have a feature request, please [open an issue](https://github.com/zelenia-labs/yolanda-santacruz-portfolio/issues) on GitHub.

## 2. Fork & Create a Branch

If you'd like to contribute code:
1. [Fork the repository](https://github.com/zelenia-labs/yolanda-santacruz-portfolio/fork).
2. Create a branch with a descriptive name:

```bash
# For a specific issue
git checkout -b 123-fix-chart-overlap

# For a general fix/feature
git checkout -b feature/dynamic-viewport
```

## 3. Development Setup

We use `pnpm` for package management. Please ensure you have it installed.

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm run start

# Run unit tests
pnpm run test

# Run linting
pnpm run lint
```

## 4. Coding Standards

To maintain high code quality, please follow the guidelines listed in the AGENTS.md file.

## 5. Make a Pull Request

Before submitting your PR:
1. Sync your local `main` branch with the upstream repository.
2. Rebase your feature branch on `main`.
3. Ensure all tests and linting pass.

```bash
git checkout main
git pull origin main
git checkout your-branch-name
git rebase main
git push origin your-branch-name --force-with-lease
```

Finally, open a Pull Request on GitHub. Be sure to describe your changes and link to any relevant issues.

Thank you for helping us make this portfolio better!
