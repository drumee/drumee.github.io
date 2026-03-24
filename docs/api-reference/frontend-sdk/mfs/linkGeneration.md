---
id: linkGeneration
title: linkGeneration
sidebar_label: linkGeneration
---

# Link Generation

This group covers all methods that build URLs for accessing, viewing, or sharing a media node — from direct file links to shareable viewer URLs and plugin endpoints.

---

## Overview

Each method targets a different use case:

| Method                    | Returns                     | Use for                    |
| ------------------------- | --------------------------- | -------------------------- |
| `url(format?)`            | Thumbnail or original URL   | Displaying media in UI     |
| `directUrl()`             | Direct file href            | Linking to the raw file    |
| `srcUrl()`                | Protocol + vhost + path URL | Embedding or src attribute |
| `viewerLink(format?, e?)` | Shareable viewer URL        | Sharing / opening in desk  |
| `pluginUrl()`             | Plugin endpoint URL         | Plugin-based file access   |
| `svcUrl(o)`               | Signed service URL          | Zip download endpoint      |

---

## `url(format?)`

Returns the URL for displaying a media node — defaulting to a **vignette (thumbnail)** for most file types, or the **original** for vector files.

### Signature

| Param    | Type   | Description                                                    |
| -------- | ------ | -------------------------------------------------------------- |
| `format` | String | Optional. Override the format (`_a.orig`, `_a.vignette`, etc.) |

### Behavior

```
url(format)
  │
  ├── filetype is "vector" → default format = _a.orig
  └── anything else        → default format = _a.vignette
  │
  └── format param overrides the default
        → delegates to super.url(resolvedFormat)
```

### Example

```js
// Get thumbnail URL (default for most files)
const thumbUrl = this.url();

// Get original file URL
const origUrl = this.url(_a.orig);
```

---

## `directUrl()`

Returns the **direct href** to the file from the actual node — or `null` if the node is not a regular file.

### Behavior

```
directUrl()
  │
  ├── not a regular file (hub, folder, symlink) → return null
  └── regular file → return this.actualNode().href
```

### Example

```js
const link = this.directUrl();
if (link) {
  window.open(link);
}
```

> **Note:** Always check for `null` before using the result — hubs, folders, and symlinks return `null`.

---

## `srcUrl()`

Builds a **protocol + vhost + ownpath** URL — suitable for use as a `src` attribute when embedding files (e.g. in an `<img>` or `<iframe>`).

### Behavior

```
srcUrl()
  │
  ├── not a regular file → return null
  └── regular file → "${protocol}://${vhost}${ownpath}"
```

### Example

```js
const src = this.srcUrl();
// → "https://files.drumee.com/private/user/image.png"

if (src) {
  imgElement.setAttribute("src", src);
}
```

---

## `viewerLink(format?, e?)`

Builds a **shareable URL** for opening the media node in the Drumee desk viewer. Handles private, shared, DMZ, and public areas differently — fetching external room attributes when needed.

### Signature

| Param    | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| `format` | String | Optional. Force a specific format (`_a.orig`, `_a.vignette`) |
| `e`      | Event  | Optional. The originating UI event                           |

### Behavior

```
viewerLink(format, e)
  │
  ├── Resolve format
  │     → vector → _a.orig
  │     → others → _a.vignette
  │     → format param overrides
  │
  ├── Build base viewer URL
  │     → resolve nid (from actualNode, or actual_home_id, home_id, fallback "*")
  │     → resolve hub_id
  │     → resolve filetype and kind (via window/configs/application)
  │     → construct: ${endpoint}/desk/wm/open/?${params}
  │
  ├── Special case: private hub
  │     → use getCurrentNid() to get correct nid
  │
  └── Adjust URL by area
        ├── "share" / "dmz"
        │     → fetchService(hub.get_external_room_attr)
        │     → hub  → viewerURL = r.link
        │     → file → viewerURL = "${r.link}/${nid}/play"
        │
        ├── "public" hub
        │     → fetchService(room.public_link)
        │     → viewerURL = r.link
        │
        └── "private" → use base URL as-is
  │
  └── Return URL with duplicate slashes cleaned up
```

### Area-based URL resolution

| Area            | Node type | How URL is built                          |
| --------------- | --------- | ----------------------------------------- |
| `private`       | any       | Base desk URL built from params           |
| `share` / `dmz` | file      | `external_room_attr.link + "/{nid}/play"` |
| `share` / `dmz` | hub       | `external_room_attr.link`                 |
| `public`        | hub       | `room.public_link.link`                   |

### Example

```js
// Get shareable link for current node
const link = await this.viewerLink();
copyToClipboard(link);

// Force original format
const link = await this.viewerLink(_a.orig);
```

> **Note:** `viewerLink` is `async` — always `await` it or handle with `.then()`.

---

## `pluginUrl()`

Builds the **plugin endpoint URL** for file access via a Drumee plugin, using the logical parent's `ownpath` and the bootstrap `endpointPath`.

### Behavior

```
pluginUrl()
  │
  └── "${protocol}://${vhost}${endpointPath}#/${logicalParent.ownpath}"
```

### Example

```js
const pluginLink = this.pluginUrl();
// → "https://drumee.com/endpoint#/private/user/my-folder"
```

---

## `svcUrl(o)` _(module-level helper)_

A **module-level utility function** (not a class method) that builds a signed service URL for the zip download endpoint.

### Signature

| Param | Type   | Description                               |
| ----- | ------ | ----------------------------------------- |
| `o`   | Object | Key-value pairs to append as query params |

### Behavior

```
svcUrl(o)
  │
  ├── o is not an object → return o as-is
  └── o is an object
        → base: "${svc}media.zip?keysel=${keysel}&"
        → append each key=value from o
        → return full URL string
```

### Example

```js
// Used internally by download_zip
const url = svcUrl({
  hub_id: "abc",
  nid: "123",
  name: "archive",
});
// → "https://api.drumee.com/media.zip?keysel=xxx&&hub_id=abc&nid=123&name=archive"
```

> **Note:** `svcUrl` is called internally by `download_zip()`. You rarely need to call it directly — use `download_zip()` instead.

---

## Choosing the Right URL Method

```
Need to display a thumbnail or preview?     → url()
Need the raw file href?                     → directUrl()
Need a src= attribute for embedding?        → srcUrl()
Need a shareable link for the viewer?       → viewerLink()  (async)
Need a plugin-based access URL?             → pluginUrl()
Need a signed zip download URL?             → svcUrl() via download_zip()
```

---

## Quick Reference

| Method                    | Async | Returns `null` if  | Handles area logic |
| ------------------------- | ----- | ------------------ | ------------------ |
| `url(format?)`            | ❌    | —                  | ❌                 |
| `directUrl()`             | ❌    | Not a regular file | ❌                 |
| `srcUrl()`                | ❌    | Not a regular file | ❌                 |
| `viewerLink(format?, e?)` | ✅    | —                  | ✅                 |
| `pluginUrl()`             | ❌    | —                  | ❌                 |
| `svcUrl(o)`               | ❌    | —                  | ❌                 |
