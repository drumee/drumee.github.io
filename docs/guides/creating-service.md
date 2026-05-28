# Developer Onboarding Guide

This guide covers the core patterns you need to be productive on the Drumee backend quickly.

---

## Two Repositories

| Repo | Purpose |
|------|---------|
| `server-team` | Node.js service layer — routing, ACL enforcement, business logic |
| `schemas` | MariaDB schemas — tables, stored procedures, patches |

The server never runs raw SQL for business logic. All data operations go through **stored procedures** defined in `schemas/`.

---

## Adding a New Service Method

There are exactly **two files** to touch. The router wires everything automatically.

### Step 1 — Declare it in the ACL JSON (`acl/{module}.json`)

```json
{
  "modules": {
    "private": "service/private/{module}",
    "public":  "service/{module}"
  },
  "services": {
    "my_method": {
      "doc": "What this does",
      "scope": "hub",
      "permission": { "src": "write" },
      "params": {
        "node_id": { "type": "string", "required": true,  "doc": "Target node" },
        "page":    { "type": "number", "required": false, "doc": "Page number"  }
      }
    }
  }
}
```

**`scope`** values: `hub`, `domain`, `user`  
**`permission.src`** values (ascending): `anonymous` → `read`(2) → `write`(4) → `delete` → `admin`(6) → `owner`(7)

### Step 2 — Implement it in the service class (`service/{module}.js`)

```javascript
const { Entity } = require('@drumee/server-core');
const { Attr }   = require('@drumee/server-essentials');

class __mymodule extends Entity {
  async my_method() {
    const nid  = this.input.need(Attr.node_id); // throws if missing
    const page = this.input.get(Attr.page) || 1; // optional

    const rows = await this.db.await_proc('sp_my_proc', nid, page);
    this.output.data(rows);
  }
}

module.exports = __mymodule;
```

That's it. The REST router reads `acl/{module}.json` at startup, enforces permission, then calls `worker.my_method()`.

---

## Service Class Internals

Every service class extends `Entity` (`@drumee/server-core`). Available on `this`:

### Input
```javascript
this.input.need(Attr.x)   // required — throws MISSING_PARAM if absent
this.input.get(Attr.x)    // optional — returns undefined if absent
this.input.use(Attr.x)    // optional — alias for get
```

### Output
```javascript
this.output.data(obj)          // send JSON response
this.output.list(arr)          // send array response
this.output.add_data({k: v})   // merge extra fields into response
this.output.html(str)          // send HTML
this.output.status(code)       // set HTTP status before data()
```

### Exceptions
```javascript
this.exception.user('ERROR_CODE')    // → 400
this.exception.forbiden()            // → 403
this.exception.not_found('MSG')      // → 404
this.exception.server('MSG')         // → 500
```

Calling any exception method ends execution immediately — do not call `this.output.data()` after.

### Database Access

| Handle | Database | Use for |
|--------|----------|---------|
| `this.db` | Current hub's DB | File/node operations (`mfs_*` procs) |
| `this.yp` | Yellow Pages (central registry) | User/org lookups, socket targets |

```javascript
// Stored procedure (returns rows)
const node = await this.db.await_proc('mfs_access_node', uid, nid);

// SQL function (returns scalar)
const id = await this.db.await_func('node_id_from_path', filepath);

// Fire-and-forget (no await needed)
this.yp.call_proc('entity_touch', uid, this.output.data);
```

### Stored Procedure Naming
`{entity}_{verb}` — e.g. `mfs_create_node`, `mfs_list_by`, `contact_invitation_status`, `entity_sockets`, `disk_usage`

---

## Broadcasting to WebSocket Clients

Three steps: get recipients → build payload → send via Redis.

```javascript
const { RedisStore } = require('@drumee/server-essentials');
const { toArray }    = require('@drumee/server-core');

async my_method() {
  // ... do work, get `node` result ...

  const recipients = toArray(
    await this.yp.await_proc('entity_sockets', {
      hub_id: node.hub_id,
      exclude: [this.input.get(Attr.socket_id)], // omit sender
    })
  );

  const payload = this.payload(node, { service: 'media.new' });
  await RedisStore.sendData(payload, recipients);

  this.output.data(node); // also respond to the caller
}
```

`entity_sockets` returns all connected sockets for a hub. Use `user_sockets(uid)` to target a specific user instead.

---

## ACL Advanced: Pre-processors

For operations that need multi-source permission checks (e.g. move requires delete on source AND write on destination):

```json
"move": {
  "permission": {
    "src":    "delete",
    "dest":   "write",
    "preproc": { "checker": "pre_move" }
  }
}
```

The router calls `worker.pre_move()` after granting, waits for the `pre_move-done` event signal, then calls `worker.move()`. This pattern lets you validate complex preconditions inside the class before main execution.

---

## Database Schema Changes (`schemas` repo)

All schema work lives in the `schemas` repository alongside this one.

**Directory layout:**
| Directory | DB type |
|-----------|---------|
| `yellow_page/` | Central registry (entities, users, hubs) |
| `common/` | Shared procedures across all entities |
| `drumate/` | User workspace tables and procedures |
| `hub/` | Hub/org workspace tables and procedures |

**Rules:**
- One SQL routine per file (enforced by tooling).
- Stored procedure names follow `{entity}_{verb}` convention.

**Applying patches:**
```bash
# Apply a single file
bin/patch-from-file path/to/routine.sql db_name

# Apply a manifest of changes between two commits
bin/make-manifest <hash1> <hash2>
bin/patch-from-manifest patches-dir
```

---

## Request Lifecycle (Quick Reference)

```
POST /-/svc/contact.invite
        │
        ▼
router/rest/index.js
  • Splits "contact.invite" → module="contact", method="invite"
  • Loads acl/contact.json → checks permission.src = "owner"
  • Requires service/private/contact.js (for authenticated users)
        │
        ▼
  new __contact({ session, permission })
  • ACL emits GRANTED signal
  • (optional) preproc.checker runs and signals done
        │
        ▼
  worker.invite()
  • this.input.need(Attr.email) validates params
  • this.db / this.yp call stored procedures
  • this.output.data(result) sends response
  • (optional) RedisStore.sendData() broadcasts to hub
```
