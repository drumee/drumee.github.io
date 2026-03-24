---
id: dmz
title: dmz API
sidebar_label: dmz
---

# DMZ API Reference

## Module Information

**Service Files:**
- Private: `service/dmz.js`
- Public: `service/dmz.js`

**Available Services:** 5
**Documented Services:** 5

---

## dmz.info

Retrieve DMZ share link metadata for a given token. Calls the dmz_info_next stored procedure and injects the platform guest_id into the response. Sets status to WRONG_TICKET when the token is not found, or REQUIRED_PASSWORD when the share requires a password.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/dmz.info
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | DMZ share token to look up via the dmz_info_next stored procedure |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Present only when an error condition is detected. WRONG_TICKET when the token does not exist; REQUIRED_PASSWORD when the share requires password authentication. |
| `guest_id` | `string` | Platform guest user ID injected from Cache.getSysConf(guest_id) |
| `hub_id` | `string` | Hub ID of the shared resource, as returned by dmz_info_next |
| `nid` | `string` | MFS node ID of the shared resource, as returned by dmz_info_next |
| `require_password` | `number` | Flag indicating whether the share link requires password authentication |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | token is required |

---

## dmz.login

Authenticate and retrieve access information for a DMZ share link. Validates the token via dmz_info_next, optionally authenticates a side user from the regsid cookie, retrieves hub-level DMZ settings, and checks node access privilege. When the share requires a password and none is provided, returns REQUIRED_PASSWORD status. On password submission, attempts dmz_login and returns WRONG_PASSWORD or TICKET_OK accordingly. Returns merged user and share info on success.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/dmz.login
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | DMZ share token to authenticate against |
| `password` | `string` | No | - | Password for the share link. Required only when the share has require_password set and the caller has not yet been granted node access privilege. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `status` | `string` | Authentication status. TICKET_INVALID when the token does not exist; REQUIRED_PASSWORD when a password is needed; WRONG_PASSWORD when the submitted password is incorrect; TICKET_OK on success. |
| `uid` | `string` | User ID resolved from the session or the side user cookie |
| `guest_id` | `string` | Guest user ID of the share owner as stored in dmz_info_next |
| `area` | `string` | Hub area from the current hub context |
| `is_guest` | `boolean` | True when the share owner is the platform guest user |
| `require_pwd` | `number` | Alias of require_password from the DMZ info record. Set to 0 on successful password authentication. |
| `hours` | `number` | DMZ expiry hours from hub-level DMZ settings, when present |
| `days` | `number` | DMZ expiry days from hub-level DMZ settings, when present |
| `require_name` | `number` | Set to 1 for public shares when the guest has no guest_name set |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | token is required |

---

## dmz.logout

Terminate the current DMZ session by calling session.dmz_logout. No response body is returned.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/dmz.logout
```

### Parameters

*No parameters*

### Returns

*Return structure not documented*

---

## dmz.reset_sessions

Force-logout all current members of the DMZ hub. Retrieves the full recipient list via dmz_notify_list and calls session_logout_by_admin for each member. Returns the full list of members whose sessions were reset.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/dmz.reset_sessions
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `members` | `array<object>` | List of member records whose sessions were reset, as returned by dmz_notify_list |
| `members[].recipient_id` | `string` | User ID that was logged out via session_logout_by_admin |

---

## dmz.signup

Initiate the signup flow for a user invited via a DMZ share link. Validates the token via dmz_info_next, verifies the guest session cookie, checks that the email is not already registered, generates a signup token, sends an activation email with a link to the signup page, and updates the token metadata with the share hub context. Returns an object containing the signup link on success, or a status string indicating the failure reason.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/dmz.signup
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `token` | `string` | **Yes** | - | DMZ share token used to look up the invitation record via dmz_info_next |
| `socket_id` | `string` | No | - | Socket ID of the requesting client. Used alongside the session cookie in the cookie_check_guest verification step. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `link` | `string` | Signup activation URL in the format: homepath + #/welcome/signup/TOKEN. Present only on success. |
| `status` | `string` | Error status. Present only when signup cannot proceed. |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MISSING_PARAM` | 400 | token is required |

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
