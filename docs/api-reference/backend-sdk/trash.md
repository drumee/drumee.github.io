---
id: trash
title: trash API
sidebar_label: trash
---

# TRASH API Reference

## Module Information

**Service Files:**
- Private: `service/private/trash.js`

**Available Services:** 4
**Documented Services:** 4

---

## trash.get_config

Get current trash expiry configuration. Calls the get_trash_config stored procedure on the YP database and returns the configuration record with last_run_time, ctime, and mtime formatted as ISO 8601 date strings. Returns null for date fields when the corresponding timestamp is 0.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/trash.get_config
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `TRASH_CONFIG_NOT_FOUND` | - | The get_trash_config stored procedure returned no result |
| `FAILED_TO_GET_TRASH_CONFIG` | - | An unexpected server error occurred while retrieving trash configuration |

---

## trash.update_config

Update trash expiry configuration. Requires admin permission. Validates expiry_days (must be an integer between 1 and 365) and auto_delete_enabled (must be exactly 0 or 1) before calling the update_trash_config stored procedure. The stored procedure also performs its own validation. Returns the updated configuration with ISO 8601 formatted date fields.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/trash.update_config
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `expiry_days` | `integer` | **Yes** | - | - |
| `auto_delete_enabled` | `integer` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_EXPIRY_DAYS` | - | expiry_days is not a number or is outside the 1-365 range. Also raised when the stored procedure itself rejects the value. |
| `INVALID_AUTO_DELETE_FLAG` | - | auto_delete_enabled is not exactly 0 or 1. Also raised when the stored procedure itself rejects the value. |
| `TRASH_CONFIG_UPDATE_FAILED` | - | The update_trash_config stored procedure returned no result |
| `FAILED_TO_UPDATE_TRASH_CONFIG` | - | An unexpected server error occurred while updating trash configuration |

---

## trash.get_stats

Get trash statistics for the admin dashboard. Fetches the global trash configuration, then calls the find_all_expired_trash stored procedure to aggregate expired item counts across all hubs. When called in a hub context, also queries the current hub database for per-user trash totals and expired item counts. Returns a combined result with global config, system-wide aggregates, and optionally the current hub breakdown.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/trash.get_stats
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `TRASH_CONFIG_NOT_FOUND` | - | The get_trash_config stored procedure returned no result |
| `FAILED_TO_GET_TRASH_STATS` | - | An unexpected server error occurred while retrieving trash statistics |

---

## trash.trigger_expiry

Manually trigger an immediate trash expiry run. Intended for admin use and testing. The current implementation returns a success acknowledgement immediately. Actual signalling to the expiry worker process depends on the server process management configuration.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/trash.trigger_expiry
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FAILED_TO_TRIGGER_EXPIRY` | - | An unexpected server error occurred while attempting to trigger the expiry run |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
