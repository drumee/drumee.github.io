---
id: operations
title: Operations & Recovery
slug: /kernel/distribution/operations
sidebar_position: 2
description: Owner-bound operator commands, coordinated SQL/MFS backup, isolated restore and fail-closed upgrade policy.
---

# Operations and recovery

Use the [explicit distribution profile](/kernel/distribution/install). All
commands execute from its Debian checkout and emit JSON state or diagnostic
codes. Mutations require `--execute`, matching owner UID/GID and canonical
deployment ownership. Unknown installations, unrelated volumes/networks and
nonempty unowned roots are not adopted.

| Command | Purpose |
|---|---|
| `plan`, `validate` | Pure planning/configuration checks; no activation |
| `install` | Prepare and activate canonical jobs and services |
| `status`, `doctor` | Observe state and diagnose readiness |
| `start`, `stop` | Activate or stop the known owned composition |
| `backup`, `restore` | Coordinated cold recovery with verified inventory |
| `upgrade`, `rollback` | Explicit compatibility-gated transitions |
| `credential` | Canonical initial-credential delivery to a private TTY |

```sh
bin/drumee-ctl --profile minimal-kernel status --config /owned/config/minimal-kernel.yaml
bin/drumee-ctl --profile minimal-kernel doctor --config /owned/config/minimal-kernel.yaml
bin/drumee-ctl --profile minimal-kernel stop --execute --config /owned/config/minimal-kernel.yaml
bin/drumee-ctl --profile minimal-kernel start --execute --config /owned/config/minimal-kernel.yaml
```

## Complete backup

Recovery delegates to Infra Layer. The legacy Team database-only backup path
is never used for an explicitly selected minimal profile.

```sh
bin/drumee-ctl --profile minimal-kernel backup --execute \
  --config /owned/config/minimal-kernel.yaml --backup /owned-backup-root/manual-20261016
```

The target must be a new empty directory below the configured backup location.
The command records the explicit retention period; pruning requires a separate
explicit owner operation. It never deletes unrelated backups to enforce a quota.

Canonical backup stops the owned kernel, private provisioner and other writers,
checks database event quiescence, takes a locked logical dump, then stops the
engines and copies cold persistent state. The inventory covers SQL data/accounts/
DEFINER identities, MFS bytes and ACLs, initial enrollment marker/credential
resource, configuration snapshot, frontend assets, CA/leaf/key state, infrastructure
secret generations, ownership and lifecycle metadata. Backup is private and
contains credentials; it must remain outside source control and public storage.
All checksums and schema versions are validated before restoration.

## Isolated restore

For isolated restoration, copy the configuration to a new file, choose a new
project name, new empty owned storage root and unoccupied explicit ports above
1023. Set `network.bind_address: 127.0.0.1`: the canonical restore API requires
loopback isolation and refuses a LAN/public binding. Inspect a restored project
over a scoped SSH tunnel when using a remote acceptance host. Preserve
the logical instance ID, initial username/email, mode and operation ID. Do not
point at customer databases or reuse existing deployment resources.

```sh
bin/drumee-ctl --profile minimal-kernel restore --execute \
  --config restored.yaml --backup /owned-backup-root/manual-20261016
```

Restore preserves identities, credentials, grants, MFS content and CA identity.
It then explicitly activates the restored composition, reruns canonical job
validation and real administrator authentication, and checks protocol readiness.
The operator must additionally verify application/ACL/browser behavior before
using the restored deployment. The validation ledger records acceptance evidence;
infrastructure attestation alone is not full kernel recovery qualification.

## Interrupted initialization

An interrupted initialization must resume from its credential resource, canonical
SQL guard and lifecycle journal. Never delete the marker, rename another human
as administrator, regenerate a missing successful-enrollment credential, reset a
password, or import an old direct-SQL owner fixture. A malformed/partial KB-01B DDL
installation deliberately requires investigation rather than automatic repair.

## Upgrade and rollback

```sh
bin/drumee-ctl --profile minimal-kernel upgrade --execute \
  --config candidate.yaml --backup /owned-backup-root/preupgrade
bin/drumee-ctl --profile minimal-kernel rollback --execute \
  --config /owned/config/minimal-kernel.yaml --revision VERIFIED_PREPARED_REVISION
```

Upgrade delegates canonical compatibility checks and requires verified backup
evidence. Supported Infra Layer transitions remain deliberately narrow: compatible
same-engine-version rebuilds and classified configuration transitions. Unqualified
kernel-image changes, schema changes, database engine transitions/downgrades and
secret-generation mismatches fail closed. Rollback never claims that switching
an image also reverses a SQL migration. Use an isolated matching-schema backup
restore when a compatible in-place rollback is unavailable. Additional SQL-account
secret rotation has no qualified consumer transition and is unsupported.

## Qualified scope

Automatic and real-PTY installations, persistent restart, complete backup and
separate-project restoration passed actual authentication/ACL/MFS/FileIo and
Chromium checks. See [qualification evidence](/kernel/distribution/qualification).
SMTP spool recovery remains excluded. No automatic trust-store installation,
DNS resolver change, firewall change or renewal scheduler is supplied.

Source: [qualified Debian recovery guide](https://github.com/drumee/debian/blob/3fb32d86ce336c886235c23b9632a140a2dc3045/docs/minimal-kernel-recovery.md).
