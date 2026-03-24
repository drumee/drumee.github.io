---
id: serviceAndonUIEvent
title: Service vs UI Events
sidebar_label: Service vs UI Events
---

# Service & onUiEvent

A **service** is a named action. It connects a user interaction in the UI to logic in the widget — and optionally to an API call on the backend.

---

## The Flow

```
Skeleton element (button, box, etc.)
  └── service: "my-action"
  └── uiHandler: [ui]
        └── onUiEvent(cmd, args)
              └── switch (service)
                    ├── UI only   → update state, re-render
                    ├── GET       → fetchService → cache → re-render
                    └── POST      → postService → patch UI
```

---

## 1. Attach a Service in the Skeleton

```js
Skeletons.Button.Svg({
  service: "my-action", // ← service name
  uiHandler: [ui], // ← which widget handles it
});
```

---

## 2. Handle It in `onUiEvent`

```js
async onUiEvent(cmd, args = {}) {
  const service = args.service || cmd.get(_a.service);

  switch (service) {
    case "my-action":
      // your logic here
      break;
  }
}
```

---

## 3. Read Extra Params

Data passed from the skeleton element is readable via `cmd.mget()` or `args`:

```js
const data = args.data || cmd.mget("data");
```

---

## 4. Call the API

```js
// Read (GET)
const data = await this.fetchService({
  service: SERVICE.my_module.get_data,
  hub_id,
  uid,
});

// Write (POST)
const result = await this.postService(SERVICE.my_module.save_data, {
  hub_id,
  uid,
  ...payload,
});
```

---

## Decision Map

```
Need to handle a user action?
  ├── UI only (no server)  → switch case → update state / re-render
  ├── Read data            → fetchService → cache in this._* → re-render
  └── Write / mutate       → postService → optimistic UI → refresh
```

---

## Quick Reference

| Task                     | How                                                      |
| ------------------------ | -------------------------------------------------------- |
| Trigger from skeleton    | `service: "name"` + `uiHandler: [ui]`                    |
| Read service in handler  | `args.service \|\| cmd.get(_a.service)`                  |
| Read param from skeleton | `args.x \|\| cmd.mget("x")`                              |
| Fetch (GET)              | `this.fetchService({ service: SERVICE.x.y, ...params })` |
| Post (POST)              | `this.postService(SERVICE.x.y, { ...params })`           |
| Patch one part           | `this.ensurePart("pn").then(p => p.feed(...))`           |
| Full re-render           | `this.feed(require("./skeleton").default(this))`         |
| Close widget             | `this.goodbye()`                                         |
