---
id: desk
title: desk API
sidebar_label: desk
---

# DESK API Reference

## Module Information

**Service Files:**
- Private: `service/private/desk.js`

**Available Services:** 18
**Documented Services:** 12

---

## desk.home

Get paginated list of files and folders from user's home directory

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/desk.home
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array<object>` | Array of media items (files and folders) |
| `items[].id` | `string` | Node ID |
| `items[].filename` | `string` | File or folder name |
| `items[].category` | `string` | Node type: file, folder, hub |
| `items[].filesize` | `number` | Size in bytes |
| `items[].rank` | `number` | Sort order position |

---

## desk.get_env

Get complete desk environment including filenames, privilege, and quota information

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.get_env
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `filenames` | `array` | List of all filenames in user's workspace |
| `privilege` | `number` | User privilege level (always 7 for owner) |
| `quota` | `object` | User quota limits |
| `quota.storage` | `number` | Available storage in bytes |
| `quota.real` | `number` | Real disk space available |

---

## desk.search

Search files and folders by name pattern across user's workspace

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.search
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `string` | `string (min: 1)` | **Yes** | - | Search pattern (filename substring) |
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `results` | `array<object>` | Array of matching media items |
| `results[].id` | `string` | Node ID |
| `results[].filename` | `string` | Matched filename |
| `results[].file_path` | `string` | Full path to file |
| `results[].category` | `string` | Node type |

---

## desk.my_wallpapers

Get combined list of user and system wallpapers with pagination

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.my_wallpapers
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `wallpapers` | `array<object>` | Combined list of user wallpapers (first) and system wallpapers (second) |
| `wallpapers[].id` | `string` | Wallpaper node ID |
| `wallpapers[].filename` | `string` | Wallpaper filename |
| `wallpapers[].category` | `string` | image |
| `wallpapers[].source` | `string` | user or system |

---

## desk.disk_usage

Get disk usage statistics for user (owned files + owned hubs) with optional category filter

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.disk_usage
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |
| `category` | `string` | No | `"*"` | Filter by category: video, image, audio, document, or * for all |
| `list` | `boolean` | No | - | If true, return detailed file list instead of summary |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `summary` | `object` | Usage summary by category (if list=false) |
| `summary.total_size` | `number` | Total bytes used |
| `summary.file_count` | `number` | Total number of files |
| `files` | `array<object>` | Detailed file list (if list=true) |

---

## desk.create_hub

Create a new hub (private, public, or share workspace)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/desk.create_hub
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `filename` | `string (min: 1, max: 255)` | **Yes** | - | Hub name (will be sanitized for hostname) |
| `area` | `string (private, public, share)` | No | `"private"` | Hub visibility area |
| `pid` | `string` | No | - | Parent folder ID (defaults to home_id) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `hub_id` | `string` | New hub ID |
| `filename` | `string` | Actual filename used (may differ from input) |
| `hostname` | `string` | Hub hostname |
| `area` | `string` | Hub area |
| `home_id` | `string` | Hub's home directory node ID |
| `privilege` | `number` | User's privilege level (7 for owner) |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `QUOTA_EXCEEDED` | 507 | Hub creation quota exceeded for this area |
| `INVALID_FILENAME` | 400 | Filename contains invalid characters |
| `CREATION_FAILED` | 500 | Hub creation failed |

---

## desk.limit

Get current quota limits and available storage space

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.limit
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `storage` | `number` | Available storage in bytes |
| `real` | `number` | Real disk space available (or infinity if unlimited) |

---

## desk.create_wicket

Create or retrieve wicket hub for external meeting handling (one per user)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.create_wicket
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `wicket_id` | `string` | Wicket hub ID |
| `id` | `string` | Home directory node ID |
| `filename` | `string` | Wicket folder name |
| `category` | `string` | hub |

---

## desk.set_mfa

Set multi-factor authentication (MFA) for user account

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.set_mfa
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `secret` | `string` | **Yes** | - | MFA secret key (from QR code setup) |
| `code` | `string (min: 6, max: 6)` | **Yes** | - | TOTP verification code from authenticator app |
| `mfa` | `number (0, 1)` | No | - | Enable (1) or disable (0) MFA |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `user` | `object` | Updated user profile with MFA status |
| `user.id` | `string` | User ID |
| `user.mfa` | `number` | MFA status (0=disabled, 1=enabled) |
| `user.otp` | `number` | One-time password status |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_CODE` | 401 | TOTP code verification failed |
| `SECRET_NOT_FOUND` | 404 | MFA secret not found or expired |

---

## desk.leave_hub

Leave a shared hub (remove user membership from hub)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/desk.leave_hub
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | No | - | Hub ID to leave (optional, uses context hub if not provided) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `uid` | `string` | User ID who left |
| `hub_id` | `string` | Hub ID that was left |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_ID_NOT_ALLOWED` | 403 | Cannot leave your own hub |

---

## desk.reorder

Reorder items in user's workspace by updating rank positions

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/desk.reorder
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `list` | `array<object>` | **Yes** | - | Array of items to reorder |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `list` | `array<object>` | Same list that was sent (confirmation) |

---

## desk.set_online_status

Set user's online/offline status and broadcast to connected clients

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | unknown |

**Endpoint:**
```
https://hostname/-/svc/desk.set_online_status
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `hub_id` | `string` | User's hub ID |
| `user_id` | `string` | User ID |
| `status` | `number` | Online status (0=offline, 1=online) |

---

## desk.backup

Export contacts as VCF (vCard) file

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.backup
```

---

## desk.create_external_room

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.create_external_room
```

---

## desk.create_website

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/desk.create_website
```

---

## desk.get_alternate_account

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.get_alternate_account
```

---

## desk.get_workers

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.get_workers
```

---

## desk.quick_share

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/desk.quick_share
```

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
