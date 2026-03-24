---
id: mediaState
title: mediaState
sidebar_label: mediaState
---

# Media State

This group covers methods that synchronize a media node's state with the server — marking it as read and refreshing its attributes from the latest server data.

---

## `markAsSeen()`

Notifies the server that the current user has **viewed this media node**, clearing its unread/notification state.

### Behavior

```
markAsSeen()
  │
  ├── node is a hub or folder → return early (skip)
  ├── Visitor is in DMZ       → return early (skip)
  │
  └── postService(SERVICE.media.mark_as_seen, {
          nid, hub_id, mode: "direct_call"
      })
```

### When it's called

Call `markAsSeen()` when the user opens or previews a file — to signal that any pending notification for this node should be dismissed.

```js
// After opening a file for viewing
this.markAsSeen();
```

### Why it skips hubs, folders, and DMZ

- **Hubs and folders** are containers, not content — marking them as "seen" is not meaningful.
- **DMZ (guest access)** sessions do not track read state since the visitor is unauthenticated.

---

## `syncAttributes()`

Fetches the **latest node attributes** from the server and updates the local model. Use this to refresh a node's metadata without triggering a full re-render.

### Behavior

```
syncAttributes()
  │
  └── fetchService(SERVICE.media.get_node_attr, { nid, hub_id })
        → server returns updated attributes
        → model is updated automatically by the service response handler
```

### When to use

Call `syncAttributes()` when the node's data may have changed on the server — for example after another user edits the file, or after a background operation completes:

```js
// Refresh node data after a remote change
this.syncAttributes();
```

---

## Comparison

| Method             | Direction       | Triggers server write | Use when                  |
| ------------------ | --------------- | --------------------- | ------------------------- |
| `markAsSeen()`     | Client → Server | ✅ Yes                | User opens / views a file |
| `syncAttributes()` | Server → Client | ❌ No (read only)     | Node data may be stale    |

---

## Quick Reference

| Method             | Guards                                | Service called                |
| ------------------ | ------------------------------------- | ----------------------------- |
| `markAsSeen()`     | Skips hubs, folders, and DMZ sessions | `SERVICE.media.mark_as_seen`  |
| `syncAttributes()` | None                                  | `SERVICE.media.get_node_attr` |
