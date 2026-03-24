---
id: postService
title: postService
sidebar_label: postService
---

# postService(...args)

Sends a **POST request** to the Drumee backend. This is the standard way to write data — create, update, mutate, or trigger server-side actions from a widget.

---

## When to Use

Use `postService` whenever an action **changes state on the server**.

---

## Signature

```js
await this.postService(service, payload);
// or
await this.postService({ service, ...payload });
```

| Param     | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| `service` | String | The service key, e.g. `SERVICE.my_module.save_data` |
| `payload` | Object | Data to send in the request body                    |

---

## How It Works Internally

When you call `postService`, four things happen in sequence:

```
postService(service, payload)
  │
  ├── 1. preparePayload()
  │       → resolve service name (from string arg or payload.service)
  │       → merge with defaultPayload (socket_id, device_id)
  │       → sanitize: strip UI-only fields (widgetId, uiHandler, etc.)
  │
  ├── 2. build URL
  │       → url = bootstrap().svc + service
  │       → e.g. "https://api.drumee.com/reward_hub.claim"
  │
  ├── 3. makeOptions()
  │       → set method: "POST", cache: "no-cache"
  │       → JSON.stringify(payload) as body
  │       → attach headers via makeHeaders()
  │
  └── 4. doRequest(url, data)
          → fetch(url, data)
          → pass response to handleResponse()
          → on error: call onServerComplain() or throw
```

---

## What Gets Added to Every Request

You don't need to manually add these — they are injected automatically:

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

Before the request is sent, `sanitize()` strips out any UI-specific fields that should never reach the server:

| Removed field  | Why                            |
| -------------- | ------------------------------ |
| `widgetId`     | Internal widget identifier     |
| `uiHandler`    | Widget event handler reference |
| `partHandler`  | Part handler reference         |
| `errorHandler` | Error handler reference        |

This means you can safely pass a raw options object from a skeleton event — it will be cleaned automatically.

---

## Two Ways to Call `postService`

### Option A — service string + payload object (recommended)

```js
await this.postService(SERVICE.reward_hub.claim, {
  hub_id,
  uid,
  task_code,
});
```

### Option B — single object with `service` inside

```js
await this.postService({
  service: SERVICE.reward_hub.claim,
  hub_id,
  uid,
  task_code,
});
```

Both produce the same result. Option A is clearer and easier to read.

---

## Example

```js
async saveMyData(payload) {
  const uid = Visitor.id;
  if (!uid) return; // guard: check required values first

  try {
    const data = await this.postService(SERVICE.my_module.save_data, {
      uid,
      ...payload,
    });
    return data;
  } catch (e) {
    this.warn("[my-widget] saveMyData failed", e);
    throw e;
  }
}
```

---

## Tips

**Always guard with required IDs before calling:**

```js
const hub_id = this.getHubId();
if (!hub_id) return; // don't call if not ready
```

**Always wrap in `try/catch` and re-throw:**

```js
try {
  const data = await this.postService(...);
  return data;
} catch (e) {
  this.warn("[my-widget] action failed", e);
  throw e; // let the caller handle it too
}
```

**Show optimistic UI before the call completes** — set a loading state immediately so the user gets instant feedback, then update again when the response arrives.

**Never pass sensitive UI references** in the payload — `uiHandler`, `widgetId`, etc. are stripped by `sanitize()` but it's better not to include them in the first place.
