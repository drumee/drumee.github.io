---
id: append
title: append
sidebar_label: append
---

# append(c, index?)

Adds one or more child components into a widget part at runtime — either at the end or at a specific position.

---

## When to Use

Use `append` when you need to **dynamically insert content** into an existing part without re-rendering the whole skeleton.

Common use cases:

- Adding a toast/notification message to a container
- Inserting a new item into a list
- Injecting a component at a specific position

---

## Signature

```js
append(c, index?)
```

| Param   | Type                      | Required | Description                                      |
| ------- | ------------------------- | -------- | ------------------------------------------------ |
| `c`     | Array / Object / Function | ✅       | The component(s) to insert                       |
| `index` | Number                    | ❌       | Position to insert at. Omit to append at the end |

---

## What You Can Pass as `c`

`append` is flexible — it accepts three input shapes:

### 1. An array of skeletons

Pass multiple components at once:

```js
part.append([
  Skeletons.Note({
    content: "First item",
  }),
  Skeletons.Note({
    content: "Second item",
  }),
]);
```

### 2. A skeleton object with a `kind` property

Pass a single component directly:

```js
part.append(
  Skeletons.Note({
    content: "Note",
  }),
);

// or a custom kind object
part.append({ kind: "countdown_timer", in: 60 });
```

### 3. A render function

Pass a function that receives the widget (`this`) and returns a skeleton:

```js
part.append((ui) => {
  return Skeletons.Note({
    content: `Welcome, ${ui._userName}`,
  });
});
```

> If the function throws, `append` catches the error silently and logs a warning — the widget won't crash.

---

## Behavior

### Append at the end (default)

When `index` is not provided, the component is added after all existing children:

```js
this.ensurePart("my-container").then((p) => {
  p.append(Skeletons.Note("message"));
});
```

### Insert at a specific position

When `index` is provided, the component is spliced into the collection at that position and the child at that index is returned:

```js
this.ensurePart("my-list").then((list) => {
  list.append(Skeletons.Note("Inserted at top"), 0); // insert at position 0
});
```

---

## Return Value

| Scenario          | Returns                                |
| ----------------- | -------------------------------------- |
| Appended at end   | The last child (newly added component) |
| Inserted at index | The child at that index position       |

---

## Internal Logic

```
append(c, index)
  │
  ├── c is an Array?          → use as skeleton list directly
  ├── c has a .kind property? → wrap in array: [c]
  └── c is a Function?        → call c(this) to get skeleton, catch errors
  │
  ├── index provided?
  │     → splice into collection at index
  │     → return children.findByIndex(index)
  │
  └── no index?
        → collection.add(skl)
        → return children.last()
```

---

## Tips

**Removing appended children** — use `goodbye()` on the child reference returned by `append`, or find it via `children.last()`:

```js
const child = part.append(Skeletons.Note("Temporary"));
setTimeout(() => child.goodbye(), 2000);
```

**Avoid appending into empty unknown parts** — always use `ensurePart` to guarantee the target part exists before appending:

```js
// ✅ Safe
this.ensurePart("my-container").then((p) => p.append(...));

// ❌ Risky — part may not exist yet
this.__myContainer.append(...);
```

**Avoid using `append` for full page renders** — use `feed` instead when replacing all content:

```js
// For inserting one item into an existing list → append
part.append(newItem);

// For replacing all content → feed
part.feed(newSkeleton(this));
```
