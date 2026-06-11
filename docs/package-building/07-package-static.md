---
id: 07-package-static
title: "Package: drumee-static"
slug: /package-building/package-static
description: drumee-static package — static assets, fonts, localization files served by nginx
---

# Package: drumee-static

**Directory:** `static/`
**Debian package:** `drumee-static`
**Current version:** 1.0.3

## Purpose

Installs static assets served directly by nginx: fonts, locale/translation files, the PDF renderer (Pdfium), and loader/progress UI elements. These are served independently of the Node.js processes.

## Source Repos

| Repo | Branch | Destination |
|---|---|---|
| `static` | main | `/srv/drumee/static/` |

## Build

```bash
static/build.sh [--version=X.Y.Z] [--force=yes] [--email=user@example.com]
```

`update-changelog.sh` is called automatically at the start of the build.

## Installed Paths

```
/srv/drumee/static/
├── locale/              # i18n translation files
├── fonts/               # web fonts (including Armin Grotesk)
└── ...                  # other static assets (Pdfium, loaders)
```

nginx is configured by `drumee-infra` to serve this directory at a static path.

## Dependencies

```
binutils, nodejs, git
```

## Post-Install

No special post-install script. Assets are served by nginx immediately after install.

## update-changelog.sh

```bash
static/update-changelog.sh [--message="Custom message"] [--email=user@example.com]
```

Syncs the changelog from the `static` repo's `package.json`. See [Version Management](./11-version-management.md) for the selection logic.
