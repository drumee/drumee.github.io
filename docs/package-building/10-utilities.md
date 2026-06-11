---
id: 10-utilities
title: Shared Utilities
slug: /package-building/utilities
description: API reference for utils/functions.sh and utils/env.sh — the shared build infrastructure used by all package scripts
---

# Shared Utilities

All build scripts source `utils/functions.sh` and optionally `utils/env.sh`. The `builder/` package has its own copies under `builder/utils/` with different values.

---

## utils/env.sh

Exports Drumee runtime path constants used across build scripts and installed packages:

| Variable | Value |
|---|---|
| `DRUMEE_ROOT_DIR` | `/srv/drumee` |
| `DRUMEE_STATIC_DIR` | `/srv/drumee/static` |
| `DRUMEE_DATA_DIR` | `/srv/drumee/data` |
| `DRUMEE_MFS_DIR` | `/srv/drumee/mfs` |
| `DRUMEE_RUNTIME_DIR` | `/srv/drumee/runtime` |
| `DRUMEE_TMP_DIR` | `/srv/drumee/tmp` |
| `DRUMEE_CACHE_DIR` | `/srv/drumee/cache` |
| `DRUMEE_SYSTEM_USER` | `www-data` |
| `DRUMEE_SERVER_HOME` | `/srv/drumee/runtime/server` |
| `DRUMEE_UI_HOME` | `/srv/drumee/runtime/ui` |
| `ACME_DIR` | `/etc/acme` |
| `PUBLIC_UI_LOCALE` | `/srv/drumee/static/locale` |

---

## utils/functions.sh

### parse_args "$@"

Parses standard CLI flags and exports them as shell variables. Called at the top of every build script that accepts flags.

| Variable | Flag | Default |
|---|---|---|
| `ARG_VERSION` | `--version=X.Y.Z` | *(empty — falls back to changelog)* |
| `ARG_FORCE` | `--force=yes\|rebuild` | *(empty)* |
| `ARG_COMPILE` | `--compile=yes` | *(empty)* |
| `ARG_ENABLE_API` | `--enable-api` | *(empty)* |
| `ARG_EMAIL` | `--email=addr` | *(empty — falls back to changelog)* |

### get_version \<base\>

```bash
VERSION=$(get_version "$BASE")
```

Reads the version string from the first line of `<base>/debian/changelog`.

### get_email \<base\>

```bash
EMAIL=$(get_email "$BASE")
```

Reads the maintainer email from `<base>/debian/changelog`.

### check_version

Interactively confirms or overrides the package version. If `ARG_VERSION` is set, uses it directly. Otherwise prompts. Updates `Standards-Version` in `debian/control` to match.

### check_email

Interactively confirms or overrides the maintainer email. If `ARG_EMAIL` is set, uses it directly. Otherwise prompts. Updates `Maintainer:` in `debian/control` to match.

### get_build_dir \<base\>

```bash
BUILD_DIR=$(get_build_dir "$BASE")
```

Creates and returns the staging directory path for the package build.

### check_build_dir \<base\>

Checks if a prior build directory exists. If `ARG_FORCE=yes`, proceeds silently. If `ARG_FORCE=rebuild`, removes and recreates it. Otherwise prompts the user.

### bundle \<base\> \<repo-name\> \<branch\> [\<src-files\>] [\<dest-path\>] [\<npm-script\>]

The core cloning function:

1. Resolves clone URL as `${REPO_BASE:-git@github.com:drumee}/<repo-name>.git`
2. Clones into `<base>/src/<repo-name>/` if not present; otherwise `git pull`
3. Checks out `<branch>`
4. If `package.json` exists, runs `npm install` (or `<npm-script>` if provided)
5. If `<src-files>` and `<dest-path>` are given, rsyncs those paths into the staging directory

Override the base URL with `REPO_BASE=git@gitlab.drumee.in:drumee` for a local mirror.

### bundle_acme \<base\> \<dest\>

Special-case clone of `https://github.com/acmesh-official/acme.sh` (not from the Drumee org). Used by `infra/build.sh`.

### bundle_schmas_patches \<base\> \<manifest\> \<dest\>

Reads `<manifest>` line by line and copies matching schema files into `<dest>`. Used by `schemas-patch/build.sh` to assemble the patch set.

### copyToTarget \<deb-path-prefix\>

```bash
copyToTarget "$BASE/drumee-server-pod_${VERSION}"
```

If `DEB_BUILD_TARGET` is set, copies `<deb-path-prefix>_all.deb` to that directory. No-op if unset.

### check_status

```bash
check_status $? "npm install failed"
```

Exits with an error message if `$1 != 0`.

### answer

```bash
REPLY=$(answer "Rebuild? [y/N]")
```

Reads a single line from stdin with a prompt.

### strip_base \<path\> \<base\>

Strips the `<base>` prefix from `<path>` to produce a relative path. Used internally for rsync destination calculations.
