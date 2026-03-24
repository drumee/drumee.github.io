---
id: bootstrap
title: bootstrap API
sidebar_label: bootstrap
---

# BOOTSTRAP API Reference

## Module Information

**Service Files:**
- Private: `service/bootstrap.js`
- Public: `service/bootstrap.js`

**Available Services:** 8
**Documented Services:** 8

---

## bootstrap.js

Generate and return the JavaScript bootstrap bundle for the current hub. Merges runtime environment data with hub configuration, injects bundle paths (core, vendor, sprite, locale, entry), sets the Authorization header on the response, and renders the bootstrap.js.tpl template. Response is served as application/javascript.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/bootstrap.js
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `Authorization` | `string` | No | - | HTTP Authorization header. Read from the request header. Used to set keysel and propagate auth context to the rendered template. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | Rendered bootstrap JavaScript content served as application/javascript. Includes hub configuration, runtime environment, and asset bundle paths. |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | 500 | Failed to resolve runtime environment or render the bootstrap template |

---

## bootstrap.plugin

Resolve the entry point path for a named UI plugin. Searches first under the endpoint-specific plugin base directory, then falls back to the runtime plugin directory. Returns the resolved endpoint path for the plugin entry file, or an empty path if the plugin is not found.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/bootstrap.plugin
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | `string` | No | `""` | Plugin name. File extension is stripped automatically before lookup. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `path` | `string` | Resolved endpoint path to the plugin entry file. Empty string when the plugin is not found. |

---

## bootstrap.css

Generate and return the CSS font stylesheet for the current hub. Renders the fonts.tpl template and serves the result as text/css.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/bootstrap.css
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | Rendered font CSS content served as text/css |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | 500 | Failed to render the fonts template |

---

## bootstrap.dom

Generate and return the DOM bootstrap JavaScript for the current hub. Merges runtime environment data with hub configuration, injects the request host, sets the Authorization header on the response, and renders the bootstrap.dom.tpl template. Response is served as application/javascript.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/bootstrap.dom
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `Authorization` | `string` | No | - | HTTP Authorization header. Read from the request header. Used to set keysel and propagate auth context to the rendered template. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | Rendered DOM bootstrap JavaScript content served as application/javascript. Includes hub configuration, runtime environment, and the resolved request host. |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | 500 | Failed to resolve runtime environment or render the DOM bootstrap template |

---

## bootstrap.report_error

Accept and log a client-side error report. Reads the raw request payload for debug logging and responds with a plain text acknowledgement. No structured response body is returned.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/bootstrap.report_error
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `data` | `object` | No | - | Arbitrary client error payload. Logged server-side for diagnostics only; not processed or stored. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | Plain text response: OK |

---

## bootstrap.publicKey

Return the platform RSA public key in PEM format. Reads the key from /etc/drumee/credential/crypto/public.pem. Returns a fallback string if the key file does not exist.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/bootstrap.publicKey
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | PEM-encoded RSA public key, or the literal string -----NO PUBLIC KEY----- when the key file is absent. |

---

## bootstrap.getSyncTimes

Return a pair of timestamps used for client-server time synchronization. t2 is derived from the request timestamp (parsed from the incoming request), t3 is the server wall-clock time at the moment of processing.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/bootstrap.getSyncTimes
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `t2` | `number` | Timestamp extracted from the incoming request via input.timestamp() |
| `t3` | `number` | Server-side wall-clock time in milliseconds since Unix epoch (Date.now()) at the moment of processing |

---

## bootstrap.authn

Exchange an HTTP Authorization header credential for a short-lived opaque token. Generates a 22-character token, stores it via the authn_store stored procedure, and optionally includes the user OTP key in the response. For DMZ or share hub areas, the auth type is forced to guest.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | anyone |

**Endpoint:**
```
https://hostname/-/svc/bootstrap.authn
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `Authorization` | `string` | **Yes** | - | HTTP Authorization header. Read from the request header. The auth type is overridden to guest when the hub area is dmz or share. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `token` | `string` | 22-character opaque authentication token generated by uniqueId(22) and persisted via the authn_store stored procedure |
| `otp_key` | `string` | One-time-password key from the current user session. Included in the response only when the user has an otp_key set. |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authorization header is missing or malformed |
| `INTERNAL_ERROR` | 500 | Failed to persist token via authn_store procedure |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/acl-system.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
