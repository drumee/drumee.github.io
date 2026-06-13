---
id: google_drive
title: google_drive API
sidebar_label: google_drive
---

# GOOGLE_DRIVE API Reference

## Module Information

**Service Files:**
- Private: `service/private/google_drive.js`

**Available Services:** 9
**Documented Services:** 8

---

## google_drive.has_drive_scope

Returns \{ ok: true \} when the user already has an oauth_accounts row with drive.readonly scope and a refresh_token.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.has_drive_scope
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

---

## google_drive.connect

Mint the Google OAuth elevation URL (scope=drive.readonly, prompt=consent, access_type=offline). FE opens it in a popup window; the user grants consent; butler.google_drive_callback writes back to oauth_accounts and posts a message to the opener.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.connect
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

---

## google_drive.list

Browse one Google Drive folder for the in-app migration picker tree. Read-only, My Drive only. Returns \{ files: [\{ id, name, is_folder, mime_type, size \}], next_page_token \}.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `folder_id` | `string` | No | `"root"` | - |
| `page_token` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

---

## google_drive.start_migration

Create a migration_jobs row and enqueue the Bull worker. Returns the job_id immediately — the request does NOT wait for the migration to finish.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.start_migration
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |
| `source_folder_id` | `string` | No | `"root"` | - |
| `include_shared_drives` | `integer` | No | `0` | - |
| `conflict_policy` | `string` | No | `"skip"` | - |
| `mode` | `string` | No | `"all"` | - |
| `selections` | `object` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

---

## google_drive.get_status

Poll a Bull job by id. Returns \{ job_id, status, processed_files, total_files, total_folders, current_filename, errors, attempts, failed_reason, started_at, finished_at \} translated from the Bull state machine to the FE popup states (queued / running / done / failed / cancelled / none).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.get_status
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `job_id` | `string` | **Yes** | - | - |

---

## google_drive.cancel

Mark the job cancelled. Removes the job from Bull's waiting queue; an active worker will exit at the next file boundary.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.cancel
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `job_id` | `integer` | **Yes** | - | - |

---

## google_drive.dismiss_post_onboarding

Set profile.tools_migration_skipped.google_drive = 1 so the Desk auto-launch doesn't re-show the popup on every reload.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.dismiss_post_onboarding
```

---

## google_drive.get_state

Consolidated popup-open state so the FE can reconnect to an in-flight migration (or show a just-finished result once) instead of defaulting to the Start screen. Returns \{ ok (has drive scope), job (shaped getUserJob snapshot or null), seen_job_id (last dismissed result) \}.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.get_state
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

---

## google_drive.ack_result

Mark a finished migration result as seen (profile.gdrive_seen_job=job_id) so reopening the popup won't show that result again.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.ack_result
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `job_id` | `string` | **Yes** | - | - |

---

## Related Documentation

- [ACL System](../../technology/02-acl-system.md) - Permission model
- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference
- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed
- [Error Handling](../../product-guides/05-error-handling.md) - Error codes
