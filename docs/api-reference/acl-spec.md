---
sidebar_position: 4
title: ACL Specification
description: Complete reference for the ACL JSON configuration format
---

# ACL JSON Specification

This page is the formal reference for the ACL JSON file format used in `server-team/acl/*.json`. Every backend service endpoint is declared through this format.

For a conceptual explanation of why the ACL system exists and how it works, see [ACL System](../concepts/acl-system).

---

## File Location and Naming

```
server-team/
└── acl/
    ├── mfs.json
    ├── media.json
    ├── hub.json
    └── ...
```

Each file corresponds to one module. The filename (without `.json`) is the module name used in service endpoint URLs: `/-/svc/{module}.{method}`.

---

## Top-Level Structure

```json
{
  "services": { },
  "modules":  { }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `services` | object | Yes | Map of service name to service configuration |
| `modules` | object | Conditional | Module file paths. Required when the module has service implementations. |

---

## `modules` Object

```json
"modules": {
  "private": "service/private/mymodule",
  "public":  "service/mymodule"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `private` | string | Relative path (without `.js`) to the authenticated service implementation class |
| `public` | string | Relative path (without `.js`) to the unauthenticated service implementation class |

Both `private` and `public` can point to the same file. At least one must be present when the module exposes service methods. If both are absent, the module has no callable services (e.g., `menu.json`, `ops.json`).

---

## `services` Object

Each key in `services` is the method name as it appears in the URL:

```
/-/svc/{filename_without_json}.{service_key}
```

```json
"services": {
  "my_action": {
    "scope":      "hub",
    "permission": { "src": "write" },
    "method":     "actual_method_name",
    "log":        true,
    "preproc":    { },
    "doc":        "...",
    "params":     { },
    "returns":    { },
    "errors":     [ ]
  }
}
```

---

## Runtime Fields

These fields are read by the server at request time. **Modifying them changes live behaviour.**

### `scope` *(required)*

Defines the execution context.

| Value | Description |
|-------|-------------|
| `"hub"` | Requires an active Hub context. The request must carry a `hub_id`. Most services use this scope. |
| `"domain"` | Requires domain-level authentication. Used for organisation-wide operations. |
| `"public"` | No Hub context required. Served via `/-/api/` instead of `/-/svc/`. |

```json
"scope": "hub"
```

---

### `permission` *(required)*

Defines the minimum privilege level required to call the service.

```json
"permission": {
  "src": "write"
}
```

#### `permission.src`

| Value | Numeric | Who can call |
|-------|---------|-------------|
| `"anonymous"` | 0 | Anyone, no authentication required |
| `"read"` | 2 | Any authenticated user with read access |
| `"write"` | 4 | Authenticated user with write access |
| `"admin"` | 6 | Hub or domain administrator |
| `"owner"` | 7 | The resource owner |

#### `permission.fast_check`

Optional. Triggers an additional runtime check before executing the service.

| Value | Behaviour |
|-------|-----------|
| `"user_permission"` | Verifies the caller holds the required privilege on the specific MFS node being accessed, in addition to the general Hub privilege |
| `"public-api"` | Allows the service to be called without a full authenticated session (guest or token-based access) |

```json
"permission": {
  "src": "read",
  "fast_check": "user_permission"
}
```

---

### `method` *(optional)*

Maps the ACL service name to a different JavaScript method name in the implementation class. Used when the public-facing endpoint name differs from the internal method name.

```json
"show_tag_by": {
  "scope": "hub",
  "permission": { "src": "owner" },
  "method": "tag_get_next"
}
```

The client calls `tagcontact.show_tag_by`. The server dispatches to the `tag_get_next()` method. If `method` is absent, the service name and method name are identical.

---

### `log` *(optional)*

When `true`, the service call is written to the audit log. Default is `false` (no logging).

```json
"log": true
```

Typically enabled on write operations that should be traceable (create, update, delete, send).

---

### `preproc` *(optional)*

Pre-processing configuration applied before the service method runs. Used for file upload handling and input validation.

```json
"preproc": {
  "checker": "upload"
}
```

The `checker` value identifies which pre-processor to invoke. Values are defined in the server core and are not configurable per-project.

---

## Documentation Fields

These fields are **never read by the server**. They exist solely to power the `generate-api-docs.js` script and have zero effect on runtime behaviour. They are safe to add or modify without restarting the server.

### `doc` *(documentation)*

A human-readable description of what the service does.

```json
"doc": "Create a new folder under the specified parent node."
```

Rules:
- Plain text only — no Markdown, no HTML
- No curly braces `{` `}` — they will cause Docusaurus MDX build failures
- Describe the behaviour, not the parameters (parameters have their own `description` field)

---

### `params` *(documentation)*

Describes the input parameters the service accepts.

```json
"params": {
  "name": {
    "type": "string",
    "required": true,
    "description": "Display name for the new folder"
  },
  "pid": {
    "type": "string",
    "required": true,
    "description": "Parent folder node ID"
  },
  "show": {
    "type": "integer",
    "required": false,
    "default": 1,
    "description": "Visibility flag. 1 = visible, 0 = hidden."
  }
}
```

#### Parameter Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Data type: `string`, `integer`, `number`, `boolean`, `array`, `object` |
| `required` | boolean | Whether the parameter is mandatory |
| `default` | any | Default value when the parameter is absent (only for optional parameters) |
| `description` | string | Plain-text description of the parameter |
| `items` | object | For `array` type — describes the array element structure |
| `properties` | object | For `object` type — describes the object's fields |
| `enum` | array | Allowed values |
| `min` / `max` | number | Numeric range constraints |
| `minLength` / `maxLength` | integer | String length constraints |
| `pattern` | string | Regex pattern constraint |

#### Array Parameter Example

```json
"emails": {
  "type": "array",
  "required": true,
  "description": "List of recipient email addresses",
  "items": {
    "type": "string",
    "description": "Email address"
  }
}
```

---

### `returns` *(documentation)*

Describes the structure of the successful response.

```json
"returns": {
  "type": "object",
  "description": "Created folder node",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique node ID"
    },
    "filename": {
      "type": "string",
      "description": "Internal filename"
    },
    "category": {
      "type": "string",
      "description": "Always 'folder' for folder nodes"
    }
  }
}
```

For services that return a list use `"type": "array"` with an `items` block:

```json
"returns": {
  "type": "array",
  "description": "List of nodes in the folder",
  "items": {
    "type": "object",
    "properties": {
      "id":       { "type": "string",  "description": "Node ID" },
      "filename": { "type": "string",  "description": "Filename" },
      "filesize": { "type": "integer", "description": "Size in bytes" }
    }
  }
}
```

For services that return a file stream use `"type": "file"`:

```json
"returns": {
  "type": "file",
  "description": "ZIP archive served as application/zip"
}
```

---

### `errors` *(documentation)*

Array of possible error conditions the service can produce.

```json
"errors": [
  {
    "code": "NODE_NOT_FOUND",
    "message": "No node found for the given nid"
  },
  {
    "code": "INVALID_PARENT",
    "message": "The target parent node does not exist or is not a folder"
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `code` | string | The exact error code string thrown by `this.exception.user('CODE')` |
| `message` | string | Human-readable description of when this error occurs |

**Important:** Error codes must match the string passed to `this.exception.user()` in the implementation exactly, including any intentional typos present in the source code.

---

## Complete Example

```json
{
  "services": {
    "create": {
      "doc": "Create a new folder node under the specified parent.",
      "scope": "hub",
      "permission": {
        "src": "write"
      },
      "log": true,
      "params": {
        "pid": {
          "type": "string",
          "required": true,
          "description": "Parent folder node ID"
        },
        "name": {
          "type": "string",
          "required": true,
          "description": "Display name for the new folder"
        },
        "show": {
          "type": "integer",
          "required": false,
          "default": 1,
          "description": "Visibility flag. 1 = visible, 0 = hidden."
        }
      },
      "returns": {
        "type": "object",
        "description": "Newly created folder node",
        "properties": {
          "id":       { "type": "string",  "description": "Unique node ID" },
          "filename": { "type": "string",  "description": "Internal filename" },
          "category": { "type": "string",  "description": "Always 'folder'" }
        }
      },
      "errors": [
        {
          "code": "PARENT_NOT_FOUND",
          "message": "The specified parent node does not exist"
        }
      ]
    },
    "list": {
      "doc": "List all nodes inside a folder.",
      "scope": "hub",
      "permission": {
        "src": "read",
        "fast_check": "user_permission"
      },
      "params": {
        "nid": {
          "type": "string",
          "required": true,
          "description": "Folder node ID to list"
        }
      },
      "returns": {
        "type": "array",
        "description": "Child nodes of the folder",
        "items": {
          "type": "object",
          "properties": {
            "id":       { "type": "string",  "description": "Node ID" },
            "filename": { "type": "string",  "description": "Filename" },
            "category": { "type": "string",  "description": "Node category" },
            "filesize": { "type": "integer", "description": "Size in bytes" }
          }
        }
      },
      "errors": [
        {
          "code": "NODE_NOT_FOUND",
          "message": "No node found for the given nid"
        }
      ]
    }
  },
  "modules": {
    "private": "service/private/mymodule"
  }
}
```

---

## Validation Rules Summary

| Rule | Details |
|------|---------|
| No duplicate keys | JavaScript `JSON.parse()` silently drops all but the last occurrence of a duplicate key, losing documentation fields |
| No curly braces in string values | Docusaurus/MDX interprets `{` and `}` as JSX — use plain alternatives |
| Runtime fields must not be modified without testing | Changes to `scope`, `permission`, `method`, `log`, `preproc` affect live behaviour |
| Documentation fields are additive only | `doc`, `params`, `returns`, `errors` are safe to add or modify without restart |
| Error codes must match source exactly | Including any intentional typos in the codebase |

---

## Related Topics

- [ACL System](../concepts/acl-system) — Conceptual explanation of the permission model
- [Creating a Service](../guides/creating-service) — Step-by-step guide to adding a new service
- [Backend SDK Reference](../api-reference/backend-sdk/index) — All existing service endpoints