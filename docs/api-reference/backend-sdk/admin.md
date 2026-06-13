---
id: admin
title: admin API
sidebar_label: admin
---

# ADMIN API Reference

## Module Information

**Service Files:**
- Private: `service/private/admin.js`

**Available Services:** 30
**Documented Services:** 30

---

## admin.member_stats

Return aggregate member statistics for the caller's domain: total members, active members, frozen members, and pending invites. Reads from member_list_stats SP scoped to the caller's domain_id.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.member_stats
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

## admin.member_list_workspaces

List all workspaces (hubs) a specific member belongs to within the caller's domain, including their permission level per workspace.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.member_list_workspaces
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.member_list_workspace_admins

List all members in the domain who have admin-level permission (permission &gt;= 31) in at least one workspace. Aggregates across all hubs in the domain via hub_get_workspace_admins.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.member_list_workspace_admins
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.member_save_workspace_roles

Save per-workspace privilege assignments for a member. Iterates over the assignments array and calls permission_grant on each target hub DB with the specified privilege value. Existing permission row is replaced (REPLACE INTO semantics from permission_grant).

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.member_save_workspace_roles
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | - |
| `assignments` | `array` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.member_device_list

List all registered devices for a specific member. Returns device records from the yp.device table.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.member_device_list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.member_device_remove

Remove a specific registered device for a member. Calls member_device_remove SP with uid and device_id.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.member_device_remove
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | - |
| `device_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.member_device_remove_all

Remove all registered devices for a member. Calls member_device_remove_all SP with uid.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.member_device_remove_all
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.member_set_workspace_admin

Grant admin-level permission (permission=31) to a member in a specific workspace by calling permission_grant on the hub DB with resource_id='*', assign_via='system'. Replaces any existing permission row for that member in the hub.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.member_set_workspace_admin
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | - |
| `hub_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.member_remove_workspace_admin

Downgrade a workspace admin back to Edit-level permission (permission=7) in a specific workspace by calling permission_grant on the hub DB. Does not remove membership, only reduces privilege.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.member_remove_workspace_admin
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `uid` | `string` | **Yes** | - | - |
| `hub_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.get_audit_logs

Return paginated audit log entries across all hubs in the domain plus a real total count. Iterates over every hub DB in the domain, calls hub_get_audit_logs_filtered per hub for the page slice, sums hub_get_audit_logs_count for the total, merges and sorts results by ctime descending, then returns one page of 20 entries inside a \{data, total, page, page_size\} envelope. Known limitation: only fetches page 1 from each hub before merging, so entries beyond page 1 of any single hub may be omitted from the merged page (count is still accurate).

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_audit_logs
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | `string` | No | - | - |
| `from_time` | `integer` | No | - | - |
| `to_time` | `integer` | No | - | - |
| `page` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.export_audit_logs

Export the full unfiltered audit log (no pagination) across all hubs in the domain. Same aggregation logic as get_audit_logs but returns all matching entries sorted by ctime descending. Intended for CSV export on the client side.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.export_audit_logs
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `username` | `string` | No | - | - |
| `from_time` | `integer` | No | - | - |
| `to_time` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.get_hub_audit_logs

Return paginated audit log entries for a specific workspace hub (hub-scoped). Reads from yp.mfs_changelog filtered by hub_id. Supports date range and username filters.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_hub_audit_logs
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `username` | `string` | No | - | - |
| `from_time` | `integer` | No | - | - |
| `to_time` | `integer` | No | - | - |
| `page` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.get_audit_stats

Return summary statistics for the Audit Logs tab header cards. security_score is still a placeholder (hardcoded 94) pending a real scoring model. high_risk_count is now real: sum of action_log entries in the time range whose category is 'admin'/'permission' or whose action is grant_access/change_policy/share_link/removed, aggregated across every hub in the domain via hub_count_high_risk_actions. storage_used_bytes is real: sum of yp.entity.space for all active hubs.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_audit_stats
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `from_time` | `integer` | No | - | - |
| `to_time` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.get_org_storage_stats

Return a per-hub storage breakdown for the domain. Lists all active hubs belonging to the caller's domain with their used storage in bytes and megabytes. Reads yp.entity.space for each hub.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_org_storage_stats
```

### Parameters

*No parameters*

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.get_org_user_storage

Return a paginated, sortable list of members in the domain with their individual storage usage, plus a real total count. Joins yp.drumate, yp.privilege, and yp.entity (type=drumate) to compute per-user used bytes. Returns an envelope \{data, total, page, page_size\} so the FE can render an honest paginator. Total is sourced from get_org_user_storage_count.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_org_user_storage
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sort_by` | `string` | No | - | - |
| `page` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.hub_member_list

Return a paginated list of members in a specific workspace hub with their hub-level permission, role label, and online status. Role label is derived from permission value: HUB_OWNER (&gt;=63), HUB_ADMIN (&gt;=31), MEMBER (&lt;31). Online status is resolved from yp.socket.state='active'.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.hub_member_list
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `role` | `string` | No | - | - |
| `page` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |
| `items` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.hub_member_stats

Return summary stat cards for the Workspace Admin Member tab: total members, admins (permission &gt;= 31), external guests (domain_id differs from hub domain), and pending invites (placeholder 0 for Round 1).

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.hub_member_stats
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.hub_member_remove

Remove a member from a specific workspace hub by deleting their permission row (resource_id='*') and logging a removed action via hub_add_action_log.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.hub_member_remove
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `uid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.get_workspace_overview

Return a domain-wide list of all workspaces visible to the calling user. Requires hub_id for scope:hub permission check but returns all workspaces the caller has admin access to in the domain via get_workspace_overview SP.

| Property | Value |
|----------|-------|
| **Scope** | Domain (requires authentication) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_workspace_overview
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

*Error codes not documented*

---

## admin.get_hub_folders

List folders within a specific workspace for the Permission tab. Calls hub_list_folders to return folder/hub nodes. Defaults to the hub root if node_id is not provided. When query is non-empty, searches by user_filename across the whole workspace and drops the parent_id constraint.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_hub_folders
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `node_id` | `string` | No | - | - |
| `page` | `integer` | No | - | - |
| `query` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.get_folder_permissions

Get the full permissions configuration for a folder: auto revocation settings, one-time link config, member access list with privilege levels, and device access settings. Calls folder_get_permissions SP on the hub DB.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_folder_permissions
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.save_folder_permissions

Save (upsert) the full permissions configuration for a folder. Accepts the config as a JSON object or JSON string and calls folder_save_permissions SP on the hub DB.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.save_folder_permissions
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |
| `config` | `object` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.generate_folder_otl

Generate a one-time link token for a folder. Calls folder_generate_otl SP on the hub DB with the folder nid and the caller uid. Returns the generated token data.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.generate_folder_otl
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.revoke_folder_otl

Revoke the existing one-time link for a folder. Calls folder_revoke_otl SP on the hub DB with the folder nid.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.revoke_folder_otl
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.get_hub_storage_stats

Return storage statistics for a specific workspace hub. Calls get_hub_storage_stats SP on the hub DB passing hub_id.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_hub_storage_stats
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.get_hub_user_storage

Return a paginated, sortable list of hub members with their individual storage usage within the hub. Calls get_hub_user_storage SP on the hub DB.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_hub_user_storage
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `sort_by` | `string` | No | - | - |
| `page` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.get_file_versions

Return a paginated list of files that have version history in a specific hub. Calls file_version_list SP on the hub DB. Optional search filters by filename.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_file_versions
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `search` | `string` | No | - | - |
| `page` | `integer` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.get_file_version_detail

Return the full version history for a specific file. Calls file_version_get SP on the hub DB. Returns two result sets: file base info and ordered version list (newest first).

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.get_file_version_detail
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.delete_file_old_versions

Delete all non-active (old) versions for a specific file, or for all files in the hub if nid is omitted. Calls file_version_delete_old SP on the hub DB.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.delete_file_old_versions
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | No | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `properties` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## admin.download_file_versions

Return the list of downloadable paths or URLs for all versions of a specific file. Calls file_version_download SP on the hub DB.

| Property | Value |
|----------|-------|
| **Scope** | Hub (requires hub context) |
| **Permission** | Admin (16) |

**Endpoint:**
```
https://hostname/-/svc/admin.download_file_versions
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `hub_id` | `string` | **Yes** | - | - |
| `nid` | `string` | **Yes** | - | - |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `type` | `any` | - |
| `description` | `any` | - |

### Possible Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `HUB_NOT_FOUND` | - | - |

---

## Related Documentation

- [ACL System](../../technology/02-acl-system.md) - Permission model
- [ACL Specification](../acl-spec.md) - Scope, permission and routing reference
- [Request Pipeline](../../technology/06-request-pipeline.md) - How requests are routed
- [Error Handling](../../product-guides/05-error-handling.md) - Error codes
