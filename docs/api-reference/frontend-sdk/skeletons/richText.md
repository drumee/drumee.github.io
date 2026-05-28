---
id: richText
title: Rich Text
sidebar_label: Rich Text
---

# Skeletons.RichText

A **rich text editor or viewer** — supports both editable and read-only modes, inline formatting, auto-linking, and tag support. Use it for notes, documents, and any content that requires formatted text input.

---

## Signature

```js
// Full object form
Skeletons.RichText(props, style?)

// Shorthand — string content
Skeletons.RichText("My text")

// Shorthand — string content + class name
Skeletons.RichText("My text", "my-class")
```

---

## Common Props

| Prop          | Type             | Description                                         |
| ------------- | ---------------- | --------------------------------------------------- |
| `content`     | String           | Initial text content. Defaults to `""` if omitted   |
| `className`   | String           | CSS class(es) to apply                              |
| `sys_pn`      | String           | Named part — enables `onPartReady` and `ensurePart` |
| `name`        | String           | Model key this editor is bound to                   |
| `role`        | String           | Editor role — e.g. `"editor"` for write mode        |
| `mode`        | String           | Interaction mode — e.g. `"interactive"`             |
| `readwrite`   | Number           | `1` to enable editing                               |
| `autofocus`   | Number / Boolean | Focus the editor on render                          |
| `placeholder` | String           | Placeholder text shown when empty                   |
| `service`     | String           | Service triggered on submit or raise                |
| `autolink`    | Number           | `1` to automatically detect and linkify URLs        |
| `tags`        | Any              | Tag configuration for tagging support               |
| `uiHandler`   | Widget           | Routes interaction events to `onUiEvent`            |

---

## Examples

### Editable note with autolink and tags

```js
Skeletons.RichText({
  className: `${fig}__editor`,
  sys_pn: "text-content",
  name: "content",
  role: "editor",
  readwrite: 1,
  autofocus: 1,
  autolink: 1,
  placeholder: LOCALE.MY_PLACEHOLDER,
  service: "raise",
  tags,
});
```

### Interactive viewer with initial content

```js
Skeletons.RichText({
  className: `${fig}__content`,
  sys_pn: "content",
  name: "content",
  content: ui.mget("content"),
  mode: "interactive",
  autofocus: ui.mget("autofocus"),
  placeholder: ui.getPlaceholder(),
  service: "submit",
});
```

---
