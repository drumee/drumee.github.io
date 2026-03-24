---
id: mfs_import
title: mfs_import API
sidebar_label: mfs_import
---

# MFS_IMPORT API Reference

## Module Information

**Service Files:**
- Private: `service/private/mfs_import.js`

**Available Services:** 2
**Documented Services:** 2

---

## mfs_import.import_folder

Import entire folder recursively from another Drumee instance

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/mfs_import.import_folder
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `source_url` | `string` | **Yes** | - | - |
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |
| `token` | `string` | **Yes** | - | - |
| `dest_nid` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `missing_parameters` | - | source_url, hub_id, nid, and token are required |
| `invalid_dest` | - | Invalid destination folder ID |
| `internal_error` | - | Failed to import: error message from exception |

---

## mfs_import.import_file

Import single file from another Drumee instance

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/mfs_import.import_file
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `source_url` | `string` | **Yes** | - | - |
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |
| `token` | `string` | **Yes** | - | - |
| `dest_nid` | `string` | No | - | - |
| `filename` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `missing_parameters` | - | source_url, hub_id, nid, and token are required |
| `invalid_dest` | - | Invalid destination folder ID |
| `node_not_found` | - | File not found in source |
| `internal_error` | - | Failed to import file: error message from exception |

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
