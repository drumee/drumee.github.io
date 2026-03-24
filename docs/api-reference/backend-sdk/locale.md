---
id: locale
title: locale API
sidebar_label: locale
---

# LOCALE API Reference

## Module Information

**Service Files:**
- Private: `service/private/locale.js`
- Public: `service/locale.js`

**Available Services:** 9
**Documented Services:** 9

---

## locale.add

Add a new internationalisation key with translations for all supported languages. The key_code is normalised before insertion: server category keys are lowercased and prefixed with underscore if missing, all other category keys are uppercased. Inserts one row per supported language via stored procedure intl_add_next, then returns the full newly created entry.

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/locale.add
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `values` | `object` | **Yes** | - | - |
| `category` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_VALUES` | - | values parameter is required but was not provided |
| `MISSING_CATEGORY` | - | category parameter is required but was not provided |
| `INTERNAL_ERROR` | - | Failed to insert locale entries via stored procedure intl_add_next |

---

## locale.build

Rebuild all locale JSON files on the filesystem from the database. Iterates over all application types (ui, server, transfer, electron-web, electron-main, liceman, sandbox) and all supported languages, calling stored procedure get_locale_next for each combination, then writes the result to static_dir/locale/TYPE/LANG.json. Also writes the file format registry to static_dir/dataset/files-formats.json. This operation overwrites existing locale files.

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | modify |

**Endpoint:**
```
https://hostname/-/svc/locale.build
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
| `INTERNAL_ERROR` | - | Failed to fetch locale data or write locale files to filesystem |

---

## locale.delete

Delete an internationalisation key and all its language entries from the database. Calls stored procedure intl_delete_next with the key and type. Returns the deleted key code.

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | modify |

**Endpoint:**
```
https://hostname/-/svc/locale.delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | `string` | **Yes** | - | - |
| `type` | `string` | No | `"ui"` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_KEY` | - | key parameter is required but was not provided |
| `INTERNAL_ERROR` | - | Failed to delete locale entry via stored procedure intl_delete_next |

---

## locale.keys

List available internationalisation key codes matching an optional filter string and category. Calls stored procedure intl_keys_next. Returns a flat list of matching key records.

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/locale.keys
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | `string` | No | `""` | - |
| `category` | `string` | No | `"ui"` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | - | Failed to query locale keys via stored procedure intl_keys_next |

---

## locale.get

Retrieve a single internationalisation entry by key code and type. Calls stored procedure intl_get_next. The type parameter falls back to the category parameter if type is not provided.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/locale.get
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | `string` | No | `""` | - |
| `type` | `string` | No | `"ui"` | - |
| `category` | `string` | No | `"ui"` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | - | Failed to query locale entry via stored procedure intl_get_next |

---

## locale.group

Retrieve all internationalisation entries belonging to a named group. Calls stored procedure intl_get_by_group using a synchronous callback pattern. Returns grouped locale data for the specified group name.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/locale.group
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
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_NAME` | - | name parameter is required but was not provided |
| `INTERNAL_ERROR` | - | Failed to query locale group via stored procedure intl_get_by_group |

---

## locale.list

List internationalisation entries for a given category with pagination. Calls stored procedure intl_list_next and groups results by key_code so each returned object contains all language translations for that key.

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/locale.list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | `1` | - |
| `category` | `string` | No | `"ui"` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | - | Failed to query locale list via stored procedure intl_list_next |

---

## locale.search

Search internationalisation entries by value string and category with pagination. Calls stored procedure intl_search_next and groups results by key_code, returning one object per matching key containing all language translations.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/locale.search
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `string` | No | `""` | - |
| `category` | `string` | No | `"ui"` | - |
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
| `INTERNAL_ERROR` | - | Failed to query locale search via stored procedure intl_search_next |

---

## locale.update

Update an internationalisation entry value. When id is provided, updates the entry directly by ID via stored procedure intl_update_by_id_next. When id is not provided, first creates the entry via intl_add_next using category, lang, and code, then updates it. Returns the entry context with previous, current, and next sibling records for navigation.

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | modify |

**Endpoint:**
```
https://hostname/-/svc/locale.update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `string` | **Yes** | - | - |
| `id` | `string` | No | - | - |
| `category` | `string` | No | - | - |
| `lang` | `string` | No | - | - |
| `code` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_VALUE` | - | value parameter is required but was not provided |
| `MISSING_CATEGORY` | - | category is required when id is not provided |
| `MISSING_LANG` | - | lang is required when id is not provided |
| `MISSING_CODE` | - | code is required when id is not provided |
| `INTERNAL_ERROR` | - | Failed to update locale entry via stored procedure intl_update_by_id_next |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
