---
id: 06-request-pipeline
title: Request Pipeline
slug: /technology/06-request-pipeline
sidebar_position: 7
description: How an HTTP request flows through server-core — pipeline stages, session lifecycle, response format, and the YP service registry.
---

# Request Pipeline

`@drumee/server-core` is the middleware foundation for all Drumee backend services. Every HTTP request — file management, sharing, messaging, user administration — flows through the same ordered pipeline before any service code runs.

## Pipeline Stages

Each stage is a class that communicates with the next via named events. No stage calls the next one directly.

```
HTTP Request
     │
     ▼
┌──────────────────────────────────────┐
│  Input                               │  Parse URL, headers, cookies,
│  lib/input.js                        │  multipart uploads, body.
│                                      │  Emits: INPUT_READY
└──────────────────┬───────────────────┘
                   │ INPUT_READY
                   ▼
┌──────────────────────────────────────┐
│  Session                             │  Identify hub, resolve user
│  lib/session.js                      │  from session cookie, handle
│                                      │  login / OTP / mimic flows.
│                                      │  Emits: READY / START
└──────────────────┬───────────────────┘
                   │ READY
                   ▼
┌──────────────────────────────────────┐
│  Acl                                 │  Check bitwise permissions on
│  lib/acl.js                          │  the requested service, source
│                                      │  node, and destination node.
│                                      │  Emits: GRANTED / DENIED
└──────────────────┬───────────────────┘
                   │ GRANTED
                   ▼
┌──────────────────────────────────────┐
│  Entity  (extends Acl)               │  Execute service logic; send
│  lib/entity.js                       │  hub / user / email notifications;
│                                      │  spawn background tasks.
└──────────────┬───────────────────────┘
               │
       ┌───────┴──────────────────┐
       ▼                          ▼
┌───────────────┐        ┌──────────────────────┐
│  Mfs / FileIo │        │  Generator /         │
│  (file ops)   │        │  Document            │
│               │        │  (media conversion)  │
└──────┬────────┘        └────────┬─────────────┘
       └────────────┬─────────────┘
                    ▼
┌──────────────────────────────────────┐
│  Output                              │  Serialize response (JSON / HTML /
│  lib/output.js                       │  media), set headers, cookies, CORS.
│                                      │  Emits: SENT
└──────────────────────────────────────┘
     │
     ▼
HTTP Response
```

If any stage encounters an error it delegates to **Exception** (`lib/exception.js`), which sends a formatted error response and terminates the pipeline.

## Module Responsibilities

| Module | File | Role |
| :---- | :---- | :---- |
| **Input** | `lib/input.js` | Parse raw HTTP request into a normalised data structure |
| **Session** | `lib/session.js` | Identify hub; authenticate user; load context |
| **Acl** | `lib/acl.js` | Enforce bitwise access control rules |
| **Entity** | `lib/entity.js` | Extend Acl with notification and service execution utilities |
| **Output** | `lib/output.js` | Format and write the HTTP response |
| **Data** | `lib/data.js` | Wrap request payload; extract service name, module, method, recipient |
| **User** | `lib/user.js` | Expose user profile, locale, identity helpers |
| **Mfs** | `lib/mfs.js` | Virtual filesystem abstraction backed by MariaDB |
| **FileIo** | `lib/file-io.js` | Stream physical files; serve media with proper format headers |
| **Exception** | `lib/exception.js` | Emit structured HTTP error responses |
| **RuntimeEnv** | `lib/runtimeEnv.js` | Build client-facing runtime configuration (bundles, locale, hub settings) |
| **Page** | `lib/page.js` | Render Lodash HTML templates with runtime context injected |
| **Generator** | `lib/utils/generator.js` | Convert media files (images, video, audio, documents) into derived formats |
| **Document** | `lib/utils/document.js` | Index and rebuild document previews in background subprocesses |

## Pipeline Events

Stages communicate exclusively through named events. This decoupling means any stage can be replaced or short-circuited without modifying upstream code.

| Event | Emitted by | Consumed by |
| :---- | :---- | :---- |
| `INPUT_READY` | Input | Session |
| `READY` | Session | Acl / calling code |
| `START` | Session | Acl / calling code |
| `GRANTED` | Acl | Entity / service handler |
| `DENIED` | Acl | Exception |
| `ERROR` | Any stage | Exception |
| `SENT` | Output | Cleanup / connection tracking |
| `END_OF_SESSION` | Session | Cleanup |
| `precondition_failed` | Input | Exception |

## Session Lifecycle

```
1. Input emits INPUT_READY
2. Session._selectSession()
      ├─ _initHub()   → load hub config from YP (by Host header)
      └─ _initUser()  → resolve user from session cookie
             ├─ Normal user  → load profile + settings JSON
             ├─ Guest / DMZ  → dmz_login()
             ├─ OTP pending  → send_otp()
             └─ Mimic        → validate impersonation window
3. Session emits READY (with hub + user context set)
```

### User States

| State | Meaning |
| :---- | :---- |
| `active` | Normal login |
| `new` | First-time user |
| `otp` | Awaiting one-time password |
| `online` | Already connected |
| `offline` | Inactive |
| `frozen` / `locked` / `archived` | Access denied |
| `system` | Internal service identity |

**Mimic (impersonation):** A privileged user can mimic another. The session validates that the mimic window is still open on every request; if expired, access is denied.

## Response Envelope

Every JSON response from `Output` is wrapped in a standard envelope:

```json
{
  "__ack__":       "<service name>",
  "__status__":    "<ok | error | …>",
  "__expiry__":    "<cache TTL>",
  "__timestamp__": "<ms since epoch>",
  "data":          { }
}
```

Convenience methods on the `output` object:

| Method | Use |
| :---- | :---- |
| `output.data(obj)` | JSON data response |
| `output.row(obj)` | Single database record |
| `output.rows(arr)` | Multiple records |
| `output.list(arr)` | Array payload |
| `output.html(str)` | HTML page |
| `output.redirect(url)` | 302 redirect |

Cookies are always set `httpOnly`, `SameSite=Strict`, and scoped to the hub domain.

## Error Handling

`Exception` maps semantic errors to HTTP status codes:

| Method | HTTP code |
| :---- | :---- |
| `exception.server()` | 500 |
| `exception.user()` | 400 |
| `exception.unauthorized()` | 401 |
| `exception.forbiden()` | 403 |
| `exception.not_found()` | 404 |
| `exception.reject()` | 405 |
| `exception.precondition()` | 412 |
| `exception.fatal()` | 512 |

All methods accept an optional `reason` field for context that is logged server-side but not exposed to the client.

## YP — Yellow Pages Service Registry

**YP** is Drumee's internal RPC and registry abstraction backed by MariaDB stored procedures. It is injected into each pipeline stage via `initialize(opt)` and used throughout.

```js
// Typical YP call pattern
const rows = await this.yp.await_proc("procedure_name", arg1, arg2);
```

YP is the primary mechanism for:

- Loading hub and user data during session initialisation
- Resolving MFS nodes and permissions in the ACL layer
- Any database read/write from service handlers

Multi-tenancy is enforced at the YP level: each hub has its own database schema, and YP routes calls to the correct schema automatically. See [Database Sharding & the Entity Pool](./07-database-sharding.md) for how those per-entity databases are provisioned.

## Plugin / Extensibility Model

New backend services can be added without modifying `server-core`. A plugin is a separate Node.js package that:

1. Extends `Entity` (or `Acl`) from this library for its service handlers.
2. Declares its services in a JSON config file (same format as the ACL spec).
3. Is registered in the Drumee service loader alongside core services.

The permission and pipeline infrastructure is inherited automatically. The plugin only needs to implement service-specific business logic. `server-core` is an infrastructure boundary — features live in plugins, core provides the contract.

## Key Conventions

**Service naming:** `module.method` — e.g. `yp.get_env`, `media.copy`, `share.link`. The ACL and input parsing both rely on this dot-separated format.

**`initialize(opt)` pattern:** No class uses a traditional constructor for setup. All wiring happens in `initialize(opt)`, making it straightforward to inject mocks or reconfigure a stage in tests.

**Physical file paths** follow a predictable template:

```
{mfs_root}/{node_path}/orig.{ext}          ← original
{mfs_root}/{node_path}/{format}.{ext}      ← derived (preview, slide, …)
{mfs_root}/{node_path}/info.json           ← metadata cache
```

**Async strategy:** Database and I/O calls use `async/await` (e.g. `await this.yp.await_proc(...)`). Media generation also uses `async/await`. Long-running calls fork child processes in fire-and-forget mode (`detached: true`) or queue them; results are pushed back through WebSocket.
