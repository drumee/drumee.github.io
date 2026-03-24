---
id: prepend
title: prepend
sidebar_label: prepend
---

# prepend(c)

Inserts a component at the **beginning** of a widget part — before all existing children.

> Think of it as the opposite of `append`: instead of adding to the end, it adds to the front.

---

## When to Use

Use `prepend` when the new content needs to appear **first** in a list or container.

Common use cases:

- Adding the newest item to the top of a feed or list
- Inserting a priority notice above existing content
- Pushing a notification to the front of a stack

---

## Signature

```js
prepend(c);
```

| Param | Type                      | Required | Description                              |
| ----- | ------------------------- | -------- | ---------------------------------------- |
| `c`   | Object / Array / Function | ✅       | The component to insert at the beginning |

---

## What You Can Pass as `c`

### 1. A skeleton object or array

Pass any skeleton directly — it is inserted as-is at position 0:

```js
part.prepend(Skeletons.Note("I appear first!"));
```

```js
part.prepend([Skeletons.Note("Item A"), Skeletons.Note("Item B")]);
```

### 2. A render function

Pass a function that receives the widget (`this`) and returns a skeleton:

```js
part.prepend((ui) => {
  return Skeletons.Note({
    content: `Latest: ${ui._latestItem.title}`,
  });
});
```

> ⚠️ If the function throws, `prepend` logs a warning and **returns early** — nothing is inserted. This is different from `append`, which continues after a function error.

---

## Behavior

`prepend` always inserts at **position 0**, shifting all existing children down by one:

```
Before:  [B, C, D]
prepend(A)
After:   [A, B, C, D]
```

---

## Return Value

| Scenario                        | Returns                         |
| ------------------------------- | ------------------------------- |
| `c` is an object or array       | The first child after insertion |
| `c` is a function (any outcome) | `undefined` — returns early     |

---

## Example — Latest message at the top

```js
this.ensurePart("message-list").then((list) => {
  list.prepend(
    Skeletons.Note({
      className: "message-list__item",
      content: newMessage.text,
    }),
  );
});
```

---

## Internal Logic

```
prepend(c)
  │
  ├── c is a Function?
  │     → call c(this) to get skeleton
  │     → if throws: warn and return early (nothing inserted)
  │     → ⚠️ always returns undefined for function input
  │
  └── c is an object or array?
        → use c directly as skeleton
        → collection.unshift(skl)   ← insert at position 0
        → return children.first()
```

---

## `prepend` vs `append` at a Glance

|                          | `prepend(c)`                | `append(c, index?)`                 |
| ------------------------ | --------------------------- | ----------------------------------- |
| Default insert position  | Beginning (index 0)         | End                                 |
| Supports insert at index | ❌                          | ✅                                  |
| Accepts function         | ✅ (returns early on error) | ✅ (continues on error)             |
| Returns                  | `children.first()`          | `children.last()` or child at index |

---

## Tips

**Always use `ensurePart`** to make sure the target part exists before calling `prepend`:

```js
// ✅ Safe
this.ensurePart("my-list").then((p) => p.prepend(newItem));
```

**Avoid passing a function if you need the return value** — function input always returns `undefined`, so you won't get a child reference back:

```js
// ✅ Get child reference — pass skeleton directly
const child = part.prepend(Skeletons.Note("Hello"));
child.goodbye(); // works

// ❌ No reference returned for function input
const child = part.prepend((ui) => Skeletons.Note("Hello"));
// child is undefined
```

**Use `feed` instead when replacing all content** — `prepend` only adds, it never clears:

```js
// Add one item to the front → prepend
part.prepend(newItem);

// Replace everything → feed
part.feed(newSkeleton(this));
```
