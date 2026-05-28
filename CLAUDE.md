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

**Publishing** (requires a sibling `drumee.github.io` repo checked out):

```bash
npm run publish    # builds, rsyncs to ../drumee.github.io/docs/, commits and pushes
```

The CI pipeline (`deploy.yml`) runs `npm run build` on every push to `main` and deploys to GitHub Pages at `https://drumee.github.io`.

## Architecture

This is a **Docusaurus 3** documentation site for the Drumee platform. Docs are served at the root path (`/`) — not `/docs/` — because `routeBasePath: '/'` is set in `docusaurus.config.ts`.

### Content layout

All documentation lives under `docs/` and is wired into the sidebar via `sidebars.ts`. The active sections are:

| Folder | Purpose |
|--------|---------|
| `docs/introduction/` | What Drumee is, positioning, history |
| `docs/technology/` | Architecture deep-dives (ACL, MFS, LETC engine, widgets) |
| `docs/getting-started/` | Installation guides (Docker local/public, playground, plugins) |
| `docs/product-guides/` | Step-by-step task guides |
| `docs/api-reference/` | Backend SDK, Frontend SDK, stored procedures, ACL spec |
| `docs/resources/` | Glossary, FAQ, troubleshooting |

`docs/__get-started/` and `docs/concepts/` are legacy/draft folders not wired into the sidebar — do not add new content there.

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

The script reads ACL JSON → produces Docusaurus-compatible Markdown with parameter tables, return types, error codes, and examples. Generated files should not be hand-edited.

### Interactive component

`src/components/PermissionBitmaskVisualizer.tsx` is a React component embedded in `docs/api-reference/acl-spec.md` via MDX import. It renders a live permission bitmask calculator.

### Deployment source of truth

`docker-hosted` repo (https://github.com/drumee/docker-hosted) is the canonical reference for Docker deployment instructions in `docs/getting-started/02-own-cloud.md`. When updating that page, verify against:
- `local-domain.yaml` — local domain compose template
- `template.yml` — public domain compose template
- `install.local.sh` — local automated setup script
