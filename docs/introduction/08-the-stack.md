---
id: 08-the-stack
title: The Drumee Stack
slug: /introduction/08-the-stack
---

# The Drumee Stack

Drumee brings the layers a team normally assembles from separate products — storage, permissions, chat, tasks, meetings — into one platform with one data model and one permission system.

This page describes what the platform is made of.

## The Three-Layer Product Architecture

Drumee's product is structured in three distinct layers, each serving a different role:

| Layer | Role | What It Includes |
| :---- | :---- | :---- |
| **File System Core** | Foundation — *this is what we sell* | Structured storage in workspaces, with versions, trash, quota and fine-grained role-based permissions |
| **Collaboration Layer** | Adoption driver — *this is why teams adopt* | File sharing, folder-native chat, tasks and calendar, meetings, Office documents edited together in the browser |
| **System Layer** | Differentiator — *this is the long-term moat* | An app marketplace on the hosted service today; a public API reference and an SDK coming soon |

> Key insight: Layer 1 IS the product. Layer 2 makes it adoptable. Layer 3 makes it extensible.

## What Is in a Workspace

| Capability | In short |
| :---- | :---- |
| **Files** | Folders and files, direct-to-storage uploads with resume, previews, video streaming, versions, 30-day trash |
| **Office documents** | Word, Excel and PowerPoint files open and are co-edited in the browser, with history |
| **Chat** | A conversation per workspace, topics, threads on a file, direct messages, mentions |
| **Tasks** | Boards with columns, sprints, labels, comments and history; a calendar |
| **Meetings** | Audio and video rooms, 1:1 calls, screen sharing, guest links with a lobby |
| **Sharing** | Invitations with a role; links with expiry, password and email restrictions |
| **Organization** | Members, teams, policies, an audit log, plans and billing |

## The Four Technical Pillars

### 1. Identity & Access Control

A role-based model decided entirely on the server.

* One role per person per workspace: Viewer, Chatter, Editor, Admin, Owner  
* A separate ladder for administering an organization  
* Share links for people outside, with their own permissions and protections  
* Server-side sessions that can be revoked instantly; two-factor authentication  
  → [RBAC System](../technology/02-rbac-system.md)

### 2. File Storage

Metadata in a database, content in object storage.

- Every folder and file is a **node** in a workspace tree

- Content is stored in S3-compatible object storage under a random identifier — never under the file's name or path

- Browsers upload directly to storage; the server authorizes, verifies and records

- Soft delete with a 30-day trash; versions on every change of content

- → [File Storage](../technology/03-file-storage.md)

### 3. Realtime Collaboration

Every change is an event.

- Changes are published to the people in the same workspace over WebSocket

- A short replay window makes reconnection seamless

- Subscriptions are checked with the same permission rules as the API

- → [Request Pipeline](../technology/04-request-pipeline.md)

### 4. Tenancy & Data Protection

Every organization's data is separated by construction.

- Each document carries the ID of the tenant that owns it, and every query filters by it

- Passwords, sessions and codes are stored only as hashes; stored secrets are encrypted

- End-to-end encryption is in development

- → [Data Storage & Encryption](../technology/05-data-storage-encryption.md)

## Runtime Architecture

Drumee runs as **one application binary** in two roles, next to three stores:

| Component | Responsibility |
| :---- | :---- |
| **Server** | The REST API, the realtime hub, and the web application |
| **Worker** | Previews and video renditions, imports, notifications, scheduled clean-up |
| **Document database** | The source of truth for everything except file content |
| **Object storage** | File content and everything derived from it |
| **Cache and queues** | Short-lived state, the event bus, job queues |

Servers and workers keep no state of their own, so any number of them can run side by side.

→ [Technology Overview](../technology/01-overview.md)

## Deployment

| Edition | Status |
| :---- | :---- |
| **SaaS** | Live at [app.drumee.com](https://app.drumee.com) |
| **Self-hosted** | [Coming soon](/self-hosting) |

The same platform serves both: the self-hosted edition is the hosted one packaged for your own infrastructure, without plan limits.
