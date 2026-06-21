---
id: 02-docker-compose
title: Docker Compose
slug: /self-hosting/docker-compose
description: Install Drumee with the Docker Compose stack — one command, isolated, with easy upgrades and rollback.
---

# Install with Docker Compose

The recommended way to self-host Drumee. One command pulls prebuilt images and
brings up the full stack, isolated from the rest of your machine.

## Requirements

- A Linux host with **Docker Engine + Docker Compose v2**
  *(the installer can install Docker for you if it's missing)*.
- Optional: a **domain** pointed at the host for automatic HTTPS. Without one, you
  can use the server's IP (automatic HTTPS via `sslip.io`) or run local/HTTP for testing.

## Install

```bash
curl -fsSL https://get.drumee.io | bash
```

The installer asks a few questions:

1. **A name** for the instance.
2. **How people will reach it:**
   - a **domain** you own (real HTTPS via Let's Encrypt), or
   - **this server's IP, no domain** (automatic HTTPS via `sslip.io`), or
   - **local / testing** (`http://localhost`, no HTTPS).
3. **Admin email** (your login).
4. **Admin password** (leave blank to auto-generate — it's printed at the end).

It then generates all secrets, renders the stack, starts it, waits until it's
healthy, and prints your **URL and admin login**. Nothing to hand-edit; re-running
is safe.

> **Unattended?** Preset the answers, e.g.:
> ```bash
> ACCESS_MODE=domain DRUMEE_DOMAIN=cloud.example.com \
>   ADMIN_EMAIL=you@example.com ASSUME_YES=1 \
>   curl -fsSL https://get.drumee.io | bash
> ```

Open the URL it prints and sign in with your admin email + password.

## What it runs

A Compose stack on an internal network, fronted by a Caddy reverse proxy:

```
mariadb + redis
  → schemas-init      (create DBs, load schema)
  → ui-build          (publish UI assets)
  → schemas-populate  (accounts, keys, factory pool)
  → server-pod + factory
  → caddy             (TLS, static files, routing)
```

Optional `jitsi` / `mail` / `dns` profiles can be enabled later. The images are
pulled from the public registry — you don't build anything.

## Manage it

Everything lives in the install directory (default `./drumee`). From there:

```bash
cd drumee

# health & status
DRUMEE_DIR=. drumee-ctl status
DRUMEE_DIR=. drumee-ctl doctor

# logs
docker compose logs -f server-pod

# stop / start
docker compose down
docker compose up -d
```

## Upgrade & rollback

```bash
DRUMEE_DIR=. drumee-ctl upgrade     # pull new images + restart (schema upgrades apply automatically)
DRUMEE_DIR=. drumee-ctl rollback    # revert to the previous version
```

## Back up & restore

```bash
DRUMEE_DIR=. drumee-ctl backup                 # dump the database + config
DRUMEE_DIR=. drumee-ctl restore <backup-file>
```

## Configuration

The stack is rendered from a single `drumee.yaml`. To change settings (domain,
TLS mode, ports, optional services), edit `drumee/drumee.yaml` and re-run the
installer — it re-renders `.env` / `docker-compose.yml` / `Caddyfile` and re-applies.

## Where to next

- 🚀 **[Production & operations](/self-hosting/operations)** — real domain, TLS, SMTP, day-2 ops
- 📦 Prefer no containers? See the **[Debian / Ubuntu guide](/self-hosting/debian)**
