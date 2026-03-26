---
id: wrapper
title: Wrapper
sidebar_label: Wrapper
---

# Skeletons.Wrapper

A **dialog or overlay container** — a layout box that automatically adds the `dialog__wrapper` class and generates a default `sys_pn` from its `name`. Use it for overlays, dialogs, contextual panels, and any container that needs built-in naming.

---

## Variants

| Variant               | Flow             | Use for                              |
| --------------------- | ---------------- | ------------------------------------ |
| `Skeletons.Wrapper.X` | Horizontal (`x`) | Horizontal wrappers, attachment rows |
| `Skeletons.Wrapper.Y` | Vertical (`y`)   | Overlays, dialogs, vertical panels   |

---

## Signature

```js
Skeletons.Wrapper.X(props, style?)
Skeletons.Wrapper.Y(props, style?)
```

---

## Automatic Behavior

Three things happen automatically that distinguish `Wrapper` from `Box`:

- `dialog__wrapper` is always appended to `className`
- `sys_pn` defaults to `wrapper-{name}` if not explicitly set — where `name` defaults to `"dialog"`
- `kids` if empty or cleared, the widget become automatically hidden ([data-state="closed"])

```js
// No sys_pn or name provided
Skeletons.Wrapper.Y({ className: "my-overlay" });
// → sys_pn = "wrapper-dialog"

// With a custom name
Skeletons.Wrapper.Y({ className: "my-overlay", name: "overlay" });
// → sys_pn = "wrapper-overlay"

// With an explicit sys_pn — overrides auto-generation
Skeletons.Wrapper.Y({ className: "my-overlay", sys_pn: "avatar" });
// → sys_pn = "avatar"
```

---

## Common Props

| Prop          | Type   | Description                                                                 |
| ------------- | ------ | --------------------------------------------------------------------------- |
| `className`   | String | CSS class(es) — `dialog__wrapper` is always added                           |
| `name`        | String | Used to generate default `sys_pn`. Defaults to `"dialog"`                   |
| `sys_pn`      | String | Explicit named part — overrides `wrapper-{name}`                            |
| `kids`        | Array  | Child skeleton nodes                                                        |
| `uiHandler`   | Widget | Routes interaction events to `onUiEvent`                                    |
| `partHandler` | Widget | Routes part lifecycle events to `onPartReady`                               |
| `attrOpt`     | Object | HTML attributes set on the element                                          |
| `state`       | Number | State (`0` or `1`) — reflects to `data-state` on the element                |
| `radio`       | String | Channel ID — all widgets in the same channel reset to `0` except the active |
| `radiotoggle` | Number | Toggle mode (`1` or `0`) — switches state between `0` and `1` on each click |

---

## Examples

### Simple named overlay

```js
Skeletons.Wrapper.Y({
  className: `${fig}__overlay`,
  name: "overlay",
});
// → sys_pn = "wrapper-overlay"
```

### Contextual dialog panel

```js
Skeletons.Wrapper.Y({
  className: `${fig}__context`,
  name: "context",
  uiHandler: ui,
  partHandler: ui,
});
```

### Container with children and explicit sys_pn

```js
Skeletons.Wrapper.Y({
  className: `${fig}__avatar`,
  sys_pn: "avatar",
  kids: [avatar],
  attrOpt: { id: "my-avatar" },
});
```

### Horizontal attachment wrapper

```js
Skeletons.Wrapper.X({
  className: `${fig}__attachment`,
  kids: [
    Skeletons.Box.Y({
      className: `${fig}__media`,
      sys_pn: "attachment-content",
      partHandler: ui,
    }),
  ],
});
```

### Notification overlay (no children)

```js
Skeletons.Wrapper.X({
  className: "my-notifier",
  name: "my-notifier",
});
```

---

## `Wrapper` vs `Box`

|                         | `Skeletons.Box` | `Skeletons.Wrapper`  |
| ----------------------- | --------------- | -------------------- |
| Auto-adds CSS class     | ❌              | ✅ `dialog__wrapper` |
| Auto-generates `sys_pn` | ❌              | ✅ from `name`       |
| `name` prop             | ❌              | ✅                   |
| Layout flow             | X / Y / G / Z   | X / Y                |

> Use `Box` for general layout. Use `Wrapper` when the container is a named dialog, overlay, or panel that needs to be referenced by the widget via `sys_pn`.

---
