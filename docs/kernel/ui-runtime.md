---
id: ui-runtime
title: UI Runtime
slug: /kernel/ui-runtime
sidebar_position: 9
description: Browser initialization, LETC composition, plugins, state, and transport in @drumee/ui-runtime.
---

# `@drumee/ui-runtime`

The UI runtime is a CommonJS, Webpack-compatible browser runtime. It is client-rendered and intentionally has no SSR contract.

## Initialization

`bootstrap()` creates one runtime per browser global and publishes the extracted non-MFS environment after initialization. It creates `Platform`, `Env`, `Host`, `Visitor`, and `Organization` Backbone contexts; a Kind registry; Skeleton factories; core LETC widget classes; service transport; and a WebSocket client. Plugin requests wait for the READY promise.

For compatibility, selected objects are exposed as browser globals (`Kind`, `Skeletons`, `Preset`, LETC classes, contexts, and `Websocket`). The old global `KIND` namespace is deliberately absent.

## LETC, Skeleton, Kind, and State

- **LETC Widget** is the retained Backbone/Marionette view lifecycle and event/part model.
- **Skeleton** is a normalized descriptor tree that selects a `kind`, flow, handlers, parts, and children.
- **Kind** maps names to static widgets, application widgets, or dynamically registered addons.
- **State** is projected through model values and canonical DOM attributes; radio, toggle, and radio-toggle behaviors are retained.

This is a focused runtime subset, not a copy of the full historical UI framework. MFS widgets, Finder, Team screens, routing, profile-media behavior, and application policy are excluded.

## Plugin flow

`Kind.loadPlugin({name, kind})` waits for runtime readiness, calls `bootstrap.plugin`, loads the returned bundle, and waits for `Kind.registerAddons`. A loaded bundle that fails to register its requested kind rejects instead of hanging.

## Service and WebSocket transport

`ServiceClient` sends logical service calls and unwraps Drumee envelopes. Session authorization is write-only private transport state; capability Widgets cannot read the raw `regsid` bridge. The WebSocket client requests a new OTAK for every connection, binds handlers by logical service, sends `sys.ping`, and reconnects with a fresh OTAK after abnormal closure.

Browser bundles are the responsibility of the separate transitional `ui-build` tooling. `ui-runtime` ships sources, not a generated production bundle.

Source: `ui-runtime/src/bootstrap.js`, `letc.js`, `widgets.js`, `skeletons.js`, `kind.js`, `behaviors.js`, `service.js`, and `websocket.js`.

