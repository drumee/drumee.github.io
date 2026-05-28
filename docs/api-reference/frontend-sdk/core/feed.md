---
id: feed
title: feed
sidebar_label: feed
---

# feed(c)

**Replaces all children** of a widget part with new content. This is the primary way to render or re-render a skeleton into a part.

> Think of it as a full swap — it clears whatever was there and puts in the new content.

---

## When to Use

Use `feed` when the content of a part needs to be **completely replaced**.

Common use cases:

- Initial render of a widget or page skeleton
- Switching between pages/tabs
- Opening or closing an overlay
- Re-rendering after data loads

---

## Signature

```js
feed(c);
```

| Param | Type                               | Required | Description                                                                |
| ----- | ---------------------------------- | -------- | -------------------------------------------------------------------------- |
| `c`   | Array / Object / Function / `null` | ✅       | The new content to render. Pass `null` or nothing to keep current children |

---

## What You Can Pass as `c`

### 1. An array of skeletons

Replaces all children with the given list. Invalid children are filtered out automatically:

```js
part.feed([Skeletons.Note("First"), Skeletons.Note("Second")]);
```

### 2. A skeleton object with a `kind` property

Wraps the single component in an array and sets it as the only child:

```js
part.feed(Skeletons.Note("Hello!"));

// or a custom kind
part.feed({ kind: "countdown_timer", in: 60 });
```

### 3. A render function

The most common pattern — pass a function that receives the widget (`this`) and returns a skeleton or array:

```js
part.feed((ui) => {
  return Skeletons.Box.Y({
    className: `${ui.fig.family}__content`,
    kids: [Skeletons.Note(ui._title)],
  });
});
```

> If the function throws, `feed` catches the error and logs a warning — the part is left unchanged.

### 4. `null` / no argument

Nothing is rendered. Returns the current last child as-is:

```js
part.feed(null); // no-op, returns current last child
```

---

## Behavior

`feed` always **replaces** — it does not add to existing children:

```
Before:  [A, B, C]
feed([X, Y])
After:   [X, Y]
```

Invalid children (falsy values, undefined) are silently filtered before being set, so you can safely include conditional items in arrays:

```js
part.feed([
  Skeletons.Note("Always shown"),
  isMobile ? Skeletons.Note("Mobile only") : null, // null is filtered out
  Skeletons.Note("Also shown"),
]);
```

---

## Return Value

Always returns `children.last()` — the last child after the new content is set.

---

## Real-world Examples

### Initial render in `onDomRefresh`

The most common use of `feed` — render the root skeleton when the widget mounts:

```js
async onDomRefresh() {
  await this.loadEnv();
  this.feed(require("./skeleton").default(this)); // full widget render
}
```

### Switch pages on tab click

```js
case "load-page":
  const newPage = cmd.mget(_a.page);
  this._page = newPage;
  this.__content.feed(this.skeletons`this._page`);
  break;
```

### Open an overlay

```js
case "open-points-history":
  Promise.all([this.getBalance(), this.getHistory()]).then(() => {
    this.feed(require("../popup/skeleton/points-overlay").default(this));
  });
  break;
```

### Close and return to main view

```js
case "close-overlay":
  this.feed(require("./skeleton").default(this));
  break;
```

---

## Internal Logic

```
feed(c)
  │
  ├── c is falsy (null / undefined)?
  │     → return children.last() immediately, no change
  │
  ├── c is an Array?
  │     → filter out invalid children
  │     → collection.set(filtered)
  │
  ├── c has a .kind property?
  │     → wrap in array: [c]
  │     → collection.set([c])
  │
  └── c is a Function?
        → call c(this) → get kids array
        → filter out invalid children
        → collection.set(filtered)
        → if throws: warn, leave part unchanged
  │
  └── return children.last()
```

---

## Tips

**Use `feed` on the widget itself for full re-renders:**

```js
// Re-render the entire widget
this.feed(require("./skeleton").default(this));

// Re-render only the content area
this.__content.feed(this.skeletons`this._page`);
```

**Prefer `ensurePart` + targeted patch over `feed` for small updates** — calling `feed` on a large part destroys and rebuilds all its children, which is heavier than patching one element:

```js
// ✅ Small update — patch only the button
this.ensurePart("task-action:CM1").then((p) => p.feed(newButtonSkeleton));

// ❌ Heavy — rebuilds the entire content area just to update one button
this.__content.feed(this.skeletons`this._page`);
```

**Use `null` guards when conditionally rendering** — `feed(null)` is a safe no-op, so you can call `feed` before data is ready without crashing:

```js
this.feed(this._data ? require("./skeleton").default(this) : null);
```
