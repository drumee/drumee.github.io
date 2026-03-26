---
id: messenger
title: Messenger
sidebar_label: Messenger
---

# Skeletons.Messenger

A **rich message input** for chat and messaging interfaces. Combines text entry with send behavior, auto-focus, auto-clear, and optional file upload support.

---

## Signature

```js
Skeletons.Messenger(props, style?)
```

---

## Common Props

| Prop          | Type   | Description                                                                 |
| ------------- | ------ | --------------------------------------------------------------------------- |
| `className`   | String | CSS class(es) to apply                                                      |
| `sys_pn`      | String | Named part — enables `onPartReady` and `ensurePart`                         |
| `uiHandler`   | Widget | Routes interaction events to `onUiEvent`                                    |
| `service`     | String | Service triggered when the message is sent                                  |
| `mode`        | String | `"commit"` to send on Enter key                                             |
| `content`     | String | Pre-fill the input with existing content                                    |
| `autofocus`   | Number | `1` to focus the input automatically on render                              |
| `autoclear`   | Number | `1` to clear the input after sending                                        |
| `no_upload`   | Number | `1` to disable file attachment support                                      |
| `bubble`      | Number | `0` to prevent the event from bubbling up                                   |
| `dataset`     | Object | `data-*` attributes — e.g. `{ mode: "open" }`                               |
| `state`       | Number | State (`0` or `1`) — reflects to `data-state` on the element                |
| `radio`       | String | Channel ID — all widgets in the same channel reset to `0` except the active |
| `radiotoggle` | Number | Toggle mode (`1` or `0`) — switches state between `0` and `1` on each click |

---

## Examples

### Standard chat messenger

```js
Skeletons.Messenger({
  className: `${fig}__messenger`,
  sys_pn: "message",
  mode: "commit",
  service: "send",
  autofocus: 1,
  autoclear: 1,
  bubble: 0,
  content: ui.getStoredMessage(),
  dataset: { mode: "open" },
  uiHandler: ui,
});
```

### Text-only messenger (no file upload)

```js
Skeletons.Messenger({
  className: `${fig}__messenger`,
  sys_pn: "message",
  mode: "commit",
  autofocus: 1,
  autoclear: 1,
  no_upload: 1,
  dataset: { mode: "open" },
  uiHandler: ui,
});
```

---
