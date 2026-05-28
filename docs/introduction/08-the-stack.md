---
id: 08-the-stack
title: The Drumee Stack
slug: /introduction/08-the-stack
---

# The Drumee Stack

Drumee is a **Meta Operating System** — an OS-like full-stack framework that provides every layer of a web application in a single, coherent architecture. Unlike typical web applications that stitch together separate tools for auth, storage, backend, and frontend, Drumee ships everything as one integrated system.

## The Four Debian Packages

Drumee is distributed as four Debian packages, all built from the drumee/debian repository. Every deployment — Docker or bare metal — installs the same four packages:

| Package | Repository | Contents |
| :---- | :---- | :---- |
| static | drumee/static | Fonts, icons, locale files, stylesheets |
| schemas | drumee/schemas | MariaDB stored procedures and table definitions |
| server-team | drumee/server-team | Backend Node.js services and ACL configuration |
| ui-team | drumee/ui-team | Frontend LETC rendering engine |


This packaging model is the foundation of Drumee's portability: the same four packages run identically on a developer's laptop (Starter Kit), a single VPS (Own Cloud), or an enterprise data centre.

## The Three-Layer Product Architecture

Drumee's product is structured in three distinct layers, each serving a different role:

| Layer | Role | What It Includes |
| :---- | :---- | :---- |
| **File System Core** | Foundation — *this is what we sell* | Sovereign, self-hosted storage with structured organisation and fine-grained permission control |
| **Collaboration Layer** | Adoption driver — *this is why teams adopt* | File sharing, folder-native chat, document editing (via plugins such as Euro Office) |
| **System / OS Layer** | Differentiator — *this is the long-term moat* | SDK, plugins, and workflow extensions — available today for technical teams |


> Key insight: Layer 1 IS the product. Layer 2 makes it adoptable. Layer 3 makes it extensible.

## The Four Technical Pillars

### 1. Identity & Access Control (ACL)

A bitwise, Linux-inspired permission model enforced at the microservice level — before any service code executes.

* Automatic user-ID tagging for all requests  
* Numeric privilege levels: anonymous (0), read (2), write (4), admin (6), owner (7)  
* Permission check happens before service dispatch — no application-layer bypass possible  
* ACL declared in JSON files — no route registration, no middleware wiring  
  → [ACL System](../technology/02-acl-system.md)

### 2. Meta File System (MFS)

An abstraction layer over the host filesystem that stores file metadata in a database and physical content at content-addressed paths.

- Everything is a **node** (UUID) in the media database table

- Physical path: `{mfs_dir}/{VFS_ROOT_NODE}/{node_id}/` — never exposed to users

- All operations via stored procedures — no raw SQL against MFS tables in service code

- Soft-delete via trash_media table with configurable expiry

- Permission enforcement at the node level, not just the hub level

- → [MFS Architecture](../technology/03-mfs-architecture.md)

### 3. LETC Engine (JSON-Based UI)

A declarative UI rendering engine where interfaces are defined as JSON trees, not HTML templates or compiled bundles.

- Full name: **Limitlessly Extensible Tree Components**

- Built on Backbone + Backbone.Marionette

- Server returns pure JSON data — zero HTML processing server-side

- Client resolves kind strings to widget components via a registry

- UI is permission-filtered at source: the server omits nodes the user cannot see

- → [LETC Engine](../technology/04-letc-engine.md)

### 4. Plugin Architecture

A hot-reloadable extension system that lets developers add new backend services and frontend widgets without modifying the core codebase.

- Plugins follow the same ACL + Entity pattern as built-in modules

- Scoped to a specific endpoint: /-/*endpoint*/svc/module.method

- Hot-reload via Acl.loadPlugins(true) — no server restart required

- Full API reference: https://drumee.github.io/api-reference/frontend-sdk/

- → [Plugins](../getting-started/04-plugins.md)

## Runtime Architecture

Once deployed, a Drumee instance runs **two Node.js processes per endpoint**, managed by PM2:

| Process | Endpoint | Responsibility |
| :---- | :---- | :---- |
| index.js | / | HTTP pages, WebSocket connections, user sessions, LETC Router |
| service.js | /-/svc/ | All REST service calls, ACL enforcement, plugin management |


This separation means a crashed REST handler cannot bring down the WebSocket/session server. Each process is independently restartable.

## Drumee vs a Standard Operating System

| Capability | Standard OS | Drumee |
| :---- | :---- | :---- |
| Full hardware control | Yes | No |
| Identity management (ACL) | Yes | Yes |
| File system management (MFS) | Yes | Yes |
| Input/output system | Yes | Yes |
| Rendering engine | Optional | Yes (LETC) |


Drumee provides the same foundational services an OS provides for native applications — but for web applications, running on any Linux server you own.

## Open Source

Drumee is open source under the **AGPL licence**. The full codebase is on GitHub:

- [https://github.com/drumee/starter-kit](https://github.com/drumee/starter-kit)

- [https://github.com/drumee/server-team](https://github.com/drumee/server-team)

- [https://github.com/drumee/ui-team](https://github.com/drumee/ui-team)

