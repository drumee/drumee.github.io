---
id: onDomRefresh
title: onDomRefresh
sidebar_label: onDomRefresh
---

# onDomRefresh()

A **lifecycle hook** called automatically by Drumee once the widget's DOM element is ready and attached to the page. This is the standard entry point for initializing a widget's UI and data.

---

## When It's Called

`onDomRefresh` fires after the widget's DOM element is attached/refreshed (Marionette's `dom:refresh` event). The element exists by the time it runs, so it is the usual place to render the widget's content. Think of it as the widget's "DOM ready" signal.

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
