---
id: element
title: Element
sidebar_label: Element
---

# Skeletons.Element

A **generic DOM element** skeleton — renders any HTML element by tag name. Use it when none of the other Skeletons primitives (Box, Button, Note) match the element you need.

---

## Signature

```js
Skeletons.Element(props, style?)
```

| Param   | Type            | Description                                              |
| ------- | --------------- | -------------------------------------------------------- |
| `props` | Object / String | Element options, or a plain string shorthand for content |
| `style` | Object / String | Inline styles, or a class name shorthand                 |

---

## Common Props

| Prop          | Type   | Description                                                                 |
| ------------- | ------ | --------------------------------------------------------------------------- |
| `tagName`     | String | HTML tag to render — defaults to a wrapper element if omitted               |
| `className`   | String | CSS class(es) to apply                                                      |
| `content`     | String | Inner text or HTML content                                                  |
| `flow`        | String | Layout direction (`x`, `y`, `none`, etc.)                                   |
| `sys_pn`      | String | Named part — enables `onPartReady` and `ensurePart`                         |
| `uiHandler`   | Widget | Routes interaction events to `onUiEvent`                                    |
| `service`     | String | Service name triggered on interaction                                       |
| `attrOpt`     | Object | HTML attributes set on the element (e.g. `src`, `autoplay`)                 |
| `attribute`   | Object | Same as `attrOpt` — alternative key                                         |
| `dataset`     | Object | `data-*` attributes                                                         |
| `type`        | String | Value for the `type` attribute (e.g. on `<source>`)                         |
| `preload`     | String | Value for the `preload` attribute                                           |
| `name`        | String | Value for the `name` attribute                                              |
| `style`       | Object | Inline styles passed as second argument                                     |
| `state`       | Number | State (`0` or `1`) — reflects to `data-state` on the element                |
| `radio`       | String | Channel ID — all widgets in the same channel reset to `0` except the active |
| `radiotoggle` | Number | Toggle mode (`1` or `0`) — switches state between `0` and `1` on each click |

---

## Examples

### A plain image element

```js
Skeletons.Element({
  tagName: "img",
  attribute: { src: myImageUrl },
  style: { display: "none" },
});
```

### A named content area with flow

```js
Skeletons.Element({
  flow: "x",
  className: `${fig}__recent-items`,
  sys_pn: "recent-items",
  content: myContent,
});
```

### An interactive item with service

```js
Skeletons.Element({
  className: `${fig}__item`,
  content: myContent,
  service: "my-action",
  uiHandler: ui,
});
```

### A `<source>` element for audio/video

```js
Skeletons.Element({
  tagName: "source",
  className: `${fig}__audio-source`,
  sys_pn: "audio-src",
  type: ui.mget("mimetype"),
  preload: "auto",
  attrOpt: { src: ui._url() },
});
```

### A `<video>` element with dataset

```js
Skeletons.Element({
  tagName: "video",
  className: `${fig}__video`,
  sys_pn: "video",
  attrOpt: { autoplay: "" },
  dataset: {
    status: "idle",
    size: ui.mget("size"),
  },
});
```

---

## When to Use

```
Need a <img>, <video>, <audio>, <source>? → Skeletons.Element with tagName
Need a plain content container?           → Skeletons.Element (no tagName)
Need a layout container with kids?        → Skeletons.Box instead
Need a clickable icon button?             → Skeletons.Button instead
Need inline text?                         → Skeletons.Note instead
```

---
