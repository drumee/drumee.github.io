---
sidebar_position: 2
title: Playground
description: Try Drumee's service API without installing anything
---

# Playground

The Drumee playground lets you call live service endpoints and inspect responses without setting up a local environment. It is the fastest way to understand how the request-response model works before writing your first integration.

Sandbox: [https://drumee.in/-/#/sandbox](https://drumee.in/-/#/sandbox)

---

## How Drumee Services Work

Every Drumee service is reachable through a single endpoint path:

```
protocol://hostname/-/svc/module.method
```

There are no hard-coded routes in the backend. Each service is identified only by its `module.method` name. The server reads the ACL configuration for that service, checks the caller's session privilege, and dispatches to the implementation.

---

## Making Requests

### GET requests

Use GET for read-only queries. Arguments may be passed as a URL-encoded JSON object or as standard key-value pairs.

**Using curl:**

```bash
curl -X GET "https://endpoint.host/-/svc/mymodule.mymethod?myfield=myvalue&..."
```

**Using the Drumee SDK:**

```js
this.fetchService("mymodule.mymethod", { myfield: myvalue, ...mydata })
  .then((response_data) => { ... })
  .catch(() => {});
```

### POST / PUT / DELETE requests

Use POST (or PUT/DELETE) for operations with side effects. Arguments are sent as a JSON object or array in the request body.

**Using curl:**

```bash
curl -X POST https://endpoint.host/-/svc/mymodule.mymethod \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "myfield": "myvalue",
    ...
  }'
```

**Using the Drumee SDK:**

```js
this.postService("mymodule.mymethod", { myfield: myvalue, ...mydata })
  .then((response_data) => { ... })
  .catch(() => {});
```

---

## Request Context

Each service call is evaluated within a session context. The server attaches the following components to every request:

| Component | Role |
|---|---|
| `session` | Determines the privilege level granted to the incoming request |
| `acl` | Enforces fine-grained security checks per service |
| `input` | Parses and validates data sent by the caller |
| `output` | Formats and sends the response back as JSON |
| `exception` | Sends error details when the service fails or is denied |

A request is only dispatched to the service method if the caller's session privilege satisfies the `permission` requirement declared in the ACL file for that service.

---

## Trying an Endpoint in the Sandbox

1. Open [https://drumee.in/-/#/sandbox](https://drumee.in/-/#/sandbox)
2. Select a module and method from the list
3. Fill in any required parameters
4. Submit the request and inspect the JSON response

The sandbox runs against the live Drumee platform, so responses reflect real system state. Read-only operations (services with `permission.src: "read"`) can be called freely. Write operations require an authenticated session.

---

## See Also

- [ACL System](../concepts/acl-system.md) — how permission checks work
- [ACL Field Specification](../api-reference/acl-spec.md) — full reference for service permission fields
- [Backend SDK Reference](../api-reference/backend-sdk/index.md) — all available services grouped by module