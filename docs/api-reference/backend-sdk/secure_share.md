---
id: secure_share
title: secure_share API
sidebar_label: secure_share
---

# SECURE_SHARE API Reference

## Module Information

**Service Files:**
- Private: `service/private/secure_share.js`

**Available Services:** 4
**Documented Services:** 4

---

## secure_share.create

Create a per-email unique secure share token for a file or folder. Stores the token in secure_share_token (yellow_page), sends an invitation email to the recipient, and returns the share link.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/secure_share.create
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID of the file or folder to share |
| `email` | `string` | **Yes** | - | Recipient email. Access is restricted to this address unless domain_restriction is also set. |
| `domain_restriction` | `string` | No | - | Optional domain restriction (e.g. company.com). When set, any email from that domain may use the link. |
| `days` | `integer` | No | `0` | Expiry in days, combined with hours. 0 means no expiry. |
| `hours` | `integer` | No | `0` | Expiry in hours, combined with days. 0 means no expiry. |
| `password` | `string` | No | - | Optional password the recipient must enter after email verification. Communicated out-of-band. Stored as salted PBKDF2-SHA512 hash — never in plain text. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique share token |
| `link` | `string` | Full share URL to send to the recipient |
| `recipient_email` | `string` | - |
| `expiry_time` | `integer` | Unix timestamp, 0 = no expiry |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `CREATE_FAILED` | - | Token creation failed |
| `MISSING_PARAM` | 400 | nid and email are required |

---

## secure_share.list

List all secure share tokens created by the current user for a given node, including status (active / expired / revoked) and access counts.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/secure_share.list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID to list secure share tokens for |

---

## secure_share.revoke

Revoke a secure share token (soft delete — sets revoked_at timestamp). Broadcasts a secure_share_revoked event via Redis to all hub socket connections so the recipient loses access instantly.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/secure_share.revoke
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | Secure share token to revoke |

---

## secure_share.delete

Hard-delete a secure share token. Only succeeds when the token is already revoked or expired — active tokens are rejected.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/secure_share.delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | Token to permanently delete. Must already be revoked or expired. |

---

## Related Documentation

- [ACL System](../../technology/02-acl-system.md) - Permission model
- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference
- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed
- [Error Handling](../../product-guides/05-error-handling.md) - Error codes
