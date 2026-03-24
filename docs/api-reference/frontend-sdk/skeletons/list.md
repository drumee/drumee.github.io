---
id: list
title: List
sidebar_label: List
---

# Skeletons.List

Scrollable, data-driven list containers. Three variants exist for different rendering needs.

---

## Variants

| Variant                 | Use for                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| `Skeletons.List.Smart`  | Dynamic lists — supports API loading, item templates, spinner, empty state |
| `Skeletons.List.Scroll` | Static scrollable lists with custom scrollbar styling                      |
| `Skeletons.List.Table`  | Tabular data with table-specific layout                                    |

---

## Common Props

All three variants share these props:

| Prop          | Type   | Description                                         |
| ------------- | ------ | --------------------------------------------------- |
| `className`   | String | CSS class(es) on the list container                 |
| `innerClass`  | String | CSS class on the inner scroll element               |
| `flow`        | String | Layout direction — `x`, `y`, `wrap`, `none`         |
| `sys_pn`      | String | Named part — enables `onPartReady` and `ensurePart` |
| `uiHandler`   | Widget | Routes interaction events to `onUiEvent`            |
| `partHandler` | Widget | Routes part lifecycle events to `onPartReady`       |
| `kids`        | Array  | Static children to render                           |
| `vendorOpt`   | Object | Scrollbar appearance (see below)                    |
| `dataset`     | Object | `data-*` attributes                                 |

---

## `Skeletons.List.Smart`

The most capable variant. Supports **API-driven loading**, item templates (`itemsOpt`), spinner, empty state, and directional rendering.

### Additional Props

| Prop          | Type     | Description                                                                          |
| ------------- | -------- | ------------------------------------------------------------------------------------ |
| `api`         | Function | Called to fetch list data from the server                                            |
| `itemsOpt`    | Object   | Template applied to every item — defines `kind`, `uiHandler`, and any shared options |
| `spinner`     | Boolean  | Show a loading spinner while data loads                                              |
| `spinnerWait` | Number   | Delay in ms before showing the spinner                                               |
| `placeholder` | Any      | Skeleton shown while loading                                                         |
| `evArgs`      | Any      | Skeleton shown when the list is empty                                                |
| `start`       | String   | Starting position — `"bottom"` to scroll to bottom on load                           |
| `axis`        | String   | Scroll axis — `x` or `y`                                                             |
| `timer`       | Number   | Debounce delay in ms                                                                 |
| `formItem`    | String   | Model key this list is bound to                                                      |
| `dataType`    | String   | Data type hint — e.g. `"array"`                                                      |
| `state`       | Number   | Initial state                                                                        |
| `radiotoggle` | String   | Radio toggle channel                                                                 |

### Examples

#### Static list with predefined children

```js
Skeletons.List.Smart({
  className: `${fig}__list`,
  sys_pn: "my-list",
  kids: myItems,
});
```

#### API-driven list with item template

```js
Skeletons.List.Smart({
  className: `${fig}__list`,
  sys_pn: "my-list",
  api: ui.getItems.bind(ui),
  itemsOpt: {
    kind: "my_item_widget",
    uiHandler: ui,
  },
  spinner: true,
  spinnerWait: 500,
  vendorOpt: Preset.List.Orange_e,
});
```

#### Chat / messages list — start at bottom, show empty state

```js
Skeletons.List.Smart({
  className: `${fig}__messages`,
  sys_pn: "messages",
  flow: "none",
  start: "bottom",
  uiHandler: ui,
  api: ui.getCurrentApi,
  itemsOpt: {
    kind: "my_message_item",
    uiHandler: ui,
  },
  spinner: true,
  spinnerWait: 500,
  evArgs: Skeletons.Note(LOCALE.NO_MESSAGES, "no-content"),
  vendorOpt: Preset.List.Orange_e,
});
```

---

## `Skeletons.List.Scroll`

A **static scrollable container** with styled scrollbars. Use it when children are known at render time and no API loading is needed.

### Example

```js
Skeletons.List.Scroll({
  className: `${fig}__scroll-list`,
  sys_pn: "my-scroll",
  kids: myItems,
  uiHandler: ui,
  vendorOpt: Preset.List.Orange_e,
});
```

---

## `Skeletons.List.Table`

A **tabular list** for structured row/column data. Uses the same scrollbar defaults as `List.Smart`.

### Example

```js
Skeletons.List.Table({
  className: `${fig}__table`,
  sys_pn: "my-table",
  kids: myRows,
});
```

---

## `vendorOpt` — Scrollbar Styling

All List variants accept `vendorOpt` to customize the scrollbar appearance. The defaults are:

```js
{
  alwaysVisible: true,
  size: "2px",
  opacity: "1",
  color: "#FA8540",
  distance: "2px",
  railColor: "#E5E5E5",
}
```

Pass `vendorOpt: Preset.List.Orange_e` to use the shared preset, or override individual fields:

```js
vendorOpt: {
  color: "#0000FF",
  size: "4px",
}
```

---

## Choosing the Right Variant

```
Data comes from an API?                → List.Smart with api + itemsOpt
Static children, needs scrollbar?      → List.Scroll
Tabular / row-column data?             → List.Table
Need spinner or empty state?           → List.Smart with spinner + evArgs
Need to start scrolled to bottom?      → List.Smart with start: "bottom"
```

---

## Quick Reference

|                            | `List.Smart` | `List.Scroll` | `List.Table` |
| -------------------------- | ------------ | ------------- | ------------ |
| API loading                | ✅           | ❌            | ❌           |
| Item template (`itemsOpt`) | ✅           | ❌            | ❌           |
| Spinner / empty state      | ✅           | ❌            | ❌           |
| Styled scrollbar           | ✅           | ✅            | ✅           |
| Static `kids`              | ✅           | ✅            | ✅           |
