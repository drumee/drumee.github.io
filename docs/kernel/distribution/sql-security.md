---
id: sql-security
title: SQL Privilege Separation
slug: /kernel/distribution/sql-security
sidebar_position: 3
description: Actual schema, bootstrap, enrollment, provisioner and runtime grants, DEFINER semantics and real denial tests.
---

# SQL privilege separation

Policy source: `profiles/minimal-kernel/lib/sql-policy.js`, derived from the pinned
runtime, platform bootstrap, KB-01B, HubLifecycle and system-mfs statements.
All accounts and passwords are created/projected by Infra Layer. Debian supplies
application grants through the verified owned engine's local root socket. No root
credential or socket is mounted in the ordinary kernel or private provisioner.

| Principal | Actual scope | Projection and boundary |
|---|---|---|
| Infrastructure administrator | Engine/account administration, scoped grant installation, cold backup | Infra Layer owned database socket only; no published SQL port |
| `kernel_schema` | CREATE/ALTER/DROP/INDEX, CREATE/ALTER ROUTINE, EXECUTE and table SELECT/INSERT/UPDATE/DELETE on `yp.*`; no global administrative grant | Schema initialization/migration jobs only; owns Yellow Page routine DEFINERs |
| `kernel_bootstrap` | CREATE/SELECT/INSERT on organisation; SELECT/INSERT on domain/sys_conf/entity/drumate/privilege; EXECUTE uniqueId | Canonical reserved-platform bootstrap job only |
| `kernel_enrollment` | SELECT on domain/sys_conf/organisation/entity/drumate/privilege; INSERT entity/drumate/privilege; UPDATE drumate(remit); SELECT/UPDATE initial_operator_enrollment; uniqueId EXECUTE; read-only mysql.proc | KB-01B enrollment job only; no transport, schema or account creation |
| `kernel_provisioner` | Named-table observation; Hub lifecycle/plan/capability/MFS provisioning INSERT and exact UPDATE columns; Hub ACL DELETE; entity INSERT and UPDATE(status,mtime); scoped shard DDL/DML/routines and namespace GRANT OPTION | Separate private service. No direct transport, drumate/privilege/enrollment writes; no infrastructure-account creation |
| `kernel_runtime` | SELECT on the named Yellow Page runtime/ACL/MFS registry tables; DELETE on authn for expiry; exact intrinsic function/procedure EXECUTE; exact provisioned-shard media/permission SELECT and manifest routine EXECUTE | Ordinary kernel only; no direct cookie/socket writes, DBA, schema-install, remit, enrollment or ACL-write privilege |

Runtime's exact Yellow Page read tables are domain, sys_conf, organisation, entity,
drumate, privilege, cookie, authn, socket, hub, hub_lifecycle, hub_acl, hub_plan,
hub_capability, system_mfs_installation and system_mfs_provisioning. Its function
EXECUTEs are uniqueId/domain_permission/get_remit, and procedure EXECUTEs are
session_signin/session_ensure/authn_store/socket_bind/socket_get/socket_free/
socket_list_session/socket_refresh. No EXECUTE wildcard on `yp.*` is granted.

After authorized HubLifecycle creation and system-mfs validation, the provisioner
grants runtime SELECT on that exact shard's manifest tables and EXECUTE on its
manifest functions/procedures. MariaDB database-level GRANT OPTION applies to
all privileges the provisioner holds in the escaped Hub namespace, even though
the final GRANT statement names SELECT/EXECUTE. It has no global or Yellow Page
GRANT OPTION. Runtime receives neither DDL nor GRANT OPTION.
It is an intentionally privileged control-plane account, never described as an
ordinary least-privileged runtime. The canonical SqlHubStore's optional broad
`runtime_user` GRANT ALL path is not enabled.

MariaDB's actual SQL SECURITY DEFINER behavior remains explicit: intrinsic
session/transport routines run with their scoped schema-job owner; MFS routines
run with their scoped shard-provisioner owner; KB-01A get_remit is SQL SECURITY
INVOKER. Runtime cannot replace those routines. Enrollment's canonical structural
validator requires routine-body visibility; MariaDB 11.4 supplies it through the
job-only mysql.proc SELECT grant. That metadata grant is never given to runtime.
Cold recovery preserves SQL accounts, definers and matching secret generations.

Acceptance exercises real enrollment, authentication, authorized Hub provisioning,
MFS/FileIo/browser operations and negative CREATE DATABASE (including another
Hub name), unrelated-schema SELECT/ALTER, SQL-account creation, global grant,
runtime DDL, platform-remit writes, enrollment metadata access/modification and
Hub ACL deletion. Separate HTTP tests verify readers/outsiders cannot provision
Hubs and platform remit/Hub administration do not bypass unrelated MFS grants.
See [IL-4R qualification](/kernel/distribution/qualification) for final counts
and limitations. Its evidence JSON includes
credential-free observations from mysql.user, mysql.db, mysql.tables_priv and
information_schema.ROUTINES. All five application accounts have N in every
observed global privilege column. Only the provisioner has a database-level
Hub-namespace grant option; runtime has none. Observed intrinsic DEFINERs belong
to kernel_schema, MFS DEFINERs to kernel_provisioner, and get_remit is INVOKER.

The final source audit removes the older probe's unnecessary direct cookie and
socket DML. Alpha.4's sole direct transport write is `OTAK_EXPIRE_QUERY`'s DELETE
from authn; all other writes execute the canonical DEFINER routines. The private
provisioner needs only SELECT-based session resolution and the canonical
session_ensure compatibility routine. Its Yellow Page UPDATE column sets are
derived from SqlHubStore and SqlMfsStore statements. MariaDB's upsert privilege
checks require the INSERT/UPDATE column union, including inserted key/time
columns in hub_acl and hub_capability; real-MariaDB qualification covers this.
This policy is recorded as
`il4-sql-roles-1` in job artifacts and schema compatibility; older unqualified
projection backups cannot be silently adopted under this policy.

Initial human enrollment is owned by the canonical KB-01B control plane, not by
distribution SQL fixtures. Runtime alpha.4 supplies KB-01A platform scope;
`PLATFORM_ADMINISTRATOR` remit 15 authorizes platform operations but never
bypasses Hub or MFS ACLs. The separate private provisioner repeats session and
platform authorization before invoking canonical Hub lifecycle and System MFS.

Source: [qualified Debian SQL policy and observations](https://github.com/drumee/debian/blob/3fb32d86ce336c886235c23b9632a140a2dc3045/docs/minimal-kernel-sql.md).
