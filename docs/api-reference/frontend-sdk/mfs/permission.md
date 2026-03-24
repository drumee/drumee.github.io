---
id: permission
title: permission
sidebar_label: permission
---

# Permission

This group covers all methods that check what the current user is allowed to do with a media node — based on the node's `privilege` bitmask and contextual conditions like area, status, and node type.

---

## How Permissions Work

Permissions in Drumee are stored as a **bitmask** in the node's `privilege` field. Each permission level corresponds to a bit defined in `_K.permission`:

```
privilege & _K.permission.owner    → owns the node
privilege & _K.permission.admin    → can administrate
privilege & _K.permission.modify   → can organize / remove
privilege & _K.permission.write    → can upload
privilege & _K.permission.download → can download / share
```

All permission methods use bitwise AND (`&`) to check whether a specific bit is set. The result is either `0` (falsy, no permission) or a non-zero number (truthy, has permission).

---

## `isGranted(permission)`

The **base permission check** — tests whether a specific permission bit is set on the node's privilege field.

### Signature

| Param        | Type   | Description                          |
| ------------ | ------ | ------------------------------------ |
| `permission` | Number | A `_K.permission.*` bitmask constant |

### Example

```js
// Generic check
if (this.isGranted(_K.permission.write)) {
  // user can upload to this node
}
```

> All other permission methods in this group are convenience wrappers that combine `isGranted` with additional guards (area, status, node type).

---

## Permission Methods

### `isMediaOwner()`

Returns truthy if the current user **owns** this media node.

```js
isMediaOwner() {
  return this.mget(_a.privilege) & _K.permission.owner;
}
```

---

### `canAdmin()`

Returns truthy if the user has **admin rights** over this node.

```js
canAdmin() {
  return this.mget(_a.privilege) & _K.permission.admin;
}
```

---

### `canOrganize()`

Returns truthy if the user can **move, rename, or reorganize** this node.

Guards against symlinks — symlinked non-hub nodes cannot be organized:

```js
canOrganize() {
  if (this.mget(_a.isalink) && !this.isHub) return false;
  return this.mget(_a.privilege) & _K.permission.modify;
}
```

---

### `canUpload()`

Returns truthy if the user can **upload files** into this node.

Guards against symlinks — symlinked non-hub nodes cannot receive uploads:

```js
canUpload() {
  if (this.mget(_a.isalink) && !this.isHub) return false;
  return this.mget(_a.privilege) & _K.permission.write;
}
```

---

### `canShare()`

Returns truthy if the user can **generate a share link** for this node.

Only applies to nodes in the `dmz` or `share` area — sharing is not available in private or public areas:

```js
canShare() {
  if (!["dmz", _a.share].includes(this.mget(_a.area))) return false;
  return this.mget(_a.privilege) & _K.permission.download;
}
```

---

### `canManageAccess()`

Returns truthy if the user can **manage who has access** to this node (invite, revoke, etc.).

Requires both admin permission **and** the node to be in the `private` area:

```js
canManageAccess() {
  return (
    (this.mget(_a.privilege) & _K.permission.admin) &&
    (this.mget(_a.area) == _a.private)
  );
}
```

---

### `canRemove()`

Returns truthy if the user can **delete** this node.

Guards against locked nodes — a locked node cannot be removed regardless of privilege:

```js
canRemove() {
  if (this.mget(_a.status) == _a.locked) return false;
  return this.mget(_a.privilege) & _K.permission.modify;
}
```

---

### `canDownload()`

Returns truthy if the user can **download** this node.

```js
canDownload() {
  return this.mget(_a.privilege) & _K.permission.download;
}
```

---

## Permission Map

| Method              | Permission bit | Extra guard                   |
| ------------------- | -------------- | ----------------------------- |
| `isMediaOwner()`    | `owner`        | —                             |
| `canAdmin()`        | `admin`        | —                             |
| `canOrganize()`     | `modify`       | Not a symlink (unless hub)    |
| `canUpload()`       | `write`        | Not a symlink (unless hub)    |
| `canShare()`        | `download`     | Area must be `dmz` or `share` |
| `canManageAccess()` | `admin`        | Area must be `private`        |
| `canRemove()`       | `modify`       | Node must not be `locked`     |
| `canDownload()`     | `download`     | —                             |

---

## Example — Gating UI actions

```js
// Show action buttons only when the user has permission
const actions = [];

if (this.canUpload()) actions.push("upload");
if (this.canOrganize()) actions.push("move", "rename");
if (this.canRemove()) actions.push("delete");
if (this.canDownload()) actions.push("download");
if (this.canShare()) actions.push("share");
if (this.canManageAccess()) actions.push("manage-access");
```

---

## Quick Reference

| Method                  | Returns truthy when                                 |
| ----------------------- | --------------------------------------------------- |
| `isGranted(permission)` | The given bitmask bit is set on `privilege`         |
| `isMediaOwner()`        | User owns the node                                  |
| `canAdmin()`            | User has admin rights                               |
| `canOrganize()`         | User can reorganize, node is not a non-hub symlink  |
| `canUpload()`           | User can write, node is not a non-hub symlink       |
| `canShare()`            | User can download, node is in `dmz` or `share` area |
| `canManageAccess()`     | User has admin rights, node is in `private` area    |
| `canRemove()`           | User can modify, node is not `locked`               |
| `canDownload()`         | User has download rights                            |
