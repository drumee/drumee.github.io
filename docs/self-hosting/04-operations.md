---
id: 04-operations
title: Production & operations
slug: /self-hosting/operations
description: Run Drumee for real — domain & TLS, email, backups, upgrades, and day-2 operations for both channels.
---

# Production & day-2 operations

Once Drumee is installed, here's how to run it for real — domains and TLS, email,
backups, and upgrades. Most of this applies to **both** channels; differences are
called out.

## Domain & TLS

Set `tls.mode` in your `drumee.yaml`:

| `tls.mode` | Behaviour |
|---|---|
| `acme` *(default)* | Automatic Let's Encrypt / ZeroSSL certificates + renewal. Requires a real domain with DNS pointed at the host and ports 80/443 open. |
| `own` | Use your own wildcard certificate (set `tls.own_cert_path`). |
| `self-signed` | Local/dev only — a self-signed cert (browser will warn). |

For a real deployment, point an **A/AAAA record** at your server, set
`instance.domain` to that hostname and `tls.mode: acme`, then (re-)install. The
reverse proxy obtains and renews certificates automatically.

> **Trying it out without a domain?** The Docker Compose installer can use the
> server's IP via `sslip.io` (real HTTPS, no domain) or plain `http://localhost`.

## Email (SMTP)

Drumee sends password-reset and notification emails. Configure an SMTP relay in
`drumee.yaml` under `email:` (host, port, secure, user, password). Without it, the
install still completes and prints the admin credentials directly, but outbound
email (invites, resets) won't be delivered until SMTP is set.

## Admin account

The first install creates an **admin** account and prints its login. If you didn't
set a password (or lost it), reset it on the host/stack:

- **Docker:** `DRUMEE_DIR=. drumee-ctl ...` or set it via the app's password tooling.
- **Debian:** use the server's password procedure from the DB.

Then sign in at your instance URL.

## Backups

Back up regularly — the database holds all accounts, content metadata, and config.

**Docker Compose:**
```bash
cd drumee
DRUMEE_DIR=. drumee-ctl backup                  # database + config snapshot
DRUMEE_DIR=. drumee-ctl restore <backup-file>   # restore
```

**Debian:** back up MariaDB (e.g. `mariabackup` or `mysqldump`), `/etc/drumee/`,
and your data directory. Keep backups on a **separate disk/host**.

## Upgrades

**Docker Compose** — pull new images and restart; schema patches apply automatically:
```bash
DRUMEE_DIR=. drumee-ctl upgrade
DRUMEE_DIR=. drumee-ctl rollback     # revert if needed
```

**Debian** — standard apt:
```bash
sudo apt update && sudo apt upgrade
```

Always **back up before upgrading**.

## Health & troubleshooting

```bash
# Docker Compose
DRUMEE_DIR=. drumee-ctl status
DRUMEE_DIR=. drumee-ctl doctor          # deeper checks (DB, Redis, disk, services)
docker compose logs -f server-pod

# Debian
sudo /etc/init.d/drumee status
sudo /etc/init.d/drumee log
sudo journalctl -u drumee-server-pod
```

Common things to check if the UI won't load:
- the proxy is up and has a valid certificate (or you're on the right `http`/`https` URL),
- MariaDB and Redis are running and reachable,
- the `server-pod` processes are **online** (pm2 / `drumee-ctl status`).

## Security notes

- Secrets (DB/Redis passwords) are **generated at install**, never shipped; credential
  files are written `0600`.
- MariaDB and Redis stay on the **internal network** (Docker) or bound locally (Debian) —
  don't expose them publicly.
- TLS is on by default with automatic renewal in `acme` mode.
- Keep the host patched and take regular backups.

## See also

- 🐳 **[Docker Compose guide](/self-hosting/docker-compose)**
- 📦 **[Debian / Ubuntu guide](/self-hosting/debian)**
- 🧭 **[Self-hosting overview](/self-hosting/overview)**
