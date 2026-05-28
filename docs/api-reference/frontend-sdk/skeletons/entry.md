---
id: entry
title: Entry
sidebar_label: Entry
---

# Skeletons.Entry

A **text input field**. The standard way to render a form input in Drumee. Autocomplete is disabled by default.

---

## Signature

```js
Skeletons.Entry(props, style?)
```

---

## Common Props

| Prop           | Type   | Description                                                    |
| -------------- | ------ | -------------------------------------------------------------- |
| `className`    | String | CSS class(es) to apply                                         |
| `placeholder`  | String | Placeholder text shown when empty                              |
| `value`        | String | Initial value                                                  |
| `name`         | String | Input `name` attribute                                         |
| `sys_pn`       | String | Named part — enables `onPartReady` and `ensurePart`            |
| `uiHandler`    | Widget | Routes interaction events to `onUiEvent`                       |
| `errorHandler` | Widget | Routes validation error events                                 |
| `service`      | String | Service triggered on submit / commit                           |
| `mode`         | String | Interaction mode — e.g. `"commit"` to trigger service on Enter |
| `require`      | String | Validation type — e.g. `"email"`, `"text"`                     |
| `formItem`     | String | Model key this input is bound to in a form                     |
| `innerClass`   | String | CSS class applied to the inner input element                   |
| `interactive`  | Number | `1` to enable interactive mode                                 |
| `preselect`    | Number | `1` to select all text on focus                                |
| `autocomplete` | String | Autocomplete behavior — defaults to `"off"`                    |

---

## Examples

### Basic input with validation

```js
Skeletons.Entry({
  className: `${fig}__entry`,
  placeholder: LOCALE.MY_PLACEHOLDER,
  require: "email",
  mode: "commit",
  service: "my-submit",
  sys_pn: "my-input",
  uiHandler: ui,
});
```

### Form-bound input with initial value

```js
Skeletons.Entry({
  className: `${fig}__entry`,
  name: "my-field",
  formItem: "my-field",
  placeholder: LOCALE.MY_FIELD,
  value: ui.mget("my-field") || "",
  preselect: 1,
  errorHandler: ui,
});
```

---

## Reading the Input Value

Access the current value inside `onUiEvent` via `cmd.mget` or by reading the model form data:

```js
case "my-submit":
  const data = this.getData(_a.formItem);
  const value = data["my-field"];
  break;
```

Or read directly from a named part:

```js
this.ensurePart("my-input").then((p) => {
  const value = p.el.querySelector("input")?.value?.trim();
});
```

---
