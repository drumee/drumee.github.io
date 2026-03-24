---
id: avatar
title: Avatar
sidebar_label: Avatar
---

# Skeletons.Avatar

Renders a **user avatar** — either as a profile image or as a color-generated placeholder when no image is available.

---

## Signature

```js
Skeletons.Avatar(ava, cn, name);
```

| Param  | Type   | Description                                                                 |
| ------ | ------ | --------------------------------------------------------------------------- |
| `ava`  | String | Avatar URL, or `"default"` to generate a color avatar                       |
| `cn`   | String | CSS class name to apply                                                     |
| `name` | String | User's name — used to generate a consistent color when `ava` is `"default"` |

---

## How It Works

```
Skeletons.Avatar(ava, cn, name)
  │
  ├── ava contains "default"
  │     → generate a color from name (HSL hash)
  │     → return color avatar (background-color)
  │
  └── ava is a real URL
        → return image avatar (background-image)
```

Both outputs are a `kind: "note"` skeleton node with a `styleOpt` applied.

---

## Two Rendering Modes

### Image avatar

When `ava` is a valid image URL, the avatar renders as a background image:

```js
Skeletons.Avatar(
  "https://files.drumee.com/avatar/user.jpg",
  "my-widget__avatar",
  "Alice",
);
// → { kind: "note", className: "my-widget__avatar", styleOpt: { backgroundImage: "url(...)" } }
```

### Color avatar

When `ava` is `"default"` (or contains the word `"default"`), a color is generated from the user's name using an HSL hash — ensuring the same name always produces the same color:

```js
Skeletons.Avatar("default", "my-widget__avatar", "Alice");
// → { kind: "note", className: "my-widget__avatar", styleOpt: { backgroundColor: "hsl(214, 40%, 60%)" } }
```

- Saturation defaults to `40%`
- Lightness defaults to `60%`
- Hue is derived from the name string — consistent across renders

---

## Example

```js
// In a skeleton function
Skeletons.Avatar(
  ui.mget(_a.avatar) || "default",
  `${fig}__avatar`,
  ui.mget(_a.name),
);
```

This pattern is the standard way to use `Skeletons.Avatar` — pass the avatar URL from the model, fall back to `"default"` if none exists, and always provide the name for color generation.

---

## Quick Reference

| `ava` value                         | Output                               |
| ----------------------------------- | ------------------------------------ |
| A real image URL                    | `background-image: url(...)`         |
| `"default"` or contains `"default"` | `background-color: hsl(h, 40%, 60%)` |
