---
id: support
title: support API
sidebar_label: support
---

# SUPPORT API Reference

## Module Information

**Service Files:**
- Private: `service/private/support.js`
- Public: `service/support.js`

**Available Services:** 3
**Documented Services:** 3

---

## support.bug_report

Submit a bug report from the current user. Reads all fields from the vars input object, serializes any nested objects to JSON strings, then calls the support_bug_report stored procedure with the extracted fields.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/support.bug_report
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `vars` | `object` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## support.leave_comment

Submit a feedback comment. Calls feedback_create stored procedure with the provided message. Available to anonymous users.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/support.leave_comment
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## support.list_feedback

List all submitted feedback with sorting and pagination. Requires special_access preproc with remit level 1. Calls support_list_feedback stored procedure with column, order, and page parameters.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |
| **Pre-check** | `special_access` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/support.list_feedback
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | - | - |
| `sort_by` | `string` | No | `"date"` | - |
| `order` | `string` | No | `"desc"` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
