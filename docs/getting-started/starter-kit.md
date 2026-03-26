---
sidebar_position: 4
---

# Starter Kit

The Drumee Starter Kit is a self-contained local development environment that runs the full Drumee stack inside a single Docker container. It is intended for backend developers who need a complete Drumee instance on their workstation — with MariaDB, nginx, Redis, and all Node.js services running locally.

Unlike the Playground, the Starter Kit gives you direct access to the database, stored procedures, and all service internals. Unlike the Own Cloud Docker setup, it requires no domain name or SSL certificate and is configured specifically for local development.

---

## Prerequisites

- Docker installed and your user added to the `docker` group
- Node.js v22 or later
- Git with SSH access to the `drumee` GitHub organisation

Verify Node.js version:

```bash
node --version
# Must be v22.x.x or later
```

---

## Step 1 — Build the Docker image

The Starter Kit requires a locally built Docker image. Clone the `docker-file` repository and build from the starter-kit Dockerfile:

```bash
git clone git@github.com:drumee/docker-file.git
cd docker-file
docker build -f Dockerfile.starter-kit -t drumee/starter:local .
```

This step installs all system dependencies (MariaDB, nginx, Redis, Node.js, etc.) inside the image. It takes approximately 10–20 minutes depending on network speed.

Verify the image was built:

```bash
docker images | grep drumee/starter
# Expected: drumee/starter   local   <id>   <size>
```

---

## Step 2 — Clone and configure the Starter Kit

```bash
git clone git@github.com:drumee/starter-kit.git
cd starter-kit
npm install
npm run configure
```

`npm run configure` sets up the local host environment — it creates the required directory structure under `storage/` and generates the initial `docker.yaml`.

After `configure` completes, open `docker.yaml` and verify the image tag matches what you built in Step 1:

```yaml
image: drumee/starter:local
```

---

## Step 3 — Add a local DNS entry

The Starter Kit uses `local.drumee` as its domain. Add it to your host machine's `/etc/hosts`:

```bash
echo "127.0.0.1 local.drumee" | sudo tee -a /etc/hosts
```

Verify:

```bash
ping -c1 local.drumee
# Expected: PING local.drumee (127.0.0.1)
```

---

## Step 4 — Start the container

```bash
docker compose -f docker.yaml up -d
```

This starts the container in detached mode. The container runs a persistent bash session — no services start automatically at this point.

Verify the container is running:

```bash
docker ps | grep starter-kit
```

---

## Step 5 — Configure the server (first time only)

Run the configuration script inside the container. This step initialises the database, creates the `drumee-app` MariaDB user, and generates the server configuration files:

```bash
npm run server.configure
```

This only needs to be run once. On subsequent starts, skip directly to Step 6.

---

## Step 6 — Start all services

```bash
npm run server.start
```

This runs the start script inside the container, which:

1. Starts MariaDB, nginx, and Redis
2. Verifies system users exist in the database (creates them if missing)
3. Starts all Node.js services via PM2, including the factory daemon

Wait approximately 30 seconds for services to come online, then verify:

```bash
docker exec starter-kit pm2 list
```

All processes should show `online` status.

---

## Step 7 — Set the admin password

Set the admin password directly via the MariaDB shell inside the container:

```bash
docker exec starter-kit mariadb yp -e "call set_password('admin@local.drumee', 'your-password')"
```

Replace `admin@local.drumee` with the admin email configured during setup and `your-password` with your chosen password.

Then open the Drumee interface in a browser:

```
http://local.drumee:8080
```

Log in with the admin email and the password you just set.

---

## Volume Structure

The `docker.yaml` maps the following host directories into the container:

| Host path | Container path | Contents |
|---|---|---|
| `storage/db` | `/var/lib/drumee/db` | MariaDB data files |
| `storage/data` | `/data` | MFS file storage |
| `runtime` | `/srv/drumee/runtime` | Node.js server and service code |
| `plugins` | `/var/lib/drumee/plugins` | Custom plugins |
| `docker.d` | `/var/lib/drumee/start.d` | Start and configure scripts |

All persistent data (database, uploaded files) lives in `storage/` on the host. The container can be recreated without losing data.

---

## Port Mapping

| Host port | Container port | Service |
|---|---|---|
| `8080` | `80` | HTTP |
| `4443` | `443` | HTTPS |

---

## Restarting After a Machine Reboot

The container does not start automatically after a host reboot. Run these two commands each time:

```bash
cd ~/starter-kit
docker compose -f docker.yaml up -d
docker exec starter-kit /var/lib/drumee/start.d/start
```

Or equivalently:

```bash
cd ~/starter-kit
docker compose -f docker.yaml up -d
npm run server.start
```

---

## Useful Commands

```bash
# Open a shell inside the container
npm run server.shell

# Check PM2 process status
docker exec starter-kit pm2 list

# Stream PM2 logs for a specific process
docker exec starter-kit pm2 logs factory --lines 50

# Check the entity pool (should grow over time)
docker exec starter-kit mariadb yp -e \
  "SELECT type, COUNT(*) as count FROM entity WHERE area='pool' GROUP BY type;"

# Stop the container
docker compose -f docker.yaml down
```

---

## How the Factory Daemon Works

The `factory` PM2 process pre-creates schema pools for new hub and drumate entities. On a fresh install it starts with a small pool and grows it over time toward the configured watermark (210 per type by default).

The pool count increases gradually — this is normal. Factory runs in the background and the pool will be full within a few minutes of first start.

---

## See Also

- [Own Cloud](https://drumee.github.io/getting-started/own-cloud) — production deployment on Docker or bare metal
- [Plugins](https://drumee.github.io/getting-started/plugins) — extend Drumee with custom backend services
- [ACL System](https://drumee.github.io/concepts/acl-system) — how service permissions are configured
- [Backend SDK Reference](https://drumee.github.io/api-reference/backend-sdk/) — all available services grouped by module