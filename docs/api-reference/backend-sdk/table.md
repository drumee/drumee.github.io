---
id: table
title: table API
sidebar_label: table
---

# TABLE API Reference

## Module Information

**Service Files:**
- Private: `service/private/table.js`

**Available Services:** 4
**Documented Services:** 4

---

## table.insert_row

Insert a row into a custom hub table. Looks up the table by name or id, then calls custom_row_insert with the values array serialized as JSON. Values must be provided as an array; rejects with '_values_must_be_array' if not.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/table.insert_row
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | No | - | - |
| `id` | `string` | No | - | - |
| `values` | `array` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `_values_must_be_array` | - | The values parameter must be an array |

---

## table.create_table

Create a custom table attached to the current hub. Registers the table via custom_table_register, then executes a CREATE TABLE query built from the provided column and key definitions. Column types supported: mediumtext, enum, int, integer, float, and varchar/other string types. Key types can be PRIMARY, UNIQUE, INDEX, or empty.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/table.create_table
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | - |
| `columns` | `array` | **Yes** | - | - |
| `keys` | `array` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `QUERY ERROR` | - | CREATE TABLE query execution failed |

---

## table.delete_table

Delete a registered custom table by name. Calls custom_table_delete stored procedure with the table name.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/table.delete_table
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## table.fetch

Fetch rows from a custom hub table with optional column selection, filtering, ordering, and pagination. Looks up the table via custom_table_get, then executes a SELECT query with sanitized column, filter, and order clauses. Supports both page-based and limit-based result capping. Column, filter, and order tokens are sanitized to prevent injection.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/table.fetch
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | No | - | - |
| `id` | `string` | No | - | - |
| `columns` | `array` | No | `["*"]` | - |
| `filter` | `array` | No | - | - |
| `order` | `array` | No | - | - |
| `page` | `integer` | No | - | - |
| `page_length` | `integer` | No | `15` | - |
| `limit` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `name is required` | - | Neither name nor id was provided |
| `QUERY ERROR` | - | SELECT query execution failed |

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
