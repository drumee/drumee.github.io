---
id: changelog
title: changelog API
sidebar_label: changelog
---

# CHANGELOG API Reference

## Module Information

**Service Files:**
- Private: `service/changelog.js`

**Available Services:** 1
**Documented Services:** 1

---

## changelog.read

Read changelog entries for the current user from the changelog_read stored procedure. All filter parameters are optional; any falsy value is stripped before the procedure call. The current user ID is injected automatically from the session.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/changelog.read
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `last` | `string` | No | - | ID or cursor of the last changelog entry seen by the client. Used for incremental fetching. Omitted from the procedure call when falsy. |
| `id` | `string` | No | - | Specific changelog entry ID to retrieve. Omitted from the procedure call when falsy. |
| `page` | `number` | No | - | Page number for pagination. Omitted from the procedure call when falsy. |
| `exclude` | `string` | No | - | Comma-separated list of entry IDs or categories to exclude from results. Omitted from the procedure call when falsy. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array<object>` | List of changelog entries returned by the changelog_read stored procedure. Returns an empty array when the procedure yields no results. |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `PERMISSION_DENIED` | 403 | Caller does not have owner permission on this hub |

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
