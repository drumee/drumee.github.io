---
id: bootstrap-provisioning
title: Bootstrap & Provisioning
slug: /kernel/bootstrap-provisioning
sidebar_position: 14
description: Platform bootstrap and System MFS installation/provisioning lifecycles.
---

# Bootstrap and provisioning

Runtime schema installation, platform bootstrap, and capability provisioning are separate operations.

```mermaid
sequenceDiagram
  participant Host as Integration/control plane
  participant Runtime as server-runtime schema manifest
  participant Platform as Transitional platform bootstrap
  participant MFS as system-mfs
  participant YP as Yellow Pages
  participant Shard as Existing entity shard
  Host->>Runtime: install/upgrade intrinsic schemas
  Host->>Platform: validate then bootstrap(domain)
  Platform->>YP: install organisation table
  Platform->>YP: create org 1 + nobody/guest/system if missing
  Platform->>Platform: validate invariants; fail on conflicts
  Host->>MFS: install()
  MFS->>YP: install lifecycle tables/marker
  Host->>MFS: provision({hub_id or trusted host})
  MFS->>YP: resolve existing shard + begin provisioning
  MFS->>Shard: install manifest SQL + create root/owner permission
  MFS->>YP: finish or record failure
  MFS->>MFS: validate state and objects
```

## Platform bootstrap

The current controller is private transitional code in `transient/target/control-plane/bootstrap`; its function names are not a promised public API. Read-only validation inspects domain, organisation, configuration, principals, and authoritative privileges. Bootstrap requires a domain, rejects conflicting state before mutation, installs the organisation schema, and performs changes in a transaction.

It creates only the default organisation/domain, canonical nobody, generated guest, and generated privileged system identity. It writes `sys_conf.nobody_id` and `guest_id`. It does not create user databases or filesystem namespaces and deliberately does not restore the Team-only `public_id` alias.

Repeated execution is idempotent and preserves generated IDs. Ambiguous or incompatible existing identities fail rather than being silently repaired.

## System MFS lifecycle

System MFS first inspects/installs its Yellow Page lifecycle tables. Provisioning then resolves an existing assigned `hub` or `drumate` shard, records `provisioning`, installs package-owned SQL in manifest order, initializes one namespace root and root owner permission, and records `provisioned`. Failures record an error code.

A fully provisioned context is idempotent. Partial or conflicting shards are not automatically rebuilt. `capabilityAvailable()` reflects validated state and objects rather than entity locator fields.

Source: `transient/target/control-plane/bootstrap/lib/`, `system-mfs/lib/index.js`, `system-mfs/lib/store.js`, and both packages' tests.

