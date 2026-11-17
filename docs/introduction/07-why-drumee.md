---
id: 07-why-drumee
title: Why Drumee?
slug: /introduction/07-why-drumee
---

# Why Drumee?

Cloud tools are not neutral infrastructure.  
Your data is stored, processed, and governed inside systems you do not control — and most of them give you no way to change that.

The tools your team uses today were not designed to let you leave. They were designed to maximize retention inside someone else’s system.

Drumee was designed differently: one workspace for the work, and a path that ends with the platform running on infrastructure you own.

:::note[Where Drumee is today]

Drumee runs today as a hosted service at [app.drumee.com](https://app.drumee.com). The self-hosted edition of the platform, and the tool to move your data from the hosted service to your own deployment, are on the way — see the [Roadmap](./09-roadmap.md). This page says plainly which benefits you get today and which arrive with self-hosting.

:::

## The Hidden Cost of Cloud Convenience

Cloud tools solve real problems. Collaboration is easy. Access from anywhere. No server to maintain. These are genuine benefits.

But there is a cost most teams never audit:

**Structural dependency.** Every cloud tool you adopt becomes a point of control over your business:

* **Vendor breach** → your client data is exposed  
* **Platform shutdown** → your workflows break, and you cannot control when or how they recover  
* **Price increase** → you pay or face a painful migration  
* **AI harvesting** → your documents train someone else's models  
* **Compliance audit** → you cannot prove where data actually lives  
* **Geographic restriction** → your data crosses borders you didn't choose

None of this is a bug in cloud tools. It is how they are designed to operate.

A hosted Drumee is a cloud service too, and the same questions apply to it. What differs is the answer Drumee is built to give: your content is not used for advertising or to train AI models, you can export it at any time, and the destination is a deployment you run yourself.

## Why Existing Alternatives Don't Solve It

### "We use four good tools"

Files in one product, chat in another, tasks in a third, meetings in a fourth. Each has its own members, its own permissions and its own idea of a project — and nothing keeps them in step. The cost is paid every day in context switching, and once a year when someone leaves and access has to be removed in four places.

### "We use Google Drive with strong permissions"

Google Drive permissions control who inside Google's system can access your files. They do not change the fact that your data is on Google's infrastructure, under Google's terms, with no route to running it yourself. Permission settings do not equal sovereignty.

### "We use Nextcloud"

Nextcloud is a solid self-hosted file sync server, and it can be self-hosted today. Its collaboration features are separate apps added around file sync. Drumee starts from the other end: one workspace model in which files, conversations, tasks and meetings share the same members and the same roles.

### "We use an on-premise server"

A raw file server gives you data location control but none of the collaboration layer: no integrated chat, no granular roles, no tasks, no meetings. You own the storage; you lose the usability.

## What Drumee Provides

### 1\. One Permission Model for Everything

A person has one role in a workspace, and that role governs its files, its conversations, its tasks and its meetings alike. There is no second permission system to keep in step, and the server checks the role on every request — the interface only shows or hides what the server has already decided. → [RBAC System](../technology/02-rbac-system.md)

### 2\. Workspace-Native Collaboration

In most tools, collaboration is layered on top of storage:

* Files are in Drive. Chat is in Slack. They are separate systems.

In Drumee, the workspace is the unit of collaboration. Its files, the conversation of each folder, its task board, its calendar and its meetings live together, with the same members. No context switching. No data fragmented across platforms.

### 3\. Work With People Outside, Safely

Client work needs outsiders. An external workspace admits guests with limited roles; a secure share link gives access to one folder behind a password, an email requirement and an expiry, with a log of who opened it. Your internal workspaces stay internal.

### 4\. Your Data Can Leave

Export your files, chat history and workspace data whenever you choose. Files are stored as you uploaded them, in standard formats, not in a proprietary container. Moving a whole account from the hosted service to a self-hosted deployment is in its final stage.

### 5\. A Platform You Can Extend

An app marketplace is available on the hosted service. A developer SDK and a public API reference are coming soon, so that integrations and internal tools can build on Drumee and inherit its security model. → [SDK Reference](/api-reference)

### 6\. A Path to Zero Vendor Risk

The self-hosted edition is the same platform, packaged for your own infrastructure. Once you run it, your data is on your server and keeps working whatever happens to Drumee the company. It is [coming soon](/self-hosting).

## The Business Case

A team that runs a document tool, a chat tool, a file-storage suite and a meeting tool pays four subscriptions, manages four sets of accounts, and lives with four permission models.

Drumee replaces them with one platform, one set of members and one model of access. Fewer subscriptions is the visible saving; the larger one is the time no longer spent switching context, hunting for the right version, and reconciling who has access to what.

## When Drumee Is the Right Choice

**Today, on the hosted service**

✅ You want files, chat, tasks and meetings in one place instead of four

✅ You work with clients or partners and need to give them precise, limited access

✅ You want one role model, an audit log, and control over who is in which workspace

✅ You want to be able to take your data out at any time

**With the self-hosted edition (coming soon)**

✅ You handle data that must stay on infrastructure you control

✅ You have data-residency or regulatory requirements that rule out a shared service

✅ You do not want your business data on a third party's platform at all

✅ You want to stop paying per seat for software you could run yourself
