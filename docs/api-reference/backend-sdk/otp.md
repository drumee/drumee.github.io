---
id: otp
title: otp API
sidebar_label: otp
---

# OTP API Reference

## Module Information

**Service Files:**
- Private: `service/otp.js`
- Public: `service/private/otp.js`

**Available Services:** 3
**Documented Services:** 3

---

## otp.set_password

Set a new password for a user after verifying a one-time password code. Verifies the OTP code and secret against the user identified by uid via the internal _verify helper (which also validates socket binding). If verification succeeds, updates the password, signs in the user, deletes the used secret, and returns the session result. Returns an error object if the OTP code is wrong.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/otp.set_password
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | - |
| `code` | `string` | **Yes** | - | - |
| `secret` | `string` | **Yes** | - | - |
| `password` | `string` | **Yes** | - | - |
| `socket_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `no-socket` | - | WebSocket socket_id is not bound to the current session |
| `no-user` | - | No user found for the provided uid |
| `wrong-otp` | - | Wrong otp |
| `INTERNAL_ERROR` | - | Failed to update password or create session |

---

## otp.verify

Verify an OTP code for the given email address. Validates that the WebSocket socket_id is bound to the current session, checks that the user exists, and verifies the code against the stored secret via stored procedure secret_check. Returns the OTP record with the user ID on success, or an error status object on failure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/otp.verify
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | - |
| `code` | `string` | **Yes** | - | - |
| `secret` | `string` | **Yes** | - | - |
| `socket_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `no-socket` | - | WebSocket socket_id is not bound to the current session |
| `no-user` | - | No user found for the provided email address |
| `wrong-code` | - | OTP code does not match the stored secret entry |

---

## otp.send

Send an OTP code to the user identified by email. Validates socket binding, checks the user exists, generates a secret and code via stored procedure secret_create (or otp_create if method is otp), then sends the code to the user email using the OTP email template. Returns the secret and user info for use in subsequent verify or set_password calls. The sent field indicates whether the email was delivered successfully.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/otp.send
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | - |
| `socket_id` | `string` | **Yes** | - | - |
| `method` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_SOCKET` | - | WebSocket socket_id is not bound to the current session |
| `no-user` | - | No user account found for the provided email address |
| `INTERNAL_ERROR` | - | Failed to generate secret or send OTP email |

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
