---
id: 03-permission-management
title: Permission Management
slug: /product-guides/03-permission-management
---

# Permission Management

Drumee's permission system is the foundation of everything. This guide covers how to manage permissions as an administrator, how to share workspaces with internal and external collaborators, and how to audit who has access to what.

## Core Concepts (Recap)

Permissions in Drumee work at three levels:

1\. 	**Workspace level** — default role for all content in a workspace

2\. 	**File level** — override role for a specific file within a workspace

3\. 	**Link level** — scoped, time-limited access via a share link (for external collaborators)

All permission checks happen at the microservice level — before any data operation — so there is no application-layer way to bypass them.

## Roles at a Glance

| Role | View | Download | Upload/Edit | Delete | Manage Permissions |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Editor** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Viewer** | ✅ | Configurable | ❌ | ❌ | ❌ |
| **External (link)** | Scoped | Scoped | Scoped | ❌ | ❌ |

## Managing Workspace Members

### Inviting a Team Member

4\. 	Open the workspace

5\. 	Click the **Members** icon in the workspace toolbar (person icon)

6\. 	Enter the user's email address

7\. 	Select a role: **Admin**, **Editor**, or **Viewer**

8\. 	Click **Invite**

The user receives a notification. If they do not have a Drumee account, they receive an email with a sign-up link. On sign-up, they are automatically granted the assigned role in the workspace.

### Changing a Role

9\. 	Open the **Members** panel

10\.  Click the role badge next to the user's name

11\.  Select the new role from the dropdown

12\.  The change takes effect immediately — the user's next request is evaluated with the updated role

### Removing a Member

13\.  Open the **Members** panel

14\.  Click the **⋮** menu next to the user

15\.  Select **Remove access**

Removing a user revokes their access immediately. Any files they uploaded remain in the workspace. Audit log entries from their actions are preserved.

## File-Level Permission Overrides

Use file overrides when a specific file needs a different permission than the workspace default.

**Example use case:** A workspace is shared with an Editor team, but one confidential file should be Viewer-only for a specific person.

### Setting a File Override

16\.  Right-click a file (or click **⋮** next to it)

17\.  Select **Manage permissions**

18\.  Click **Add override**

19\.  Select the user and the override role

20\.  Click **Save**

The override applies to that file only. The user retains their workspace role on all other files.

### Viewing Active Overrides

In the file's **Manage permissions** panel, all active overrides are listed with the user, role, who granted it, and when. Admins can view and modify any override.

## External Sharing (Share Links)

Share links give external collaborators scoped access without requiring a Drumee account.

### Creating a Share Link

21\.  Right-click a workspace or file

22\.  Select **Share**

23\.  Configure the link:

| Option | Description |
| :---- | :---- |
| **Permitted operations** | What the recipient can do: View, Download, Upload, Comment |
| **Expiry date** | Optional — link auto-deactivates after this date |
| **Password** | Optional — recipient must enter this before accessing |
| **Max uses** | Optional — link deactivates after N accesses |


24\.  Click **Generate link**

25\.  Copy the link or send it directly via the email option

### What the Recipient Sees

The recipient opens the link and sees the workspace or file — with only the operations you permitted visible. They can view and interact with content, participate in the workspace chat, and (if upload is permitted) add files.

At the bottom of the shared view: a clear CTA to create their own sovereign workspace.

### Managing Active Links

In the workspace **Share** panel, all active links are listed with:

- Operations permitted

- Expiry date

- Number of times accessed

- Whether password-protected

To revoke a link: click **Revoke** next to it. The link becomes inactive immediately — anyone who clicks it sees an "Access revoked" message.

### Time-Limited Role Grants

For users with a Drumee account, you can grant a role with an automatic expiry — useful for contractors or temporary collaborators:

26\.  When inviting or editing a member's role, toggle **Set expiry**

27\.  Choose the expiry date

28\.  The role is automatically revoked at midnight on that date

29\.  The user receives a notification when access expires

## The Permissions Panel (Admin View)

Admins have access to a full permissions matrix for any workspace.

### Accessing the Permissions Matrix

30\.  Open the workspace

31\.  Click **Settings** → **Permissions**

The matrix shows:

* All current members and their roles  
* All file-level overrides  
* All active share links with usage statistics  
* Full audit log for all permission changes

### Exporting the Permissions Matrix

Click **Export** to download the workspace's full ACL JSON — useful for compliance documentation and audits.

→ [ACL JSON Specification](../api-reference/acl-spec.md)


## The Audit Trail

Every permission-related action is logged and cannot be modified or deleted:

| Action logged | Details recorded |
| :---- | :---- |
| Member invited | Invited by, role assigned, timestamp |
| Role changed | Changed by, old role, new role, timestamp |
| Member removed | Removed by, timestamp |
| File override added | Added by, user affected, role, timestamp |
| Share link created | Created by, config, timestamp |
| Share link accessed | Token used, source IP, timestamp |
| Share link revoked | Revoked by, timestamp |


### Viewing the Audit Log

32\.  Open the workspace **Settings** → **Permissions** → **Audit Log**

33\.  Filter by date range, user, or action type

34\.  Export as CSV for external compliance systems

## Managing Permissions via the SDK

For automated workflows and integrations, permissions can be managed programmatically:

```bash
// Grant a role await this.acl.setRole('user-789', 'ws-456', 'editor');
// Create a share link const link = await this.acl.createShareLink('ws-456', {
operations: ['view', 'download'],
expiry: '2026-06-01',
password: 'secure-pass' });
// Revoke access await this.acl.revokeAccess('user-789', 'ws-456');
// Get the full permissions matrix const matrix = await this.db.exec('get_permissions_matrix', {
workspace_id: 'ws-456' });
```


→ [ACL API Reference](../api-reference/backend-sdk/index.md)

## Permission Best Practices

**Default to Viewer, escalate deliberately**

When in doubt, give new collaborators Viewer access first. Escalate to Editor only when they need to contribute files or edits.

**Use expiry dates for external links**

Always set an expiry on share links for external collaborators. A link with no expiry is a permanent open door.

**Audit regularly**

Review the permissions matrix at least monthly for active workspaces. Remove members who no longer need access. Revoke unused share links.

**One workspace per client or project**

Isolation is the most effective permission strategy. If Client A and Client B are in separate workspaces, there is no permission misconfiguration that can expose Client A's files to Client B.

**Use file overrides sparingly**

File-level overrides add complexity. If you find yourself adding many overrides inside a workspace, consider whether the workspace should be split into two.

