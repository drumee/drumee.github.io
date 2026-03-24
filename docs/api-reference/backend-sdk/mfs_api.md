---
id: mfs_api
title: mfs_api API
sidebar_label: mfs_api
---

# MFS_API API Reference

## Module Information

**Service Files:**
- Private: `service/private/mfs_api.js`

**Available Services:** 3
**Documented Services:** 3

---

## mfs_api.create_token

Create a new MFS export token for sharing data across Drumee instances. Generates a secure token that allows external access to specific nodes/resources with configurable permissions and expiry. Used for Drumee-to-Drumee data import/export.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/mfs_api.create_token
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |
| `expiry_hours` | `integer` | No | `24` | - |
| `permission` | `integer` | No | `2` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `missing_parameters` | - | hub_id and nid are required |
| `unauthorized` | - | User not authenticated |
| `invalid_expiry` | - | expiry_hours must be between 0 and 8760 (1 year) |
| `invalid_permission` | - | permission must be between 1 and 63 |
| `token_creation_failed` | - | Database procedure returned error |
| `internal_error` | - | Exception occurred during token creation |

---

## mfs_api.revoke

Revoke an existing MFS export token. Invalidates the token immediately, preventing further access to the associated resource. Only the token creator can revoke their own tokens.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/mfs_api.revoke
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `missing_token` | - | token parameter is required |
| `unauthorized` | - | User not authenticated |
| `revocation_failed` | - | Token not found or user is not the creator |
| `internal_error` | - | Exception occurred during revocation |

---

## mfs_api.list

List all MFS export tokens created by current user. Returns all active and expired tokens with their details including resource information, permissions, and expiry status. Useful for token management and auditing.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/mfs_api.list
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

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `unauthorized` | - | User not authenticated |
| `internal_error` | - | Exception occurred while listing tokens |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
