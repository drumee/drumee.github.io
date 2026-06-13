---
id: task
title: task API
sidebar_label: task
---

# TASK API Reference

## Module Information

**Service Files:**
- Private: `service/private/task.js`

**Available Services:** 18
**Documented Services:** 18

---

## task.list

List tasks scoped to a folder node, ordered by Kanban column then rank. Returns all statuses for that folder.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/task.list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | No | - | Folder node id to scope to. Absent/null returns legacy unscoped (nid IS NULL) tasks. |
| `include_unscoped` | `number` | No | `0` | When 1 (workspace-root view), also include legacy tasks with no folder (nid IS NULL). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.id` | `string` | Task ID |
| `items.title` | `string` | Task title |
| `items.description` | `string` | Task description (long text), null if not set |
| `items.status` | `string` | Kanban column: todo | in_progress | to_review | complete |
| `items.priority` | `string` | Priority: low | medium | high | urgent |
| `items.due_date` | `string` | Due date (YYYY-MM-DD), null if not set |
| `items.created_by` | `string` | UID of the user who created the task |
| `items.nid` | `string` | Folder node id the task belongs to, null if workspace-level (legacy) |
| `items.assignee_uids` | `string` | Comma-separated list of assignee UIDs, null if unassigned |
| `items.rank` | `number` | Position within the status column |
| `items.ctime` | `number` | Unix timestamp of creation |
| `items.mtime` | `number` | Unix timestamp of last update |
| `items.label_ids` | `string` | Comma-separated list of label IDs attached to the task, null if none |

---

## task.create

Create a new task scoped to a folder node. The task is placed at the bottom of the target status column within that folder.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.create
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `title` | `string` | **Yes** | - | Task title |
| `description` | `string` | No | - | Long-form task description. Optional. |
| `status` | `string (todo, in_progress, to_review, complete)` | No | `"todo"` | Initial Kanban column. Defaults to todo. |
| `priority` | `string (low, medium, high, urgent)` | No | `"medium"` | Task priority. Defaults to medium. |
| `due_date` | `string` | No | - | Due date in YYYY-MM-DD format. Optional. |
| `nid` | `string` | No | - | Folder node id the task belongs to. Absent/null = workspace-level. |
| `assignee_uids` | `array<string>` | No | - | UIDs of the users to assign. Optional. Each must be a valid drumate. |
| `assignee_uid` | `string` | No | - | Deprecated single-assignee form (use assignee_uids). Still accepted. |
| `mention_uids` | `array<string>` | No | - | UIDs @-mentioned in the description. Server notifies each (excluding self). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_ASSIGNEE` | 400 | assignee_uid does not reference a valid user |

---

## task.update

Update a task's title, description, priority and/or due date. Title / description / priority: omit to keep existing value. due_date is always written through (pass null to clear).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Task ID to update |
| `title` | `string` | No | - | New task title. Omit to keep existing value. |
| `description` | `string` | No | - | New task description. Omit to keep existing value; pass empty string to clear. |
| `priority` | `string (low, medium, high, urgent)` | No | - | New priority. Omit to keep existing value. |
| `due_date` | `string` | No | - | New due date in YYYY-MM-DD format. Pass null to clear. |
| `mention_uids` | `array<string>` | No | - | UIDs newly @-mentioned in this edit. Server notifies each (excluding self). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `TASK_NOT_FOUND` | 404 | No task found with the given ID |
| `INVALID_PRIORITY` | 400 | priority must be one of: low, medium, high, urgent |

---

## task.update_status

Move a task to a different Kanban column. The task is placed at the bottom of the destination column.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.update_status
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Task ID to move |
| `status` | `string (todo, in_progress, to_review, complete)` | **Yes** | - | Destination Kanban column |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `TASK_NOT_FOUND` | 404 | No task found with the given ID |
| `INVALID_STATUS` | 400 | status must be one of: todo, in_progress, to_review, complete |

---

## task.update_assignee

Replace a task's assignee set (multi-assignee). Pass the full new set in assignee_uids; an empty array clears all assignees.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.update_assignee
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Task ID |
| `assignee_uids` | `array<string>` | No | - | Full new set of assignee UIDs. [] clears all. Each must be a valid drumate. |
| `assignee_uid` | `string` | No | - | Deprecated single-assignee form (use assignee_uids). Still accepted; null unassigns. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `TASK_NOT_FOUND` | 404 | No task found with the given ID |
| `INVALID_ASSIGNEE` | 400 | assignee_uid does not reference a valid user |

---

## task.delete

Delete a task permanently. All linked file and label associations are removed.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Task ID to delete |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

---

## task.link_file

Link a file (media node) to a task. Idempotent — linking the same file twice has no effect. Returns the full updated list of files linked to the task.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.link_file
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_id` | `string` | **Yes** | - | Task ID to link the file to |
| `file_nid` | `string` | **Yes** | - | Media node ID of the file to link |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.task_id` | `string` | Task ID |
| `items.file_nid` | `string` | File media node ID |
| `items.linked_by` | `string` | UID of the user who linked the file |
| `items.ctime` | `number` | Unix timestamp of when the file was linked |
| `items.filename` | `string` | File display name (user_filename from media) |
| `items.category` | `string` | File category (document, image, etc.) |
| `items.extension` | `string` | File extension |
| `items.filesize` | `number` | File size in bytes |

---

## task.unlink_file

Remove the link between a file and a task. The file itself is not deleted from the hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.unlink_file
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_id` | `string` | **Yes** | - | Task ID to unlink the file from |
| `file_nid` | `string` | **Yes** | - | Media node ID of the file to unlink |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

---

## task.get_linked_files

Get all files linked to a task, including file metadata from the media table.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/task.get_linked_files
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_id` | `string` | **Yes** | - | Task ID to get linked files for |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

---

## task.link_label

Attach a label to a task. Idempotent — linking the same label twice has no effect. Returns the updated list of labels on the task.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.link_label
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_id` | `string` | **Yes** | - | Task ID |
| `label_id` | `string` | **Yes** | - | Label ID |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.task_id` | `string` | Task ID |
| `items.label_id` | `string` | Label ID |
| `items.ctime` | `number` | Unix timestamp of when the label was linked |
| `items.name` | `string` | Label name |
| `items.color` | `string` | Label color (hex with leading #) |

---

## task.unlink_label

Remove a label from a task. The label itself is not deleted from the hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.unlink_label
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_id` | `string` | **Yes** | - | Task ID |
| `label_id` | `string` | **Yes** | - | Label ID |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

---

## task.get_labels

Get all labels attached to a task.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/task.get_labels
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_id` | `string` | **Yes** | - | Task ID |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

---

## task.search_files

Search media files in the current hub that can be linked to a task. Results are filtered by the caller's read-permission. If task_id is provided, files already linked to that task are excluded.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/task.search_files
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pattern` | `string (min: 1)` | **Yes** | - | Filename substring |
| `task_id` | `string` | No | - | Exclude files already linked to this task |
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.nid` | `string` | Media node ID |
| `items.filename` | `string` | Display filename |
| `items.ext` | `string` | File extension |
| `items.category` | `string` | File category |
| `items.filesize` | `number` | File size in bytes |
| `items.mtime` | `number` | Unix timestamp of last upload |
| `items.score` | `number` | Match score (higher = better) |

---

## task.comment_list

List a task's comments (flat, chronological). Author name/avatar is resolved client-side from the hub member list.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/task.comment_list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_id` | `string` | **Yes** | - | Task ID to list comments for |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `items` | `object` | - |
| `items.id` | `string` | Comment ID |
| `items.task_id` | `string` | Parent task ID |
| `items.author_uid` | `string` | UID of the comment author |
| `items.body` | `string` | Comment body in marker form [@Name](user:uid) |
| `items.edited` | `number` | 1 if the comment was edited |
| `items.ctime` | `number` | Unix timestamp of creation |
| `items.mtime` | `number` | Unix timestamp of last edit |

---

## task.comment_create

Add a comment to a task. @-mentioned members are notified.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.comment_create
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_id` | `string` | **Yes** | - | Task ID to comment on |
| `body` | `string` | **Yes** | - | Comment body in marker form [@Name](user:uid) |
| `parent_id` | `string` | No | - | Root comment id when this is a reply; omit/null for a top-level comment |
| `mention_uids` | `array<string>` | No | - | UIDs @-mentioned in the body. Server notifies each (excluding self). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

---

## task.comment_react

Toggle the caller's emoji reaction on a comment (add if absent, remove if present).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.comment_react
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `comment_id` | `string` | **Yes** | - | Comment ID to react to |
| `task_id` | `string` | **Yes** | - | Parent task ID (so the broadcast targets the right feed) |
| `emoji` | `string` | **Yes** | - | Reaction emoji |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

---

## task.comment_update

Edit your own comment. Returns COMMENT_NOT_FOUND if the caller is not the author.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.comment_update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Comment ID to edit |
| `body` | `string` | **Yes** | - | New comment body in marker form |
| `mention_uids` | `array<string>` | No | - | UIDs @-mentioned in the body. Server notifies each (excluding self). |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `COMMENT_NOT_FOUND` | 404 | No comment with that ID owned by the caller |

---

## task.comment_delete

Delete your own comment.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (8) |

**Endpoint:**
```
https://hostname/-/svc/task.comment_delete
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Comment ID to delete |
| `task_id` | `string` | **Yes** | - | Parent task ID (so the broadcast targets the right feed) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `doc` | `any` | - |
| `properties` | `any` | - |

---

## Related Documentation

- [ACL System](../../technology/02-acl-system.md) - Permission model
- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference
- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed
- [Error Handling](../../product-guides/05-error-handling.md) - Error codes
