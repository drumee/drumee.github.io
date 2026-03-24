---
id: upload
title: upload
sidebar_label: upload
---

# uploadFile(file, params)

Sends a **binary file to the server** via `XMLHttpRequest`. Supports progress tracking, abort handling, and both `File` objects and `FileEntry` (filesystem API).

---

## When to Use

Use `uploadFile` when uploading a file binary directly to a backend service endpoint. It is the underlying transport used by the upload pipeline — called automatically when a widget processes files from drag-and-drop or file picker events.

---

## Signature

```js
uploadFile(file, params);
```

| Param    | Type                  | Description                                                   |
| -------- | --------------------- | ------------------------------------------------------------- |
| `file`   | `File` or `FileEntry` | The file to upload                                            |
| `params` | Object                | Upload options — service name, metadata, and any extra fields |

---

## How It Works

```
uploadFile(file, params)
  │
  ├── Create XMLHttpRequest
  ├── Bind widget event hooks (onAbort, onLoad, onUploadEnd, onUploadProgress, ...)
  ├── Resolve service URL
  │     → params.service or default "media.upload"
  │     → full URL: bootstrap().svc + service
  │
  ├── Build metadata header
  │     → { filename, mimetype, filesize, socket_id, ...params }
  │     → JSON-stringified into "x-param-xia-data" header
  │     → Content-Type: "application/octet-stream"
  │
  ├── Auth headers injected via makeHeaders()
  │
  └── Send the file body
        → file.file(cb) → FileEntry → cb(f) → xhr.send(f)
        → plain File      → xhr.send(file)
        → on send error   → onUploadError({ error, file, params })
```

---

## Metadata Sent Per Request

File metadata is not sent in the body — it is encoded as a JSON string in the `x-param-xia-data` header:

| Field       | Source                                            |
| ----------- | ------------------------------------------------- |
| `filename`  | `encodeURI(file.name)`                            |
| `mimetype`  | `file.type`                                       |
| `filesize`  | `file.size`                                       |
| `socket_id` | `this.get(socket_id)` or `Visitor.get(socket_id)` |
| `...params` | Any extra fields passed in `params`               |

---

## Widget Event Hooks

`uploadFile` binds widget methods as XHR event handlers — if the method exists on `this`, it is attached automatically:

| Widget method        | XHR event                       | When it fires                        |
| -------------------- | ------------------------------- | ------------------------------------ |
| `onAbort`            | `xhr.upload.onabort`            | Upload was aborted                   |
| `onReadystatechange` | `xhr.upload.onreadystatechange` | Ready state changes on upload        |
| `onUploadError`      | `xhr.upload.onerror`            | Network or upload error              |
| `onLoad`             | `xhr.upload.onload`             | Upload transfer completed            |
| `onUploadEnd`        | `xhr.upload.onloadend`          | Upload ended (success or failure)    |
| `onUploadProgress`   | `xhr.upload.onprogress`         | Progress event — `{ loaded, total }` |

The response itself (`readystatechange` on the main `xhr`) is handled by the internal `onReadyStateChange` function:

| Server status | Behavior                                                |
| ------------- | ------------------------------------------------------- |
| `200`         | Calls `this.onUploadResponse(data)` if defined          |
| `0`           | Silently ignored (aborted or not started)               |
| Other         | Calls `this.onUploadError(this.pendingItem)` if defined |

---

## Service Resolution

By default, files are uploaded to `media.upload`. Pass a custom `service` in `params` to override:

```js
// Default — uploads to media.upload
uploadFile(file, { hub_id, pid });

// Custom service
uploadFile(file, { service: "my_module.upload", hub_id, pid });
```

> `params.service` is removed from the metadata header before sending — it is only used to build the URL.

---

## Return Value

Returns the `XMLHttpRequest` instance. Use it to call `.abort()` if needed:

```js
const xhr = uploadFile(file, params);

// Cancel the upload later
xhr.abort();
```

---

## Quick Reference

| Behavior          | Detail                               |
| ----------------- | ------------------------------------ |
| HTTP method       | `POST`                               |
| File body         | Sent as binary via `xhr.send(file)`  |
| Metadata          | Encoded in `x-param-xia-data` header |
| Auth headers      | Auto-injected via `makeHeaders`      |
| Default service   | `media.upload`                       |
| FileEntry support | ✅ via `file.file(cb)`               |
| Returns           | `XMLHttpRequest` instance            |
