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

**Available Services:** 16
**Documented Services:** 16

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
| **Permission** | Write (4) |

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
| **Permission** | Write (4) |

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
| **Permission** | Write (4) |

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
| **Permission** | Write (4) |

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
| **Permission** | Write (4) |

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

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
