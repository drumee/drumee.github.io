---
id: callback
title: callback API
sidebar_label: callback
---

# CALLBACK API Reference

## Module Information

**Service Files:**
- Private: `service/callback.js`
- Public: `service/callback.js`

**Available Services:** 3
**Documented Services:** 3

---

## callback.stripe

Stripe webhook receiver. Validates the incoming request signature using the stripe-signature header and the configured endpoint secret, then dispatches to the appropriate handler based on the Stripe event type. Handles: invoice.paid (triggers renewal_update, quota update, success email, and live notification), invoice.payment_failed (triggers renewal_update, subscription cleanup if incomplete, failure email, and live notification), customer.subscription.created (triggers subscription_update), customer.subscription.updated (triggers subscription_update, and subscription cleanup if status is incomplete_expired), customer.subscription.deleted (triggers subscription removal, quota reset to advanced plan, live notification, invoice void if open, and expiry email).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/callback.stripe
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `stripe-signature` | `string` | **Yes** | - | Stripe webhook signature. Read from the stripe-signature HTTP request header. Used by stripe.webhooks.constructEvent to verify the payload authenticity. |
| `raw_body` | `string` | **Yes** | - | Raw unparsed request body read via input.raw(). Required by the Stripe SDK for signature verification; must not be pre-parsed as JSON. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data` | `object` | Empty object. The mysession variable is initialized as an empty object and is not populated before output. Side-effects (database updates, emails, live notifications) are the primary outcome of this endpoint. |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `WEBHOOK_ERROR` | 400 | Stripe signature verification failed or event construction failed |

---

## callback.check_out_success

Stripe checkout success callback. Retrieves the completed checkout session from Stripe using the session_id query parameter and redirects the browser to the desk payment success route with the resulting subscription_id. Response is an HTML page containing a JavaScript redirect.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/callback.check_out_success
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `session_id` | `string` | **Yes** | - | Stripe checkout session ID passed by Stripe as a query parameter on redirect. Used to retrieve the full session object including the subscription ID. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | HTML page with an inline JavaScript redirect to the desk route: #/desk/?payment=true&success=true&subscription_id=VALUE where VALUE is the subscription ID retrieved from the Stripe checkout session |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INTERNAL_ERROR` | 500 | Failed to retrieve the Stripe checkout session |

---

## callback.check_out_cancel

Stripe checkout cancellation callback. Redirects the browser to the desk payment cancelled route. Response is an HTML page containing a JavaScript redirect. No input parameters are required.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Read (2) |

**Endpoint:**
```
https://hostname/-/svc/callback.check_out_cancel
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | HTML page with an inline JavaScript redirect to the desk route: #/desk/?payment=false&cancel=true |

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
