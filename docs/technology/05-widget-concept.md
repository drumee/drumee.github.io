---
id: 05-widget-concept
title: Widget Concept
slug: /technology/05-widget-concept
---

# Widget Concept

In Drumee, **everything is a widget**. Every screen, panel, list, button, and form element is a widget — identified by a kind string, built as a Backbone.Marionette class, and composed into JSON trees that the LETC engine renders.

## What Is a Widget?

A widget is a self-contained UI module. It manages its own:

* **State** — data it holds in memory  
* **Layout** — how it looks, defined via skeleton functions  
* **Behaviour** — how it reacts to user actions, via onUiEvent  
* **Styling** — its own SCSS skin

Each widget is defined by its kind — a unique string that points to a JavaScript module in the widget registry. For example, a widget with kind: "form_work" maps to the form_work class.

Core widgets are defined in: https://github.com/drumee/ui-core/blob/main/letc/kind/seeds/static.js

## The Skeleton Concept

Instead of HTML templates, Drumee uses **pure JSON tree data** to describe the user interface. This JSON is called a **Skeleton**.

As the application renders, the JSON tree is parsed to find every node with a kind attribute — a pointer to a widget, whether built-in or custom. Each widget comes to life with its own skeleton, which is itself a tree of other widgets, and so on.

Because skeletons are pure JSON data, they can change at runtime. That is the core extensibility mechanic.

```

// skeleton/index.js — a pure function returning a component tree 
import { Skeletons } from '@drumee/ui-core';   
export default function(ui) {   
    return Skeletons.Box.Y({ 	
        className: `${ui.fig.family}__main`, 	
        kids: [
            Skeletons.Box.X({     	
                className: `${ui.fig.family}__header`,     	
                kids: [ /* header widgets */ ]   	
            }),   	
            Skeletons.Box.Y({     	
                className: `${ui.fig.family}__content`,
                sys_pn: "content", 	// named part — accessible via this.ensurePart("content")     	
                uiHandler: [ui],   	
            }) 	
        ]   
    }); 
} 

```


The widget controller loads this skeleton via:

```

this.feed(require('./skeleton').default(this)); 

```

## Base Layout Widgets (Skeletons)

The most important base widgets are the **Skeletons** container types:

| Widget | Description |
| :---- | :---- |
| Skeletons.Box.X | Container that flows horizontally |
| Skeletons.Box.Y | Container that flows vertically |
| Skeletons.Box.G | Container using CSS grid template |
| Skeletons.Button.Svg | Button that triggers a UI service event |
| Skeletons.Element | Generic DOM element with content |


Full API reference: [**https://drumee.github.io/api-reference/frontend-sdk/**](https://drumee.github.io/api-reference/frontend-sdk/) 

## The FIG Concept

FIG stands for **Family, Item, Group** — Drumee's solution to CSS namespace conflicts.

A widget's kind string is split on the _ character:

* **Group** = first part (e.g. form)  
* **Item** = last part (e.g. work)  
* **Family** = full string (e.g. form_work)

These become CSS class prefixes via ui.fig:

> // In a skeleton: className: `${ui.fig.family}__main` // → "form_work__main" className: `${ui.fig.group}__container`  // → "form__container"


This lets you define styles common to a group (form__*) while applying unique styles to a specific widget family (form_work__*) — without any CSS pollution between widgets.

## The Parts System (`sys_pn`)

Drumee's sys_pn (system part name) solves the problem of accessing sub-widgets inside a DOM tree. Using document.getElementById returns only a DOM element — not the full widget with its data, API, and state.

sys_pn names a sub-widget so the parent can retrieve the entire widget object:

````

// In skeleton — name a sub-region 
    Skeletons.Box.Y({   
        sys_pn: "my-section",   
        uiHandler: [ui],
    })   // In controller — access and update it 

    this.ensurePart("my-section").then((part) => {   
        part.feed(require("./skeleton/my-section").default(this)); 
    }); 

```


Part namespaces are scoped to the widget that declares partHandler — so the same sys_pn name can be used in different widgets without conflict.

## The Event System (`onUiEvent`)

When a skeleton element is declared with service and uiHandler, user actions trigger onUiEvent on the parent widget:

```

// In skeleton — attach a service trigger 
Skeletons.Button.Svg({   className: `${ui.fig.family}__submit`,   service: "create-item",   uiHandler: [ui], })

// In controller — handle it async 
onUiEvent(cmd, args = {}) {
    const service = args.service || cmd.get(_a.service);     
    switch (service) { 	
        case "create-item":   	
            await this.createItem();   	
            break; 	
        case "close":   	
            this.goodbye();   	
        break;   
    } 
}


All user interactions flow through a single onUiEvent method — no scattered event listeners throughout the codebase.


## Widget Lifecycle

// Widget mounted

   	▼ initialize() — declare state, no rendering   	
    ▼ onDomRefresh() — load data, call this.feed(skeleton(this))
    ▼ Skeleton renders — named parts (sys_pn) become ready   	
    ▼ onPartReady(child, pn) — feed sub-skeletons into named parts   	
    ▼ User interacts → onUiEvent() → handle service

Small update → this.ensurePart("pn").then(p => p.feed(...))   	
Full re-render → this.feed(skeleton(this)) |

## Widget Folder Structure

Every widget follows the same layout:

```
| my-widget/ 
├── skeleton/ 
│   ├── index.js  	← Root layout (what the widget looks like) 
│   └── ...       	← Sub-skeletons for sections or pages ├── skin/ 
│   └── index.scss	← All styles for this widget 
└── index.js      	← Controller: state, services, event handling |
```