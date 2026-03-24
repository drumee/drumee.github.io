---
id: contact
title: contact API
sidebar_label: contact
---

# CONTACT API Reference

## Module Information

**Service Files:**
- Private: `service/private/contact.js`
- Public: `service/contact.js`

**Available Services:** 42
**Documented Services:** 22

---

## contact.invite

Send a contact invitation by email. Creates a contact entry and dispatches an invitation email. For non-Drumee users, sends a signup link. For registered Drumee users on different domains, sends a notification email. Same-domain colleagues on a Paid plan cannot be invited as they are automatically in contacts.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.invite
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | Email address of the person to invite |
| `message` | `string` | No | - | Optional personal message to include in the invitation email |
| `firstname` | `string` | No | - | First name of the invitee |
| `lastname` | `string` | No | - | Last name of the invitee |
| `surname` | `string` | No | - | Middle or additional name of the invitee |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | The email address format is invalid |
| `ALREADY_IN_CONTACT` | 409 | This email is already an active contact in your list |
| `INVITE_RECEIVED` | 409 | You already have a pending invitation from this person |
| `SAME_DOMAIN` | 400 | Cannot invite a colleague from the same paid-plan domain; they are automatically in your contacts |

---

## contact.invite_accept

Accept a pending contact invitation from another Drumee user. Creates a bidirectional contact connection, initiates a welcome chat exchange via handshake, logs the accept activity, and notifies the inviting party via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.invite_accept
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | Email address of the Drumee user whose invitation you are accepting |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NOT_A_DRUMATE` | 404 | The email address does not belong to a registered Drumee user |
| `NO_INVITE` | 404 | No pending invitation found from this user |

---

## contact.invite_refuse

Refuse a pending contact invitation from another Drumee user. Updates the invitation status, logs the refuse activity, and notifies the inviting party via WebSocket.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.invite_refuse
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | Email address of the Drumee user whose invitation to refuse |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NOT_A_DRUMATE` | 404 | The email address does not belong to a registered Drumee user |
| `NO_INVITE` | 404 | No pending invitation found from this user |

---

## contact.add

Manually add a new contact by Drumee user ID or by email address list. These two inputs are mutually exclusive. Optionally sends an invitation email by setting invite=1.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.add
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `invitee_id` | `string` | No | - | Drumee user ID of the contact to add. Mutually exclusive with email array. |
| `email` | `array` | No | - | Array of email objects: [\{ email, is_default, category \}]. Required if invitee_id is not provided. One entry must have is_default=1. |
| `firstname` | `string` | No | - | Contact's first name |
| `lastname` | `string` | No | - | Contact's last name |
| `surname` | `string` | No | - | Contact's middle or additional name |
| `mobile` | `array` | No | - | Array of phone objects: [\{ phone, areacode, category, is_default \}] |
| `address` | `array` | No | - | Array of address objects: [\{ street, city, country, category, is_default \}] |
| `tag` | `array` | No | - | Array of tag identifiers to assign to this contact |
| `comment` | `string` | No | - | Internal comment or note about this contact |
| `message` | `string` | No | - | Personal message included in invitation email when invite=1 |
| `invite` | `string` | No | `"0"` | Set to '1' to send an invitation email to the contact |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_DATA` | 400 | Provide either invitee_id or email array, but not both (or neither) |
| `INVALID_INVITEE_ID` | 404 | The provided invitee_id does not match any registered Drumee user |
| `SAME_DOMAIN` | 400 | Cannot add a colleague from the same paid-plan domain as an external contact |
| `MANY_DEFAULT_EMAIL` | 400 | Only one email address can be designated as default (is_default=1) |
| `NO_DEFAULT_MAIL` | 400 | At least one email address must be designated as default |
| `ALREADY_IN_CONTACT` | 409 | This contact already exists in your contact list |
| `SELF_CONTACT` | 400 | You cannot add yourself as a contact |
| `EMAIL_NOT_SENT` | 207 | Contact was created successfully but the invitation email failed to send |

---

## contact.update

Update an existing contact's information including name, email addresses, phone numbers, addresses, and tags. All sub-arrays are fully replaced on update (not merged). Optionally re-sends or initiates an invitation via invite=1.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `contact_id` | `string` | **Yes** | - | ID of the contact to update |
| `firstname` | `string` | No | - | Updated first name. Required when the contact is linked to a Drumee user (uid is set). |
| `lastname` | `string` | No | - | Updated last name. Required when the contact is linked to a Drumee user (uid is set). |
| `surname` | `string` | No | - | Updated middle or additional name |
| `email` | `array` | No | - | Replacement email list: [\{ email, is_default, category \}]. Fully replaces existing emails. |
| `mobile` | `array` | No | - | Replacement phone list: [\{ phone, areacode, category, is_default \}]. Fully replaces existing phones. |
| `address` | `array` | No | - | Replacement address list: [\{ street, city, country, category, is_default \}]. Fully replaces existing addresses. |
| `tag` | `array` | No | - | Replacement tag list. Fully replaces existing tags. |
| `comment` | `string` | No | - | Updated internal comment |
| `message` | `string` | No | - | Message for invitation email (used when invite=1) |
| `invite` | `string` | No | `"0"` | Set to '1' to send or re-send an invitation email |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `CONACT_NOT_EXIST` | 404 | No contact found with the given contact_id |
| `EMPTY_FIRSTNAME` | 400 | First name is required when updating a contact linked to a Drumee user |
| `EMPTY_LASTNAME` | 400 | Last name is required when updating a contact linked to a Drumee user |
| `MANY_DEFAULT_EMAIL` | 400 | Only one email address can be designated as default (is_default=1) |
| `NO_DEFAULT_MAIL` | 400 | A default email address is required when is_need_email is set on this contact |
| `ALREADY_IN_CONTACT` | 409 | The new email/entity is already used by another contact in your list |
| `SAME_DOMAIN` | 400 | Cannot assign a same-domain colleague as an external contact |
| `SELF_CONTACT` | 400 | You cannot set yourself as a contact |
| `EMAIL_NOT_SENT` | 207 | Contact was updated successfully but the invitation email failed to send |

---

## contact.show_contact

List the current user's contacts with optional filtering by tag, name, and status. Free users (domain_id=1) see only their personal contact table. Paid users (domain_id>1) see personal contacts only; same-domain colleagues are available via my_contacts.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.show_contact
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tag_id` | `string` | No | - | Filter contacts belonging to a specific tag ID. Pass empty string to show all tags. |
| `name` | `string` | No | - | Search keyword to filter contacts by name (partial match) |
| `order` | `string` | No | `"asc"` | Sort direction: 'asc' or 'desc' |
| `page` | `number` | No | `1` | Page number for pagination |
| `option` | `string` | No | `"active"` | Filter by contact status: 'active', 'archived', or 'all' |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.my_contacts

Search and filter the current user's contacts. Free users (domain_id=1) see only their personal contact table. Paid users (domain_id>1) see personal contacts UNION colleagues from the same domain. Returns an empty array when the search key is empty.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.my_contacts
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `value` | `string` | No | `""` | Search keyword to filter by name or email. Returns empty array if omitted or blank. |
| `page` | `number` | No | `1` | Page number for pagination |
| `only_drumate` | `number` | No | `0` | Set to 1 to return only contacts who are registered Drumee users |
| `filter` | `array` | No | - | Array of additional filter criteria |
| `status` | `string` | No | `""` | Filter by contact status (active, archived, etc.) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.get_contact

Retrieve full details of a specific contact including all associated email addresses, phone numbers, postal addresses, and tags.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.get_contact
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `contact_id` | `string` | **Yes** | - | ID of the contact to retrieve |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.delete_contact

Permanently delete a contact from the current user's contact list. Sends a real-time WebSocket notification to both the owner and the contact (if they are a Drumee user).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.delete_contact
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `contact_id` | `string` | **Yes** | - | ID of the contact to permanently delete |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.search

Search for Drumee users across the platform by keyword within the current domain. Intended for discovering potential contacts to add. Returns an empty array if the search key is blank.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.search
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `key` | `string` | No | - | Search keyword (name or email). Returns empty array if omitted. |
| `string` | `string` | No | - | Alternative parameter name for key |
| `page` | `number` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.invite_get

Retrieve the list of pending contact invitations received by the current user. Used to display the invitation inbox.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.invite_get
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.invite_count

Get the count of pending contact invitations received by the current user. Used to display notification badges in the UI.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.invite_count
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

## contact.accept_informed

Acknowledge that the current user has been notified that their sent invitation was accepted by the recipient. Transitions the contact status from 'informed' to 'active' on the sender's side and sends a WebSocket update.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.accept_informed
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | Email address of the Drumee user who accepted your invitation |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NOT_A_DRUMATE` | 404 | The email address does not belong to a registered Drumee user |
| `NO_INVITE` | 404 | No informed-status invitation found for this user |

---

## contact.block

Block a contact to prevent further interaction. Updates the contact relationship record for both parties and sends real-time WebSocket notifications.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.block
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `contact_id` | `string` | **Yes** | - | ID of the contact to block |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.unblock

Unblock a previously blocked contact, restoring the contact relationship. Sends real-time WebSocket notifications to both parties.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.unblock
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `contact_id` | `string` | **Yes** | - | ID of the contact to unblock |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.change_status

Change the status of a contact to 'active' (restore) or 'archived' (soft-archive without deletion). Sends a real-time WebSocket update to the current user's sessions.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.change_status
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `contact_id` | `string` | **Yes** | - | ID of the contact whose status to change |
| `status` | `string` | **Yes** | - | New status value. Allowed values: 'active', 'archived' |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_STATUS0` | 400 | Status must be either 'active' or 'archived' |
| `CONACT_NOT_EXIST` | 404 | No contact found with the given contact_id |

---

## contact.join

Join a contact network via an invitation token received in an invitation email. Validates the token, creates the contact relationship, and returns the newly created contact record.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.join
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | Invitation token received in the invitation email link |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_TOKEN` | 400 | The provided invitation token is invalid or does not exist |
| `EXPIRIED_TOKEN` | 410 | The invitation token has expired and is no longer active |

---

## contact.summary

Get a contact summary for a hub node. Returns the count of active contacts and the timestamp of the most recent contact modification. Requires owner-level access to the specified node.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.summary
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | Hub ID containing the target node |
| `nid` | `string` | **Yes** | - | Node ID to retrieve the contact summary for |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FOLDER_NOT_FOUND` | 404 | The specified node does not exist in this hub |
| `PERMISSION_DENIED` | 403 | Only the node owner can retrieve the contact summary |

---

## contact.google_auth

Initiate the Google OAuth authorization flow to import contacts from Google Contacts. Returns a Google authorization URL that the user must visit to grant read-only access to their Google Contacts.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/contact.google_auth
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

## contact.invitation_status

Check the status of a contact invitation using its token. Public endpoint (no authentication required) used to display the invitation landing page before the recipient logs in.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/contact.invitation_status
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | Invitation token from the invitation email URL |
| `uid` | `string` | No | - | Optional Drumee user ID to provide additional context about the recipient |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.load

Import contacts from an uploaded CSV or VCF (vCard) file. Processes the file and reports real-time import progress via WebSocket using socket_id. Each entry requires at least one email address. Supports .csv and .vcf formats.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.load
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | WebSocket session ID for streaming real-time progress updates during import |
| `uploaded_id` | `string` | No | - | ID of the file from an upload operation. Mutually exclusive with secret. |
| `secret` | `string` | No | - | Legacy file ID. Mutually exclusive with uploaded_id. |
| `service` | `string` | No | - | Optional service tag used in WebSocket progress messages |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_FILE` | 400 | No file ID was provided; either uploaded_id or secret is required |
| `INVALID_INPUT` | 400 | Both uploaded_id and secret were provided; only one is allowed at a time |
| `WRONG_FORMAT` | 415 | The uploaded file is not a supported format; only .csv and .vcf are accepted |

---

## contact.connection_status

Retrieve the current online/offline presence state of all contacts. Used to display real-time presence indicators in the contact list.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.connection_status
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## contact.add_to_group

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.add_to_group
```

---

## contact.create_group

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.create_group
```

---

## contact.delete

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.delete
```

---

## contact.delete_contact_address

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.delete_contact_address
```

---

## contact.delete_contact_email

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.delete_contact_email
```

---

## contact.delete_contact_phone

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.delete_contact_phone
```

---

## contact.delete_group

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.delete_group
```

---

## contact.export_all

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.export_all
```

---

## contact.get

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.get
```

---

## contact.get_group_avatar

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.get_group_avatar
```

---

## contact.import

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.import
```

---

## contact.invite_drumate

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.invite_drumate
```

---

## contact.remove_from_group

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.remove_from_group
```

---

## contact.search_drumee_contacts

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.search_drumee_contacts
```

---

## contact.search_my_contacts

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.search_my_contacts
```

---

## contact.set_group_avatar

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.set_group_avatar
```

---

## contact.show

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.show
```

---

## contact.show_gmail_contacts

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.show_gmail_contacts
```

---

## contact.show_groups

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.show_groups
```

---

## contact.show_members

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/contact.show_members
```

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
