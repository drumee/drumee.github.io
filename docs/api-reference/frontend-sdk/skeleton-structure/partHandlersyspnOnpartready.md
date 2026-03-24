---
id: partHandlersyspnOnpartready
title: Part Lifecycle Handling
sidebar_label: Part Lifecycle Handling
---

# partHandler, sys_pn, and onPartReady

These three work together as a **part lifecycle system** — they let the widget know when a named section of the UI is ready, and give it a direct reference to act on.

---

## The Three Roles

| Attribute / Method | Where              | Role                                             |
| ------------------ | ------------------ | ------------------------------------------------ |
| `sys_pn`           | Skeleton element   | Gives a part a name                              |
| `partHandler`      | Skeleton container | Points to the widget that receives `onPartReady` |
| `onPartReady`      | Widget controller  | Called when a named part becomes available       |

---

## `sys_pn`

A string that assigns a **name** to a skeleton element. Once rendered, the widget can reference it by this name — via `onPartReady` or `ensurePart`.

```js
Skeletons.Box.Y({
  sys_pn: "content",
});
```

- Think of it as an `id` for a rendered part
- Names must be unique within the widget
- Dynamic names are valid — useful when rendering lists:

```js
Skeletons.Box.X({
  sys_pn: `item-action:${item.id}`, // ← unique per item
});
```

---

## `partHandler`

Tells Drumee **which widget to notify** when a named part inside this container becomes ready. Can be passed as a plain reference or an array:

```js
// As a plain reference
Skeletons.Box.Y({
  partHandler: ui,
  kids: [...]
});

// As an array
Skeletons.Box.G({
  partHandler: [ui],
  kids: items.map(renderItem),
});
```

- Place it on the **container**, not on individual items
- Without `partHandler`, `onPartReady` is never called for children of this container

> **`partHandler` vs `uiHandler`** — `uiHandler` routes user interaction events to `onUiEvent`. `partHandler` routes part lifecycle events to `onPartReady`. Both can coexist on the same element.

---

## `onPartReady(child, pn)`

Called automatically on the widget when a named part (`sys_pn`) becomes available. Receives a direct reference to the rendered element.

```js
onPartReady(child, pn) {
  switch (pn) {
    case "my-section":
      // act on child here
      break;
    default:
      super.onPartReady(child, pn); // ← always delegate unknown parts up
  }
}
```

| Param   | Type          | Description                                        |
| ------- | ------------- | -------------------------------------------------- |
| `child` | Part instance | The rendered element — use `feed`, `set`, or `.el` |
| `pn`    | String        | The `sys_pn` value that just became ready          |

> **Always call `super.onPartReady(child, pn)` in the `default` case.** This delegates unhandled parts to the parent class, which may have its own logic for them.

---

## Common Patterns

### Feed a sub-skeleton into a named area

```js
case "content":
  child.feed(require("./skeleton/my-page").default(this));
  break;
```

### Feed a sub-skeleton then load data

```js
case "content":
  child.feed(this.skeletons[this._page](this));
  if (!this._data) {
    this.loadData(child);
  }
  break;
```

### Initialize a third-party component that needs a real DOM element

```js
case "content":
  Kind.waitFor("my-kind").then(() => {
    child.feed({ kind: "my-kind", media: this.media });
    this._component = child.children.last();
  });
  break;
```

### Access `child.el` to set DOM properties directly

```js
case "audio":
  child.el.volume = 0.5;
  child.el.onplay = this._onPlay;
  child.el.onended = this._onTrackEnd;
  break;
```

### React to child events

```js
case "slider-content":
  if (child._loaded) {
    this.display(child);
  }
  child.on("loaded", (item) => {
    this.display(item);
  });
  break;
```

### Lazy-load an asset once the target element exists

```js
case "my-banner":
  import("./assets/banner.svg").then((m) => {
    child.el.style.backgroundImage = `url(${m.default})`;
  });
  break;
```

---

## How They Connect

```
Skeleton container
  └── partHandler: ui (or [ui])     → notify this widget

        └── child element
              └── sys_pn: "my-part" → this part has a name

                    ↓ part is rendered

onPartReady(child, pn)
  └── pn    = "my-part"
  └── child = the rendered element
  └── act on it here
  └── default → super.onPartReady(child, pn)
```

---

## `sys_pn` + `ensurePart`

`sys_pn` also enables targeted patching via `ensurePart` — independent of `onPartReady`. Use this to update a part after data changes without re-rendering the whole widget:

```js
// Re-feed a named part
this.ensurePart("my-section").then((part) => {
  part.feed(newSkeleton(this));
});

// Update text only
this.ensurePart("my-label").then((part) => {
  part.set({ content: "Updated" });
});
```

> `onPartReady` fires **once** when the part is first rendered. `ensurePart` can be called **at any time** to access a part that already exists.

---

## Key Rules

**`sys_pn` without `partHandler`** — `onPartReady` is never called. The part can still be reached via `ensurePart`.

**`partHandler` without `sys_pn` on children** — `onPartReady` is never triggered because no children are named.

**Always delegate in `default`** — call `super.onPartReady(child, pn)` for unhandled parts so parent class logic is not silently skipped.

**Dynamic `sys_pn`** — use a unique key per item (`item-action:${id}`) so each part can be patched independently without re-rendering the whole list.

---

## Quick Reference

| Attribute / Method       | Set on               | Notes                                                    |
| ------------------------ | -------------------- | -------------------------------------------------------- |
| `sys_pn: "name"`         | Any skeleton element | Unique name within the widget; dynamic names allowed     |
| `partHandler: ui`        | Container element    | Plain ref or array; triggers `onPartReady` on the widget |
| `onPartReady(child, pn)` | Widget controller    | Always call `super.onPartReady` in `default` case        |
