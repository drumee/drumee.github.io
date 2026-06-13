---
id: 03-package-infra
title: "Package: drumee-infra"
slug: /package-building/package-infra
description: drumee-infra package — infrastructure configurator, post-install flow, SSL, DNS, PM2, crontab
---

# Package: drumee-infra

**Directory:** `infra/`
**Debian package:** `drumee-infra`
**Current version:** 1.2.11
**Helper source:** `git@github.com:drumee/setup-infra` → `/var/lib/drumee/setup-infra/`

## Purpose

The foundation package. Must be installed first on any Drumee server. Its post-install script (`bin/install`) is a full infrastructure configurator that generates every config file the platform needs — nginx virtual hosts, SSL certificates, DNS zones, PM2 process config, MariaDB tuning, Postfix mail, Jitsi/Prosody (if applicable), and the master runtime environment at `/etc/drumee/drumee.sh`.

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

`infra/build.sh` takes no flags — version and maintainer email are read from `infra/debian/changelog`. (The `--…` arguments below belong to the `infra.js` runtime configurator that runs at install time, not to the build script.)

## Installed Paths

```
/usr/                         # CLI tools and utilities
/etc/                         # nginx base config, acme.sh config
/var/lib/drumee/
├── setup-infra/              # configurator (bin/, templates/, configs/)
│   ├── bin/install           # post-install entry point (requires root)
│   ├── infra.js              # main template renderer
│   ├── jitsi.js              # Jitsi-specific renderer
│   └── templates/            # 88 lodash .tpl files mirroring /etc/ layout
└── utils/                    # shared shell utilities
/usr/share/acme/              # acme.sh SSL tool
```

## Dependencies

```
binutils, apt-utils, git, nodejs, npm, nginx, cron,
libncurses6, g++, gyp, openssh-client, libcurl4
```

## Post-Install: bin/install

Runs as root. Orchestrates the full infrastructure setup in this order:

1. **Generates all config files** via `node infra.js` (and `node jitsi.js` unless `--no-jitsi`). Renders 88 lodash templates into `/etc/drumee/`, `/etc/nginx/`, `/etc/bind/`, `/etc/prosody/`, `/etc/jitsi/`, `/etc/postfix/`, `/etc/turnserver.conf`, `/etc/opendkim/`, and `/etc/mysql/`.

2. **Writes the master runtime environment** `/etc/drumee/drumee.sh` — sourced by the server on every startup. If this file is absent after step 1, install aborts.

3. **Sets directory permissions** via `protect_dir` for all Drumee runtime directories (owned by `www-data`, confidential dirs mode `go-rwx`).

4. **SSL certificates** — one of three paths:
   - **Public domain** (`$PUBLIC_DOMAIN` set, no `$OWN_CERTS_DIR`): runs `bin/init-acme` to register with Let's Encrypt via acme.sh and issue wildcard certs using a DNS provider API.
   - **Private domain** (`$PRIVATE_DOMAIN` set): runs `bin/create-local-certs` to generate self-signed certs via openssl.
   - **Own certs** (`$OWN_CERTS_DIR` set): skips cert generation.

5. **DNS** — runs `bin/init-named` to configure BIND9 (generates zone files, TSIG key, starts `named`) unless `$ACME_ENV_FILE` is already present.

6. **Mail (DKIM)** — runs `bin/init-mail` to generate a 2048-bit DKIM keypair under `/etc/opendkim/keys/<domain>/` if a public domain is configured.

7. **Prosody XMPP** — runs `setup_prosody` to configure Jitsi Meet credentials (focus, jvb, app users), clean up vendor defaults, and restart prosody.

8. **Crontab** — installs `/etc/cron.d/drumee`:

   | Schedule | Job |
   |---|---|
   | Daily at 02:30, 2nd of month | `acme-cron` — SSL certificate renewal |
   | Daily at 02:30 | `tmp-files-cleaner` — purge old temp files |
   | Every 5 minutes | `watch-dog` — process health check |
   | Daily at 00:00 | `backup-db` — database backup |
   | Daily at 01:00 | `backup-storage` — storage backup |

## infra.js Configuration

`infra.js` reads configuration in this order of precedence:

1. CLI arguments (highest)
2. Environment variables (`DRUMEE_DOMAIN_NAME`, `PUBLIC_IP4`, etc.)
3. Existing `/etc/drumee/drumee.json` (existing install)
4. Auto-detected network interfaces

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
