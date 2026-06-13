---
id: channel
title: channel API
sidebar_label: channel
---

# CHANNEL API Reference

## Module Information

**Service Files:**
- Private: `service/private/channel.js`
- Public: `service/channel.js`

**Available Services:** 26
**Documented Services:** 26

---

## channel.acknowledge

Mark a specific channel message as read/acknowledged by the current user. Broadcasts the updated message state to all other participants in the hub via WebSocket, excluding the sender's socket.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.acknowledge
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message_id` | `string` | No | - | ID of the message to acknowledge |
| `socket_id` | `string` | **Yes** | - | Caller's WebSocket socket ID. Used to exclude the caller from the broadcast recipients. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.acknowledge_ticket

Mark a support ticket message as read/acknowledged. Broadcasts the acknowledgement to all support domain members and to the current user's own sockets.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.acknowledge_ticket
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message_id` | `string` | No | - | ID of the ticket message to acknowledge |
| `ticket_id` | `string` | **Yes** | - | ID of the ticket that contains the message |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.clear_notifications

Clear all channel notifications for the current user. Broadcasts an empty payload to the user's sockets and clears the notification records in the database.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/channel.clear_notifications
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.delete

Delete one or more channel messages. Supports two deletion modes: me (hide from the current user only) or all (delete for all participants, restricted to message author). Broadcasts deletions to hub participants and cleans up any attached files from the file system.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `option` | `string` | **Yes** | - | Deletion scope. Must be me (hide for current user only) or all (delete for all, author only). |
| `messages` | `array` | **Yes** | - | Array of message IDs to delete |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_OPTION` | 400 | option is not me or all, or option is all but current user is not the message author |
| `INVALID_MESSAGES` | 404 | One or more provided message IDs do not exist |

---

## channel.enter

Public channel entry point. Accepts an optional message payload and echoes it back. Used for DMZ or guest-level channel access.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/channel.enter
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | `string` | No | - | Optional message content. Defaults to empty string. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.list_tickets

List support tickets for the current user with optional status filter, pagination, and ticket ID search. Retrieves tickets from the user's sharebox (wicket) hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.list_tickets
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | `array` | No | - | Array of status values to filter by. Defaults to new. |
| `page` | `number` | No | - | Page number for pagination (default: 1) |
| `ticket_id` | `string` | No | - | Optional ticket ID to search for a specific ticket within the results |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.live_message

Public live message endpoint. Accepts an optional message payload and echoes it back. Used for real-time guest or DMZ channel interactions.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/channel.live_message
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | `string` | No | - | Optional message content. Defaults to empty string. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.messages

Retrieve paginated channel messages for the current hub. Enriches each message with author contact information, thread context for replies, and broadcasts an acknowledge signal to all other hub participants.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.messages
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `order` | `string` | No | - | Sort order for messages. asc for oldest first, desc for newest first. Defaults to asc. |
| `page` | `number` | No | - | Page number for pagination (default: 1) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.entity` | `object` | Author contact information from shareroom_contact_get procedure. For messages by the current user, contains only id. |
| `items.thread` | `object` | Thread context object if the message is a reply (only present when thread_id is set) |

### Possible Errors

*Error codes not documented*

---

## channel.notify

Retrieve channel notification data for the current user. Alias for notify_chat.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/channel.notify
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.post

Post a new message to the current hub channel. Supports text messages, threaded replies, and file attachments. Moves attachment files to the appropriate sharebox directory and broadcasts the new message to all hub participants except the sender.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.post
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | `string` | No | - | Text content of the message. Defaults to empty string. Single quotes are automatically escaped. |
| `thread_id` | `string` | No | - | Message ID of the parent message to reply to. Creates a threaded reply when provided. |
| `attachment` | `array` | No | - | Array of file node IDs to attach to the message. Files are moved to the message directory in the sharebox hub. |
| `nid` | `string` | No | - | Folder node ID for folder-scoped posts. Scopes the message to that folder and enables folder_attachment promotion. |
| `folder_attachment` | `array` | No | - | Subset of attachment: staged device uploads to move into the folder identified by nid on send. Each node must sit in the hub chat staging directory, be owned by the caller, and the caller must hold write permission on the destination folder; otherwise the node is kept as a regular sbox-only attachment. |
| `socket_id` | `string` | **Yes** | - | Caller's WebSocket socket ID. Used to exclude the caller from the broadcast recipients. |
| `echoId` | `string` | No | - | Client-side echo identifier for optimistic UI updates |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.post_ticket

Post a reply message to an existing support ticket. Supports threaded replies and file attachments. Broadcasts the new message to the ticket owner and all support domain members.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.post_ticket
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `ticket_id` | `string` | **Yes** | - | ID of the ticket to post a reply to |
| `message` | `string` | No | - | Text content of the reply. Defaults to empty string. |
| `thread_id` | `string` | No | - | Message ID of the parent message to reply to within the ticket thread |
| `attachment` | `array` | No | - | Array of file node IDs to attach to the ticket reply |
| `echoId` | `string` | No | - | Client-side echo identifier for optimistic UI updates |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_TICKET` | 404 | No ticket found with the given ticket_id |

---

## channel.read

Mark all messages in a channel as read up to a given message ID for the current user.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.read
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | No | - | Message ID up to which all messages are marked as read via channel_read_messages procedure |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.send_ticket

Create a new support ticket with an initial message. Optionally includes file attachments, category tags, affected areas, and recurrence flag. Automatically sends an auto-reply, broadcasts to the ticket owner and all support domain members.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.send_ticket
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | `string` | **Yes** | - | Initial ticket message content. Single quotes are automatically escaped. |
| `category` | `array` | **Yes** | - | Array of category tags for the ticket (e.g. tech, design, enhancement, notunderstand) |
| `attachment` | `array` | No | - | Array of file node IDs to attach to the ticket. Defaults to empty array. |
| `where` | `array` | No | - | Array of platform area identifiers where the issue occurred (e.g. desktop, chat, teamroom). Defaults to empty array. |
| `alltime` | `number` | No | - | Flag indicating if the issue is recurring. Defaults to 0. |
| `echoId` | `string` | No | - | Client-side echo identifier for optimistic UI updates |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.show_ticket

Retrieve the full message thread for a support ticket including author contact enrichment, metadata parsing, category and location display labels, and thread context for replies. Broadcasts acknowledgement signals to support members for newly read messages.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.show_ticket
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `ticket_id` | `string` | **Yes** | - | ID of the ticket whose messages to retrieve |
| `page` | `number` | No | - | Page number for pagination (default: 1) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.entity` | `object` | Author contact information from shareroom_contact_get procedure |
| `items.metadata` | `object` | Parsed message metadata including category_display and where_display label arrays for ticket messages |
| `items.thread` | `object` | Thread context object if the message is a reply |

### Possible Errors

*Error codes not documented*

---

## channel.to_read

Get the number of unread message pages for the current user in the channel. Alias for pages_to_read.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.to_read
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## channel.update_ticket

Update the metadata (e.g. status) of an existing support ticket. Restricted to users belonging to the configured support domain. Broadcasts the updated ticket to the ticket owner and all support domain members.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/channel.update_ticket
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `ticket_id` | `string` | **Yes** | - | ID of the ticket to update |
| `status` | `string` | No | - | New status value to set on the ticket metadata |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DOMAIN` | 403 | Current user does not belong to the configured support domain |
| `INVALID_TICKET` | 404 | No ticket found with the given ticket_id |

---

## channel.write

Post a new message to a share hub channel. Intended for use in DMZ (share hub) context where the author may be an anonymous guest identified via yp.dmz_user. Requires chat permission (read + write combined, value 6). Supports threaded replies and file attachments. Broadcasts the new message to all hub participants except the sender.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Chat (6) |

**Endpoint:**
```
https://hostname/-/svc/channel.write
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message_id` | `string` | **Yes** | - | Client-generated unique message ID (16-char hex). Must be unique across the channel table. |
| `message` | `string` | No | - | Text content of the message. Defaults to empty string. |
| `thread_id` | `string` | No | - | Message ID of the parent message to reply to. Creates a threaded reply when provided. |
| `attachment` | `array` | No | - | Array of file node IDs to attach to the message. |
| `is_forward` | `number` | No | - | Forward flag. Set to 1 if this message is forwarded from another source. Defaults to 0. |
| `socket_id` | `string` | **Yes** | - | Caller's WebSocket socket ID. Used to exclude the caller from the broadcast recipients. |
| `echoId` | `string` | No | - | Client-side echo identifier for optimistic UI updates. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | message_id or socket_id is missing |

---

## channel.list_notifications

Retrieve paginated notification list for the current user aggregated across all their hubs. Supports filtering by type (all, mention, share) and an unread-only toggle. Iterates all active hubs owned by the current user, calls channel_list_notifications per hub, merges and sorts results by ctime DESC. Returns only messages where the current user is in the delivered recipients list, excluding own messages and soft-deleted messages.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.list_notifications
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `string` | No | - | Notification filter type. Accepted values: all (default) — all activity directed at current user; mention — messages where current user's ID is in mention_ids; share — forwarded messages (is_forward = 1) or messages with file attachments. |
| `unread_only` | `number` | No | - | Set to 1 to return only unread notifications (current user not yet in _seen_). Defaults to 0 (return all). |
| `page` | `number` | No | - | Page number for pagination (default: 1). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.sys_id` | `number` | Message sequence ID |
| `items.author_id` | `string` | ID of the message author |
| `items.message` | `string` | Message text content |
| `items.message_id` | `string` | Unique message identifier |
| `items.thread_id` | `string` | Parent message ID if this is a reply |
| `items.is_forward` | `number` | 1 if message is forwarded, 0 otherwise |
| `items.attachment` | `string` | JSON-encoded attachment array, null if none |
| `items.is_attachment` | `number` | 1 if message has attachments, 0 otherwise |
| `items.mention_ids` | `array` | Array of user IDs mentioned in this message, null if none |
| `items.ctime` | `number` | Unix timestamp when the message was posted |
| `items.firstname` | `string` | Author first name (from yp.drumate) or display name (from yp.dmz_user for anonymous guests) |
| `items.lastname` | `string` | Author last name, empty string for anonymous guests |
| `items.fullname` | `string` | Author full name |
| `items.is_read` | `number` | 1 if current user has seen this message, 0 if unread |

### Possible Errors

*Error codes not documented*

---

## channel.bookmark_add

Pin a notification message for quick access. Bookmarks live in the caller's drumate DB so any authenticated user with read access to the hub may bookmark a message they can see.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.bookmark_add
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message_id` | `string` | **Yes** | - | Unique message ID to bookmark (from channel table) |
| `hub_id` | `string` | **Yes** | - | Hub ID where the message lives |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Bookmark record ID |
| `message_id` | `string` | Bookmarked message ID |
| `hub_id` | `string` | Hub the message belongs to |
| `ctime` | `number` | Bookmark creation timestamp |

---

## channel.bookmark_remove

Unpin a previously bookmarked notification. Per-user storage, requires only read access to the hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.bookmark_remove
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message_id` | `string` | **Yes** | - | Unique message ID to remove from bookmarks |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `affected` | `number` | Number of rows deleted (0 or 1) |

---

## channel.bookmark_list

Get paginated list of bookmarked notifications for the current user. Per-user storage, requires read access only.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.bookmark_list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array<object>` | Bookmarked notifications sorted by ctime DESC |
| `items[].message_id` | `string` | - |
| `items[].hub_id` | `string` | - |
| `items[].ctime` | `number` | - |

---

## channel.dm_init

Get or create a 1-on-1 DM conversation hub with a specific user

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/channel.dm_init
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `recipient_id` | `string` | **Yes** | - | UID of the user to start a DM conversation with |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `hub_id` | `string` | DM hub ID |
| `home_id` | `string` | DM hub home directory node ID |
| `db_name` | `string` | DM hub database name |
| `is_new` | `number` | 1 if newly created, 0 if existing |

---

## channel.list_conversations

List all DM conversations for the current user, sorted by last message time DESC

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (32) |

**Endpoint:**
```
https://hostname/-/svc/channel.list_conversations
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number (20 conversations per page) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array<object>` | DM conversation list sorted by last_message_time DESC |
| `items[].hub_id` | `string` | - |
| `items[].other_uid` | `string` | UID of the other party |
| `items[].other_user` | `object` | Other user profile (name, avatar) |
| `items[].last_message` | `string` | Last message preview (max 100 chars), or '[File]' for attachments |
| `items[].last_message_time` | `number` | Unix timestamp of last message |
| `items[].unread_count` | `number` | Number of unread messages from other party |

---

## channel.list_by_file

Get all channel messages in the current hub that have a specific file attached. Powers the See Chat Threads feature from the file context menu. Searches the attachment JSON array for the given file_nid.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.list_by_file
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file_nid` | `string` | **Yes** | - | Media node ID of the file to search for in message attachment arrays |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.sys_id` | `number` | Auto-incremented message sequence ID |
| `items.author_id` | `string` | UID of the message author |
| `items.message` | `string` | Message text content |
| `items.message_id` | `string` | Unique message identifier |
| `items.thread_id` | `string` | Parent message ID if this is a reply, null otherwise |
| `items.attachment` | `string` | JSON array of attached file nids |
| `items.is_forward` | `number` | 1 if message is forwarded, 0 otherwise |
| `items.mention_ids` | `array` | Array of user IDs mentioned in this message |
| `items.status` | `string` | Message status: active |
| `items.ctime` | `number` | Unix timestamp when the message was posted |
| `items.metadata` | `string` | Additional message metadata JSON, null if not set |

---

## channel.list_thread_by_file

Get all channel messages in the current hub that either attach the file OR mention it inline as [@Filename](mention:hub_id:nid) in the message body. Powers See Chat Threads with mention indexing. Server merges channel_list_by_file (attachment hits) and channel_search (mention pattern hits), dedupes by message_id, sorts ctime DESC.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.list_thread_by_file
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `file_nid` | `string` | **Yes** | - | Media node ID to find in attachment array OR mention pattern mention:hub_id:file_nid |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.sys_id` | `number` | Auto-incremented message sequence ID |
| `items.author_id` | `string` | UID of the message author |
| `items.message` | `string` | Message text content |
| `items.message_id` | `string` | Unique message identifier |
| `items.thread_id` | `string` | Parent message ID if this is a reply, null otherwise |
| `items.attachment` | `string` | JSON array of attached file nids |
| `items.is_forward` | `number` | 1 if message is forwarded, 0 otherwise |
| `items.mention_ids` | `array` | Array of user IDs mentioned in this message |
| `items.status` | `string` | Message status: active |
| `items.ctime` | `number` | Unix timestamp when the message was posted |
| `items.metadata` | `string` | Additional message metadata JSON, null if not set |

---

## channel.typing

Broadcast an ephemeral typing indicator to all other hub participants over WebSocket. Nothing is persisted; the indicator is rendered transiently in the recipient's chat widget.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/channel.typing
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `state` | `number` | No | - | 1 = typing, 0 = stopped. Defaults to 1. |
| `socket_id` | `string` | **Yes** | - | Caller's WebSocket socket ID. Used to exclude the caller from the broadcast recipients. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## Related Documentation

- [ACL System](../../technology/02-acl-system.md) - Permission model
- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference
- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed
- [Error Handling](../../product-guides/05-error-handling.md) - Error codes
