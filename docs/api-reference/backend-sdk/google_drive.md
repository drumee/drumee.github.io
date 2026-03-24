---
id: google_drive
title: google_drive API
sidebar_label: google_drive
---

# GOOGLE_DRIVE API Reference

## Module Information

**Service Files:**
- Private: `service/private/google_drive.js`

**Available Services:** 3
**Documented Services:** 3

---

## google_drive.list_files

List files/folders from Google Drive

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.list_files
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `folder_id` | `string` | No | `"root"` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `OAUTH_TOKEN_EXPIRED` | - | OAuth Token is invalid or expired. Please re-authenticate. |
| `INTERNAL_ERROR` | - | Failed to list Google Drive files. |

---

## google_drive.import_file

Import a single file from Google Drive

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.import_file
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAMETERS` | - | Missing 'file_id' or 'nid' (destination folder ID) parameter. |
| `INVALID_DESTINATION` | - | Invalid destination folder ID (nid). |
| `FILE_NOT_EXPORTABLE` | - | This file type is not directly downloadable or exportable. |
| `METADATA_FETCH_FAILED` | - | Failed to get Google file metadata. |
| `OAUTH_TOKEN_EXPIRED` | - | OAuth Token is invalid or expired. Please re-authenticate. |

---

## google_drive.import_directory

Import entire directory recursively from Google Drive

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/google_drive.import_directory
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `folder_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAMETERS` | - | Missing 'folder_id' or 'nid' (destination folder ID) parameter. |
| `INVALID_DESTINATION` | - | Invalid destination folder ID. |
| `INTERNAL_ERROR` | - | Failed to import directory due to a fatal error during the recursive import process. |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
