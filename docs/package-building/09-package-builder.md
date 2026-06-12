---
id: 09-package-builder
title: "Package: builder (interactive installer)"
slug: /package-building/package-builder
description: builder/ package — drumee-infra interactive installer variant with debconf prompts and setup wizard
---

# Package: builder (drumee-infra interactive installer)

**Directory:** `builder/`
**Debian package:** `drumee-infra`
**Current version:** 1.2.5

## Purpose

The `builder/` package produces a `drumee-infra` `.deb` that is an **interactive first-time installer** for a bare-metal or fresh VM deployment. Unlike the standard `infra/` package (which is pre-configured), this variant prompts for domain name and partition via debconf during `dpkg -i` and then runs an interactive setup menu.

Post-install, it invokes `/var/lib/drumee/setup/menu/install.sh` — a guided setup wizard that configures the full Drumee stack from scratch.

## How It Differs from infra/

| Aspect | `infra/` | `builder/` |
|---|---|---|
| Source | Clones `setup-infra` from GitHub | Pre-built artifacts from `target/` |
| Config | Pre-configured | Interactive debconf prompts (domain, partition) |
| Post-install | Runs `setup-infra/bin/install` | Runs `setup/menu/install.sh` (full wizard) |
| Signing | GPG-signed | Unsigned (`-us -uc`) |
| Runtime deps | nginx, nodejs, npm, git, … | debconf only |
| Default REPO_BASE | GitHub | GitLab (`git@gitlab.drumee.in:drumee/`) |

## Source

Content comes from two places:

1. **`target/`** (repo root) — pre-built `etc/`, `usr/`, `var/` trees rsynced directly into the package
2. **`builder/src/setup`** — the `setup` repo (branch `somanos/wip`), installed to `/var/lib/drumee/setup/`

## Build

```bash
# Package what's already in target/ (no source pull)
builder/build.sh

# Pull the setup repo first, then package
builder/build.sh pull
```

No `--version`, `--force`, or `--email` flags — `builder/` has its own simplified `utils/functions.sh` that does not call `parse_args`.

## Installed Paths

```
/etc/drumee/           # from target/etc/
/usr/                  # from target/usr/ (includes acme.sh)
/var/lib/drumee/
└── setup/             # from builder/src/setup (setup wizard)
    └── menu/
        └── install.sh # interactive setup entry point
```

## Debconf Prompts

During install, `dpkg` presents two prompts:

| Template | Default | Description |
|---|---|---|
| `drumee-test/domain` | `example.com` | Domain name for the Drumee instance |
| `drumee-test/partition` | `/dev/sda1` | Data partition to use for storage |

## Environment Differences

`builder/utils/env.sh` exports the same path values as the main `utils/env.sh`, with one difference: it hardcodes the paths literally instead of deriving them from `DRUMEE_ROOT_DIR`, which it does **not** export.

| Variable | main `env.sh` | `builder/env.sh` |
|---|---|---|
| `DRUMEE_ROOT_DIR` | `/srv/drumee` | *(not exported)* |
| `DRUMEE_DATA_DIR` | `/data` | `/data` |
| `DRUMEE_MFS_DIR` | `/data/mfs` | `/data/mfs` |
| `DRUMEE_TMP_DIR` | `/srv/drumee/runtime/tmp` | `/srv/drumee/runtime/tmp` |

## REPO_BASE Fallback

`builder/utils/functions.sh` differs from the root `utils/functions.sh` in one key way: when `REPO_BASE` is empty, it falls back to `git@gitlab.drumee.in:drumee/` instead of GitHub. `builder/build.sh` explicitly sets `REPO_BASE=git@github.com:drumee` so it uses GitHub by default, but unsetting `REPO_BASE` will switch to GitLab.
