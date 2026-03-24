---
id: entryBox
title: Entry Box
sidebar_label: Entry Box
---

# Skeletons.EntryBox

An **enhanced input field** that extends `Entry` with built-in validation display, prefix icons, password toggle, and custom validators. Use it when the input needs visual feedback or richer validation than a plain `Entry`.

---

## Signature

```js
Skeletons.EntryBox(props, style?)
```

---

## Common Props

Inherits all props from [`Skeletons.Entry`](./skeletons-entry) plus:

| Prop           | Type    | Description                                                    |
| -------------- | ------- | -------------------------------------------------------------- |
| `validators`   | Array   | Custom validation functions to run on input                    |
| `showError`    | Boolean | Whether to show inline error messages — defaults to `true`     |
| `prefix`       | Any     | Icon or element rendered before the input (e.g. an email icon) |
| `shower`       | Number  | `1` to add a show/hide toggle for password fields              |
| `className`    | String  | CSS class(es) to apply                                         |
| `placeholder`  | String  | Placeholder text                                               |
| `value`        | String  | Initial value                                                  |
| `sys_pn`       | String  | Named part                                                     |
| `formItem`     | String  | Model key this input is bound to                               |
| `require`      | String  | Validation type — e.g. `"email"`                               |
| `mode`         | String  | `"commit"` to trigger service on Enter                         |
| `service`      | String  | Service triggered on submit                                    |
| `uiHandler`    | Widget  | Routes interaction events to `onUiEvent`                       |
| `errorHandler` | Widget  | Routes validation error events                                 |
| `interactive`  | Number  | `1` to enable interactive mode                                 |
| `preselect`    | Number  | `1` to select all text on focus                                |

---

## Examples

### Email input with icon, validators, and error display

```js
Skeletons.EntryBox({
  className: `${fig}__entry email`,
  sys_pn: "ref-email",
  formItem: "email",
  placeholder: LOCALE.EMAIL,
  require: "email",
  mode: "commit",
  service: "my-submit",
  interactive: 1,
  preselect: 1,
  uiHandler: ui,
  errorHandler: ui,
  validators: myEmailValidators,
  showError: false,
  prefix: emailIcon,
});
```

### Password input with show/hide toggle

```js
Skeletons.EntryBox({
  className: `${fig}__password`,
  sys_pn: "ref-password",
  placeholder: LOCALE.PASSWORD,
  mode: "commit",
  service: "my-submit",
  shower: 1,
  uiHandler: ui,
});
```

---

## `Entry` vs `EntryBox`

| Feature                | `Entry` | `EntryBox` |
| ---------------------- | ------- | ---------- |
| Basic input            | ✅      | ✅         |
| Validation (`require`) | ✅      | ✅         |
| Custom validators      | ❌      | ✅         |
| Inline error display   | ❌      | ✅         |
| Prefix icon            | ❌      | ✅         |
| Password show/hide     | ❌      | ✅         |

> Use `Entry` for simple inputs. Use `EntryBox` when you need validation feedback, a prefix icon, or a password toggle.

---
