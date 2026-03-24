---
id: request
title: request
sidebar_label: request
---

# xhRequest(url, opt?)

A **general-purpose GET request** using `XMLHttpRequest` instead of `fetch`. Used when fine-grained header control or XHR-specific behavior is needed.

---

## When to Use

Use `xhRequest` when:

- You need to send an authenticated GET request outside of the `fetchService` / `postService` pipeline
- The response type is `text` or a raw XHR object rather than JSON
- You need XHR-level control (e.g. progress events, synchronous-style handling)

> For most API calls inside a widget, prefer `fetchService` instead.

---

## Signature

```js
xhRequest(url, opt?)
```

| Param | Type   | Description                                                       |
| ----- | ------ | ----------------------------------------------------------------- |
| `url` | String | A full URL or a short service path (e.g. `"media.get_node_attr"`) |
| `opt` | Object | Optional — `responseType` and any extra headers                   |

---

## URL Resolution

If `url` looks like a service path (`word.something`), it is automatically prefixed with the bootstrap `svc` base URL:

```
"media.get_node_attr"
  → "https://api.drumee.com/media.get_node_attr"

"https://example.com/file.pdf"
  → used as-is
```

---

## Response Types

Control the response format with `opt.responseType`:

| Value              | Returns                                      |
| ------------------ | -------------------------------------------- |
| `"json"` (default) | Parsed object with `__status` field appended |
| `"text"`           | Raw response string                          |
| other / omitted    | The raw `xhr` object                         |

On non-200 responses with `responseType: "json"`, returns `{ response, reason }` instead of rejecting — making error handling predictable.

---

## Authentication

Headers are set automatically via `makeHeaders(opt, xhr)` — the same session tokens and device identifiers used by `fetchService` and `postService` are attached to every `xhRequest` call.

---

## Example

```js
// Fetch plain text content from a URL
xhRequest(fileUrl, { responseType: "text" }).then((content) => {
  this.load(content);
});

// Fetch JSON from a service path
xhRequest("my_module.get_data", { uid }).then((data) => {
  this._data = data;
});
```

---

## Quick Reference

| Behavior         | Detail                            |
| ---------------- | --------------------------------- |
| HTTP method      | `GET` only                        |
| Auth headers     | Auto-injected via `makeHeaders`   |
| Short URL        | Auto-prefixed with `svc` base URL |
| Default response | Parsed JSON with `__status`       |
| On parse failure | Rejects with raw `xhr`            |
| On network error | Rejects via `xhr.onerror`         |
