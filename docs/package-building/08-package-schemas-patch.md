---
id: 08-package-schemas-patch
title: "Package: drumee-patch"
slug: /package-building/package-schemas-patch
description: drumee-patch package — incremental MariaDB schema patches, manifest system, lazy-apply on server startup
---

# Package: drumee-patch

**Directory:** `schemas-patch/`
**Debian package:** `drumee-patch`
**Current version:** 1.1.6

## Purpose

Delivers incremental schema patches — SQL/JS files that migrate the live database from one version to the next without a full reinstall of `drumee-schemas`. Used for hotfixes and rolling updates to the MariaDB schema.

## Source Repos

| Repo | Branch | Destination |
|---|---|---|
| `schemas` | preview | `schemas-patch/src/schemas/` |

## Build

The `--manifest` flag is **required**. The build exits silently without it.

```bash
# Auto-generate manifest from last 2 commits
schemas-patch/build.sh --manifest=auto

# Auto-generate from last N commits
schemas-patch/build.sh --manifest=auto 3

# Use an explicit manifest file
schemas-patch/build.sh --manifest=/path/to/manifest.txt
```

`schemas-patch/build.sh` only recognises `--manifest` and an optional positional commit depth — version and email come from `schemas-patch/debian/changelog`.

## Manifest System

The manifest (`patches/manifest.txt`) is a list of schema files to include in the patch package. It controls exactly which SQL/JS migrations get deployed.

### `--manifest=auto`

1. Clones/updates the `schemas` repo (preview branch)
2. Runs `bin/make-manifest` which diffs the last N commits to identify changed schema files
3. Filters files by schema type: `yellow_page`, `drumate`, `hub`, `common`, `utils`
4. Writes `patches/manifest.txt`
5. If no changes are found, exits with: `No change to build patch`

### `--manifest=/path/to/file`

Copies the given file directly to `patches/manifest.txt`. Use this when you have a curated list of specific patches to deploy.

## Installed Paths

```
/var/lib/drumee/patches/schemas/
├── manifest.txt         # list of patch files to apply (under patches/)
├── bin/                 # patch runner scripts
├── package.json         # + installed node_modules
└── <patch-files>        # SQL/JS schema migration files

/var/lib/drumee/postinstall/
└── patch.sh             # applied automatically at server startup
```

> The `admin/` package (`drumee-schemas-patch`) is the production variant and installs its runner under `/opt/drumee/schemas/patches/` instead.

## Patch Runner Scripts

### schemas-patch/bin/patch-from-manifest.sh

The deployed patch runner. Applied at server startup via `postinst`:

1. Stops the factory service if running
2. Sets `character_set_collations` to `utf8mb4_general_ci`
3. Reads `manifest.txt` and iterates by schema type (yellow_page → drumate → hub → common → utils)
4. Calls `patch.js` for each matching file with `--schemas`, `--source`, `--target`, `--orphan`, `--force`
5. Restarts factory

### schemas-patch/bin/patch-from-file

Applies a single patch file directly. Used for targeted one-off patches.

### admin/opt/drumee/schemas/patch.sh

The version used in production deployments (installed by the `admin/` scripts). Same logic as `patch-from-manifest.sh` but references:
- Manifest: `/opt/drumee/schemas/patches/manifest.txt`
- Patcher: `$DRUMEE_SERVER_HOME/main/offline/db-patch.js`
- Options include `--orphan=remove` and `--ignore-error`

## Dependencies

```
binutils, nodejs, mariadb-server, mariadb-client
```

## Post-Install

Patch files are staged but not applied immediately on install. They are applied the next time the Drumee server starts, via `/var/lib/drumee/postinstall/patch.sh`.

To apply patches immediately without restarting the server:

```bash
bash /opt/drumee/schemas/patches/patch-from-manifest.sh
```
