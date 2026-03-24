---
id: chat
title: chat API
sidebar_label: chat
---

# CHAT API Reference

## Module Information

**Service Files:**
- Private: `service/private/chat.js`

**Available Services:** 15
**Documented Services:** 15

---

## chat.acknowledge

Mark a message as read. Updates message acknowledgment status and notifies the message author via WebSocket that their message has been read.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.acknowledge
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## chat.attachment

Get attachments for a specific message with pagination. Returns media files attached to a message, with 5 items per page. Each attachment includes full file metadata.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/chat.attachment
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message_id` | `string` | **Yes** | - | - |
| `page` | `integer` | No | `1` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.nid` | `string` | - |
| `items.hub_id` | `string` | - |
| `items.file_name` | `string` | - |
| `items.filesize` | `integer` | - |
| `items.extension` | `string` | - |
| `items.category` | `string` | - |
| `items.privilege` | `integer` | - |
| `items.page` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## chat.chat_rooms

List chat rooms with filtering and pagination. Returns paginated list of chat rooms with optional filtering by tag, keyword, flag, and status (active/archived).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.chat_rooms
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tag_id` | `string` | No | `""` | - |
| `page` | `integer` | No | `1` | - |
| `key` | `string` | No | `""` | - |
| `flag` | `string` | No | `""` | - |
| `option` | `string` | No | `"active"` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.entity_id` | `string` | - |
| `items.contact_id` | `string` | - |
| `items.firstname` | `string` | - |
| `items.lastname` | `string` | - |
| `items.last_message` | `string` | - |
| `items.unread_count` | `integer` | - |
| `items.last_activity` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## chat.chat_room_info

Get detailed information about a specific chat room. Returns complete metadata and current status of a chat room identified by key.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.chat_room_info
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## chat.change_status

Change chat room status (archive or unarchive). Archives or restores a chat conversation. Triggers WebSocket notification to update UI across all user sessions.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.change_status
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity_id` | `string` | **Yes** | - | - |
| `status` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_STATUS0` | - | Status must be 'archived' or 'active' |

---

## chat.contact_rooms

List chat rooms filtered by contacts. Returns chat rooms specifically for direct contact conversations (not group chats), with optional tag and keyword filtering.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.contact_rooms
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tag_id` | `string` | No | `""` | - |
| `page` | `integer` | No | `1` | - |
| `key` | `string` | No | `""` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.entity_id` | `string` | - |
| `items.contact_id` | `string` | - |
| `items.firstname` | `string` | - |
| `items.lastname` | `string` | - |
| `items.last_message` | `string` | - |
| `items.unread_count` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## chat.count_all

Get total unread message count across all chat rooms. Returns aggregate count of unread messages from all conversations.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.count_all
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

*Error codes not documented*

---

## chat.delete

Delete messages from chat. Can delete for self only ('me') or for both parties ('all'). Removes message content and attachments. Option 'all' requires user to be the message author.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `option` | `string` | **Yes** | - | - |
| `messages` | `array<string>` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.message_id` | `string` | - |
| `items.entity_id` | `string` | - |
| `items.delete_status` | `string` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_OPTION` | - | Option must be 'me' or 'all' |
| `INVALID_MESSAGES` | - | One or more message IDs do not exist |
| `INVALID_OPTION` | - | Cannot delete 'all' - user is not the message author |

---

## chat.forward

Forward messages to multiple recipients. Takes existing messages and sends copies to specified entities. Preserves original message content and attachments. Supports bulk forwarding.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.forward
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entities` | `array<string>` | **Yes** | - | - |
| `nodes` | `object` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.message_id` | `string` | - |
| `items.entity_id` | `string` | - |
| `items.forward_message_id` | `string` | - |
| `items.author_id` | `string` | - |
| `items.is_attachment` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## chat.messages

Get paginated message list for a chat conversation. Returns messages with entity info, thread details, and attachment indicators. Automatically marks messages as read and notifies authors via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.messages
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity_id` | `string` | **Yes** | - | - |
| `page` | `integer` | No | `1` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.message_id` | `string` | - |
| `items.entity_id` | `string` | - |
| `items.message` | `string` | - |
| `items.author_id` | `string` | - |
| `items.ctime` | `integer` | - |
| `items.is_attachment` | `integer` | - |
| `items.entity` | `object` | - |
| `items.thread` | `object` | - |

### Possible Errors

*Error codes not documented*

---

## chat.post

Send a message in a chat. Creates and delivers a message to a contact with optional attachments and thread reply. Validates contact, attachments, and thread. Moves attachments to permanent storage and distributes message to both parties via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.post
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity_id` | `string` | **Yes** | - | - |
| `message` | `string` | No | `""` | - |
| `thread_id` | `string` | No | - | - |
| `attachment` | `array<string>` | No | `[]` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.message_id` | `string` | - |
| `items.entity_id` | `string` | - |
| `items.message` | `string` | - |
| `items.author_id` | `string` | - |
| `items.to_id` | `string` | - |
| `items.is_attachment` | `integer` | - |
| `items.entity` | `object` | - |
| `items.thread` | `object` | - |
| `items.room` | `integer` | - |
| `items.total` | `integer` | - |
| `items.echoId` | `string` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_CONTACT` | - | Contact does not exist or is invalid |
| `INVALID_ATTACHMENT` | - | One or more attachments are invalid or inaccessible |
| `INVALID_THREAD` | - | Thread ID does not exist |

---

## chat.share_rooms

List group/shared chat rooms. Returns chat rooms for group conversations (not direct contact chats), with optional keyword filtering and pagination.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.share_rooms
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | `1` | - |
| `key` | `string` | No | `""` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.entity_id` | `string` | - |
| `items.group_name` | `string` | - |
| `items.last_message` | `string` | - |
| `items.unread_count` | `integer` | - |
| `items.member_count` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## chat.tag_chat_count

Get chat count for a specific tag. Returns the number of chat rooms associated with a contact tag.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.tag_chat_count
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tag_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.tag_id` | `string` | - |
| `items.tag_name` | `string` | - |
| `items.chat_count` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## chat.to_read

Get number of unread message pages for a contact. Returns how many pages of unread messages exist in a conversation. Used for pagination UI indicators.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.to_read
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_CONTACT` | - | Contact does not exist or is invalid |

---

## chat.upload_remove

Remove an uploaded attachment before sending. Deletes a file from chat upload directory. Only works on files in /__chat__/__upload__/ path. File must be owned by user and cannot be a folder or hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/chat.upload_remove
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
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
| `INVALID_ATTACHMENT` | - | File does not exist |
| `INVALID_ATTACHMENT` | - | File is not in chat upload directory (/__chat__/__upload__/) |
| `INVALID_ATTACHMENT` | - | Cannot delete folders or hubs |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
