---
id: 05-error-handling
title: Error Handling
slug: /product-guides/05-error-handling
sidebar_position: 5
description: How Drumee backend services raise, declare, and return errors
---

# Error Handling

Drumee backend services signal failures by raising a **user error** from the service
implementation. The server catches it, maps it to an HTTP status, and returns a
structured error response to the client.

## Raising an error

Inside a service method, raise an error with `this.exception.user()`:

```js
this.exception.user('PERMISSION_DENIED');
```

The string passed to `this.exception.user()` is the **error code**. It must match the
code declared in the module's ACL file exactly — including any intentional typos present
in the source — because clients key off that exact string.

## Declaring errors in the ACL

Each service entry in an ACL JSON file (`server-team/acl/<module>.json`) may declare the
errors it can raise in an `errors` array. Every entry has three fields:

```json
"errors": [
  { "code": "INSUFFICIENT_STORAGE", "message": "Not enough storage quota", "http_status": 507 },
  { "code": "PERMISSION_DENIED",    "message": "No write permission on destination folder", "http_status": 403 }
]
```

| Field | Description |
|-------|-------------|
| `code` | The exact error code string raised via `this.exception.user('CODE')` |
| `message` | Human-readable explanation of the failure |
| `http_status` | The HTTP status code returned to the client |

The `errors` array is **documentation-only** metadata: adding or editing it is safe and
does not require a server restart. It is surfaced per service in the
[Backend SDK reference](../api-reference/backend-sdk/index.md) under each method's
**Possible Errors** table.

## Common status codes

| HTTP status | Typical meaning |
|-------------|-----------------|
| `400` | Invalid or missing parameters |
| `403` | Caller lacks the required permission (see [Configuring ACL Permissions](./04-acl-permissions.md)) |
| `404` | Target node or resource does not exist |
| `507` | Storage quota exceeded |

## See Also

- [ACL Field Specification](../api-reference/acl-spec.md) — the full `errors` field reference
- [Configuring ACL Permissions](./04-acl-permissions.md) — how permission checks produce `403` errors
- [Backend SDK Reference](../api-reference/backend-sdk/index.md) — per-method error tables
