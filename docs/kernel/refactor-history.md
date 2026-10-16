---
id: refactor-history
title: Refactor History
slug: /kernel/refactor-history
sidebar_position: 17
description: Short traceability history for the current Minimal Kernel boundaries.
---

# Refactor history

This page provides traceability only. Current behavior is defined by the standalone repositories and tests, not by phase names.

- **Runtime extraction:** application-neutral backend dispatch and a non-MFS LETC browser runtime were isolated from historical Drumee and proven with a synthetic Hello capability.
- **Authentication and push:** real Yellow Page sessions, domain authorization, `regsid`, OTAK WebSocket association, Redis routing, and an authenticated Hello push path were extracted.
- **Exportability:** runtime packages gained manifests, standalone artifact/install tests, and explicit dependency boundaries; they were later extracted to `server-runtime` and `ui-runtime` and published as alpha packages.
- **Platform bootstrap:** a private control-plane component established default organisation and distinct nobody, guest, and system principals without provisioning MFS.
- **System MFS:** MFS installation, existing-shard provisioning, tree/permission SQL, and filesystem APIs were separated into `@drumee/system-mfs`.
- **Window Manager:** generic LETC windows, focus, geometry, interactions, and drop targets were extracted into `@drumee/window-manager`.
- **Finder integration:** Finder selection, transfer, synchronization, recursive upload, and download orchestration were rebuilt above the runtimes, Window Manager, and System MFS.
- **ACL and data-plane stabilization:** upload chunks moved from structured JSON to authorized bounded octet streams; archives, originals, and heavy representations moved to filesystem references and FileIo/Nginx delivery.
- **Real-use stabilization and contract freeze:** independent navigation/selection, direct folder drops, optimistic MOVE convergence, remote reconciliation, reconnect coalescing, URL-only download retrieval, and bounded destruction were validated before the public API was frozen.
- **Standalone extraction and reintegration:** Finder was extracted, the integration workspace was changed to consume the standalone source boundary, and no second production implementation remained in `transient`.
- **Initial Finder publication:** the public [`drumee/finder`](https://github.com/drumee/finder) repository and `@drumee/finder@0.1.0-alpha.1` package completed the extraction; its intended prerelease channel is `next`.
- **Authorized Hub/Finder stabilization:** the official Hub lifecycle, fail-closed WebSocket delivery, capability readiness, per-node access projection, safe reconciliation, and browser-to-real-backend path were validated. The corrected standalone artifacts were then published as `@drumee/server-runtime@0.1.0-alpha.3` and `@drumee/finder@0.1.0-alpha.4`, both on `next`.

- **KB-01A and KB-01B:** runtime alpha.4 introduced named platform authority; canonical control-plane enrollment established the first real human administrator with durable credentials and no implicit Hub.
- **IL-4 distribution and recovery:** the explicit Debian profile consumes canonical Infra lifecycle, immutable source/npm inputs, separate SQL accounts and initialization jobs. Automatic/PTY enrollment, real Hub/MFS/FileIo/browser behavior, restart and isolated restore passed locally and on an isolated LAN testbox. See [qualification](/kernel/distribution/qualification).
- **Infra alpha.2 publication:** npm now serves the byte-identical qualified candidate on `next`; Debian keeps its immutable qualified source pin. The historical alpha.1 release must not be substituted for the lifecycle implementation.

The progression was therefore: Finder integration → ACL/data-plane
stabilization → real-use stabilization → contract freeze → standalone
extraction → Kernel reintegration → public repository → initial alpha
publication → authorized Hub/Finder stabilization → corrected alpha
publication. The historical `server-team` and `ui-team` repositories remain
provenance and compatibility references, not current Kernel dependencies.
`transient` remains integration evidence, not the production Finder source.
