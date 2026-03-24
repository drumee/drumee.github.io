---
id: hub
title: hub API
sidebar_label: hub
---

# HUB API Reference

## Module Information

**Service Files:**
- Private: `service/private/hub.js`
- Public: `service/hub.js`

**Available Services:** 40
**Documented Services:** 12

---

## hub.get_settings

Get comprehensive hub settings including owner, visitor privileges, and member list

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.get_settings
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `owner` | `object` | Hub owner information |
| `visitor` | `object` | Current user's privilege information |
| `visitor.privilege` | `number` | User's privilege level in this hub |
| `users` | `array<object>` | List of hub members (excluding system users) |
| `users[].id` | `string` | User ID |
| `users[].privilege` | `number` | User privilege level |
| `hubname` | `string` | Hub name |
| `default_privilege` | `number` | Default privilege for new members |

---

## hub.get_attributes

Get hub's complete attributes as JSON

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.get_attributes
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Hub ID |
| `name` | `string` | Hub name |
| `area` | `string` | Hub area (private, public, share) |
| `owner_id` | `string` | Owner user ID |
| `settings` | `object` | Hub settings object |

---

## hub.get_contributors

Get paginated list of hub contributors/members

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.get_contributors
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |
| `privilege` | `number` | No | `0` | Filter by privilege level (0 for all) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `contributors` | `array<object>` | Array of contributor objects |

---

## hub.show_contributors

Show paginated list of hub contributors (alias for get_contributors)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.show_contributors
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `contributors` | `array` | Array of contributor objects |

---

## hub.add_contributors

Add members to hub with privilege and expiry settings (sends notifications)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.add_contributors
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `users` | `array<string>` | **Yes** | - | Array of user IDs or emails to add |
| `privilege` | `number` | No | - | Privilege level to grant (defaults to hub's default_privilege) |
| `hours` | `number` | No | `0` | Hours until membership expires |
| `days` | `number` | No | `0` | Days until membership expires |
| `message` | `string` | No | - | Optional message to send to new members |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `members` | `array` | Updated list of hub members (not_owner type) |

---

## hub.delete_contributor

Remove members from hub (broadcasts removal notification)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.delete_contributor
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `users` | `array<string>` | **Yes** | - | Array of user IDs to remove (cannot remove self) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `members` | `array` | Updated list of remaining hub members |

---

## hub.set_privilege

Set privilege level for multiple users (batch operation)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.set_privilege
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `users` | `array<string>` | **Yes** | - | Array of user IDs |
| `privilege` | `number` | No | - | Privilege level to set (defaults to hub's default_privilege) |
| `permission` | `number` | No | - | Alias for privilege parameter |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `users` | `array` | Array of user IDs that were updated |

---

## hub.set_member_privilege

Set privilege level for a single member with optional expiry

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.set_member_privilege
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | User ID to update |
| `privilege` | `number` | No | - | Privilege level to grant |
| `permission` | `number` | No | - | Alias for privilege parameter |
| `days` | `number` | No | `0` | Days until privilege expires |
| `hours` | `number` | No | `0` | Hours until privilege expires |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `members` | `array` | Updated list of hub members (not_owner type) |

---

## hub.get_space_usage

Get hub's disk space usage statistics

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.get_space_usage
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `total` | `number` | Total storage quota in bytes |
| `selected` | `number` | Space used by this hub in bytes |
| `others` | `number` | Space used by other hubs and user data in bytes |
| `free` | `number` | Free space available in bytes |

---

## hub.update_name

Update hub name (must be unique, broadcasts change to members)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_name
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string (min: 1)` | **Yes** | - | New hub name |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Hub ID |
| `hubname` | `string` | Updated hub name |
| `name` | `string` | Updated hub name |
| `fieldName` | `string` | hubname |
| `error` | `string` | ALREADY_EXISTS if name is taken |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `ALREADY_EXISTS` | 409 | Hub name is already in use |

---

## hub.poke

Send notification to a user about activity in this hub

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.poke
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | User ID to notify |
| `nid` | `string` | **Yes** | - | Node ID related to notification |
| `kind` | `string` | **Yes** | - | Type of notification |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `sender` | `string` | Sender user ID (current user) |
| `recipient` | `string` | Recipient user ID |

---

## hub.logo

Get hub logo URL (public API, no authentication required)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/hub.logo
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `protocol` | `string` | No | - | Protocol (http or https) |
| `localhost` | `string` | No | - | Localhost flag for local development |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | Full URL to hub logo image |

---

## hub.add_external_member

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.add_external_member
```

---

## hub.add_font_link

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/hub.add_font_link
```

---

## hub.change_history

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.change_history
```

---

## hub.change_owner

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.change_owner
```

---

## hub.change_status

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.change_status
```

---

## hub.copy_link

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.copy_link
```

---

## hub.delete_external_member

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.delete_external_member
```

---

## hub.delete_hub

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/hub.delete_hub
```

---

## hub.get_action_log

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.get_action_log
```

---

## hub.get_members_by_type

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.get_members_by_type
```

---

## hub.get_pr_node_attr

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.get_pr_node_attr
```

---

## hub.get_statistics

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.get_statistics
```

---

## hub.hub_get_members_by_type

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.hub_get_members_by_type
```

---

## hub.login_image

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/hub.login_image
```

---

## hub.lookup_hubers

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.lookup_hubers
```

---

## hub.set_node_permission

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.set_node_permission
```

---

## hub.show_privilege

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/hub.show_privilege
```

---

## hub.update_contributor

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_contributor
```

---

## hub.update_favicon

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_favicon
```

---

## hub.update_ident

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_ident
```

---

## hub.update_settings

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_settings
```

---

## hub.update_title

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_title
```

---

## hub.update_visibility

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_visibility
```

---

## hub.update_external_members

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_external_members
```

---

## hub.update_external_room

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_external_room
```

---

## hub.update_external_settings

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.update_external_settings
```

---

## hub.get_external_room_attr

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.get_external_room_attr
```

---

## hub.external_notification

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/hub.external_notification
```

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
