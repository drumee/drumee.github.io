---
id: signaling
title: signaling API
sidebar_label: signaling
---

# SIGNALING API Reference

## Module Information

**Service Files:**
- Private: `service/signaling.js`
- Public: `service/signaling.js`

**Available Services:** 3
**Documented Services:** 3

---

## signaling.notify

Broadcast signaling data to a list of hub recipients, excluding the sender socket. Iterates each hub ID in the recipients array, fetches all entity sockets for that hub excluding the provided socket_id, and sends the full input payload to each via RedisStore.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/signaling.notify
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `recipients` | `array` | **Yes** | - | - |
| `socket_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## signaling.message

Broadcast a signaling message to target peers and optionally log a call event. Resolves recipients from the target object set during initialization: socket-scoped (target.socket_id or target.stream_id), hub-scoped (target.hub_id), or user-scoped (target.uid). After sending via RedisStore, attempts to log the call event in chat history if the role is 'caller' and type is cancel, leave, or reject.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/signaling.message
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `target` | `object` | No | - | - |
| `origin` | `object` | No | - | - |
| `scope` | `string` | No | - | - |
| `type` | `string` | No | - | - |
| `role` | `string` | No | - | - |
| `duration` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## signaling.dial

Initiate a call to a target user by sending an INCOMING_CALL signal to all their connected sockets. Resolves the target user's sockets via user_sockets, creates a room_invite_next entry for each socket as a listener, and sends the call payload via RedisStore. Returns offline indicator if the target user has no active sockets. Self-calling is explicitly rejected.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/signaling.dial
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `target` | `object` | **Yes** | - | - |
| `room_id` | `string` | **Yes** | - | - |
| `room_type` | `string` | **Yes** | - | - |
| `device_id` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `Self calling is not allowed` | - | The target uid matches the caller's own uid or ident |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
