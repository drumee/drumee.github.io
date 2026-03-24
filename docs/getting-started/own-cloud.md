---
sidebar_position: 1
title: Own Cloud
description: Deploy and manage your own Drumee instance on Docker or bare metal Linux
---

# Own Cloud

Drumee is designed as a **fully standalone, sovereign infrastructure**. You own the entire stack — no third-party services are required for the core platform to function.

Two deployment options are supported:

- **Docker** — recommended for development and most self-hosted setups
- **Bare metal** — for Linux environments where containers are not available

---

## Architecture Overview

Drumee is packaged as four Debian packages, all built from the [`drumee/debian`](https://github.com/drumee/debian) repository:

| Package | Repository | Contents |
|---------|-----------|---------|
| `static` | `drumee/static` | Fonts, icons, locale files, stylesheets |
| `schemas` | `drumee/schemas` | MariaDB stored procedures and table definitions |
| `server-team` | `drumee/server-team` | Backend Node.js services and ACL configuration |
| `ui-team` | `drumee/ui-team` | Frontend LETC rendering engine |

Both Docker and bare metal installations use the same four packages. Docker simply wraps them in a container with all system dependencies pre-installed.

---

## Dependencies

The following system packages are required by Drumee:

- `nginx` — reverse proxy and static file serving
- `mariadb-server` — primary database
- `nodejs` (v22) — backend runtime
- `redis-server` — Bull Queue and caching
- `graphicsmagick` — image processing
- `libreoffice` — document-to-PDF conversion for indexing
- `ffmpeg` — video processing
- `postfix` + `opendkim` — outbound mail delivery
- `bind9` — local DNS (used in Docker deployment)

---

## Hardware Requirements

| Resource | Minimum |
|----------|---------|
| RAM | 8 GB |
| CPU | 2 GHz |
| Disk | Enough to host your data (dedicated disk or partition recommended) |

**Recommendations:**

- Drumee should be installed on a dedicated disk or partition
- MFS data (`/data`) should not be on the same partition as the server (`/srv`)
- For high read/write workloads, install the database partition (`/srv/db`) on a fast disk

**Caution:**

- The configured domain name cannot be shared with any existing or future application
- It is not recommended to share the OS server with any other application

---

## Option A — Docker (Recommended)

### Step 1 — Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Allow your user to run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker run hello-world
```

### Step 2 — Clone the Docker build repository

This repository is private — SSH access to the `drumee` GitHub organisation is required.

```bash
git clone git@github.com:drumee/docker-file.git
cd docker-file
```

### Step 3 — Edit the Dockerfile

Two changes are required before building:

**a) Comment out the Jitsi section** (conferencing is disabled):

```bash
nano Dockerfile
```

Find the `# Jitsi` block near the end and comment out all five lines:

```dockerfile
# Jitsi
# RUN curl -sS https://download.jitsi.org/jitsi-key.gpg.key | gpg --dearmor | tee /etc/apt/trusted.gpg.d/jitsi-key.gpg
# RUN echo "deb https://download.jitsi.org stable/" | tee /etc/apt/sources.list.d/jitsi-stable.list
# RUN apt-get update
# RUN debconf-set-selections /var/lib/drumee/init.d/preset-jitsi
# RUN DEBIAN_FRONTEND="noninteractive" apt-get install -y jitsi-meet
```

**b) Remove `software-properties-common`** from the main package list (line 5).
This package is Ubuntu-only and does not exist on Debian — the build will fail if it is left in.

Verify both changes:

```bash
grep -n "jitsi\|Jitsi\|software-properties-common" Dockerfile
# Expected: only commented lines for Jitsi, nothing for software-properties-common
```

### Step 4 — Build the Docker image

```bash
docker build -t drumee/dist:local .
```

This step downloads and installs all system dependencies. It takes approximately 10-20 minutes depending on network speed. All 14 build steps must complete with `FINISHED` status.

### Step 5 — Prepare the Compose file

```bash
cd ~
git clone git@github.com:drumee/docker-hosted.git
cd docker-hosted

# Create a local copy of the compose template
cp local-domain.yaml drumee.yaml
```

Create the volume directories Docker will mount into the container:

```bash
mkdir -p ~/.config/local.drumee/storage/db
mkdir -p ~/.config/local.drumee/storage/data
mkdir -p ~/.config/local.drumee/storage/exchange
mkdir -p ~/build/local.drumee
```

### Step 6 — Configure the Compose file

```bash
nano drumee.yaml
```

Make the following changes:

**a) Set the correct image tag** (built locally in Step 4):

```yaml
image: drumee/dist:local
```

**b) Replace `BASE` with your actual username** in the volumes section:

```yaml
volumes:
  - /home/YOUR_USERNAME/.config/local.drumee/storage/db:/srv/db
  - /home/YOUR_USERNAME/.config/local.drumee/storage/data:/data
  - /home/YOUR_USERNAME/.config/local.drumee/storage/exchange:/exchangearea
  - /home/YOUR_USERNAME/build/local.drumee:/mnt/devel
  - /home/YOUR_USERNAME:/home/YOUR_USERNAME:ro
```

**c) Review environment variables** — for a local development setup the defaults work as-is:

```yaml
environment:
  - PRIVATE_DOMAIN=local.drumee
  - DRUMEE_REPO=app.drumee.com       # DO NOT CHANGE
  - INFRA_COMPONENTS=all             # DO NOT CHANGE
  - DRUMEE_DESCRIPTION=My Drumee Dev Server
  - ADMIN_EMAIL=admin@local.drumee
  - ACME_EMAIL_ACCOUNT=admin@local.drumee
  - INSTANCE_TYPE=devel
```

Verify no `BASE` or `latest` remain:

```bash
grep -n "BASE\|dist:latest" drumee.yaml
# Expected: no output
```

### Step 7 — Add local DNS entry

For the browser to resolve `local.drumee`, add it to the host machine's `/etc/hosts`:

```bash
echo "127.0.0.1 local.drumee" | sudo tee -a /etc/hosts
```

### Step 8 — Start the container

```bash
docker compose -f drumee.yaml up
```

The first boot installs all four Drumee packages and initialises the database. This takes approximately 5-15 minutes. When installation is complete, the container prints:

```
Installation completed!
open /data/tmp/welcome.html to get reset link
```

Along with an HTML block containing the admin password reset URL.

To run the container in the background after the first boot:

```bash
# Stop the foreground process
Ctrl+C

# Restart in detached mode
docker compose -f drumee.yaml up -d
```

### Step 9 — Set the admin password

Open the reset URL printed by the container in a browser:

```
https://local.drumee/-/#/welcome/reset/<token>
```

The browser will show an SSL certificate warning for the local domain — click **Advanced → Accept** to proceed. Set your admin password and log in.

---

## Option B — Bare Metal

Drumee supports installation directly on a Linux-based server.

The build scripts are located in the [`drumee/debian`](https://github.com/drumee/debian) repository. Each package subdirectory (`schemas/`, `server/`, `ui/`, `static/`) contains a `build.sh` script that compiles and packages the corresponding component.

Detailed bare metal installation steps depend on your specific environment. Contact your infrastructure administrator for a site-specific runbook.

---

## Runtime Architecture

Once installed, a Drumee instance runs two Node.js processes per endpoint:

### `index.js` — Page and WebSocket server

- Loaded at: `/`
- Handles HTTP page serving and real-time WebSocket connections
- Manages user sessions and push events via the LETC Router

### `service.js` — Micro service server

- Loaded at: `/-/svc/`
- Handles all REST service calls: `/-/svc/module.method`
- Loads ACL configuration and service modules at startup
- Supports hot-reload of plugins via `Acl.loadPlugins`

Both processes are managed by **PM2** through a Drumee-specific wrapper.

---

## Accessing a Running Instance

```bash
# 1. SSH into the host
ssh user@your-host

# 2. Switch to root
sudo -i

# 3. Enter the container (Docker) or service environment (bare metal)
drumee
```

---

## Operational Commands

```bash
# List all running endpoints
sudo drumee list

# Stream logs for an endpoint
sudo drumee log <id|name>

# Restart a service
sudo drumee restart <service-name>
```

---

## File Structure

```
/srv/drumee/
  server-team/        # Backend services and ACL configuration
    acl/              # ACL JSON files (one per module)
    service/          # Service implementation files

/etc/drumee/
  credentials/        # Long-lived credentials (API keys, secrets)
  drumee.sh           # Environment configuration (non-sensitive)

/data/                # MFS file storage
/srv/db/              # MariaDB data directory
```

---

## Configuration and Credentials

**Sensitive credentials** (API keys, bot tokens, service secrets) are stored in `/etc/drumee/credentials/` as JSON files. This directory is never committed to version control.

**Non-sensitive configuration** is stored in `yp.sys_conf` and accessed at runtime:

```js
const { Cache } = require('@drumee/server-core');
const conf = Cache.getSysConf();
```

Do not store credentials in `.env` files — they risk accidental git commits.

---

## See Also

- [Playground](./playground.md) — try the API without installing anything
- [Plugins](./plugins.md) — extend Drumee with custom backend services
- [ACL System](../concepts/acl-system.md) — how service permissions are configured
- [Stored Procedures](../api-reference/stored-procedures.md) — database calling conventions