---
sidebar_position: 3
title: Troubleshooting
description: Solutions to common issues encountered when working with the Drumee backend
---

# Troubleshooting

Common issues encountered when developing, deploying, or operating the Drumee backend, with confirmed solutions.

---

## Documentation Build

### Mermaid diagram fails to parse — `Parse error on line 1`

**Symptom:** Docusaurus build fails with a Mermaid parse error pointing to the first line of a diagram, even though the diagram syntax looks correct.

**Cause:** macOS auto-correct replaces straight quotation marks with smart (curly) quotes (`"` → `"` `"`). Mermaid requires straight ASCII double quotes `"` around node labels that contain special characters such as `( ) / \ { }`. Smart quotes are not valid Mermaid syntax.

**Solution:** Do not type quotation marks in Mermaid node labels directly — copy-paste a straight ASCII double quote (`U+0022`) instead. Smart quotes are Unicode characters `U+201C` (left `"`) and `U+201D` (right `"`), which look nearly identical to `U+0022` in most fonts but are rejected by the Mermaid parser.

To detect smart quotes in a file:

```bash
# Lists any line containing U+201C or U+201D
grep -Pn '[\x{201C}\x{201D}]' docs/your-file.md
```

To replace all smart quotes with straight quotes:

```bash
# Replace " (U+201C) and " (U+201D) with " (U+0022)
sed -i 's/\xe2\x80\x9c/"/g; s/\xe2\x80\x9d/"/g' docs/your-file.md
```

In your editor, disable smart quote substitution: in VS Code, set `"editor.autoCorrect": false`; in macOS System Settings, go to Keyboard → Text Input → uncheck "Use smart quotes and dashes".

---

### Curly braces in ACL `doc` string cause MDX build failure

**Symptom:** `npm run serve` or `npm run publish` fails with a JSX/MDX parse error referencing a specific line in a generated API reference page.

**Cause:** The `doc`, `params`, `returns`, or `errors` documentation fields in an ACL JSON file contain curly braces `{` or `}`. Docusaurus parses `.md` files as MDX, which interprets `{` as the start of a JSX expression.

**Solution:** Remove all curly braces from documentation string values. Describe object shapes in plain text or move examples into a code block context. The validation script (`scripts/generate-api-docs.js`) runs an MDX safety check — use it to catch this before build.

---

## Database / Stored Procedures

### `PROCEDURE does not exist` at startup or runtime

**Symptom:** Service logs show `ER_SP_DOES_NOT_EXIST` for a procedure that exists in the `schemas` repository.

**Cause:** The stored procedure has not been deployed to the target database, or it was deployed to the wrong database. Common case: a procedure intended for the hub database was deployed to `yp`, or vice versa.

**Solution:** Verify which database the procedure belongs to using the directory structure in `schemas/`:
- `hub/procedures/` → deploy to each hub database
- `drumate/procedures/` → deploy to user databases (`9_xxx`)
- `yp/procedures/` → deploy to the `yp` database

Re-run the deployment script for the correct target.

---

### `DELETE` alias syntax fails on MariaDB 10.x

**Symptom:** A stored procedure that works on the staging server (MariaDB 11.x) fails silently or with a syntax error on production (MariaDB 10.x).

**Cause:** The alias syntax `DELETE FROM table m WHERE m.id = ...` is valid in MariaDB 11.x but not supported in 10.x.

**Solution:** Rewrite the `DELETE` statement without a table alias:
```sql
-- Fails on MariaDB 10.x
DELETE FROM media m WHERE m.owner_id = _uid AND m.status = 'deleted';

-- Works on both 10.x and 11.x
DELETE FROM media WHERE owner_id = _uid AND status = 'deleted';
```

Always verify stored procedure syntax against the MariaDB version running on the production server before deploying.

---

### Stored procedure not found after using `forward_proc`

**Symptom:** A service using `forward_proc` fails with `PROCEDURE does not exist`, even though the target procedure is deployed.

**Cause:** `forward_proc` is deprecated. It passes arguments as a raw string and resolves the database at runtime in a way that is fragile and hard to debug. Additionally, if `forward_proc` itself has not been deployed to `yp`, the call fails entirely.

**Solution:** Replace `forward_proc` with the explicit `get_db_name` + direct call pattern:
```js
// Deprecated
await this.yp.await_proc('forward_proc', hub_id, 'my_proc', `'${arg1}','${arg2}'`);

// Current pattern
const dbName = await this.yp.await_func('get_db_name', hub_id);
await this.yp.await_proc(`${dbName}.my_proc`, arg1, arg2);
```

---

### `JSON.stringify` passed to `await_proc` causes incorrect data in database

**Symptom:** A stored procedure receives a JSON string wrapped in extra quotes, or object data is stored as a literal string `"[object Object]"`.

**Cause:** Calling `JSON.stringify(obj)` before passing to `await_proc` or `await_func`. The database API already handles serialisation of JavaScript objects and arrays automatically.

**Solution:** Pass objects and arrays directly:
```js
// Incorrect — double-serialises the value
await this.db.await_proc('contact_update', id, JSON.stringify({ email, mobile }));

// Correct — API handles serialisation
await this.db.await_proc('contact_update', id, { email, mobile });
```

---

### Procedure uses `category` but queries `mimetype` — no results returned

**Symptom:** A stored procedure or service that filters for folder nodes returns zero results, even though folders exist.

**Cause:** Using `mimetype = 'folder'` is a legacy pattern. The authoritative field for node type identification in the MFS is `category`, not `mimetype`.

**Solution:**
```sql
-- Legacy (unreliable)
WHERE mimetype = 'folder'

-- Correct
WHERE category = 'folder'
```

---

## Service Runtime

### Service returns 403 for a user who should have access

**Symptom:** A legitimate user receives a 403 Forbidden response calling a service.

**Cause (common):** The service's `permission.src` is set to a higher level than necessary (e.g. `"owner"` when `"write"` was intended), or the user's hub membership does not carry the required privilege.

**Cause (less common):** The service uses `fast_check: "user_permission"` which enforces node-level ACL in addition to hub-level privilege. The user may have hub-level read access but no permission on the specific MFS node being accessed.

**Solution:** Review the ACL entry for the service. Verify `permission.src` is the minimum necessary level. If `fast_check` is present, verify the user has the appropriate node-level permission.

---

### Service method not dispatched — 404 response

**Symptom:** Calling `module.method` returns a 404 or `WRONG_API` error.

**Cause (common):** The method name in the ACL does not match any method in the service class, and no `method` alias is configured.

**Cause (less common):** The `modules.private` or `modules.public` path in the ACL file points to a file that does not exist, or the file failed to load at startup.

**Solution:** Verify the service name in the ACL matches an exported method on the class (or that the `method` alias is correctly set). Check service startup logs for module load errors.

---

### Plugin service returns `WRONG_API` (405)

**Symptom:** A plugin service accessible at `/-/<endpoint>/svc/module.method` returns `{"error": "WRONG_API", "error_code": 405}`.

**Cause:** The service is declared with `"scope": "public"` in its ACL but is being accessed through the endpoint-scoped URL (which expects a session). Or the service is declared with `"scope": "hub"` but is being accessed without a valid session.

**Solution:** Verify the `scope` in the plugin's ACL matches the access pattern. Public-scope services must be called without session context; hub-scope services require an authenticated session.

---

## Deployment

### Production server behaves differently from staging after deployment

**Symptom:** A change works correctly on the staging server but fails on production.

**Common causes:**
- A stored procedure was deployed to staging but not production
- The production server is running a different MariaDB version than staging (see [MariaDB 10.x syntax issue](#delete-alias-syntax-fails-on-mariadb-10x))
- A `trashed_time` column or other schema addition exists on staging but has not been applied to production

**Solution:** Compare the deployed schema versions between environments. Ensure all stored procedure deployments and table migrations from `patches/manifest.txt` have been applied to production.

---

### Credentials not loaded — service fails with authentication error

**Symptom:** A service that depends on an external API (Stripe, email, etc.) fails with an authentication or credentials error immediately on startup.

**Cause:** Long-lived credentials are expected in `/etc/drumee/credentials/` but the file is missing, has the wrong path, or has incorrect permissions.

**Solution:** Verify the credential file exists at the expected path inside the container:
```bash
cat /etc/drumee/credentials/<service>/info.json
```
Do not store credentials in `.env` files or code — only in `/etc/drumee/credentials/`.

---

## Payment / Stripe

### Stripe webhook returns signature verification error — empty body

**Symptom:** The Stripe webhook handler throws a signature verification error even though the request is a genuine Stripe event. The raw request body appears empty or undefined when read.

**Cause:** Express parses the request body as JSON before the webhook handler runs. Stripe's signature verification requires the **raw** unparsed body buffer, not the parsed JSON object. Once the body has been parsed, the original bytes are lost and the signature cannot be verified.

**Solution:** Register the Stripe webhook route **before** `express.json()` middleware, or use `express.raw()` specifically for the webhook path:

```js
// Must be placed before app.use(express.json())
app.post('/-/svc/payment.webhook',
  express.raw({ type: 'application/json' }),
  paymentWebhookHandler
);
```

Then pass `req.body` (as a Buffer) directly to `stripe.webhooks.constructEvent(req.body, sig, secret)`.

---

### `quota_category` stored as raw JSON string — plan check always fails

**Symptom:** A quota or plan check always falls through to the free-user fallback, even for users who have an active paid subscription.

**Cause:** The `quota_category` field (or equivalent JSON column) is being accessed as a raw string directly from the database result, without first parsing it. A condition like `if (quota.plan === 'plus')` evaluates to `false` when `quota` is still the stringified JSON `'{"plan":"plus",...}'`.

**Solution:** Parse the JSON field before use:

```js
// Incorrect — quota is still a raw string
const quota = result.quota_category;
if (quota.plan === 'plus') { ... }

// Correct — parse first
const quota = JSON.parse(result.quota_category);
if (quota.plan === 'plus') { ... }
```

---

## Trash / MFS

### Restoring a file from trash deletes all content in the current desk

**Symptom:** After restoring a file from trash, all files in the current desk view disappear. Reloading the page shows them again, but the restored file is still in trash.

**Cause:** The restore stored procedure was called with an incorrect `nid` — specifically, it received the desk root node ID instead of the trashed item's node ID. The procedure then operated on the desk root, which effectively cleared its contents from the view.

**Solution:** Verify the argument passed to the restore procedure is the node ID of the individual trashed item (`media.id`), not the container or desk root. Trace the service call in `media.js` or `trash.js` and confirm the correct field is being read from `input`:

```js
// Must be the trashed item's own id, not its parent
const nid = this.input.need(Attr.nid);
await this.db.await_proc('mfs_restore', nid);
```

---

## Background Workers

### Bull Queue worker not processing jobs — jobs stuck in waiting state

**Symptom:** Files are uploaded successfully but their content is never indexed (full-text search returns no results). Checking the queue shows jobs accumulating in the `waiting` state without being processed.

**Cause (common):** Redis is not running or the worker process has not been started. Bull Queue requires both Redis and a running worker process — the main service process only enqueues jobs; a separate worker must be running to consume them.

**Cause (less common):** The Redis connection configuration in the worker does not match the server's Redis bind address or port.

**Solution:**

```bash
# Verify Redis is running
redis-cli ping
# Expected: PONG

# Start the worker (example for SEO indexing)
node workers/indexWorker.js

# Or via PM2
pm2 start workers/indexWorker.js --name seo-worker
```

Confirm the `host` and `port` in the Bull Queue configuration match the Redis server's actual bind settings.

---