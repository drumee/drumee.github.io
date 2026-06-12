---
id: 12-deployment
title: Deployment
slug: /package-building/deployment
description: Manual deployment workflow, drumee CLI reference, and credential setup for Drumee Debian packages
---

# Deployment

This repository builds `.deb` packages; it does not currently ship canned deployment scripts. Deploy by transferring the built `.deb` files to the target server and installing them with `dpkg -i` in dependency order.

> Earlier revisions referenced `update.sh` / `update-2.sh` download-and-install scripts. Those are no longer part of the repository — use the manual workflow below, or write a small wrapper that `scp`s a known version set and installs it.

---

## Manual Deployment Workflow

### Full fresh install

```bash
# 1. Build all packages (on build machine)
./build-all.sh

# 2. Transfer .deb files to target server (each lands in <package>/build/)
scp infra/build/drumee-infra_*.deb schemas/build/drumee-schemas_*.deb \
    server/build/drumee-server-pod_*.deb ui/build/drumee-ui-pod_*.deb \
    static/build/drumee-static_*.deb user@server:/tmp/

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
scp schemas-patch/build/drumee-patch_*.deb user@server:/tmp/
# On server:
dpkg -i /tmp/drumee-patch_*.deb
drumee restart
```

Patches are staged on install and applied automatically at the next server startup. The `dpkg -i` triggers `postinst` which stages them; `drumee restart` applies them.

### Using DEB_BUILD_TARGET

Set `DEB_BUILD_TARGET` to automatically collect built `.deb` files in a staging directory. Note this applies only to `infra`, `schemas`, and `server` builds — `ui`, `static`, `schemas-patch`, and `builder` do not copy:

```bash
export DEB_BUILD_TARGET=/srv/packages/staging
server/build.sh
# drumee-server-pod_*.deb is now also in /srv/packages/staging/
```

---

## drumee CLI

The `drumee` command is installed by `drumee-server-pod` (to `/usr/sbin/drumee`) and wraps PM2 for process management:

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

Sensitive credentials live in `/etc/drumee/credential/` as JSON files and are **never** committed to source control. They are generated during the `drumee-infra` and `drumee-schemas` post-install steps (DB, redis, email, etc.); runtime configuration is read by the server via `yp.sys_conf`, not from environment files.

```
/etc/drumee/credential/
├── db.json       # MariaDB connection details
├── email.json    # outbound email auth
├── redis.json    # Redis connection details
└── ...
```
