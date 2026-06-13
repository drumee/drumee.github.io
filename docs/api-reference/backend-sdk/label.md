---
id: label
title: label API
sidebar_label: label
---

# LABEL API Reference

## Module Information

**Service Files:**
- Private: `service/private/label.js`

**Available Services:** 4
**Documented Services:** 4

---

## label.list

List all labels in the current hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/label.list
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.id` | `string` | Label ID |
| `items.name` | `string` | Label name |
| `items.color` | `string` | Hex color including leading # |
| `items.created_by` | `string` | UID of the creator |
| `items.ctime` | `number` | Unix timestamp of creation |
| `items.mtime` | `number` | Unix timestamp of last update |

---

## label.create

Create a new label in the current hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/label.create
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | Label name (must be unique within the hub) |
| `color` | `string (pattern: `^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$`)` | No | `"#AEAEB2"` | Hex color including leading #. Defaults to #AEAEB2. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_COLOR` | 400 | color must be a valid hex string starting with # |

---

## label.update

Update a label's name and/or color. Omit a field to keep its existing value.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/label.update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Label ID |
| `name` | `string` | No | - | New label name |
| `color` | `string (pattern: `^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$`)` | No | - | New hex color including leading # |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `LABEL_NOT_FOUND` | 404 | No label found with the given ID |
| `INVALID_COLOR` | 400 | color must be a valid hex string starting with # |

---

## label.delete

Delete a label permanently. All task_label associations are removed.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/label.delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Label ID |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

---

## Related Documentation

- [ACL System](../../technology/02-acl-system.md) - Permission model
- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference
- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed
- [Error Handling](../../product-guides/05-error-handling.md) - Error codes
