---
id: 12-deployment
title: Deployment
slug: /package-building/deployment
description: Manual deployment workflow, drumee CLI reference, and credential setup for Drumee Debian packages
---

# Deployment

## Manual Deployment Workflow

### Full fresh install

```bash
# 1. Build all packages (on build machine)
./build-all.sh

# 2. Transfer .deb files to target server
scp infra/drumee-infra_*.deb schemas/drumee-schemas_*.deb \
    server/drumee-server-pod_*.deb ui/drumee-ui-pod_*.deb \
    static/drumee-static_*.deb user@server:/tmp/

# 3. Install in dependency order (on target server)
dpkg -i /tmp/drumee-infra_*.deb
dpkg -i /tmp/drumee-schemas_*.deb
dpkg -i /tmp/drumee-static_*.deb
dpkg -i /tmp/drumee-server-pod_*.deb
dpkg -i /tmp/drumee-ui-pod_*.deb
```

### Patch-only update

When only schema patches are needed:

```bash
schemas-patch/build.sh --manifest=auto
scp schemas-patch/drumee-patch_*.deb user@server:/tmp/
# On server:
dpkg -i /tmp/drumee-patch_*.deb
drumee restart
```

Patches are staged on install and applied automatically at the next server startup. The `dpkg -i` triggers `postinst` which stages them; `drumee restart` applies them.

### Using DEB_BUILD_TARGET

Set `DEB_BUILD_TARGET` to automatically copy built `.deb` files to a staging directory after each build:

```bash
export DEB_BUILD_TARGET=/srv/packages/staging
server/build.sh --force=yes
# drumee-server-pod_*.deb is now in /srv/packages/staging/
```

---

## drumee CLI

The `drumee` command is installed by `drumee-server-pod` and wraps PM2 for process management:

```bash
drumee start <service>         # start a service
drumee stop <service>          # stop a service
drumee restart                 # restart all Drumee services
drumee restart <user>/service  # restart a specific plugin service
drumee log <service>           # tail PM2 logs
drumee log <user>/service      # tail plugin service logs
```

---

## Credentials and Configuration

Sensitive credentials live in `/etc/drumee/credentials/` as JSON files and are **never** committed to source control. Runtime configuration is read by the server via `yp.sys_conf` — not from environment files.

After installing `drumee-server-pod`, populate credentials before starting the server:

```
/etc/drumee/credentials/
├── db.json       # MariaDB connection details
├── redis.json    # Redis connection details
└── ...
```

See [Own Cloud](../getting-started/02-own-cloud) for the full deployment walkthrough.
