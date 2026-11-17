---
id: 02-faq
title: FAQ
slug: /resources/02-faq
description: Frequently asked questions about the Drumee platform and this documentation.
---

# Frequently Asked Questions

## About this documentation

### What is "coming soon"?

[Getting Started](/getting-started), [Product Guide](/product-guides), [Self-Hosting](/self-hosting), [Package Guidelines](/package-building) and the [SDK Reference](/api-reference) are being written and will be published as the corresponding releases become available.

## Permissions

### How do permissions work?

Each person has one role per workspace — Viewer, Chatter, Editor, Admin or Owner — and the role applies to everything in that workspace. → [RBAC System](/technology/02-rbac-system)

### Can I set permissions on a single folder or file?

Not for members: a role covers the whole workspace. To give someone access to one item only, use a [share link](/technology/02-rbac-system#share-links), or put the content in a workspace of its own.

### Can an organization administrator read every workspace?

No. Organization levels govern administration — members, teams, policies, billing — not content. An administrator who is not a member of a workspace cannot open its files or conversations, and nobody but its owner can open a Personal workspace.

### What is the difference between viewing and downloading?

A Viewer can open files in the browser but cannot download the originals. Downloading starts at the Chatter role. This limits casual copying; it is not copy protection.

## Files

### Where are my files stored?

File content is stored in S3-compatible object storage; names, folders, versions and permissions are in the database. → [File Storage](/technology/03-file-storage)

### Is there a file size limit?

Uploads are sent in parts directly to storage and can be resumed, so large files are supported; a single file can be up to about 78 GiB. Your plan's storage quota applies.

### What happens when I delete something?

It goes to the trash for 30 days, from which it can be restored. After that it is purged, and its content is removed from storage once nothing else references it.

### Which Office formats can be edited in the browser?

`docx`, `xlsx`, `xlsm` and `pptx`, with several people editing at once. Other Office formats are stored and can be downloaded.

## Security

### Is my data encrypted?

Yes, at every layer. Traffic is encrypted with TLS. Passwords, sessions and codes are stored only as hashes, and stored secrets are encrypted with AES-256-GCM. Content at rest is encrypted at the storage layer. End-to-end encryption is in development and will be released in stages. The full picture is in [Data Storage & Encryption](/technology/05-data-storage-encryption).

### Can one organization see another's data?

No. Every stored document names the tenant that owns it, every query filters by it, and this is enforced by a check in the build and by tests. → [Tenant isolation](/technology/02-rbac-system#tenant-isolation)

### How do I sign out a lost device?

Sessions are stored on the server. Removing a device from your account ends its session immediately, including any open realtime connection.

## Self-hosting

### Can I run Drumee on my own server?

The self-hosted edition is [coming soon](/self-hosting). Moving your data from the hosted service to your own deployment is part of the [roadmap](/introduction/09-roadmap).
