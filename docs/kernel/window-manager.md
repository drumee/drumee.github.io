---
id: window-manager
title: Window Manager
slug: /kernel/window-manager
sidebar_position: 11
description: The standalone Window Manager capability and its UI runtime boundary.
---

# `@drumee/window-manager`

Window Manager is an optional browser capability above `@drumee/ui-runtime`. Window policy does not belong in the generic Widget runtime, and application content does not belong in Window Manager.

It requires a READY UI runtime and a workspace DOM element. `createWindowManager()` returns a registry that can create/open/register/get/activate/close windows and destroy the manager.

Managed windows provide:

- independent geometry clamped to the workspace;
- focus and increasing z-order through manager-scoped radio state;
- header-handle dragging and all-edge resizing via jQuery UI;
- minimize/restore, maximize, and left/right snap;
- optional generic drop targets with application-supplied payloads;
- separate lifecycle state (`created`, `open`, `minimized`, `closed`).

The shell is a normal LETC Skeleton: `window-handle`, `window-title`, `window-controls`, and `window-body` are parts, and controls route through `onUiEvent`. Content may be one Skeleton descriptor, an array, a string, or an explicit native DOM interoperability escape hatch.

Drop handling has no Finder or MFS semantics. Dragging, resizing, and dropping are installed and cleaned up through `WindowInteractions`. Desktop Chromium behavior is validated; touch emulation is not currently claimed.

Historical Desk ownership and desktop product policy remain outside this package.

Source: `window-manager/lib/manager.js`, `window.js`, `interactions.js`, `geometry.js`, and `skeleton.js`.
