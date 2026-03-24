---
id: admin
title: admin API
sidebar_label: admin
---

# ADMIN API Reference

## Module Information

**Service Files:**
- Private: `service/private/admin.js`

**Available Services:** 2
**Documented Services:** 2

---

## admin.show_watermark

Get watermark timestamps for hub and drumate entity pools from the yellow-page database

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | unknown |

**Endpoint:**
```
https://hostname/-/svc/admin.show_watermark
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `hub` | `object` | Watermark record for hub entities returned by the watermark stored procedure |
| `drumate` | `object` | Watermark record for drumate entities returned by the watermark stored procedure |
| `ctime` | `object` | Most recent creation timestamps for each entity type |
| `ctime.hub` | `string` | Latest ctime for hub-type entities in the pool area |
| `ctime.drumate` | `string` | Latest ctime for drumate-type entities in the pool area |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DENIED` | 403 | Caller does not have the required platform remit |

---

## admin.yp_test

Execute an arbitrary yellow-page stored procedure by name with a dynamic argument list. Intended for administrative testing and diagnostics only.

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | unknown |

**Endpoint:**
```
https://hostname/-/svc/admin.yp_test
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | Name of the stored procedure to call on the yellow-page database |
| `values` | `array<string>` | **Yes** | - | Ordered list of arguments to spread into the stored procedure call |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Raw result returned by the named stored procedure |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DENIED` | 403 | Caller does not have the required platform remit |

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
