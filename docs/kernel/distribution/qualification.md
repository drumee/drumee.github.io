---
id: qualification
title: IL-4 Qualification & Releases
slug: /kernel/distribution/qualification
sidebar_position: 4
description: Qualified revisions, published artifact integrity, separate validation counts and operational limits of the minimal distribution.
---

# IL-4 qualification and releases

**IL-4 — READY_FOR_RELEASE_REVIEW**, recorded on 2026-10-16, applies to the
explicit Debian minimal-kernel container profile. It establishes integrated
installation and recovery evidence within the scope below; it does not declare
the historical Team profile replaced or promise general production support.

## Exact source and artifact identities

| Component | Qualified identity |
|---|---|
| Debian implementation | `4a0efba6193912ce5b0487db51fb541ca79638d0` |
| Debian evidence/documentation | `3fb32d86ce336c886235c23b9632a140a2dc3045`, `feat/container-distribution` |
| Canonical KB-01B source | `59985d4a78e142b64f5976cc7460a723cca29a79`, transient `refactor/mapping` |
| Runtime alpha.4 | `f961f6214432c2e6dbbcde2b926544c076935950` |
| Pinned Infra Layer source | `ad8f2baecb65e5e8782bb60fa92f1653bcc9f724` |
| Infra qualification documentation | `94216fb59c83114ab97fff51dbfa36f63e2316f2`, `feat/il4-release-candidate` |

The original 213 npm-artifact/71-source inventory is unchanged. The additive
alignment verifies 213 locked npm artifacts and 93 acquired files, including the
exact KB-01B module, schema manifest and credential provider. Source acquisition
checks immutable Git objects, blob identities and SHA-256; npm checks locked
tarball SRI. No sibling checkout, historical factory database, copied owner
fingerprint or direct-SQL first-owner fixture is required.

The alignment's inventory-only `release_qualified: false` field makes no
functional qualification claim. Executed readiness belongs to this ledger and
the linked evidence, rather than a mutable inventory flag.

## Published Infra Layer alpha.2

Registry verification on **2026-10-16** finds `@drumee/infra-layer@0.1.0-alpha.2`
published at 15:06:28 UTC, with `next` selecting alpha.2 and `latest` retaining
alpha.1. The published tarball was downloaded and compared byte-for-byte with
the qualified candidate: identical. Registry `gitHead` is
`bef9a379754bcf9a46fed8bcb6f88fe1f775c739`. This later publication is distinct
from the original IL-4 qualification run, which did not publish anything.

```text
sha512-KuNELBJcKBA69RN65qoej4Wxw+lMN5NJO5d50ooHwydZMB90Rq42MyavDgOwpWqG12bPKjJKH0b01tvN17nsnw==
```

The package has 39 allowlisted files, zero production npm dependencies, explicit
lifecycle subpath exports and public declarations. A clean remote source clone
reproduces the same npm tarball; installed-consumer import/planning tests and
strict TypeScript 5.9.3 NodeNext compilation pass. Published alpha.1 does not
provide the qualified IL-3 lifecycle APIs. Debian deliberately retains the
immutable development source archive used for acceptance rather than silently
rewriting its dependency pin to the npm release.

Runtime compatibility remains explicitly `@drumee/server-runtime@0.1.0-alpha.4`,
including KB-01A. Its registry source and SRI match the recorded release:

```text
sha512-bOZ/v6/4mQ/FPa8iE21polPx2PjJWFYTKqTz+2duqxI2ljpviemNgOtpwkxF4j/1Xn/1aVIxdvVCc8Tch2ctEQ==
```

Sources: [npm Infra Layer](https://www.npmjs.com/package/@drumee/infra-layer/v/0.1.0-alpha.2),
[candidate source/provenance](https://github.com/drumee/infra-layer/blob/ad8f2baecb65e5e8782bb60fa92f1653bcc9f724/PROVENANCE.md),
[Infra qualification](https://github.com/drumee/infra-layer/blob/94216fb59c83114ab97fff51dbfa36f63e2316f2/docs/IL-4R-release-candidate.md).

## Validation counts

These are separate measures with overlapping coverage. No combined total is
claimed. All selected final runs passed with zero reported skips.

| TAP suite | Passed cases |
|---|---:|
| Debian profile, including original inventory eight | 15 |
| Infra unit/security | 127 |
| Infra gateway / native services / lifecycle | 17 / 17 / 16 |
| KB-01B units / real MariaDB | 18 / 31 |
| Runtime units / KB-01A real MariaDB | 56 / 16 |
| Retained kernel, control-plane and capabilities | 85 |
| Installed system-mfs | 7 |
| Exact pinned Finder source | 31 |

The earlier capability subset of 68 is already included in 85. SQL TAP counts
include parent cases. Finder's installed package omits its tests; zero-test
discovery is excluded and the exact source actually executes 31 cases.

Other checks: **331** legacy Debian checks, **five** Python OCI integrity/security
cases, **four** Infra HTTPS/job scenarios and **three** strict JSON Schema
checks. These are not TAP totals. ShellCheck was unavailable; shell syntax and
the legacy suite ran. Unrelated heavy native/Team/WireGuard suites were not run.

| Full distribution run | Direct functional assertions | Browser assertions / scenarios | Stage groups | SQL denials |
|---|---:|---:|---:|---:|
| Clean automatic, interruption and concurrent resume | 260 | 24 / 3 | 11 fresh + 10 restart + 10 restore | 16 unique |
| Clean interactive, real PTY | 254 | 24 / 3 | 11 + 10 + 10 | 16 unique |
| Isolated testbox, external LAN client | 258 | external / 3 | 11 + 10 + 10 | 16 unique |

Repeating SQL denials after restore does not make 32 unique cases. Python PTY
assertions and SQL subprocess checks are separate from direct JavaScript
assertions; browser scenarios are not added to assertion totals.

The testbox run covers **14 named acceptance criteria**: authoritative TCP/UDP
DNS, correct physical LAN A record, actual CA/SAN HTTPS verification, human admin
login, platform-authorized Hub creation, reader/outsider denial, cross-Hub/MFS
isolation, binary upload/download, ZIP/Range/FileIo, WebSocket/OTAK, real Chromium
Finder/LETC/Window Manager, persistent restart, isolated restoration and credential
preservation. Fresh/restart browser checks use the LAN; restored browser checks
use a scoped SSH tunnel to the deliberately loopback-only restored project.
Container-internal success is not presented as LAN/browser evidence.

## Reproduce and inspect

Use the [clean installation guide](/kernel/distribution/install), then run the
repository checks from the same pinned Debian checkout:

```sh
node --test profiles/minimal-kernel/inventory.test.js profiles/minimal-kernel/test/*.test.js
python3 tests/minimal-kernel/image-archive.test.py
tests/run-all.sh
```

Full acceptance creates and removes explicitly owned disposable resources.
Set the actual physical interface and LAN address for an isolated authorized
host; do not reuse customer data or another installation:

```sh
IL4_INTERFACE=YOUR_INTERFACE IL4_LAN_ADDRESS=YOUR_LAN_ADDRESS IL4_INTERRUPT=1 node tests/minimal-kernel/run.js
IL4_INTERFACE=YOUR_INTERFACE IL4_LAN_ADDRESS=YOUR_LAN_ADDRESS IL4_MODE=interactive node tests/minimal-kernel/run.js
```

The [immutable Debian ledger](https://github.com/drumee/debian/blob/3fb32d86ce336c886235c23b9632a140a2dc3045/docs/minimal-kernel-il4r-ledger.md)
records exact supporting regression and remote-client commands, source commits,
image manifest/config/layer identities and failure history. The
[machine-readable evidence](https://github.com/drumee/debian/blob/3fb32d86ce336c886235c23b9632a140a2dc3045/docs/minimal-kernel-il4r-evidence.json)
records individual reports, sanitized SQL observations and log hashes. It is a
historical qualification record; its unpublished-candidate status predates the
registry observation above.

## Limits and failed-attempt disclosure

One local interactive attempt returned `DOCKER_LIFECYCLE_COMMAND_FAILED` during
restart after Redis rotation; no underlying child detail was retained and the
cause remains unconfirmed. An unchanged-source diagnostic rerun passed every
stage, as did independent automatic and remote runs. Earlier import, sign-in,
permission conversion, Team default-rendering, cross-store image identity,
restoration binding and MariaDB upsert-grant failures were corrected and are
retained in the ledger. Tests were not weakened.

SMTP recovery is excluded. Additional-account secret rotation is unsupported.
Unqualified engine/schema/kernel transitions fail closed; same-revision upgrade
and rollback were tested. Crashed locks and partial canonical DDL require owner
investigation; there is no automatic credential recreation or administrator
repair. Backup retention is recorded policy with explicit owner pruning, not an
automatic deletion scheduler. Docker inputs and exports are verified, but
byte-identical image filesystem timestamps across rebuilds are not claimed.

Private transitional source license declarations remain absent; notice/rights
review is required before public distribution. No upstream license is invented.
The Infra package itself carries its verified AGPL license. No permanent testbox
installation, host resolver/firewall/trust change or Oxymotion deployment was
performed. This documentation update publishes no package, image or release tag.
