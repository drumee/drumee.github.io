---
id: activity
title: activity API
sidebar_label: activity
---

# ACTIVITY API Reference

## Module Information

**Service Files:**
- Private: `service/private/activity.js`

**Available Services:** 14
**Documented Services:** 14

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
| **Permission** | Write (8) |

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
| **Permission** | Write (8) |

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

## activity.dismiss

Dismiss a single activity notification so it no longer appears in the feed.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/activity.dismiss
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `changelog_id` | `integer` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

---

## activity.dismiss_contact_event

Dismiss a single contact_activity row (hub invite, contact invite, etc.) so it no longer appears in the activity feed. Stamps yp.contact_activity.dismissed_at without deleting the underlying audit row.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/activity.dismiss_contact_event
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `activity_id` | `integer` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

---

## activity.list

Single-call notification feed combining notification_center rollups + standalone hub-invite rows. Returns a flat array; client renders by `category` (chat | contact | media | teamchat | ticket | hub_invite).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/activity.list
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `items` | `object` | - |
| `items.category` | `string` | - |
| `items.key_id` | `string` | - |
| `items.hub_id` | `string` | - |
| `items.last_id` | `integer` | - |
| `items.cnt` | `integer` | - |
| `items.ctime` | `integer` | - |

---

## activity.dismiss_rollup

Alias of notification_dismiss under the consolidated activity.* API. Hides a rollup row from the feed. Allowed to all mebers

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/activity.dismiss_rollup
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | `string` | **Yes** | - | - |
| `key_id` | `string` | **Yes** | - | - |
| `hub_id` | `string` | No | - | - |
| `last_id` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |

---

## activity.read

Mark a rollup as read (advance read pointer) without hiding it. For chat/teamchat/ticket this is identical to dismiss; for media we only advance mfs_ack; for contact this is a no-op (use dismiss to hide).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/activity.read
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | `string` | **Yes** | - | - |
| `key_id` | `string` | **Yes** | - | - |
| `hub_id` | `string` | No | - | - |
| `last_id` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |

---

## activity.create

Publish a new notification via the activity.* namespace. Routes by category to the underlying table (mfs_changelog for media, contact_activity for invites). chat/teamchat/ticket are not supported here — use the domain endpoint (chat.post / channel.post / ticket.post).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/activity.create
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | `string` | **Yes** | - | - |
| `key_id` | `string` | **Yes** | - | - |
| `hub_id` | `string` | No | - | - |
| `payload` | `object` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |

---

## activity.notification_dismiss

Unified dismiss for any rollup returned by drumate.notification_center. Routes by category to the right read-pointer/status update (chat → p2p_read, contact → contact.dismissed_at, media → mfs_dismissed, teamchat → &lt;hub&gt;.read_channel, ticket → yp.read_ticket_channel).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/activity.notification_dismiss
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | `string` | **Yes** | - | - |
| `key_id` | `string` | **Yes** | - | - |
| `hub_id` | `string` | No | - | - |
| `last_id` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

---

## Related Documentation

- [ACL System](../../technology/02-acl-system.md) - Permission model
- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference
- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed
- [Error Handling](../../product-guides/05-error-handling.md) - Error codes
