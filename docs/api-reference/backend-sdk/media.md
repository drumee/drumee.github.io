---
id: media
title: media API
sidebar_label: media
---

# MEDIA API Reference

## Module Information

**Service Files:**
- Private: `service/private/media.js`
- Public: `service/media.js`

**Available Services:** 90
**Documented Services:** 27

---

## media.upload

Upload new file to MFS (with quota and permission checks)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |
| **Pre-check** | `pre_upload` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/media.upload
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pid` | `string` | **Yes** | - | Parent folder ID where file will be uploaded |
| `file` | `file` | **Yes** | - | File to upload (multipart/form-data) |
| `filename` | `string (max: 126)` | **Yes** | - | Original filename |
| `filesize` | `number` | No | - | File size in bytes (for quota checking) |
| `md5Hash` | `string` | No | - | MD5 hash for deduplication |
| `metadata` | `object` | No | - | Additional file metadata |
| `replace` | `number (0, 1)` | No | `0` | Replace existing file (1) or create new (0) |
| `ownpath` | `string` | No | - | Absolute path within hub (will create parent folders if not exist) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | New file node ID |
| `nid` | `string` | New file node ID (alias) |
| `filename` | `string` | Uploaded filename |
| `filesize` | `number` | File size in bytes |
| `category` | `string` | File category: image, video, audio, document, web, archive, etc |
| `extension` | `string` | File extension |
| `mimetype` | `string` | MIME type |
| `mtime` | `number` | Modification timestamp |
| `ctime` | `number` | Creation timestamp |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INSUFFICIENT_STORAGE` | 507 | Not enough storage quota |
| `PERMISSION_DENIED` | 403 | No write permission on destination folder |
| `FAILED_CREATE_FILE` | 500 | File creation failed |
| `INVALID_FILENAME` | 400 | Filename contains invalid characters |
| `OWNPATH_INCONSISTENT` | 400 | ownpath must use home_id as base |

---

## media.download

Download file from MFS

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.download
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID of file to download |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `file` | `binary` | File content stream |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NODE_NOT_FOUND` | 404 | File does not exist |
| `PERMISSION_DENIED` | 403 | No read permission |

---

## media.make_dir

Create new directory/folder in MFS

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/media.make_dir
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `dirname` | `string (max: 255)` | No | - | Directory name (use with pid). Slashes will be replaced with dashes |
| `pid` | `string` | No | - | Parent folder ID (required if using dirname) |
| `ownpath` | `string` | No | - | Absolute path within hub (alternative to dirname+pid). Will create parent folders if they don't exist |
| `metadata` | `object` | No | - | Additional folder metadata |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `nid` | `string` | New folder node ID |
| `filename` | `string` | Folder name |
| `category` | `string` | folder |
| `parent_id` | `string` | Parent folder ID |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_FILENAME` | 400 | Filename contains invalid characters (., ./, space only, etc) |
| `FAILED_CREATE_FOLDER` | 500 | Directory creation failed |
| `PERMISSION_DENIED` | 403 | No write permission |

---

## media.trash

Move file/folder to trash bin

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |
| **Pre-check** | `pre_trash` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/media.trash
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID to trash (can be array for batch operation) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array<object>` | Array of trashed items |
| `items[].id` | `string` | Node ID |
| `items[].nid` | `string` | Node ID (alias) |
| `items[].status` | `string` | New status: deleted |
| `items[].delete_time` | `number` | Timestamp when trashed |
| `args` | `object` | Changelog info |
| `args.changelog` | `object` | Change tracking data |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `PERMISSION_DENIED` | 403 | No delete permission |
| `NODE_NOT_FOUND` | 404 | Node does not exist |
| `LOCKED` | 403 | Item is locked and cannot be deleted |
| `_delete_hub` | 403 | Cannot delete hub |

---

## media.move_all

Move files/folders to different location

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |
| **Pre-check** | `pre_transact` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/media.move_all
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodes` | `array<string>` | **Yes** | - | Array of source node IDs to move |
| `dest_id` | `string` | **Yes** | - | Destination folder ID |
| `recipient_id` | `string` | No | - | Target hub ID (if moving cross-hub) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array` | Array of moved items with new locations |
| `denied_lst` | `array` | List of items that could not be moved due to permission |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `CIRCULAR_REF` | 400 | Cannot move folder into itself |
| `DESTINATION_IS_NOT_DIRECTORY` | 400 | Destination must be a folder |
| `UNABLE_TO_TRANS_INBOUND` | 403 | Cannot move inbound items |
| `WICKET_HUB` | 403 | Cannot move to wicket hub |

---

## media.copy_all

Copy files/folders to different location

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |
| **Pre-check** | `pre_transact` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/media.copy_all
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodes` | `array<string>` | **Yes** | - | Array of source node IDs to copy |
| `dest_id` | `string` | **Yes** | - | Destination folder ID |
| `recipient_id` | `string` | No | - | Target hub ID (if copying cross-hub) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array` | Array of copied items with new IDs |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INSUFFICIENT_STORAGE` | 507 | Not enough storage quota for copy |
| `your_limit_exceeded` | 507 | Your storage limit exceeded |
| `limit_exceeded` | 507 | Organization storage limit exceeded |

---

## media.rename

Rename file or folder

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.rename
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID to rename |
| `filename` | `string (min: 1, max: 255)` | **Yes** | - | New filename |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Node ID |
| `nid` | `string` | Node ID (alias) |
| `filename` | `string` | Updated filename |
| `args` | `object` | Changelog and sync info |
| `args.dest` | `object` | New node state |
| `args.src` | `object` | Old node state |
| `args.tag` | `string` | Transaction tag for sync |
| `args.changelog` | `object` | Change tracking data |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FILENAME_EXISTS` | 409 | A file with this name already exists |
| `INVALID_FILENAME` | 400 | Filename contains invalid characters |
| `UNABLE_TO_RENAME_INBOUND` | 403 | Cannot rename inbound items |

---

## media.show_bin

Get paginated list of files in trash bin

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.show_bin
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array<object>` | Array of trashed items |
| `items[].id` | `string` | Node ID |
| `items[].filename` | `string` | Filename |
| `items[].status` | `string` | deleted |
| `items[].delete_time` | `number` | Timestamp when trashed |
| `items[].category` | `string` | File category |
| `items[].filesize` | `number` | File size in bytes |

---

## media.empty_bin

Permanently delete all files from trash bin (queued background job if trash_expiry enabled)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/media.empty_bin
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | queued (if using background job) or immediate completion |
| `job_id` | `string` | Job ID if queued |
| `message` | `string` | Status message |
| `deleted_count` | `number` | Number of items permanently deleted (if immediate) |
| `freed_space` | `number` | Storage space freed in bytes (if immediate) |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FAILED_TO_QUEUE_TRASH_CLEANUP` | 500 | Failed to queue trash cleanup job |

---

## media.purge

Permanently delete specific items from trash bin

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/media.purge
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `list` | `array<string>` | No | `[]` | Array of node IDs to purge. Empty array = purge all |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array` | Array of purged node IDs |

---

## media.restore_into

Restore files/folders from trash to specified location

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |
| **Pre-check** | `pre_restore_into` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/media.restore_into
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nodes` | `array<string>` | **Yes** | - | Array of node IDs to restore |
| `dest_id` | `string` | **Yes** | - | Destination folder ID where items will be restored |
| `recipient_id` | `string` | No | - | Target hub ID (if restoring to different hub) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array` | Array of restored items with new locations |
| `denied` | `array` | Items that could not be restored due to permission |

---

## media.show_node_by

Get paginated list of files/folders with sorting

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.show_node_by
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Parent folder ID to browse |
| `page` | `number (min: 1)` | No | `1` | Page number |
| `sort` | `string (rank, date, size, sort)` | No | `"rank"` | Sort field |
| `order` | `string (asc, desc)` | No | `"asc"` | Sort direction |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array` | Array of media items |

---

## media.show_node_by_with_size

Get paginated list of files/folders with sorting (includes folder sizes)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.show_node_by_with_size
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Parent folder ID to browse |
| `page` | `number (min: 1)` | No | `1` | Page number |
| `sort` | `string (rank, date, size, sort)` | No | `"rank"` | Sort field |
| `order` | `string (asc, desc)` | No | `"asc"` | Sort direction |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array` | Array of items with calculated folder sizes |

---

## media.manifest

Get folder structure manifest (for export/import operations)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.manifest
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Root folder ID for manifest |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `nodes` | `array<object>` | Hierarchical list of all files and folders |
| `nodes[].id` | `string` | Node ID |
| `nodes[].nid` | `string` | Node ID (alias) |
| `nodes[].filename` | `string` | Filename |
| `nodes[].file_path` | `string` | Full path from root |
| `nodes[].category` | `string` | file or folder |
| `nodes[].filesize` | `number` | File size in bytes |
| `total_size` | `number` | Total size of all items in bytes |

---

## media.search_all

Unified search: filenames + indexed content from documents/images

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.search_all
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `string` | `string` | No | - | Search query string (alternative to 'query') |
| `query` | `string` | No | - | Search query string (alternative to 'string') |
| `page` | `number (min: 1)` | No | `1` | Page number for pagination |
| `limit` | `number (min: 1, max: 100)` | No | `20` | Results per page |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array<object>` | Search results ranked by relevance: exact filename match (highest) → filename contains → extension match → content match (lowest) |
| `items[].nid` | `string` | Node ID |
| `items[].filename` | `string` | Filename |
| `items[].category` | `string` | File category |
| `items[].relevance` | `number` | Relevance score |
| `items[].match_type` | `string` | filename, extension, or content |

---

## media.get_by_type

Get paginated list of files filtered by category

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.get_by_type
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | `string (image, video, audio, document, web, archive)` | No | `"image"` | File category to filter |
| `page` | `number (min: 1)` | No | `1` | Page number |
| `order` | `string (asc, desc)` | No | - | Sort direction |
| `sort` | `string (rank, date, size, sort)` | No | - | Sort field |
| `pid` | `string` | No | - | Parent folder ID (omit to search all) |
| `showAll` | `boolean` | No | - | Search all folders (ignores pid) |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `items` | `array` | Array of files matching type |

---

## media.info

Get detailed file information (type-specific: document pages, video duration, image dimensions, folder size)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.info
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID to get info |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `stats` | `object` | Basic file statistics (id, filename, category, filesize, etc) |
| `pages` | `number` | Number of pages (for documents) |
| `pdf` | `string` | Path to PDF version (for documents) |
| `duration` | `string` | Duration (for audio/video) |
| `Image` | `object` | Image metadata (geometry, format, etc) |
| `total_size` | `number` | Total size including subfolders (for folders) |
| `status` | `string` | working (PDF conversion in progress), ready, or na |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FILE_NOT_FOUND` | 404 | File does not exist or was deleted |

---

## media.get_node_attr

Get node attributes (optionally for a relative path within folder)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.get_node_attr
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID |
| `relpath` | `string` | No | - | Relative path from nid (e.g., 'subfolder/file.txt') |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `nid` | `string` | Node ID |
| `filename` | `string` | Filename |
| `category` | `string` | File category |
| `filesize` | `number` | File size in bytes |
| `mtime` | `number` | Modification timestamp |
| `permission` | `number` | User's permission level |
| `ownpath` | `string` | Absolute path within hub |

---

## media.zip

Download prepared zip file (after using download service)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.zip
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Zip ID from download service |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `file` | `binary` | Zip file stream |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FILE_NOT_FOUND` | 404 | Zip file not found or expired |

---

## media.zip_size

Get estimated zip size before creating download

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.zip_size
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID to calculate size |
| `socket_id` | `string` | **Yes** | - | WebSocket ID for checking connection |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `size` | `number` | Total size in bytes |
| `socket_bound` | `boolean` | Whether socket is connected (false = user online) |

---

## media.zip_release

Delete temporary zip file after download

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.zip_release
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Zip ID to release |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Released zip ID |

---

## media.zip_cancel

Cancel ongoing zip creation

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.zip_cancel
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `id` | `string` | **Yes** | - | Zip ID to cancel |
| `cancelId` | `string` | **Yes** | - | Process ID to kill |

### Returns

*Return structure not documented*

---

## media.save

Save text content to file (text editor function)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/media.save
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `content` | `string` | **Yes** | - | Text content to save |
| `filename` | `string` | **Yes** | - | Filename |
| `pid` | `string` | No | - | Parent folder ID (for new files) |
| `id` | `string` | No | - | Node ID (for updating existing files) |
| `metadata` | `object` | No | - | Additional metadata |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `nid` | `string` | Node ID of saved file |
| `filename` | `string` | Filename |
| `filesize` | `number` | Updated file size |

---

## media.rotate

Rotate image by specified angle

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.rotate
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Image node ID |
| `angle` | `number (90, 180, 270)` | No | `90` | Rotation angle in degrees |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `nid` | `string` | Image node ID |
| `mtime` | `number` | Updated modification timestamp |
| `metadata` | `object` | Updated metadata with new md5Hash |
| `args` | `object` | Changelog info |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `WRONG_FILETYPE` | 400 | Only image files can be rotated |

---

## media.replace

Replace existing file content with new upload

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |
| **Pre-check** | `pre_upload` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/media.replace
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID of file to replace |
| `file` | `file` | **Yes** | - | New file content |
| `filename` | `string` | **Yes** | - | New filename |
| `md5Hash` | `string` | No | - | MD5 hash of new file |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `nid` | `string` | Node ID |
| `filename` | `string` | Updated filename |
| `filesize` | `number` | Updated file size |
| `extension` | `string` | Updated file extension |
| `replace` | `number` | 1 (confirmation flag) |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `TARGET_IS_FOLDER_OR_ROOT` | 400 | Cannot replace folder or root |

---

## media.mark_as_seen

Mark file as viewed (updates notification/read status)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.mark_as_seen
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Node ID to mark as seen |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `nid` | `string` | Node ID |
| `status` | `string` | seen |

---

## media.summary

Get folder summary (total files, size, breakdown by category)

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.summary
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `nid` | `string` | **Yes** | - | Folder node ID |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `total_files` | `number` | Total number of files |
| `total_size` | `number` | Total size in bytes |
| `by_category` | `object` | Breakdown by file category |

---

## media.attributes

*Alias for [`get_node_attr`](#mediaget_node_attr)*

---

## media.audio

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.audio
```

---

## media.best

*Alias for [`webp`](#mediawebp)*

---

## media.broadcast

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/media.broadcast
```

---

## media.browse

*Alias for [`show_node_by`](#mediashow_node_by)*

---

## media.browse_by

*Alias for [`show_node_by`](#mediashow_node_by)*

---

## media.card

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.card
```

---

## media.check_media_child_exist

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/media.check_media_child_exist
```

---

## media.list_server_files

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.list_server_files
```

---

## media.create_server_dir

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.create_server_dir
```

---

## media.check_media_root_exist

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/media.check_media_root_exist
```

---

## media.clear_notifications

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.clear_notifications
```

---

## media.comment

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.comment
```

---

## media.copy

*Alias for [`copy_all`](#mediacopy_all)*

---

## media.toPdf

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.toPdf
```

---

## media.folder

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.folder
```

---

## media.get_all

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.get_all
```

---

## media.get_filenames

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/media.get_filenames
```

---

## media.get_lock

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/media.get_lock
```

---

## media.get_node_info

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.get_node_info
```

---

## media.get_node_stat

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.get_node_stat
```

---

## media.get_path

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.get_path
```

---

## media.get_root_conflict

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.get_root_conflict
```

---

## media.home

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.home
```

---

## media.is_expired

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.is_expired
```

---

## media.lock

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/media.lock
```

---

## media.link

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/media.link
```

---

## media.make_dir_special

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/media.make_dir_special
```

---

## media.move

*Alias for [`move_all`](#mediamove_all)*

---

## media.node_info

*Alias for [`get_node_attr`](#mediaget_node_attr)*

---

## media.ogv

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.ogv
```

---

## media.orig

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.orig
```

---

## media.preview

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.preview
```

---

## media.page

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.page
```

---

## media.pdf

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.pdf
```

---

## media.raw

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.raw
```

---

## media.read

*Alias for [`pdf`](#mediapdf)*

---

## media.remove_comment

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.remove_comment
```

---

## media.reorder

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.reorder
```

---

## media.relocate

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |
| **Pre-check** | `pre_transact` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/media.relocate
```

---

## media.server_export

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.server_export
```

---

## media.server_import

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.server_import
```

---

## media.set_homepage

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/media.set_homepage
```

---

## media.share

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/media.share
```

---

## media.sharebox_home

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/media.sharebox_home
```

---

## media.show_folders

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.show_folders
```

---

## media.show_new

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/media.show_new
```

---

## media.show_slides

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.show_slides
```

---

## media.slide

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.slide
```

---

## media.slurp

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/media.slurp
```

---

## media.style

*Alias for [`stylesheet`](#mediastylesheet)*

---

## media.stylesheet

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.stylesheet
```

---

## media.thumb

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.thumb
```

---

## media.update_caption

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.update_caption
```

---

## media.update_status

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/media.update_status
```

---

## media.upload_base64

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |
| **Pre-check** | `pre_upload` (validation before execution) |

**Endpoint:**
```
https://hostname/-/svc/media.upload_base64
```

---

## media.video

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.video
```

---

## media.view

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.view
```

---

## media.vignette

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.vignette
```

---

## media.webp

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.webp
```

---

## media.xl

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/media.xl
```

---

## media.dmz_copy

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/media.dmz_copy
```

---

## media.dmz_detail

*No description provided*

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/media.dmz_detail
```

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
