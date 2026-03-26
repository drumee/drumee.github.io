---
id: textarea
title: Textarea
sidebar_label: Textarea
---

# Skeletons.Textarea

A **multi-line text input**. Extends `Entry` with textarea-specific behavior — row sizing, enter key handling, and escape-to-remove support. Autocomplete is disabled by default.

---

## Signature

```js
Skeletons.Textarea(props, style?)
```

---

## Common Props

Inherits all props from [`Skeletons.Entry`](./entry.md) plus:

| Prop             | Type    | Description                                                                 |
| ---------------- | ------- | --------------------------------------------------------------------------- |
| `rows`           | Number  | Number of visible rows                                                      |
| `ignoreEnter`    | Boolean | `true` to prevent Enter from submitting — allows newlines instead           |
| `removeOnEscape` | Boolean | `true` to remove the element when Escape is pressed                         |
| `volatility`     | Number  | `1` to mark the field as volatile — changes trigger re-evaluation           |
| `value`          | String  | Initial text content                                                        |
| `name`           | String  | Model key this textarea is bound to                                         |
| `require`        | String  | Validation type — e.g. `"any"`                                              |
| `mode`           | String  | `"commit"` to trigger service on submit                                     |
| `bubble`         | Number  | `0` to prevent event bubbling                                               |
| `preselect`      | Number  | `1` to select all text on focus                                             |
| `sys_pn`         | String  | Named part                                                                  |
| `uiHandler`      | Widget  | Routes interaction events to `onUiEvent`                                    |
| `partHandler`    | Widget  | Routes part lifecycle events to `onPartReady`                               |
| `state`          | Number  | State (`0` or `1`) — reflects to `data-state` on the element                |
| `radio`          | String  | Channel ID — all widgets in the same channel reset to `0` except the active |
| `radiotoggle`    | Number  | Toggle mode (`1` or `0`) — switches state between `0` and `1` on each click |

---

## Example

```js
Skeletons.Textarea({
  className: `${fig}__input`,
  sys_pn: "entry",
  name: "my-field",
  value: ui.mget("my-field"),
  require: "any",
  mode: "commit",
  rows: ui.rowsCount(value),
  bubble: 0,
  volatility: 1,
  preselect: 1,
  ignoreEnter: true,
  removeOnEscape: true,
  uiHandler: ui,
  partHandler: ui,
});
```

---

## `Entry` vs `Textarea`

| Feature          | `Entry` | `Textarea` |
| ---------------- | ------- | ---------- |
| Single line      | ✅      | ❌         |
| Multi-line       | ❌      | ✅         |
| `rows` prop      | ❌      | ✅         |
| `ignoreEnter`    | ❌      | ✅         |
| `removeOnEscape` | ❌      | ✅         |
| `volatility`     | ❌      | ✅         |

---
