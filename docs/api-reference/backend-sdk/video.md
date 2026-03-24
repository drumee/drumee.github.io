---
id: video
title: video API
sidebar_label: video
---

# VIDEO API Reference

## Module Information

**Service Files:**
- Private: `service/video.js`
- Public: `service/video.js`

**Available Services:** 3
**Documented Services:** 3

---

## video.master

Serve the HLS master playlist for a video node. Resolves the node's filesystem root and checks whether master.m3u8 already exists. When it does not, spawns an ffmpeg HLS transcode process in the background using Generator.create_hls_args. Waits up to 30 seconds for the file to appear, then streams the playlist content with each stream or segment line optionally appended with a keysel query parameter derived from the request authorisation token. Responds with Content-Type application/x-mpegURL.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/video.master
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FILE_NOT_FOUND` | - | The master.m3u8 file did not appear within 30 seconds of the ffmpeg transcode being spawned |

---

## video.segment

Serve a single HLS transport stream segment file. Resolves the segment path as stream-SERIAL/segment-SEG.ts under the node's filesystem root. Serves the file as video/MP2T when it exists on disk, otherwise returns a not-found response. Does not wait for transcoding — the segment must already be present.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/video.segment
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `serial` | `string` | **Yes** | - | - |
| `segment` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FILE_NOT_FOUND` | - | The resolved segment file does not exist on the server filesystem |

---

## video.stream

Serve an HLS stream-level playlist for a specific quality level. Resolves the playlist file at stream-SERIAL/playlist.m3u8 under the node's filesystem root. Waits up to 30 seconds for the file to appear, then streams the playlist content with each stream or segment line optionally appended with a keysel query parameter derived from the request authorisation token. Responds with Content-Type application/x-mpegURL.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/video.stream
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `serial` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FILE_NOT_FOUND` | - | The stream playlist file did not appear within 30 seconds of being requested |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
