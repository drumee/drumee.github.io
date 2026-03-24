---
id: log
title: log API
sidebar_label: log
---

# LOG API Reference

## Module Information

**Service Files:**
- Private: `service/private/log.js`

**Available Services:** 1
**Documented Services:** 1

---

## log.read

Read paginated entries from the server debug log file (log_dir/instance_name/debug.log). Reads the file, splits by newline, reverses the array to return most recent entries first, and returns a page of 20 entries starting from the requested page offset. Each line is parsed as JSON via parseJSON. Requires special_access precheck: the authenticated user must have remit >= 2 in the visitor table.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/log.read
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | `1` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DENIED` | - | User does not have sufficient remit level (remit < 2) to access logs |
| `INTERNAL_ERROR` | - | Failed to read the debug log file from the filesystem |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
