---
id: 11-version-management
title: Version Management
slug: /package-building/version-management
description: Changelog lifecycle, update-changelog.sh version selection logic, and how to bump package versions
---

# Version Management

## Authoritative Version Source

Each package's version lives in the first line of its `debian/changelog`:

```
drumee-server-pod (2.9.45) stable; urgency=medium
```

Build scripts read this via `get_version`. To bump a version, edit that line following standard Debian changelog format before running the build.

## Debian Changelog Format

```
<package-name> (<version>) unstable; urgency=medium

  * Change description

 -- Maintainer Name <email>  Day, DD Mon YYYY HH:MM:SS +TZOFF
```

The two-space indent before bullet points and the single-space before `--` are required by `dpkg-parsechangelog`.

## update-changelog.sh

Four packages have an `update-changelog.sh` that auto-syncs the changelog from the upstream source repo's `package.json`:

- `server/update-changelog.sh`
- `ui/update-changelog.sh`
- `static/update-changelog.sh`
- `schemas-patch/update-changelog.sh`

### Usage

```bash
server/update-changelog.sh [--message="Custom message"] [--email=user@example.com]
```

### Version Selection Logic

The script compares two sources:

1. **Current changelog version** — first line of `debian/changelog`
2. **Upstream package.json version** — from the cloned source repo

It picks whichever is **higher** (semver comparison). This means the changelog version will never be downgraded by a `package.json` that lags behind.

### Commit Message

Without `--message`, the script pulls the **last 5 non-merge git commits** from the cloned source repo and formats them as bullet points. With `--message`, uses that string instead.

### Entry Behavior

- If the selected version **already exists** in the changelog, the script **replaces** that entry (updates the message and timestamp).
- If the selected version is **new**, the script **prepends** a new entry.

### When build.sh Calls It Automatically

`server/build.sh`, `ui/build.sh`, and `static/build.sh` call `update-changelog.sh` at the start of the build. `schemas-patch/build.sh` does not — run it manually before building a patch package if needed.

## Bumping a Version Manually

1. Edit the first entry in `<package>/debian/changelog`:
   ```
   drumee-server-pod (2.9.45) unstable; urgency=medium
   ```
2. Run the build script. It will pick up the new version via `get_version`.

Alternatively, let `update-changelog.sh` do it — if the upstream `package.json` already has the new version, the script will prepend the correct entry.

## Standards-Version in debian/control

`check_version` updates the `Standards-Version:` field in `debian/control` to match the changelog version, keeping `lintian` happy. Note that the main package build scripts no longer call `check_version` — only `admin/build.sh` does — so `Standards-Version` is not auto-synced during a normal `infra`/`schemas`/`server`/`ui`/`static` build.

## Current Package Versions

| Package | Current version |
|---|---|
| `drumee-infra` | 1.2.11 |
| `drumee-schemas` | 2.6.99 |
| `drumee-server-pod` | 2.9.45 |
| `drumee-ui-pod` | 3.3.1 |
| `drumee-static` | 1.0.4 |
| `drumee-patch` | 1.1.6 |
| `drumee-infra` (builder) | 1.2.5 |

> Versions move with every release; treat this table as a snapshot. The authoritative value is always the first line of each `<package>/debian/changelog`.
