---
id: 03-mfs-architecture
title: Meta File System (MFS)
slug: /technology/03-mfs-architecture
---

# Meta File System (MFS)

MFS — Meta File System — is Drumee's internal file management layer. Unlike standard web applications that expose the host file system directly to application logic, MFS adds a full abstraction layer that makes file handling safer, more flexible, and permission-aware at every level.

## Why MFS Exists

Standard applications that work directly with the host file system face structural problems:

• The entire host file system is potentially reachable if the application has a vulnerability

- There is no built-in concept of ownership or per-user isolation

- Moving, copying, or trashing files requires writing custom logic in every service

- No unified way to attach metadata (MIME type, category, visibility) to files

MFS solves all of these by storing the **logical representation** of files and folders in a database and keeping physical files in an isolated, content-addressed storage directory. The application never constructs raw filesystem paths from user input. 

## Core Concept: Everything Is a Node

Everything in MFS is a **node**. A node can be:

| Category | Description |
| :---- | :---- |
| folder | A directory that contains other nodes |
| file | An uploaded file (document, image, video, etc.) |
| hub | A special root folder that belongs to a Workspace (private, restricted, shared workspace) |


Each node has a unique id (UUID), an owner_id, a parent_id pointing to its container, and metadata fields including `user_filename`, `mimetype`, `category`, `filesize`, and `extension`. Note that the name and its extension are stored in **separate columns** — there is no single stored `filename` column (see the note below the table).

## Physical Storage

The logical tree lives in the database; the **bytes** live on disk, isolated per
tenant and content-addressed by node id — never by user-supplied name.

Each entity (hub or user) has its own storage root, the `home_dir` recorded in
`yp.entity.home_dir` (see [Database Sharding](./07-database-sharding.md)). Under
that root, the meta filesystem keeps every node in a directory keyed by its UUID,
inside a `__storage__` folder:

```
<home_dir>/__storage__/<node_id>/
  ├── orig.<ext>       ← the original uploaded file
  ├── <format>.<ext>   ← derived renditions (preview, slide, thumbnail, …)
  └── info.json        ← cached extracted metadata
```

- **`orig.<ext>`** — the untouched original. `<ext>` is the node's stored
  `extension` column; the file is literally named `orig`, **not** by the
  user-facing `user_filename` (see the `media` table below).
- **Derived renditions** — `preview`, `slide`, thumbnails, etc. are produced on
  demand by `server-core`'s media `Generator` and cached next to the original, so
  a rendition is computed once and reused.
- **`info.json`** — caches extracted metadata so it need not be recomputed.

Because the path is assembled from the entity's `home_dir` and the node's UUID —
not from the filename — it cannot be guessed or traversed. The application never
exposes it to the client: every download and upload goes through an MFS service
endpoint that runs a permission check before any I/O.


## The `media` Table

The central database table is media. Every node — in every Hub (Workspace) and every personal drive — is a row in a media table. Each Hub and each user has its own database, so the media table is scoped per owner.

Key columns:

| Column | Description |
| :---- | :---- |
| id | UUID — primary key and physical storage address |
| parent_id | UUID of the parent folder node |
| owner_id | UUID of the owning user |
| user_filename | The name the user sets through the UI — **without** the extension |
| mimetype | MIME type of the file |
| category | Logical type: folder, file, hub, etc. |
| filesize | Size in bytes |
| extension | File extension without the dot |
| metadata | JSON blob for arbitrary additional data |
| status | Lifecycle status (varchar, default `active`) |
| approval | Approval state enum (submitted, verified, validated, draft, online, offline) |
| upload_time | Creation Unix timestamp (aliased as `ctime` in procedure output) |
| publish_time | Last modification Unix timestamp (aliased as `mtime` in procedure output) |

:::note `filename` vs `user_filename`
A node's name is stored across two columns: `user_filename` (the display name set in the UI, **without** the extension) and `extension` (kept separately). There is **no stored `filename` column** — `filename` is a *derived/alias field*:

- On **write**, the server splits an incoming filename into name + extension (`server-core` `Mfs.get_format()`), persisting them as `user_filename` and `extension`.
- On **read**, stored procedures expose `... AS filename` and return `extension` alongside it, so a client can reconstruct the complete, extension-bearing name.

In short: `user_filename` is the bare name the user sees; `filename` is the alias that represents the full name **with** its extension.
:::

## Permission Model

Every MFS node carries a permission level using Drumee's numeric bitwise system:

| Level | Value | Who |
| :---- | :---- | :---- |
| anonymous | 1 | Public, no authentication |
| read | 2 | Any authenticated user with read access |
| write | 8 | Users with write access |
| admin | 16 | Hub administrators |
| owner | 32 | The node owner |


The permission_grant stored procedure assigns a privilege level to a specific entity (user, group, or wildcard *) on a node for a defined duration. The permission_revoke procedure removes it.

## Key Stored Procedures

MFS operations are performed **exclusively through stored procedures**. Services never run raw SQL against the media table directly. This approach eliminates risk of SQL injection and keeps application code lean, clear and easy to maintain

| Procedure | Purpose |
| :---- | :---- |
| mfs_create_node | Create a new file or folder node |
| mfs_move | Move a node to a different parent |
| mfs_copy_all | Copy a node and its children |
| mfs_trash_media | Soft-delete: move node to trash |
| mfs_restore | Restore a node from trash |
| mfs_purge | Hard-delete a node record |
| mfs_empty_trash | Permanently delete all expired trash nodes |
| mfs_manifest | Get the full recursive file list under a node |
| mfs_access_node | Check whether a user can access a given node |
| mfs_get_by | Fetch a node record by various criteria |

## Special Node IDs

A small set of negative integer node IDs are reserved by the platform for hub-level resources:

| ID | Resource |
| :---- | :---- |
| `-1` | Favicon |
| `-2` | User avatar |
| `-3` | Hub logo |

These IDs are stable across all hubs and can be used directly in service calls to retrieve or update the corresponding media assets (see `special_file()` in `server-core/lib/utils/mfs.js`). The hub wallpaper is not a special node ID — it is resolved separately from the hub's `settings.wallpaper`.

## Media Processing

When a file is uploaded, Drumee's **Generator** module converts the original into derived formats on demand. Generated files are cached alongside the original under the node's physical path; subsequent requests are served directly by Nginx via `X-Accel-Redirect` without re-entering Node.js.

| Source type | Tools used | Generated formats |
| :---- | :---- | :---- |
| Image | GraphicsMagick | vignette, preview, slide, card, thumb, webp, theme |
| Video | FFmpeg | stream (H.264), card, thumb, vignette, HLS segments |
| Audio | FFmpeg | stream (MP3), vignette, thumb, browse, slide |
| Document | LibreOffice + GraphicsMagick | PDF, vignette, thumb, card, slide, search index |

Long-running conversions (document indexing, email notifications) are offloaded to detached child processes so the HTTP response is not delayed. Results are pushed back to the client through WebSocket.

**Required host tools** for media processing:

| Tool | Purpose |
| :---- | :---- |
| GraphicsMagick (`gm`) | Image resizing and conversion |
| FFmpeg / FFprobe | Video and audio conversion |
| LibreOffice (`soffice`) | Document-to-PDF conversion |
| `pdfinfo` | PDF metadata extraction |

## Trash System

Deleted nodes are not immediately removed. They are moved to a trash_media table with a trashed_time timestamp. This allows users to restore files within a configurable expiry window. Once the expiry period passes, the expiry worker permanently deletes the physical files and purges the database record.

## Service Layer Integration

MFS services receive a resolved node via this.granted_node() or this.source_granted(). These methods perform the ACL check and return the node object only if the current user has sufficient privilege. A service never needs to check permissions manually.

```bash
async move() {
const node = this.granted_node();
// permission already checked
const pid  = this.input.need('pid');
// required: destination folder id
await this.db.await_proc('mfs_move', node.id, pid);
this.output.data({ nid: node.id }); }
```

## Security Properties

**No path exposure.** The physical path `{mfs_dir}/{VFS_ROOT_NODE}/{node_id}/` is UUID-based. It is never returned to the client and cannot be guessed.

**Directory traversal prevention.** User input never enters a filesystem path construction. All access goes through mfs_access_node before any I/O.

**Permission leaks prevented.** A user cannot access a node outside their permission scope — granted_node() rejects the request before any data operation.

**Stored procedure boundary.** All SQL is inside stored procedures. Service files contain no raw queries against MFS tables, which eliminates SQL injection paths targeting file metadata.

## SEO Integration

When a file is created or modified, Drumee can register it in the seo_index and seo_register tables. This enables the platform's internal search engine to index documents without exposing file paths. The SEO indexing pipeline runs asynchronously and does not block file operations.

