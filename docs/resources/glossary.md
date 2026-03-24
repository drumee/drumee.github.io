---
sidebar_position: 1
title: Glossary
description: Definitions for terms used throughout the Drumee backend documentation
---

# Glossary

Terms used throughout the Drumee backend documentation and codebase.

---

## A

### ACL (Access Control List)
A JSON configuration file in `server-team/acl/` that declares the services a module exposes, the permission level required to call each service, and the JavaScript file that implements the module. One ACL file exists per module (e.g. `acl/media.json`). ACL files are read by the server at startup; changes require a service restart.

### `activity_unified`
A MariaDB VIEW in `yp` that combines `yp.mfs_changelog` (MFS events) and `yp.contact_activity` (contact events) into a single unified activity feed. Contact events are given display priority 1, MFS events priority 2. Queried by the `desk_activity_log` stored procedure with pagination support.

### `await_func`
A database helper method that calls a stored **function** (not a procedure) and returns a scalar value. Used when the database object is defined as `FUNCTION` rather than `PROCEDURE`.
```js
const dbName = await this.yp.await_func('get_db_name', hub_id);
```

### `await_proc`
A database helper method that calls a stored **procedure**. Returns a result set or nothing depending on the procedure. Used for all database operations in service code — raw SQL is not permitted.
```js
const result = await this.db.await_proc('hub_get_members_by_type', uid, 'all', 1);
```

---

## B

### `butler.js`
The service file responsible for signup, authentication, and session management. Located at `service/private/butler.js`. Handles flows including `complete_signup`, post-signup hub invitation resolution, and OTP validation.

### `adminpanel.js`
The service file for domain-level (organisation) administration. Located at `service/private/adminpanel.js`. Handles operations such as managing organisation members, reassigning hub ownership, and downgrading users to the Free plan.

### Bull Queue
A Redis-based job queue library used for background processing in Drumee. Chosen over simple cron jobs because it provides automatic retry with exponential backoff, concurrency control, and rate limiting. Used by the SEO indexing worker and the trash expiry worker. Workers are separate Node.js processes that consume jobs asynchronously without blocking service responses.

### `b2b` / `b2c` signup
Two distinct signup flows in Drumee. `b2b` (business-to-business) is the organisation onboarding flow — includes company registration, personal data entry, and OTP verification steps (`b2b_signup_company`, `b2b_signup_personaldata`, `b2b_signup_otpverify`, etc.). `b2c` (business-to-consumer) is the individual user signup flow with a simpler step set. Both flows terminate in `complete_signup` in `butler.js`.

---

## C

### `category`
The authoritative field for identifying node types in the MFS. Use `category = 'folder'` to identify folder nodes — not `mimetype`. This distinction is critical for stored procedures that filter by node type.

### `Cache.getSysConf(key)`
The standard pattern for reading non-sensitive configuration values stored in `yp.sys_conf` at runtime. Do not read config directly from the database in service code.

### `contact_activity`
A `yp` database table that records contact-related events (invitations, accepts, blocks, etc.) for the activity log. Part of the unified activity system alongside `yp.mfs_changelog`. Both tables are combined through the `activity_unified` VIEW.

### `contact_search_by_domain_next`
A stored procedure in `drumate/procedures/contact/` that powers the contact search box. For paid users (`domain_id > 1`), it returns results from both `drumate.contact` (saved contacts) and `yp.drumate` (organisation colleagues) with duplicate prevention: if a colleague has already been saved as a contact, only the contact entry is returned.

### `credentials`
Long-lived secrets (API keys, service tokens, database passwords) stored in `/etc/drumee/credentials/` on the server. Never stored in `.env` files or committed to git. Non-sensitive config goes in `yp.sys_conf` instead.

---

## D

### `disk_usage` (`yp.disk_usage`)
A `yp` table that tracks storage consumption per user and per domain. Updated when files are uploaded or deleted. Used by the quota enforcement system to compare actual usage against the plan limit.

### Domain
An organisation grouping in Drumee. Users with `domain_id > 1` belong to a paid organisation and share colleagues (visible via `yp.drumate` UNION in contact procedures). Users with `domain_id = 1` are free-tier or unaffiliated. Domains have an admin user with `privilege = 63` (owner) who receives ownership of hubs when a member is removed.

### `domain_id`
A field on `yp.drumate` and `yp.entity` records that links a user to their organisation. `domain_id = 1` means the user has no organisation (free plan or standalone). `domain_id > 1` means the user belongs to a paid organisation and has access to colleagues in contact procedures and hub-add flows.

### `db` (this.db)
The database handle scoped to the current hub's database. Used to call stored procedures that operate on hub data.
```js
await this.db.await_proc('some_hub_proc', arg1, arg2);
```

### `doc` field
A documentation-only field added to ACL service entries. Never read by the server at runtime. Describes what the service does in plain text. No curly braces allowed (MDX safety).

### Drumee Meta OS
Drumee's self-description as a meta operating system — a platform designed to host and run web applications, analogous to how a desktop OS runs programs. Provides identity management, file system management, UI rendering, and an objectified database as core services.

### `drumate`
A registered Drumee user account. Also the name of the database schema (`drumate/procedures/`) containing stored procedures for user-scoped operations such as contacts and tags.

---

## E

### Entity
The base class (`@drumee/server-core`) that all service implementation classes extend. Provides `this.db`, `this.yp`, `this.input`, `this.output`, `this.uid`, and logging methods (`this.debug`, `this.warn`).

---

## F

### `fast_check`
An optional field in `permission` within an ACL service entry. Triggers an additional runtime check beyond hub-level privilege. Values: `"user_permission"` (node-level ACL check) or `"public-api"` (token-based access without full session).

### `forward_proc`
A deprecated stored procedure routing pattern. Previously used to call a procedure in another entity's database by passing the entity ID, procedure name, and arguments as a string. Replaced by the explicit `get_db_name` + direct call pattern.
```js
// Deprecated — do not use in new code
await this.yp.await_proc('forward_proc', entity_id, 'proc_name', `'arg1','arg2'`);

// Current pattern
const dbName = await this.yp.await_func('get_db_name', hub_id);
await this.yp.await_proc(`${dbName}.proc_name`, arg1, arg2);
```

---

## G

### `get_quota()`
A stored function in `yp` that returns the active plan details for a user. Implements a priority lookup: (1) personal subscription via `quota.payer_id`, (2) organisation subscription via `quota.domain_id`, (3) fallback to `drumate.profile.category` for free users. Returns fields including `plan`, `storage`, `billing_cycle`, `seat`, `available_seat`, `total_seat`, and `used_seat`.

---

## H

### Hub
A shared workspace in Drumee. Has its own database (no prefix, UUID-derived name). Members, files, permissions, and settings are all scoped to the hub database.

### Hub database
The MariaDB database for a specific hub. Named with a UUID-derived string and no prefix (e.g. `ab12cd34ef56`). Accessed via `this.db` in service code, or resolved explicitly with `get_db_name`.

### `leave_hub`
A stored procedure in `drumate/procedures/hubs/` that removes a user from a hub they do not own. Deletes the user's `media` and `permission` records for that hub. Called when a member is removed or when a user is downgraded to the Free plan and must leave all organisation hubs they do not own.

---

## I

### `input.need(Attr.x)`
Reads a required request parameter. Throws an exception if the parameter is absent. Used in service methods to enforce required inputs.

### `input.use(Attr.x, default)`
Reads an optional request parameter. Returns the default value if the parameter is absent.

---

## L

### LETC (Limitlessly Extensible Tree Components)
Drumee's declarative UI rendering engine. User interfaces are described as JSON trees. The LETC renderer on the client resolves each node to a registered widget and renders the interface. The server returns pure data — no HTML generation on the server side.

### `log` field
An optional boolean field in an ACL service entry. When `true`, the service invocation is written to the audit log. Default is `false`. Typically enabled on write operations.

### `loby`
The Drumee authentication and onboarding server plugin. Handles signup, signin, and onboarding flows.

---

## M

### Messenger
The class used for sending emails from backend services. Exposes `renderFrom(template, data)` to render an HTML email from a template and `send(options)` to deliver it. The canonical usage pattern is in `service/signup.js`. Credentials for the mail transport are stored in `/etc/drumee/credentials/`.

### MariaDB version awareness
Syntax valid in MariaDB 11.x may fail silently in 10.x. For example, `DELETE FROM table m WHERE m.id` alias syntax is not supported in 10.x. Always verify syntax against the target server version before deploying stored procedures.

### MDX safety
A constraint on documentation field values (`doc`, `params`, `returns`, `errors`) in ACL JSON files. Curly braces `{` `}` in string values cause JSX parse errors in the Docusaurus MDX build. These characters must be avoided or escaped in all documentation prose outside code blocks.

### `method` field
An optional field in an ACL service entry that maps the public-facing service name to a different JavaScript method name in the implementation class. If absent, the service name and method name are identical.

### MFS (Meta File System)
Drumee's file system abstraction layer. All file operations go through the MFS API rather than the host file system directly. Nodes in the MFS are stored in the `media` table with a `category` field identifying the node type (file, folder, etc.).

### `mfs_changelog` (`yp.mfs_changelog`)
An existing `yp` table that logs MFS events (file uploads, moves, deletes, renames). One of two sources for the unified activity feed; the other is `contact_activity`. Read by the `activity_unified` VIEW and the `desk_activity_log` stored procedure.

### `mfs_token` (`yp.mfs_token`)
A `yp` table that stores export tokens for the Drumee Import/Export system. Each row links a token string to a hub, a node, the token creator, and an optional expiry time. Tokens are validated on every import request; expired tokens are rejected. Never pass a token in a URL — always use an HTTP header.

### `modules` field
A required field in an ACL JSON file that specifies the JavaScript file(s) implementing the module's services. Has `private` and/or `public` keys pointing to relative paths from the server root.
```json
"modules": {
  "private": "service/private/mymodule"
}
```

---

## O

### OAuth
Third-party authentication integration. Drumee supports Google OAuth 2.0 and Apple Sign-In. The flow stores `access_token` and `refresh_token` in the `oauth_accounts` table and syncs profile data with the `drumate` record. CSRF protection is implemented via `oauth_state` table validation.

### `output.data(result)`
Sends a single object as the JSON response. Used when the service returns one record.

### `output.list(result)`
Sends an array as the JSON response. Used when the service returns multiple records.

---

## P

### `pageToLimits(page, OUT offset, OUT range)`
A utility stored procedure that converts a 1-based page number into SQL `LIMIT` and `OFFSET` values. Called internally by all paginated stored procedures.

### `pageToLimits(page, OUT offset, OUT range)`
A utility stored procedure that converts a 1-based page number into SQL `LIMIT` and `OFFSET` values. Called internally by all paginated stored procedures.

### Plan
A subscription tier that determines a user's storage quota and seat count. Three tiers exist: **Free** (15 GB, 1 seat, no payment), **Plus** (2 TB, 1 seat, monthly/yearly), and **Pro** (5 TB, 5 base seats + additional seats, monthly/yearly). The active plan is determined by `get_quota()`, sourced from `yp.quota` — not from `drumate.profile.category`, which is only a fallback for free users.

### `privilege` (`yp.privilege`)
A `yp` table that stores the privilege (permission level) a user holds within a specific hub or domain. A privilege value of `63` designates an owner. Used by `leave_hub`, `adminpanel.js` member management, and hub access checks.

### `pseudo_entity`
A virtual user record in `yp` that represents an export token in the permission system. Created alongside an `mfs_token` entry so that standard permission checks can be applied to token-based import requests. Automatically deleted when the corresponding token is revoked.

### `patches/manifest.txt`
The deployment tracking file in the `server-team` repository. Changes to ACL files and service code are tracked in `patches/changelog` and deployed via the manifest system.

### `permission.src`
The minimum privilege level required to call a service. Values in ascending order: `"anonymous"`, `"read"`, `"write"`, `"admin"`, `"owner"`, `"delete"`.

### Plugin
An independent Node.js package that adds new backend services to a Drumee endpoint without modifying the core `server-team` codebase. Registered with `npm run register-plugin -- --endpoint=<user>`. Plugin services are callable at `/-/<endpoint>/svc/module.method` (distinct from core services at `/-/svc/module.method`).

### `preproc` field
An optional field in an ACL service entry that specifies a pre-processing hook to run before the service method. Used for file upload handling (`"checker": "upload"`).

### PM2
The process manager used to run and monitor Drumee server processes. Wrapped by the `drumee` CLI tool — interact with processes via `drumee list`, `drumee log`, `drumee restart` rather than PM2 directly.

---

## Q

### `quota` table (`yp.quota`)
The source of truth for a user's active subscription. A row is created or updated by the Stripe webhook handler when a payment event (`invoice.paid`) is received. Contains `payer_id`, `domain_id`, `plan`, `storage`, `billing_cycle`, `total_seat`, and `used_seat`. Takes precedence over `drumate.profile.category` for plan resolution.

---

## R

### `revamp` branch
The active development branch of the Drumee platform. The `main` branch contains the older stable installation packages (docker-hosted, debian-hosted). New features and architectural improvements target `revamp`.

### Runtime fields
Fields in an ACL service entry that are read by the server at runtime and affect service behaviour: `scope`, `permission`, `method`, `log`, `preproc`, `modules`. These must never be modified without coordinating with the team lead, as changes are breaking.

---

## S

### SEO indexing
A background processing system that extracts text from uploaded documents and images and stores it in `seo_index` for full-text search. Triggered when a file is uploaded via `media.store()`. Jobs are queued in Bull Queue (Redis) so the upload response is not delayed. The worker supports PDF, Office documents, plain text, and images (via Tesseract OCR). Workers run as separate Node.js processes with concurrency control and automatic retry.

### `seo_index` table
A database table that stores extracted text content from uploaded files, used to power Drumee's full-text search. Populated by the SEO indexing worker after a file is processed. Keyed by node ID.

### `scope` field
Defines the session context required to call a service. Values: `"hub"` (most services), `"domain"` (platform admin), `"public"` (no authentication required).

### `schemas` repository
The `drumee/schemas` GitHub repository containing all stored procedure SQL files. Organised by database target: `hub/procedures/`, `drumate/procedures/`, `yp/procedures/`. Never alter stored procedures directly in production — all changes go through this repository.

### Service
A named backend endpoint exposed by a Drumee module. Callable at `/-/svc/module.method`. Each service has a corresponding entry in the module's ACL JSON file and a corresponding method in the service implementation class.

### Shared database
A MariaDB database shared across multiple users, named with the `c_` prefix (e.g. `c_67c9b37e67c9b37f`). Used for cross-user data such as reward hub records.

### `sys_pn` (System Part Name)
A frontend concept used to patch a specific UI fragment instead of re-rendering the entire interface. Frontend territory — not used in backend service code.

---

## U

### User database
The personal MariaDB database for a single Drumee user. Named with the `9_` prefix (e.g. `9_ab12cd34ef56`). Contains personal data: contacts, tags, activity. Accessed via `forward_proc` (deprecated) or by resolving `db_name` explicitly.

---

## V

### `vhost` (`yp.vhost`)
A `yp` table storing virtual host configuration for each Drumee endpoint. Updated when an organisation domain is configured. One of the tables affected when a user is downgraded or removed from a domain.

---

## W

### WebSocket
Drumee's real-time event channel. The backend pushes events to connected clients over WebSocket rather than waiting for a client poll. Used for: notifying the frontend after a payment completes (triggering `Visitor.respawn(data)` with the updated user record from `yp.get_user`), and notifying clients when a trash emptying operation finishes. WebSocket events carry plain JSON payloads.

---

## Y

### `yp` (Yellow Pages)
The platform-wide MariaDB registry database (`yp`). Contains entity records, sessions, system configuration, and hub metadata. Accessed via `this.yp` in service code.
```js
const user = await this.yp.await_proc('drumate_exists', email);
```

### `yp.await_func` / `yp.await_proc`
Calls a stored function or procedure in the `yp` database. Used for cross-hub operations and platform-level lookups such as `drumate_exists`, `get_db_name`, and `share_guest_get_by_email`.