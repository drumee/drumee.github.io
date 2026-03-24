---
id: seo
title: seo API
sidebar_label: seo
---

# SEO API Reference

## Module Information

**Service Files:**
- Private: `service/seo.js`
- Public: `service/seo.js`

**Available Services:** 2
**Documented Services:** 2

---

## seo.create

Build a full-text search index for a granted document or image node. Checks the node filetype via source_granted() and triggers Document.buildIndex only for document or image types. Returns the node object if indexed, or an empty object if the filetype is not indexable.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/seo.create
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

*Error codes not documented*

---

## seo.find

Search indexed nodes using full-text keyword matching. Splits the search string on whitespace and common punctuation delimiters, then queries the seo_search stored procedure with the resulting word array. Returns an empty array immediately if the search string is blank. Results are paginated.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/seo.find
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `string` | `string` | No | `""` | - |
| `page` | `integer` | No | `1` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.id` | `string` | - |
| `items.filename` | `string` | - |
| `items.filetype` | `string` | - |

### Possible Errors

*Error codes not documented*

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
