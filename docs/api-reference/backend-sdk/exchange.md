---
id: exchange
title: exchange API
sidebar_label: exchange
---

# EXCHANGE API Reference

## Module Information

**Service Files:**
- Private: `service/mfs.js`
- Public: `service/mfs.js`

**Available Services:** 2
**Documented Services:** 2

---

## exchange.server_export

Initiate a server-side export of MFS nodes to a local filesystem destination. Spawns a detached background process (offline/media/serverexport.js) to perform the export asynchronously. Progress is reported via WebSocket using the provided socket_id. The export processes all nodes in the current request context, building a granted list of hub_id and nid pairs.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/exchange.server_export
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | - |
| `destination` | `string` | **Yes** | - | - |
| `transactionid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_SOCKET_ID` | - | socket_id is required but was not provided |
| `MISSING_DESTINATION` | - | destination is required but was not provided |
| `MISSING_TRANSACTIONID` | - | transactionid is required but was not provided |
| `INTERNAL_ERROR` | - | Failed to spawn export background process |

---

## exchange.server_import

Initiate a server-side import of files from local filesystem paths into an MFS hub. Spawns a detached background process (offline/media/serverimport.js) to perform the import asynchronously. Progress is reported via WebSocket using the provided socket_id. If no recipient hub is specified, defaults to the current user hub.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | delete |

**Endpoint:**
```
https://hostname/-/svc/exchange.server_import
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | - |
| `transactionid` | `string` | **Yes** | - | - |
| `source_list` | `array` | No | `["/data/sample-1/"]` | - |
| `pid` | `string` | No | `"0"` | - |
| `recipient_id` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_SOCKET_ID` | - | socket_id is required but was not provided |
| `MISSING_TRANSACTIONID` | - | transactionid is required but was not provided |
| `INTERNAL_ERROR` | - | Failed to spawn import background process |

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
