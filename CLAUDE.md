# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:3000
npm run build      # production build → ./build/
npm run serve      # serve the production build locally
npm run typecheck  # TypeScript type checking (no test suite exists)
npm run clear      # clear Docusaurus cache (fixes stale build issues)
```

The CI pipeline (`.github/workflows/deploy.yml`) runs on every push to `main` using Node 20: `npm ci` → `npm run build` → deploy to GitHub Pages. The site is served from the custom domain **`https://docs.drumee.com`** (`static/CNAME`), even though `docusaurus.config.ts` still sets `url: 'https://drumee.github.io'`. Requires Node >= 20 (`engines` in `package.json`).

## Architecture

This is a **Docusaurus 3** documentation site for the Drumee platform. Docs are served at the root path (`/`) — not `/docs/` — because `routeBasePath: '/'` is set in `docusaurus.config.ts`.

### Content layout

All documentation lives under `docs/` and is wired into the sidebar via `sidebars.ts`. The site documents the current Drumee platform only (Go monolith, MongoDB, S3 object storage, Redis). Do not document, compare with, or refer to earlier technology.

| Folder | Purpose |
|--------|---------|
| `docs/introduction/` | What Drumee is, positioning, history, the stack, roadmap |
| `docs/product-tutorial/` | Drumee Onboarding Guide (listed under Introduction) |
| `docs/technology/` | Overview, RBAC system, file storage, request pipeline, data storage & encryption, directory schema; `07-sdk-reference.md` is a Coming Soon placeholder |
| `docs/getting-started/`, `docs/product-guides/`, `docs/self-hosting/`, `docs/package-building/` | Coming Soon placeholders (one `index.md` each) |
| `docs/resources/` | Glossary, FAQ |

Technology pages must describe what the platform's code does. Do not state a capability (for example end-to-end encryption) as available before it has shipped; mark it Coming Soon instead.

### Coming Soon sections

A section that is not published yet is one page with a `:::info[Coming soon]` admonition. Its sidebar entry is a `doc` item with `className: "coming-soon"` (the "Soon" pill is styled in `src/css/custom.css`). To publish a section, replace the placeholder with real pages and turn the sidebar entry back into a category.

### Redirects

`@docusaurus/plugin-client-redirects` in `docusaurus.config.ts` keeps the old URLs of replaced pages working; `legacy-redirects.json` lists every URL of the previous site that no longer exists, grouped by the page it redirects to. When renaming or removing a page, add a redirect.

### Screenshots

Images in `static/img/product-tutorial/` come from the running application (1280×800 viewport, 2× density) with fictional data only: organization "Northwind Studio", client "Harbor Coffee", `.example` email addresses. Do not publish screenshots that show real people, real addresses, or a development URL.

### Sidebar registration

Every new doc file must be explicitly added to `sidebars.ts` to appear in navigation. The sidebar uses numeric prefixes (`01-`, `02-`) to control ordering — the prefix is part of the filename but the `id` in the frontmatter controls the actual slug.

### Frontmatter conventions

Each doc requires this frontmatter:

```yaml
---
id: <matches-filename-without-prefix>
title: Human Readable Title
slug: /section/filename-without-prefix
sidebar_position: <number>
description: One-line description
---
```

### Mermaid diagrams

Mermaid is enabled (`@docusaurus/theme-mermaid`). Use fenced code blocks with `mermaid` as the language in any `.md` file.

### Syntax highlighting

Prism is configured with `additionalLanguages: ['bash', 'json', 'http']` in `docusaurus.config.ts`. Code fences in any other language (e.g. `js`, `yaml`, `typescript`) will render without highlighting until that language is added to the array.

### Static assets

Static files live in `static/` (served at the root) — `static/img/` holds logos, favicon, and images referenced as `img/...`. `static/CNAME` sets the custom domain and `static/.nojekyll` keeps GitHub Pages from stripping files. The root-level `README.md` is **not** part of the Docusaurus site.

### Broken links

`onBrokenLinks: 'warn'` in `docusaurus.config.ts` — broken internal links produce a warning but do **not** fail the build. Fix them anyway before merging.
