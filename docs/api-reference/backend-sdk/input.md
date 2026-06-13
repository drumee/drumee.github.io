---
id: input
title: input API
sidebar_label: input
---

# INPUT API Reference

## Module Information

**Service Files:**
- Private: `service/input.js`
- Public: `service/input.js`

**Available Services:** 1
**Documented Services:** 1

---

## input.updateLicence

Verify and apply a new Drumee platform licence. Validates the provided licence content against a cryptographic signature using the Drumee public key at /etc/drumee/publickeys/drumee.com.pem. If verification succeeds, persists both licence_content and licence_signature to the system configuration via stored procedure sys_conf_set and reloads the server cache. Always returns the verification result regardless of success or failure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (1) |

**Endpoint:**
```
https://hostname/-/svc/input.updateLicence
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `signature` | `string` | **Yes** | - | - |
| `content` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DRUMEE_PUB_KEY_NOT_FOUND` | - | Drumee public key file not found at /etc/drumee/publickeys/drumee.com.pem |
| `VERIFICATION_FAILED` | - | Signature verification failed or an internal error occurred. Response will contain verified: false. |

---

## Related Documentation

- [ACL System](../../technology/02-acl-system.md) - Permission model
- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference
- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed
- [Error Handling](../../product-guides/05-error-handling.md) - Error codes
