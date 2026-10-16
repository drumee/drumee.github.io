---
id: faq
title: FAQ
slug: /kernel/faq
sidebar_position: 4
description: Practical answers about Minimal Kernel use, architecture, security, licensing, and stability.
---

# Minimal Kernel FAQ

## Understanding the Kernel

### What is it?

A package-oriented backend and browser runtime plus optional system capabilities. It is application infrastructure, not the full historical Drumee product.

### Framework, runtime, operating system, or ecosystem?

In current code it is best described as a runtime and package ecosystem. “Kernel” names the architectural boundary. It does not provide a hardware OS, a complete application, or a general SSR framework.

### What is a capability?

An independently owned unit of backend services, frontend behavior, ACL, data, and tests. A module is the backend ACL/dispatch namespace; a runtime is the generic machinery that loads and executes modules/capabilities.

### Why several repositories?

To make dependency direction and release ownership executable. Backend runtime, UI runtime, MFS, Window Manager, and Finder can be installed and tested independently.

`transient` remains the integration/evidence workspace for bootstrap, backend adapters, and cross-package validation rather than the owner of extracted production code.

## Using the Kernel

### How do I start?

Choose the [explicit Debian minimal profile](/kernel/distribution/install) for
canonical enrollment, persistent local-CA HTTPS and qualified recovery. Use the
[`transient` developer harness](/kernel/getting-started/run-the-kernel) for the
smaller capability-validation path. There is no general npm-only starter.

### Which components are mandatory?

No single feature set is mandatory beyond the runtime needed by that feature. A backend-only capability can use `server-runtime`; a browser-only capability can use `ui-runtime`. Window Manager, System MFS, and Finder are optional. Finder core requires `ui-runtime` and logical MFS-compatible services. `FinderWindow` is a separate adapter and Window Manager is an optional peer.

### Can I use MFS without Finder or build without Window Manager?

Yes. MFS is usable without Finder, and Finder core works without the Window Manager adapter. Both are standalone package contracts, not only integration-harness arrangements.

### Do I have to use MFS?

No. Authentication, domain ACL, Hello, plugin loading, and push are validated without it.

## Architecture

### Why does each capability own its SQL?

Operational SQL evolves with the capability that uses it. Centralizing it in the runtime would couple unrelated releases and make “optional” capabilities intrinsic. `server-runtime` owns only Yellow Page structures needed by runtime/session/dispatch behavior; `system-mfs` owns MFS installation and shard SQL.

### How are capabilities discovered?

Backend ACL JSON registers a module and maps public/private workers. `ServiceDispatcher` resolves a `module.method`, authorizes it, and lazily loads the worker class. Frontend plugin discovery resolves a logical name through `bootstrap.plugin` to an `index.json` entry; the bundle calls `Kind.registerAddons`.

### What belongs in the Kernel?

Only reusable, application-neutral execution contracts. Product workflows, semantic events, resource policies, UI screens, and capability storage belong outside it.

## Security and hosting

### How are identity and permissions handled?

A `KernelSession` always resolves a principal for an established session. Nobody has the stable UID `ffffffffffffffff`; authenticated state remains separate from principal presence. Public fast paths, named platform authority, domain permissions and MFS
permissions are distinct authorization branches. Canonical first-human enrollment
grants remit 15 without bypassing Hub/MFS ACLs.

### How are WebSockets associated?

The client calls public `bootstrap.authn`, which ensures a `regsid` context and stores a fresh one-time authorization key (OTAK). The socket presents only the OTAK. `socket_bind` atomically claims it and returns the server-side session ID; a client-supplied socket cookie is not authoritative.

### Is it multi-tenant?

The runtime makes domain/organisation and entity scope explicit, and MFS supports existing `hub` and `drumate` shards. Current tests validate those scopes. They do not establish a turnkey tenant-management product or automatic tenant isolation for arbitrary application data.

### Can it be self-hosted, and what infrastructure is required?

The [IL-4 container profile](/kernel/distribution/install) uses Linux, Node 22,
MariaDB, Redis, Nginx, BIND9 and owned filesystem storage. Installation, real
administrator enrollment, LAN DNS/local-CA HTTPS, restart and isolated recovery
are qualified within its documented scope. It remains an explicit source-built
review profile with [operational limits](/kernel/distribution/qualification),
not a general production-support commitment or native minimal package.

## Licensing and commercial use

### What licenses were found?

`server-runtime`, `ui-runtime`, `system-mfs`, `window-manager`, and `finder` each declare `AGPL-3.0-only` in `package.json` and include an AGPLv3 license file.

Remaining `transient` integration artifacts must be evaluated from their own metadata; do not infer their terms from a different repository.

### Can I use it commercially, modify it, or redistribute it?

AGPLv3 does not prohibit commercial use, modification, or redistribution, but it imposes copyleft, source-availability, notice, and network-use obligations. Read each repository's license and obtain legal advice for your distribution and hosted-service model. This documentation is not legal advice.

### Can proprietary capabilities sit on top?

The inspected repositories do not contain an exception or a separate commercial license answering that question. Whether a capability is a separate work or is subject to AGPL obligations depends on how it combines and communicates with covered code; do not infer permission from the package boundary alone.

License sources: [server-runtime](https://github.com/drumee/server-runtime/blob/main/LICENSE), [ui-runtime](https://github.com/drumee/ui-runtime/blob/main/LICENSE), [system-mfs](https://github.com/drumee/system-mfs/blob/main/LICENSE), [window-manager](https://github.com/drumee/window-manager/blob/main/LICENSE), and [finder](https://github.com/drumee/finder/blob/main/LICENSE).

## Stability and contribution

### Is it production-ready?

The packages remain alpha releases and should be pinned exactly. IL-4 passed
integrated distribution qualification and is ready for release review, including
canonical enrollment and recovery. That scoped evidence does not establish API
stability or unrestricted production support. SMTP recovery, broader engine/schema
upgrades, source-notice review and other limits are listed in the
[qualification report](/kernel/distribution/qualification).

### Which packages are published?

Registry metadata verified on 2026-10-16 exposes all five extracted packages.
The `next` tag selects server-runtime `0.1.0-alpha.4`, ui-runtime
`0.1.0-alpha.2`, system-mfs `0.1.0-alpha.1`, Window Manager
`0.1.0-alpha.2`, and Finder `0.1.0-alpha.4`. npm retains `latest` at alpha.1
for server-runtime, ui-runtime, system-mfs, and Finder; Window Manager's
`latest` is alpha.2. Infra Layer `next` is now `0.1.0-alpha.2`, byte-identical
to the qualified candidate; its `latest` remains alpha.1. Debian uses the pinned
source revision recorded in [qualification](/kernel/distribution/qualification).
Check npm at install time because alpha tags can move.

### Where do bugs and contributions go?

Report package defects in the owning GitHub repository. Propose product-specific behavior as a capability. Propose a runtime change only when it is cross-cutting, application-neutral, and preserves standalone packaging and the [Kernel invariants](/kernel/invariants).
