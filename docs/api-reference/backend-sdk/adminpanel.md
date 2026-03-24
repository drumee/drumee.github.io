---
id: adminpanel
title: adminpanel API
sidebar_label: adminpanel
---

# ADMINPANEL API Reference

## Module Information

**Service Files:**
- Private: `service/private/adminpanel.js`

**Available Services:** 44
**Documented Services:** 43

---

## adminpanel.organisation_add

Create a new organisation for the current domain owner. Requires an active subscription, no existing organisation, and an available ident. Creates the domain, grants owner privilege, and persists the organisation record.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.organisation_add
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | Display name of the new organisation |
| `ident` | `string` | **Yes** | - | Unique identifier for the organisation (lowercased). Must not already be registered as an ident in the system. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_SUBSCRIPTION` | 403 | Current user has no active subscription |
| `ORGANISATION_ALREADY_EXITS` | 409 | Current user already belongs to an organisation |
| `IDENT_NOT_AVAILABLE` | 409 | Requested ident is already registered in the system |

---

## adminpanel.organisation_update

Update the display name of the current user's organisation. Requires admin-level privilege within the domain.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.organisation_update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | New display name for the organisation |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NO_ORG_TO_UPDATE` | 404 | Current user is not a member of any organisation |
| `INVALID_ORG` | 403 | Current user's organisation does not match the domain organisation |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have the required admin privilege level |

---

## adminpanel.organisation_update_password_level

Update the password strength policy level for the organisation. Requires security admin privilege.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.organisation_update_password_level
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `option` | `string` | **Yes** | - | Password policy level option to apply (accepted by organisation_update_password_level procedure) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NO_ORG_TO_UPDATE` | 404 | Current user is not a member of any organisation |
| `INVALID_ORG` | 403 | Organisation mismatch between caller and domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have security admin privilege |

---

## adminpanel.organisation_update_double_auth

Update the two-factor authentication policy for the organisation. Requires security admin privilege.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.organisation_update_double_auth
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `option` | `string` | **Yes** | - | Double auth policy option to apply (accepted by organisation_update_double_auth procedure) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NO_ORG_TO_UPDATE` | 404 | Current user is not a member of any organisation |
| `INVALID_ORG` | 403 | Organisation mismatch between caller and domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have security admin privilege |

---

## adminpanel.organisation_update_dir_visiblity

Update the directory visibility policy for the organisation (controls whether member profiles are discoverable). Requires security admin privilege. Note: method name preserves intentional legacy spelling.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.organisation_update_dir_visiblity
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `option` | `string` | **Yes** | - | Visibility policy option accepted by organisation_update_dir_visiblity procedure |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NO_ORG_TO_UPDATE` | 404 | Current user is not a member of any organisation |
| `INVALID_ORG` | 403 | Organisation mismatch between caller and domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have security admin privilege |

---

## adminpanel.organisation_update_dir_info

Update the directory information policy for the organisation (controls which member fields are visible in directory listings). Requires security admin privilege.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.organisation_update_dir_info
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `option` | `string` | **Yes** | - | Directory info policy option accepted by organisation_update_dir_info procedure |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NO_ORG_TO_UPDATE` | 404 | Current user is not a member of any organisation |
| `INVALID_ORG` | 403 | Organisation mismatch between caller and domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have security admin privilege |

---

## adminpanel.my_subscription

Retrieve the current user's active subscription record.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.my_subscription
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

## adminpanel.my_organisation

Retrieve the organisation that the current user belongs to.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.my_organisation
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

## adminpanel.my_privilege

Retrieve the current user's privilege level within the domain. Returns dom_owner if the user has an active subscription, otherwise returns the privilege level from their organisation membership.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.my_privilege
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

## adminpanel.setPassword

Forcibly set a user's password by their ID. Admin operation that does not require the current password. Note: method name uses legacy camelCase.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.setPassword
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | ID of the user whose password to set |
| `password` | `string` | **Yes** | - | New plain-text password to assign |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | id or password parameter is missing |

---

## adminpanel.set_mfa

Enable or disable multi-factor authentication for a specific member. Updates the user's otp and mfa profile fields and sends a notification email to the affected user.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.set_mfa
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member to update MFA settings for |
| `mfa` | `number` | No | - | MFA mode to set. 0 to disable, non-zero to enable. Defaults to 0. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | user_id is required |
| `INVALID_USER` | 404 | No user found for the given user_id |

---

## adminpanel.role_add

Add a new role to the current domain's organisation. Requires member-admin privilege level.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.role_add
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | Display name for the new role |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have member-admin privilege level |

---

## adminpanel.role_show

List all roles defined for the current domain's organisation, paginated. Requires at least admin-view privilege.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.role_show
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number` | No | - | Page number for pagination (default: 1) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have admin-view privilege level |

---

## adminpanel.role_delete

Delete a role from the current domain's organisation by role ID. Requires member-admin privilege. The role must exist.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.role_delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `role_id` | `string` | **Yes** | - | ID of the role to delete |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have member-admin privilege level |
| `ROLE_NOT_EXISTS` | 404 | No role found with the given role_id in the organisation |

---

## adminpanel.role_assign

Assign one or more roles to a member within the current domain's organisation. Validates that all provided role IDs exist before assigning.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.role_assign
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member to assign roles to |
| `role` | `array` | No | - | Array of role IDs to assign. Mutually usable with list parameter. |
| `list` | `array` | No | - | Array of role IDs to assign. Mutually usable with role parameter. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `ROLE_NOT_EXISTS` | 404 | One or more provided role IDs do not exist in the organisation |

---

## adminpanel.role_assigned

Retrieve the list of roles currently assigned to a specific member within the current domain's organisation.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.role_assigned
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member whose assigned roles to retrieve |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |

---

## adminpanel.role_rename

Rename an existing role in the current domain's organisation. No-op if the new name is identical to the current name.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.role_rename
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `role_id` | `string` | **Yes** | - | ID of the role to rename |
| `name` | `string` | **Yes** | - | New display name for the role |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have member-admin privilege level |
| `ROLE_NOT_EXISTS` | 404 | No role found with the given role_id in the organisation |

---

## adminpanel.role_reposition

Reorder roles within the organisation by updating their rank positions.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.role_reposition
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `content` | `array` | **Yes** | - | Array of role positioning records passed as-is to role_reposition procedure. Each item should include the role ID and its new position index. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## adminpanel.member_add

Create and register a new member in the domain's organisation. Creates the user account, default storage hubs, default folder structure, sends an invitation email, and sets up contact assignments and ticket permissions. Validates organisation quota before creation.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_add
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | Email address for the new member. Must not already be registered in the system. |
| `firstname` | `string` | No | - | First name of the new member |
| `lastname` | `string` | No | - | Last name of the new member |
| `mobile` | `string` | No | - | Mobile phone number (optional, used for SMS-based OTP) |
| `areacode` | `string` | No | - | International dialing area code for the mobile number |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found or quota check failed for the current domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have member-admin privilege level |
| `EMAIL_NOT_AVAILABLE` | 409 | The provided email address is already registered in the system |
| `INTERNAL_ERROR` | 500 | Account creation failed at the database level |

---

## adminpanel.member_update

Update an existing member's profile, role assignments, and OTP settings within the organisation. Validates privilege hierarchy (caller must outrank the target). Sends notification and re-authentication links if contact information changes.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member to update |
| `firstname` | `string` | **Yes** | - | Updated first name |
| `lastname` | `string` | **Yes** | - | Updated last name |
| `email` | `string` | **Yes** | - | Updated email address. Must be a valid email format. If changed, must not already be registered. |
| `address` | `string` | No | - | Updated physical address |
| `mobile` | `string` | No | - | Updated mobile phone number |
| `areacode` | `string` | No | - | Updated international dialing area code |
| `otp` | `number` | No | - | OTP mode to set. Accepted values: 0 or 1. Defaults to 0. |
| `role` | `array` | No | - | Array of role IDs to assign. Replaces all current role assignments. Mutually usable with list parameter. |
| `list` | `array` | No | - | Array of role IDs to assign. Mutually usable with role parameter. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain or target member |
| `INVALID_ORG` | 403 | Target member does not belong to the same organisation as the caller |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have sufficient privilege over the target member |
| `INCORRECT_DOMAIN` | 403 | Target member has no domain privilege record |
| `DRUMATE_NOT_EXISTS` | 404 | No user found with the given user_id |
| `EMAIL_NOT_AVAILABLE` | 409 | The new email address is already registered |
| `ROLE_NOT_EXISTS` | 404 | One or more role IDs in the provided list do not exist |
| `NO_MEMBER` | 404 | Target user is not a member of the organisation |
| `MOBILE_EMPTY` | 400 | OTP is enabled but no mobile number was provided |
| `AREACODE_EMPTY` | 400 | OTP is enabled but no area code was provided |
| `INVALID_EMAIL_FORMAT` | 400 | Provided email address is not a valid format |
| `INVALID_PHONE_FORMAT` | 400 | Provided mobile number is not a valid phone number format |

---

## adminpanel.member_delete

Move a member to the Free plan (domain_id=1) instead of deleting them permanently. The member leaves all paid domain hubs; hub ownership is transferred to domain admins where applicable. Sends a removal notification email and broadcasts the change via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member to move to the Free plan |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | Sanity check failed: user not found, missing db_name, or domain mismatch |
| `NO_MEMBER` | 404 | Target user is not a member of the organisation |

---

## adminpanel.member_disconnect

Permanently remove a member who has never connected (connected=0) from the organisation. Removes them from all hubs, transfers hub ownership to eligible members, and deletes their home directory. This is a destructive, irreversible operation.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_disconnect
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the never-connected member to permanently remove |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain or target member |
| `NO_MEMBER` | 404 | Target user is not a member of the organisation |
| `INVALID_STATUS` | 409 | Target member is already connected (connected=1); use member_delete instead |
| `INVALID_ORG` | 403 | Organisation mismatch between caller and target member |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have sufficient domain admin privilege |
| `INCORRECT_DOMAIN` | 403 | Target member has no domain privilege record |

---

## adminpanel.member_show

Retrieve the full profile and role assignments for a specific member in the current domain's organisation.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_show
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member to retrieve |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |

---

## adminpanel.member_list

List members of the current domain's organisation with pagination. Supports filtering by role, keyword search, and member type.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `role_id` | `string` | No | - | Filter members by role ID. Defaults to 0 (all roles). |
| `key` | `string` | No | - | Keyword to filter members by name or email |
| `page` | `number` | No | - | Page number for pagination (default: 1) |
| `option` | `string` | No | - | Member type filter passed to member_list procedure (default: member) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |

---

## adminpanel.member_change_status

Change a member's account status within the organisation. Valid transitions: active or archived to locked; locked to active or archived. Caller must have admin privilege and outrank the target member. Archiving a member also clears their contact assignments.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_change_status
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member whose status to change |
| `status` | `string` | **Yes** | - | Target status. Accepted values: active, locked, archived. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_USER` | 400 | Cannot change the status of the caller's own account |
| `INVALID_STATUS0` | 400 | Requested status is not one of: active, locked, archived |
| `INVALID_STATUS1` | 409 | Cannot set to locked from current state (must be active or archived) |
| `INVALID_STATUS2` | 409 | Cannot set to archived from current state (must be locked) |
| `INVALID_STATUS3` | 409 | Cannot set to active from current state (must be locked) |
| `NO_ORG` | 404 | No organisation found for caller or target member |
| `INVALID_ORG` | 403 | Target member does not belong to the same organisation as the caller |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have sufficient admin privilege over the target |
| `INCORRECT_DOMAIN` | 403 | Target member has no domain privilege record |
| `NO_MEMBER` | 404 | Target user is not a member of the organisation |

---

## adminpanel.member_loginlog

Retrieve the paginated login history for a specific member. Validates that the target user belongs to the same domain as the caller.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_loginlog
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member whose login log to retrieve |
| `page` | `number` | No | - | Page number for pagination (default: 1) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | Sanity check failed: user not found, missing db_name, or domain mismatch |

---

## adminpanel.member_import

Bulk import members into the organisation. Implementation is handled internally.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_import
```

---

## adminpanel.member_admin_add

Grant an elevated admin privilege level to one or more existing members. Requires security admin privilege. Target members must have a registered mobile number for SMS-based OTP. Automatically sets OTP mode to sms for each promoted member.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_admin_add
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `users` | `array` | **Yes** | - | Array of user IDs to grant admin privilege to. Accepts a single string which is normalised to an array. |
| `privilege` | `number` | **Yes** | - | Privilege level to grant. Must be between dom_admin_view and dom_admin inclusive. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_PRIVILEGE ` | 400 | Requested privilege level is outside the allowed range (note: trailing space is preserved from source) |
| `NO_ORG` | 404 | No organisation found for caller or target members |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have security admin privilege |
| `NOT_VALID_DRUMATE` | 404 | One or more user IDs do not correspond to existing users |
| `NOT_VALID_ORG` | 403 | One or more users do not belong to this organisation |
| `EMPTY_MOBILE` | 400 | One or more target users have no mobile number registered |

---

## adminpanel.member_admin_list

List admin-level members of the organisation. Deprecated: code is marked for deletion.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_admin_list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number` | No | - | Page number for pagination (default: 1) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |

---

## adminpanel.member_admin_remove

Revoke admin privilege from one or more members, downgrading them to regular member (dom_member) level. Requires member-admin privilege.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_admin_remove
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `users` | `array` | **Yes** | - | Array of user IDs to revoke admin privilege from. Accepts a single string which is normalised to an array. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for caller or target members |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have member-admin privilege level |
| `NOT_VALID_DRUMATE` | 404 | One or more user IDs do not correspond to existing users |
| `NOT_VALID_ORG` | 403 | One or more users do not belong to this organisation |

---

## adminpanel.member_block

Set a member's profile blocked flag to yes. Deprecated: code is marked for deletion. Use member_change_status instead.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_block
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member to block |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for caller or target member |
| `INVALID_ORG` | 403 | Organisation mismatch between caller and target member |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have sufficient admin privilege |
| `INCORRECT_DOMAIN` | 403 | Target member has no domain privilege record |

---

## adminpanel.member_unblock

Clear a member's profile blocked flag (set to no). Deprecated: code is marked for deletion. Use member_change_status instead.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_unblock
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member to unblock |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for caller or target member |
| `INVALID_ORG` | 403 | Organisation mismatch between caller and target member |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have sufficient admin privilege |
| `INCORRECT_DOMAIN` | 403 | Target member has no domain privilege record |

---

## adminpanel.member_authentification

Update the OTP authentication method for a specific member. Validates privilege hierarchy and organisation membership before applying. Broadcasts the profile update to the member's active sockets.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.member_authentification
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member to update OTP settings for |
| `option` | `string` | No | - | OTP method to set. Use sms to enable SMS-based OTP. Defaults to 0 (disabled). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for caller or target member |
| `INVALID_ORG` | 403 | Organisation mismatch between caller and target member |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have sufficient admin privilege over the target |
| `INCORRECT_DOMAIN` | 403 | Target member has no domain privilege record |
| `NO_USER` | 404 | No member detail record found for the given user_id |
| `NO_PHOME` | 400 | SMS OTP was requested but the target member has no mobile number registered |

---

## adminpanel.prepare_import

Parse and validate a CSV file for bulk member import. Checks email availability, seat quota limits, and duplicate entries within the file. Returns a per-row validation report before the actual import is committed.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.prepare_import
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uploaded_file` | `string` | **Yes** | - | Filesystem path of the uploaded CSV file to validate (from the uploaded_file input attribute) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.status` | `string` | Validation result for this row: Ok, Quota exceeded, Email already exists, or Duplicated email |
| `items.error` | `number` | 0 if the row is valid and ready to import, 1 if it has a validation error |
| `items.domain` | `string` | Organisation domain assigned to the member (set only when seat quota is available) |
| `items.category` | `string` | Member category from the organisation configuration |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found or privilege check failed |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have member-admin privilege level |

---

## adminpanel.send_password_link

Generate a new random password and send a reset or invitation link to one or more members. Connected members receive a password-change link; unconnected members receive an invitation link. Terminates all existing sessions for each targeted member.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.send_password_link
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `users` | `array` | **Yes** | - | Array of user IDs to send password links to. Accepts a single string which is normalised to an array. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NOT_ENOUGH_PRIVILEGE` | 403 | Caller does not have security admin privilege level |
| `NOT_VALID_DRUMATE` | 404 | One or more user IDs do not correspond to existing users |
| `NOT_VALID_ORG` | 403 | One or more users do not belong to this organisation |

---

## adminpanel.mimic_new

Initiate an admin impersonation (mimic) session targeting a specific member. For locked or archived members the session is activated immediately without requiring the target's consent. For active members a pending session is created and the target must accept via mimic_active. Broadcasts via WebSocket to both parties.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.mimic_new
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member to impersonate. Must differ from the caller's own ID. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_USER` | 400 | Cannot impersonate yourself |
| `NO_ORG` | 404 | No organisation found for the current domain |
| `MIMIC_ALREADY` | 409 | A pending or active mimic session already exists for the caller or the target |
| `NOT_ONLINE` | 503 | Target member is active but not currently connected via WebSocket |

---

## adminpanel.mimic_reject

Reject a pending mimic session. Must be called by the target user (the one being impersonated). Broadcasts the rejection to both parties via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.mimic_reject
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `mimic_id` | `string` | **Yes** | - | ID of the pending mimic session to reject |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_MIMIC` | 404 | No mimic session found for the given mimic_id |
| `INVALID_MIMIC` | 403 | Current user is not the target (uid) of this mimic session |
| `INVALID_STATUS` | 409 | Mimic session is not in new status; cannot reject an active session |

---

## adminpanel.mimic_active

Accept and activate a pending mimic session. Must be called by the target user. Verifies that the impersonating admin is currently online before activating.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.mimic_active
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `mimic_id` | `string` | **Yes** | - | ID of the pending mimic session to activate |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain |
| `NO_MIMIC` | 404 | No mimic session found for the given mimic_id |
| `INVALID_MIMIC` | 403 | Current user is not the target (uid) of this mimic session |
| `INVALID_STATUS` | 409 | Mimic session is not in new status |
| `NOT_ONLINE` | 503 | The impersonating admin is not currently connected; session set to noonline status |

---

## adminpanel.mimic_end_bymimic

Terminate an active mimic session initiated by the impersonating admin (mimicker). Restores normal session state and broadcasts the termination to both parties via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.mimic_end_bymimic
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `mimic_id` | `string` | **Yes** | - | ID of the active mimic session to end |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_MIMIC` | 404 | No mimic session found for the given mimic_id |
| `INVALID_MIMIC` | 403 | Current user is not the mimicker of this session |
| `INVALID_STATUS` | 409 | Mimic session is not currently active |

---

## adminpanel.mimic_end_byuser

Terminate an active mimic session by the target user being impersonated. Restores normal session state and broadcasts the termination to both parties via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.mimic_end_byuser
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `mimic_id` | `string` | **Yes** | - | ID of the active mimic session to end |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_MIMIC` | 404 | No mimic session found for the given mimic_id |
| `INVALID_MIMIC` | 403 | Current user is not the target (uid) of this mimic session |
| `INVALID_STATUS` | 409 | Mimic session is not currently active |

---

## adminpanel.mimic_end_bytime

Terminate an active mimic session that has exceeded its allowed duration. Waits 5 seconds before processing to confirm expiry. Validates that remaining_time has reached 0 before ending. Broadcasts the termination to both parties via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.mimic_end_bytime
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `mimic_id` | `string` | **Yes** | - | ID of the timed-out mimic session to end |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_MIMIC` | 404 | No mimic session found for the given mimic_id |
| `INVALID_MIMIC` | 403 | Current user is not the mimicker of this session |
| `INVALID_STATUS` | 409 | Mimic session is not currently active |
| `INVALID_TIME` | 409 | Mimic session still has remaining time; cannot end by time expiry |

---

## adminpanel.members_whocansee_update

Update the list of organisation members that a specific member is allowed to see in the directory. All provided users must be valid Drumee users belonging to the same organisation. Self-inclusion is rejected.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.members_whocansee_update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member whose visibility list to update |
| `users` | `array` | **Yes** | - | Array of user IDs that the member is allowed to see. Must all be valid Drumee users in the same organisation and must not include user_id itself. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain or target member |
| `INVALID_ORG` | 403 | Target member does not belong to the same organisation as the caller |
| `NOT_VALID_DRUMATE` | 400 | One or more users in the list are invalid or include the target user themselves |
| `NOT_VALID_ORG` | 403 | One or more users in the list belong to a different organisation |

---

## adminpanel.members_whocansee

Retrieve the current list of organisation members that a specific member is allowed to see in the directory.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.members_whocansee
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | ID of the member whose current visibility list to retrieve |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_ORG` | 404 | No organisation found for the current domain or target member |
| `INVALID_ORG` | 403 | Target member does not belong to the same organisation as the caller |

---

## adminpanel.create_organisation

Create a new organisation for a user currently on the default domain (domain_id=1) or with no organisation. Creates the domain, grants owner privilege, transfers the existing quota to the new domain, and persists the organisation record.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/adminpanel.create_organisation
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | Display name of the new organisation |
| `ident` | `string` | **Yes** | - | Unique identifier for the organisation domain (lowercased). Must not already be registered as a domain ident. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `already_in_other_domain` | 409 | Current user already belongs to a non-default organisation (domain_id > 1) |
| `domain_not_available` | 409 | Requested ident is already registered as a domain identifier |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
