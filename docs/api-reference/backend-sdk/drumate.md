---
id: drumate
title: drumate API
sidebar_label: drumate
---

# DRUMATE API Reference

## Module Information

**Service Files:**
- Private: `service/private/drumate.js`
- Public: `service/yp.js`

**Available Services:** 43
**Documented Services:** 20

---

## drumate.get_profile

Get current user's complete profile information

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.get_profile
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | User ID |
| `email` | `string` | User email address |
| `firstname` | `string` | First name |
| `lastname` | `string` | Last name |
| `fullname` | `string` | Full name |
| `profile` | `object` | Extended profile information (JSON) |

---

## drumate.update_profile

Update user profile information (may require OTP verification for sensitive fields)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.update_profile
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `profile` | `object` | **Yes** | - | Profile fields to update (firstname, lastname, mobile, address, etc.) |
| `secret` | `string` | No | - | OTP secret (required if OTP verification needed) |
| `code` | `string` | No | - | OTP code (required if OTP verification needed) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `profile` | `object` | Updated profile information |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `WRONG_PASSWORD` | 401 | OTP code is incorrect |

---

## drumate.change_password

Change user password with old password verification

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.change_password
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `old_password` | `string` | **Yes** | - | Current password for verification |
| `new_password` | `string (min: 8)` | **Yes** | - | New password (minimum 8 characters) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | success or error code |
| `error` | `string` | Error code if failed: wrong_password or uncompliant_password |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `wrong_password` | 401 | Current password is incorrect |
| `uncompliant_password` | 400 | New password does not meet requirements (minimum 8 characters) |

---

## drumate.change_email

Change user email address (must be unique and valid format)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.change_email
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string (pattern: `^[^@]+@[^@]+\.[^@]+$`)` | **Yes** | - | New email address |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `email` | `string` | Updated email address |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_EMAIL_FORMAT` | 400 | Email format is invalid |
| `EMAIL_ALREADY_EXIST` | 409 | Email address is already in use |

---

## drumate.data_usage

Get current disk usage and quota information for user

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.data_usage
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `usage` | `number` | Current disk usage in bytes |
| `quota` | `object` | Quota limits |
| `quota.storage` | `number` | Total storage quota in bytes |
| `quota.real` | `number` | Real available space |

---

## drumate.notification_center

Get list of all notifications for current user

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.notification_center
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `notifications` | `array<object>` | Array of notification objects |
| `notifications[].id` | `string` | Notification ID |
| `notifications[].entity_id` | `string` | Related entity (hub or user) ID |
| `notifications[].type` | `string` | Notification type |
| `notifications[].count` | `number` | Unread count |

---

## drumate.logout

Logout user and cleanup session

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/drumate.logout
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `device_id` | `string` | No | - | Device ID to unregister (for mobile devices) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `session_id` | `string` | Terminated session ID |

---

## drumate.get_otp

Generate and send One-Time Password via SMS or email

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.get_otp
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `secret` | `string` | OTP secret token for verification |
| `expiry` | `number` | OTP expiration timestamp |
| `tips` | `string` | Hint showing where OTP was sent (last 4 digits of phone or email domain) |
| `error` | `string` | Error message if OTP could not be sent |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `OTP_NOT_AVAILABLE` | 503 | OTP service is not enabled |
| `INVALID_PROFILE` | 400 | No valid phone or email in profile |

---

## drumate.set_avatar

Set user avatar using a media file from MFS

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.set_avatar
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `reference` | `string` | **Yes** | - | Node ID of image file in MFS to use as avatar |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | User ID |
| `avatar` | `string` | Avatar URL |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `no_avatar` | 404 | Avatar file not found or not accessible |

---

## drumate.remove_avatar

Remove user avatar and restore default

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.remove_avatar
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | User ID |
| `avatar` | `string` | Default avatar URL |

---

## drumate.my_hubs

Get paginated list of hubs that user owns

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.my_hubs
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `hubs` | `array<object>` | Array of hub objects |
| `hubs[].id` | `string` | Hub ID |
| `hubs[].name` | `string` | Hub name |
| `hubs[].area` | `string` | Hub area: private, public, or share |
| `hubs[].owner_id` | `string` | Owner user ID |

---

## drumate.disk_space

Get detailed MFS manifest showing all files and folders with sizes

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.disk_space
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `manifest` | `array<object>` | Array of all media items with detailed metadata |
| `manifest[].id` | `string` | Node ID |
| `manifest[].filename` | `string` | File or folder name |
| `manifest[].filesize` | `number` | Size in bytes |
| `manifest[].category` | `string` | Node category |

---

## drumate.show_login_log

Get paginated login history with device and location information

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.show_login_log
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `sessions` | `array<object>` | Array of login session objects |
| `sessions[].city` | `string` | Login location city |
| `sessions[].ip` | `string` | IP address |
| `sessions[].intime` | `number` | Login timestamp |
| `sessions[].outtime` | `number` | Logout timestamp (null if still active) |
| `sessions[].status` | `string` | Session status |
| `sessions[].device` | `object` | Parsed device information from user agent |

---

## drumate.update_settings

Update user settings (merged with existing settings)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.update_settings
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `settings` | `object` | **Yes** | - | Settings object to merge with existing settings |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `settings` | `object` | Updated complete settings object |

---

## drumate.notification_remove

Mark notifications as read/acknowledged for a specific entity (hub or user)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.notification_remove
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity_id` | `string` | No | - | Entity ID (hub_id or user_id) to mark notifications as read. Empty to mark all. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `ok` | `number` | Success indicator (1) |

---

## drumate.delete_account

Initiate account deletion process (requires OTP verification, returns deletion token)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/drumate.delete_account
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `secret` | `string` | **Yes** | - | OTP secret from get_otp |
| `code` | `string (min: 6, max: 6)` | **Yes** | - | OTP verification code |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `secret` | `string` | Deletion confirmation token (sent to email) |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `_invalid_key` | 401 | OTP verification failed |

---

## drumate.confirm_delete_account

Confirm and execute account deletion (freezes account, removes from hubs, sends reactivation link)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.confirm_delete_account
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `secret` | `string` | **Yes** | - | Deletion confirmation token from delete_account |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `rejected` | `number` | 1 if deletion rejected (invalid secret) |
| `reason` | `string` | Rejection reason code |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `_invalid_secret` | 401 | Deletion token is invalid or expired |

---

## drumate.update_ident

Change user's ident/username (must be unique within domain)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.update_ident
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `ident` | `string` | **Yes** | - | New username/ident |
| `id` | `string` | **Yes** | - | User ID to update |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | User ID |
| `ident` | `string` | Updated ident |
| `username` | `string` | Updated username |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `_ident_already_exists` | 409 | Username is already taken in this domain |

---

## drumate.hub_to_pro

Upgrade free user account to Pro account with custom domain and organization

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.hub_to_pro
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `ident` | `string` | **Yes** | - | Domain identifier (subdomain) |
| `name` | `string` | **Yes** | - | Organization name |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Domain ID |
| `name` | `string` | Domain name (ident.drumee.com) |
| `status` | `string` | Status code (PRO_USER, NAME_NOT_AVAILABLE, or URL_NOT_AVAILABLE if failed) |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `PRO_USER` | 400 | User is already a Pro account |
| `NAME_NOT_AVAILABLE` | 409 | Organization name is already taken |
| `URL_NOT_AVAILABLE` | 409 | Domain identifier is already taken |

---

## drumate.helpdesk

Get paginated helpdesk messages in user's language

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.helpdesk
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `Xlang` | `string` | No | - | Language code (defaults to user's language) |
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `messages` | `array<object>` | Array of helpdesk message objects |
| `messages[].id` | `string` | Message ID |
| `messages[].metadata` | `object` | Message metadata (parsed from JSON) |

---

## drumate.change_mobile

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.change_mobile
```

---

## drumate.check_password

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.check_password
```

---

## drumate.color_add

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.color_add
```

---

## drumate.color_last

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.color_last
```

---

## drumate.contacts

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.contacts
```

---

## drumate.drumate_hubs

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.drumate_hubs
```

---

## drumate.font_add

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.font_add
```

---

## drumate.font_last

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.font_last
```

---

## drumate.get_drumate_detail

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.get_drumate_detail
```

---

## drumate.get_languages

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/drumate.get_languages
```

---

## drumate.hubs

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.hubs
```

---

## drumate.intro_acknowledged

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/drumate.intro_acknowledged
```

---

## drumate.my_contacts

*Alias for [`contacts`](#drumatecontacts)*

---

## drumate.prepare_data_backup

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.prepare_data_backup
```

---

## drumate.reset_forgot_password

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/drumate.reset_forgot_password
```

---

## drumate.send_account_deletion_code

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.send_account_deletion_code
```

---

## drumate.send_forgot_password_token

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/drumate.send_forgot_password_token
```

---

## drumate.set_lang

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.set_lang
```

---

## drumate.show_backup_log

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.show_backup_log
```

---

## drumate.validate_account_deletion_code

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/drumate.validate_account_deletion_code
```

---

## drumate.validate_forgot_password_token

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/drumate.validate_forgot_password_token
```

---

## drumate.verify_email

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/drumate.verify_email
```

---

## drumate.check_drumate_exist

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/drumate.check_drumate_exist
```

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
