---
id: transfer
title: transfer API
sidebar_label: transfer
---

# TRANSFER API Reference

## Module Information

**Service Files:**
- Private: `service/transfer.js`
- Public: `service/transfer.js`

**Available Services:** 9
**Documented Services:** 9

---

## transfer.create

Create a new transfer folder node for the current hub. Generates a random folder name and token, creates an MFS folder node under the source-granted parent, grants public write permission on it, registers a guest cookie session, and sets up a DMZ grant. Returns the new node ID and privilege level. Sets a guest session cookie COOKIE_GUEST_SID on the response.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/transfer.create
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

*Error codes not documented*

---

## transfer.send_link

Send a transfer download link to one or more email recipients. Spawns an offline background process (offline/media/transfer.js) that handles zipping, DMZ registration, and email delivery. The OTP verification step is currently disabled in the source code. Returns the transfer node ID on success.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/transfer.send_link
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | - |
| `emails` | `array<string>` | **Yes** | - | - |
| `password` | `string` | No | `""` | - |
| `days` | `integer` | No | `7` | - |
| `message` | `string` | No | `""` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_OTP` | - | OTP verification failed. Note: OTP check is currently commented out in source and this error is never triggered in production. |

---

## transfer.create_link

Package the source-granted transfer folder into a ZIP archive and generate a public download link. Reads the folder manifest, creates a symlink tree in the download directory, spawns an async archive process, creates a new ZIP node with expiry and password metadata, registers it in DMZ, and records analytics. Returns a shareable HTTPS link. The zip archive is created asynchronously in the background.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/transfer.create_link
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `deviceId` | `string` | No | - | - |
| `password` | `string` | No | `""` | - |
| `days` | `integer` | No | `7` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `Failed to create zip dir` | - | Could not create the temporary download directory for the ZIP archive |

---

## transfer.download

Stream the ZIP archive file to the requester. Validates the token against the node metadata, checks the physical zip file exists on disk, records download analytics, and sends an acknowledgement email to the sender. Responds with the drumee-transfer.zip file as an application/zip stream.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/transfer.download
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | - |
| `deviceId` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `EXPIRED_TOKEN` | - | The transfer node ID is empty, meaning the link has expired or been deleted |
| `FILE_NOT_FOUND` | - | The zip archive file does not exist on the server filesystem |

---

## transfer.remove

Delete a transfer folder node and clean up all associated files on disk. Reads the node manifest, removes each physical file directory, then purges the node record from the database. Use this to cancel an upload before creating the final download link.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/transfer.remove
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

## transfer.link_info

Retrieve metadata for a transfer download link. Validates the receiver token, checks session-based password clearance, updates session state, and returns link metadata including file branch info, analytics, remaining validity duration, and whether the token is the deletion token. Sensitive fields (fingerprint, deleteid, zipid, session, receiver_tokens) are stripped from the response.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/transfer.link_info
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
| `EXPIRED_TOKEN` | - | The transfer node ID is empty, meaning the link has expired or been deleted |
| `WRONG_TOKEN` | - | The supplied token is not in the list of valid receiver tokens for this transfer |
| `PASSWORD_REQUIRED` | - | The transfer is password-protected and the current session has not yet been verified |

---

## transfer.chk_password

Verify a password for a password-protected transfer link. Validates the token, checks that the zip file exists, then runs the fingerprint check against the stored password hash. On success, registers the current session as verified and returns the same metadata structure as link_info. On failure, returns an INVALID_PASSWORD status.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/transfer.chk_password
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | - |
| `password` | `string` | No | `""` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `EXPIRED_TOKEN` | - | The transfer node ID is empty, meaning the link has expired or been deleted |
| `WRONG_TOKEN` | - | The supplied token is not in receiver_tokens or the zip archive file does not exist on disk |
| `INVALID_PASSWORD` | - | The supplied password does not match the stored fingerprint hash |

---

## transfer.send_otp

Generate and send a one-time password (OTP) to an email address for transfer verification. Creates a 6-character alphanumeric OTP, stores it in the node metadata alongside the recipient email, and dispatches an email via the butler/tranfer_otp template. Also accepts an emails array displayed in the OTP message body. Returns the transfer node ID on success.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/transfer.send_otp
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | - |
| `emails` | `array<string>` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## transfer.delete

Permanently delete a transfer download link and its associated files. Validates that the supplied token matches the stored deleteid in node metadata. Revokes all permissions, purges the node, removes the DMZ registration, and deletes the zip directory from the filesystem. This action is irreversible.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/transfer.delete
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

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `EXPIRED_TOKEN` | - | The transfer node ID is empty, meaning the link has already been deleted or expired |
| `token` | - | The supplied token does not match the stored deleteid for this transfer node |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
