---
id: dropbox
title: dropbox API
sidebar_label: dropbox
---

# DROPBOX API Reference

## Module Information

**Service Files:**
- Private: `service/private/dropbox.js`

**Available Services:** 3
**Documented Services:** 3

---

## dropbox.list_files

List files and folders at a given path in the connected Dropbox account. Calls the Dropbox files/list_folder API with a limit of 100 entries. Requires a valid OAuth access token retrieved via the dropbox provider.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/dropbox.list_files
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `path` | `string` | No | `""` | Dropbox folder path to list. Defaults to the root folder (empty string) when not provided. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Always true on a successful Dropbox API response |
| `files` | `array<object>` | Array of Dropbox file and folder entry objects returned by the files/list_folder API |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `UNAUTHORIZED` | 401 | OAuth token is invalid or expired. Please re-authenticate. |
| `INTERNAL_ERROR` | 500 | Failed to list Dropbox files |

---

## dropbox.import_file

Import a single file from Dropbox into a Drumee MFS destination folder. Retrieves a temporary download link from the Dropbox files/get_temporary_link API, resolves the destination folder via mfs_node_attr, and imports the file using the internal ExtImport file import mechanism.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/dropbox.import_file
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file_id` | `string` | **Yes** | - | Dropbox file path or ID passed to the files/get_temporary_link API to obtain a download URL |
| `nid` | `string` | **Yes** | - | Destination MFS node ID (folder) in Drumee where the imported file will be stored. Resolved via mfs_node_attr. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Always true on successful import |
| `node` | `object` | The newly created MFS node record for the imported file, as returned by the internal import mechanism |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | Missing file_id or nid (destination folder ID) parameter |
| `INTERNAL_ERROR` | 500 | Failed to get Dropbox file metadata or temporary download link |
| `INVALID_DESTINATION` | 400 | Invalid destination folder ID (nid) |

---

## dropbox.import_directory

Recursively import an entire Dropbox folder and its contents into a Drumee MFS destination folder. Lists all items via the Dropbox files/list_folder API with cursor-based pagination (limit 2000), creates matching folder structures in Drumee, and imports each file using temporary download links. Returns import statistics including counts of folders created, files imported, items skipped, and any per-item errors.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/dropbox.import_directory
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `folder_path` | `string` | **Yes** | - | Dropbox folder path to import recursively (e.g. /Documents/Project). Passed to the files/list_folder API. |
| `nid` | `string` | **Yes** | - | Destination MFS node ID (folder) in Drumee where the imported directory tree will be created. Resolved via mfs_node_attr. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Always true when the top-level import completes without a fatal error |
| `folders` | `number` | Total number of folders created in Drumee during the recursive import |
| `files` | `number` | Total number of files successfully imported into Drumee |
| `skipped` | `number` | Total number of items skipped during the import |
| `errors` | `array<object>` | List of per-item error records for files or folders that failed to import. Does not cause the overall operation to fail. |
| `errors[].file` | `string` | File name that failed (present for file-level errors) |
| `errors[].item` | `string` | Item name that failed (present for item-level errors) |
| `errors[].error` | `string` | Error message describing the failure |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | Missing folder_path or nid (destination folder ID) parameter |
| `INVALID_DESTINATION` | 400 | Invalid destination folder ID (nid) |
| `INTERNAL_ERROR` | 500 | Failed to import directory from Dropbox |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
