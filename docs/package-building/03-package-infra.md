---
id: 03-package-infra
title: "Package: drumee-infra"
slug: /package-building/package-infra
description: drumee-infra package — infrastructure configurator, post-install flow, SSL, DNS, PM2, crontab
---

# Package: drumee-infra

**Directory:** `infra/`
**Debian package:** `drumee-infra`
**Current version:** 1.2.27
**Helper source:** `git@github.com:drumee/setup-infra` → `/var/lib/drumee/setup-infra/`

## Purpose

The foundation package. Must be installed first on any Drumee server. Its post-install script (`bin/install`) is a full infrastructure configurator that generates every config file the platform needs — nginx virtual hosts, SSL certificates, DNS zones, PM2 process config, MariaDB tuning, Postfix mail, Jitsi/Prosody (if applicable), and the master runtime environment at `/etc/drumee/drumee.sh`.

## setup-infra flow

`setup-infra` (the `@drumee/setup-infra` npm package) is a **chroot-aware config generator**: it renders ~70 lodash `.tpl` templates — plus a handful of static files — into the target's `/etc` tree, then a bash layer performs the OS-level setup (TLS, DNS, mail, XMPP, crontab).

### Two Node configurators

Infra and Jitsi are split into two standalone scripts (formerly one `index.js`):

| Script | Role |
|---|---|
| `infra.js` | Infra configurator: assembles `data`, then `writeInfraConf` — writes `drumee.json`, PM2 `ecosystem.json`, credentials (DB/postfix/email), and the nginx/BIND/postfix/DKIM/MariaDB/SSL configs. |
| `jitsi.js` | Jitsi configurator: seeds from the existing `drumee.json`, regenerates fresh Jitsi/Prosody/Coturn secrets, and writes **only** the Jitsi/Prosody/Coturn/nginx-jitsi configs — it does not touch `drumee.json`, BIND zones, the PM2 ecosystem, or DB credentials. |

`bin/install` runs the pair — `node infra.js` then `node jitsi.js` — unless `$DRUMEE_COMPONENTS` is set, in which case it runs the single `node <$DRUMEE_COMPONENTS>.js` instead (e.g. `DRUMEE_COMPONENTS=infra` for an infra-only host). `jitsi.js` can also be re-run on its own to reconfigure conferencing without disturbing the rest of the install.

> Both scripts share the same argument parser and render engine (`templates/`); only their top-level `main()` differs (infra writes everything except Jitsi; Jitsi writes only Jitsi).

### Render engine — `templates/index.js`

Three primitives drive every write:

- **`chroot(p)`** — prefixes each output path with `--outdir` / `--chroot` / `$DRUMEE_CONF_BASE`, falling back to `/`. This lets the same code render the whole `/etc` tree into a **staging root** (used by the `.deb` build and the container `infra-init`) or directly onto a live host.
- **`render(data, name)`** — reads `<name>.tpl` (or the file verbatim) and runs it through lodash `_.template()` with `data` as the interpolation context (`<%= var %>`), optionally `JSON.parse`-ing the result.
- **`write(data, fn, tpl)`** — `chroot`s the target, `mkdir -p`s its parent, stamps `data.date`, renders, writes. Honors `--readonly` (dry-run).

### Idempotency / reinstall guard

`templates/utils.js` → `hasExistingSettings()` reads `/etc/drumee/drumee.json`; if a `domain_name` is already configured it **aborts with a data-loss warning** — `infra.js` then calls `exit(0)`, so the caller sees success — unless re-rendering was explicitly agreed to, by either:

- `--reconfigure=1` on the command line, or
- `DRUMEE_RECONFIGURE=1` (or `true`) in the environment, which is what the `--reconfigure` argparse default reads, "so a package can drive it".

On the package side, the `reconfigure` postinst action supplies `--reconfigure=1`.

:::caution `--force-install` is an alias, and used to be a no-op
`--force-install` is declared with the help text "Override existing configs", but for a long time **nothing read it** — passing it left the guard in force, and since `infra.js` exits 0 the caller saw success with nothing re-rendered. `drumee-infra`'s postinst passed exactly that on `dpkg-reconfigure`, which is why configuration fixes could not reach an already-installed host. Fixed on both sides: the postinst now passes `--reconfigure=1` (drumee-infra 1.2.27), and the guard accepts `--force-install` as an alias so an older postinst still works.
:::

### public / private / main variants

Network-facing services ship in three parallel template flavors, selected by domain type: `*.public.*` (internet-facing, real IP + ACME + mail/DKIM), `*.private.*` (LAN `.local`, self-signed certs), and a bare/`main`/`vhost` single-domain variant. The configurator picks templates by suffix and rewrites the output filename to the concrete domain (e.g. `01-public.conf` vs `02-private.conf`, `db.domain` → `db.<domain>`).

## Source Repos

| Repo | Branch | Destination |
|---|---|---|
| `setup-infra` | main | `/var/lib/drumee/setup-infra/` |
| `acme.sh` (GitHub: acmesh-official) | master | `/usr/share/acme/` |

`acme.sh` is cloned via `bundle_acme` directly from `https://github.com/acmesh-official/acme.sh` — not from the Drumee GitHub org.

## Build

```bash
infra/build.sh
```

`infra/build.sh` takes no flags — version and maintainer email are read from `infra/debian/changelog`. (The `--…` arguments below belong to the `infra.js`/`jitsi.js` runtime configurator that runs at install time, not to the build script.)

## Installed Paths

```
/usr/                         # CLI tools and utilities
/etc/                         # nginx base config, acme.sh config
/var/lib/drumee/
├── setup-infra/              # configurator (bin/, templates/, configs/)
│   ├── bin/install           # post-install entry point (requires root)
│   ├── infra.js              # infra configurator (drumee.json, nginx, BIND, PM2, …)
│   ├── jitsi.js              # Jitsi configurator (Jitsi/Prosody/Coturn)
│   ├── templates/            # lodash render engine + ~70 .tpl files mirroring /etc/
│   │   ├── index.js          #   render engine: chroot(), render(), write(), makedir()
│   │   └── utils.js          #   argparse CLI + hasExistingSettings() reinstall guard
│   └── configs/              # static files copied verbatim (postfix/master.cf, cron.d/drumee)
└── utils/                    # shared shell utilities
/usr/share/acme/              # acme.sh SSL tool
```

## Dependencies

```
binutils, apt-utils, git, nodejs, npm, nginx, cron,
libncurses6, g++, gyp, openssh-client, libcurl4
```

## Post-Install: bin/install

The package `postinst` invokes it: on `configure` it runs `bin/install`; on `reconfigure` it re-runs the configurator with `--reconfigure=1` directly (and then `bin/init-named` itself, since that arm bypasses `bin/install`). Either way the `postinst` first bridges the debconf answers (`drumee-infra/*`) into the `DRUMEE_*` environment variables the configurator reads — without a domain it silently `exit(0)`s and nothing is configured.

`bin/install` runs as root and orchestrates the setup in this order:

1. **Mail (DKIM) keypair** — if a public domain is set, runs `bin/init-mail` to generate a 2048-bit DKIM key under `/etc/opendkim/keys/<domain>/` **before** rendering, so the public key can be embedded into the generated config.

2. **Generates all config files** — runs `node infra.js` then `node jitsi.js` (or a single `node <$DRUMEE_COMPONENTS>.js` when that env var is set). Renders the lodash templates into `/etc/drumee/`, `/etc/nginx/`, `/etc/bind/`, `/etc/prosody/`, `/etc/jitsi/`, `/etc/postfix/`, `/etc/turnserver.conf`, `/etc/opendkim/`, and `/etc/mysql/`. This also writes the master runtime environment `/etc/drumee/drumee.sh`; **if that file is absent afterwards, install aborts.**

3. **Sources `/etc/drumee/drumee.sh`** and installs the crontab, then sets directory permissions via `protect_dir` for all Drumee runtime directories (owned by `www-data`, confidential dirs mode `go-rwx`).

4. **DNS** — runs `bin/init-named` (zone files, TSIG key, starts `named`) when the
   instance is meant to serve its own zone. **`DRUMEE_DNS_SERVER` is the decider**,
   and the postinst sets it from the chosen `tls_method`:

   | `DRUMEE_DNS_SERVER` | Behaviour |
   |---|---|
   | `0` | skipped — "Local DNS server not requested for this TLS method" |
   | `1` | `bin/init-named` runs |
   | unset | falls back to the old inference: runs unless `$ACME_ENV_FILE` is set **and** the file exists |

   The fallback is about the *certificate challenge* only, which is why it also
   switched DNS on for methods that want their zone hosted elsewhere. Prefer the
   explicit variable.

5. **SSL certificates** — driven by `DRUMEE_TLS_METHOD` (five methods:
   `acme-dns-server`, `acme-dns-api`, `caddy`, `own`, `self-signed`), which the
   postinst reduces to the two variables this script actually tests:

   - **Self-signed** (`$PRIVATE_DOMAIN` set **or** `DRUMEE_TLS_METHOD=self-signed`):
     `bin/create-local-certs` generates certs via openssl. The method is tested
     explicitly, not just the private domain — on that path this is the only thing
     certifying the *public* names, so gating on the private one would leave nginx
     with no certificate at all.
   - **ACME** (`$PUBLIC_DOMAIN` set, no `$OWN_CERTS_DIR`): `bin/init-acme` issues
     **wildcard** certs via acme.sh. Always DNS-01 — a wildcard cannot be validated
     over HTTP — either against the local BIND9 (`dns_nsupdate`) or your provider's
     API, selected by `$ACME_ENV_FILE`.
   - **Own certs** (`$OWN_CERTS_DIR` set): cert generation is skipped.

6. **Prosody XMPP** — runs `setup_prosody` to configure Jitsi Meet credentials (focus, jvb, app users), clean up vendor defaults, and restart prosody.

7. **Crontab** — installs `/etc/cron.d/drumee`:

   | Schedule | Cron | Job |
   |---|---|---|
   | 00:30 on the 2nd of each month | `30 0 2 * *` | `acme-cron` — SSL certificate renewal |
   | Daily at 02:30 | `30 2 * * *` | `tmp-files-cleaner` — purge old temp files |
   | Hourly (minute 5) | `5 * * * *` | `watch-dog` — process health check |
   | Daily at 00:00 | `0 0 * * *` | `backup-db` — database backup |
   | Daily at 01:00 | `0 1 * * *` | `backup-storage` — storage backup |

## Configurator inputs (infra.js / jitsi.js)

The configurator reads its inputs in this order of precedence:

1. CLI arguments (highest)
2. Environment variables (`DRUMEE_DOMAIN_NAME`, `PUBLIC_IP4`, etc.) — on a package install these are bridged from the debconf answers (`drumee-infra/domain`, `.../admin_email`, `.../db_dir`, `.../data_dir`, `.../own_ssl`, …) by the `postinst`.
3. Existing `/etc/drumee/drumee.json` (existing install)
4. Auto-detected network interfaces (`getAddresses()` classifies each NIC address as public/private via the `private-ip` module)

Both `infra.js` and `jitsi.js` accept the same flags, parsed by `templates/utils.js`.

### CLI Arguments (passed via bin/install or directly)

| Argument | Description |
|---|---|
| `--public-domain` | Public-facing domain name |
| `--private-domain` | LAN/private domain name |
| `--public-ip4` / `--public-ip6` | Override auto-detected public IP |
| `--private-ip4` / `--private-ip6` | Override auto-detected private IP |
| `--data-dir` | Override user data directory (default: `/data`) |
| `--db-dir` | Override MariaDB data directory |
| `--own-certs-dir` | Use pre-existing certificates from this path |
| `--no-jitsi` / `--only-infra` | Skip Jitsi configuration |
| `--localhost` | Localhost-only setup (no public/private domain) |
| `--reconfigure` | Force overwrite of existing `/etc/drumee/drumee.json` |
| `--force-install` | Override existing installation |
| `--watch` | Configure PM2 to watch endpoint directories for changes |
| `--readonly` | Print target file list without writing |

## Generated Config Files

| Path | Description |
|---|---|
| `/etc/drumee/drumee.sh` | Master shell environment (sourced at server startup) |
| `/etc/drumee/drumee.json` | Master JSON configuration |
| `/etc/drumee/conf.d/` | Additional configs: exchange, myDrumee, conference |
| `/etc/drumee/credential/` | JSON credentials: `db.json`, `email.json`, `redis.json`, `sms.json` |
| `/etc/drumee/infrastructure/ecosystem.json` | PM2 process definitions |
| `/etc/nginx/sites-enabled/` | nginx virtual hosts (public, private, Jitsi variants) |
| `/etc/bind/` | BIND9 DNS zones and named.conf |
| `/etc/prosody/` | Prosody XMPP configuration |
| `/etc/jitsi/` | Jitsi Meet, jicofo, videobridge configs |
| `/etc/postfix/` | Postfix mail configuration |
| `/etc/turnserver.conf` | Coturn TURN server |
| `/etc/opendkim/` | OpenDKIM mail signing |
| `/etc/mysql/mariadb.conf.d/` | MariaDB tuning |

## PM2 Process Model

`ecosystem.json` defines three processes per endpoint:

| Process | Mode | Description |
|---|---|---|
| `main` | fork | Page serving + WebSocket |
| `main/service` | cluster | REST API workers (scaled by RAM: 2 GB→2, 6 GB→3, >6 GB→4) |
| `factory` | fork | Schema factory (autorestart disabled) |
