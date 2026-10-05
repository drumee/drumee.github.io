---
id: server-runtime
title: Server Runtime
slug: /kernel/server-runtime
sidebar_position: 8
description: Responsibilities and boundaries of @drumee/server-runtime.
---

# `@drumee/server-runtime`

The server runtime is a CommonJS, Node.js 18+ package for generic backend execution.

## Responsibilities

- register and validate ACL descriptors;
- parse logical `module.method` services and lazily load workers;
- normalize HTTP query/JSON input and standard response envelopes;
- resolve/ensure `regsid` session context and sign-in transitions;
- evaluate public, domain, and injected MFS authorization paths;
- resolve frontend plugin bundle paths;
- issue OTAKs, bind WebSockets, route Redis push, and maintain socket liveness;
- install/upgrade only intrinsic runtime Yellow Page SQL;
- provide a bounded binary input path and small control-artifact output.

The host supplies database, Redis, permission conversion, plugin roots, origins, binary limits/temp directory, and capability-specific adapters. `server-runtime` is not a complete executable server by itself.

## Transport versus behavior

The HTTP adapter knows how to receive requests, including the configured binary stream path. It does not define upload sessions or commit files. `PushBus` targets sockets; it does not decide the meaning or visibility of an application event. The descriptor system dispatches a service; the worker remains capability-owned.

Large output is also separated: `RuntimeOutput.write()` is limited to 1 MiB control artifacts. The validated download path returns an internal redirect so Nginx delivers archives and originals outside the Node response buffer.

## SQL ownership

The package's `schemas/SCHEMA_MANIFEST.json` is its executable inventory. Runtime SQL covers Yellow Page identity/session/domain/socket mechanisms intrinsic to runtime behavior.

**Contract:** a backend capability owns and versions the schemas, procedures, and migrations required for its own operation. System MFS consequently ships its own manifest and shard SQL. Application tables, MFS tree storage, Hub/Team behavior, and transfer job state do not belong in `server-runtime`.

## Deliberate non-ownership

The package does not own platform provisioning, System MFS, Finder, Window Manager, browser builds, Team/Hub policy, product services, archives, canonical content, or deployment. It has one runtime dependency, `websocket`; other integration services are injected.

Source: `server-runtime/lib/`, `server-runtime/service/`, `server-runtime/acl/`, and `server-runtime/schemas/`.
