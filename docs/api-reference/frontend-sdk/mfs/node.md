---
id: node
title: node
sidebar_label: node
---

# Node

This group covers methods that read structural information about a media node — its identity, host, type classification, and whether it is a symlink or a regular file.

---

## Overview

These are all **read-only** methods. They do not modify state — they inspect the node's model and return a value.

| Method            | Returns         | Answers                                               |
| ----------------- | --------------- | ----------------------------------------------------- |
| `getCurrentNid()` | `nid` number    | What is the current directory node ID?                |
| `getHostName()`   | `vhost` string  | Which host does this node live on?                    |
| `getHostId()`     | `hub_id` string | Which hub does this node belong to?                   |
| `isRegularFile()` | Boolean         | Is this a plain file (not a hub, folder, or symlink)? |
| `isSymLink()`     | Boolean         | Is this a symbolic link (but not a hub)?              |

---

## `getCurrentNid()`

Returns the **current directory node ID** — the `nid` that represents "where we are" in the file tree, based on the node's `filetype`.

### Behavior

```
getCurrentNid()
  │
  ├── filetype is "folder" → return nodeId
  ├── filetype is "hub"    → return 0
  └── anything else        → return parentId
```

### When to use

Use `getCurrentNid()` when building a link or service call that needs to know the container node, not the file node itself. For example, `viewerLink()` calls it to get the correct `nid` for private hubs.

```js
const nid = this.getCurrentNid();
// folder → its own nodeId
// hub    → 0 (root of the hub)
// file   → its parent folder's id
```

---

## `getHostName()`

Returns the **virtual hostname** (`vhost`) of the node — the domain or subdomain where this node's files are served from.

```js
getHostName() {
  return this.mget(_a.vhost);
}
```

### Example

```js
const host = this.getHostName();
// → "files.drumee.com"

// Used internally to build srcUrl
const src = `${protocol}://${this.getHostName()}${this.mget(_a.ownpath)}`;
```

---

## `getHostId()`

Returns the **hub ID** (`hub_id`) the node belongs to. This is the identifier of the hub (workspace) that owns this media node.

```js
getHostId() {
  return this.mget(_a.hub_id);
}
```

### Example

```js
const hubId = this.getHostId();

// Pass to a service call
await this.fetchService({
  service: SERVICE.media.get_node_attr,
  hub_id: this.getHostId(),
  nid: this.mget(_a.nid),
});
```

---

## `isRegularFile()`

Returns `true` if the node is a **plain file** — not a hub, not a folder, and not a symlink.

### Behavior

```
isRegularFile()
  │
  ├── this.isHubOrFolder is set → return false
  ├── this.mget(_a.isalink)     → return false
  └── otherwise                 → return true
```

### When to use

Several other methods gate their logic on `isRegularFile()` before proceeding:

```js
// directUrl — only meaningful for regular files
directUrl() {
  if (!this.isRegularFile()) return null;
  return this.actualNode().href;
}

// srcUrl — same guard
srcUrl() {
  if (!this.isRegularFile()) return null;
  return `${protocol}://${this.mget(_a.vhost)}${this.mget(_a.ownpath)}`;
}
```

Use it the same way in your own code when an operation only makes sense for plain files:

```js
if (this.isRegularFile()) {
  this.fetchFile({ url: this.directUrl(), download: this.fullname() });
}
```

---

## `isSymLink()`

Returns `true` if the node is a **symbolic link** — but explicitly excludes hubs, which can also have `isalink` set.

### Behavior

```
isSymLink()
  │
  └── isalink is truthy AND filetype is NOT "hub"
        → return true
        → otherwise return false
```

### Why exclude hubs?

Hubs may carry the `isalink` flag internally, but they are treated as top-level containers — not as symlinks — for navigation and permission purposes. `isSymLink()` reflects the user-facing meaning: a link to another file or folder, never a hub.

### Example

```js
if (this.isSymLink()) {
  // navigate to the original node instead
  this.openOriginal();
}
```

---

## Type Classification at a Glance

All type flags set during `initData()` and used by this group:

| Flag / Method        | True when                           |
| -------------------- | ----------------------------------- |
| `this.isHub`         | `filetype === "hub"`                |
| `this.isFolder`      | `filetype === "folder"`             |
| `this.isHubOrFolder` | `filetype` is `"hub"` or `"folder"` |
| `isRegularFile()`    | Not hub/folder, not symlink         |
| `isSymLink()`        | `isalink` is set AND not a hub      |

---

## Quick Reference

| Method            | Returns                       | Null-safe        |
| ----------------- | ----------------------------- | ---------------- |
| `getCurrentNid()` | `nid` (number or `0` for hub) | ✅               |
| `getHostName()`   | `vhost` string                | Depends on model |
| `getHostId()`     | `hub_id` string               | Depends on model |
| `isRegularFile()` | `true` / `false`              | ✅               |
| `isSymLink()`     | `true` / `false`              | ✅               |
