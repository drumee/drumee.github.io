---
id: 02-own-cloud
title: Own Cloud
slug: /getting-started/02-own-cloud
sidebar_position: 1
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

Follow the [official Docker documentation](https://docs.docker.com/engine/install/debian/) or run:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Allow your user to run Docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker run hello-world
```

### Step 2 — Clone the repository

```bash
git clone https://github.com/drumee/docker-hosted my-drumee
cd my-drumee
```

---

### Local Domain Setup

For development or private local access using `local.drumee`.

#### Step 3 — Run the install script

```bash
./install.local.sh
```

This copies `local-domain.yaml` to `my-docker.yaml`, replaces `BASE` with your username, creates the required volume directories, and starts the container.

If you prefer to run the steps manually instead:

```bash
cp local-domain.yaml my-docker.yaml
sed -i "s/BASE/$(whoami)/g" my-docker.yaml

mkdir -p $HOME/.config/local.drumee/storage/db
mkdir -p $HOME/.config/local.drumee/storage/data
mkdir -p $HOME/.config/local.drumee/storage/exchange
mkdir -p $HOME/build/local.drumee
```

Drumee uses its database to manage its own filesystem (MFS). File metadata is stored in the DB engine (`/srv/db`) while file contents are stored in `/data`. If possible, use dedicated disk partitions for these mount points, and a fast disk (SSD or NVMe) for the database volume.

#### Step 4 — Customise the Compose file (optional)

Edit `my-docker.yaml` to adjust environment variables:

```yaml
environment:
  - PRIVATE_DOMAIN=local.drumee           # default domain
  - DRUMEE_REPO=app.app.drumee.com        # DO NOT CHANGE 
  - INFRA_COMPONENTS=all                  # DO NOT CHANGE
  - DRUMEE_DESCRIPTION=My Drumee Dev Server
  - ADMIN_EMAIL=admin@local.drumee        # MANDATORY, set yours
  - ACME_EMAIL_ACCOUNT=admin@local.drumee
  - STORAGE_BACKUP=""   # Optional: [user@backup.org:]/path/to/backup
  - DB_BACKUP=""        # Optional: [user@backup.org:]/path/to/backup
  - INSTANCE_TYPE=devel
```

#### Step 5 — Add local DNS entry

For the browser to resolve `local.drumee`, add it to the host machine's `/etc/hosts`:

```bash
echo "127.0.0.1 local.drumee" | sudo tee -a /etc/hosts
```

#### Step 6 — Start the container

```bash
docker compose -f my-docker.yaml up
```

The first boot installs all four Drumee packages and initialises the database. This takes approximately 5–15 minutes.

To run in the background after the first boot:

```bash
docker compose -f my-docker.yaml up -d
```

#### Step 7 — Monitor installation

```bash
sudo docker logs --follow drumee
```

When installation is complete, the container prints:

```
Installation completed!
open /data/tmp/welcome.html to get reset link
```

#### Step 8 — Set the admin password

Open the reset URL printed by the container in a browser:

```
https://local.drumee/-/#/welcome/reset/<token>
```

The browser will show an SSL certificate warning for the local domain — click **Advanced → Accept** to proceed. Set your admin password and log in.

You can set the password at anytime with 

```bash
  docker exec drumme mariadb yp -e "call set_password('admin@local.drumee', 'your-password')"
```

---

### Public Domain Setup

For an internet-accessible server with a real domain name. 

#### Prerequisites

- A domain name with full DNS zone control
- At least one public IP address (IPv4 and/or IPv6)
- Docker Engine 20 or higher

#### Step 3 — Configure DNS records (optionan)

Drumee can configure its own DNS server to automatically deploy SSL certificates it requires. If you already have your own SSL certificates and want to use them, you cam skip this step and just set the variable OWN_CERTS_DIR=/path/to/your/certs/dir.


In your domain provider's DNS zone, remove all existing records and create the following (replace `example.org` with your domain):

| Domain Name | Type | Target |
|-------------|------|--------|
| `example.org` | A | your IPv4 address |
| `example.org` | AAAA | your IPv6 address |
| `ns1.example.org` | A | your IPv4 address |
| `ns1.example.org` | AAAA | your IPv6 address |
| `ns2.example.org` | A | your IPv4 address |
| `ns2.example.org` | AAAA | your IPv6 address |

Set your domain's Name Servers to `ns1.example.org` and `ns2.example.org`, and register both as GLUE records with your registrar.

Verify DNS propagation:

```bash
nslookup example.org
```

#### Step 4 — Configure the Compose file

```bash
cp template.yml drumee.yml
```

Edit `drumee.yml` with your values:

```yaml
hostname: example.org   # your domain name

environment:
  - "PUBLIC_IP4=0.0.0.0"              # your IPv4 address
  - "PUBLIC_IP6=000:000:000:000::"    # your IPv6 address
  - DRUMEE_DOMAIN_NAME=example.org    # MANDATORY
  - DRUMEE_REPO=app.app.drumee.com    # DO NOT CHANGE
  - INFRA_COMPONENTS=all              # DO NOT CHANGE
  - DRUMEE_DESCRIPTION=My Drumee Box
  - ADMIN_EMAIL=admin@example.org     # MANDATORY, set yours
  - ACME_EMAIL_ACCOUNT=user@example.org
  - STORAGE_BACKUP=""   # Optional: [user@backup.org:]/path/to/backup
  - DB_BACKUP=""        # Optional: [user@backup.org:]/path/to/backup

volumes:
  - /path/to/volume/db:/srv/db
  - /path/to/volume/data:/data
  - /path/to/volume/exchange:/exchangearea
```

#### Step 5 — Start the container

```bash
sudo docker compose -f drumee.yml up -d
```

You may need to stop existing services if their ports conflict with Drumee's required ports.

#### Step 6 — Monitor installation

```bash
sudo docker logs --follow drumee
```

Once installation is complete, a password reset link is sent to `ADMIN_EMAIL`. Click the link to set the admin password.

---

## Option B — Bare Metal

For installation directly on a Debian 11+ server or virtual machine. This option installs all services natively without containers.

### Prerequisites

- Debian 11 or higher (Debian-family distributions only)
- A domain name with full DNS zone control
- At least one public IP address (IPv4 and/or IPv6)
- Root access to the server (not sudo — the install script must run as `root`)

### Step 1 — Configure DNS records

In your domain provider's DNS zone, remove all existing records and create the following (replace `example.org` with your domain):

| Domain Name | Type | Target |
|-------------|------|--------|
| `example.org` | A | your IPv4 address |
| `example.org` | AAAA | your IPv6 address |
| `ns1.example.org` | A | your IPv4 address |
| `ns1.example.org` | AAAA | your IPv6 address |
| `ns2.example.org` | A | your IPv4 address |
| `ns2.example.org` | AAAA | your IPv6 address |

Set your domain's Name Servers to `ns1.example.org` and `ns2.example.org`, and register both as GLUE records with your registrar.

Verify DNS propagation before proceeding:

```bash
nslookup example.org
```

### Step 2 — Clone the repository

```bash
git clone https://github.com/drumee/debian-hosted.git
cd debian-hosted
```

### Step 3 — Configure settings

```bash
cp env.sh drumee.sh
```

Edit `drumee.sh` with your values:

```bash
export DRUMEE_DESCRIPTION="My Drumee Box"         # shown on login page

export DRUMEE_DOMAIN_NAME=""   # MANDATORY: your domain name
export PUBLIC_IP4=""           # MANDATORY: your IPv4 address
export PUBLIC_IP6=""           # optional: your IPv6 address

export ADMIN_EMAIL=""          # MANDATORY: becomes the admin account

export DRUMEE_DB_DIR=""        # optional: defaults to /srv/db
export DRUMEE_DATA_DIR=""      # optional: defaults to /data

export STORAGE_BACKUP=""       # optional: [user@host:]/path/to/backup

export ACME_EMAIL_ACCOUNT=""   # optional: defaults to ADMIN_EMAIL
```

**Ensure `DRUMEE_DB_DIR` and `DRUMEE_DATA_DIR` exist and have sufficient space before running the installer.** If left empty, `/srv/db` and `/data` will be created automatically.

### Step 4 — Check for port conflicts

The installer requires these ports to be free: `53`, `80`, `443`, `3478`, `5222`, `5269`, `5280–5283`, `5349`, `10000`. Stop any services that conflict before proceeding.

### Step 5 — Run the installer

The install script must be run as the `root` user (not via `sudo`):

```bash
su -
cd /path/to/debian-hosted
./install
```

The installer:
1. Installs all system dependencies (nginx, MariaDB, Node.js v21, Redis, Jitsi, Postfix, bind9, ffmpeg, LibreOffice, and more)
2. Downloads and installs the Drumee Debian packages from the package repository
3. Generates SSL certificates via the ACME server
4. Starts all services (drumee, nginx, mariadb, redis, prosody, jitsi, postfix)

Installation takes approximately 15–30 minutes depending on network speed.

### Step 6 — Set the admin password

Once the installer completes, a password reset link is sent to `ADMIN_EMAIL`. Click the link to set the admin password and log in.

### Reinstalling

To reinstall Drumee packages without reinstalling system dependencies, use the `reinstall` symlink:

```bash
su -
cd /path/to/debian-hosted
./reinstall
```

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


## Note for maintainers

The build scripts are located in the [`drumee/debian`](https://github.com/drumee/debian) repository. Each package subdirectory (`schemas/`, `server/`, `ui/`, `static/`) contains a `build.sh` script that compiles and packages the corresponding component.                                                               

## See Also

- [Playground](./03-playground.md) — try the API without installing anything
- [Plugins](./04-plugins.md) — extend Drumee with custom backend services
- [ACL System](../technology/02-acl-system.md) — how service permissions are configured
- [Stored Procedures](../api-reference/stored-procedures.md) — database calling conventions