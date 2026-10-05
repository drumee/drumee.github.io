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
- **Finder integration:** Finder selection, transfer, synchronization, recursive upload, and download orchestration were rebuilt as private integration capabilities above the runtimes, Window Manager, and System MFS.
- **Binary data-plane correction:** upload chunks moved from structured JSON to authorized bounded octet streams; archives and originals moved to filesystem references and Nginx delivery.

The historical `server-team` and `ui-team` repositories remain provenance and compatibility references. They are not current Kernel dependencies. Finder standalone extraction is still pending; the current implementation remains in `transient`.
