---
id: sharebox
title: sharebox API
sidebar_label: sharebox
---

# SHAREBOX API Reference

## Module Information

**Service Files:**
- Private: `service/private/sharebox.js`
- Public: `service/sharebox.js`

**Available Services:** 20
**Documented Services:** 20

---

## sharebox.accept_notification

Accept a pending share notification and grant the shared node access to the current user. Calls yp_notification_accept to retrieve permission details, then calls sbx_accept to establish the MFS sharing relationship. Returns the accepted node attributes on success, or empty object if the notification has no status.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.accept_notification
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

### Possible Errors

*Error codes not documented*

---

## sharebox.assign_permission

Assign sharing permissions to one or more users (drumates or guests) for source nodes. Runs pre_assign preprocessing to validate emails, resolve drumate accounts, create guest accounts for unknown emails, and build the srcgrantlst. Then calls assign_drumate_permission and assign_guest_permission. Guests receive an email notification with a shareable link.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Pre-check** | `pre_assign` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.assign_permission
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `array` | **Yes** | - | - |
| `privilege` | `integer` | No | - | - |
| `permission` | `integer` | No | - | - |
| `message` | `string` | No | `""` | - |
| `days` | `integer` | No | `0` | - |
| `hours` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | - | Source grant list is empty or no valid recipients found |
| `INVALID_EMAIL_FORMAT` | - | One or more email addresses are invalid |
| `FILE_NOT_FOUND` | - | One or more source nodes could not be found |

---

## sharebox.copy_link

Copy (clone) a share link for a node granting permission to the nobody/public user. Calls permission_grant with scope 'link' and retrieves the resulting node link data. Runs pre_link preprocessing to validate source nodes.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Pre-check** | `pre_link` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.copy_link
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | - |
| `permission` | `integer` | No | `1` | - |
| `message` | `string` | No | `""` | - |
| `days` | `integer` | No | `0` | - |
| `hours` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## sharebox.copy_to_sb

Copy source nodes to a sharebox outbound folder. Renames nodes via rename_trash to the sharebox outbound path, then triggers mfs_copy_all transaction. Runs pre_transact preprocessing. Requires owner permission on both src and dest hubs.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Pre-check** | `pre_transact` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.copy_to_sb
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## sharebox.create_inbound_link

Create an inbound drop link for specific recipient email addresses. Creates a subdirectory named after each email under the target node, sets up a DMZ share with upload permission for the nobody user, and sends an email to each recipient with the drop link. Runs pre_share_in preprocessing.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Pre-check** | `pre_share_in` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.create_inbound_link
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `array` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |
| `days` | `integer` | No | `0` | - |
| `hours` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `Failed to create link` | - | MFS directory creation failed or DMZ share check returned empty |

---

## sharebox.create_link

Create an outbound share link for source nodes. Checks or creates a DMZ share token per node via dmz_check_share, grants permission with the given expiry and permission level, registers the link via dmz_add_link, and returns updated outbound node attributes. Runs pre_link preprocessing.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Pre-check** | `pre_link` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.create_link
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `permission` | `integer` | No | - | - |
| `days` | `integer` | No | `0` | - |
| `hours` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## sharebox.create_private_box

Create a private sharebox folder accessible only by a specific guest email. Verifies the email does not belong to an existing drumate, creates a guest account if needed, creates a named directory, sets metadata.sharebox='private', generates a DMZ share token, grants upload permission, and returns the box data with a shareable link.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.create_private_box
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | - |
| `permission` | `integer` | No | - | - |
| `password` | `string` | No | `""` | - |
| `days` | `integer` | No | `10` | - |
| `hours` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DRUMATE_EMAIL` | - | Email belongs to an existing drumate account and cannot be used for a guest private box |
| `LINK_FAILED` | - | Failed to create the sharebox directory |
| `INVALID_STATE` | - | DMZ share state mismatch; share exists in public state but private was expected |

---

## sharebox.create_public_box

Create a public sharebox folder accessible to anyone with the link. Creates a named directory in the user home, sets metadata.sharebox='private', generates a DMZ share token, grants permission for the wildcard user, and returns the box data with a shareable inbound link.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.create_public_box
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | - |
| `permission` | `integer` | No | - | - |
| `password` | `string` | No | `""` | - |
| `days` | `integer` | No | `0` | - |
| `hours` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `LINK_FAILED` | - | Failed to create the sharebox directory |
| `INVALID_STATE` | - | DMZ share state mismatch; share exists in private state but public was expected |

---

## sharebox.get_box_attr

Get attributes and link for a sharebox node. Retrieves DMZ share link content via dmz_show_link_content and constructs the full inbound access URL including the share token.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.get_box_attr
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

## sharebox.get_inbound_node_attr

Get inbound sharing attributes for one or more nodes. Returns sharing metadata for nodes shared inbound to the current user. Single nid string is auto-wrapped in array before the database call.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.get_inbound_node_attr
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

### Possible Errors

*Error codes not documented*

---

## sharebox.get_node_share_attr

Get sharing attributes for a specific node with a given option context. Queries the sharebox database (sb_db from visitor context) for node share attributes visible to the current user.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.get_node_share_attr
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | - |
| `option` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## sharebox.get_outbound_node_attr

Get outbound sharing attributes for one or more nodes. Returns sharing metadata for nodes the current user has shared outbound to others. Single nid string is auto-wrapped in array before the database call.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.get_outbound_node_attr
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

### Possible Errors

*Error codes not documented*

---

## sharebox.notification_count

Get count of pending sharebox notifications for the current user. The private implementation calls yp_notification_count; the public stub returns an empty object.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.notification_count
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## sharebox.notification_list

Get list of pending sharebox notifications for the current user. The private implementation calls yp_notification_receive_list; the public stub returns an empty object.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.notification_list
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## sharebox.refuse_notification

Refuse (decline) a pending share notification. Removes the notification via yp_notification_remove and returns the updated notification list for the current user.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.refuse_notification
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

### Possible Errors

*Error codes not documented*

---

## sharebox.remove_link

Remove a share link for a node. Deletes the DMZ share record via dmz_delete_share using both the node ID and share ID, then returns updated outbound node attributes.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.remove_link
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | - |
| `share_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## sharebox.remove_open_link

Remove an open (public) share link. Reserved endpoint for removing publicly accessible share links.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.remove_open_link
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## sharebox.revoke_permission

Revoke sharing permissions from one or more users for the preloaded source nodes. For each user and node combination: removes DMZ link if the user is a guest (not a drumate), removes the sharebox entry via sbx_remove if the user is a drumate, revokes the permission record, and removes any pending notification. Runs pre_revoke preprocessing to load source nodes.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |
| **Pre-check** | `pre_revoke` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.revoke_permission
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `user_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## sharebox.update_box

Update the permission and expiry settings of an existing sharebox. Looks up the existing share via dmz_check_share and updates the permission grant and DMZ share record. Returns the updated box data with a refreshed inbound link.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.update_box
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | - |
| `permission` | `integer` | No | - | - |
| `password` | `string` | No | `""` | - |
| `days` | `integer` | No | `0` | - |
| `hours` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_NID` | - | Node ID does not match any existing sharebox share record |

---

## sharebox.update_link

Update permission and expiry for an existing share link identified by share ID. Accepts one or more node IDs, normalizes them, re-grants permission on each with the updated expiry and permission level using the existing share token, and returns updated outbound node attributes.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/sharebox.update_link
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | - |
| `share_id` | `string` | **Yes** | - | - |
| `permission` | `integer` | No | - | - |
| `days` | `integer` | No | `0` | - |
| `hours` | `integer` | No | `0` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
