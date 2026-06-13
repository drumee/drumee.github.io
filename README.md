# Drumee Documentation

The public documentation site for the **Drumee** platform, built with
[Docusaurus 3](https://docusaurus.io/). It is served at
**https://drumee.github.io** (custom domain `docs.drumee.com`) and deployed
automatically from `main`.

> For how this site relates to the platform's other repos, see
> [`setup-infra/DOCUMENTATION.md`](../setup-infra/DOCUMENTATION.md).

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
  introduction/       What Drumee is, problem/solution, roadmap
  technology/         Architecture: ACL, MFS, LETC, request pipeline, sharding + SDK reference
  getting-started/    Starter Kit, Own Cloud, Playground, Plugins
  product-guides/     Task guides: widgets, services, permission management
  package-building/   How the Debian packages are built
  resources/          Glossary, FAQ, troubleshooting
  api-reference/      Generated SDK reference + stored procedures
src/
  pages/index.tsx     Custom homepage
  components/         React components (e.g. PermissionBitmaskVisualizer)
  css/                Global styles
static/               Images, CNAME, favicon, .nojekyll
scripts/
  generate-api-docs.js  Generates Markdown API docs from ACL JSON
docusaurus.config.ts  Site config (url, navbar, theme, Mermaid)
sidebars.ts           Navigation structure (manually maintained)
```

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
- React components can be imported into `.mdx` pages (see
  `PermissionBitmaskVisualizer`).

## Generated API reference

`scripts/generate-api-docs.js` reads ACL JSON from a sibling `../acl/` directory and
writes Markdown into `docs/api-reference/backend-sdk/`:

```bash
node scripts/generate-api-docs.js --all          # regenerate every module
node scripts/generate-api-docs.js <module>       # one module
node scripts/generate-api-docs.js --acl <dir> --output <dir>
```
