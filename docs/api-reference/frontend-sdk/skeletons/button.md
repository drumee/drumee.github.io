---
id: button
title: Button
sidebar_label: Button
---

# Skeletons.Button

Interactive elements that combine an icon with optional text or behavior. Three variants exist, each suited for a different visual pattern.

---

## Variants

| Variant                  | Renders              | Use for                                          |
| ------------------------ | -------------------- | ------------------------------------------------ |
| `Skeletons.Button.Svg`   | Icon only            | Toolbar buttons, action icons, close/pin/save    |
| `Skeletons.Button.Label` | Icon + text label    | Menu items, navigation, checkboxes, form options |
| `Skeletons.Button.Icon`  | Icon with fixed size | Compact icon buttons with custom dimensions      |

---

## Common Props

All three variants share these props:

| Prop          | Type   | Description                                                                 |
| ------------- | ------ | --------------------------------------------------------------------------- |
| `ico`         | String | Icon identifier (mapped to `chartId` internally)                            |
| `className`   | String | CSS class(es) to apply                                                      |
| `service`     | String | Service name triggered on click                                             |
| `uiHandler`   | Widget | Routes interaction events to `onUiEvent`                                    |
| `sys_pn`      | String | Named part — enables `onPartReady` and `ensurePart`                         |
| `dataset`     | Object | `data-*` attributes set on the element                                      |
| `state`       | Number | State (`0` or `1`) — reflects to `data-state` on the element                |
| `radio`       | String | Channel ID — only one widget in the same channel can have `state = 1`       |
| `radiotoggle` | Number | Toggle mode (`1` or `0`) — switches state between `0` and `1` on each click |
| `haptic`      | Number | Haptic feedback delay in ms                                                 |
| `tooltips`    | String | Tooltip text shown on hover                                                 |
| `src`         | String | Direct SVG URL (overrides `ico`)                                            |

---

## `Skeletons.Button.Svg`

An **icon-only button**. The most common button type — used for toolbars, action icons, and any button that does not need a visible label.

```js
Skeletons.Button.Svg({
  ico: "my-icon",
  service: "my-action",
  uiHandler: ui,
  className: `${fig}__my-button`,
});
```

### With tooltip and haptic feedback

```js
Skeletons.Button.Svg({
  ico: "my-icon",
  service: "my-action",
  haptic: 1000,
  tooltips: LOCALE.MY_ACTION_LABEL,
  className: `${fig}__my-button`,
});
```

### With direct SVG source

```js
Skeletons.Button.Svg({
  ico: "my-icon",
  src: `${protocol}://${domain}/images/icons/my-icon.svg`,
  className: `${fig}__my-icon`,
  uiHandler: ui,
});
```

---

## `Skeletons.Button.Label`

An **icon + text label button**. Used for menus, navigation items, checkboxes, and any button where a visible label is needed alongside an icon.

```js
Skeletons.Button.Label({
  ico: "my-icon",
  label: LOCALE.MY_LABEL,
  service: "my-action",
  uiHandler: ui,
  className: `${fig}__my-item`,
});
```

### Additional props

| Prop           | Type    | Description                                           |
| -------------- | ------- | ----------------------------------------------------- |
| `label`        | String  | Text label displayed next to the icon                 |
| `labelClass`   | String  | CSS class applied to the label element                |
| `href`         | String  | Navigates to this URL on click (instead of a service) |
| `priority`     | String  | Visual priority — e.g. `"primary"`                    |
| `bubble`       | Boolean | Whether the event should bubble up                    |
| `radio`        | String  | Radio channel name for grouped toggle behavior        |
| `initialState` | Number  | Initial state for radio/toggle buttons                |
| `reference`    | String  | Model attribute to bind state to                      |
| `svgSource`    | String  | External SVG URL for the icon (e.g. flag images)      |
| `value`        | Any     | Value associated with this button                     |
| `formItem`     | String  | Model key this button controls in a form              |

### As a navigation link

```js
Skeletons.Button.Label({
  ico: "my-icon",
  label: LOCALE.MY_PAGE,
  href: "#/desk/my-page",
});
```

### With radio toggle state

```js
Skeletons.Button.Label({
  ico: "my-icon",
  label: LOCALE.MY_OPTION,
  radio: MY_CHANNEL,
  initialState: currentState,
  service: "update",
  uiHandler: ui,
  className: `${fig}__checkbox`,
});
```

### Conditionally disabled

```js
Skeletons.Button.Label({
  ico: "my-icon",
  label: LOCALE.MY_ACTION,
  service: isEnabled ? "my-action" : null,
  state: isEnabled ? 1 : 0,
  dataset: isEnabled ? undefined : { disabled: 1 },
  uiHandler: ui,
});
```

---

## `Skeletons.Button.Icon`

An **icon button with explicit dimensions**. Identical to `Button.Svg` but accepts a `style` argument for custom `width`, `height`, and `padding`. Default size is 40×40px with 10px padding.

```js
Skeletons.Button.Icon(
  {
    ico: "my-icon",
    service: "my-action",
    uiHandler: ui,
  },
  {
    width: 30,
    height: 30,
    padding: 7,
  },
);
```

> Use `Button.Icon` when the default 40×40 size does not fit the layout. For all other cases, `Button.Svg` is sufficient.

---

## Choosing the Right Variant

```
Need icon only?                        → Button.Svg
Need icon + text label?                → Button.Label
Need icon only with custom dimensions? → Button.Icon
Need a navigation link?                → Button.Label with href
Need a toggle / radio button?          → Button.Label with radio + initialState
```

---
