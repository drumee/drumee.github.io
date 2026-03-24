---
id: mfs
title: mfs API
sidebar_label: mfs
---

# MFS API Reference

## Module Information

**Service Files:**
- Private: `service/mfs.js`
- Public: `service/mfs.js`

**Available Services:** 3
**Documented Services:** 3

---

## mfs.server_export

Export files/folders to server filesystem for cross-Drumee transfer or backup

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/mfs.server_export
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | WebSocket ID for progress notifications |
| `destination` | `string` | **Yes** | - | Server filesystem destination path |
| `transactionid` | `string` | **Yes** | - | Unique transaction identifier for tracking |
| `nodes` | `array<object>` | **Yes** | - | Array of node objects with nid and hub_id |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `granted` | `array<object>` | Array of granted node objects |
| `granted[].nid` | `string` | Node ID |
| `granted[].hub_id` | `string` | Hub ID |
| `dest_path` | `string` | Destination path on server |
| `uid` | `string` | User ID executing export |
| `socket_id` | `string` | WebSocket ID for progress updates |
| `transactionid` | `string` | Transaction identifier |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `PERMISSION_DENIED` | 403 | User does not have permission to export these nodes |
| `INVALID_DESTINATION` | 400 | Destination path is invalid or not writable |
| `NODE_NOT_FOUND` | 404 | One or more nodes do not exist |

---

## mfs.server_import

Import files/folders from server filesystem into MFS

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/mfs.server_import
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | WebSocket ID for progress notifications |
| `source_list` | `array<string>` | No | `["/data/sample-1/"]` | Array of server filesystem source paths |
| `transactionid` | `string` | **Yes** | - | Unique transaction identifier for tracking |
| `pid` | `string` | No | `"0"` | Parent node ID where files will be imported (0 for root) |
| `recipient_id` | `string` | No | - | Target hub ID (defaults to current hub) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `pid` | `string` | Parent node ID |
| `recipient_id` | `string` | Target hub ID |
| `source_list` | `array<string>` | Source paths being imported |
| `uid` | `string` | User ID executing import |
| `socket_id` | `string` | WebSocket ID for progress updates |
| `transactionid` | `string` | Transaction identifier |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `PERMISSION_DENIED` | 403 | User does not have write permission on target location |
| `INVALID_SOURCE` | 400 | Source path does not exist or is not readable |
| `PARENT_NOT_FOUND` | 404 | Parent node does not exist |
| `INSUFFICIENT_STORAGE` | 507 | Not enough storage quota available |

---

## mfs.node_summary

Get comprehensive node/folder information including file count, members, total size, and timestamps

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/mfs.node_summary
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string (pattern: `^[a-z0-9]{16}$`)` | **Yes** | - | Hub ID containing the node |
| `nid` | `string (pattern: `^[a-z0-9]{16}$`)` | **Yes** | - | Node ID (file or folder) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `file_count` | `number` | Total number of files (recursive for folders) |
| `members` | `array<object>` | Array of users with permission on this node |
| `members[].entity_id` | `string` | User ID |
| `members[].permission` | `number` | Permission level (0=none, 2=read, 4=write, 6=admin, 7=owner) |
| `total_size` | `number` | Total size in bytes (recursive for folders) |
| `ctime` | `number` | Creation timestamp (upload_time) |
| `mtime` | `number` | Most recent modification timestamp (publish_time) |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NODE_NOT_FOUND` | 404 | Node does not exist |
| `PERMISSION_DENIED` | 403 | User does not have read permission on this node |
| `INVALID_HUB_ID` | 400 | Hub ID format is invalid |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
