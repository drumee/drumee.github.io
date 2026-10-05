---
id: invariants
title: Kernel Invariants
slug: /kernel/invariants
sidebar_position: 16
description: Architectural invariants future Minimal Kernel changes must preserve.
---

# Kernel invariants

| Invariant | Guarantee and reason | Regression example |
|---|---|---|
| Established session identity is defined. | Runtime work always has a principal; anonymous maps to canonical nobody. | Accepting or persisting an active cookie with null UID. |
| Nobody is stable and distinct. | `ffffffffffffffff` represents anonymous identity; guest/system are separate provisioned principals. | Aliasing guest to nobody or generating a new nobody ID. |
| Principal presence is not authentication. | OTP, guest, nobody, and signed-in state remain distinguishable. | Treating every non-null UID as authenticated. |
| Authentication, authorization, and transport association are separate. | A socket or session does not grant a business privilege. | Requiring domain privilege for `bootstrap.authn`, or treating OTAK binding as ACL grant. |
| Domain/entity scope remains explicit. | Authorization and storage operate against declared domains and logical `{hub_id,nid}` resources. | Trusting client UID or physical `db_name`. |
| Authorization fails closed. | Missing adapters, resources, scopes, or required bits deny access. | Dispatching when an MFS permission backend is absent. |
| Server runtime owns only intrinsic runtime SQL. | Optional capabilities remain optional and independently versioned. | Adding MFS tree tables to the runtime manifest. |
| Capabilities own operational SQL. | Code and data contracts ship/release together. | Central migration directory changing a capability schema out of band. |
| Capabilities communicate through explicit contracts. | Standalone packages remain auditable and installable. | Hidden imports from siblings, `target/**`, parent modules, or historical Team code. |
| UI capabilities do not depend on historical Desk globals. | `Kind.registerAddons`, LETC parts, and State remain the composition seam. | Restoring global `KIND`/Desk ownership. |
| Session authorization remains private transport state. | Widgets cannot read or wrap raw `regsid`. | Publishing it on runtime options/model/DOM. |
| WebSocket connection uses a fresh OTAK and atomic claim. | A short-lived credential binds the server-selected session without exposing `regsid` in the URL. | Accepting a socket cookie as authority or pre-reading then deleting the token. |
| Recipient-specific permissions survive synchronization. | Each pushed MFS event is projected for its recipient. | Broadcasting one privileged node projection to all sockets. |
| Large binary data avoids bounded JSON control requests. | Memory use and authorization stay bounded. | Serializing file bytes into arrays in `upload_chunk`. |
| Physical storage references stay internal. | Clients use logical resource identities and cannot select host paths. | Returning `payload_ref`, tempfile, `storage_ref`, or shard locators. |
| Availability is explicit lifecycle state. | Optional capabilities are used only after validated installation/provisioning. | Inferring MFS readiness from `entity.home_dir`. |
| Extracted packages remain independently testable. | Package boundaries are real rather than repository-layout assumptions. | A package that only works with `NODE_PATH` or sibling sources. |

These are backed by package artifact tests, authorization tests, schema tests, and the Phase 4.x integration tests. A change that intentionally revises an invariant should update its tests and architecture documentation in the same review.
