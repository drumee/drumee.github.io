---
id: 02-acl-system
title: ACL System
slug: /technology/02-acl-system
---

# ACL System

Drumee's ACL system is a **bitwise, Linux-inspired permission model** that controls access to every backend service. Each service is declared in a JSON configuration file. The server reads this configuration on every request and either dispatches to the service method or returns a 403 — before any service code runs.

## How a Request Is Evaluated

```text
Frontend Request
│
▼ Parse module.method
│
▼ Session Authentication
│
▼ Load ACL JSON for module
│
▼ Get required permission (permission.src)
│
▼ Check caller's privilege level
│
├── Privilege >= Required? → Execute Service → Return Result
│
└── No → 403 Forbidden
```


The check happens before any service code executes. A service implementation can assume the caller is already authorised — there are no permission checks inside service methods. As a result, service code remains cleaner, execution is safer, and performance is more efficient.

## Permission Levels

Drumee uses a **numeric (bitwise)privilege model**. One bit represents a particular permission. Taken together, the bits represent privileges. 

| Level | Value | Description |
| :---- | :---- | :---- |
| anonymous | 1 | No authentication required. Open to any request. |
| read | 2 | Authenticated user with  read access. |
| write | 4 | Authenticated user with write access. |
| admin | 8 | Workspace or Organization administrator. |
| owner | 16 | The resource owner. Highest privilege level. |


Example: to write into a file, the user must request the permission 4 (0b00100).  
If the granted privilege is read only 3 (anonymous + read, i.e 0b00011) the request is rejected.

A caller with the owner privilege (0b11111, i.e 31)) satisfies any permission requirement. A caller with write privilege (0b00111, i.e 7) cannot call services requiring admin permission (8) or owner (16).

## Scope Types

The scope field in an ACL entry defines the session context required.

| Scope | Description |
| :---- | :---- |
| hub | Requires an active Workspace context. The request must be routed to a Hub endpoint. |
| domain | Requires Organization-level authentication. Used for organisation-wide operations. |
| public | Authorize the request with minimal check |


The vast majority of services use hub. Some use public only for endpoints explicitly designed for unauthenticated access — there is no audit trail for anonymous calls.

## ACL JSON Structure

Each module has a corresponding JSON file in the acl/ directory. The file declares every service the module exposes, its permission requirements, and the implementation path.

```json
{
  "services": {
    "service_name": {
      "scope": "hub",
      "permission": {
        "src": "write"
      },
      "log": true
    }
  },
  "modules": {
    "private": "service/private/module_name"
  }
}
```

### Fields Reference

| Field | Required | Description |
| :---- | :---- | :---- |
| scope | Yes | Access context: hub, domain, or public |
| permission.src | Yes | Minimum privilege level required |
| permission.fast_check | No | Additional runtime check before execution (e.g. user_permission, public-api) |
| method | No | Maps the service name to a differently named JavaScript method |
| log | No | When true, the service call is written to the audit log |
| preproc | No | Pre-processing config (e.g. file upload handling: `{"checker": "upload"}`) |
| modules.private | No | Path to the private (authenticated) service implementation |
| modules.public | No | Path to the public (unauthenticated) service implementation |

## Choosing the Right Permission Level

| You want... | Use |
| :---- | :---- |
| Any authenticated user to call it | read |
| Only users who can edit content | write |
| Only hub administrators | admin |
| Only the resource owner | owner |
| No authentication at all | anonymous  |


Use the minimum necessary privilege. Never use owner when write is sufficient.

## The `fast_check` Mechanism

Some services require a contextual check beyond the static permission level.

| Value | Behaviour |
| :---- | :---- |
| user_permission | Verifies the user holds the required privilege on the specific MFS node being accessed — not just on the Hub in general. Used for services that operate on individual files or folders. |
| public-api | Allows the service to be called without a full authenticated session, for token-based or guest access. |

```json
"permission": { "src": "read", "fast_check": "user_permission" }
```

## Method Aliases

When the ACL service name differs from the JavaScript method name, use the method field:

```
"show_tag_by": { "scope": "hub", "permission": { "src": "owner" }, "method": "tag_get_next" }
```

The client calls tagcontact.show_tag_by. The server dispatches to the tag_get_next() method.

## Service Endpoint Pattern

All backend services are accessed through a single entry point. There are no hard-coded routes.

```bash
# Authenticated (hub-scoped) services https://hostname/-/svc/module.method
# Public services (scope: "public") https://hostname/-/api/module.method
```


## Adding a New Service

Two steps only — no route registration, no middleware wiring.

**1. Implement the method in the service directory:**

```javascript
// service/private/mymodule.js
async my_action() {
  const id = this.input.need('id');
  const result = await this.db.await_proc('my_proc', id);
  this.output.data(result);
}
```


**2. Declare it in the ACL file:**

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

→ [Checkout request life cycle](06-request-pipeline.md)

## Security Properties

* **No implicit access.** A method with no ACL entry is unreachable from the network, regardless of whether it exists in the service file.  
* **Permission enforced before execution.** The server checks the ACL before calling any service method — the implementation can assume the caller is already authorised.  
* **No bypass via application code.** Enforcement happens at the server routing layer before the service class is instantiated. There is no code path that skips the permission check.  
* **Audit trail.** When "log": true is set, every invocation is recorded with caller identity, timestamp, and result. Enable on all write operations.

