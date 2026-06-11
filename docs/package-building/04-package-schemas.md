---
id: 04-package-schemas
title: "Package: drumee-schemas"
slug: /package-building/package-schemas
description: drumee-schemas package — MariaDB bootstrap, mariabackup seeds, populate.js account and hub provisioning
---

# Package: drumee-schemas

**Directory:** `schemas/`
**Debian package:** `drumee-schemas`
**Current version:** 2.6.7
**Helper source:** [`drumee/setup-schemas`](https://github.com/drumee/setup-schemas) → `/var/lib/drumee/setup-schemas/`

## Purpose

Bootstraps the Drumee database layer. The post-install script (`bin/install`) restores a MariaDB snapshot from seeds, creates system accounts (nobody, guest, system, admin), provisions the initial hubs and media filesystem, imports wallpapers and tutorials, generates the RSA key pair, and sends a welcome email with the admin password-reset link.

## Source Repos

| Repo | Branch | Destination |
|---|---|---|
| `setup-schemas` | main | `/var/lib/drumee/setup-schemas/` |
| `schemas` | preview | `/var/lib/drumee/schemas/` |

## Build Prerequisites

**Seeds archive required.** The build looks for a seeds archive in this order:

1. `schemas/var/tmp/drumee/seeds.tgz` — pre-existing archive in the repo
2. `$SEEDS_DIR/` directory (default: `$HOME/docker/data/seeds/`) — packed from a live MariaDB instance

If neither exists, the build exits. Seeds are a `mariabackup` snapshot of the base Drumee database needed to bootstrap a fresh instance.

`schemas/seeds/` is gitignored — it contains large MariaDB binary files (aria_log, ibdata1) unsuitable for version control.

### Creating seeds.tgz from a live instance

```bash
SEEDS_DIR=/path/to/mariabackup/snapshot schemas/build.sh
```

### schemas/Dockerfile

Provides a containerised build environment for producing seeds without a local MariaDB installation. Uses `mariabackup` to snapshot and prepare the database.

## Build

```bash
schemas/build.sh [--version=X.Y.Z] [--force=yes] [--email=user@example.com]
```

## Installed Paths

```
/var/lib/drumee/
├── setup-schemas/       # bin/install, populate.js, lib/, templates/
└── schemas/             # schema source (preview branch)
/var/tmp/drumee/
└── seeds.tgz            # mariabackup snapshot archive
```

## Dependencies

```
binutils, nodejs, mariadb-server, mariadb-client
```

## Post-Install: bin/install

Runs as root. Three-phase execution:

### Phase 1 — Database restore (bash)

1. Sources `/etc/drumee/drumee.sh` for environment variables.
2. Stops MariaDB.
3. Manages the DB directory (`$DRUMEE_DB_DIR`, default `/srv/db`):
   - Archives any existing `run/` to `orig/<date>/` (rollback point).
   - Creates a fresh `run/` directory.
4. Extracts seeds from `/var/tmp/drumee/seeds.tgz`.
5. Restores via `mariabackup --copy-back` into `$DRUMEE_DB_DIR/run/`.
6. Sets ownership (`mysql:mysql`) and permissions (`750` dirs, `rw` files).
7. Starts MariaDB.
8. Creates the system Unix-socket user:
   ```sql
   CREATE OR REPLACE USER '$DRUMEE_SYSTEM_USER'@'localhost' IDENTIFIED VIA unix_socket;
   GRANT ALL PRIVILEGES ON *.* TO '$DRUMEE_SYSTEM_USER'@'localhost';
   ```
9. Sets global collation to `utf8mb4_general_ci` if supported.

### Phase 2 — Schema and account initialisation (node populate.js)

1. **DB connectivity check** — creates and drops a temporary test database.
2. **App user** — reads `/etc/drumee/credential/db.json`; creates `drumee-app` MariaDB user (generates a random password and writes the file if absent).
3. **Mail user** — creates `mailserver` MariaDB user from `/etc/drumee/credential/postfix.json` if present.
4. **org.populate()** — writes core rows to the `yp` database:
   - `sys_conf` — system-wide settings (guest_id, nobody_id, public_id, domain, mfs_root, etc.)
   - `domain`, `vhost` (ns1, ns2, jit, www, smtp, `_acme-challenge`, `_domainkey`)
   - `organisation`, `settings`, `mailserver.domains`, `mailserver.aliases`
5. **System accounts created:**

   | Account | UID source | Privilege | Notes |
   |---|---|---|---|
   | `nobody` | `ID_NOBODY` (fixed) | 1 | Anonymous placeholder |
   | `guest` | `get_sysconf('guest_id')` | 1 | Unauthenticated visitor |
   | `system@<domain>` | generated | DOM_OWNER | Creates media hub + portal hub |
   | `admin@<domain>` | generated | DOM_OWNER | Creates shareboxes, sets quota, generates reset token |

6. **Hubs created:**

   | Hub | vhost | Status |
   |---|---|---|
   | Media hub | `<uniqueid>.<domain>` | system — stores wallpapers and tutorials |
   | Portal hub | primary domain | system — public entry point |
   | Admin internal sharebox | private | — |
   | Admin external sharebox (DMZ) | — | for guest sharing |

7. **Media import** — downloads wallpapers from `content.drumee.com/Wallpapers` and tutorial content.
8. **RSA key pair** — generates and writes to `/etc/drumee/credential/crypto/public.pem` and `private.pem`.
9. **Welcome page** — renders welcome HTML with the password-reset link to `<data_dir>/tmp/welcome.html`.

### Phase 3 — Post-populate

- Sends a welcome email to `$ADMIN_EMAIL` with the password-reset link.
- Applies any pending schema patches from `/var/lib/drumee/patches/patch-from-manifest` if the file exists.

## Configuration Sources

| Source | Used for |
|---|---|
| `/etc/drumee/drumee.sh` | Runtime paths and env vars |
| `/etc/drumee/credential/db.json` | MariaDB app user credentials |
| `/etc/drumee/credential/postfix.json` | Mail server DB user credentials |
| `/etc/drumee/credential/email.json` | Outbound email auth |
| `/etc/drumee/credential/crypto/` | RSA key pair (generated on first install) |
| `$DRUMEE_DB_DIR` | MariaDB data directory (default `/srv/db`) |
| `$ADMIN_EMAIL` | Recipient for welcome/reset email |

## Database Structure

**`yp`** — Central system database shared across all entities. Contains `sys_conf`, `domain`, `vhost`, `entity`, `drumate`, `hub`, `organisation`, `settings`, `privilege`, `disk_usage`, `tutorial`, and mailserver tables.

**Per-entity databases** — One database per user and hub, created by the `entity_create` stored procedure. Contains `mfs_*` tables, `permission`, `media`, and activity tables.

**The shared `common` class** — `hub` and `drumate` databases do not each define their own copies of the core routines. Definitions in the `common` class (the Meta File System `mfs_*` procedures, trash routines, and shared tables such as `channel`) are deployed identically into *every* hub and drumate database — the patch engine targets `type IN ('drumate', 'hub')`. Both entity types therefore inherit one shared source of truth. See the [Stored Procedures Reference](../api-reference/stored-procedures.md#the-shared-common-class) for details.

## Install Log

`/var/log/drumee/seeds.log` — records the `mariabackup --copy-back` output and timestamp.
