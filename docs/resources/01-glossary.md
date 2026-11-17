---
id: 01-glossary
title: Glossary
slug: /resources/01-glossary
description: The terms used across the Drumee documentation.
---

# Glossary

The vocabulary of the Drumee platform, in alphabetical order.

### Admin
A [workspace role](/technology/02-rbac-system#workspace-roles). Can invite people, manage members and change workspace settings, in addition to everything an Editor can do.

### Audit log
The record of permission-relevant changes in an organization: who did what, to what, and when. Kept for one year.

### Blob
One stored content in object storage. A file [node](#node) points to a blob; several nodes can share one. → [File Storage](/technology/03-file-storage)

### Chatter
A workspace role. Can view, download, take part in conversations and comment on tasks, but not change content.

### Derived content
Objects produced from a file by background workers: thumbnails, image previews, video renditions.

### Directory
The global database: accounts, sessions, tenants and memberships. → [Directory Schema](/technology/06-directory-schema)

### Editor
A workspace role. Can create and change content, create share links and start meetings.

### Event
A message published by the server for every change (`node.created`, `message.new`, …) and delivered in real time to the people concerned. → [Request Pipeline](/technology/04-request-pipeline#realtime)

### External workspace
A workspace that can include people from outside the organization, and the only kind in which share links exist.

### Guest
A person from outside the organization who holds a Viewer or Chatter role in an external workspace. Also used for a visitor who opens a share link without an account.

### Internal workspace
A workspace open only to members of the organization. Its visibility is *everyone*, *selected teams* or *private*.

### Node
A folder or a file in a workspace's tree.

### Object storage
The S3-compatible store that holds file content.

### Organization
A [tenant](#tenant) shared by several people, with its own members, teams, policies and plan.

### Organization level
A person's position on the organization's administration ladder: Member, Org view, Org manage, Org security, Org admin, Owner.

### Outside member
A person from outside the organization who holds an Editor or Admin role in an external workspace.

### Owner
The single person at the top of a workspace or of an organization. Ownership can be transferred but not shared.

### Personal workspace
The workspace every account gets at sign-up. Only its owner is a member.

### Presigned URL
A short-lived, signed URL that lets a browser upload or read one object directly in object storage.

### Quota
The storage a tenant may use under its plan. Files, items in the trash and stored versions count toward it.

### RBAC
Role-based access control: permissions follow from a person's role. → [RBAC System](/technology/02-rbac-system)

### Role
What a person may do in one workspace: Viewer, Chatter, Editor, Admin or Owner.

### Room
The audience of a realtime [event](#event): a user, a workspace, a conversation, an organization or a share link.

### Session
A signed-in device. Sessions are stored on the server and can be revoked instantly.

### Share link
A link that gives people outside a workspace access to one file, folder or task, with its own permissions and protections.

### Team
A named group of members of an organization, used to give automatic membership of internal workspaces.

### Tenant
The unit of data ownership. Every person has a personal tenant; an organization is a shared one. Every stored document names the tenant it belongs to.

### Trash
Where deleted files, folders and workspaces stay for 30 days before they are purged.

### Version
An earlier content of a file, kept whenever the content is replaced.

### Viewer
A workspace role. Can browse and open content in the browser.

### Worker
The background process that produces previews, runs imports, sends notifications and performs scheduled clean-up.

### Workspace
The unit of collaboration: a file tree, conversations, a task board, a calendar and members with roles.
