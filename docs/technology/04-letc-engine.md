---
id: 04-letc-engine
title: LETC Engine
slug: /technology/04-letc-engine
---

# LETC Engine

LETC — **Limitlessly Extensible Tree Components** — is Drumee's declarative UI rendering engine. Instead of generating HTML on the server or shipping a compiled JavaScript bundle, Drumee describes user interfaces as JSON trees that the client renders locally using a registry of widget components.

Try LETC live in the sandbox → **https://drumee.in/-/#/sandbox**

## The Problem with Conventional Approaches

Most web frameworks face a structural conflict: HTML is a server-side language by design, yet the user interface is a client-side concern.

**Pattern A — Server-rendered HTML.** The server generates HTML and sends it to the client. Server CPU is spent rendering UI the client's browser could do itself. Mixing backend and frontend code in the same codebase introduces security surface (e.g. accidental data exposure through rendered templates).

**Pattern B — JavaScript bundles.** A framework like React generates a large JS bundle that constructs the DOM on the client. This solves server-rendering but still mixes frontend concerns into the build step. Bundles grow large, hot-reload cycles are slow, and extending the UI requires recompilation.

## The LETC Approach

LETC decouples UI definition from both server logic and client compilation.

> Server → pure JSON data → LETC Renderer (client) → DOM


The server returns pure JSON. The LETC renderer on the client reads the JSON tree, resolves each node to a registered widget component, and renders the interface. No HTML is generated server-side. No recompilation is needed to add or modify a widget.

## Example: A Simple UI Tree

```

    { 
        kind: "container",
        "kids": [ 	
            { "kind": "heading", "content": "My Files", "level": 2 	}, 	
            { "kind": "data-grid", "service": "mfs.list", "columns": ["filename", "filesize", "mtime"] 	} 
        ] 
    }

```

The renderer looks up "kind": "data-grid" in the widget registry and instantiates the correct component with the provided properties. No server involvement beyond returning the initial JSON.

## Built on Backbone \+ Marionette

The LETC widget system is built on **Backbone** and **Backbone.Marionette**. Each widget is a Backbone.Marionette view class. This gives the system:

* A proven, stable component lifecycle (initialize, onRender, onDomRefresh)  
* Event delegation patterns via onUiEvent  
* Part-based sub-view management via sys_pn named regions  
* No framework-specific compilation step — plain JavaScript modules

Widget kinds are registered via JavaScript class definitions, not a custom DSL or framework-specific syntax.

## Key Properties

### No Hard-Coded Routes

The LETC engine does not bind UI views to URL paths. Navigation is driven by the JSON tree itself. A node can declare a service call that fetches and replaces the current tree fragment, enabling SPA-style navigation without a router configuration file.

### Extensibility via Widget Registry

Any developer can register custom widget kinds. The registry maps "kind": "my-widget" to a class implementation. This makes Drumee UI fully extensible without modifying the core engine — the same model used in the backend where adding an ACL JSON entry exposes a new service.

### Permission-Aware Rendering

Because the JSON tree is assembled server-side from Drumee service calls, the server naturally omits nodes the current user does not have permission to see. The client never receives UI fragments it should not render — there is no client-side if (user.isAdmin) hiding.

### JSON-Only Communication

All data exchanged between LETC and the backend travels as JSON over the standard service endpoint (/-/svc/module.method). LETC makes no distinction between a "UI call" and a "data call" — they are the same mechanism, governed by the same ACL rules.

## Full Architecture Flow

```text
User interacts with a LETC component
│
▼ Component calls a Drumee service via /-/svc/
│
▼ Server validates ACL → executes service → returns JSON
│
▼ LETC merges response into current tree
│
▼ Only the affected subtree re-renders
```


The server is a pure data processor. The client is a pure renderer. Neither knows about the other's implementation.

## Relationship to the Backend SDK

From the backend's perspective, LETC is simply a consumer of the service API. The backend does not know or care that the caller is a LETC renderer rather than a mobile app or a CLI tool. The ACL system enforces access the same way regardless of caller.

A backend developer adding a new service does not need to write any frontend code. Once the ACL entry and service method are in place, a LETC developer can immediately call it by referencing module.method in a widget's service property.

→ [Widget Concept](05-widget-concept.md) for how widgets are built

→ [Create Widget](../product-guides/01-creating-widget.md) for a step-by-step guide

