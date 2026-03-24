---
id: notification
title: notification API
sidebar_label: notification
---

# NOTIFICATION API Reference

## Module Information

**Service Files:**
- Private: `service/private/notification.js`

**Available Services:** 1
**Documented Services:** 1

---

## notification.clear_all

Clear MFS file notifications and chat message notifications across multiple hubs for the authenticated user. Iterates over the provided nodes map calling stored procedure mfs_clear_notifications per hub, then iterates over the messages map calling stored procedure channel_clear_notifications per hub. Hubs with no db_name are silently skipped.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/notification.clear_all
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodes` | `object` | **Yes** | - | - |
| `messages` | `object` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_NODES` | - | nodes parameter is required but was not provided |
| `MISSING_MESSAGES` | - | messages parameter is required but was not provided |
| `INTERNAL_ERROR` | - | Failed to clear notifications via stored procedure mfs_clear_notifications or channel_clear_notifications |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
