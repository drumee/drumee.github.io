---
id: architecture
title: Architecture
slug: /self-hosting/architecture
description: What runs inside a Drumee deployment — mandatory core services and optional add-ons (DNS, conferencing, document editing).
---

# Architecture

A Drumee deployment is built around a **mandatory core** plus a set of **optional
add-on services** you enable only when you need them. Every service — core and
optional — runs on an internal network; only the reverse proxy and the ports that
external clients actually dial are exposed.

## Drumee Core (mandatory)

These services are always present. They make up the Drumee platform itself.

| Service | Role |
|---|---|
| **server-pod** | Backend — REST API, WebSocket, and page server (Node.js, two processes: `index.js` + `service.js`) |
| **ui-pod** | Frontend — the Drumee web OS UI (static assets served by the reverse proxy after the build step) |
| **MariaDB** | Relational database — accounts, content metadata, ACL state, chat history, and all schema classes |
| **Redis** | Session cache and pub/sub event bus |
| **Reverse proxy** | TLS termination, static-file serving, and request routing to the backend (Caddy on Docker, nginx on Debian) |

One-shot initialisation containers run in order before the core starts:

| Container | When | What it does |
|---|---|---|
| `schemas-init` | First start | Creates all MariaDB database classes and loads the schema |
| `ui-build` | First start | Compiles and publishes UI assets into the shared volume |
| `schemas-populate` | First start | Seeds the admin account, entity pool, and system keys |

## Optional services

Optional services are disabled by default and can be enabled independently of each
other. On Docker Compose they are activated through Compose profiles; on Debian/Ubuntu
they are installed as additional packages or controlled via `INFRA_COMPONENTS` in
the host configuration.

### DNS server

| | |
|---|---|
| **Purpose** | Authoritative DNS — lets Drumee host the domain's DNS records itself, without a third-party registrar nameserver |
| **Based on** | BIND 9 |
| **Ports** | `53/tcp`, `53/udp` |
| **When to enable** | When your registrar delegates the zone to the Drumee host, or when running in an isolated / air-gapped network that needs internal DNS resolution |
| **When to skip** | You already manage DNS elsewhere (Cloudflare, your registrar's panel, Route 53, …) — this is the common case for most deployments |

### Conference server (Jitsi)

| | |
|---|---|
| **Purpose** | In-platform video conferencing and screen sharing |
| **Based on** | [Jitsi Meet](https://jitsi.org/) (Jitsi Videobridge + Jicofo) with Prosody as the XMPP signaling layer |
| **Ports** | `10000/udp` (WebRTC media), `5222/tcp` (XMPP signaling — Prosody) |
| **When to enable** | You want integrated video calls without relying on a third-party conferencing service |
| **When to skip** | You'll embed an external meeting URL, or you don't need in-platform video calls |

:::note Firewall requirement
Port `10000/udp` must be reachable from clients for WebRTC media to flow.
If your host is behind NAT or a strict firewall, open that port before enabling Jitsi.
:::

### Document server (Euro Office)

| | |
|---|---|
| **Purpose** | Collaborative document editing — opens and saves Office documents (`.docx`, `.xlsx`, `.pptx`, …) directly in the browser |
| **Based on** | Euro Office |
| **When to enable** | Users need to co-edit Office documents without leaving Drumee |
| **When to skip** | You only need file storage and sharing, not in-browser editing of Office formats |

## Port summary

| Port | Protocol | Service | Required |
|---|---|---|---|
| `80` | TCP | Reverse proxy (HTTP → HTTPS redirect) | Yes |
| `443` | TCP | Reverse proxy (HTTPS) | Yes |
| `53` | TCP + UDP | DNS server | Only if DNS add-on is enabled |
| `10000` | UDP | Jitsi media (WebRTC) | Only if conferencing is enabled |
| `5222` | TCP | Prosody XMPP (Jitsi signaling) | Only if conferencing is enabled |

## See also

- 🐳 **[Docker Compose install](/self-hosting/docker-compose)** — spin up the full stack with one command
- 📦 **[Debian / Ubuntu install](/self-hosting/debian)** — native packages on a dedicated host
- 🚀 **[Production & operations](/self-hosting/operations)** — TLS, email, backups, upgrades
