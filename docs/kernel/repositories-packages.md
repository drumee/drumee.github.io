---
id: repositories-packages
title: Repositories & Packages
slug: /kernel/repositories-packages
sidebar_position: 15
description: Repository-to-package map for the current Minimal Kernel.
---

# Repositories and packages

| Repository | Package / current version at documentation time | Role and dependency direction | Belongs here | Does not belong here |
|---|---|---|---|---|
| `drumee/server-runtime` | `@drumee/server-runtime` `0.1.0-alpha.1` | generic Node backend runtime | session, ACL, dispatch, push, intrinsic SQL | MFS/product behavior |
| `drumee/ui-runtime` | source `0.1.0-alpha.2`; npm `next` alpha.2 | generic browser runtime | LETC, Kind, Skeleton, services, WebSocket client | Finder, Window Manager, SSR |
| `drumee/system-mfs` | `@drumee/system-mfs` `0.1.0-alpha.1` | optional backend capability, no npm runtime dependencies | MFS SQL, namespace, tree, permission primitives | identity provisioning, transfer UI/jobs |
| `drumee/window-manager` | `@drumee/window-manager` `0.1.0-alpha.2` | optional UI capability; peer-depends on `ui-runtime` | generic window lifecycle/interactions | Finder or Desk policy |
| `drumee/transient` | private transitional packages | assembles and validates all layers | bootstrap, Hello, Finder, adapters, harness, evidence | final public package/repository boundary |

All four extracted packages are currently visible on npm. Architecture documentation avoids embedding versions because alpha tags can move; the table records the state checked on 2026-10-05.

## Licensing found

The four extracted repositories each declare `AGPL-3.0-only` in package metadata and contain an AGPLv3 `LICENSE`. `transient` has no root `LICENSE`, and its private bootstrap, Hello, Finder, MFS service, and MFS transfer package metadata contain no license field. Do not assume the extracted-package license automatically supplies absent metadata for transitional artifacts.

## Historical repositories

`server-team` and `ui-team` are behavioral/provenance sources only. Current standalone packages explicitly test that they do not import them. See [Refactor History](/kernel/refactor-history) for traceability.

## Integration-workspace drift

The standalone repositories are authoritative for extracted packages. At documentation time, System MFS passes the `transient` synchronization audit. The Window Manager audit does not: the standalone package contains the extracted `lib/skeleton.js`, while the transitional mirror has a different inventory. The `transient` server/UI runtime mirrors also differ from the newer standalone packages. Consequently, the verified harness demonstrates the integrated contracts but must not be described as an installation of the latest standalone package artifacts.
