---
id: 09-roadmap
title: Roadmap
slug: /introduction/09-roadmap
---

# Roadmap

Drumee's roadmap is driven by one principle: **sovereignty first, usability second, extensibility third.** We ship when it works, not when it looks good on a slide.

## Current State (Q4 2026)

| Capability | Status | Notes |
| :---- | :---- | :---- |
| SaaS deployment | ✅ Live | [app.drumee.com](https://app.drumee.com) |
| File storage and collaboration suite | ✅ Live | SaaS today; the self-hosted edition is in progress |
| Office engine | ✅ Live | Drumee's own engine for editing Office documents in the browser |
| SaaS data portability (→ self-hosted) | 🔄 Final stage | Within 2 weeks |
| Database layer (Notion-like, SaaS) | ✅ Live | [app.drumee.com](https://app.drumee.com) |
| SaaS app marketplace | ✅ Live | [app.drumee.com](https://app.drumee.com) |
| Drumail | 🛠️ In development | Manage your email in one place |
| Drumee AI | 🛠️ In development | An assistant inside Drumee: summarizing, planning, reminding |

---

## What Is Live

### File storage and collaboration suite

The core of Drumee: workspaces with files, folder-native chat, tasks, calendar and meetings, under one permission model. It runs today as a hosted service. The same platform is being packaged for self-hosting — see [Self-Hosting](/self-hosting).

→ [File Storage](../technology/03-file-storage.md) · [RBAC System](../technology/02-rbac-system.md)

### Office engine

Word, Excel and PowerPoint documents open and are edited directly in the browser, by several people at once, with a version history. The engine is developed by Drumee rather than embedded from a third-party document server.

### Database layer

A Notion-like database layer for structuring information next to your files, available on the hosted service.

### App marketplace

Apps that extend a workspace, available on the hosted service. Documentation for building apps will be published with the [SDK Reference](/api-reference).

---

## What Is Next

### SaaS data portability

Take everything you have on the hosted service and move it to a deployment you run yourself. This is the bridge between the two halves of the strategy: start in the cloud, move to full sovereignty when you are ready. It is in its final stage.

### Drumail

Bring your email into Drumee, so that messages live in the same place as the files, conversations and tasks they are about.

### Drumee AI

An assistant that works with what is in your Drumee: summarizing documents and conversations, helping to plan, and reminding you of what matters.

---

## What We Will Not Build

Drumee will not build features that require compromising the sovereignty principle:

❌ AI training on user data

❌ Third-party analytics embedded in the core product

❌ Advertising or data monetization of any kind

❌ Features that only work when connected to Drumee's cloud

The product moat is the conviction, not the feature list.
