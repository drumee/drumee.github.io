---
id: room
title: room API
sidebar_label: room
---

# ROOM API Reference

## Module Information

**Service Files:**
- Private: `service/private/room.js`
- Public: `service/room.js`

**Available Services:** 16
**Documented Services:** 16

---

## room.book

Book a new meeting room. Creates a scheduled meeting node (category=schedule, ext=schedule) in the user home directory with attendees, title, message, and date metadata. Title defaults to a locale-generated headline if not provided. Date defaults to current time if not provided.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/room.book
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `title` | `string` | No | - | - |
| `date` | `string` | No | - | - |
| `message` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## room.get_meeting_members

Get all members invited to a meeting room. Returns the list of DMZ users who have been granted access to a specific meeting node.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/room.get_meeting_members
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
| `items` | `object` | - |
| `items.id` | `string` | - |
| `items.email` | `string` | - |
| `items.name` | `string` | - |

### Possible Errors

*Error codes not documented*

---

## room.get_screen

Initialize a screen sharing session for a room. Generates a unique screen_id, grants permission on it, and sends room_invite_next to all current room attendees assigning the requester as presenter and others as listeners. Only available for non-private hub areas.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/room.get_screen
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `parent_id` | `string` | **Yes** | - | - |
| `parent_type` | `string` | **Yes** | - | - |
| `socket_id` | `string` | **Yes** | - | - |
| `device_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `[object Object]` | - |

### Possible Errors

*Error codes not documented*

---

## room.get

Get or create a room for the current user. Retrieves an existing room matching the given device, socket, and room type, or creates a new one if none exists. Mapped to the get_or_create implementation method.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/room.get
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `device_id` | `string` | **Yes** | - | - |
| `socket_id` | `string` | **Yes** | - | - |
| `room_type` | `string` | **Yes** | - | - |
| `id` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `[object Object]` | - |

### Possible Errors

*Error codes not documented*

---

## room.hello

Register a guest user session for public meeting access. Binds a guest name to the current session cookie via cookie_bind_guest. Used as the entry point for unauthenticated users joining a shared meeting link.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/room.hello
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

### Possible Errors

*Error codes not documented*

---

## room.invite

Invite a peer to join an active room. Sends a room_invite_next event to the target guest via WebSocket (signaling.message) with linkup type, assigning them the listener role. Notifies the guest socket on their endpoint node.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/room.invite
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `room_id` | `string` | **Yes** | - | - |
| `guest` | `object` | **Yes** | - | - |
| `room_type` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.uid` | `string` | - |
| `items.socket_id` | `string` | - |
| `items.type` | `string` | - |
| `items.service` | `string` | - |

### Possible Errors

*Error codes not documented*

---

## room.join

Join an active room and notify the hub owner. Retrieves or creates a room entry, attaches hub area and node details, then sends a WebSocket notification to the hub owner's sockets. Returns room data including current attendees list.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/room.join
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | - |
| `socket_id` | `string` | **Yes** | - | - |
| `device_id` | `string` | **Yes** | - | - |
| `room_type` | `string` | **Yes** | - | - |
| `endpointAddress` | `string` | No | - | - |
| `endpointRoute` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## room.leave

Leave an active room and notify remaining peers. Removes the user from the room via room_leave_next, pushes user online status to 1 (online/idle), and sends a room.leave signaling message to all remaining attendees via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/room.leave
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | - |
| `room_id` | `string` | **Yes** | - | - |
| `hub_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## room.public_link

Generate a public shareable link for a meeting room node. Creates a DMZ grant token for the specified node, grants permission to the public_id system user, and returns a shareable URL containing the access token.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/room.public_link
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | - |
| `password` | `string` | No | - | - |
| `days` | `integer` | No | `0` | - |
| `hours` | `integer` | No | `0` | - |
| `permission` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## room.shutdown

Shut down an active room session. Reserved for admin-level room lifecycle management. Returns an empty object on completion.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/room.shutdown
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `room_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## room.remove

Remove a meeting room and revoke all permissions. Revokes all permissions on the meeting node using permission_revoke with scope 'meeting' and returns the node ID as confirmation.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/room.remove
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

*Error codes not documented*

---

## room.request_screen_access

Request access to a peer screen sharing session. Reserved endpoint for future screen access request workflow. Currently not active in the service implementation.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/room.request_screen_access
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## room.requestAccess

Request access to join an active room as a participant. Verifies room permission via room_access, retrieves presenter and current peers, pushes user online status to 2 (in-meeting), and if the requester is the presenter sends a meeting.start signal to all peers.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/room.requestAccess
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | - |
| `room_id` | `string` | **Yes** | - | - |
| `hub_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `WEAK_PRIVILEGE OOOP` | - | User does not have sufficient permission to access the room |

---

## room.unified_room

Manage unified room state for multi-participant sessions. Supports four operations via the flag parameter: get (retrieve room state), add (join with media settings using defaults), update (join with explicit required media settings), and remove (leave the unified room).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/room.unified_room
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `flag` | `string` | **Yes** | - | - |
| `id` | `string` | **Yes** | - | - |
| `uid` | `string` | No | - | - |
| `is_mic_enabled` | `integer` | No | - | - |
| `is_video_enabled` | `integer` | No | - | - |
| `is_share_enabled` | `integer` | No | - | - |
| `is_write_enabled` | `integer` | No | - | - |
| `metadata` | `object` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## room.update

Update a scheduled meeting room. Supports partial or full updates controlled by the flag parameter. Flags: 'when' updates date only, 'title' updates title and renames the node, 'agenda' updates message, 'member' updates attendees and sends email invitations, 'all' updates all fields. Commits invitation emails to new attendees when flag includes member changes.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/room.update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `flag` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |
| `date` | `string` | No | - | - |
| `title` | `string` | No | - | - |
| `message` | `string` | No | - | - |
| `attendees` | `array` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## room.users

List all users currently in a room. Reserved endpoint for room participant listing. Currently not active in the service implementation.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/room.users
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
