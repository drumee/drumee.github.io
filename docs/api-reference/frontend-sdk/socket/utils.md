---
id: utils
title: utils
sidebar_label: utils
---

# Utils

These are **module-level helper functions** that power every `fetchService` and `postService` call. They handle authentication headers, payload preparation, response parsing, and session management — automatically, without any manual setup required.

---

## Overview

```
fetchService / postService
  │
  ├── preparePayload()    → resolve service name, merge defaults, sanitize
  ├── makeOptions()       → build fetch init object with headers
  │     └── makeHeaders() → build auth + device headers
  │
  └── doRequest(url, data)
        └── fetch(url, data)
              └── handleResponse() → parse JSON, dispatch, return data
```

---

## `makeHeaders(params?, xhr?)`

Builds the **authentication and device headers** for every request. Merges default visitor headers with session keys.

### What it includes

| Header                  | Source                                       |
| ----------------------- | -------------------------------------------- |
| `Accept`                | `*/*` (always)                               |
| `Content-Type`          | `application/json` (always)                  |
| `x-param-lang`          | `Visitor.language()`                         |
| `x-param-page-language` | `Visitor.pagelang()`                         |
| `x-param-device`        | `Visitor.device()`                           |
| `x-param-device-id`     | `Visitor.deviceId()`                         |
| `x-param-keysel`        | Session key selector (if no stored session)  |
| `x-param-{keysel}`      | Session token (from `Sessions` map or `sid`) |

### Auto-normalization

Header keys with underscores or spaces are automatically converted to kebab-case before being sent:

```
my_custom_header → my-custom-header
```

### XHR support

Pass an `xhr` object as the second argument to set headers directly on an `XMLHttpRequest` instead of returning them as an object.

---

## `makeOptions(params?)`

Builds the **full fetch options object** — wraps `makeHeaders` and attaches socket and device identifiers.

### What it returns

```js
{
  mode: "cors",
  cache: "default",
  guard: "request",
  headers: { ...makeHeaders() },
  socket_id: Visitor.get(socket_id),
  device_id: Visitor.deviceId(),
  ...params   // method, body, cache override, etc.
}
```

Any `headers` inside `params` are extracted and merged before being passed to `makeHeaders` — they are not passed as a nested object.

---

## `preparePayload(...args)`

Resolves the **service name** and **request payload** from flexible input, then merges defaults and strips UI-only fields.

### Two calling styles

```js
// Style A — service string first (recommended)
preparePayload("my_module.get_data", { uid, hub_id });

// Style B — service key inside the object
preparePayload({ service: "my_module.get_data", uid, hub_id });
```

Both produce the same `{ service, payload }` output.

### What it does

```
preparePayload(...args)
  │
  ├── resolve service name
  │     → from string arg[0], or from payload.service
  │
  ├── merge defaultPayload
  │     → { socket_id, device_id } added automatically
  │
  └── sanitize(payload)
        → strip widgetId, uiHandler, partHandler, errorHandler
```

---

## `doRequest(url, data)`

Executes the actual **fetch call** and delegates response handling. Bound to the widget instance via `.bind(this)` before being called.

```js
const r = doRequest.bind(this);
return r(url, data);
```

### On success

Passes the response to `handleResponse`, which parses JSON and returns `payload.data`.

### On error

Calls `this.onServerComplain(err)` if defined on the widget — otherwise logs a warning and throws the error.

---

## `handleResponse(view, response)`

Parses the server response JSON and **routes the result** back to the widget.

### Behavior by status

| HTTP status         | Behavior                                                                         |
| ------------------- | -------------------------------------------------------------------------------- |
| `200` + no error    | Call `view.__dispatchRest(__ack__, data)` if defined, then return `payload.data` |
| `200` + error field | Call `view.onServerComplain(payload)` if defined, otherwise throw                |
| Other               | Log warning and throw the response                                               |

### Connection state

After every response, `handleResponse` calls `updateConnectionState(payload)` — which syncs `Visitor.connection` with the `__status__` field from the server. This keeps the global connection state up to date transparently.

### `__dispatchRest`

If the widget defines `__dispatchRest(ack, data)`, it is called automatically after every successful response. Use it to react to specific service acknowledgements without handling them in `onUiEvent`:

```js
__dispatchRest(service, data) {
  switch (service) {
    case SERVICE.my_module.save_data:
      // react to server ack
      break;
  }
}
```

---

## `sanitize(opt)`

Strips **UI-specific fields** from a payload object before it is sent to the server.

| Removed field  | Why                            |
| -------------- | ------------------------------ |
| `widgetId`     | Internal widget identifier     |
| `uiHandler`    | Widget event handler reference |
| `partHandler`  | Part handler reference         |
| `errorHandler` | Error handler reference        |

Called automatically by `preparePayload` — you never need to call it manually. It makes it safe to pass raw skeleton event objects as payloads without leaking internal references to the server.

---

## `setAuthorization(key, value)`

Stores or removes a **session token** in the internal `Sessions` map. Used when browser cookies are unavailable (e.g. cross-origin or embedded contexts).

```js
// Store a session token
setAuthorization("my-keysel", "token-value");

// Remove a session token
setAuthorization("my-keysel", null);
```

- Sessions are **write-only from outside** — they cannot be read back, only set or deleted
- Once stored, `makeHeaders` picks them up automatically for all subsequent requests
- The `Sessions` map is a module-level `Map` — it persists for the lifetime of the page

---

## Quick Reference

| Function                         | Called by                     | Purpose                         |
| -------------------------------- | ----------------------------- | ------------------------------- |
| `makeHeaders(params?, xhr?)`     | `makeOptions`                 | Build auth + device headers     |
| `makeOptions(params?)`           | `postService`, `fetchService` | Build full fetch init object    |
| `preparePayload(...args)`        | `postService`, `fetchService` | Resolve service + payload       |
| `doRequest(url, data)`           | `postService`, `fetchService` | Execute fetch + handle errors   |
| `handleResponse(view, response)` | `doRequest`                   | Parse JSON + dispatch to widget |
| `sanitize(opt)`                  | `preparePayload`              | Strip UI fields from payload    |
| `setAuthorization(key, value)`   | App bootstrap / auth flow     | Store session tokens            |
