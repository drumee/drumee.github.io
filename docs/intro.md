---
sidebar_position: 1
---

# What is Drumee

Drumee is a Meta Operating System designed to support big web application projects. It has been purposely built to solve sovereignty and privacy concerns.

## Why Choose Drumee

- Fully standalone, sovereign and scalable infrastructure
- Ready to deploy thanks to a containerized bundle, deployable in minutes
- Collaborative and user-friendly UI/UX, extensible thanks to frontend SDK to support tailored plugins
- Granular ACL-enabled API, extensible thanks to backend SDK to support tailored plugins that can fit any specific requirements

## Main Features

### Identity & Access Control (Built-In)

- Automatic user-ID tagging for all requests
- Role-based permissions enforced at micro-service level
- Extensible and flexible rules

### Secure Filesystem (Linux-Inspired)

- Isolated volumes with POSIX-style permissions
- Atomic API for uploads, downloads, move, delete, copy, update
- Prevents directory traversal and permission leaks

### LETC Engine (JSON-based UI)

- Zero HTML processing on the server side
- Define UIs as JSON trees (no HTML/CSS fragmentation)
- Extend with custom widgets (e.g., `"kind": "data-grid"`)
- Full client-server architecture with permission-based, extensible RPC

## Drumee Meta OS vs Standard Operating System

|                               | Drumee | Operating System |
|-------------------------------|--------|------------------|
| Full control over hardware    | no     | yes              |
| Identity management (ACL)     | yes    | yes              |
| File system management (MFS)  | yes    | yes              |
| Input/output system           | yes    | yes              |
| Rendering engine              | yes    | optional         |

## Where to Go Next

- [Core Concepts](concepts/overview) — General principles and architecture
- [MFS Architecture](concepts/mfs) — How the Meta File System works
- [ACL System](concepts/acl-system) — Permission model and access control
- [Backend SDK Reference](api-reference/backend-sdk/index) — Full API reference for all services