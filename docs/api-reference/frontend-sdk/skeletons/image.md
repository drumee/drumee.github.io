---
id: image
title: Image
sidebar_label: Image
---

# Skeletons.Image

Image rendering primitives. Two variants exist for different image sources and quality levels.

---

## Variants

| Variant                 | Use for                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `Skeletons.Image.Smart` | Photos, covers, backgrounds — supports low/high resolution loading |
| `Skeletons.Image.Svg`   | SVG icons and vector graphics                                      |

---

## `Skeletons.Image.Smart`

Renders an image with **dual-resolution support** — a low-quality version is shown first while the high-quality version loads. Suitable for photos, album covers, and background images.

### Signature

```js
Skeletons.Image.Smart(props, style?)
```

### Props

| Prop        | Type   | Description                                         |
| ----------- | ------ | --------------------------------------------------- |
| `low`       | String | URL of the low-resolution / placeholder image       |
| `high`      | String | URL of the high-resolution image                    |
| `className` | String | CSS class(es) to apply                              |
| `sys_pn`    | String | Named part — enables `onPartReady` and `ensurePart` |

### Examples

#### Album cover or thumbnail

```js
Skeletons.Image.Smart({
  className: `${fig}__cover`,
  low: item.coverUrl,
  high: item.coverUrl,
});
```

#### Named image for lifecycle hooks

```js
Skeletons.Image.Smart({
  sys_pn: "slider-content",
  low: thumbnailUrl,
  high: fullResUrl,
});
```

#### Background image

```js
Skeletons.Image.Smart({
  className: `${fig}__background`,
  low: "/images/bg-low.jpg",
  high: "/images/bg-high.jpg",
});
```

---

## `Skeletons.Image.Svg`

Renders an **SVG icon or vector graphic** using the same builder as `Skeletons.Button.Svg` — but without interactive behavior.

### Signature

```js
Skeletons.Image.Svg(props, style?)
```

### Props

| Prop        | Type   | Description                                      |
| ----------- | ------ | ------------------------------------------------ |
| `ico`       | String | Icon identifier (mapped to `chartId` internally) |
| `src`       | String | Direct SVG URL                                   |
| `className` | String | CSS class(es) to apply                           |
| `sys_pn`    | String | Named part                                       |

### Example

```js
Skeletons.Image.Svg({
  ico: "my-icon",
  className: `${fig}__icon`,
});
```

---

## Choosing the Right Variant

```
Displaying a photo, cover, or background?  → Image.Smart (with low + high URLs)
Displaying an SVG icon (non-interactive)?  → Image.Svg
Displaying a clickable icon button?        → Button.Svg instead
```

---

## Quick Reference

|                  | `Image.Smart`       | `Image.Svg`    |
| ---------------- | ------------------- | -------------- |
| Source           | `low` + `high` URLs | `ico` or `src` |
| Dual resolution  | ✅                  | ❌             |
| Interactive      | ❌                  | ❌             |
| `sys_pn` support | ✅                  | ✅             |
