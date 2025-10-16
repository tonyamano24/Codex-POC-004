# Codex POC 004

A Nuxt 3 powered Flappy Bird experience styled with Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

## Tailwind setup

Tailwind CSS and PostCSS are configured via `tailwind.config.js`, `postcss.config.js`, and the shared entry file at `assets/css/tailwind.css`. Update these files if you add new directories that contain Tailwind utility classes.

## Available scripts

- `npm run dev` – start the local development server
- `npm run build` – generate an optimized production build
- `npm run preview` – preview the built application
- `npm run typecheck` – verify TypeScript types using Nuxt's type generation
- `npm run e2e` – execute the Playwright end-to-end test suite
- `npm run eslint` – lint the codebase with the shared Nuxt TypeScript ruleset

### End-to-end testing

Playwright powers the automated gameplay checks. After installing project dependencies, download the browser binaries once per environment:

```bash
npm install
npx playwright install
```

Then run the test suite locally with:

```bash
npm run e2e
```

## Continuous integration

GitHub Actions runs ESLint on every push and pull request via `.github/workflows/eslint.yml`. The workflow installs project dependencies with npm, restores cached modules for faster execution, and executes `npm run eslint`. Make sure new contributions pass the lint check locally before opening a pull request.

## Tech stack

- [Nuxt 3](https://nuxt.com)
- [Tailwind CSS](https://tailwindcss.com)
- [PostCSS](https://postcss.org)
