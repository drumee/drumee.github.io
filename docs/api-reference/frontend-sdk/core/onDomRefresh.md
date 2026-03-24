---
id: onDomRefresh
title: onDomRefresh
sidebar_label: onDomRefresh
---

# onDomRefresh()

A **lifecycle hook** called automatically by Drumee once the widget's DOM element is ready and attached to the page. This is the standard entry point for initializing a widget's UI and data.

---

## When It's Called

`onDomRefresh` fires **once** after the widget is mounted — after the DOM element exists but before any children are rendered. Think of it as the widget's "ready" signal.

```
Widget created
  └── DOM element attached to page
        └── onDomRefresh() called automatically
              └── your initialization logic runs here
```

---

## What to Put Here

`onDomRefresh` is the right place to:

- Feed the root skeleton (first render)
- Load required data before rendering
- Set up the initial page/state
- Initialize third-party libraries that need a real DOM element

---

## Basic Pattern

The simplest and most common usage — just feed the root skeleton:

```js
onDomRefresh() {
  this.feed(require("./skeleton").default(this));
}
```
