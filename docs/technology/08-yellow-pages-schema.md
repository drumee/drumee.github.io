---
id: 08-yellow-pages-schema
title: Yellow Pages Schema — the Entity Model
slug: /technology/yellow-pages-schema
sidebar_position: 9
description: The core tables of the central Yellow Pages (yp) database — how vhost, domain, entity, drumate, hub, organisation, and privilege model tenants, users, workspaces, and hostname routing.
---

# Yellow Pages Schema — the Entity Model

The **Yellow Pages** (`yp`) database is the central registry of a Drumee installation. While
each user and workspace lives in [its own sharded database](./07-database-sharding.md), `yp`
is the single directory that answers *"what exists, who owns it, which host serves it, and
what is this hostname?"* — the map every request is resolved against before dispatch.

This page describes the core tables of that registry and how they fit together.

:::info Source of truth
These tables are defined in the [`schemas`](https://github.com/drumee) repository under
`yellow_page/tables/`. This page reflects the live (British-spelled) tables; see
[Legacy twins](#legacy-twins) for the deprecated duplicates you may still encounter.
:::

## The central idea: `entity` is a polymorphic supertype

Drumee uses **single-table inheritance keyed by a shared `id`**. The `entity` table holds one
row per *thing that exists* — a user, a workspace, an organization. The subtype tables
(`drumate`, `hub`, `organisation`) reuse the **same 16-character `id`** as their own identity,
and `entity.type` records which subtype a row is.

To resolve any object generically you join through `entity`; `entity.type` tells you which
subtype table holds the rest of its data.

```mermaid
erDiagram
    vhost }o--|| entity : "id → entity.id"
    vhost }o--|| domain : "dom_id → domain.id"
    entity }o--|| domain : "dom_id → domain.id"
    drumate |o--|| entity : "id = entity.id"
    hub |o--|| entity : "id = entity.id"
    organisation |o--|| entity : "id = entity.id"
    drumate }o--|| domain : "domain_id → domain.id"
    hub }o--|| domain : "domain_id → domain.id"
    organisation |o--|| domain : "domain_id (1:1)"
    hub }o--|| drumate : "owner_id → drumate.id"
    privilege |o--|| drumate : "uid → drumate.id"
    privilege }o--|| domain : "domain_id → domain.id"

    vhost {
        varchar fqdn UK "hostname served"
        varchar id UK "→ entity.id"
        int dom_id "→ domain.id (default 1)"
    }
    domain {
        int id PK
        varchar name UK "tenant boundary"
    }
    entity {
        varchar id PK "shared identity"
        enum type "drumate|hub|organization|..."
        enum area "public|private|dmz|..."
        varchar db_name UK "sharded DB"
        varchar home_dir UK "MFS root"
        int dom_id "→ domain.id"
    }
    drumate {
        int sys_id PK
        varchar id UK "= entity.id"
        json profile "source of truth"
        int domain_id "→ domain.id"
        tinyint remit "user-level role flag"
    }
    hub {
        int sys_id PK
        varchar id UK "= entity.id"
        varchar owner_id "→ drumate.id"
        tinyint permission "default ACL bitmask"
    }
    organisation {
        int sys_id PK
        varchar id UK "= entity.id"
        int domain_id UK "1:1 per domain"
        varchar link UK "public URL"
    }
    privilege {
        int sys_id PK
        varchar uid UK "→ drumate.id"
        int domain_id "→ domain.id"
        int privilege "bitmask"
        tinyint is_authoritative
    }
```

## Request resolution flow

A request arrives at a hostname and is resolved through the registry before any application
code runs:

```mermaid
flowchart LR
    A[Inbound FQDN] --> B[vhost]
    B -->|id| C[entity]
    B -->|dom_id| D[domain]
    C -->|type| E{Subtype}
    E -->|drumate| F[user shard]
    E -->|hub| G[workspace shard]
    E -->|organization| H[organisation config]
    C -->|db_name / fs_host| I[Route to shard + MFS root]
```

## Tables

### `vhost` — hostname → entity/domain routing

The DNS/HTTP entry point. Maps an inbound fully-qualified domain name to the entity that
serves it and the domain it belongs to. It sits *in front of* the supertype model.

| Column | Type | Notes |
|---|---|---|
| `sys_id` | `int unsigned` AUTO_INCREMENT | Internal PK |
| `fqdn` | `varchar(256)` ascii, **UNIQUE** | The hostname served (e.g. a custom domain) |
| `id` | `varchar(16)` ascii, **UNIQUE** | → `entity.id` |
| `dom_id` | `int unsigned` (default `1`) | → `domain.id` |

Complements the denormalized `entity.vhost` column: the `vhost` **table** is the authoritative
many-FQDN-to-one-entity lookup.

### `domain` — the tenant boundary

The hub of the relational model. Nearly every other table carries a `dom_id`/`domain_id`
pointing here.

| Column | Type | Notes |
|---|---|---|
| `id` | `int` AUTO_INCREMENT | PK |
| `name` | `varchar(1000)`, **UNIQUE** (HASH) | Domain name |

### `entity` — the universal object

One row per thing that exists. Holds the discriminator, the visibility zone, and the physical
routing columns that map a logical object to its actual database and filesystem host.

| Column | Type | Notes |
|---|---|---|
| `id` | `varchar(16)` ascii | **PK** — the identity every subtype shares |
| `type` | `enum` | `organization`, `hub`, `drumate`, `shop`, `blog`, `forum`, `guest`, `dummy` |
| `area` | `enum` | Visibility zone: `public`, `share`, `limited`, `restricted`, `private`, `personal`, `system`, `dmz-*`, `pool`, `template`, … |
| `db_name` | `varchar(255)` ascii, **UNIQUE** | The entity's own sharded database |
| `db_host`, `fs_host` | `varchar(255)` | Which DB / filesystem host serves it |
| `home_dir` | `varchar(512)`, **UNIQUE** | MFS storage root |
| `home_id` | `varchar(16)`, **UNIQUE** | Root node in the MFS tree |
| `dom_id` | `int unsigned` | → `domain.id` (the `domain` varchar column is a denormalized copy) |
| `status` | `enum` | `active`, `frozen`, `deleted`, `archived`, `system`, `locked`, `online`, `offline`, `hidden` |
| `space` | `float` | Storage **usage** |
| `settings` | `mediumtext` | JSON blob (FULLTEXT indexed) |
| `ctime`, `mtime` | `int unsigned` | Unix timestamps |

:::warning Deprecated columns
`homepage` and `layout` (and the `home_layout` region) are explicitly marked
`TO BE REMOVED` in the schema — do not build on them.
:::

### `drumate` — a user (entity subtype)

The user record. Its `id` equals the corresponding `entity.id`. The `profile` JSON column is
the **source of truth**; almost every readable field is a **VIRTUAL generated column** derived
from it.

| Column | Type | Notes |
|---|---|---|
| `sys_id` | `int unsigned` AUTO_INCREMENT | Internal PK |
| `id` | `varchar(16)` ascii, **UNIQUE** | = `entity.id` |
| `username` | `varchar(80)` | Unique per domain via `(username, domain_id)` |
| `domain_id` | `int unsigned` | → `domain.id` |
| `remit` | `tinyint` | User-level role/permission flag |
| `profile` | `longtext` JSON (`json_valid` CHECK) | Source of truth — **writes go here** |
| `firstname`, `lastname`, `fullname` | VIRTUAL | From `profile` (`fullname` falls back to email) |
| `avatar`, `lang`, `email`, `dmail`, `quota` | VIRTUAL | Projections of `profile` |
| `allow_search` | VIRTUAL | From `$.privacy.visibility` |
| `otp`, `connected` | VIRTUAL | From `profile` |

`email` and `id` are unique. Note the **usage/limit split**: `entity.space` is usage,
`drumate.quota` (from profile JSON) is the limit.

### `hub` — a collaborative workspace (entity subtype)

A workspace, addressed by `hubname`. Its `id` equals the corresponding `entity.id`.

| Column | Type | Notes |
|---|---|---|
| `sys_id` | `int unsigned` AUTO_INCREMENT | Internal PK |
| `id` | `varchar(16)` ascii, **UNIQUE** | = `entity.id` |
| `hubname` | `varchar(80)`, **UNIQUE** | Addressable slug |
| `owner_id` | `varchar(16)` ascii | → `drumate.id` |
| `origin_id` | `varchar(16)` | Source hub when cloned/shared |
| `serial` | `int unsigned` | Unique per owner via `(owner_id, serial)` |
| `permission` | `tinyint unsigned` | Default bitwise [ACL](./02-acl-system.md) for the hub |
| `name`, `description`, `keywords` | text | FULLTEXT index on `(name, keywords)` |
| `profile` | `mediumtext` | JSON |
| `domain_id` | `int unsigned` | → `domain.id` |

### `organisation` — per-domain tenant configuration

Effectively a **1:1 settings record per domain** (`domain_id` is UNIQUE). Holds the tenant's
security and directory policy. Its `id` is an `entity.id` of type `organization`.

| Column | Type | Notes |
|---|---|---|
| `sys_id` | `int unsigned` AUTO_INCREMENT | Internal PK |
| `id` | `varchar(16)` ascii, **UNIQUE** | = `entity.id` |
| `domain_id` | `int`, **UNIQUE** | → `domain.id` (1:1) |
| `owner_id` | `varchar(16)` ascii, **UNIQUE** | → `drumate.id` |
| `link` | `varchar(1024)`, **UNIQUE** | The org's public URL |
| `ident` | `varchar(80)` | Unique per domain via `(ident, domain_id)` |
| `password_level`, `double_auth`, `usb_auth` | int/flags | Authentication policy |
| `dir_visibility`, `dir_info` | `varchar(40)` | Directory-listing controls |
| `metadata` | `longtext` JSON | Extra config |

### `privilege` — per-user, per-domain rights

Maps a user to a **bitwise privilege scoped to a domain**.

| Column | Type | Notes |
|---|---|---|
| `sys_id` | `int unsigned` AUTO_INCREMENT | Internal PK |
| `uid` | `varchar(16)` ascii, **UNIQUE** | → `drumate.id` (one row per user) |
| `domain_id` | `int unsigned` | → `domain.id` |
| `privilege` | `int unsigned` | The permission bitmask (see [ACL system](./02-acl-system.md)) |
| `is_authoritative` | `tinyint` | Whether this record is authoritative |

## Relationship summary

| From | Column | To | Meaning |
|---|---|---|---|
| `vhost` | `id` | `entity.id` | Hostname belongs to entity |
| `vhost` | `dom_id` | `domain.id` | Hostname's tenant |
| `entity` | `dom_id` | `domain.id` | Entity's tenant |
| `drumate` | `id` | `entity.id` | User *is* an entity |
| `hub` | `id` | `entity.id` | Workspace *is* an entity |
| `organisation` | `id` | `entity.id` | Org *is* an entity |
| `drumate` | `domain_id` | `domain.id` | User's tenant |
| `hub` | `owner_id` | `drumate.id` | Workspace owner |
| `organisation` | `domain_id` | `domain.id` | 1:1 tenant config |
| `privilege` | `uid` | `drumate.id` | User's rights |

## How `privilege` is enforced

The `privilege` table is consulted for services that operate at **domain scope** — tenant-wide
operations rather than per-file actions. Tracing one such request end to end shows how a
symbolic permission name in an ACL file becomes a bitwise check against `yp.privilege`.

### 1. The ACL declaration

Each backend declares permissions per `module.method` in `acl/*.json`. A domain-scoped service
looks like this (`server-team/acl/mfs.json`):

```json
"server_export": {
  "scope": "domain",
  "permission": { "src": "delete" }
}
```

`scope: "domain"` routes the check to the domain path; `src` is a **symbolic** permission name,
not a number.

### 2. Symbolic → numeric resolution (at dispatch)

The REST router resolves the symbolic name to a bitmask when it looks up the service — **not**
in the core ACL engine, which only ever sees numbers:

```js
// server-team/router/rest/index.js — Acl.getModule()
if (permission.src)  permission.src  = permissionValue(permission.src);
if (permission.dest) permission.dest = permissionValue(permission.dest);
permission.scope = scope;
```

`permissionValue()` (from `@drumee/server-essentials`, `lib/lex/permission.js`) maps the name to
a bit via a small lookup:

```js
function value(k, def){
  if (typeof(k) === 'number') return k;   // idempotent — numbers pass through
  return def[k] || 0;                       // unknown name → 0 → fail-closed (deny)
}
```

This is **idempotent** (safe to run on every request against the cached module map) and
**fail-closed** (an unrecognized name resolves to `0`, which no bitmask can satisfy).

### 3. The domain check (in the core ACL engine)

The resolved numeric `permission` reaches `server-core/lib/acl.js`. For domain scope it runs
`check_domain()`, which enforces two things:

1. **Tenant isolation** — the acting user's `drumate.domain_id` must equal the target
   resource's domain. A user can only run domain-scoped services against **their own** tenant.
2. **Bitwise privilege** — it calls the `yp` SQL function `domain_permission()`:

```sql
-- yellow_page/procedures/domain/permission.sql
SELECT privilege & _perm FROM privilege
  WHERE uid = _uid AND domain_id = _dom_id INTO _res;
RETURN IFNULL(_res, 0);
```

A non-zero result grants the request. A user with no `privilege` row gets `0` → denied.

```mermaid
flowchart TD
    A["acl/*.json<br/>src: 'delete', scope: 'domain'"] --> B["router getModule()<br/>permissionValue('delete') → bitmask"]
    B --> C["server-core acl.js<br/>check_domain()"]
    C --> D{"user.domain_id<br/>== target domain?"}
    D -->|no| X[DENIED: cross-domain]
    D -->|yes| E["domain_permission(uid, dom_id, mask)<br/>privilege & mask"]
    E -->|0| Y[DENIED]
    E -->|non-zero| Z[GRANTED]
```

:::warning Two permission maps — checked vs. stored
`server-essentials/lib/lex/` defines several bit maps with **different layouts**. The domain
path crosses two of them:

- The router resolves ACL `src`/`dest` through **`permission.js`** (positional single-bit:
  `read = 0b0000010`, `delete = 0b0001000`).
- Domain privileges are **written** to `yp.privilege.privilege` through **`remit.js`**
  (cumulative threshold: `dom_admin = 0b0011111`, `dom_admin_security = 0b0001111`, …) — e.g.
  `service/private/organization.js` grants with `Remit.dom_owner`.

`domain_permission()` then computes `stored & asked` across the two encodings. The gates happen
to land on sensible domain-admin tiers **only because the bit positions overlap** — not because
the maps share a definition. Shifting a bit in either map would silently mis-gate these services
(with no error, since the path is fail-closed). Treat the two maps as coupled when editing
either.
:::

:::note Scope spellings
`check_domain()` only enforces the checks when `scope` is exactly `"domain"`. The
`"organisation"`/`"organization"` spellings short-circuit to *granted*, but **no live service
uses them** (all 9 domain-scoped services in `server-team` use `"domain"`), so this is currently
dead code rather than a reachable bypass.
:::

## Notes & gotchas

- **No declared FOREIGN KEY constraints.** Referential integrity is enforced in application and
  stored-procedure code, not by the database. The relationships above are join conventions, not
  DB-level constraints.
- **JSON is the source of truth for `drumate`.** Its flat columns are read-only VIRTUAL
  projections of `profile` — always write to `profile`.
- **Unix-timestamp integers**, not `DATETIME`, are used for `ctime`/`mtime`.

### Legacy twins

Some deprecated duplicate tables exist alongside the live ones. Prefer the singular /
British-spelled tables:

| Live table | Legacy twin | Difference |
|---|---|---|
| `domain` | `domains` | `domains` is utf8mb3, `name varchar(50)`, no unique key — unused |
| `organisation` | `organization` | `organization` has `home` instead of `link`; migration twin |
| — | `organisation_entity` | ID-remapping scratch table (`org_id ↔ old_id/temp_id`), not part of the runtime model |
