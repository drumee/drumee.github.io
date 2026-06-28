---
id: 03-debian-native
title: Debian / Ubuntu packages
slug: /self-hosting/debian
description: Install Drumee natively on a Debian or Ubuntu host with apt — no Docker required.
---

# Install on Debian / Ubuntu (no Docker)

Install Drumee **directly on the host** as native `.deb` packages via `apt`. No
Docker involved — the packages configure the machine itself (reverse proxy,
database, process manager, TLS).

:::caution Use a dedicated host
The native install **reconfigures the whole machine** (nginx, MariaDB, and
optionally BIND/Postfix/Prosody). Run it on a **fresh, dedicated Debian 12 or
Ubuntu server/VM** — not your laptop or a box already running other services.
:::

## Requirements

- A **fresh Debian 12 (bookworm)** or recent Ubuntu host — a VPS or VM.
- A **domain** pointed at the host (for real HTTPS), ports **80/443** open.
- **Root / sudo.**

Everything else (Node.js 20, MariaDB, nginx, Redis, pm2) is pulled in automatically.

## Install

```bash
curl -fsSL https://get.drumee.com/native | sudo bash
```

This bootstrap:

1. installs **Node.js 20** (from NodeSource — Drumee's runtime needs ≥ 20),
2. adds the **signed Drumee APT repository**,
3. runs **`apt install drumee`** — the `drumee` metapackage pulls the components in
   the correct order (`infra → schemas → static → server → ui`),
4. each component's post-install configures the host: renders the reverse-proxy +
   TLS, restores the MariaDB schema, stocks the entity pool, creates your **admin
   account**, and launches the app under **pm2**,
5. → Drumee is serving at **`https://<your-domain>/`**.

You'll be prompted (via debconf) for your domain, admin email, and storage paths.

### Unattended install

Render the answers ahead of time and feed them in:

```bash
# produce a debconf preseed from your config
node config/render.mjs debconf --config drumee.yaml > install.conf

sudo PRESEED=install.conf bash install-native.sh
```

## What gets installed

| Package | Provides |
|---|---|
| `drumee-infra` | Reverse proxy, TLS, host config, the pm2 launcher |
| `drumee-schemas` | MariaDB schema + seed + the populate step (accounts, pool, keys) |
| `drumee-server-pod` | Backend (REST + page/WebSocket), runs under pm2 |
| `drumee-ui-pod` | Frontend assets |
| `drumee-static` | Static assets, fonts, locales |

Installed paths follow the standard layout: config in `/etc/drumee/`, runtime in
`/srv/drumee/`, data in your chosen data directory.

## Manage it

The native install ships a systemd unit and an init script:

```bash
sudo systemctl status drumee-server-pod      # service status
sudo /etc/init.d/drumee status               # pm2 process list
sudo /etc/init.d/drumee restart              # restart the app
sudo /etc/init.d/drumee log                  # tail logs
```

Database and config live on the host (`/etc/drumee/`, your data dir, MariaDB).

## Upgrade

```bash
sudo apt update && sudo apt upgrade
```

New package versions bring their schema patches; the post-install applies them.

## Manual install (from packages)

If you already have the `.deb`s (e.g. on an air-gapped host), copy them over and:

```bash
# Node 20 first (Drumee needs >= 20; Debian ships 18)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# install the packages (apt resolves MariaDB / nginx / etc.)
sudo apt-get install -y --no-install-recommends \
  -o Dpkg::Options::=--force-confold ./drumee-*.deb
```

`--force-confold` keeps the Drumee-rendered MariaDB config when prompted.

## Where to next

- 🚀 **[Production & operations](/self-hosting/operations)** — domain, TLS, email, backups
- 🐳 Want isolation / easier upgrades instead? Use **[Docker Compose](/self-hosting/docker-compose)**
