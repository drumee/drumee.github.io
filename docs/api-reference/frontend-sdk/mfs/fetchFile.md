---
id: fetchFile
title: fetchFile
sidebar_label: fetchFile
---

# Fetch File

This group covers all methods related to downloading and fetching file content — from initiating a download to streaming binary data, handling progress, and aborting in-flight requests.

---

## Overview

```
User triggers a download
  └── download(o)
        ├── hub / folder → download_tree()
        │     └── postService(media.download) — backend zips and notifies
        │
        └── regular file → fetchFile({ url, progress, download: filename })
              └── _fetchOptions() — build headers + AbortController
                    └── fetch(url, options) — stream response
                          └── read chunks → track progress
                                └── blob ready
                                      ├── o.download set → getBlob(blob, filename)
                                      │     └── create <a> → trigger browser download
                                      └── o.download not set → trigger("eod", blob)
```

For zip archives of multiple files or folders:

```
download_zip(o)
  └── svcUrl({ hub_id, nid, ... }) — build zip endpoint URL
        └── fetchFile({ url, progress, download: filename.zip })
```

---

## `download(o)`

The **main entry point** for downloading a media node. Handles both regular files and hub/folder types differently, and injects a progress indicator into the widget.

### Signature

| Param | Type   | Description                                    |
| ----- | ------ | ---------------------------------------------- |
| `o`   | Object | Options — pass empty `{}` for default behavior |

### Behavior

```
download(o)
  │
  ├── Get file URL from actualNode(_a.orig)
  ├── Append a progress indicator child (if not already present)
  │
  ├── filetype is hub or folder?
  │     └── o is empty → download_tree()
  │     └── return early (wait for backend zip notification)
  │
  └── regular file
        → build filename with extension
        → waitElement(pn) → fetchFile({ url, progress, download: filename })
```

### Example

```js
// Download the current media node
this.download({});

// Download with a custom progress handler
this.download({ progress: myProgressWidget });
```

> **Note:** For hubs and folders, `download` delegates to `download_tree()` and returns immediately. The actual download starts only after the backend sends a zip-complete notification via websocket.

---

## `download_tree()`

Requests the backend to **zip an entire hub or folder** and stream it to the client. Used internally by `download()` when the node type is `hub` or `folder`.

### What it does

```
download_tree()
  │
  ├── Resolve nid
  │     → hub  → use actual_home_id
  │     → else → use nid
  │
  ├── Check network sanity
  │     → if offline → Butler.say(LOCALE.ERROR_NETWORK) and return
  │
  └── postService(SERVICE.media.download, { nid, hub_id, socket_id })
        → backend zips the tree
        → notifies client via websocket when ready
```

> **Note:** `this._waitingForZip` is set to the current `nid` after the request. This flag lets the widget know a zip is in progress and handle the incoming websocket notification correctly.

---

## `download_zip(o)`

Downloads a **pre-built or custom zip archive** by constructing a zip service URL and streaming it via `fetchFile`.

### Signature

| Param        | Type   | Description                                |
| ------------ | ------ | ------------------------------------------ |
| `o.zipid`    | String | ID of the zip to download                  |
| `o.zipname`  | String | Filename for the downloaded zip            |
| `o.backup`   | Any    | Optional backup flag passed to the service |
| `o.progress` | Object | Optional progress widget reference         |

### Behavior

Resolves `hub_id` and `nid` based on the current node's `filetype`:

| `filetype`                        | `nid` used        | `hub_id` used       |
| --------------------------------- | ----------------- | ------------------- |
| `null` / `undefined` (not in DMZ) | `Visitor.home_id` | `Visitor.id`        |
| `hub`                             | `actual_home_id`  | `hub_id` from model |
| other                             | `nid` from model  | `hub_id` from model |

Then builds a signed URL via `svcUrl()` and calls `fetchFile` with the zip filename.

### Example

```js
this.download_zip({
  zipid: "abc123",
  zipname: "my-archive",
  progress: this._progressWidget,
});
// → downloads "my-archive.zip"
```

---

## `fetchFile(o)`

The **core streaming method** — fetches any URL as a binary stream, tracks progress chunk by chunk, and either triggers a browser download or emits the blob for further use.

### Signature

| Param        | Type   | Description                                                     |
| ------------ | ------ | --------------------------------------------------------------- |
| `o.url`      | String | The URL to fetch                                                |
| `o.download` | String | If set, filename for browser download via `getBlob()`           |
| `o.progress` | Object | Optional progress widget — receives `{ loaded, total }` updates |

### Streaming flow

```
fetchFile(o)
  │
  ├── _fetchOptions() → build headers + AbortController signal
  ├── fetch(o.url, options)
  │
  ├── response not ok → warn and return { error: status }
  │
  └── stream response body
        → read total size from content-length header
        → read chunks one by one via ReadableStream reader
        → accumulate chunks[]
        → report progress:
            if o.progress.update() exists → call it
            else → triggerMethod("fetch:progress") + trigger("progress")
        → when done (result.done):
            assemble Blob from chunks
            if o.progress.autoDestroy != "no" → progress.goodbye()
            if o.download set → getBlob(blob, o.download) [browser download]
            else              → trigger("eod", blob) + triggerMethod("eod", blob)
```

### Progress reporting

`fetchFile` reports progress in two ways depending on what's available:

```js
// If a progress widget is provided with an update method
o.progress.update({ loaded, total });

// Otherwise, broadcast on the widget itself
this.triggerMethod("fetch:progress", { loaded, total });
this.trigger(_e.progress, { loaded, total });
```

### Example

```js
// Stream and trigger browser download
await this.fetchFile({
  url: "https://api.drumee.com/my-file",
  download: "report.pdf",
  progress: this._progress,
});

// Stream and handle blob manually
this.on("eod", (blob) => {
  // use blob directly — e.g. display in a viewer
});
await this.fetchFile({ url: fileUrl });
```

---

## `_fetchOptions()`

Builds the **request options** for `fetchFile`, including authentication headers and a fresh `AbortController` for cancellation support.

### What it returns

```js
{
  mode: "cors",
  cache: "default",
  guard: "request",
  method: "GET",
  signal: this.aborter.signal,   // ← linked to abortDownload()
  headers: {
    "Accept": "*/*",
    "x-param-device": Visitor.device(),
    "x-param-device-id": Visitor.deviceId(),
    // + session headers from makeHeaders()
  }
}
```

> **Note:** A new `AbortController` is created each time `_fetchOptions` is called, stored at `this.aborter`. Calling `abortDownload()` uses this reference to cancel the in-flight request.

---

## `abortDownload()`

Cancels an in-flight `fetchFile` request by calling `abort()` on the current `AbortController`.

```js
abortDownload() {
  this.aborter.abort({ aborted: 1 });
}
```

The `signal` passed into `fetchFile` via `_fetchOptions` is linked to this controller — aborting it causes the `fetch` to reject, stopping the stream immediately.

### Example

```js
// Start a download
this.fetchFile({ url, download: "file.zip" });

// Cancel it later (e.g. user clicks cancel button)
this.abortDownload();
```

---

## `getBlob(blob, filename)`

Creates a **temporary object URL** from a blob and triggers a browser file download by programmatically clicking a hidden `<a>` element.

### Signature

| Param      | Type   | Description                                                |
| ---------- | ------ | ---------------------------------------------------------- |
| `blob`     | Blob   | The binary content to download                             |
| `filename` | String | The name for the downloaded file. Defaults to `"download"` |

### What it does

```
getBlob(blob, filename)
  │
  ├── URL.createObjectURL(blob) → temporary URL
  ├── Guard: if same URL as current → return early (avoid double download)
  ├── Create hidden <a> element with download + href attributes
  ├── unselect() — clear node selection state
  ├── a.click() — trigger browser download
  └── On click event (after 300ms):
        → URL.revokeObjectURL(url) — free memory
        → trigger("eod", blob) + triggerMethod("eod", blob)
        → remove <a> from DOM
```

> **Note:** The blob URL is revoked after 300ms to free browser memory. The `eod` (end-of-download) event is fired to notify listeners the download is complete.

---

## `getFromUrl(url)`

Downloads a file **directly from a plain URL** without streaming or progress tracking. Creates a hidden `<a>` element and clicks it — useful for pre-signed or direct-access URLs.

### Signature

| Param | Type   | Description                           |
| ----- | ------ | ------------------------------------- |
| `url` | String | A direct, pre-authorized download URL |

### Difference from `getBlob`

|                | `getBlob`            | `getFromUrl`             |
| -------------- | -------------------- | ------------------------ |
| Input          | Binary `Blob`        | Direct URL string        |
| Progress       | ✅ Via `fetchFile`   | ❌ None                  |
| Memory cleanup | ✅ `revokeObjectURL` | ❌ Not needed            |
| Use case       | Streamed downloads   | Pre-signed / direct URLs |

### Example

```js
// Download from a pre-signed URL
this.getFromUrl("https://storage.example.com/file.pdf?token=abc");
```

---

## Quick Reference

| Method                    | Use for                                  | Calls                                          |
| ------------------------- | ---------------------------------------- | ---------------------------------------------- |
| `download(o)`             | Main download entry point                | `download_tree` or `fetchFile`                 |
| `download_tree()`         | Zip and download a hub or folder         | `postService(media.download)`                  |
| `download_zip(o)`         | Download a pre-built zip archive         | `svcUrl`, `fetchFile`                          |
| `fetchFile(o)`            | Stream any URL as binary                 | `_fetchOptions`, `getBlob` or `trigger("eod")` |
| `_fetchOptions()`         | Build GET request options + abort signal | `makeHeaders`                                  |
| `abortDownload()`         | Cancel an in-flight fetchFile            | `this.aborter.abort()`                         |
| `getBlob(blob, filename)` | Trigger browser download from a Blob     | `URL.createObjectURL`                          |
| `getFromUrl(url)`         | Trigger browser download from a URL      | DOM `<a>.click()`                              |
