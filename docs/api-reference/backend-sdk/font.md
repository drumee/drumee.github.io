---
id: font
title: font API
sidebar_label: font
---

# FONT API Reference

## Module Information

**Service Files:**
- Private: `service/font.js`
- Public: `service/font.js`

**Available Services:** 3
**Documented Services:** 3

---

## font.font_list

Retrieve a paginated list of all available fonts on the platform. Calls stored procedure font_list with the requested page number. Results are paginated server-side.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/font.font_list
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
| `INTERNAL_ERROR` | - | Database error executing stored procedure font_list |

---

## font.search

Search fonts by name or keyword using a paginated full-text search. Calls stored procedure plf_search_fonts with the search value and page number. Returns fonts matching the query string.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/font.search
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `string` | No | `"a"` | - |
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
| `INTERNAL_ERROR` | - | Database error executing stored procedure plf_search_fonts |

---

## font.files

Retrieve the list of all font files available on the platform. Calls stored procedure font_get_files with no additional parameters. Returns file records for all registered font assets.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/font.files
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
| `INTERNAL_ERROR` | - | Database error executing stored procedure font_get_files |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
