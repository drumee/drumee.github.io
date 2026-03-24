---
id: subscription
title: subscription API
sidebar_label: subscription
---

# SUBSCRIPTION API Reference

## Module Information

**Service Files:**
- Private: `service/private/subscription.js`

**Available Services:** 10
**Documented Services:** 10

---

## subscription.invoice

Get paginated invoice/renewal history for the current user. Calls renewal_history_get stored procedure with the user ID and page number.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.invoice
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

### Possible Errors

*Error codes not documented*

---

## subscription.get_plans

Get available subscription plans and renewal status for the current user or their organisation. For non-domain users (domain_id=1) returns personal plans. For domain members checks that the user has at least dom_admin_member privilege, then retrieves plans for the organisation entity. Each plan has plan_detail and metadata parsed from JSON. Also returns the current renewal record, using a Stripe test clock frozen time if test clocks are enabled.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.get_plans
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
| `NOT_ENOUGH_PRIVILEGE` | - | User does not have sufficient domain admin privilege to view organisation plans |

---

## subscription.new

Create a new Stripe checkout session for a Pro subscription. Looks up or creates the Stripe customer for the current user, checks for an existing subscription (cancels incomplete ones, blocks active ones), finds or creates the Stripe product and price for the requested period, then creates a Stripe checkout session in subscription mode. Returns the session object for frontend redirect. Plan is always 'pro', recurring is always 1.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.new
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `ACTIVE_SUBSCRIPTION` | - | User already has an active subscription |

---

## subscription.update

Update an existing Stripe subscription to a different billing period. Looks up the Stripe customer and their current subscription, finds or creates the Stripe price for the new period, then updates the subscription with proration behavior 'create_prorations'. Plan is always 'pro', recurring is always 1.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.update
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_SUBSCRIPTION` | - | No active Stripe subscription found for the current user |

---

## subscription.cancel

Schedule cancellation of the current Stripe subscription at period end. Sets cancel_at_period_end=true on the Stripe subscription and updates the internal renewal record via renewal_cancel_next. Does not immediately cancel; subscription remains active until the current period ends. Returns the full invoice and subscription state plus the updated renewal record.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.cancel
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
| `NO_COUSTOMER` | - | No Stripe customer found for the current user |
| `NO_SUBSCRIPTION` | - | No Stripe subscription found for the customer |
| `DARFT_INVOICE` | - | Cannot cancel while the latest invoice is in draft state |

---

## subscription.init

Initialize Stripe product and price records for all plans in the database. Fetches all products from product_get_stripe, ensures the 'pro' Stripe product exists (creates it if not), then for each product ensures a matching Stripe price exists with the correct unit_amount, period, recurring, and metadata. Returns the full list of products from the database.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.init
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## subscription.active

Reactivate a subscription that was previously scheduled for cancellation. Sets cancel_at_period_end=false on the Stripe subscription and calls renewal_active to restore the internal renewal record. Returns the updated subscription and renewal state.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.active
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
| `NO_COUSTOMER` | - | No Stripe customer found for the current user |
| `NO_SUBSCRIPTION` | - | No Stripe subscription found for the customer |

---

## subscription.proration

Preview the proration cost of switching the current subscription to a different billing period. Retrieves an upcoming invoice from Stripe with the new price applied to calculate the proration charge. Returns both the invoiceitem (proration amount) and subscription line items from the upcoming invoice. Uses test clock frozen time if Stripe test clocks are enabled.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.proration
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NO_CUSTOMER` | - | No Stripe customer found for the current user |
| `NO_SUBSCRIPTION` | - | No Stripe subscription found for the customer |

---

## subscription.payment_status

Get the payment status of a specific subscription for the current user. Calls the payment_status stored procedure with the user ID and subscription ID.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.payment_status
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `subscription_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## subscription.update_clock

Update a Stripe test clock state. Used for Stripe test clock management during development and testing. Calls update_stripe_clock stored procedure.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Owner (7) |

**Endpoint:**
```
https://hostname/-/svc/subscription.update_clock
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## Related Documentation

- [ACL System](docs/concepts/acl-system.md) - Permission model
- [Service Routing](docs/concepts/service-routing.md) - URL patterns
- [Error Handling](docs/guides/error-handling.md) - Error codes
