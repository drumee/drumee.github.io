---
id: 01-overview
title: Overview
slug: /package-building/overview
description: Package map, runtime directory layout, and install order for the Drumee Debian packages
---

# Overview

This repository contains the Debian packaging infrastructure for the **Drumee** platform — a sovereign data infrastructure that functions as a Meta Operating System for self-hosted collaborative workspaces.

Each subdirectory is a self-contained package builder that clones source from `git@github.com:drumee/`, compiles it, and produces a `.deb` file via `dh_make` + `dpkg-buildpackage`.

## Package Map

| Directory | Debian package | Role at runtime | Source repo(s) |
|---|---|---|---|
| `infra/` | `drumee-infra` | System foundation: nginx, SSL (acme.sh), cron, utilities | `setup-infra` (main), `acme.sh` (GitHub) |
| `schemas/` | `drumee-schemas` | MariaDB schema definitions, seed data, install scripts | `setup-schemas` (main), `schemas` (preview) |
| `server/` | `drumee-server-pod` | Backend Node.js services: REST API + WebSocket | `server-team` (preview) |
| `ui/` | `drumee-ui-pod` | Frontend LETC rendering engine | `ui-team` (preview) |
| `static/` | `drumee-static` | Static assets, fonts, localization files | `static` (main) |
| `schemas-patch/` | `drumee-patch` | Incremental DB schema patches | `schemas` (preview) |
| `builder/` | `drumee-infra` | Interactive first-time installer with debconf setup wizard | `setup` (somanos/wip) |
| `admin/` | `drumee-schemas-patch` | Production schema-patch runner (interactive build via `check_*`) | local `opt/` scripts |

## Install Order

When deploying from scratch, install packages in this order to satisfy dependencies:

```
drumee-infra → drumee-schemas → drumee-static → drumee-server-pod → drumee-ui-pod
```

`drumee-patch` can be applied after `drumee-schemas` is installed.

## Runtime Directory Layout

After installation, Drumee occupies these paths:

```
/srv/drumee/
├── runtime/
│   ├── server/          # drumee-server-pod: Node.js backend
│   │   └── main/        # server-team source
│   ├── ui/              # drumee-ui-pod: LETC frontend engine
│   │   └── main/        # ui-team source
│   ├── tmp/             # temporary files (cleaned by cron)
│   └── plugins/         # third-party plugin packages
│       └── server/<endpoint>/<plugin>/
├── static/              # drumee-static: assets, locale files
└── cache/

/data/                   # user file storage (DRUMEE_DATA_DIR, MFS-managed)
└── mfs/

/etc/drumee/
├── drumee.sh            # runtime environment (sourced by server)
└── credential/          # JSON credential files (never committed)

/var/lib/drumee/
├── setup-infra/         # infra install scripts
├── setup-schemas/       # schema install scripts
└── postinstall/
    └── patch.sh         # pending patches applied at server startup

```

## Further Reading

- [Build Pipeline](./02-build-pipeline.md) — how to build packages, common flags, GPG signing
- [Shared Utilities](./10-utilities.md) — `functions.sh` and `env.sh` API reference
- [Version Management](./11-version-management.md) — changelog lifecycle, `update-changelog.sh`
- [Deployment](./12-deployment.md) — manual deployment workflow, `drumee` CLI
- Per-package deep-dives: [infra](./03-package-infra.md) · [schemas](./04-package-schemas.md) · [server](./05-package-server.md) · [ui](./06-package-ui.md) · [static](./07-package-static.md) · [schemas-patch](./08-package-schemas-patch.md) · [builder](./09-package-builder.md)
