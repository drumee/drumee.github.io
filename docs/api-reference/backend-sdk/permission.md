---
id: permission
title: permission API
sidebar_label: permission
---

# PERMISSION API Reference

## Module Information

**Service Files:**
- Private: `service/private/permission.js`

**Available Services:** 5
**Documented Services:** 4

---

## permission.add_users

Add users to hub with owner privileges. Grants owner-level access to specified users, allowing them to manage the hub. Users are added with optional expiry and invitation message.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/permission.add_users
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `users` | `array<string>` | **Yes** | - | - |
| `expiry` | `integer` | No | `0` | - |
| `message` | `string` | No | `""` | - |
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

## permission.grant

Grant permissions to users for a specific node or entire hub. Assigns access privileges (read, write, admin, owner) to users for files, folders, or the whole hub. Supports expiry and custom invitation messages.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/permission.grant
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `users` | `array<string>` | **Yes** | - | - |
| `permission` | `integer` | **Yes** | - | - |
| `nid` | `string` | No | `"*"` | - |
| `expiry` | `integer` | No | `0` | - |
| `message` | `string` | No | `""` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## permission.revoke

Revoke permissions from users for a specific node. Removes access privileges from specified users. Supports batch revocation for multiple users at once.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/permission.revoke
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `users` | `array<string>` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |
| `expiry` | `integer` | No | `0` | - |
| `message` | `string` | No | `""` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## permission.settings

Get or update permission settings for the hub. Manages default permission levels and access control configuration.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/permission.settings
```

---

## permission.show_users

Show all users with permissions for a specific node. Lists users who have access to a file, folder, or hub along with their permission levels and expiry dates.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/permission.show_users
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

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
