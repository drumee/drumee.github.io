---
id: 01-starter-kit
title: Starter Kit
slug: /getting-started/01-starter-kit
---

# Starter Kit

The Drumee Starter Kit is a **self-contained local development environment** that runs the full Drumee stack inside a single Docker container — MariaDB, nginx, Redis, and all Node.js services included. It is intended for developers who need a complete Drumee instance on their workstation.

Unlike the Playground, the Starter Kit gives you direct access to the database, stored procedures, and all service internals. However this mode has some limitations, such virtual hosting or organization features.

## Prerequisites

- Docker installed with your user added to the docker group

- Node.js v22 or later

Verify Node.js version:

```bash
node --version # Must be v22.x.x or later
```

## Step 1 — Build the Docker Image

The Starter Kit requires a locally built Docker image. Clone the docker-file repository and build from the starter-kit Dockerfile:

```bash
git clone git@github.com:drumee/docker-file.git
cd docker-file
docker build -f Dockerfile.starter-kit -t drumee/starter-kit:latest .
```

The image must be tagged `drumee/starter-kit:latest` — that is the exact tag the generated `docker.yaml` references (see Step 2). If you already have the published image, you can skip this build and let `docker compose` pull `drumee/starter-kit:latest` automatically.

This step installs all system dependencies (MariaDB, nginx, Redis, Node.js, etc.) inside the image. It takes approximately 10–20 minutes depending on network speed.

Verify the image was built:

```bash
docker images | grep drumee/starter-kit # Expected: drumee/starter-kit  latest  <id>  <size>
```

## Step 2 — Clone and Configure the Starter Kit

```bash
git clone git@github.com:drumee/starter-kit.git
cd starter-kit
npm install
npm run configure
```


npm run configure sets up the local host environment — it creates the required directory structure under storage/ and generates the initial docker.yaml.

After configure completes, open docker.yaml and verify the image tag matches what you built in Step 1:

> image: drumee/starter-kit:latest

## Step 3 — Add a Local DNS Entry

The Starter Kit uses local.drumee as its domain. Add it to your host machine's /etc/hosts:

```bash
echo "127.0.0.1 local.drumee" |
sudo tee -a
/etc/hosts
```


Verify:

```bash
ping -c1 local.drumee # Expected: PING local.drumee (127.0.0.1)
```

## Step 4 — Start the Container

```bash
docker compose -f docker.yaml up -d
```


This starts the container in detached mode. The container runs a persistent bash session — no services start automatically at this point.

Verify the container is running:

```bash
docker ps |
grep starter-kit
```

## Step 5 — Configure the Server (First Time Only)

Run the configuration script inside the container. This initialises the database, creates the drumee-app MariaDB user, and generates server configuration files:

```bash
npm run server.configure
```


This only needs to be run once. On subsequent starts, skip directly to Step 6\.

## Step 6 — Start All Services

```bash
npm run server.start
```


This starts MariaDB, nginx, and Redis, verifies system users exist in the database, and starts all Node.js services via PM2 — including the factory daemon.

Wait approximately 30 seconds for services to come online, then verify:

```bash
docker exec starter-kit pm2 list
```


All processes should show online status.

## Step 7 — Set the Admin Password

Set the admin password directly via the MariaDB shell inside the container:

```bash
docker exec starter-kit mariadb yp -e "call set_password('admin@local.drumee', 'your-password')"
```


Replace admin@local.drumee with the admin email configured during setup and your-password with your chosen password.

Then open the Drumee interface in a browser:

```bash
http://local.drumee:8080
```


Log in with the admin email and the password you just set.

## Volume Structure

The docker.yaml maps the following host directories into the container:

| Host path | Container path | Contents |
| :---- | :---- | :---- |
| storage/db | /var/lib/drumee/db | MariaDB data files |
| storage/data | /var/lib/drumee/data | MFS file storage |
| runtime | /var/lib/drumee/runtime | Node.js server and service code |
| plugins | /var/lib/drumee/plugins | Custom plugins |
| docker.d | /var/lib/drumee/start.d | Start and configure scripts |
| bin | /usr/share/drumee/bin (read-only) | Helper shell scripts |


All persistent data (database, uploaded files) lives in storage/ on the host. The container can be recreated without losing data. 

## Port Mapping

| Host port | Container port | Service |
| :---- | :---- | :---- |
| 8080 | 80 | HTTP |
| 4443 | 443 | HTTPS |

## Restarting After a Machine Reboot

The container does not start automatically after a host reboot:

```bash
cd ~/starter-kit
docker compose -f docker.yaml up -d
npm run server.start
```

## Useful Commands

```bash
# Open a shell inside the container npm run server.shell
# Check PM2 process status docker exec starter-kit pm2 list
# Stream PM2 logs for a specific process docker exec starter-kit pm2 logs factory --lines 50
# Check the entity pool (should grow over time toward ~210 per type) docker exec starter-kit mariadb yp -e \\
"SELECT type, COUNT(*) as count FROM entity WHERE area='pool' GROUP BY type;"
# Stop the container docker compose -f docker.yaml down
```

## How the Factory Daemon Works

The factory PM2 process pre-creates schema pools for new Hub and Drumate entities. On a fresh install it starts with a small pool and grows gradually toward the configured watermark (210 per type by default). The pool count increasing over the first few minutes after start is normal.

