---
id: uihandlerServiceonUIEvent
title: uiHandler & Event Flow
sidebar_label: uiHandler & Event Flow
---

# uiHandler, service, and onUiEvent

These three work together as a single event system — from the moment a user clicks an element to the moment the widget responds.

---

## The Three Roles

| Attribute / Method | Where             | Role                                 |
| ------------------ | ----------------- | ------------------------------------ |
| `service`          | Skeleton element  | Names the action to perform          |
| `uiHandler`        | Skeleton element  | Points to the widget that handles it |
| `onUiEvent`        | Widget controller | Receives and processes the action    |

---

## `service`

A string that names the action triggered when the element is interacted with.

```js
Skeletons.Button.Svg({
  service: "my-action", // ← what happened
  uiHandler: [ui],
});
```

- Use `kebab-case` by convention — e.g. `"load-page"`, `"close-overlay"`, `"claim-task"`
- The name is arbitrary — it just needs to match the `case` in `onUiEvent`
- Multiple elements can share the same `service` name

---

## `uiHandler`

An array containing the widget instance(s) that should receive the event. It tells Drumee's event system **where to route the action**.

```js
Skeletons.Box.X({
  service: "my-action",
  my_param: value, // ← extra data passed along
  uiHandler: [ui], // ← route to this widget
});
```

- Always pass as an array: `[ui]`
- `ui` refers to the widget instance received by the skeleton function
- Without `uiHandler`, the event has no destination and will not be handled

---

## `onUiEvent(cmd, args)`

The method on the widget that receives all incoming service events. Acts as a central router — every user interaction with a `service` + `uiHandler` element ends up here.

```js
async onUiEvent(cmd, args = {}) {
  const service = args.service || cmd.get(_a.service);

  switch (service) {
    case "my-action":
      const param = args.my_param || cmd.mget("my_param");
      // handle the action
      break;

    case "close-overlay":
      this.goodbye();
      break;
  }
}
```

- `cmd` — the event command object; use `cmd.get()` or `cmd.mget()` to read data
- `args` — optional direct arguments passed programmatically
- Each `case` handles exactly one service name

---

## How They Connect

```
Skeleton element
  ├── service: "my-action"     → names the action
  ├── my_param: value          → carries extra data
  └── uiHandler: [ui]          → routes to this widget

        ↓

onUiEvent(cmd, args)
  └── service = "my-action"
  └── my_param = cmd.mget("my_param")
  └── handle logic here
```

---

## Key Rules

**`service` without `uiHandler`** — the event is not routed and `onUiEvent` is never called.

**`uiHandler` without `service`** — the element is interactive but fires no named action.

**Extra data** — any additional prop on the skeleton element (like `my_param`, `page`, `value`) is accessible inside `onUiEvent` via `cmd.mget("prop_name")` or `args.prop_name`.

**Multiple handlers** — `uiHandler` accepts multiple widgets: `[ui, parentUi]`. Both will receive the event.
