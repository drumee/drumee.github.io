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

All documentation lives under `docs/` and is wired into the sidebar via `sidebars.ts`. The active sections are:

| Folder | Purpose |
|--------|---------|
| `docs/introduction/` | What Drumee is, positioning, history |
| `docs/technology/` | Architecture deep-dives (ACL, MFS, LETC engine, widgets) |
| `docs/technology/` → SDK Reference | Backend SDK, Frontend SDK, stored procedures, ACL spec |
| `docs/getting-started/` | Installation guides (Docker, playground, plugins) |
| `docs/self-hosting/` | Self-hosting: Docker Compose, Debian packages, operations |
| `docs/package-building/` | Building and versioning Drumee Debian packages |
| `docs/product-guides/` | Step-by-step task guides |
| `docs/resources/` | Glossary, FAQ, troubleshooting |

`docs/concepts/` is a legacy/draft folder not wired into the sidebar — do not add new content there.

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

### API reference generation

`scripts/generate-api-docs.js` generates Markdown files under `docs/api-reference/backend-sdk/` from ACL JSON files in a sibling `acl/` directory:

```bash
node scripts/generate-api-docs.js --all               # all modules
node scripts/generate-api-docs.js mfs                 # single module
node scripts/generate-api-docs.js --acl /path/to/acl  # custom ACL dir
```

The script reads ACL JSON → produces Docusaurus-compatible Markdown with parameter tables, return types, error codes, and examples. Only `docs/api-reference/backend-sdk/` is generated — do not hand-edit those files. `docs/api-reference/frontend-sdk/` is hand-written and safe to edit.

The generator defaults to a sibling `acl/` directory (`scripts/../acl`) and a `docs-templates/` directory — **neither exists in this repo**, so `--all` without `--acl /path/to/acl` will fail. Point `--acl` at the ACL JSON dir from a checked-out backend repo (e.g. `server-core`).

### Interactive component

`src/components/PermissionBitmaskVisualizer.tsx` is a React component embedded in `docs/api-reference/acl-spec.md` via MDX import. It renders a live permission bitmask calculator.

### Mermaid diagrams

Mermaid is enabled (`@docusaurus/theme-mermaid`). Use fenced code blocks with `mermaid` as the language in any `.md` file.

### Docker Compose templates

`templates/docker/devel-template.yaml` and `templates/docker/production-template.yml` are the Compose templates referenced in `docs/self-hosting/02-docker-compose.md`. When updating self-hosting Docker instructions, keep these templates in sync.

### Syntax highlighting

Prism is configured with `additionalLanguages: ['bash', 'json', 'sql']` in `docusaurus.config.ts`. Code fences in any other language (e.g. `js`, `yaml`, `typescript`) will render without highlighting until that language is added to the array.

### Static assets

Static files live in `static/` (served at the root) — `static/img/` holds logos, favicon, and images referenced as `img/...`. `static/CNAME` sets the custom domain and `static/.nojekyll` keeps GitHub Pages from stripping files. The root-level `Development-install.md`, `Production-install.md`, `README.md`, and `UI-SOURCE-BUGS.md` are **not** part of the Docusaurus site.

### Broken links

`onBrokenLinks: 'warn'` in `docusaurus.config.ts` — broken internal links produce a warning but do **not** fail the build. Fix them anyway before merging.
