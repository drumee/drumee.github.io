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
optionally BIND/Postfix/Prosody). Run it on a **fresh, dedicated Debian 13 or
Ubuntu server/VM** — not your laptop or a box already running other services.
:::

## Requirements

- A **fresh Debian 13 (trixie)** or recent Ubuntu host — a VPS or VM.
- **Root / sudo.**
- A **domain** pointed at the host if you want a public certificate. Not required:
  the installer detects whether the host has a public address and offers a LAN-only
  or localhost install instead (see [How the installer asks](#how-the-installer-asks)).

Everything else (Node.js 22, MariaDB, nginx, Redis, pm2) is pulled in automatically.

## Install

```bash
curl -fsSL https://apt.drumee.net/debian.sh | sudo bash
```

This bootstrap:

1. adds the **signed Drumee APT repository**,
2. installs **Node.js 22** from NodeSource — required, not merely preferred: Trixie
   ships Node 20, and `drumee-node-runtime` (which supplies pm2) declares
   `nodejs (>= 22)`, so `apt install drumee` cannot resolve on Debian's own packages,
3. installs **BIND9** ahead of Drumee, then runs **`apt install drumee`** — the
   `drumee` metapackage pulls the components in the correct order
   (`infra → schemas → static → server → ui`),
4. each component's post-install configures the host: renders the reverse-proxy +
   TLS, restores the MariaDB schema, stocks the entity pool, creates your **admin
   account**, and launches the app under **pm2**,
5. → Drumee is serving at your domain.

## How the installer asks {#how-the-installer-asks}

The installer asks for **every** setting itself, reading the keyboard directly, and
preseeds the answers for the packages. It has to: on the `curl … | sudo bash` path
above, the script *is* standard input, so the packages' own prompts would never see a
terminal and would silently take every default.

Before asking anything it looks at the host's addresses and picks one of three shapes:

| Detected | Shape | Domain | Certificate |
|---|---|---|---|
| a **public** address | `wan` | yours, e.g. `example.com` | real wildcard, via a DNS-01 challenge |
| only **private** addresses | `lan` | `drumee.lan` | self-signed, with BIND9 serving the zone on your LAN |
| no routable address | `localhost` | `localhost` | self-signed |

On the `lan` shape it also asks **how the instance should be reached** — `dns` for
LAN-only, or `wireguard` to be reachable from outside **without opening a router
port**, which then makes a real certificate possible over DNS-01. The two are
mutually exclusive.

Every prompt offers a default; pressing Enter accepts it.

### Unattended install

Either preseed everything from a config file:

```bash
# produce a debconf preseed from your config
node config/render.mjs debconf --config drumee.yaml > install.conf

sudo PRESEED=install.conf bash debian.sh
```

…or answer with environment variables and disable prompting:

```bash
sudo DRUMEE_NONINTERACTIVE=1 \
     DRUMEE_DOMAIN=example.com \
     DRUMEE_ADMIN_EMAIL=admin@example.com \
     DRUMEE_TLS_METHOD=acme-dns-api \
     bash debian.sh
```

`DRUMEE_NONINTERACTIVE` unset or `0` means prompt; any other value means never
prompt. Setting any individual variable answers that one question and skips its
prompt, so a partly-scripted install just needs the answers you already know. The
full list is in the script's header comment.

## What gets installed

| Package | Provides |
|---|---|
| `drumee-infra` | Reverse proxy, TLS, host config, the pm2 launcher |
| `drumee-schemas` | MariaDB schema + seed + the populate step (accounts, pool, keys) |
| `drumee-server-pod` | Backend (REST + page/WebSocket), runs under pm2 |
| `drumee-ui-pod` | Frontend assets |
| `drumee-static` | Static assets, fonts, locales |
| `drumee-node-runtime` | pm2 and the pinned global Node modules — Debian packages no pm2. Pulls in `nodejs (>= 22)` |

Installed paths follow the standard layout: config in `/etc/drumee/`, runtime in
`/srv/drumee/`, data in your chosen data directory.

## Manage it

The native install ships a systemd unit plus the `drumee` CLI:

```bash
sudo systemctl status drumee-server-pod      # unit status
sudo drumee list                             # pm2 process list
sudo drumee restart                          # restart the app
sudo drumee log main                         # tail logs for one process
```

:::note `/etc/init.d/drumee` is gone as of `drumee-server-pod` 2.9.96
The CLI now lives **only** at `/usr/sbin/drumee` (already on `PATH`, hence plain
`drumee` above). It used to be installed at `/etc/init.d/drumee` as well, and because
nothing declared a systemd unit of that name, systemd generated a second one from it
that fought `drumee-server-pod.service` over the same pm2 daemon — costing a
five-minute stop job on **every shutdown**. Upgrading removes the old copies for you.
:::

Database and config live on the host (`/etc/drumee/`, your data dir, MariaDB).

## Upgrade

```bash
sudo apt update && sudo apt upgrade
```

New package versions bring their schema patches; the post-install applies them.

## Add the repository by hand

If you'd rather not pipe the bootstrap into a shell, the repository is served over
both **https** and **http** (apt verifies its GPG signature either way):

```bash
sudo install -d -m 0755 /etc/apt/keyrings
curl -fsSL https://apt.drumee.net/drumee-archive-keyring.asc \
  | sudo tee /etc/apt/keyrings/drumee.asc >/dev/null
echo "deb [signed-by=/etc/apt/keyrings/drumee.asc] https://apt.drumee.net/ ./" \
  | sudo tee /etc/apt/sources.list.d/drumee.list

# Node 22 from NodeSource — Trixie's own Node is 20, which cannot satisfy
# drumee-node-runtime's `nodejs (>= 22)`
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -

sudo apt update && sudo apt install drumee
```

## Manual install (from local packages)

If you already have the `.deb`s (e.g. on an air-gapped host), copy them over and:

```bash
# Node 22 first, for the reason above
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs

# install the packages (apt resolves MariaDB / nginx / etc.)
sudo apt-get install -y --no-install-recommends \
  -o Dpkg::Options::=--force-confold \
  -o Dpkg::Options::=--force-confdef ./drumee-*.deb
```

Both `--force-conf*` options matter: `drumee-infra` renders MariaDB's
`50-server.cnf` / `50-client.cnf`, so when `mariadb-client` is configured afterwards
dpkg finds files "created by you or by a script" and stops to ask. Unanswered, that
prompt fails the whole transaction and takes MariaDB, `drumee-schemas` and every
mariadb plugin with it. These options keep the Drumee-rendered versions and never
prompt.

## Where to next

- 🚀 **[Production & operations](/self-hosting/operations)** — domain, TLS, email, backups
- 🐳 Want isolation / easier upgrades instead? Use **[Docker Compose](/self-hosting/docker-compose)**
