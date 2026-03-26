---
id: box
title: Box
sidebar_label: Box
---

# Skeletons.Box

A **layout container** that arranges its children according to a flow direction. The four variants differ only in how children are laid out.

---

## Variants

| Variant           | Flow             | Use for                        |
| ----------------- | ---------------- | ------------------------------ |
| `Skeletons.Box.X` | Horizontal (`x`) | Row layouts                    |
| `Skeletons.Box.Y` | Vertical (`y`)   | Column layouts                 |
| `Skeletons.Box.G` | Grid (`g`)       | Grid layouts                   |
| `Skeletons.Box.Z` | None             | Absolute / overlay positioning |

---

## Signature

```js
Skeletons.Box.X(props);
Skeletons.Box.Y(props);
Skeletons.Box.G(props);
Skeletons.Box.Z(props);
```

All four accept the same `props` object.

---

## Common Props

| Prop          | Type   | Description                                            |
| ------------- | ------ | ------------------------------------------------------ |
| `className`   | String | CSS class(es) to apply                                 |
| `kids`        | Array  | Child skeleton nodes                                   |
| `kidsOpt`     | Object | Options merged into every child (e.g. `{ active: 0 }`) |
| `sys_pn`      | String | Named part — enables `onPartReady` and `ensurePart`    |
| `uiHandler`   | Widget | Routes user interaction events to `onUiEvent`          |
| `partHandler` | Widget | Routes part lifecycle events to `onPartReady`          |
| `service`     | String | Service name triggered on interaction                  |
| `dataset`     | Object | `data-*` attributes set on the element                 |
| `debug`       | String | Debug label (usually `__filename`)                     |
| `state`       | Number | State of the element (`0` or `1`)                      |
| `radio`       | String | Radio channel ID for mutual exclusivity                |
| `radiotoggle` | Number | Enable toggle behavior (`1` or `0`)                    |

---

## `kidsOpt`

Merges a set of options into **every child** in the `kids` array. Use it to apply a shared default to all children without repeating it:

```js
Skeletons.Box.G({
  kidsOpt: { active: 0 }, // ← applied to every child
  kids: [
    Skeletons.Button.Svg({ ico: "icon-a" }),
    Skeletons.Button.Svg({ ico: "icon-b" }),
  ],
});
```

---

## `populate`

An alternative to `kids` for dynamically generating repeated items from a data array. Define a template object and a list — each item is merged with the template:

```js
Skeletons.Box.Y({
  populate: [
    { kind: "note", className: "my-item" }, // ← template
    { content: "Item 1" },
    { content: "Item 2" },
    { content: "Item 3" },
  ],
});
```

Add `_prepend: 1` to the template to insert items at the top instead of the bottom.

---

## Examples

### Row layout

```js
Skeletons.Box.X({
  className: `${fig}__toolbar`,
  kids: [
    Skeletons.Button.Svg({ ico: "save", service: "save" }),
    Skeletons.Button.Svg({ ico: "close", service: "close" }),
  ],
});
```

### Column layout with named part

```js
Skeletons.Box.Y({
  className: `${fig}__panel`,
  sys_pn: "content",
  uiHandler: ui,
});
```

### Grid layout with shared child options

```js
Skeletons.Box.G({
  className: `${fig}__grid`,
  partHandler: ui,
  kidsOpt: { active: 0 },
  kids: items.map(renderItem),
});
```

### Overlay / absolute positioning

```js
Skeletons.Box.Z({
  className: `${fig}__overlay`,
  sys_pn: "overlay",
});
```

---

## Prop Aliases

The underlying builder accepts shorthand aliases that are normalized automatically:

| Alias          | Normalized to              |
| -------------- | -------------------------- |
| `ui`           | `uiHandler`                |
| `part`         | `partHandler`              |
| `cn`           | `className` (via `.bem()`) |
| `item`         | `itemsOpt`                 |
| `api` (string) | `{ service: api }`         |

---

## Quick Reference

```
Need a horizontal row?          → Box.X
Need a vertical column?         → Box.Y
Need a grid?                    → Box.G
Need absolute / overlay layout? → Box.Z
Need shared options on kids?    → kidsOpt: { ... }
Need repeated items from data?  → populate: [template, ...items]
Need to name a part?            → sys_pn: "name"
```
