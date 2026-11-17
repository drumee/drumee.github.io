# Drumee Documentation

The public documentation site for the **Drumee** platform, built with
[Docusaurus 3](https://docusaurus.io/). It is served at
**https://drumee.github.io** (custom domain `docs.drumee.com`) and deployed
automatically from `main`.

## Requirements

- Node.js **≥ 20**
- npm (a `package-lock.json` is committed)

## Local development

```bash
npm install
npm start          # dev server at http://localhost:3000 with live reload
```

Other useful scripts (from `package.json`):

| Command | Does |
|---|---|
| `npm run build` | Generate the static site into `build/`. |
| `npm run serve` | Serve the production build locally. |
| `npm run typecheck` | Run `tsc` over the TypeScript config/components. |
| `npm run clear` | Clear the Docusaurus cache. |

## Docker

The site can also be built and served as a container (Node 20 builds it, nginx serves it):

```bash
docker compose up --build        # http://localhost:8080
# or
docker build -t drumee-docs .
docker run --rm -p 8080:80 drumee-docs
```

| File | Purpose |
|---|---|
| `Dockerfile` | Two stages: `npm ci` + `npm run build` on Node 20, then the static `build/` served by nginx. |
| `docker/nginx.conf` | Serves `/path` from `/path/index.html`, the site's 404 page, gzip, security headers, one-year cache for hashed `/assets/`. |
| `docker-compose.yml` | Local preview of the production build on port 8080. |
| `.dockerignore` | Keeps `node_modules`, `build` and `.git` out of the build context. |

## Deployment

Deployment is automated — **do not** use the template's `yarn deploy` flow.
`.github/workflows/deploy.yml` runs on every push to `main` (and via manual
`workflow_dispatch`):

```
checkout → setup-node (v20, npm cache) → npm ci → npm run build → upload ./build → deploy to GitHub Pages
```

`static/CNAME` points `docs.drumee.com` at the Pages deployment, and `static/.nojekyll`
disables Jekyll.

## Structure

```
docs/                 All documentation content (Markdown / MDX)
  introduction/       What Drumee is, problem/solution, the stack, roadmap
  product-tutorial/   Drumee Onboarding Guide (shown under Introduction)
  technology/         Overview, RBAC, file storage, request pipeline, data storage & encryption,
                      directory schema, SDK reference (coming soon)
  getting-started/    Coming soon (one placeholder page)
  product-guides/     Coming soon (one placeholder page)
  self-hosting/       Coming soon (one placeholder page)
  package-building/   Coming soon (one placeholder page)
  resources/          Glossary, FAQ
src/
  pages/index.tsx     Custom homepage
  components/         React components
  css/                Global styles
static/               Images, CNAME, favicon, .nojekyll
docusaurus.config.ts  Site config (url, navbar, theme, Mermaid, redirects)
legacy-redirects.json Every URL of the previous site that no longer exists → the page it redirects to
sidebars.ts           Navigation structure (manually maintained)
```

The site documents the current Drumee platform only. Old URLs that no longer exist are redirected
(`docusaurus.config.ts`, `legacy-redirects.json`).

## Authoring docs

Every Markdown file needs frontmatter:

```yaml
---
id: my-page                 # sidebar reference (filename without the NN- prefix)
title: My Page              # shown in navigation
slug: /section/my-page      # URL path
sidebar_position: 3         # order within its category
description: One-line summary for SEO/previews
---
```

- Use `NN-` filename prefixes (`01-`, `02-`, …) to control ordering.
- A doc only appears in navigation once it's added to `sidebars.ts`.
- Mermaid diagrams are enabled; fenced ```mermaid blocks render directly.
- React components can be imported into `.mdx` pages.
- A section that is not published yet is a single placeholder page with a `:::info[Coming soon]`
  admonition; its sidebar item carries `className: "coming-soon"`, which renders the "Soon" pill.
- When a page is renamed or removed, add a redirect from its old URL (`docusaurus.config.ts`, or
  `legacy-redirects.json` for bulk lists).
- Screenshots in `static/img/product-tutorial/` are taken from the running application at
  1280×800 (2× pixel density) with fictional data only: the sample organization "Northwind Studio",
  its client "Harbor Coffee", and `.example` email addresses. Never publish a screenshot that shows
  real people, real addresses or a development URL.
