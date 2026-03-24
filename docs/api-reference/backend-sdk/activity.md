---
id: activity
title: activity API
sidebar_label: activity
---

# ACTIVITY API Reference

## Module Information

**Service Files:**
- Private: `service/private/activity.js`

**Available Services:** 7
**Documented Services:** 7

---

## activity.get_unread_count

Get count of unread MFS notifications for current user. Queries the mfs_ack table to calculate how many changelog entries the user hasn't read yet.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/activity.get_unread_count
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## activity.mark_all_read

Mark all MFS notifications as read for current user. Updates the mfs_ack table with the last read changelog ID. If no last_id provided, uses the latest changelog ID from database.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/activity.mark_all_read
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `last_id` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DB_PROC_FAILED` | - | Failed to mark as read |

---

## activity.get_feed

Get paginated activity feed with read/unread status. Returns MFS changelog entries with pagination (45 items per page by default). Each item includes read status based on user's mfs_ack.last_read_id.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/activity.get_feed
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
| `items` | `object` | - |
| `items.id` | `integer` | - |
| `items.action` | `string` | - |
| `items.nid` | `string` | - |
| `items.file_name` | `string` | - |
| `items.author_id` | `string` | - |
| `items.ctime` | `integer` | - |
| `items.is_read` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## activity.get_last_read

Get last read changelog ID for current user. Queries the mfs_ack table from user's database to retrieve the last changelog ID the user has marked as read.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/activity.get_last_read
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `USER_DB_NOT_FOUND` | - | User database not found |

---

## activity.acknowledge_file

Mark a specific file/folder as seen. Updates the mfs_ack table with the changelog ID corresponding to this file/folder. Triggers WebSocket notification to update UI. Replaces old media.mark_as_seen which used JSON metadata.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/activity.acknowledge_file
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_NID` | - | Parameter 'nid' is required |
| `DB_PROC_FAILED` | - | File not acknowledged |

---

## activity.log

Get unified activity log (contacts + MFS) with priority sorting. Contact events are shown first, followed by MFS events. Pagination: 45 items per page. This provides a comprehensive activity timeline across both contact management and file operations.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/activity.log
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
| `items` | `object` | - |
| `items.id` | `integer` | - |
| `items.event_type` | `string` | - |
| `items.author_id` | `string` | - |
| `items.target_id` | `string` | - |
| `items.metadata` | `object` | - |
| `items.ctime` | `integer` | - |
| `items.is_read` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## activity.folder_log

Get activity log for a specific folder. Shows all MFS events (upload, delete, move, copy, rename, etc.) related to a specific folder/node. Useful for tracking file activity within a particular directory. Pagination: 45 items per page.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/activity.folder_log
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | - |
| `page` | `integer` | No | `1` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.id` | `integer` | - |
| `items.action` | `string` | - |
| `items.nid` | `string` | - |
| `items.file_name` | `string` | - |
| `items.author_id` | `string` | - |
| `items.ctime` | `integer` | - |
| `items.is_read` | `integer` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_NID` | - | Parameter 'nid' is required |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
