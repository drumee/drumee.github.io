---
id: install
title: Install the Minimal Kernel
slug: /kernel/distribution/install
sidebar_position: 1
description: Explicit Debian minimal-kernel container profile, verified dependencies, local TLS and canonical first-administrator enrollment.
---

# Install the minimal-kernel distribution

The profile is explicitly selected with `drumee-ctl --profile minimal-kernel`.
Team remains the default. The explicit container profile passed IL-4R release
qualification; it is a source-built review profile, not the historical Team
installer or a published native minimal-kernel package. Installation uses the
canonical Infra Layer lifecycle and KB-01B jobs. See [qualification and release
status](/kernel/distribution/qualification) for exact versions and limits.

## Acquire and build

Use Node 22, Git/network access, Docker/Compose, and a normal Docker-authorized
operator account. No existing installation, identity dump or sibling checkout
is required. The qualified acceptance platform is Linux/amd64. Python 3 is
required for portable image export; Chromium and `dig` are additionally needed
for the full acceptance suite. Run as the normal configured owner, with a
Docker-authorized account. From a clean checkout:

```sh
git clone --branch feat/container-distribution https://github.com/drumee/debian.git
cd debian
git checkout --detach 3fb32d86ce336c886235c23b9632a140a2dc3045
npm ci --ignore-scripts --no-audit --no-fund --prefix profiles/minimal-kernel
node profiles/minimal-kernel/scripts/sources.js
node profiles/minimal-kernel/scripts/verify.js
bash scripts/build-minimal-kernel.sh
```

The additive dependency manifest preserves the 213-artifact/71-file IL-3
inventory and pins runtime alpha.4, the exact KB-01B source/schema and the
immutable Infra Layer source revision used to qualify alpha.2. Alpha.2 is now
published on npm, but this profile deliberately retains its verified source
archive pin; replacing it is a separate dependency change. npm checks SRI; acquisition
checks immutable Git blobs and per-file SHA-256. Never replace the infrastructure
source URL with registry alpha.1: it lacks lifecycle APIs.

Images use digest-pinned bases and exact Debian/npm package versions. The build
requires committed profile source and emits immutable image IDs, source revision
and alignment digest in `profiles/minimal-kernel/.cache/images.json`. This is
dependency/provenance reproducibility; byte-for-byte Docker filesystem/timestamp
reproducibility is not asserted. No image is published by this command.

For transfer between Docker image-store implementations, use the portable export
(Python 3 is required on the export host):

```sh
node profiles/minimal-kernel/scripts/export.js /owned-artifacts/minimal-kernel.tar.gz
```

This saves explicit build tags, hashes every OCI blob, verifies manifest/config/
uncompressed-layer identity and source/alignment labels, and writes a protected
`.tar.gz.json` receipt containing portable repository@manifest-digest references.
Classic Docker's local config ID and containerd's manifest ID can differ for the
same verified image. On the destination, verify the whole archive SHA-256, load
it, and use the portable receipt's immutable kernel/tools references. Pull the
already pinned official base/helper digests there as needed. Never replace a
failed image-ID check with an unverified tag or disable the Infra Layer guard.

## Configure and install

Start from [`config/drumee.minimal-kernel.example.yaml`](https://github.com/drumee/debian/blob/3fb32d86ce336c886235c23b9632a140a2dc3045/config/drumee.minimal-kernel.example.yaml)
and save an explicit deployment configuration, for example
`/owned/config/minimal-kernel.yaml`. The example's network/storage values are
illustrative, and its zero image/source IDs are deliberate activation blockers. Set every deployment identity,
UID/GID, physical network interface, observed LAN address, binding/ports, owned
persistent root, backup directory and retention period intentionally. Set the
kernel/tools image IDs and exact provenance from the build receipt. Placeholder
image IDs cannot activate. The storage/backup parents must be writable by the
operator, with no unsafe symlink or shared writable ancestors.

Every deployment supplies these values explicitly:

| Configuration | Operator decision |
|---|---|
| `distribution.profile` | `minimal-kernel`; omission selects the historical Team path |
| `deployment` | Stable logical ID, unique Docker project, actual owner UID/GID; acceptance disabled for ordinary installs |
| `network` | Actual physical interface, observed host LAN address, bind address and authorized client CIDRs |
| `storage` | Owned persistent root, separate backup location and retention days |
| `ports` | Explicit unoccupied HTTPS and TCP/UDP DNS bindings |
| `images`, `provenance` | Immutable image IDs/references, source revision and alignment hash from the verified build receipt |
| `operator` | Stable username/email, interactive or automatic mode, durable operation ID |
| `instance`, `dns`, `tls` | `drumee.lan`, local DNS and persistent local CA |

The profile uses `instance.domain: drumee.lan`, `dns.mode: local` and
`tls.provider: local`. Infra Layer creates and preserves the private CA. No
public ACME request, host trust-store installation, firewall change or system
resolver change is performed. LAN address validation reads the named physical
interface; a Docker/container address is never discovered or substituted.

```sh
bin/drumee-ctl --profile minimal-kernel validate --config /owned/config/minimal-kernel.yaml
bin/drumee-ctl --profile minimal-kernel plan --config /owned/config/minimal-kernel.yaml
bin/drumee-ctl --profile minimal-kernel install --execute --config /owned/config/minimal-kernel.yaml
```

Plan/validate are pure. Shared renderer `validate` uses the profile validator;
`compose`/`all` emit Infra Layer composition JSON. Team `.env`, Caddy and native
debconf outputs are explicitly unsupported for the minimal profile. The native
Team package channel is unchanged.

Every mutation requires `--execute`, matching UID/GID and canonical deployment
ownership. Unknown nonempty roots, resource adoption and unrelated Docker
resources are refused. Installation explicitly runs intrinsic schema, platform
bootstrap, KB-01A authority, KB-01B schema, kernel-owned Hub/MFS schema, enrollment,
and real-runtime authentication jobs before private provisioner/kernel/gateway
readiness. Enrollment creates no Hub. A protected configuration snapshot is
included among the distribution's persistent backup resources.

## Initial administrator and credentials

Specify an explicit lowercase Drumee username and email. The account is a human
drumate in organisation 1, personal/active, Domain membership 1 and independent
PLATFORM_ADMINISTRATOR remit 15. It is authenticated by published runtime alpha.4.
Normal sign-in uses the canonical email or UID contract. Platform authority
does not bypass Hub or MFS ACLs.

`operator.mode: interactive` uses KB-01B's non-echoing TTY prompt and confirmation.
Without a secure TTY it fails explicitly. A protected owned 0600 regular-file
descriptor can instead be passed as `--password-fd 3`; no password argument or
environment variable is accepted. The canonical provider validates that descriptor
and persists the bound resource before the enrollment transaction.

`operator.mode: automatic` generates credentials once using KB-01B's canonical
provider, after prerequisites and schema validation. The private resource is
`<storage.root>/durable/operator-state/credential.json`: parent 0700, file 0600,
operator-owned, atomically committed and fsynced. Installation prints its location
and retrieval procedure, never the password. At a private controlling TTY:

```sh
bin/drumee-ctl --profile minimal-kernel credential --execute --config /owned/config/minimal-kernel.yaml
```

The canonical retrieval command authorizes delivery to `/dev/tty`, never ordinary
stdout. Do not terminal-record that session. Keep the protected resource and its
backup: it is not a password-reset or account-recovery API. Ordinary kernel,
provisioner and gateway services cannot read it. Test mode requires explicit
`deployment.acceptance: true`; acceptance-only users are created only by the
isolated test harness, never installation jobs.

## Lifecycle commands

```sh
bin/drumee-ctl --profile minimal-kernel status --config /owned/config/minimal-kernel.yaml
bin/drumee-ctl --profile minimal-kernel doctor --config /owned/config/minimal-kernel.yaml
bin/drumee-ctl --profile minimal-kernel stop --execute --config /owned/config/minimal-kernel.yaml
bin/drumee-ctl --profile minimal-kernel start --execute --config /owned/config/minimal-kernel.yaml
bin/drumee-ctl --profile minimal-kernel install --execute --recover --config /owned/config/minimal-kernel.yaml
```

Commands emit JSON state/diagnostic codes and actionable resource locations.
Starting an existing deployment requires configuration agreement. Canonical
initialization replay preserves UID, operation ID, credentials, remit, reserved
identities and existing Hub/MFS state. Drift, malformed enrollment metadata,
missing credential resources, revoked remit and unexpected grants fail closed;
no administrator or password is recreated or repaired automatically.

`--recover` acknowledges a known interrupted activation. A genuinely crashed
writer can leave an exclusive lifecycle lock. The product never steals it based
on elapsed time or PID guesses: establish the exact writer has exited, inspect
the owned state and journal, then perform explicit operator recovery. Acceptance
tests remove only the empty lock of the exact child they killed and reaped.

Use `kernel.create_hub` through the normal authenticated service dispatcher for
an explicit platform-authorized Hub operation. The private provisioner repeats
canonical session/platform policy and delegates to HubLifecycle/system-mfs.
The ordinary runtime never receives its SQL credential. Subsequent Finder,
FileIo and transfer operations retain canonical Hub/MFS checks.

## Backup, isolated restoration and upgrades

See [operations and recovery](/kernel/distribution/operations) and
[SQL privilege separation](/kernel/distribution/sql-security).
SMTP is optional infrastructure and remains excluded from this profile's fully
qualified recovery scope. Automatic renewal scheduling and automatic host trust
or resolver management remain uninstalled.

The composition includes Nginx, BIND9, MariaDB, Redis, the real kernel and private
Hub provisioner, native service dispatch, System MFS/FileIo and the LETC frontend
with Finder and Window Manager. First enrollment leaves an empty platform;
Hub creation is a separate authenticated administrator operation.

Source: [qualified Debian operator guide](https://github.com/drumee/debian/blob/3fb32d86ce336c886235c23b9632a140a2dc3045/docs/minimal-kernel-operator.md).
