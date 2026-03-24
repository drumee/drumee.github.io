---
sidebar_position: 3
title: Stored Procedures Reference
description: Calling conventions, database naming, and reference for Drumee stored procedures
---

# Stored Procedures Reference

Drumee enforces a strict policy: **all database operations must go through stored procedures**. Direct SQL queries from application code are not permitted. This ensures every query is auditable, consistently parameterised, and deployable as a versioned unit.

Stored procedures live in the `schemas` project repository, organised by category under `hub/procedures/`, `drumate/procedures/`, and `yp/procedures/`.

---

## Calling Conventions

The server exposes two async helpers for invoking stored procedures and functions from service code.

### `await_proc(name, ...args)`

Calls a stored procedure in the current hub database context.

```js
const result = await this.db.await_proc('hub_get_members_by_type', this.uid, 'all', 1);
```

For procedures that live in the global Yellow Pages (`yp`) database:

```js
const user = await this.yp.await_proc('drumate_exists', email);
```

### `await_func(name, ...args)`

Calls a stored function (returns a scalar value rather than a result set).

```js
const dbName = await this.yp.await_func('get_db_name', hub_id);
```

Use `await_func` when the database object is a `FUNCTION` (not a `PROCEDURE`) and you need a single return value.

### Passing objects and arrays

When an argument is a JavaScript object or array, pass it directly. The database API handles serialisation automatically — do not call `JSON.stringify` manually.

```js
// Correct — pass the object directly
await this.db.await_proc('contact_update', contact_id, { email, mobile, address });

// Incorrect — unnecessary manual serialisation
await this.db.await_proc('contact_update', contact_id, JSON.stringify({ email, mobile, address }));
```

This applies to both `await_proc` and `await_func`.

---

## Database Naming Conventions

Understanding which database a procedure runs against is critical to calling it correctly.

| Database type | Naming pattern | Example | Used for |
|---|---|---|---|
| Hub database | No prefix, UUID-derived | `ab12cd34ef56` | Shared workspace data: media, members, permissions |
| User database | `9_` prefix + UUID | `9_ab12cd34ef56` | Personal data: contacts, tags, activity |
| Yellow Pages | `yp` (fixed) | `yp` | Platform-wide registry: entities, sessions, system config |

Always resolve a hub's `db_name` explicitly before calling hub-scoped procedures:

```js
const dbName = await this.yp.await_func('get_db_name', hub_id);
if (!dbName) throw new Error(`Unknown hub: ${hub_id}`);
await this.yp.await_proc(`${dbName}.some_procedure`, arg1, arg2);
```

---

## Deprecated Pattern

### `forward_proc` — deprecated

Earlier service code used `forward_proc` to route a procedure call into another entity's database:

```js
// Deprecated — do not use in new code
await this.yp.await_proc('forward_proc', entity_id, 'procedure_name', `'arg1','arg2'`);
```

This pattern is **deprecated** per Somanos's architectural guideline. It was replaced by the explicit `get_db_name` + direct call approach shown above, which is safer, more readable, and avoids the string-interpolation pitfalls of building argument lists manually.

Use `forward_proc` only when maintaining existing code that already uses it; do not introduce it in new services.

---

## Utility Procedures

### `pageToLimits(page, OUT offset, OUT range)`

Converts a 1-based page number into SQL `LIMIT` and `OFFSET` values. Called internally by any paginated procedure.

```sql
CALL pageToLimits(_page, _offset, _range);
-- ...
SELECT ... LIMIT _offset, _range;
```

All procedures that accept a `_page INT` parameter call this utility to normalise pagination.

---

## Tag Procedures

These procedures run in the **user database** (`9_xxx` prefix). They manage the tag taxonomy and tag-to-entity assignments belonging to a single user.

### `tag_add(name, description)`

Creates a new root-level tag.

| Parameter | Type | Description |
|---|---|---|
| `name` | `VARCHAR` | Tag display name |
| `description` | `VARCHAR` | Optional description, pass empty string if unused |

Returns: inserted tag row.

---

### `tag_get(tag_id)`

Retrieves a single tag by ID. Used for pre-validation before rename or assign operations.

| Parameter | Type | Description |
|---|---|---|
| `tag_id` | `VARCHAR(16)` | Tag identifier |

Returns: tag row, or empty set if not found.

---

### `tag_get_next(key, search, order, page)`

Returns a paginated list of root-level tags with unread room counts.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `key` | `VARCHAR(50)` | `''` | Filter by tag_id; empty string returns all root tags |
| `search` | `VARCHAR(255)` | `''` | Name search filter |
| `order` | `VARCHAR(20)` | `'desc'` | Sort order: `'asc'` or `'desc'` by position |
| `page` | `INT` | `1` | 1-based page number |

Returns: rows with `tag_id`, `parent_tag_id`, `name`, `is_any_child`, `position`, `room_count`.

---

### `tag_remove(tag_id)`

Removes a tag and cascades deletion of all entity assignments for that tag. Handled entirely within the stored procedure — no application-level cleanup required.

| Parameter | Type | Description |
|---|---|---|
| `tag_id` | `VARCHAR(16)` | Tag to remove |

---

### `tag_rename(tag_id, name)`

Renames an existing tag. The calling service validates tag existence via `tag_get` before invoking this procedure.

| Parameter | Type | Description |
|---|---|---|
| `tag_id` | `VARCHAR(16)` | Tag to rename |
| `name` | `VARCHAR` | New display name |

---

### `tag_reposition(content)`

Reorders tags according to a JSON-encoded position map. The `content` argument is serialised to a JSON string by the caller before being passed to the procedure.

| Parameter | Type | Description |
|---|---|---|
| `content` | `JSON` | Position map: object or array describing new ordering |

---

## Hub Member Procedures

These procedures run in the **hub database** (no prefix).

### `hub_get_members_by_type(uid, member_type, page)`

Returns a paginated list of hub members filtered by membership type.

| Parameter | Type | Values | Description |
|---|---|---|---|
| `uid` | `VARCHAR(16)` | — | Requesting user ID |
| `member_type` | `ENUM` | `'all'`, `'owner'`, `'not_owner'`, `'admin'`, `'other'` | Member category filter |
| `page` | `INT` | 1-based | Page number |

---

## Statistics Procedures

These procedures run in the **user database** (`9_xxx` prefix). They are used by the reward-hub verification system to count a user's content.

### `count_media(in JSON)`

Counts active media files owned by the user across all hubs.

```json
{ "uid": "abc123" }
```

Returns: `{ cnt: N }`.

---

### `count_folders(in JSON)`

Counts active folder nodes owned by the user across all hubs. Uses `category = 'folder'` (not `mimetype`) as the authoritative identifier.

```json
{ "uid": "abc123" }
```

Returns: `{ cnt: N }`.

---

## Contact Procedures

These procedures run in the **user database** (`9_xxx` prefix).

### `my_contact_show_next(...)`

Returns a paginated contact list for the current user. Supports filtering, search, and tag-based grouping. Parameters vary by invocation context — refer to `drumate/procedures/contact/my_contact_show_next.sql` for the full signature.

---

## YP (Yellow Pages) Procedures

These procedures run in the **`yp` database** and are called via `this.yp.await_proc(...)`.

### `drumate_exists(email)`

Looks up a registered user by email address.

| Parameter | Type | Description |
|---|---|---|
| `email` | `VARCHAR` | Email to look up |

Returns: user row with `id`, or empty set if no account exists.

---

### `get_db_name(hub_id)` *(function)*

Returns the `db_name` for a hub. Called via `await_func`, not `await_proc`.

```js
const dbName = await this.yp.await_func('get_db_name', hub_id);
```

Returns: `VARCHAR` db_name, or `NULL` if the hub does not exist.

---

## Deployment

Stored procedures are deployed via the `schemas` project. They are never altered directly in production — changes are always shipped through the patch system.

Files in `schemas` follow this directory structure:

```
schemas/
  hub/procedures/
    members/
      hub_get_members_by_type.sql
    stats/
      count_media.sql
      count_folders.sql
  drumate/procedures/
    contact/
      my_contact_show_next.sql
    tag/
      tag_get_next.sql
      tag_get.sql
      tag_add.sql
      ...
  yp/procedures/
    ...
```

Each `.sql` file uses `DROP PROCEDURE IF EXISTS` followed by `CREATE PROCEDURE`, making deployments idempotent.