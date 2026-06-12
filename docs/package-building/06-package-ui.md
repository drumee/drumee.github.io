---
id: 06-package-ui
title: "Package: drumee-ui-pod"
slug: /package-building/package-ui
description: drumee-ui-pod package — LETC frontend rendering engine, webpack compile step
---

# Package: drumee-ui-pod

**Directory:** `ui/`
**Debian package:** `drumee-ui-pod`
**Current version:** 3.3.1
**Debian metadata:** `ui/debian/`

## Purpose

The Drumee frontend rendering engine. Installs the LETC-based UI system that receives JSON widget trees from the server and renders them in the browser via Backbone.Marionette component classes.

The UI is **not** a static single-page app — it renders dynamically from server-transmitted JSON. This means the UI package defines the component registry, not the layout or routes.

## Source Repos

| Repo | Branch | Destination |
|---|---|---|
| `ui-team` | preview | `$DRUMEE_UI_HOME/main/` (`/srv/drumee/runtime/ui/main/`) |

## Build

```bash
ui/build.sh [--compile=yes|no] [--enable-api=yes|no]
```

Version and email come from `ui/debian/changelog`. `update-changelog.sh` is called automatically at the start of the build.

### Webpack Compile Step

The build runs webpack to compile the `app` target. With `--enable-api=yes`, it also compiles the `api` target. Environment variables set during compile:

```bash
DRUMEE_INSTANCE_NAME=main
UI_BUILD_MODE=production
```

Webpack is run from within the `ui-team` source directory. The compiled bundles are packaged into the `.deb`.

`--compile` defaults to `yes`; pass `--compile=no` to skip the webpack step (the build directory is wiped and rebuilt on every run regardless).

## Installed Paths

```
/srv/drumee/runtime/ui/main/   # ui-team source + compiled webpack bundles
```

## Dependencies

```
binutils, nodejs, git
```

webpack itself runs during the *build* step (not at install time), so it is not a runtime dependency.

## Post-Install

No special post-install script. The server's `index.js` process serves the UI assets directly from `/srv/drumee/runtime/ui/main/`.

## update-changelog.sh

```bash
ui/update-changelog.sh [--message="Custom message"] [--email=user@example.com]
```

Syncs the changelog from `ui-team`'s `package.json`. See [Version Management](./11-version-management.md) for the selection logic.
