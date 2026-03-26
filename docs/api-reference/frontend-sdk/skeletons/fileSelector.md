---
id: fileSelector
title: File Selector
sidebar_label: File Selector
---

# Skeletons.FileSelector

A **file input element** that opens the browser's native file picker. Used to let users select files from their device for upload.

---

## Signature

```js
Skeletons.FileSelector(props, style?)
```

| Param   | Type            | Description                                      |
| ------- | --------------- | ------------------------------------------------ |
| `props` | Object / String | Options, or a plain string shorthand for content |
| `style` | Object / String | Inline styles, or a class name shorthand         |

---

## Common Props

| Prop          | Type   | Description                                                                 |
| ------------- | ------ | --------------------------------------------------------------------------- |
| `accept`      | String | Filter selectable file types — e.g. `"image/*"`, `".pdf"`                   |
| `sys_pn`      | String | Named part — overrides default `"fileselector"`                             |
| `partHandler` | Widget | Routes part lifecycle events to `onPartReady`                               |
| `uiHandler`   | Widget | Routes interaction events to `onUiEvent`                                    |
| `service`     | String | Service name triggered when a file is selected                              |
| `bubble`      | Number | Whether the event bubbles up (`0` to prevent)                               |
| `className`   | String | CSS class(es) to apply                                                      |
| `state`       | Number | State (`0` or `1`) — reflects to `data-state` on the element                |
| `radio`       | String | Channel ID — all widgets in the same channel reset to `0` except the active |
| `radiotoggle` | Number | Toggle mode (`1` or `0`) — switches state between `0` and `1` on each click |

> By default, `sys_pn` is always set to `"fileselector"`. Pass a custom `sys_pn` to differentiate when multiple file selectors exist in the same widget.

---

## Examples

### Basic — notify widget when ready

```js
Skeletons.FileSelector({
  partHandler: ui,
});
```

### Filter by file type

```js
Skeletons.FileSelector({
  accept: "image/*",
});
```

### Full control — custom name, events, bubble

```js
Skeletons.FileSelector({
  sys_pn: "my-selector",
  accept: ".pdf,.docx",
  service: "my-action",
  bubble: 0,
  partHandler: ui,
  uiHandler: ui,
});
```

---

## Handling the Selected File

`FileSelector` triggers `onPartReady` when it is ready. Access the underlying `<input>` element via `child.el` to listen for file selection:

```js
onPartReady(child, pn) {
  switch (pn) {
    case "fileselector":
      child.el.onchange = (e) => {
        const file = e.target.files[0];
        // handle file
      };
      break;
    default:
      super.onPartReady(child, pn);
  }
}
```

---
