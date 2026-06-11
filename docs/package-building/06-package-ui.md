---
id: 06-package-ui
title: "Package: drumee-ui-pod"
slug: /package-building/package-ui
description: drumee-ui-pod package — LETC frontend rendering engine, webpack compile step
---

# Package: drumee-ui-pod

**Directory:** `ui/`
**Debian package:** `drumee-ui-pod`
**Current version:** 3.2.49

## Purpose

The Drumee frontend rendering engine. Installs the LETC-based UI system that receives JSON widget trees from the server and renders them in the browser via Backbone.Marionette component classes.

The UI is **not** a static single-page app — it renders dynamically from server-transmitted JSON. The UI package defines the component registry, not the layout or routes.

## Source Repos

| Repo | Branch | Destination |
|---|---|---|
| `ui-team` | preview | `/srv/drumee/runtime/ui/main/` |

## Build

```bash
ui/build.sh [--version=X.Y.Z] [--force=yes] [--compile=yes] [--enable-api] [--email=user@example.com]
```

`update-changelog.sh` is called automatically at the start of the build.

### Webpack Compile Step

The build runs webpack to compile the `app` target. With `--enable-api`, it also compiles the `api` target. Environment variables set during compile:

```bash
DRUMEE_INSTANCE_NAME=main
UI_BUILD_MODE=production
```

Webpack is run from within the `ui-team` source directory. The compiled bundles are packaged into the `.deb`.

Use `--compile=yes` to force a recompile even when a prior build directory exists.

## Installed Paths

```
/srv/drumee/runtime/ui/main/   # ui-team source + compiled webpack bundles
```

## Dependencies

```
binutils, nodejs, git
```

webpack runs during the *build* step (not at install time), so it is not a runtime dependency.

## Post-Install

No special post-install script. The server's `index.js` process serves the UI assets directly from `/srv/drumee/runtime/ui/main/`.

## update-changelog.sh

```bash
ui/update-changelog.sh [--message="Custom message"] [--email=user@example.com]
```

Syncs the changelog from `ui-team`'s `package.json`. See [Version Management](./11-version-management.md) for the selection logic.
