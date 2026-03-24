---
id: blacklist
title: blacklist API
sidebar_label: blacklist
---

# BLACKLIST API Reference

## Module Information

**Service Files:**
- Private: `service/private/blacklist.js`

**Available Services:** 3
**Documented Services:** 3

---

## blacklist.add

Add one or more email addresses to the hub blacklist. A single email string is automatically normalized to an array before being JSON-serialized and passed to the blacklist_add stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/blacklist.add
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string|array` | **Yes** | - | Email address or array of email addresses to blacklist. A single string value is automatically wrapped in an array. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Result returned by the blacklist_add stored procedure |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | email is required |
| `PERMISSION_DENIED` | 403 | Caller does not have owner permission on this hub |

---

## blacklist.delete

Remove one or more email addresses from the hub blacklist. A single email string is automatically normalized to an array before being passed to the blacklist_delete stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/blacklist.delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string|array` | **Yes** | - | Email address or array of email addresses to remove from the blacklist. A single string value is automatically wrapped in an array. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Result returned by the blacklist_delete stored procedure |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | email is required |
| `PERMISSION_DENIED` | 403 | Caller does not have owner permission on this hub |

---

## blacklist.show

List all blacklisted email addresses for the current hub, paginated via the blacklist_show stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/blacklist.show
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination. Defaults to 1 when not provided. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `array<object>` | Paginated list of blacklisted email records returned by the blacklist_show stored procedure |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `PERMISSION_DENIED` | 403 | Caller does not have owner permission on this hub |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
