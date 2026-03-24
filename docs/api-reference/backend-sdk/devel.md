---
id: devel
title: devel API
sidebar_label: devel
---

# DEVEL API Reference

## Module Information

**Service Files:**
- Private: `service/private/devel.js`
- Public: `service/private/devel.js`

**Available Services:** 3
**Documented Services:** 3

---

## devel.verbosity

Get or set the global server verbosity level. When level is greater than 0, updates both the global.verbosity variable and the cached environment via Cache.setEnv. Always returns the current level value regardless of whether it was applied.

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/devel.verbosity
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `level` | `number` | No | - | New verbosity level to set. Must be greater than 0 to take effect. When absent or zero, the current verbosity is returned without modification. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `verbosity` | `number` | The level value as received in the request. Reflects the requested level, not necessarily the active global.verbosity. |

---

## devel.instances

List the available Drumee infrastructure instance names. Reads instance keys from /etc/drumee/infrastructure/instances.json when the file exists, otherwise returns a single-element list containing the current sysEnv instance name.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/devel.instances
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array<string>` | Array of instance name strings derived from the keys of the instances configuration. Falls back to a single-element array containing the current instance name when the configuration file is absent. |

---

## devel.log_over_socket

Get or set the global debug logging destination and flags for over-socket log streaming. When flags is provided and truthy, updates global.debug_flags and sets global.debug_dest to the current socket, server endpoint, user, and service. Always returns the current flags value and active debug destination.

| Property | Value |
|----------|-------|
| **Scope** | plateform |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/devel.log_over_socket
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `flags` | `number` | No | - | Bitmask of debug flag levels to enable (e.g. 0b1111111 enables all: error, warn, info, http, verbose, debug, silly). When falsy, the current global.debug_dest is returned without modification. |
| `socket_id` | `string` | No | - | Socket ID of the requesting client. Stored in global.debug_dest.socket_id when flags is set. |
| `service` | `string` | No | - | Service name stored in global.debug_dest.service when flags is set. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `flags` | `number` | The flags value as received in the request |
| `dest` | `object` | Active debug destination descriptor stored in global.debug_dest |
| `dest.socket_id` | `string` | Socket ID of the log consumer |
| `dest.server` | `string` | Endpoint address from Cache.getEnv(Attr.endpointAddress) |
| `dest.uid` | `string` | User ID of the requestor |
| `dest.service` | `string` | Service name associated with the log stream |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
