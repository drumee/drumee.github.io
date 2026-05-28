---
id: progress
title: Progress
sidebar_label: Progress
---

# Skeletons.Progress

A **progress indicator** for file uploads, downloads, or any long-running operation. Resolves the file name automatically from the loader reference if not explicitly provided.

---

## Signature

```js
Skeletons.Progress(props, style?)
```

---

## Common Props

| Prop        | Type   | Description                                                                            |
| ----------- | ------ | -------------------------------------------------------------------------------------- |
| `loader`    | Widget | The widget driving the progress — used to resolve `name` if not set                    |
| `client`    | Widget | Alias for `loader`                                                                     |
| `listener`  | Widget | Alias for `loader`                                                                     |
| `name`      | String | Display name shown in the progress UI. Falls back to `loader.get(filename)` if omitted |
| `filename`  | String | Alias for `name`                                                                       |
| `className` | String | CSS class(es) to apply                                                                 |
| `sys_pn`    | String | Named part — enables `onPartReady` and `ensurePart`                                    |
| `content`   | String | Additional content. Defaults to `""` if omitted                                        |

> `loader`, `client`, and `listener` are interchangeable — the first one defined is used. The name is resolved from the loader's model if not explicitly provided.

---

## Examples

### Inline progress for a download

```js
Skeletons.Progress({
  loader: ui,
  sys_pn: "my-progress",
});
```

### With explicit filename

```js
Skeletons.Progress({
  loader: ui,
  name: ui.mget("filename"),
  className: `${fig}__progress`,
  sys_pn: "my-progress",
});
```

---
