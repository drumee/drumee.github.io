---
id: form
title: form API
sidebar_label: form
---

# FORM API Reference

## Module Information

**Service Files:**
- Private: `service/private/form.js`
- Public: `service/form.js`

**Available Services:** 4
**Documented Services:** 4

---

## form.submit

Submit a form response as an anonymous user. Reads the form schema from the node configuration file, inserts the submission into the form-specific database table (named form_NODE_ID), sends an email notification to configured backoffice recipients (owner or admin hub members), and sends an acknowledgement email to the submitter. Automatically enriches data with submission timestamp, user-agent, and geolocation if configured in the form schema.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/form.submit
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `data` | `object` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | - | Failed to read form configuration file or insert submission into database |
| `INTERNAL_ERROR` | - | Failed to send backoffice notification or acknowledgement email |

---

## form.browse

Retrieve paginated form submissions from the form-specific database table (named form_NODE_ID). Results are ordered by creation time descending, with a fixed page size of 20 records. Requires write permission on the hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Write (4) |

**Endpoint:**
```
https://hostname/-/svc/form.browse
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `integer` | No | `1` | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | - | Failed to query form submissions table |

---

## form.update

Update a single configuration field in the form node JSON file. Reads the current configuration, sets conf[name]=value if both name and value are provided, then writes the updated configuration back to the file. Requires owner permission on the hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/form.update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | No | - | - |
| `value` | `any` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | - | Failed to read or write the form configuration file |

---

## form.info

Retrieve the form configuration from the node JSON file. Returns the complete configuration object including schema, recipients, and key settings. Requires admin permission on the hub.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (6) |

**Endpoint:**
```
https://hostname/-/svc/form.info
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | - | Failed to read the form configuration file from the node MFS path |

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
