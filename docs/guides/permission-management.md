---
sidebar_position: 3
title: Permission Management
description: How to configure and reason about permissions in Drumee ACL files
---

# Permission Management

Drumee's permission system is declared in ACL JSON files inside the `server-team` repository. Every service endpoint has an explicit permission requirement. The server evaluates that requirement on every request before dispatching to the service method.

This guide explains how the permission fields work and how to configure them correctly when adding or reviewing service endpoints.

---

## How a Request is Evaluated

When a client calls a service, the server performs the following checks in order:

```
1. Parse module.method from the request
2. Authenticate the session
3. Load the matching ACL JSON file
4. Read the service entry for the requested method
5. Evaluate scope — does the session context match?
6. Evaluate permission.src — does the caller hold sufficient privilege?
7. Run fast_check if present — additional node-level check
8. Dispatch to the service method
```

Any failure in steps 5–7 returns a 403 response before the service code executes.

---

## The `scope` Field

`scope` defines the session context required to call the service.

```json
"scope": "hub"
```

| Value | Meaning |
|---|---|
| `"hub"` | Caller must be authenticated and operating within a hub context |
| `"domain"` | Caller must be a domain-level administrator |
| `"public"` | No authentication required; accessible to any caller |

The vast majority of services use `"hub"`. Use `"domain"` only for platform administration endpoints. `"public"` is reserved for endpoints like OAuth callbacks and token-based file access where session authentication is impossible or not applicable.

---

## The `permission.src` Field

`permission.src` sets the minimum privilege level the caller must hold within the hub.

```json
"permission": {
  "src": "write"
}
```

| Value | Who can call |
|---|---|
| `"anonymous"` | Any caller, including unauthenticated guests |
| `"read"` | Any authenticated member with read access to the hub |
| `"write"` | Authenticated member with write access |
| `"admin"` | Hub administrator or domain administrator |
| `"owner"` | The hub owner only |
| `"delete"` | Member with explicit delete privilege (used for destructive admin operations) |

Privilege levels are hierarchical: a caller with `"owner"` access satisfies any lower requirement. A caller with `"write"` access cannot call services requiring `"owner"`.

### Choosing the right level

- **`"read"`** — use for any query that returns data without side effects: listing items, getting details, searching.
- **`"write"`** — use for any mutation that a regular member should be able to perform: creating, editing, uploading.
- **`"owner"`** — use for operations that affect the hub configuration or other members: inviting users, changing settings, deleting the hub.
- **`"admin"`** — use for cross-hub or platform-level operations.
- **`"anonymous"`** — use only for publicly accessible endpoints. Treat with care: no session means no audit trail.

---

## The `permission.fast_check` Field

`fast_check` triggers an additional runtime check beyond the hub-level privilege. It is optional.

```json
"permission": {
  "src": "read",
  "fast_check": "user_permission"
}
```

| Value | Behaviour |
|---|---|
| `"user_permission"` | Before dispatching, verifies the caller holds the required privilege on the specific MFS node being accessed, not just on the hub in general. Used for services that operate on individual files or folders where node-level ACL may differ from hub-level ACL. |
| `"public-api"` | Allows the service to be called without a full authenticated session, relying on token-based or guest access instead. |

`fast_check` is read by the server core — do not add arbitrary values.

---

## The `preproc` Field

`preproc` identifies a pre-processing hook that runs before the service method. It is optional and primarily used for file upload handling.

```json
"preproc": {
  "checker": "upload"
}
```

The `checker` value maps to a handler registered in the server core. Do not introduce new `checker` values without confirming they are registered.

---

## The `log` Field

When `true`, the service invocation is written to the audit log.

```json
"log": true
```

Enable logging on write operations that should be traceable: file creation, deletion, sending messages, modifying memberships. Query-only services typically do not need logging.

---

## The `method` Field

`method` maps the ACL service name to a different JavaScript method name in the implementation class.

```json
"show_tag_by": {
  "scope": "hub",
  "permission": { "src": "owner" },
  "method": "tag_get_next"
}
```

The client calls `tagcontact.show_tag_by`. The server dispatches to the `tag_get_next()` method on the service class. If `method` is absent, the service name and method name are identical.

Use `method` when a public-facing endpoint name needs to differ from the internal implementation name. Do not use it to create undocumented aliases.

---

## Adding a New Service Endpoint

When adding a new service to an existing ACL file, follow this checklist:

**1. Add only runtime fields — do not add documentation fields manually.** Documentation fields (`doc`, `params`, `returns`, `errors`) are added through the dedicated ACL enhancement process, not during feature development.

**2. Preserve all existing entries exactly.** ACL files are additive: never remove or modify an existing service entry. If a service is no longer needed, leave the entry in place and discuss removal with the team lead.

**3. Select the minimum necessary privilege.** Never use `"owner"` when `"write"` is sufficient. Overly restrictive permissions break legitimate use cases.

**4. Confirm the method exists in the implementation file.** The service name in the ACL must correspond either to a method of the same name, or to the method named in the `method` field. A mismatch will cause a runtime 404.

**5. Match the `modules` path to the correct service file.** The `modules.private` and `modules.public` values identify which JavaScript file implements the service class. They must point to existing files.

### Minimal valid service entry

```json
"my_new_service": {
  "scope": "hub",
  "permission": {
    "src": "write"
  }
}
```

### Service entry with all optional runtime fields

```json
"upload_file": {
  "scope": "hub",
  "permission": {
    "src": "write",
    "fast_check": "user_permission",
    "preproc": {
      "checker": "upload"
    }
  },
  "log": true,
  "method": "upload_file_impl"
}
```

---

## Common Mistakes

### Setting `scope: "public"` unintentionally

`"public"` bypasses session authentication entirely. If your service reads or writes user data, it must not be `"public"`. Only use `"public"` for endpoints that are explicitly designed for unauthenticated access.

### Using `"owner"` for read operations

Read services do not need owner-level access. Setting `"src": "owner"` on a listing or detail endpoint prevents regular hub members from calling it, which is almost never the intended behaviour.

### Modifying existing runtime fields

Runtime fields (`scope`, `permission`, `method`, `log`, `preproc`, `modules`) must not be changed on a deployed service without coordinating with the team lead. Changing `permission.src` on an existing endpoint is a breaking change for any client currently calling it.

### Adding documentation fields during feature work

The `doc`, `params`, `returns`, and `errors` fields are managed through a separate enhancement process. Do not add them manually during feature development — they will be handled systematically.

---

## See Also

- [ACL System Concepts](../concepts/acl-system.md) — bitwise permission model and architecture overview
- [ACL Field Specification](../api-reference/acl-spec.md) — complete field reference for ACL JSON files
- [Creating a Service](./creating-service.md) — step-by-step guide to implementing a new backend service