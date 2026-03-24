---
sidebar_position: 2
title: Creating a Service
description: How to create services in Drumee — covers both the backend REST endpoint pattern and the frontend UI skeleton pattern
---

# Creating a Service in Drumee

Drumee has two complementary service layers that work together:

- **Backend service** — a REST endpoint callable at `/-/svc/module.method`, defined by an ACL file and a Node.js class
- **Frontend UI service** — a named UI action attached to a Skeleton node, handled by the LETC widget router

Both concepts use the word "service" and are closely related: the backend exposes the API, the frontend calls it. This guide covers both.

---

# Part 1 — Backend Service (REST Endpoint)

This section explains how to add a new service endpoint to the Drumee server. By the end you will have a working endpoint callable at `/-/svc/mymodule.my_action`.

## Overview

Adding a service in Drumee requires exactly two files:

1. **ACL configuration** — `acl/mymodule.json` declares the endpoint, its permission level, and the module that implements it
2. **Service implementation** — `service/private/mymodule.js` contains the JavaScript class with the method

No route registration, no middleware wiring, no framework config changes.

---

## Step 1 — Create the ACL File

Create `acl/mymodule.json`:

```json
{
  "services": {
    "my_action": {
      "scope": "hub",
      "permission": {
        "src": "write"
      }
    }
  },
  "modules": {
    "private": "service/private/mymodule"
  }
}
```

### Choosing the Right Permission Level

| You want...                       | Use                                 |
| --------------------------------- | ----------------------------------- |
| Any authenticated user to call it | `read`                              |
| Only users who can edit content   | `write`                             |
| Only hub administrators           | `admin`                             |
| Only the resource owner           | `owner`                             |
| No authentication at all          | `anonymous` (and `scope: "public"`) |

### Choosing the Right Scope

| You want...                          | Use                                   |
| ------------------------------------ | ------------------------------------- |
| Operate within a Hub (most services) | `hub`                                 |
| Domain-wide operation                | `domain`                              |
| No Hub context needed                | `public` (with `modules.public` path) |

---

## Step 2 — Create the Service Implementation

Create `service/private/mymodule.js`:

```js
const { Attr } = require("@drumee/server-essentials");
const { Entity } = require("@drumee/server-core");

class MyModule extends Entity {
  async my_action() {
    // 1. Read inputs
    const id = this.input.need(Attr.id); // required — throws if missing
    const name = this.input.use(Attr.name, ""); // optional — default ''

    // 2. Call a stored procedure
    const result = await this.db.await_proc("my_proc", id, name);

    // 3. Return the result
    this.output.data(result);
  }
}

module.exports = MyModule;
```

---

## Step 3 — Understanding Input Handling

Drumee provides two methods for reading request parameters:

| Method                            | Behaviour                                                             |
| --------------------------------- | --------------------------------------------------------------------- |
| `this.input.need(Attr.x)`         | Required. Throws an exception if the parameter is absent.             |
| `this.input.use(Attr.x, default)` | Optional. Returns the default value if absent.                        |
| `this.input.get(Attr.x)`          | Reads without requiring or defaulting. Returns `undefined` if absent. |

The `Attr` constants map to standard parameter names used across the codebase (e.g. `Attr.id`, `Attr.name`, `Attr.email`). For custom parameter names not in `Attr`, pass the string directly:

```js
const days = this.input.use("days", 7);
```

---

## Step 4 — Calling Stored Procedures

All database operations use stored procedures — never raw SQL in service files.

```js
// Operations on the current hub's database
const rows = await this.db.await_proc("my_hub_proc", arg1, arg2);

// Operations on the platform-wide Yellow Pages database
const user = await this.yp.await_proc("drumate_exists", email);

// Resolve a hub's database name explicitly (required when targeting another hub)
const dbName = await this.yp.await_func("get_db_name", hub_id);
const result = await this.yp.await_proc(`${dbName}.my_proc`, arg1);
```

Pass objects and arrays directly — do not call `JSON.stringify` manually:

```js
// Incorrect — causes double-serialisation
await this.db.await_proc(
  "contact_update",
  id,
  JSON.stringify({ email, mobile }),
);

// Correct
await this.db.await_proc("contact_update", id, { email, mobile });
```

---

## Step 5 — Returning a Response

```js
// Return data to the caller
this.output.data(result);

// Return a list
this.output.list(rows);

// Return nothing (fire-and-forget operations)
this.output.data({});
```

---

## Step 6 — Error Handling

```js
// User error — sent to the client with an error status
if (!result) {
  this.exception.user("RESOURCE_NOT_FOUND");
  return;
}

// Server error — logged internally, generic message to client
this.exception.server("INTERNAL_PROCESSING_FAILED");
```

Error codes are plain strings. By convention they are `UPPER_SNAKE_CASE`.

---

## Step 7 — Test the Endpoint

Restart the server after adding new files:

```bash
pm2 restart drumee
```

Call the endpoint:

```bash
curl -X POST https://hostname/-/svc/mymodule.my_action \
  -H "Content-Type: application/json" \
  -H "Cookie: session_id=YOUR_SESSION" \
  -d '{"hub_id": "HUB_ID", "id": "some-id", "name": "test"}'
```

---

## Complete Example — Read and Write a Hub Setting

**ACL — `acl/settings.json`:**

```json
{
  "services": {
    "get": {
      "scope": "hub",
      "permission": { "src": "read" }
    },
    "update": {
      "scope": "hub",
      "permission": { "src": "admin" },
      "log": true
    }
  },
  "modules": {
    "private": "service/private/settings"
  }
}
```

**Implementation — `service/private/settings.js`:**

```js
const { Attr } = require("@drumee/server-essentials");
const { Entity } = require("@drumee/server-core");

class Settings extends Entity {
  async get() {
    const result = await this.db.await_proc("hub_settings_get");
    this.output.data(result);
  }

  async update() {
    const key = this.input.need(Attr.key);
    const value = this.input.need(Attr.value);

    const result = await this.db.await_proc("hub_settings_update", key, value);

    if (!result) {
      this.exception.user("SETTINGS_UPDATE_FAILED");
      return;
    }

    this.output.data(result);
  }
}

module.exports = Settings;
```

---

## Adding Documentation to the ACL

Once your service is working, document it by adding `doc`, `params`, `returns`, and `errors` fields to the ACL entry. These fields are **never read by the server** and have zero runtime effect — they power the auto-generated API reference only.

See [ACL Specification](../api-reference/acl-spec.md) for the full field reference.

---

# Part 2 — General Guide: Service Pattern in Drumee UI (Skeleton → Router)

This guide explains how **services** work in Drumee on the frontend — how to define them, call them, and handle them inside a widget.

> **Who is this for?** Anyone new to Drumee who wants to add new interactions or data-fetching to a widget.

---

## What is a Service?

In Drumee, a **service** is a named action — it can mean two things depending on context:

| Type            | What it does                                                          |
| --------------- | --------------------------------------------------------------------- |
| **UI service**  | Describes a user interaction (button click, page switch, form submit) |
| **API service** | Calls the backend to fetch or write data                              |

Both types are handled in the same place: `onUiEvent`.

---

## How a Service Flows

```
User clicks a button in a skeleton
  └── skeleton element has: service: "do-something", uiHandler: [ui]
        └── onUiEvent(cmd, args) is called on the widget
              └── switch (service) { case "do-something": ... }
                    └── optionally calls fetchService / postService
                          └── data comes back → update state → re-render
```

Everything starts from the skeleton, flows into `onUiEvent`, and ends with a UI update.

---

## Part 1 — Triggering a Service from a Skeleton

To make any element trigger a service when clicked, add two props:

```js
Skeletons.Button.Svg({
  className: `${fig}__my-button`,
  service: "do-something", // ← the service name
  uiHandler: [ui], // ← tells Drumee which widget handles it
});
```

> **Convention:** Service names use `kebab-case` (e.g. `"load-page"`).

---

## Part 2 — Handling Services in `onUiEvent`

All services arrive at `onUiEvent`. Read the service name from `args` or `cmd`, then use a `switch` to handle each case:

```js
async onUiEvent(cmd, args = {}) {
  const service = args.service || cmd.get(_a.service);

  switch (service) {

    case "do-something":
      // handle it here
      break;

    case "close-overlay":
      this.goodbye();
      break;

  }
}
```

---

## Part 4 — Calling the API

### fetchService — read data (GET)

```js
async getMyData() {
  const hub_id = this.getHubId(); // always get required IDs first
  const uid = Visitor.id;
  if (!hub_id) return;            // guard: don't call if not ready

  try {
    const data = await this.fetchService({
      service: SERVICE.my_module.get_data,  // ← registered service key
      hub_id,
      uid,
    });
    return data;
  } catch (e) {
    this.warn("[my-widget] getMyData failed", e);
    throw e;
  }
}
```

### postService — write data (POST)

```js
async saveMyData(payload) {
  const hub_id = this.getHubId();
  const uid = Visitor.id;
  if (!hub_id) return;

  try {
    const data = await this.postService(SERVICE.my_module.save_data, {
      hub_id,
      uid,
      ...payload,
    });
    return data;
  } catch (e) {
    this.warn("[my-widget] saveMyData failed", e);
    throw e;
  }
}
```

> **Rule:** Use `fetchService` for reads, `postService` for writes/mutations. Always guard with required IDs before calling.

---

## Part 5 — Registering Service Constants

Service keys live in a shared constants file. Add your module's keys before using them:

```js
SERVICE.my_module = {
  get_data: "my_module.get_data",
  save_data: "my_module.save_data",
  delete_item: "my_module.delete_item",
};
```

> **Convention:** Module and action names use `snake_case`. The string value mirrors the key path: `"module.action"`.

---

## Service Decision Map

```
User action needed?
  ├── Just UI change (no API)   → handle directly in switch case
  │
  ├── Read from server           → fetchService → cache → re-render
  │
  └── Write to server            → postService → optimistic UI → refresh
```

---

## Quick Reference

| Task                            | How                                                      |
| ------------------------------- | -------------------------------------------------------- |
| Trigger a service from skeleton | `service: "name"` + `uiHandler: [ui]`                    |
| Read service name in handler    | `args.service \|\| cmd.get(_a.service)`                  |
| Read a param from skeleton      | `args.my_param \|\| cmd.mget("my_param")`                |
| Fetch data (read)               | `this.fetchService({ service: SERVICE.x.y, ...params })` |
| Post data (write)               | `this.postService(SERVICE.x.y, { ...params })`           |
| Broadcast data loaded           | `this.triggerHandlers({ service: "data-loaded", data })` |
| Show a toast message            | `this.ensurePart("ack-clipboard").then(...)`             |
| Patch one UI part               | `this.ensurePart("pn").then(p => p.feed(...))`           |
| Switch full skeleton            | `this.feed(require("./skeleton/other").default(this))`   |
| Close widget                    | `this.goodbye()`                                         |

---

## Checklist

- [ ] Skeleton element has `service: "name"` and `uiHandler: [ui]`
- [ ] `onUiEvent` reads service via `args.service || cmd.get(_a.service)`
- [ ] Each case in the switch handles exactly one action
- [ ] API methods guard with required IDs before calling (`if (!hub_id) return`)
- [ ] All API calls are wrapped in `try/catch`
- [ ] Loaded data is cached in `this._*` to avoid re-fetching
- [ ] Optimistic UI (loading state) is set before the API call completes
- [ ] UI is patched with `ensurePart` for small updates, `this.feed` for full re-renders
- [ ] Service constants are registered in `SERVICE.my_module = { ... }`
