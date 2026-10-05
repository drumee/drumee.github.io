---
id: first-capability
title: First Capability
slug: /kernel/getting-started/first-capability
sidebar_position: 4
description: Learn the current capability boundary from the verified Hello vertical slice.
---

# First capability

The current minimal example is `transient/target/modules/hello`. It is deliberately a validation capability, not a public project generator. Reuse its architecture; do not publish its transitional package name.

```text
hello/
├── package.json
├── server/
│   ├── acl/hello.json
│   └── service/hello.js
├── ui/
│   ├── index.js
│   └── widget/
└── test/hello.test.js
```

## Backend contract

The ACL descriptor declares `hello.ping` as an explicit `public-api` fast path and maps public/private execution to `service/hello`. The worker exports a class whose `ping()` method returns capability data. The server runtime provides descriptor discovery, `module.method` parsing, authorization, lazy worker loading, HTTP input/output, and cleanup.

For a protected method, Hello declares `scope: "domain"` with `src: "read"`. The worker reads the already-established session; it does not authenticate the caller or query permissions itself. A push method publishes through the injected runtime push API.

## Frontend contract

The bundle entry registers a Kind addon:

```js
const HelloWidget = require("./widget");
Kind.registerAddons({ hello: HelloWidget });
```

The Widget extends `LetcBox`, composes a Skeleton, calls `hello.ping` through the inherited service transport, and binds `hello.push` through `runtime.Websocket`. The UI runtime supplies LETC lifecycle, Kind registration, service transport, and WebSocket dispatch; the capability owns its Widget, Skeleton, styling, and event meaning.

## SQL and configuration

Hello needs no SQL or capability configuration, so it owns neither. A capability that requires operational data must ship its own schema manifest/migrations and declare its adapters. Do not add capability SQL to `server-runtime`.

## Run its tests

From `drumee/transient`:

```bash
node --test target/modules/hello/test/hello.test.js
```

Then use [Run the Kernel](/kernel/getting-started/run-the-kernel) to exercise the real HTTP and browser/plugin path. For the complete ownership checklist, see [Capability Model](/kernel/capability-model).
