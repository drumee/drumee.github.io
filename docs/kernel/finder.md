---
id: finder
title: Finder
slug: /kernel/finder
sidebar_position: 12
description: Standalone Finder composition, navigation, synchronization, transfer, media, and lifecycle contracts.
---

# `@drumee/finder`

The public [`drumee/finder`](https://github.com/drumee/finder) repository publishes [`@drumee/finder`](https://www.npmjs.com/package/@drumee/finder), the standalone optional browser capability for browsing logical MFS resources. Finder core mounts on `@drumee/ui-runtime` without Window Manager. The optional `FinderWindow` entry adapts one Finder to `@drumee/window-manager`.

```text
@drumee/ui-runtime
        ▲
        │
 @drumee/finder core

@drumee/window-manager
        ▲
        │
FinderWindow adapter
        │
        ▼
 @drumee/finder core
```

Locations and nodes use logical `{hub_id, nid}` identities. Finder never consumes database names or physical-storage identities.

## Public surface and mounting

The deliberate core exports are `Finder`, `FinderTransferPolicy`, `MediaClient`, `MfsClient`, `MfsSync`, `MfsTransferClient`, and `registerFinderKinds`. Internal rendering, selection, controller, and geometry classes are not stable public API merely because they exist in the package.

```js
const {
  MfsClient,
  MfsSync,
  registerFinderKinds
} = require("@drumee/finder");

registerFinderKinds(runtime);
const mfs_client = new MfsClient({ transport });
const mfs_sync = new MfsSync({ websocket: runtime.Websocket });

const finder = runtime.mount({
  kind: "finder",
  location: { hub_id, nid },
  mfs_client,
  mfs_sync
}, host);
```

Window-managed use is a separate entry:

```js
const {
  FinderWindow
} = require("@drumee/finder/window");

const finder_window = new FinderWindow({
  manager,
  runtime,
  finder_options
});
```

`FinderWindow` owns window lifecycle and title projection only. It owns no navigation, selection, MFS, transfer, media, or synchronization semantics. `@drumee/ui-runtime >=0.1.0-alpha.2 <0.2.0` is a peer dependency; `@drumee/window-manager` has the same range and is optional.

## Behavior and ownership boundary

Finder owns browser-side location and instance-local back/forward history, up and breadcrumb navigation, bounded listing, normal/checkbox/marquee selection, drag/drop, MOVE/COPY policy, transfer orchestration and progress presentation, media representation requests, synchronization, and reconnect reconciliation. Multiple Finder instances keep independent navigation and selection state.

Finder does not own authentication, authorization, MFS SQL, database shards, physical paths, `payload_ref`, archive paths, media conversion, FileIo, Nginx delivery, or backend transfer ownership. The backend remains authoritative for permission, node identity, transfer state, canonical content, and ancestor-cycle validation.

Normal tile click replaces selection. A checkbox toggles one item without clearing the others. A background pointer gesture begins marquee selection after a five-pixel threshold, normalizes forward or reverse geometry, and selects intersecting cached tile bounds. Full keyboard file-manager navigation, modifier/range selection, alternative list modes, large context menus, rich conflict resolution, undo, trash/restore, sharing, Team/Chat integration, Hub administration, and Desk/global ownership are not current Finder features.

## Drag, transfer, and synchronization

Drag payloads come from the source Finder's selection. Dropping into a Finder or directly onto a folder tile uses one policy:

```text
same hub      -> MOVE
different hub -> COPY
```

Same-hub MOVE is projected optimistically, then converges with the committed event by logical identity and `operation_id` without duplicate insertion. Cross-hub COPY waits for backend-assigned destination identities. Backend ACL and MFS semantics remain authoritative in both cases.

`MfsSync` consumes recipient-filtered logical create, rename, remove, move, and copy events. It routes changes to affected source, destination, visible-item, and current-folder scopes; suppresses duplicate operation echoes; and coalesces refreshes for open scopes after reconnect. Remote rename/remove/move/copy changes update current state, including selection metadata and current-folder rename handling.

## Upload: bounded control and binary data

The structured control path remains bounded:

```text
upload_start
upload_status
upload_complete
upload_abort
```

Chunk bytes use a separate path:

```text
Blob
  -> application/octet-stream
  -> ACL + transfer-owner preflight
  -> bounded streamed tempfile
  -> sparse staged upload.payload at the exact server-validated offset
  -> internal payload_ref
  -> mfs-service
  -> system-mfs canonical-content adoption
```

Binary chunks are never JSON byte arrays. The server chooses and validates chunk geometry; generic structured requests retain their size bound. Physical staging paths and `payload_ref` stay private. Transfer maps, staging, incoming tempfiles, retries, aborts, expiry, shutdown, integrity failure, and commit failure all have bounded ownership and cleanup. The client may resume from received indexes, but only the backend can adopt completed content into canonical storage.

## Download: preparation and delivery

```text
prepare
  -> authorized manifest
  -> finite offline worker
  -> filesystem staging
  -> external archive generation
  -> filesystem ZIP

retrieve
  -> runtime ACL
  -> transfer ownership/state validation
  -> FileIo
  -> X-Accel-Redirect
  -> Nginx
  -> client
```

Finder receives a logical retrieval URL and delegates it to the browser. It never receives or buffers archive bytes. A transfer ID is not an authorization credential: runtime ACL and trusted-session transfer ownership are complementary checks. Node is not the normal heavy-download data plane.

## Media representations

`media.orig` always means the original stored file. Derived outputs are requested explicitly, including preview, thumbnail, vignette, card, slide, document-derived, video, audio, and HLS master/stream/segment representations.

```text
public representation service
  -> runtime ACL
  -> logical MFS node
  -> host-filesystem abstraction
  -> representation generator when required
  -> filesystem artifact
  -> FileIo
  -> Nginx
```

Finder requests allowlisted representations for near-viewport tiles through `MediaClient`; it cannot select a generator or physical path. Node may process and rewrite small HLS `.m3u8` control artifacts. Large media payloads and HLS segments use FileIo and Nginx.

## Resource lifetime

A Finder owns its location, history, listing, selection, DOM listeners, drag/marquee gestures, preview/resize observers, file input, and per-Finder sync registration. `destroy()` is idempotent and releases those resources. Locally created upload/download controllers are cancelled and destroyed with Finder; injected controllers remain host-owned unless ownership is explicitly transferred. A shared `MfsSync` remains host-owned and has its own destruction boundary.

This component-specific cleanup is required even though the server runtime retains its generic `stop()` safeguard. The standalone [`finder` repository](https://github.com/drumee/finder) defines the package contract.

End-to-end Kernel validation evidence remains in `transient`.
