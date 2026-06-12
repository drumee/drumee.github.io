---
id: 02-build-pipeline
title: Build Pipeline
slug: /package-building/build-pipeline
description: How to build Drumee Debian packages — prerequisites, flags, GPG signing, and the builder/ special case
---

# Build Pipeline

## Prerequisites

- **No root**: all build scripts check `$UID` and abort if run as root.
- **Git SSH access** to `git@github.com:drumee/` — scripts clone private repos.
- **GPG key** matching the maintainer email in `debian/changelog` must be in the local keyring (the main packages build signed).
- **Node.js** required for packages that run `npm install` or webpack during the build.
- **Debian build tools**: `dh_make`, `dpkg-buildpackage`, `debhelper`.

## Building a Single Package

```bash
infra/build.sh
schemas/build.sh
server/build.sh
ui/build.sh
static/build.sh
schemas-patch/build.sh --manifest=auto
```

Each script sources `utils/functions.sh` (and `utils/env.sh`), clones or updates the upstream source repo via `bundle()`, assembles a staging directory under `<package>/build/<version>/`, then calls `dh_make` and `dpkg-buildpackage` to produce the `.deb`.

## Building All Main Packages

```bash
./build-all.sh
```

Runs `infra → schemas → ui → server` in sequence. Stops on the first failure (`set -e`). It passes `--force=yes` to each script, but that flag is a harmless no-op for these packages (see below).

## Version and Maintainer

The build scripts read the **version and maintainer email from `<package>/debian/changelog`** (via `get_version` / `get_email`). There is **no `--version` or `--email` flag** wired into the current build scripts — to change a version, edit the changelog first (see [Version Management](./11-version-management.md)).

`get_build_dir` unconditionally removes and recreates the per-version build directory on every run, so there is **no "rebuild existing?" prompt** and `--force` is not needed for the main packages.

## Per-Script Flags

Only these flags actually affect a build:

| Script | Flag | Effect |
|---|---|---|
| `ui/build.sh` | `--compile=yes\|no` | Run the webpack compile step (default `yes`) |
| `ui/build.sh` | `--enable-api=yes\|no` | Also compile the `api` webpack target (default `no`) |
| `schemas-patch/build.sh` | `--manifest=auto\|<file>` | **Required** — selects the patch manifest (see [schemas-patch](./08-package-schemas-patch.md)) |
| `schemas-patch/build.sh` | `<N>` (positional) | Commit depth for `--manifest=auto` (default `2`) |
| `builder/build.sh` | `pull` (positional) | Pull the `setup` repo before packaging |

> `utils/functions.sh` defines a generic `parse_args` and interactive `check_version` / `check_email` / `check_build_dir` helpers, but the main package build scripts no longer call them — only `admin/build.sh` still uses the interactive `check_*` flow. `static/build.sh` parses `--version/--force/--email` but then overrides them from the changelog, so they have no effect.

## Environment Variables

| Variable | Effect |
|---|---|
| `DEB_BUILD_TARGET=/path` | After a successful build, the `.deb` is copied there — **only `infra`, `schemas`, and `server`** do this (`ui`, `static`, `schemas-patch`, and `builder` do not) |
| `SEEDS_DIR=/path` | Source directory for the schemas seeds archive (default: `$HOME/docker/data/seeds/`) |
| `REPO_BASE=git@...` | Override the GitHub base URL used by `bundle()` — useful for a local mirror |

## Build Output

`dpkg-buildpackage` builds in the `<package>/build/<version>/` staging tree, so the resulting `.deb` lands in the package's `build/` directory — e.g. `server/build/drumee-server-pod_2.9.45_all.deb`. If `DEB_BUILD_TARGET` is set, `infra`/`schemas`/`server` also copy it there.

## GPG Signing

`dpkg-buildpackage -k<email>` signs the package with the key matching the maintainer email from `debian/changelog`. Ensure the key is imported:

```bash
gpg --list-secret-keys <maintainer-email>
```

To build without signing (testing only):

```bash
dpkg-buildpackage -us -uc
```

The `builder/` package always builds unsigned (`-us -uc`).

## Staged Source Directory

`bundle()` clones each upstream repo into `<package>/src/<repo-name>/`. On subsequent runs it does `git stash` + `git pull` + `git checkout <branch>` instead of a fresh clone. The build staging tree (`<package>/build/<version>/`) is wiped and recreated on every run by `get_build_dir`; it is separate from the `debian/` packaging metadata, which lives in `<package>/debian/`.

## The builder/ Package

`builder/` produces a `drumee-infra` interactive installer — distinct from `infra/` which is a pre-configured package. Key differences:

- Reads pre-built artifacts from the `target/` directory (no upstream compile step).
- Post-install runs `/var/lib/drumee/setup/menu/install.sh` — an interactive setup wizard.
- Uses debconf to prompt for domain name and partition during `dpkg -i`.
- Builds unsigned (`dpkg-buildpackage -us -uc`), no GPG key required.
- Has its own `builder/utils/` with a GitLab fallback in `bundle()` (`git@gitlab.drumee.in:drumee/` when `REPO_BASE` is unset).
- Does not support `--version`, `--force`, or `--email` flags.

```bash
builder/build.sh        # package current target/ artifacts
builder/build.sh pull   # pull setup repo first, then package
```

See [package-builder.md](./09-package-builder.md) for full details.

## Package Dependency Chain

```
drumee-infra
    └── drumee-schemas   (mariadb-server, mariadb-client)
        └── drumee-static
        └── drumee-server-pod  (nginx, redis, ffmpeg, libreoffice, ...)
        └── drumee-ui-pod      (nodejs, git)
            └── drumee-patch   (mariadb-server, mariadb-client)
```
