---
id: note
title: Note
sidebar_label: Note
---

# Skeletons.Note

A **text or label element**. The most lightweight Skeletons primitive — renders inline text, labels, buttons, status messages, or any content that is primarily textual.

---

## Signature

```js
// Full object form
Skeletons.Note(props, style?)

// Shorthand — string content
Skeletons.Note("My text")

// Shorthand — string content + class name
Skeletons.Note("My text", "my-class")
```

The shorthand forms are automatically expanded to `{ content: "...", className: "..." }`.

---

## Common Props

| Prop          | Type   | Description                                                                 |
| ------------- | ------ | --------------------------------------------------------------------------- |
| `content`     | String | Text to display. Defaults to `""` if omitted                                |
| `className`   | String | CSS class(es) to apply                                                      |
| `sys_pn`      | String | Named part — enables `onPartReady` and `ensurePart`                         |
| `uiHandler`   | Widget | Routes interaction events to `onUiEvent`                                    |
| `service`     | String | Service triggered on click                                                  |
| `styleOpt`    | Object | Inline styles applied to the element                                        |
| `active`      | Number | `0` to render in inactive state                                             |
| `state`       | Number | State (`0` or `1`) — reflects to `data-state` on the element                |
| `radio`       | String | Channel ID — all widgets in the same channel reset to `0` except the active |
| `radiotoggle` | Number | Toggle mode (`1` or `0`) — switches state between `0` and `1` on each click |

---

## Examples

### Plain text label

```js
Skeletons.Note("Hello World");
```

### With class shorthand

```js
Skeletons.Note("Loading...", "my-spinner");
```

### Clickable label / button

```js
Skeletons.Note({
  className: `${fig}__submit-btn`,
  content: LOCALE.SUBMIT,
  service: "my-submit",
  uiHandler: ui,
});
```

### Named status message

```js
Skeletons.Note({
  className: `${fig}__status`,
  sys_pn: "status-message",
  content: message || "",
});
```

### With inline style

```js
Skeletons.Note({
  className: `${fig}__label`,
  content: ui.mget("label"),
  styleOpt: {
    background: ui.mget("color"),
  },
});
```

---
