---
id: block
title: block API
sidebar_label: block
---

# BLOCK API Reference

## Module Information

**Service Files:**

**Available Services:** 16
**Documented Services:** 15

---

## block.assembly

Assemble and return a composed block structure for the current hub. Implementation details are resolved at runtime by the platform.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/block.assembly
```

---

## block.content

Retrieve block content for a given hashtag, device, and language. Resolves the correct JSON file (published, draft, or versioned) and delivers it via an nginx internal redirect (X-Accel-Redirect). Falls back across languages and devices when the exact file is not found.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/block.content
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | No | - | Block identifier. Resolved in order: name, then hashtag, then id. |
| `hashtag` | `string` | No | - | Block hashtag identifier. Used when name is not provided. |
| `id` | `string` | No | - | Block ID. Used as fallback when neither name nor hashtag is provided. At least one of name, hashtag, or id must be present. |
| `status` | `string (published, draft, )` | No | `""` | Content status filter. Use published to retrieve the online version or draft to retrieve the current draft. |
| `serial` | `number` | No | `0` | History version serial number. When greater than 0, retrieves the specific versioned JSON file. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `file` | `binary` | Block JSON content delivered as text/plain via nginx X-Accel-Redirect. Response includes Content-Disposition, Cache-Control, and Content-Length headers. |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BLOCK_NOT_FOUND` | 404 | No content file found for the requested hashtag, device, and language combination |

---

## block.copy

Copy a versioned block history entry to a new page or as a new revision. Writes the copied JSON file to the filesystem under the destination locale and device path, updating all meta fields accordingly.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/block.copy
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `history_id` | `string` | **Yes** | - | ID of the source history entry to copy from |
| `locale` | `string` | **Yes** | - | Target locale code for the copied content (e.g. fr, en) |
| `hashtag` | `string` | No | `""` | Hashtag for the destination block. If empty, the source block hashtag is reused. |
| `option` | `number (0, 1, 2)` | No | `0` | Copy mode: 0 = default, 1 = copy as new page, 2 = copy as new revision history |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | ID of the destination block |
| `serial` | `string` | Serial number assigned to the copied version |
| `device` | `string` | Device type of the copied entry |
| `lang` | `string` | Language of the copied entry |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BLOCK_NAME_EXIST` | 409 | A block with the given hashtag already exists |
| `CONFIRM_COPY_AS_NEW_PAGE` | 409 | Confirmation required to copy as a new page |
| `INTERNAL_ERROR` | 500 | Copy operation failed due to an internal error |

---

## block.delete

Delete a block entry for a specific device and locale. The block must not be in published state; call unpublish first if needed. On success, removes the corresponding filesystem directory for the given device and locale.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/block.delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Block ID to delete |
| `locale` | `string` | **Yes** | - | Locale code of the block version to delete (e.g. fr, en) |
| `device` | `string (desktop, mobile)` | No | `"desktop"` | Device type of the block version to delete |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | ID of the deleted block |
| `device` | `string` | Device type that was deleted |
| `lang` | `string` | Locale of the deleted block version |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `UNPUBLISH_TO_DELETE` | 409 | Block must be unpublished before it can be deleted |

---

## block.exists

Check whether a block identified by a string value exists. Uses the block_exists stored procedure and returns the result directly.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/block.exists
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `string` | No | `"*"` | Primary lookup value. Falls back to string if not provided. |
| `string` | `string` | No | - | String to check for existence. Defaults to value when not provided. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Result from the block_exists stored procedure indicating whether the block exists |

---

## block.filter

List platform block models from the yellow-page database, paginated. Calls the yp.plf_list_models stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/block.filter
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `array<object>` | Paginated list of platform block models |

---

## block.history

Retrieve the edit history log for a block, optionally filtered by device, language, month, and year. Calls the block_history_log stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/block.history
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Block ID to retrieve history for |
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |
| `month` | `number` | No | `0` | Month filter (1-12). When non-zero, year becomes required. |
| `year` | `number` | No | `0` | Year filter. Required when month is non-zero. |
| `device` | `string (desktop, mobile)` | No | `"desktop"` | Device type filter |
| `lang` | `string` | No | - | Language code filter. Defaults to the hub default language. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `array<object>` | Paginated history log entries for the block |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | year is required when month is non-zero |

---

## block.info

Get metadata information for a block identified by its hashtag. Calls the block_info stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/block.info
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hashtag` | `string` | **Yes** | - | Hashtag identifier of the block to retrieve info for |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Block metadata record returned by the block_info stored procedure |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | hashtag is required |

---

## block.list

List blocks filtered by editor type, with pagination and sort order. Calls the block_list stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/block.list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `editor` | `string` | No | `"creator"` | Editor type filter (e.g. creator) |
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |
| `order` | `string (D, A)` | No | `"D"` | Sort order: D for descending, A for ascending |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `array<object>` | Paginated list of block records |

---

## block.list_by

List blocks by locale and published state, with optional name filter, sort field, sort direction, and pagination. Calls the block_get_draft_publish stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/block.list_by
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `locale` | `string` | No | - | Locale code to filter blocks by (e.g. fr, en). Falls back to request language. |
| `published` | `string` | **Yes** | - | Publication state filter. Passed directly to the stored procedure. |
| `name` | `string` | No | `""` | Optional name substring filter |
| `sort_by` | `string` | No | `"date"` | Field to sort results by |
| `sort` | `string` | **Yes** | - | Sort direction (e.g. ASC or DESC) |
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `array<object>` | Filtered and paginated list of block records |

---

## block.log

Retrieve the global block activity log, paginated and sorted. Calls the block_log stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/block.log
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |
| `order` | `string (D, A)` | No | `"D"` | Sort order: D for descending, A for ascending |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `array<object>` | Paginated block activity log entries |

---

## block.purge

Permanently delete a block and remove its entire filesystem directory. Calls the block_purge stored procedure, then removes the block root directory via fsx.remove.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/block.purge
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Block ID or hashtag to purge |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Result data returned by the block_purge stored procedure after filesystem cleanup |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FAILED` | 500 | Purge failed because the block record has no ID |

---

## block.rename

Rename a block by updating its hashtag in the database and rewriting the hashtag field in all existing JSON content files on the filesystem. Calls the block_rename_new stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/block.rename
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Block ID to rename |
| `name` | `string` | No | - | New hashtag value. Takes precedence over hashtag when provided. |
| `hashtag` | `string` | No | - | New hashtag value. Required when name is not provided. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Updated block record with the new hashtag |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BLOCK_NAME_EXIST` | 409 | A block with the requested hashtag already exists |
| `INVALID_DATA` | 422 | Block record returned by the procedure is empty or invalid |

---

## block.search

Full-text search over blocks. Hyphens in the search string are replaced with spaces before calling the block_search stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/block.search
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `string` | `string` | No | `"*"` | Search string. Hyphens are replaced with spaces before the query. Defaults to wildcard. |
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `array<object>` | Paginated search results from the block_search stored procedure |

---

## block.store

Create or update a block content version. Writes the letc JSON content object to the filesystem under the resolved device and language path, creates symlinks for current and optionally online versions, updates the full-text search index via block_index, and dispatches to block_save_int or block_update_new depending on the status flag.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/block.store
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | No | `"0"` | Block ID. When 0 or absent, a new block is created. |
| `hashtag` | `string` | No | - | Block hashtag. Takes precedence from name; required when name is not provided and id is 0. |
| `name` | `string` | No | - | Block name used as the hashtag. Takes precedence over hashtag. |
| `letc` | `object` | **Yes** | - | Block content object to persist. Written to the filesystem as a JSON file. Meta fields (device, lang, serial, id, hashtag) are injected automatically. |
| `device` | `string (desktop, mobile)` | No | `"desktop"` | Target device type |
| `lang` | `string` | No | - | Target language code. Defaults to the hub default language. |
| `serial` | `number` | No | - | Version serial number. Required when id is non-zero. |
| `status` | `string (publish_with_history, publish_without_history, draft_without_history, )` | No | - | Publication status controlling which stored procedure branch is executed. |
| `editor` | `string` | No | - | Editor identifier (e.g. creator) |
| `type` | `string` | No | - | Block type identifier |
| `version` | `string` | No | - | Schema version of the letc format. Defaults to the platform LETC version constant. |
| `comment` | `string` | No | - | Optional change comment for the version |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Block ID |
| `active` | `string` | Serial number of the saved version, used as the JSON filename |
| `hashtag` | `string` | Canonical hashtag of the block |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BLOCK_NAME_EXIST` | 409 | A block with the requested hashtag already exists |

---

## block.unpublish

Unpublish a block for a specific device and locale. Verifies the block is currently published, removes the online.json symlink, and re-links the current.json to the previous history entry via the block_unpublish stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/block.unpublish
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Block ID to unpublish |
| `locale` | `string` | **Yes** | - | Locale code of the block version to unpublish (e.g. fr, en) |
| `device` | `string (desktop, mobile)` | No | `"desktop"` | Device type of the block version to unpublish |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Updated block record returned by the block_unpublish stored procedure |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NOT_PUBLISHED` | 409 | Block is not currently in published state and cannot be unpublished |

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
