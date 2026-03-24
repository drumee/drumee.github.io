---
id: tagcontact
title: tagcontact API
sidebar_label: tagcontact
---

# TAGCONTACT API Reference

## Module Information

**Service Files:**
- Private: `service/private/tagcontact.js`

**Available Services:** 8
**Documented Services:** 8

---

## tagcontact.add

Create a new contact tag. Adds a named tag to the user's hub for categorising contacts. The tag is created with an empty description by default. Returns the newly created tag record.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/tagcontact.add
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## tagcontact.entity_assign

Assign one or more tags to a contact entity or shared hub. Replaces all existing tag assignments for the entity with the supplied list. Validates every tag_id before applying and verifies the entity is a known contact or a hub-type shared room. Sends a WebSocket notification to the owner's sockets when the entity is a shared hub rather than a direct contact.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/tagcontact.entity_assign
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity_id` | `string` | **Yes** | - | - |
| `tag` | `array<string>` | No | - | - |
| `list` | `array<string>` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.tag_id` | `string` | - |
| `items.name` | `string` | - |
| `items.entity_id` | `string` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `TAG_NOT_FOUND` | - | One or more of the supplied tag IDs do not exist in the hub |
| `INVALID_ENTITY` | - | entity_id does not correspond to a known contact or a hub-type shared room |

---

## tagcontact.entity_assign_get

Get all tags currently assigned to a contact entity. Queries the calling user's personal database via forward_proc to retrieve tag assignments for the given entity. Returns an empty list when no tags are assigned.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/tagcontact.entity_assign_get
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.tag_id` | `string` | - |
| `items.name` | `string` | - |
| `items.entity_id` | `string` | - |

### Possible Errors

*Error codes not documented*

---

## tagcontact.tag_assign

Set a parent-child relationship between two tags. Validates that both tag and parent tag exist, then checks that assigning the parent would not create a circular hierarchy. Raises CANT_ASSIGN when the target tag is already an ancestor of the proposed parent.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/tagcontact.tag_assign
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tag_id` | `string` | **Yes** | - | - |
| `parent_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `TAG_NOT_FOUND` | - | The child tag identified by tag_id does not exist |
| `PARENT_TAG_NOT_FOUND` | - | The parent tag identified by parent_id does not exist |
| `CANT_ASSIGN` | - | Assigning this parent would create a circular tag hierarchy |

---

## tagcontact.reposition

Reorder the display position of tags. Accepts an ordered list of tag position entries and persists the new order via the tag_reposition stored procedure. Returns the updated ordered tag list.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/tagcontact.reposition
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `content` | `array<object>` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.tag_id` | `string` | - |
| `items.name` | `string` | - |
| `items.position` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## tagcontact.remove

Delete a contact tag by ID. Removes the tag record via the tag_remove stored procedure. All entity assignments referencing this tag are also removed by the stored procedure via cascade.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/tagcontact.remove
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tag_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## tagcontact.rename

Rename an existing contact tag. Verifies the tag exists before applying the new name. Returns the updated tag record after renaming.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/tagcontact.rename
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tag_id` | `string` | **Yes** | - | - |
| `name` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `TAG_NOT_FOUND` | - | No tag found for the given tag_id |

---

## tagcontact.show_tag_by

List tags with optional filtering and pagination. Wraps the tag_get_next stored procedure. Can filter by a parent tag_id, search by keyword, control sort order, and paginate results. When tag_id is empty all top-level tags are returned.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/tagcontact.show_tag_by
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `tag_id` | `string` | No | `""` | - |
| `search` | `string` | No | `""` | - |
| `order` | `string` | No | `"desc"` | - |
| `page` | `integer` | No | `1` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `object` | - |
| `items.tag_id` | `string` | - |
| `items.name` | `string` | - |
| `items.parent_id` | `string` | - |
| `items.position` | `integer` | - |

### Possible Errors

*Error codes not documented*

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
