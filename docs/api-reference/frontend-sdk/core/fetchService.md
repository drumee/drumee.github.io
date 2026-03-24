---
id: fetchService
title: fetchService
sidebar_label: fetchService
---

# fetchService(...args)

Sends a **GET request** to the Drumee backend. This is the standard way to read data from the server inside a widget.

---

## When to Use

Use `fetchService` whenever you need to **read or query data** from the server without changing anything.

---

## Signature

```js
await this.fetchService(service, payload);
// or
await this.fetchService({ service, ...payload });
```

| Param     | Type   | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| `service` | String | The service key, e.g. `SERVICE.my_module.get_data` |
| `payload` | Object | Query params to send with the request              |

---

## How It Works Internally

When you call `fetchService`, four things happen in sequence:

```
fetchService(service, payload)
  │
  ├── 1. preparePayload()
  │       → resolve service name (from string arg or payload.service)
  │       → merge with defaultPayload (socket_id, device_id)
  │       → sanitize: strip UI-only fields (widgetId, uiHandler, etc.)
  │
  ├── 2. build query string
  │       → flat values:   key=value&key2=value2  (each value URI-encoded)
  │       → nested object: single encodeURIComponent(JSON.stringify(payload))
  │
  ├── 3. build URL
  │       → url = bootstrap().svc + service + "?" + query
  │       → e.g. "https://api.drumee.com/my_module.get_data?uid=123&"
  │
  └── 4. doRequest(url, data)
          → fetch(url, { method: "GET", ...makeOptions() })
          → pass response to handleResponse()
          → on error: call onServerComplain() or throw
```

---

## Query String Encoding

`fetchService` automatically serializes the payload into a URL query string. The encoding strategy depends on whether the payload contains nested objects:

### Flat payload — key=value pairs

When all values are primitives (string, number, boolean), each is URI-encoded and joined:

```js
// payload: { uid: "abc 123", page: 1 }
// → ?uid=abc%20123&page=1&
```

### Nested payload — JSON-encoded

When any value is an object or array, the entire payload is JSON-stringified then URI-component-encoded as a single query param:

```js
// payload: { uid: "abc", filters: { type: "daily" } }
// → ?%7B%22uid%22%3A%22abc%22%2C%22filters%22%3A...%7D
```

> You don't need to handle this manually — `fetchService` detects the shape of your payload and picks the right encoding automatically.

---

## What Gets Added to Every Request

The same automatic injections as `postService` — you don't need to add these manually:

### Default payload fields

| Field       | Source                   | Description                              |
| ----------- | ------------------------ | ---------------------------------------- |
| `socket_id` | `Visitor.get(socket_id)` | Identifies the current socket connection |
| `device_id` | `Visitor.deviceId()`     | Identifies the current device            |

### Default headers

| Header             | Value                               |
| ------------------ | ----------------------------------- |
| `Accept`           | `*/*`                               |
| `Content-Type`     | `application/json`                  |
| `x-param-keysel`   | Session key selector (if available) |
| `x-param-{keysel}` | Session token (if available)        |

Header keys with underscores or spaces are **automatically normalized to kebab-case**:  
`my_custom_header` → `my-custom-header`

---

## Payload Sanitization

Before the request is sent, `sanitize()` strips any UI-specific fields that should never reach the server:

| Removed field  | Why                            |
| -------------- | ------------------------------ |
| `widgetId`     | Internal widget identifier     |
| `uiHandler`    | Widget event handler reference |
| `partHandler`  | Part handler reference         |
| `errorHandler` | Error handler reference        |

---

## Two Ways to Call `fetchService`

### Option A — service string + payload object (recommended)

```js
await this.fetchService(SERVICE.my_module.get_data, {
  uid,
  page: 1,
});
```

### Option B — single object with `service` inside

```js
await this.fetchService({
  service: SERVICE.my_module.get_data,
  uid,
  page: 1,
});
```

Both produce the same result. Option A is clearer and easier to read.

---

## Example

```js
async getMyData(filter = null) {
  const uid = Visitor.id;
  if (!uid) return; // guard: check required values first

  try {
    const params = {
      service: SERVICE.my_module.get_data,
      uid,
    };
    if (filter) params.filter = filter; // add optional param only when needed

    const data = await this.fetchService(params);
    return data;
  } catch (e) {
    this.warn("[my-widget] getMyData failed", e);
    throw e;
  }
}
```

---

## Tips

**Cache results to avoid redundant requests** — store the result in an instance variable and check before fetching again:

```js
async onDomRefresh() {
  if (!this._data) {
    this._data = await this.getMyData();
  }
  this.feed(require("./skeleton").default(this));
}
```

**Always guard with required values before calling:**

```js
const uid = Visitor.id;
if (!uid) return; // don't call if not ready
```

**Always wrap in `try/catch` and re-throw:**

```js
try {
  const data = await this.fetchService(...);
  return data;
} catch (e) {
  this.warn("[my-widget] failed", e);
  throw e;
}
```

**Add optional params conditionally** — only include extra filters when they have a value:

```js
const params = { service: SERVICE.my_module.get_data, uid };
if (task_type) params.task_type = task_type;
const data = await this.fetchService(params);
```
