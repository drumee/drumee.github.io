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

Read paginated entries from the server debug log file (log_dir/instance_name/debug.log). Reads the file, splits by newline, reverses the array to return most recent entries first, and returns a page of 20 entries starting from the requested page offset. Each line is parsed as JSON via parseJSON. Requires special_access precheck: the authenticated user must have remit &gt;= 2 in the visitor table.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (1) |

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
| `DENIED` | - | User does not have sufficient remit level (remit &lt; 2) to access logs |
| `INTERNAL_ERROR` | - | Failed to read the debug log file from the filesystem |

---

## Related Documentation

- [ACL System](../../technology/02-acl-system.md) - Permission model
- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference
- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed
- [Error Handling](../../product-guides/05-error-handling.md) - Error codes
