---
id: 01-overview
title: Overview
slug: /self-hosting/overview
description: Self-host Drumee on your own server — choose between the Docker Compose stack or native Debian/Ubuntu packages.
---

# Self-Hosting Drumee

Run your own Drumee — auth, storage, backend, and frontend — on a server you
control. There are **two ways to install**, both generated from a single config
file (`drumee.yaml`), so you can pick whichever fits your environment.

## Choose your path

| | 🐳 **Docker Compose** *(recommended)* | 📦 **Debian / Ubuntu packages** |
|---|---|---|
| **Best for** | Most people — quickest, isolated, easy upgrades | A dedicated VM you want configured at the OS level (IaC, bare metal) |
| **You install** | Docker + one command | `apt install drumee` on a fresh host |
| **Footprint** | Containers on an internal network | Configures the whole machine (nginx, MariaDB, …) |
| **Upgrades** | `drumee-ctl upgrade` (pull + restart) | `apt upgrade` |
| **Isolation** | Fully isolated from the host | Runs directly on the host |
| **Guide** | [Docker Compose →](/self-hosting/docker-compose) | [Debian packages →](/self-hosting/debian) |

**Not sure? Use Docker Compose.** It's the fastest path, doesn't touch the rest
of your machine, and has first-class upgrade/rollback.

## What you'll need

- **A Linux host.** A small VPS or VM is plenty (2 vCPU / 4 GB RAM / 20 GB disk to start).
- **A domain name** pointed at the host, if you want automatic HTTPS. *(Optional —
  both channels also support a no-domain / local mode for trying it out.)*
- **Ports 80 and 443** reachable for TLS.
- Root / `sudo` on the host.

You do **not** need to build anything or have any Drumee accounts — the installers
pull prebuilt, signed artifacts.

## The 60-second version

**Docker Compose:**
```bash
curl -fsSL https://get.drumee.io | bash
```
Answer 3–4 questions (name, how people reach it, admin email/password). It renders
the stack, starts it, waits until healthy, and prints your URL + admin login.

**Debian / Ubuntu:**
```bash
curl -fsSL https://get.drumee.io/native | sudo bash
```
Installs Node 20, adds the signed Drumee APT repo, and `apt install drumee` on the host.

## What gets installed

Either way you get the four runtime components:

| Component | Role |
|---|---|
| **server-pod** | Backend — REST API + page/WebSocket server (Node.js) |
| **ui-pod** | Frontend — the Drumee web UI |
| **schemas** | MariaDB schema, seed data, and upgrade patches |
| **infra** | Host config — reverse proxy, TLS, and optional mail/DNS/Jitsi |

plus MariaDB and Redis. The first run also creates your **admin account** and seeds
the system so you can log in immediately.

## Next steps

- 🐳 **[Docker Compose guide](/self-hosting/docker-compose)** — the recommended path, step by step
- 📦 **[Debian / Ubuntu guide](/self-hosting/debian)** — native install on a dedicated host
- 🚀 **[Production & operations](/self-hosting/operations)** — real domain, TLS, email, backups, upgrades
