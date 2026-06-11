---
id: 05-package-server
title: "Package: drumee-server-pod"
slug: /package-building/package-server
description: drumee-server-pod package — Node.js backend services, REST API, WebSocket, PM2 setup
---

# Package: drumee-server-pod

**Directory:** `server/`
**Debian package:** `drumee-server-pod`
**Current version:** 2.9.44

## Purpose

The Drumee backend. Installs the Node.js server processes that handle:

- REST API calls via `/-/svc/module.method`
- WebSocket connections for real-time features
- File operations via the MFS abstraction
- ACL enforcement on every request
- PM2 process management

Two Node.js processes run per endpoint: `index.js` (page serving + WebSocket) and `service.js` (REST API).

## Source Repos

| Repo | Branch | Destination |
|---|---|---|
| `server-team` | preview | `/srv/drumee/runtime/server/main/` |

## Build

```bash
server/build.sh [--version=X.Y.Z] [--force=yes] [--email=user@example.com]
```

`update-changelog.sh` is called automatically at the start of the build.

### What Gets Packaged

- `node_modules/` — pre-installed npm dependencies
- `offline/` — offline assets (DB patch scripts, etc.)
- `package.json`
- `/etc/drumee/` — server configuration templates
- `/usr/` — drumee CLI and system scripts
- `/var/` — runtime var files
- `.pm2/`, `.cache/`, `.config/`, `.pm2/logs/` — PM2 process manager directories

## Installed Paths

```
/srv/drumee/runtime/server/main/   # server-team source + node_modules
/etc/drumee/
├── drumee.sh                       # runtime environment (sourced at startup)
└── credentials/                    # JSON credential files
/usr/local/bin/drumee               # drumee CLI
/var/lib/drumee/postinstall/
└── patch.sh                        # pending patches applied at startup
```

## Dependencies

```
nginx, redis-server, redis, node-redis, inotify-tools,
graphicsmagick, libgraphicsmagick1-dev, poppler-utils,
libreoffice, dcraw, curl, p7zip-full, ffmpeg
```

## Post-Install

On package install:
1. Sources `/etc/drumee/drumee.sh` to load the runtime environment
2. Applies any pending schema patches from `/var/lib/drumee/postinstall/patch.sh`

## update-changelog.sh

```bash
server/update-changelog.sh [--message="Custom message"] [--email=user@example.com]
```

Syncs the changelog from `server-team`'s `package.json`. See [Version Management](./11-version-management.md) for the selection logic.
