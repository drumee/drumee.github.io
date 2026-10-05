---
id: overview
title: Minimal Kernel Overview
slug: /kernel/overview
sidebar_position: 1
description: The purpose, boundaries, and component model of the Drumee Minimal Kernel.
---

# Minimal Kernel overview

The Drumee Minimal Kernel is a set of reusable backend, browser, storage, and capability contracts extracted from the historical Drumee application. It supplies application infrastructure without supplying a finished product.

“Minimal” is a boundary, not a deployment preset. The Kernel retains the cross-cutting mechanisms needed to load and execute independent capabilities: request and session context, identity, ACL dispatch, browser runtime composition, plugin loading, realtime transport, and optional system capabilities. Product policy, workflows, and domain models stay outside it.

The result is therefore **not** a reduced installation of the full historical Drumee application. It is an extraction of reusable runtime contracts. Historical Team, Desk, Hub policy, chat, conference, marketing, and product navigation do not become Kernel dependencies merely because older Drumee used them.

## Runtime and capability

- A **runtime** provides application-neutral execution machinery. `@drumee/server-runtime` dispatches services; `@drumee/ui-runtime` composes client-side LETC widgets.
- A **capability** owns one coherent behavior above those runtimes. System MFS and Window Manager are capabilities. Finder is currently an integrated capability under validation.
- An **application** selects capabilities and adds its business rules, data model, interface, and operations.

```mermaid
flowchart TB
  App[Application / product capabilities]
  Finder[Finder integration]
  WM[Window Manager capability]
  MFS[System MFS capability]
  UI[@drumee/ui-runtime]
  Server[@drumee/server-runtime]
  Data[(MariaDB shards)]
  Redis[(Redis push bus)]

  App --> UI
  App --> Server
  Finder -. optional shell .-> WM
  Finder --> UI
  Finder --> MFS
  WM --> UI
  MFS --> Data
  Server --> Data
  Server --> Redis
```

Solid arrows are current runtime dependencies. The dotted Finder-to-Window-Manager edge is optional: the Finder core can render directly, while `FinderWindow` adapts it to a managed window.

## Separation of responsibilities

The backend, frontend, and data layers are separately packaged:

| Layer | Kernel responsibility | Capability responsibility |
|---|---|---|
| Backend | HTTP adaptation, session context, ACL comparison, `module.method` dispatch, push routing | service behavior, resource mapping, application events |
| Frontend | LETC initialization, Skeleton/Widget/Kind contracts, service and WebSocket clients | product widgets, interactions, capability state |
| Data | intrinsic runtime schema manifest and generic MFS primitives | operational schemas, procedures, migrations, content policy |

The package boundary is executable: the four extracted packages can be installed, packed, and tested from standalone clones. The current end-to-end assembly, bootstrap controller, Finder, and MFS service/transfer adapters still live in the private `transient` integration repository.

## What the Kernel deliberately excludes

The generic runtimes do not own business services, application routing, product navigation, Hub/Team policy, Finder, MFS storage, Webpack tooling, SSR, or deployment automation. System MFS does not own identity creation, transfer sessions, browser uploads, archives, trash, search, or quota policy. Keeping those boundaries explicit lets capabilities evolve without turning every product change into a runtime change.

Continue with [Who is it for?](/kernel/who-is-it-for) or run the [verified integration path](/kernel/getting-started/run-the-kernel).

