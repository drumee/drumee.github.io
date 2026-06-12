---
id: 10-utilities
title: Shared Utilities
slug: /package-building/utilities
description: API reference for utils/functions.sh and utils/env.sh — the shared build infrastructure used by all package scripts
---

# Shared Utilities

All build scripts source `utils/functions.sh` and `utils/env.sh`. The `builder/` package has its own copies under `builder/utils/` (see [package-builder.md](./09-package-builder.md)).

---

## utils/env.sh

Exports Drumee runtime path constants used across build scripts and installed packages:

| Variable | Value |
|---|---|
| `DRUMEE_ROOT_DIR` | `/srv/drumee` |
| `DRUMEE_STATIC_DIR` | `/srv/drumee/static` |
| `DRUMEE_DATA_DIR` | `/data` |
| `DRUMEE_MFS_DIR` | `/data/mfs` |
| `DRUMEE_RUNTIME_DIR` | `/srv/drumee/runtime` |
| `DRUMEE_TMP_DIR` | `/srv/drumee/runtime/tmp` |
| `DRUMEE_CACHE_DIR` | `/srv/drumee/cache` |
| `DRUMEE_SYSTEM_USER` | `www-data` |
| `DRUMEE_SERVER_HOME` | `/srv/drumee/runtime/server` |
| `DRUMEE_UI_HOME` | `/srv/drumee/runtime/ui` |
| `ACME_DIR` | `/etc/acme` |
| `PUBLIC_UI_LOCALE` | `/srv/drumee/static/locale` |

`env.sh` also re-checks `$UID` and aborts if sourced under root.

---

## utils/functions.sh

### get_version \<base\> [\<type\>]

```bash
version=$(get_version "$base")
```

Reads the version string (the value in parentheses) from the first line of `<base>/debian/changelog`, e.g. `2.9.45`. The build scripts use this as the authoritative version source.

### get_email \<base\> [\<type\>]

```bash
email=$(get_email "$base")
```

Reads the maintainer email from `<base>/debian/changelog`. Used for `dpkg-buildpackage -k<email>` signing.

### get_build_dir \<dir\>

```bash
build_dir=$(get_build_dir "${base}/build/$version")
```

**Unconditionally** removes and recreates the given directory, then echoes it. This is what the main build scripts use — there is no prompt, so a prior build is always discarded.

### bundle \<base\> \<repo-name\> \<branch\> [\<src-files\>] [\<dest-path\>] [\<npm-script\>]

The core cloning function. For each call:

1. Resolves the clone URL as `${REPO_BASE:-git@github.com:drumee}/<repo-name>.git`
2. Clones into `<base>/src/<repo-name>/` if absent; otherwise `git stash` + `git pull origin <branch>` + `git checkout <branch>`
3. If `package.json` exists, runs `npm i`, `npm audit fix`, and `<npm-script>` (if provided)
4. If `<src-files>` and `<dest-path>` are given, rsyncs those paths into `<build_dir>/files/<dest-path>/`

Override the base URL with `REPO_BASE=...` for a local mirror.

### bundle_acme \<base\> \<dest\>

Special-case clone of `https://github.com/acmesh-official/acme.sh` (not from the Drumee org). Used by `infra/build.sh`.

### copyToTarget \<deb-path-prefix\>

```bash
copyToTarget "$base/build/${package}"
```

If `DEB_BUILD_TARGET` is set, copies `<deb-path-prefix>_all.deb` there; no-op otherwise. Called by `infra/` and `schemas/`; `server/` does the equivalent copy inline. `ui/`, `static/`, `schemas-patch/`, and `builder/` do not copy.

### check_status \<code\> \<message\>

```bash
check_status $? "npm install failed"
```

Exits with an error message if `$1 != 0`.

---

### Helpers defined but not used by the current build scripts

`functions.sh` also defines the following. They are **not** called by the main package build scripts (`infra`, `schemas`, `server`, `ui`, `static`); only `admin/build.sh` still uses the interactive `check_*` flow, and `static`/`schemas-patch` keep them commented out.

| Function | Purpose |
|---|---|
| `parse_args "$@"` | Parses `--version`, `--force`, `--type`, `--compile`, `--enable-api`, `--email` and exports them as `version`, `force`, `type`, `compile`, `enableApi`, `email` (no `ARG_` prefix). Currently unused — scripts that take flags parse them inline. |
| `check_version <ver> <control>` | Interactively confirms/overrides the version and updates `Standards-Version:` in `debian/control`. Used only by `admin/build.sh`. |
| `check_email <email> <control>` | Interactively confirms/overrides the maintainer and updates `Maintainer:` in `debian/control`. Used only by `admin/build.sh`. |
| `check_build_dir <dir>` | Prompts whether to wipe or keep an existing build dir (honours `force=rebuild`). Used only by `admin/build.sh`; the main scripts use `get_build_dir` instead. |
| `bundle_schmas_patches <base> <src> <manifest> <dest>` | Copies manifest-listed schema files into `<dest>`. Currently commented out in `schemas-patch/build.sh`, which inlines the equivalent rsync. |
| `answer [<stdin>]` | Reads a single line from stdin; used by the interactive `check_*` helpers. |
| `strip_base <base> <path>` | Strips the `<base>` prefix from `<path>` for log-friendly relative paths. |
