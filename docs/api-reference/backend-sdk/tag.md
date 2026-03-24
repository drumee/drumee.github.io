---
id: tag
title: tag API
sidebar_label: tag
---

# TAG API Reference

## Module Information

**Service Files:**
- Private: `service/private/tag.js`
- Public: `service/tag.js`

**Available Services:** 4
**Documented Services:** 4

---

## tag.list

List tags paginated by language. Reads the language from the Xlang input or falls back to the session language. Only 'zh', 'fr', and 'en' are accepted; any other value defaults to 'en'. Calls tag_list_by_lang stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/tag.list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | `1` | - |
| `Xlang` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## tag.get_by_name

Search for tags by name with pagination. Calls tag_get_by_name stored procedure with the provided name and page number.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/tag.get_by_name
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | - |
| `page` | `integer` | No | `1` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## tag.store

Create or update a tag record. Resolves the tag identifier from hashtag input or falls back to id. Calls tag_save stored procedure with sys_id, tag id, lang_code array, type, and name. Returns the saved tag data on success. Throws INVALID_DATA if the tag ID is not found, or INTERNAL_ERROR for other failures.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/tag.store
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `serial` | `integer` | No | `0` | - |
| `hashtag` | `string` | No | - | - |
| `id` | `string` | No | - | - |
| `lang_code` | `string` | No | `"[]"` | - |
| `type` | `string` | **Yes** | - | - |
| `name` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | - | Tag ID was not found in the system |
| `INTERNAL_ERROR` | - | An internal server error occurred during tag save |

---

## tag.delete

Delete a tag by its system serial ID. Calls tag_delete stored procedure with the serial number.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/tag.delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `serial` | `integer` | **Yes** | - | - |

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
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
