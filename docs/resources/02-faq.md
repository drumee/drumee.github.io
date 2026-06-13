---
id: 02-faq
title: FAQ
slug: /resources/02-faq
sidebar_position: 2
description: Frequently asked questions about Drumee backend development
---

# Frequently Asked Questions

Common questions from backend development, sourced from real incidents and confirmed answers.

---

## ACL and Permissions

### What is the difference between `scope`, `permission.src`, and `fast_check`?

These three ACL fields control access at different levels.

`scope` determines **which context** the request must come from:

| Value | Meaning |
|-------|---------|
| `"hub"` | Request must include a valid hub context; user must be authenticated |
| `"domain"` | Request must include a valid domain context; user must be authenticated |
| `"public"` | No authentication required; accessible by anyone |
| `"plateform"` | Platform-level admin operations |

`permission.src` determines the **minimum hub membership level** the caller must hold:

| Value | Numeric level |
|-------|--------------|
| `"anonymous"` | 0 — no membership required |
| `"read"` | 2 — read-only member |
| `"write"` | 4 — full member |
| `"admin"` | 6 — hub administrator |
| `"owner"` | 7 — hub owner |

`fast_check` adds an **additional node-level access check**:

| Value | Meaning |
|-------|---------|
| `"user_permission"` | Verify the caller's permission on the specific MFS node, not just the hub |
| `"public-api"` | Skip session validation; allow unauthenticated access for this endpoint |

---

### When to use `scope: "hub"` versus `scope: "domain"`?

Use `scope: "hub"` when the operation is performed within a single hub context — for example, reading files, posting to chat, or managing hub members.

Use `scope: "domain"` when the operation spans an organisation and requires the caller to be authenticated as a domain member — for example, listing colleagues or searching across an organisation's hubs.

Use `scope: "public"` only for operations that must work without any session, such as login endpoints, public asset delivery, or webhook receivers (for example, Stripe callbacks).

---

### What does `fast_check: "public-api"` do?

When set, the ACL evaluator skips session validation entirely for that endpoint. This is used for services that must be accessible by unauthenticated callers — for example, `bootstrap` initialization endpoints and OAuth callback handlers. Do not apply it to services that read or modify user data.

---

### Can we add `doc`, `params`, `returns`, or `errors` fields to an ACL file in feature work?

No. The documentation fields (`doc`, `params`, `returns`, `errors`) are intended for documentation tooling only and are applied as part of the dedicated ACL documentation process. In regular feature work, only modify runtime fields: `scope`, `permission`, `method`, `log`, `preproc`, `modules`. Adding documentation fields in feature branches creates unnecessary diff noise and may conflict with the documentation process.


---

## Database and Stored Procedures

### When to use `this.db` versus `this.yp`?

- `this.db` — executes against the **current hub's database** (the database associated with the hub in the current request context). Use this for operations on hub content: files, messages, members, tags.
- `this.yp` — executes against the **Yellow Pages (YP) platform database**. Use this for cross-hub operations: looking up users, resolving database names, checking session state, managing share guests.

---

### What is the difference between `await_proc` and `await_func`?

- `await_proc(name, ...args)` — calls a **stored procedure**. Procedures do not return a value via RETURN; they produce a result set.
- `await_func(name, ...args)` — calls a **stored function**. Functions return a single scalar or JSON value via RETURN.

Example:

```js
// Stored procedure — returns a result set
const rows = await this.yp.await_proc('drumate_exists', email);

// Stored function — returns a single value
const dbName = await this.yp.await_func('get_db_name', hub_id);
```

---

### Do we need to call `JSON.stringify` before passing an object to `await_proc`?

No. Pass JavaScript objects and arrays directly. The API serialises them automatically. Calling `JSON.stringify` manually causes double-serialisation and stores incorrect data in the database.

```js
// Incorrect — double-serialises
await this.db.await_proc('contact_update', id, JSON.stringify({ email, mobile }));

// Correct — pass directly
await this.db.await_proc('contact_update', id, { email, mobile });
```

---

### Is `forward_proc` still supported?

No. `forward_proc` is **deprecated** and must not be used in new code. It was fragile because it depended on an implicit database name resolution that is no longer reliable.

Use the explicit pattern instead:

```js
// Deprecated — do not use
await this.yp.await_proc('forward_proc', hub_id, 'my_proc', `'${arg1}','${arg2}'`);

// Current pattern
const dbName = await this.yp.await_func('get_db_name', hub_id);
await this.yp.await_proc(`${dbName}.my_proc`, arg1, arg2);
```

---

### How does Drumee database naming work?

| Database type | Naming convention | Access via |
|---------------|-------------------|------------|
| Hub database | `<x>_<id>` — single bucket char + 16-hex id (e.g. `9_a1b2c3d4e5f60718`) | `this.db` or explicit `get_db_name` |
| User (drumate) database | Same `<x>_<id>` scheme as hubs — the leading prefix is **not** a type marker | Explicit resolution |
| Yellow Pages | Fixed name: `yp` | `this.yp` |

The leading `<x>_` is a meaningless bucketing prefix (one of 16 hex characters), **not** an indicator of database type — `9_` does not mean "user". See [Database Naming Conventions](../api-reference/stored-procedures.md#database-naming-conventions) for details.


---

### Should we use `category` or `mimetype` to identify folder nodes?

Always use `category`. The `mimetype` field is a legacy pattern that is unreliable for node type identification in MFS. The authoritative field is `category`.

```sql
-- Legacy — unreliable
WHERE mimetype = 'folder'

-- Correct
WHERE category = 'folder'
```

---

## Service Development

### Where does a new service method get routed?

The URL pattern is:

```
https://hostname/-/svc/module.method
```

The router reads the ACL for `module`, checks `scope` and `permission`, then loads either `modules.private` or `modules.public` depending on whether the request carries a valid session. It then calls the method named `method` on the loaded class (or the alias defined in the `method` ACL field if present).

---

### When should we set `"log": true` in an ACL entry?

Set `log: true` for operations that have audit significance: invitations sent, permission changes, content deletion, and similar events that should appear in the activity log. Do not log routine read operations — this generates unnecessary volume in the activity table.

---

### How to read configuration values at runtime?

Use `Cache.getSysConf()` to access non-sensitive configuration stored in `yp.sys_conf`. For sensitive credentials (API keys, secrets, tokens), store them in `/etc/drumee/credentials/` and read from the filesystem. Do not store credentials in `.env` files or in the repository.

```js
const { Cache } = require('@drumee/server-core');
const conf = Cache.getSysConf();
const maxUpload = conf.max_upload_size;
```

---

### What is the difference between `free` and `paid` users in the contact system?

Free users (`domain_id = 1`) can only see contacts they have explicitly saved in their personal contact table (`drumate.contact`).

Paid users (`domain_id > 1`, belonging to an organisation) see their saved contacts plus a UNION of colleagues from the same domain. When a paid user modifies a contact that was provided by the organisation, the change is copied into their personal `drumate.contact` table rather than modifying the shared record.

The stored procedures `my_contact_show_next` and `tag_get_next` are used by both chat peer selection and the contact manager. The hub manager uses `my_contact` and `hub_get_members_by_type`.

---

## Plugins

### What is the plugin system and when to use it?

Drumee plugins allow you to add custom backend services without modifying the core server. A plugin is a separate Node.js package that registers its own ACL routes and service files under a custom endpoint prefix (e.g. `/-/<endpoint>/svc/`).

Use plugins for domain-specific extensions such as payment processing, third-party integrations, or client-specific features that do not belong in the core platform.

---

### What does `Acl.loadPlugins()` do?

`Acl.loadPlugins()` is called at server startup to discover and register all installed plugins. It reads each plugin's ACL definitions and mounts them alongside the core ACL routes. Plugins must export a valid ACL structure and a `modules` field pointing to their service files.

---

### Why does my plugin service return a 405 error?

A `WRONG_API` (405) error from a plugin usually means the `scope` in the plugin's ACL does not match the access pattern. Check:

- If the service is declared `scope: "public"` but is being accessed through a session-scoped URL, or vice versa.
- If the plugin endpoint prefix is correct in the server configuration.

---

## MariaDB Compatibility

### A `DELETE` statement that works in MariaDB 11.x but fails silently in 10.x. Why?

MariaDB 10.x does not support table alias syntax in `DELETE` statements. The alias syntax (`DELETE FROM table t WHERE t.id = ...`) was introduced in a later version. Always write portable `DELETE` statements without aliases:

```sql
-- Fails silently in MariaDB 10.x
DELETE FROM media m WHERE m.hub_id = _hub_id AND m.nid = _nid;

-- Works in both 10.x and 11.x
DELETE FROM media WHERE hub_id = _hub_id AND nid = _nid;
```

Always verify SQL syntax against the MariaDB version running on the target environment before deployment.

---

## See Also

- [Troubleshooting](./03-troubleshooting.md) — specific errors with step-by-step solutions
- [Glossary](./01-glossary.md) — definitions of Drumee-specific terms
- [ACL Specification](../api-reference/acl-spec.md) — complete ACL field reference
- [Configuring ACL Permissions](../product-guides/04-acl-permissions.md) — guide to choosing the right scope and permission level
- [Stored Procedures](../api-reference/stored-procedures.md) — calling conventions and procedure catalogue