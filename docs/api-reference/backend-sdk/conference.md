---
id: conference
title: conference API
sidebar_label: conference
---

# CONFERENCE API Reference

## Module Information

**Service Files:**
- Private: `service/conference.js`
- Public: `service/conference.js`

**Available Services:** 12
**Documented Services:** 12

---

## conference.accept

Accept an incoming call from a caller. Notifies the caller and all other connections of the current user (excluding the accepting socket) via RedisStore. Returns the caller object.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/conference.accept
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `caller` | `object` | **Yes** | - | Caller descriptor object. Must contain caller_id which is used as the target socket_id for the notification. |
| `socket_id` | `string` | **Yes** | - | Socket ID of the accepting client. Used to exclude the accepting connection from the broadcast and to identify the accepted socket. |
| `service` | `string` | No | - | Live notification service name forwarded to the inform call via input.get(Attr.service). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `caller` | `object` | The caller descriptor object as received in the request |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | caller or socket_id is required |

---

## conference.attendee

Retrieve attendee information for a conference participant. Calls the conference_attendee stored procedure with the given participant ID.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/conference.attendee
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `participant_id` | `string` | **Yes** | - | ID of the conference participant to look up |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Attendee record returned by the conference_attendee stored procedure |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | participant_id is required |

---

## conference.broadcast

Broadcast an event payload to all socket connections on the current hub, excluding the sender socket. Uses RedisStore to push the data to all entity sockets retrieved via entity_sockets stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/conference.broadcast
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | Socket ID of the broadcasting client. Excluded from the recipient list. |
| `event` | `string` | **Yes** | - | Event name to broadcast to all other connected sockets on the hub |
| `payload` | `object` | **Yes** | - | Arbitrary event payload object to broadcast to all other sockets |
| `service` | `string` | No | - | Service name attached to the RedisStore message envelope via input.get(Attr.service). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `payload` | `object` | The payload object as received in the request, echoed back to the caller |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | socket_id, event, or payload is required |

---

## conference.cancel

Cancel a conference room and notify all participants. Calls conference_cancel to retrieve the current room participants, then broadcasts a cancellation notification to all of them via RedisStore. Pushes the caller online status update after cancellation.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/conference.cancel
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `room_id` | `string` | **Yes** | - | ID of the conference room to cancel |
| `socket_id` | `string` | **Yes** | - | Socket ID of the cancelling client |
| `service` | `string` | No | - | Live notification service name forwarded to the inform call via input.get(Attr.service). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Empty response. Side-effects (cancellation notifications) are the primary outcome. |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | room_id or socket_id is required |

---

## conference.decline

Decline an incoming call. Notifies the caller via RedisStore using the caller_id as the target socket. Pushes the current user online status after declining.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/conference.decline
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `caller` | `object` | **Yes** | - | Caller descriptor object. Must contain caller_id which is used as the target socket_id for the decline notification. |
| `service` | `string` | No | - | Live notification service name forwarded to the inform call via input.get(Attr.service). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `caller` | `object` | The caller descriptor object as received in the request |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | caller is required |

---

## conference.get_caller

Retrieve the active caller information for the current user from a specific guest. Calls the conference_get_caller stored procedure using the current user as the callee and the provided guest_id as the caller. Returns an empty object if no active call is found.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/conference.get_caller
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `guest_id` | `string` | **Yes** | - | ID of the guest/caller to look up. Used as the caller_id in the conference_get_caller procedure call. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Caller record including room_id when an active call is found, or an empty object when no active call exists |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | guest_id is required |

---

## conference.invite

Invite a guest user to join a conference room. Checks for a pending cross-call scenario first, then calls conference_invite to create or retrieve the room. Joins the caller into the room via conference_join and notifies all target sockets via RedisStore. Returns the room_id and nid on success, or an offline indicator if the guest has no active sockets.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/conference.invite
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | Hub ID used as the conference context |
| `guest_id` | `string` | **Yes** | - | ID of the user being invited to the conference |
| `room_id` | `string` | No | - | Existing room ID to invite into. When absent, a new room is created via conference_invite. |
| `socket_id` | `string` | **Yes** | - | Socket ID of the inviting client. Used as the caller_id in notifications. |
| `metadata` | `object` | **Yes** | - | Conference metadata object. The uid field is overridden with the current user ID before the procedure call. |
| `service` | `string` | No | - | Live notification service name forwarded to the inform call via input.get(Attr.service). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `room_id` | `string` | ID of the conference room. Returned on successful invite. |
| `nid` | `string` | Node ID of the conference room (same as room_id). Returned on successful invite. |
| `offline` | `number` | Set to 1 when the invited guest has no active socket connections. Mutually exclusive with room_id. |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `WEAK_PRIVILEGE` | 403 | Conference join failed due to insufficient permissions after invite |
| `MISSING_PARAM` | 400 | hub_id, guest_id, socket_id, or metadata is required |

---

## conference.join

Join a conference room as an attendee or host. Calls conference_join with the provided args and metadata, retrying once for guest users if permission is initially missing. On success, sends room info and attendee list to all existing room participants via RedisStore (conference.start for host, conference.join or conference.accept for attendees). Returns room details, permission, configs, and the full attendee list.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/conference.join
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | Socket ID of the joining client |
| `metadata` | `object` | **Yes** | - | Conference metadata object. The uid field is injected automatically. The type field must be present in the object or provided separately via the type param. |
| `hub_id` | `string` | **Yes** | - | Hub ID of the conference room to join |
| `room_id` | `string` | No | - | ID of the specific room to join. Optional; resolved by the conference_join procedure when absent. |
| `type` | `string` | No | - | Conference type (e.g. meeting, connect). Required when metadata.type is not already set. |
| `guest_name` | `string` | No | - | Display name for guest users. Applied to metadata and persisted via cookie_touch when the caller is a guest. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `permission` | `string` | Permission level granted to the joining user in this room |
| `details` | `object` | MFS node attributes for the conference room node, fetched via mfs_node_attr |
| `configs` | `object` | Platform conference configuration object from myDrumee.conference |
| `attendees` | `array<object>` | List of other participants currently in the room (excluding the joining client) |
| `user` | `object` | The joining user record as returned by conference_join |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `WEAK_PRIVILEGE` | 403 | Conference join failed due to insufficient permissions |
| `MISSING_PARAM` | 400 | socket_id, metadata, or hub_id is required |

---

## conference.leave

Leave a conference room. Calls conference_leave to remove the socket from the room, then pushes the updated online status of the current user to all connected peers. Returns the updated peer list.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/conference.leave
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `room_id` | `string` | **Yes** | - | ID of the conference room to leave |
| `socket_id` | `string` | **Yes** | - | Socket ID of the leaving client |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `peers` | `object` | Updated peer list returned by pushUserOnlineStatus after the leave operation |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | room_id or socket_id is required |

---

## conference.logCall

Log a completed or terminated call as a chat message in both the caller and callee channel databases. Only logs when the event is cancel, leave, reject, or decline. Writes a call-type channel message to both the author and peer databases with the appropriate role metadata, then pushes the chat.post notification to both parties via RedisStore.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/conference.logCall
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `callee` | `object` | **Yes** | - | Callee descriptor object. Must contain entity_id and contact_id fields used to identify the peer and log the call message. |
| `event` | `string (cancel, leave, reject, decline)` | **Yes** | - | Call termination event. Must be one of: cancel, leave, reject, decline. Other values are silently ignored and no log is written. |
| `duration` | `number` | No | `0` | Call duration in seconds. Stored in the message metadata. Defaults to 0 when not provided. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `callee` | `object` | The callee descriptor object as received in the request |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | callee or event is required |

---

## conference.revoke

Revoke a conference invitation for a specific callee. Calls conference_revoke to remove the callee from the room, then notifies all affected socket connections via RedisStore. Writes a call log entry via writeLog for the callee with a cancel event.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/conference.revoke
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | Hub ID of the conference room context |
| `callee` | `object` | **Yes** | - | Callee descriptor object. Must contain drumate_id used to identify the participant to revoke, and entity_id and contact_id used for the call log. |
| `socket_id` | `string` | **Yes** | - | Socket ID of the revoking client. Used as the caller_id in the notification payload. |
| `room_id` | `string` | No | - | ID of the conference room. Optional; resolved from the conference_revoke procedure result when absent. |
| `service` | `string` | No | - | Live notification service name forwarded to the inform call via input.get(Attr.service). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `room_id` | `string` | ID of the conference room from which the callee was revoked |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | hub_id, callee, or socket_id is required |

---

## conference.update

Update conference room metadata for the current socket and broadcast the updated metadata to all other sockets in the hub. Calls conference_update only when the socket owner matches the current user. Broadcasts the updated metadata with a timestamp to all other hub sockets via RedisStore.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/conference.update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `room_id` | `string` | **Yes** | - | ID of the conference room to update |
| `socket_id` | `string` | **Yes** | - | Socket ID of the updating client. Used to verify ownership and to exclude from the broadcast recipient list. |
| `metadata` | `object` | **Yes** | - | Updated conference metadata object. The uid field is set to the current user ID before persisting. |
| `event` | `string` | No | - | Event name attached to the RedisStore broadcast message via input.get(event). |
| `service` | `string` | No | - | Service name attached to the RedisStore broadcast message via input.get(Attr.service). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Result of conference_update when the socket owner matches the current user, otherwise empty response |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | room_id, socket_id, or metadata is required |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
