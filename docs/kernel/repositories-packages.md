---
id: repositories-packages
title: Repositories & Packages
slug: /kernel/repositories-packages
sidebar_position: 15
description: Repository-to-package map for the current Minimal Kernel.
---

# Repositories and packages

| Repository | Package and registry state verified 2026-10-10 | Role and dependency direction | Belongs here | Does not belong here |
|---|---|---|---|---|
| [`drumee/server-runtime`](https://github.com/drumee/server-runtime) | `@drumee/server-runtime`; `next` `0.1.0-alpha.3`, `latest` `0.1.0-alpha.1` | generic Node backend runtime | session, ACL, dispatch, push, intrinsic SQL | MFS/product behavior |
| [`drumee/ui-runtime`](https://github.com/drumee/ui-runtime) | `@drumee/ui-runtime`; `next` `0.1.0-alpha.2`, `latest` `0.1.0-alpha.1` | generic browser runtime | LETC, Kind, Skeleton, services, WebSocket client | Finder, Window Manager, SSR |
| [`drumee/system-mfs`](https://github.com/drumee/system-mfs) | `@drumee/system-mfs` `0.1.0-alpha.1`; `next` and `latest` | optional backend capability, no npm runtime dependencies | MFS SQL, namespace, tree, permission primitives | identity provisioning, transfer UI/jobs |
| [`drumee/window-manager`](https://github.com/drumee/window-manager) | `@drumee/window-manager` `0.1.0-alpha.2`; `next` and `latest` | optional UI capability; peer-depends on `ui-runtime` | generic window lifecycle/interactions | Finder or Desk policy |
| [`drumee/finder`](https://github.com/drumee/finder) | `@drumee/finder`; `next` `0.1.0-alpha.4`, `latest` `0.1.0-alpha.1` | optional UI/MFS browsing capability; peer-depends on `ui-runtime`, with an optional Window Manager peer | logical browsing, interaction, transfer orchestration, media requests, sync | authorization, SQL, physical storage, backend jobs |
| `drumee/transient` | integration/evidence workspace; no public assembler package | integrates and validates the layers | bootstrap, Hello, MFS service/transfer/media adapters, kernel harness, cross-package evidence | production Finder source or final package boundary |

All five extracted packages are public on npm. Tags are reported because these
are alpha releases and may move; consumers should verify the registry at
install time. The intentional prerelease channel is `next`. npm retains
`latest` at `0.1.0-alpha.1` for server-runtime and Finder while `next` selects
their corrected Phase 4.9 releases.

## Licensing found

The five extracted repositories each declare `AGPL-3.0-only` in package metadata and contain an AGPLv3 `LICENSE`, including `drumee/finder`.

`transient` has no root `LICENSE`, and its remaining integration artifacts must be evaluated from their own metadata. Do not assume one repository's license automatically supplies absent metadata elsewhere. This is a source-metadata summary, not legal advice.

## Historical repositories

`server-team` and `ui-team` are behavioral/provenance sources only. Current standalone packages explicitly test that they do not import them. See [Refactor History](/kernel/refactor-history) for traceability.

## Integration evidence

The standalone repositories are authoritative for current package APIs. `transient` is authoritative only for integrated bootstrap, backend adapter, data-plane, and cross-package validation evidence. Its Finder validation resolves the sibling standalone repository through `KERNEL_FINDER_ROOT`; it does not carry a second production Finder implementation. The verified harness demonstrates integration contracts but is not a supported production npm-only Kernel distribution or installer.
