---
id: yp
title: yp API
sidebar_label: yp
---

# YP API Reference

## Module Information

**Service Files:**
- Private: `service/private/yp.js`
- Public: `service/yp.js`

**Available Services:** 34
**Documented Services:** 30

---

## yp.authenticate

Verify an OTP (one-time password) for two-factor authentication. For anonymous sessions, authenticates using secret and code. For existing sessions, checks whether the OTP belongs to the current user and returns appropriate status.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.authenticate
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `secret` | `string` | **Yes** | - | OTP secret identifier |
| `code` | `string` | **Yes** | - | One-time password code to verify |
| `vars` | `object` | No | - | Optional context object. May contain ident for cross-session detection. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | secret or code parameter is missing |

---

## yp.avatar

Retrieve a user's avatar image file (PNG or SVG). Serves the raw image content directly. Returns an empty object if the user is not found or no avatar file exists on disk.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.avatar
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | No | - | ID of the user whose avatar to retrieve. Defaults to the current session user. |
| `type` | `string` | No | - | Avatar variant type (e.g. vignette). Defaults to the VIGNETTE constant. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.check_drumate_exist

Check whether a Drumee user exists by their ID or email address.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.check_drumate_exist
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | User ID or email address to check |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | id parameter is required |

---

## yp.check_password

Verify the current authenticated user's password against the stored hash. Used to confirm identity before performing sensitive account operations.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/yp.check_password
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `password` | `string` | **Yes** | - | Plain-text password to verify against the stored hash for the current user |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.device_registration

Register a mobile device for push notifications. Associates the device push token with the current user account and sets its status to active.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.device_registration
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `device_id` | `string` | **Yes** | - | Unique identifier for the device |
| `device_type` | `string` | **Yes** | - | Device platform type (e.g. ios, android) |
| `push_token` | `string` | **Yes** | - | Push notification token issued by the device platform (APNs or FCM) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | device_id, device_type, or push_token is missing |

---

## yp.email_exists

Check whether an email address is already registered in the system.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/yp.email_exists
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `string` | **Yes** | - | Email address to check for existence |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.files_formats

Retrieve the complete list of supported file formats with their extension, category, MIME type, and capability flags.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.files_formats
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.extension` | `string` | File extension (e.g. pdf, png, mp4) |
| `items.category` | `string` | File category group (e.g. image, video, document) |
| `items.mimetype` | `string` | MIME type string (e.g. image/png) |
| `items.capability` | `string` | Capability flags indicating supported operations for this file type |

### Possible Errors

*Error codes not documented*

---

## yp.get_env

Retrieve platform environment configuration for the current hub, including branding, feature flags, and platform-specific settings.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.get_env
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.get_external_share

Retrieve metadata about a publicly shared file or folder by its share ID.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.get_external_share
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `share_id` | `string` | **Yes** | - | Unique identifier of the external share link |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | share_id is required |

---

## yp.get_hub

Retrieve full hub configuration for the current domain, including custom stylesheets, font links, and font face declarations. Returns 404 if the hub hostname is not found.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.get_hub
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | 404 | Hub hostname is null or not configured |

---

## yp.get_ident_availablility

Check whether a username (ident) is available for new user registration. Note: method name preserves intentional legacy spelling.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.get_ident_availablility
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `ident` | `string` | **Yes** | - | Username or ident string to check for availability |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | ident is required |

---

## yp.get_laguages

Retrieve a paginated list of supported languages, optionally filtered by name. Note: method name preserves intentional legacy spelling.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.get_laguages
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `string` | No | - | Language name filter string. Mutually usable with name parameter. |
| `name` | `string` | No | - | Language name filter string. Mutually usable with value parameter. |
| `page` | `number` | No | - | Page number for pagination (default: 1) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.guest_login

Authenticate a guest user via a DMZ (public share) token. Handles password-protected shares, named guest access, and public room sessions. Returns combined session state and share metadata.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.guest_login
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | DMZ share token identifying the public share to access |
| `password` | `string` | No | - | Password for password-protected shares |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | token is required |

---

## yp.guest_logout

Terminate the current guest (DMZ) session.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.guest_logout
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.hello

Retrieve the current session user profile enriched with subscription plan details and live connection status. Commonly used on application load to verify session state.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.hello
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.ident_exists

Check whether a given ident (username) is already registered in the system.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/yp.ident_exists
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `string` | **Yes** | - | Ident (username) to check for existence |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.login

Authenticate a user with username or email and password. If a session is already active, returns ALREADY_SIGNED_IN or CROSS_SIGNED_IN status instead of creating a new session. For non-email logins, the current vhost is used to resolve the username.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.login
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `vars` | `object` | **Yes** | - | Login credentials object |
| `vhost` | `string` | No | - | Virtual host override used to resolve non-email usernames in multi-tenant installations |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | vars object with uid/ident and password is required |

---

## yp.login_top

Finalize a magic-link or OTP-based login flow. Validates the session OTP using the provided uid, code, and secret, then returns the full user profile.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.login_top
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | No | - | User ID to authenticate (alias for uid) |
| `uid` | `string` | No | - | User ID to authenticate (alias for id) |
| `code` | `string` | No | - | OTP code from the login link |
| `secret` | `string` | No | - | OTP secret from the login link |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.lookup_drumates

Search for Drumee users by name with pagination. Used for user discovery and contact suggestions.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.lookup_drumates
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | No | - | Partial name or username to search. Defaults to empty string which returns all users. |
| `page` | `number` | No | - | Page number for pagination (default: 1) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.notification_count

Get the total count of unread notifications for the current authenticated user.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/yp.notification_count
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.notification_list

Get the full list of notifications received by the current authenticated user.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/yp.notification_list
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.ping

Connection health check endpoint. Supports three modes: debug (returns server verbosity and module state), test (returns request timing), and default (echoes the type value).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.ping
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `string` | No | - | Ping mode: debug returns server diagnostics, test returns timing data, omit or any other value returns type echo |
| `nid` | `string` | No | - | Optional node ID (reserved for future use) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `[object Object]` | - |

### Possible Errors

*Error codes not documented*

---

## yp.reset_forgot_password

Reset a user's password using a validated forgot-password token. This is the final step of the password recovery flow, called after validate_forgot_password_token.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.reset_forgot_password
```

---

## yp.reset_session

Reset the current session state and bind it to a WebSocket socket ID. Used to re-establish session context after a WebSocket reconnection.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.reset_session
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | WebSocket session ID to bind to the current HTTP session |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | socket_id is required, or the current session ID is null or undefined |

---

## yp.send_forgot_password_token

Initiate the forgot-password flow by sending a one-time reset token to the user's registered email address. First step of the password recovery sequence.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.send_forgot_password_token
```

---

## yp.sys_var

Retrieve a system-level configuration variable by name from the sys_var table.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.sys_var
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | Name of the system variable to retrieve |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | name is required |

---

## yp.signin

Alias for login. Authenticate a user with username or email and password.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.signin
```

---

## yp.tutorial

Retrieve a single tutorial entry by name.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.tutorial
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | No | - | Name or identifier of the tutorial to retrieve |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.tutorials

Retrieve all available tutorial entries.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.tutorials
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.username_exists

Check whether a username is already registered within the current domain (resolved from the request vhost).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/yp.username_exists
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `string` | **Yes** | - | Username to check within the current domain |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.validate_forgot_password_token

Validate a password-reset token received via email. Second step of the password recovery flow, called before reset_forgot_password.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.validate_forgot_password_token
```

---

## yp.verify_email

Verify a user's email address using a hashed email value and a one-time verification token sent to that address.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.verify_email
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | No | - | User ID whose email to verify. Defaults to the current session user. |
| `email` | `string` | **Yes** | - | Hashed email address used as the verification target |
| `token` | `string` | **Yes** | - | One-time verification token sent to the user's email |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | Verification failed: email or token is invalid or expired |

---

## yp.host_exists

Check whether a hub (domain) exists by its hostname. Returns the hub record if found, or an empty result if not.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.host_exists
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `host` | `string` | No | - | Hostname to look up in the hub registry via get_hub procedure |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## yp.public_key

Retrieve the server's RSA public key in PEM format. Used by clients to encrypt sensitive data (e.g. passwords) before transmission.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/yp.public_key
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
