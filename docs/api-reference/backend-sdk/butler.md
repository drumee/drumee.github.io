---
id: butler
title: butler API
sidebar_label: butler
---

# BUTLER API Reference

## Module Information

**Service Files:**
- Private: `service/butler.js`
- Public: `service/butler.js`

**Available Services:** 26
**Documented Services:** 12

---

## butler.check_domain

Check if a domain is associated with an organization. Validates domain, retrieves organization details, hub information, and user data. Used for organization-specific login flows and domain verification.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.check_domain
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `domain` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## butler.check_token

Validate a token (used for password reset, email verification, etc.). Checks token validity and returns associated metadata. Also generates a unique identifier suggestion based on the email address.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.check_token
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `secret` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_LINK` | - | Token is invalid or malformed |
| `LINK_EXPIRES` | - | Token has expired or is not active |

---

## butler.complete_signup

Complete the signup process. Final step in multi-stage registration flow to finalize account creation.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.complete_signup
```

---

## butler.get_reset_token

Generate and send a password reset token via email. Creates a secret token and emails it to the user for password reset flow. Token is valid for 12 hours.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.get_reset_token
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_EMAIL_FORMAT` | - | Email format is invalid |
| `USER_NOT_FOUND` | - | No user found with this email (returns empty object for security) |

---

## butler.hello

Get geographic IP information for the current request. Uses geoip-lite to lookup location data based on client IP address. Useful for localization and analytics.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.hello
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## butler.ping

Health check endpoint. Returns visitor information and debug data. Used for testing server connectivity and basic functionality.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.ping
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `note` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## butler.unsubscribe

Unsubscribe an email from mailing list. Updates the emailing table to mark the email as unsubscribed.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.unsubscribe
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## butler.set_pass_phrase

Set new password through reset link. Validates the reset token and updates user password. Token must be used within 12 hours and is deleted after successful password change.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.set_pass_phrase
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `secret` | `string` | **Yes** | - | - |
| `id` | `string` | **Yes** | - | - |
| `password` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BAD_PASSWORD` | - | Password does not meet requirements |
| `USER_NOT_FOUND` | - | User does not exist |
| `TOKEN_EXPIRED` | - | Reset token expired (older than 12 hours) |

---

## butler.signup

Create a new Drumee account. Validates socket binding, checks for existing user, creates account schema from pool, and automatically logs in the new user. Sends welcome email upon successful signup.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/butler.signup
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `socket_id` | `string` | **Yes** | - | - |
| `password` | `string` | **Yes** | - | - |
| `email` | `string` | **Yes** | - | - |
| `firstname` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NOT_BOUND` | - | Socket ID not bound to session |
| `USER_EXISTS` | - | Email already registered |
| `SERVER_BUSY` | - | No available schema pools |
| `SERVER_ERROR` | - | Database or internal error during signup |

---

## butler.google_auth

Initiate Google OAuth authentication flow. Redirects user to Google login page for authorization.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.google_auth
```

---

## butler.google_callback

Handle Google OAuth callback. Processes authorization code from Google and completes authentication or signup.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.google_callback
```

---

## butler.b2b_signup_company

B2B signup step 1: Collect company information. First step in business account registration flow.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.b2b_signup_company
```

---

## butler.b2b_signup_password

B2B signup step 2: Set account password. Create password for business account after company info provided.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/butler.b2b_signup_password
```

---

## butler.b2b_signup_personaldata

B2B signup step 3: Collect personal data. Gather user's personal information for business account.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.b2b_signup_personaldata
```

---

## butler.b2b_signup_otpverify

B2B signup step 4: Verify OTP code. Validate one-time password sent via SMS to complete B2B registration.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.b2b_signup_otpverify
```

---

## butler.b2b_signup_otpresend

B2B signup: Resend OTP code. Request a new one-time password if previous code expired or not received.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.b2b_signup_otpresend
```

---

## butler.b2c_signup_skip_otpverify

B2C signup: Skip OTP verification. Allow user to complete registration without SMS verification.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.b2c_signup_skip_otpverify
```

---

## butler.b2c_signup_password

B2C signup: Set account password. Create password for consumer account during registration.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |
| **Logging** | Enabled |

**Endpoint:**
```
https://hostname/-/svc/butler.b2c_signup_password
```

---

## butler.b2c_signup_otpverify

B2C signup: Verify OTP code. Validate one-time password sent via SMS to complete consumer registration.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.b2c_signup_otpverify
```

---

## butler.get_otp

Get OTP (One-Time Password) code. Generates and sends OTP via SMS to the user's registered mobile number. Used for two-factor authentication.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/butler.get_otp
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `SMS_SEND_FAILED` | - | Failed to send SMS (invalid receiver or SMS service error) |

---

## butler.b2c_signup_otpresend

B2C signup: Resend OTP code. Request a new one-time password if previous code expired or not received.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.b2c_signup_otpresend
```

---

## butler.set_password

Set password in forgot password flow. Part of multi-step password reset process. Validates token, sets new password, and either sends OTP for verification or auto-logs in user based on OTP settings.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.set_password
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `secret` | `string` | **Yes** | - | - |
| `password` | `string` | **Yes** | - | - |
| `id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BAD_PASSWORD` | - | Password does not meet requirements |
| `DRUMATE_NOT_EXISTS` | - | User does not exist |
| `INVALID_SECRET` | - | Token is invalid or expired |
| `INVALID_METHOD` | - | Token method is not forgot_password |
| `INVALID_STEP` | - | Token step is not 'password' |

---

## butler.password_otpverify

Verify OTP code for password reset flow. Final step in forgot password with OTP. Validates OTP code, marks email and mobile as verified, logs in user, and completes the password reset process.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.password_otpverify
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `secret` | `string` | **Yes** | - | - |
| `code` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_SECRET` | - | Token is invalid or expired |
| `INVALID_METHOD` | - | Token method is not forgot_password |
| `INVALID_STEP` | - | Token step is not 'otpverify' |
| `INVALID_OTP` | - | OTP code is incorrect (step changes to 'otpresend' for retry) |

---

## butler.password_otpresend

Resend OTP code for password reset. Generates a new OTP and sends it via SMS. Used when user doesn't receive the first OTP or it expires.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.password_otpresend
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `secret` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_SECRET` | - | Token is invalid or expired |
| `INVALID_METHOD` | - | Token method is not forgot_password |
| `INVALID_STEP` | - | Token step must be 'otpresend' or 'otpverify' |

---

## butler.transferbox_files_send

Send files via transferbox. Transfer files to external recipients without requiring them to have Drumee accounts.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.transferbox_files_send
```

---

## butler.transferbox_files_delete

Delete files from transferbox. Remove previously sent files from transferbox storage.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Anonymous (0) |

**Endpoint:**
```
https://hostname/-/svc/butler.transferbox_files_delete
```

---

## Related Documentation

- [ACL System](/concepts/acl-system.md) - Permission model
- [Service Routing](/concepts/service-routing.md) - URL patterns
- [Error Handling](/guides/error-handling.md) - Error codes
