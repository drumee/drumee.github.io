---
id: 05-plugins
title: Plugins
slug: /self-hosting/plugins
description: Install and manage server-side Drumee plugins on a self-hosted instance — Docker Compose or native.
---

# Plugins

Drumee's backend is extensible with **server plugins** — drop-in modules that add
new services under their own URL namespace. A plugin installed under endpoint
`acme` with module `hello` is reachable at:

```
/-/acme/svc/hello.<method>
```

Plugins live on disk at `/srv/drumee/runtime/plugins/server/<endpoint>/<name>` and
are managed with one CLI, identical on both channels — `drumee-ctl plugin …` for
Docker, `drumee plugin …` natively.

## Add a plugin

A plugin source can be a **git URL** (optionally pinned with `#ref`), a **local
directory**, or a **`.tgz`/`.zip`** archive.

```bash
# Docker Compose
DRUMEE_DIR=. drumee-ctl plugin add https://github.com/acme/drumee-hello.git#v1.0.0 --endpoint=acme

# Native (Debian/Ubuntu)
sudo drumee plugin add https://github.com/acme/drumee-hello.git#v1.0.0 --endpoint=acme
```

This clones/copies the source into the plugin directory, runs `npm install` if the
plugin has a `package.json`, and restarts the backend. `--endpoint` sets the
`/-/<endpoint>/` namespace (default `local`); `--name` overrides the folder name
(default: derived from the source).

## Manage plugins

```bash
drumee-ctl plugin list                 # what's installed, and enabled/disabled
drumee-ctl plugin disable acme/hello   # keep files, stop loading it
drumee-ctl plugin enable  acme/hello
drumee-ctl plugin remove  acme/hello   # delete + restart
```

(Use `drumee plugin …` on a native host.)

## Install a set reproducibly

Write a small JSON manifest and apply it — handy for rebuilding a host or keeping
several instances in sync:

```bash
cat > plugins.json <<'JSON'
[
  { "name": "hello", "endpoint": "acme", "source": "https://github.com/acme/drumee-hello.git#v1.0.0" },
  { "name": "report", "endpoint": "acme", "source": "https://github.com/acme/drumee-report.git" }
]
JSON

drumee-ctl plugin apply plugins.json
```

## How it persists across upgrades

- **Docker Compose:** the plugin directory is a **host-mounted volume**
  (`./plugins` → `/srv/drumee/runtime/plugins/server`). It survives
  `drumee-ctl upgrade` (image replacement) — your plugins are not baked into the
  image, so they aren't lost when images change.
- **Native:** plugins live on the host filesystem and persist across `apt upgrade`.

## Security & trust

:::caution Plugins run in-process
Server plugins execute **inside the backend process**, with the same privileges as
Drumee itself. Only install plugins you trust, pin them to a specific `#ref`/tag,
and review the source. Access to each plugin's services is still governed by
Drumee's per-module **ACL**, but the code itself is not sandboxed.
:::

## See also

- 🐳 **[Docker Compose guide](/self-hosting/docker-compose)**
- 📦 **[Debian / Ubuntu guide](/self-hosting/debian)**
- 🚀 **[Production & operations](/self-hosting/operations)**
