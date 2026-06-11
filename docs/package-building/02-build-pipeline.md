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
- **GPG key** matching the maintainer email in `debian/changelog` must be in the local keyring.
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

Each script sources `utils/functions.sh`, clones or updates the upstream source repo, assembles a staging directory, then calls `dh_make` and `dpkg-buildpackage` to produce the `.deb`.

## Building All Main Packages

```bash
./build-all.sh
```

Runs `infra → schemas → ui → server` in sequence with `--force=yes`. Stops on the first failure (`set -e`).

## Common Flags

All build scripts accept these flags via `parse_args`:

| Flag | Default | Effect |
|---|---|---|
| `--version=X.Y.Z` | from `debian/changelog` | Override package version |
| `--force=yes` | prompt | Skip "rebuild existing source?" prompt |
| `--force=rebuild` | prompt | Force re-clone of source repos |
| `--email=user@example.com` | from `debian/changelog` | Override maintainer email for GPG signing |
| `--compile=yes` | no | Force webpack/npm compile step |
| `--enable-api` | no | Include API bundle in UI build |

## Environment Variables

| Variable | Effect |
|---|---|
| `DEB_BUILD_TARGET=/path` | After a successful build, `copyToTarget` copies the `.deb` there automatically |
| `SEEDS_DIR=/path` | Override seeds source for the schemas package (default: `$HOME/docker/data/seeds/`) |
| `REPO_BASE=git@...` | Override the GitHub base URL used by `bundle()` — useful for a local mirror |

## Build Output

Each build produces a `.deb` in the package `build/` directory (e.g. `server/build/drumee-server-pod_2.9.44_all.deb`). If `DEB_BUILD_TARGET` is set, `copyToTarget` copies it there after the build.

## GPG Signing

`dpkg-buildpackage` signs the package with the key matching the maintainer email from `debian/changelog`. Ensure the key is imported:

```bash
gpg --list-secret-keys somanos@drumee.org
```

To build without signing (testing only):

```bash
dpkg-buildpackage -us -uc
```

The `builder/` package always builds unsigned (`-us -uc`).

## Staged Source Directory

`bundle()` clones repos into a `src/` subdirectory of each package directory. On subsequent runs, it does `git pull` instead of a fresh clone. Use `--force=rebuild` to force a clean re-clone.

The source staging area is separate from the `debian/` packaging metadata, which lives in `<package>/debian/` for all packages.

## The builder/ Package

`builder/` produces a `drumee-infra` interactive installer — distinct from `infra/` which is a pre-configured package. Key differences:

- Reads pre-built artifacts from the `target/` directory (no upstream compile step).
- Post-install runs `/var/lib/drumee/setup/menu/install.sh` — an interactive setup wizard.
- Uses debconf to prompt for domain name and partition during `dpkg -i`.
- Builds unsigned (`dpkg-buildpackage -us -uc`), no GPG key required.
- Has its own `builder/utils/` with different env paths and a GitLab fallback in `bundle()`.
- Does not support `--version`, `--force`, or `--email` flags.

```bash
builder/build.sh        # package current target/ artifacts
builder/build.sh pull   # pull setup repo first, then package
```

See [builder package details](./09-package-builder.md) for full documentation.

## Package Dependency Chain

```
drumee-infra
    └── drumee-schemas   (mariadb-server, mariadb-client)
        └── drumee-static
        └── drumee-server-pod  (nginx, redis, ffmpeg, libreoffice, ...)
        └── drumee-ui-pod      (nodejs, git)
            └── drumee-patch   (mariadb-server, mariadb-client)
```
